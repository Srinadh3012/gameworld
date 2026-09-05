import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameState } from '../../context/GameStateContext';
import { Interactable } from '../Interactable';
import type { NPCDefinition } from '../../data/npcData';
import { CompanionNavigation } from '../../systems/CompanionNavigation';
import { evaluateCompanionState, INITIAL_COMPANION_FSM } from '../../systems/CompanionStateMachine';
import { companionManager } from '../../systems/CompanionManager';

interface NPCNodeProps {
  npc: NPCDefinition;
}

export function NPCNode({ npc }: NPCNodeProps) {
  const meshRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  
  const { startDialogue, activeDialogue, playerName, activeCompanion, activeEvents, unlockAchievement, currentRegion, discoveredLandmarks, evolutionLevel } = useGameState();
  const [hovered, setHovered] = useState(false);
  const [fsm, setFsm] = useState(INITIAL_COMPANION_FSM);
  const [commentary, setCommentary] = useState<string | null>(null);
  const commentaryTimeout = useRef<any>(null);

  const isCompanion = activeCompanion === npc.id;

  const showCommentary = (text: string) => {
    setCommentary(text);
    if (commentaryTimeout.current) clearTimeout(commentaryTimeout.current);
    commentaryTimeout.current = setTimeout(() => setCommentary(null), 5000);
  };

  // React to world changes
  React.useEffect(() => {
    if (!isCompanion) return;
    
    if (currentRegion) {
      const text = companionManager.getContextualCommentary(npc.id, 'REGION', currentRegion.id, evolutionLevel);
      if (text) showCommentary(text);
    }
  }, [currentRegion, isCompanion, npc.id, evolutionLevel]);

  React.useEffect(() => {
    if (!isCompanion) return;
    const latestLandmark = discoveredLandmarks[discoveredLandmarks.length - 1];
    if (latestLandmark) {
      const text = companionManager.getContextualCommentary(npc.id, 'LANDMARK', latestLandmark, evolutionLevel);
      if (text) showCommentary(text);
    }
  }, [discoveredLandmarks, isCompanion, npc.id, evolutionLevel]);

  // Subtle idle animation and follow logic
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    if (isCompanion) {
      // Logic for active companion
      const playerPos = state.camera.position; // Approximation of player pos in first person
      const currentPos = meshRef.current.position;
      const distance = currentPos.distanceTo(playerPos);
      
      const newFsm = evaluateCompanionState(
        fsm, distance, activeDialogue !== null, activeEvents.length > 0 ? activeEvents[0] : null, null
      );
      
      if (JSON.stringify(newFsm) !== JSON.stringify(fsm)) {
        setFsm(newFsm);
      }
      
      if (newFsm.currentState === 'FOLLOWING') {
        const nextPos = CompanionNavigation.getNextPosition(currentPos, playerPos, 5, 4, delta);
        meshRef.current.position.lerp(nextPos, 0.1);
        meshRef.current.lookAt(playerPos.x, meshRef.current.position.y, playerPos.z);
        if (distance > 50) {
           meshRef.current.position.copy(nextPos); // Teleport catchup
        }
      } else {
        // Look at player slightly
        meshRef.current.lookAt(playerPos.x, meshRef.current.position.y, playerPos.z);
      }
    } else {
      // Idle logic for non-companion
      meshRef.current.position.y = npc.defaultPosition[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      }
    }
  });

  const handleInteract = () => {
    // Only start dialogue if not already in one
    if (!activeDialogue) {
      startDialogue(npc.id);
    }
  };

  const isTalking = activeDialogue?.npc.id === npc.id;

  return (
    <group ref={meshRef} position={npc.defaultPosition}>
      <Interactable
        id={`interact_${npc.id}`}
        name={npc.name}
        description={npc.title}
        position={[0, 1.5, 0]}
        interactionDistance={8}
        onInteract={handleInteract}
      >
        {(isLookedAt) => {
          // Sync hover state for styling
          if (hovered !== isLookedAt) setHovered(isLookedAt);
          
          return (
            <group>
              {/* Body Placeholder (Capsule) */}
              <mesh position={[0, 1, 0]} castShadow>
                <capsuleGeometry args={[0.4, 1, 4, 16]} />
                <meshStandardMaterial 
                  color={npc.color} 
                  roughness={0.7} 
                  metalness={0.2} 
                  emissive={isTalking ? npc.color : '#000000'}
                  emissiveIntensity={0.2}
                />
              </mesh>
              
              {/* Head Placeholder */}
              <mesh ref={headRef} position={[0, 1.9, 0]} castShadow>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial color={npc.color} roughness={0.5} metalness={0.3} />
              </mesh>
              
              {/* Nameplate */}
              <Html position={[0, 2.5, 0]} center zIndexRange={[100, 0]} distanceFactor={15}>
                <div 
                  className={`flex flex-col items-center pointer-events-none transition-opacity duration-300 ${
                    hovered || isTalking ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  <span 
                    className="font-display font-black tracking-widest text-lg drop-shadow-md"
                    style={{ color: npc.color, textShadow: `0 0 10px ${npc.color}` }}
                  >
                    {npc.name}
                  </span>
                  <span className="text-white text-[10px] font-mono tracking-widest uppercase bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10 mt-1">
                    {npc.title}
                  </span>
                  
                  {isTalking && (
                    <div className="mt-2 flex gap-1">
                      <div className="w-1 h-1 rounded-full bg-white animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-1 h-1 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1 h-1 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  )}
                  {isCompanion && !isTalking && commentary && (
                    <div className="mt-2 text-xs bg-black/80 px-2 py-1 rounded text-white font-sans max-w-[200px] text-center border border-white/20 whitespace-normal shadow-lg">
                      {commentary}
                    </div>
                  )}
                  {isCompanion && !isTalking && !commentary && (
                    <div className="mt-2 text-[8px] bg-black/60 px-1 py-0.5 rounded text-gray-400 font-mono tracking-widest uppercase">
                      {fsm.currentState}
                    </div>
                  )}
                </div>
              </Html>
            </group>
          );
        }}
      </Interactable>
    </group>
  );
}
