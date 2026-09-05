import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Interactable } from './Interactable';
import { useGameState } from '../context/GameStateContext';

export function WorldCore({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  
  const { markCoreActivated, explorationCount, evolutionLevel, progression, showNotification, awardXP } = useGameState();
  const isActivated = explorationCount.coreActivated;
  const hasCoreResonance = progression.unlockedAbilities.includes('ability_core_resonance');

  // Determine colors based on evolution
  const coreColor = evolutionLevel >= 2 ? '#ff00ff' : '#00ffff';
  const intensityMultiplier = evolutionLevel >= 2 ? 1.5 : 1;

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (meshRef.current) {
      meshRef.current.position.y = 4 + Math.sin(time) * 0.5;
      meshRef.current.rotation.y = time * 0.5;
      
      if (isActivated) {
        const material = meshRef.current.material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = (2 + Math.sin(time * 3)) * intensityMultiplier;
      }
    }

    if (ringRef1.current && ringRef2.current) {
      ringRef1.current.position.y = 4 + Math.sin(time + 1) * 0.2;
      ringRef2.current.position.y = 4 + Math.sin(time + 2) * 0.2;
      
      ringRef1.current.rotation.x = time;
      ringRef1.current.rotation.y = time * 0.5;
      
      ringRef2.current.rotation.x = -time * 0.8;
      ringRef2.current.rotation.y = time * 0.3;
    }
  });

  const handleInteract = () => {
    if (!isActivated) {
      markCoreActivated();
      awardXP(500, 'CORE_ACTIVATION', 'core_primary');
    } else {
      // Phase 12 logic
      if (!hasCoreResonance) {
        showNotification('CORE RESONANCE REQUIRED', 'You sense deeper structures but cannot interface with them yet.');
      } else {
        showNotification('RESONANCE ACHIEVED', 'You have interfaced deeply with the World Core.');
        awardXP(1000, 'WORLD_IMPACT', 'core_resonance');
      }
    }
  };

  const statusText = isActivated 
    ? (evolutionLevel >= 2 ? "EVOLVING..." : "SYNCHRONIZED") 
    : "DORMANT";

  return (
    <group position={position}>
      {/* Central Core Object */}
      <mesh ref={meshRef} castShadow>
        <octahedronGeometry args={[2, 0]} />
        <meshStandardMaterial 
          color="#111" 
          metalness={0.9} 
          roughness={0.1}
          emissive={coreColor}
          emissiveIntensity={isActivated ? 2 * intensityMultiplier : 0.2}
          wireframe={!isActivated}
        />
      </mesh>

      {/* Orbiting Rings */}
      <mesh ref={ringRef1}>
        <torusGeometry args={[3, 0.05, 16, 100]} />
        <meshStandardMaterial color={coreColor} emissive={coreColor} emissiveIntensity={isActivated ? 1 * intensityMultiplier : 0} />
      </mesh>
      
      <mesh ref={ringRef2}>
        <torusGeometry args={[4, 0.02, 16, 100]} />
        <meshStandardMaterial color={coreColor} emissive={coreColor} emissiveIntensity={isActivated ? 0.5 * intensityMultiplier : 0} />
      </mesh>

      {/* Core Light */}
      <pointLight 
        position={[0, 4, 0]} 
        color={coreColor} 
        intensity={isActivated ? 50 * intensityMultiplier : 5} 
        distance={30} 
        decay={2} 
      />

      {/* Base Structure */}
      <mesh position={[0, 0.5, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[4, 5, 1, 8]} />
        <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
      </mesh>

      <Interactable
        id="world_core"
        name={isActivated ? (hasCoreResonance ? "Core Interface (Resonance)" : "Core Interface (Locked)") : "World Core"}
        description={isActivated ? "Interface with the core's deeper functions." : "The heart of the sector."}
        interactionDistance={8}
        position={[0, 2, 0]}
        onInteract={handleInteract}
      >
        {() => (
          <mesh visible={false}>
            <boxGeometry args={[6, 6, 6]} />
            <meshBasicMaterial />
          </mesh>
        )}
      </Interactable>

      {/* Floating Status UI */}
      <Html position={[0, 8, 0]} center className="pointer-events-none">
        <div className="flex flex-col items-center">
          <div className="px-4 py-1 bg-black/50 border border-game-neon/30 backdrop-blur-md rounded-full text-game-neon text-xs font-mono uppercase tracking-widest shadow-[0_0_15px_rgba(0,243,255,0.2)]">
            World Core
          </div>
          <div className="mt-2 text-white/50 text-[10px] font-mono tracking-widest">
            STATUS: <span className={isActivated ? "text-game-purple" : "text-gray-500"}>{statusText}</span>
          </div>
        </div>
      </Html>
    </group>
  );
}
