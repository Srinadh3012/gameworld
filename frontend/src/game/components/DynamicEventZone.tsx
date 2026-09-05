import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameState } from '../context/GameStateContext';
import { EventPanel } from '../ui/EventPanel';
import { eventSystem } from '../systems/EventSystem';
import { Interactable } from './Interactable';

interface DynamicEventZoneProps {
  eventId: string;
  position: [number, number, number];
  triggerRadius?: number;
  color?: string;
  icon?: React.ReactNode;
}

export function DynamicEventZone({ 
  eventId, 
  position, 
  triggerRadius = 15,
  color = '#00f3ff'
}: DynamicEventZoneProps) {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  const { 
    discoverEvent, 
    completeEvent,
    activeEvents, 
    completedEvents
  } = useGameState();

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  // Determine local status
  const isCompleted = completedEvents.includes(eventId);
  const isActive = activeEvents.includes(eventId);
  
  // Check system status for overall availability
  const systemStatus = eventSystem.getStatus(eventId);
  const isLocked = systemStatus === 'LOCKED';

  // Do not render anything if locked or completed (or we can render a subtle completed marker)
  if (isLocked) return null;

  useFrame((state) => {
    if (!groupRef.current || isCompleted || isActive) return;

    const time = state.clock.elapsedTime;
    
    // Animate marker
    if (ringRef.current) {
      ringRef.current.rotation.x = -Math.PI / 2;
      ringRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.1);
    }

    // Distance check
    const distance = camera.position.distanceTo(groupRef.current.position);
    
    if (distance < triggerRadius && !hasTriggered) {
      setHasTriggered(true);
      const wasNew = discoverEvent(eventId);
      if (wasNew) {
        setIsPanelOpen(true);
      }
    } else if (distance >= triggerRadius && hasTriggered) {
      setHasTriggered(false);
      setIsPanelOpen(false);
    }
  });

  if (isCompleted) {
    return null; // For now, completed events vanish. Could add a faint static marker instead.
  }

  return (
    <group position={new THREE.Vector3(...position)} ref={groupRef}>
      {!isActive && !isCompleted && (
        <>
          {/* Subtle Ground Marker */}
          <mesh ref={ringRef} position={[0, 0.1, 0]}>
            <ringGeometry args={[2, 2.2, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
          </mesh>
          
          {/* Vertical light pillar */}
          <mesh position={[0, 5, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 10, 8]} />
            <meshBasicMaterial color={color} transparent opacity={0.3} />
          </mesh>
          <pointLight color={color} intensity={2} distance={20} position={[0, 2, 0]} />
        </>
      )}

      {/* HTML Overlay Panel for Discovery */}
      {isPanelOpen && !isActive && !isCompleted && (
        <Html center className="pointer-events-auto">
          <EventPanel eventId={eventId} onClose={() => setIsPanelOpen(false)} />
        </Html>
      )}

      {/* Interaction Volume for Completion when Active */}
      {isActive && (
        <Interactable
          id={`complete_evt_${eventId}`}
          name="Event Objective"
          description="Complete the objective."
          position={[0, 1.5, 0]}
          interactionDistance={6}
          onInteract={() => completeEvent(eventId)}
        >
          {() => (
            <mesh>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={2} wireframe />
            </mesh>
          )}
        </Interactable>
      )}
    </group>
  );
}
