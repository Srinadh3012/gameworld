import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGameState } from '../context/GameStateContext';
import { useKeyboard } from '../hooks/useKeyboard';
import * as THREE from 'three';

export interface InteractableProps {
  id: string;
  name: string;
  description: string;
  interactionType?: string;
  interactionDistance?: number;
  onInteract: () => void;
  children: (isLookedAt: boolean) => React.ReactNode;
  position: [number, number, number];
}

export function Interactable({
  id: _id,
  name,
  description: _description,
  interactionType: _interactionType,
  interactionDistance = 6,
  onInteract,
  children,
  position,
}: InteractableProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const { setActiveInteraction, activeInteraction } = useGameState();
  const keys = useKeyboard();

  const isInRangeRef = useRef(false);
  const wasInteractPressedRef = useRef(false);
  const activeInteractionRef = useRef(activeInteraction);
  activeInteractionRef.current = activeInteraction;

  // We use state for visual feedback so the child can render glowing
  const [isLookedAt, setIsLookedAt] = useState(false);

  // Raycaster for look-at detection
  const raycaster = useRef(new THREE.Raycaster());

  useFrame(() => {
    if (!groupRef.current) return;

    // 1. Distance Check
    const distance = camera.position.distanceTo(groupRef.current.position);
    const inRange = distance <= interactionDistance;

    // 2. Look-at Check
    let lookedAt = false;
    if (inRange) {
      raycaster.current.setFromCamera(new THREE.Vector2(0, 0), camera);
      // Create a bounding sphere for this object
      const sphere = new THREE.Sphere(groupRef.current.position, 2.5);
      const intersect = raycaster.current.ray.intersectSphere(sphere, new THREE.Vector3());
      if (intersect) lookedAt = true;
    }

    if (lookedAt !== isLookedAt) {
      setIsLookedAt(lookedAt);
    }

    // 3. Set Active Interaction only if looked at AND in range
    const shouldBeActive = inRange && lookedAt;

    if (shouldBeActive && !isInRangeRef.current) {
      isInRangeRef.current = true;
      setActiveInteraction(name);
    } else if (!shouldBeActive && isInRangeRef.current) {
      isInRangeRef.current = false;
      if (activeInteractionRef.current === name) {
        setActiveInteraction(null);
      }
    }

    // 4. Trigger interaction
    const k = keys.current;
    if (shouldBeActive && k.interact && !wasInteractPressedRef.current) {
      onInteract();
    }
    wasInteractPressedRef.current = k.interact;
  });

  return (
    <group ref={groupRef} position={new THREE.Vector3(...position)}>
      {children(isLookedAt)}

      {/* Proximity highlight ring */}
      {isLookedAt && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
          <ringGeometry args={[2.2, 2.5, 48]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

