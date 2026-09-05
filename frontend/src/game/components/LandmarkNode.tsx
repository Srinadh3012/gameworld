import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WORLD_COORDINATES } from '../data/worldCoordinates';
import type { Landmark } from '../data/worldCoordinates';
import { useGameState } from '../context/GameStateContext';
import { Interactable } from './Interactable';

export function LandmarkNode({ landmark }: { landmark: Landmark }) {
  const { discoveredLandmarks, showInspection, unlockFastTravel, fastTravelNodes } = useGameState();
  const isDiscovered = discoveredLandmarks.includes(landmark.id);
  const isFastTravelUnlocked = fastTravelNodes.includes(landmark.id);
  
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Pulse effect
  useFrame(({ clock }) => {
    if (meshRef.current && materialRef.current) {
      const t = clock.getElapsedTime();
      meshRef.current.position.y = landmark.position[1] + 1 + Math.sin(t * 2) * 0.2;
      materialRef.current.emissiveIntensity = 0.5 + Math.sin(t * 3) * 0.5;
    }
  });

  const handleInteract = () => {
    if (!isDiscovered) {
      showInspection({
        title: 'UNKNOWN STRUCTURE',
        description: 'Something here remembers. The map has been updated.',
        type: 'LANDMARK'
      });
    } else {
      showInspection({
        title: landmark.name,
        description: landmark.description,
        type: 'LANDMARK'
      });
      if (!isFastTravelUnlocked && landmark.importance !== 'normal') {
        unlockFastTravel(landmark.id);
      }
    }
  };

  return (
    <group position={landmark.position}>
      <Interactable
        id={`interact_${landmark.id}`}
        name={isDiscovered ? landmark.name : "Unknown Structure"}
        description={isDiscovered ? "Inspect" : "Something here remembers..."}
        position={[0, 1, 0]}
        interactionDistance={10}
        onInteract={handleInteract}
      >
        {() => (
          <mesh ref={meshRef}>
            <octahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial 
              ref={materialRef}
              color={isDiscovered ? "#00f3ff" : "#555555"}
              emissive={isDiscovered ? "#00f3ff" : "#555555"}
              emissiveIntensity={0.5}
              wireframe
            />
          </mesh>
        )}
      </Interactable>
    </group>
  );
}
