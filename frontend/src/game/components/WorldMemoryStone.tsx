import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Interactable } from './Interactable';
import { useMemorySystem } from '../systems/MemorySystem';
import { useGameState } from '../context/GameStateContext';
import * as THREE from 'three';

interface WorldMemoryStoneProps {
  position: [number, number, number];
  stoneId: string;
  requiresMemoryLink?: boolean;
}

export function WorldMemoryStone({ position, stoneId, requiresMemoryLink = false }: WorldMemoryStoneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const outerMeshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const [isDiscovered, setIsDiscovered] = useState(false);

  const { handleMemoryDiscovery } = useMemorySystem();
  const { progression, showNotification } = useGameState();
  const hasWorldSense = progression.unlockedAbilities.includes('ability_world_sense');
  const hasMemoryLink = progression.unlockedAbilities.includes('ability_memory_link');
  
  // For the extraction visual effect
  const effectTime = useRef(0);
  const effectActive = useRef(false);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    if (meshRef.current && outerMeshRef.current) {
      // Gentle floating animation
      const yOffset = Math.sin(t * 2 + position[0]) * 0.1;
      meshRef.current.position.y = yOffset;
      outerMeshRef.current.position.y = yOffset;

      // Rotation
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.z = Math.sin(t * 0.5) * 0.1;
      outerMeshRef.current.rotation.y -= 0.005;
      
      // Extraction effect animation
      if (effectActive.current) {
        effectTime.current += delta;
        if (effectTime.current < 1.0) {
          const scale = 1.0 + Math.sin(effectTime.current * Math.PI) * 0.5;
          meshRef.current.scale.setScalar(scale);
          outerMeshRef.current.scale.setScalar(scale * 1.2);
          
          if (lightRef.current) {
            lightRef.current.intensity = 2 + Math.sin(effectTime.current * Math.PI) * 3;
          }
        } else {
          effectActive.current = false;
          meshRef.current.scale.setScalar(1);
          outerMeshRef.current.scale.setScalar(1.2);
          if (lightRef.current) lightRef.current.intensity = 1.0;
        }
      }
    }
  });

  const handleInteract = () => {
    if (!isDiscovered) {
      if (requiresMemoryLink && !hasMemoryLink) {
        showNotification('ACCESS DENIED', 'This memory requires the MEMORY LINK ability to decode.');
        return;
      }
      setIsDiscovered(true);
      effectActive.current = true;
      effectTime.current = 0;
      handleMemoryDiscovery(stoneId, position);
    }
  };

  return (
    <Interactable
      id={stoneId}
      name="World Memory"
      description="A fragment of the world's past."
      interactionDistance={5}
      position={position}
      onInteract={handleInteract}
    >
      {(isLookedAt) => (
        <group>
          {/* Main solid crystal */}
          <mesh ref={meshRef}>
            <dodecahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial 
              color={isDiscovered ? "#00f3ff" : (requiresMemoryLink ? "#ff0055" : "#8a2be2")} 
              emissive={isDiscovered ? "#00f3ff" : (requiresMemoryLink ? "#ff0055" : "#8a2be2")}
              emissiveIntensity={(isLookedAt || hasWorldSense) ? 1.5 : (isDiscovered ? 0.8 : 0.4)}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>

          {/* Outer glowing wireframe shell */}
          <mesh ref={outerMeshRef} scale={1.2}>
            <dodecahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial 
              color={isDiscovered ? "#ffffff" : "#00f3ff"} 
              emissive={isDiscovered ? "#00f3ff" : "#00f3ff"}
              emissiveIntensity={isLookedAt ? 1.0 : 0.5}
              wireframe 
              transparent 
              opacity={0.3}
            />
          </mesh>

          {/* Point light for glow */}
          <pointLight 
            ref={lightRef}
            color={isDiscovered ? "#00f3ff" : (requiresMemoryLink ? "#ff0055" : "#8a2be2")} 
            intensity={(isLookedAt || hasWorldSense) ? 1.5 : 1.0} 
            distance={hasWorldSense ? 15 : 10} 
            position={[0, 0, 0]} 
          />
        </group>
      )}
    </Interactable>
  );
}
