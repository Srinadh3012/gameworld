import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { useKeyboard } from '../hooks/useKeyboard';
import { useGameState } from '../context/GameStateContext';
import { updateStamina, MIN_STAMINA_TO_SPRINT } from '../systems/StaminaSystem';
import { COLLISION_OBSTACLES } from '../data/regionData';
import { isPositionBlockedByObstacle, lerpNumber } from '../utils/gameHelpers';
import { explorationSystem } from '../systems/ExplorationSystem';
import { multiplayerManager } from '../multiplayer/MultiplayerManager';

// Constants
const SPEED_WALK = 6.0;
const SPEED_RUN = 13.0;
const SPEED_CROUCH = 3.0;
const JUMP_FORCE = 9.0;
const GRAVITY = 25.0;
const ACCEL = 10.0;
const AIR_ACCEL = 3.0;
const HEIGHT_STAND = 1.7;
const HEIGHT_CROUCH = 0.95;

export function Player() {
  const { camera } = useThree();
  const keys = useKeyboard();
  const { isPaused, setPaused, setStamina, discoveredLandmarks, discoverLandmark } = useGameState();
  const controlsRef = useRef<any>(null);

  // Physics state
  const velocity = useRef(new THREE.Vector3());
  const isGrounded = useRef(false);
  const isPausedRef = useRef(isPaused);
  const currentStamina = useRef(100);
  const canSprint = useRef(true);
  
  // Phase 12: Aether Step logic
  const dashVelocity = useRef(new THREE.Vector3());
  const isDashing = useRef(false);
  const dashTimeLeft = useRef(0);

  // Animation state for bobbing
  const bobTime = useRef(0);
  const currentBobAmp = useRef(0);

  // State enum tracker (for logging or future animation states)
  // 'IDLE' | 'WALKING' | 'RUNNING' | 'CROUCHING' | 'JUMPING' | 'FALLING'
  const playerState = useRef('IDLE');
  
  // Map Exploration
  const lastExplorationCheck = useRef(0);
  
  // Phase 19: Network Sync
  const lastNetworkSync = useRef(0);

  useEffect(() => {
    isPausedRef.current = isPaused;
    if (isPaused && controlsRef.current?.isLocked) {
      controlsRef.current.unlock();
    }
  }, [isPaused]);

  useEffect(() => {
    const handleLock = () => setPaused(false);
    const handleUnlock = () => setPaused(true);
    const ctrl = controlsRef.current;
    if (ctrl) {
      ctrl.addEventListener('lock', handleLock);
      ctrl.addEventListener('unlock', handleUnlock);
    }
    return () => {
      if (ctrl) {
        ctrl.removeEventListener('lock', handleLock);
        ctrl.removeEventListener('unlock', handleUnlock);
      }
    };
  }, [setPaused]);

  // Phase 12: Ability listener
  useEffect(() => {
    const handleAbility = (e: any) => {
      const { abilityId } = e.detail;
      if (abilityId === 'ability_aether_step') {
        // Trigger dash
        isDashing.current = true;
        dashTimeLeft.current = 0.2; // 200ms dash
        currentStamina.current = Math.max(0, currentStamina.current - 15);
        setStamina(currentStamina.current); // costs stamina
        
        // Dash forward
        dashVelocity.current.set(0, 0, -35); // Initial burst forward relative to camera
      }
    };
    window.addEventListener('gw_ability_used', handleAbility);
    return () => window.removeEventListener('gw_ability_used', handleAbility);
  }, [setStamina]);

  // Sync stamina to React state rarely (2Hz) to avoid re-render spam
  useEffect(() => {
    const interval = setInterval(() => {
      setStamina(Math.round(currentStamina.current));
    }, 500);
    return () => clearInterval(interval);
  }, [setStamina]);

  useFrame((_state, delta) => {
    if (isPausedRef.current || !controlsRef.current?.isLocked) return;

    // Cap delta to prevent large physics jumps if tab was inactive
    const dt = Math.min(delta, 0.1);
    const k = keys.current;

    // 1. Resolve Intents
    const moveZ = Number(k.forward) - Number(k.backward);
    const moveX = Number(k.right) - Number(k.left);
    const isMoving = moveZ !== 0 || moveX !== 0;

    // Stamina logic
    if (currentStamina.current <= 0) canSprint.current = false;
    if (currentStamina.current >= MIN_STAMINA_TO_SPRINT) canSprint.current = true;
    const isSprinting = isMoving && k.sprint && canSprint.current && !k.crouch && isGrounded.current;

    currentStamina.current = updateStamina(currentStamina.current, isSprinting, dt);

    // 2. Determine Speed & Target Velocity
    let targetSpeed = 0;
    if (isMoving) {
      if (k.crouch) targetSpeed = SPEED_CROUCH;
      else if (isSprinting) targetSpeed = SPEED_RUN;
      else targetSpeed = SPEED_WALK;
    }

    // Phase 12: Dash overrides
    if (isDashing.current) {
      dashTimeLeft.current -= dt;
      if (dashTimeLeft.current <= 0) {
        isDashing.current = false;
      }
    }

    // Determine state (for bobbing logic)
    if (!isGrounded.current) {
      playerState.current = velocity.current.y > 0 ? 'JUMPING' : 'FALLING';
    } else if (k.crouch) {
      playerState.current = isMoving ? 'CROUCHING' : 'IDLE';
    } else if (isMoving) {
      playerState.current = isSprinting ? 'RUNNING' : 'WALKING';
    } else {
      playerState.current = 'IDLE';
    }

    // 3. Horizontal Physics (Acceleration-based movement)
    const accelRate = isGrounded.current ? ACCEL : AIR_ACCEL;
    
    // We compute local movement vector
    const dir = new THREE.Vector3(moveX, 0, moveZ).normalize().multiplyScalar(targetSpeed);
    
    // Lerp current velocity towards target velocity
    velocity.current.x = lerpNumber(velocity.current.x, dir.x, accelRate * dt);
    velocity.current.z = lerpNumber(velocity.current.z, dir.z, accelRate * dt);

    // 4. Vertical Physics
    velocity.current.y -= GRAVITY * dt;

    if (k.jump && isGrounded.current && !k.crouch) {
      velocity.current.y = JUMP_FORCE;
      isGrounded.current = false;
    }

    // 5. Apply Movement to Camera Position
    const prevPos = camera.position.clone();

    // Move forward/right relative to camera yaw
    controlsRef.current.moveRight(-velocity.current.x * dt);
    controlsRef.current.moveForward(-velocity.current.z * dt);
    
    // Apply Dash
    if (isDashing.current) {
      controlsRef.current.moveRight(dashVelocity.current.x * dt);
      controlsRef.current.moveForward(-dashVelocity.current.z * dt);
    }
    
    // Y-axis movement
    camera.position.y += velocity.current.y * dt;

    // 6. Collision & Ground Resolution
    const targetHeight = k.crouch ? HEIGHT_CROUCH : HEIGHT_STAND;

    // Simple ground
    if (camera.position.y < targetHeight) {
      velocity.current.y = 0;
      camera.position.y = targetHeight;
      isGrounded.current = true;
    } else if (camera.position.y > targetHeight + 0.1) {
      // Just a small tolerance, otherwise we are in air
      isGrounded.current = false;
    }

    // Simple AABB Obstacle Collision
    if (isPositionBlockedByObstacle(camera.position.x, camera.position.z, COLLISION_OBSTACLES)) {
      // Revert XZ movement
      camera.position.x = prevPos.x;
      camera.position.z = prevPos.z;
    }

    // 7. World Bounds
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -200, 200);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -200, 200);

    // 7.5 Map Exploration Ping (Throttle to roughly 2Hz)
    lastExplorationCheck.current += dt;
    if (lastExplorationCheck.current > 0.5) {
      lastExplorationCheck.current = 0;
      const discovered = explorationSystem.checkLandmarkProximity([camera.position.x, camera.position.y, camera.position.z], discoveredLandmarks);
      if (discovered) {
        discoverLandmark(discovered.id);
      }
    }

    // 8. Camera Polish (Bob & FOV)
    // Dynamic FOV for sprint
    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    const targetFov = isSprinting ? 88 : 80;
    perspectiveCamera.fov = lerpNumber(perspectiveCamera.fov, targetFov, 10 * dt);
    perspectiveCamera.updateProjectionMatrix();

    // Camera Bob
    const bobTarget = (playerState.current === 'RUNNING') ? 0.08 : (playerState.current === 'WALKING' ? 0.04 : 0);
    currentBobAmp.current = lerpNumber(currentBobAmp.current, bobTarget, 10 * dt);

    if (currentBobAmp.current > 0.001 && isGrounded.current) {
      const bobFreq = playerState.current === 'RUNNING' ? 12 : 8;
      bobTime.current += dt * bobFreq;
      const bobOffset = Math.sin(bobTime.current) * currentBobAmp.current;
      camera.position.y += bobOffset;
    } else {
      bobTime.current = 0;
    }

    // 9. Network Sync (10Hz)
    lastNetworkSync.current += dt;
    if (lastNetworkSync.current > 0.1) {
      lastNetworkSync.current = 0;
      // Convert Euler to array
      const rot = [camera.rotation.x, camera.rotation.y, camera.rotation.z] as [number, number, number];
      const pos = [camera.position.x, camera.position.y, camera.position.z] as [number, number, number];
      
      let stateStr = 'IDLE';
      if (playerState.current === 'RUNNING') stateStr = 'SPRINT';
      else if (playerState.current === 'WALKING' || playerState.current === 'CROUCHING') stateStr = 'WALK';
      
      multiplayerManager.emitMovement(pos, rot, stateStr);
    }
  });

  return <PointerLockControls ref={controlsRef} />;
}
