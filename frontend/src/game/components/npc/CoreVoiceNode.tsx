import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameState } from '../../context/GameStateContext';
import { Interactable } from '../Interactable';
import type { NPCDefinition } from '../../data/npcData';

interface CoreVoiceNodeProps {
  npc: NPCDefinition;
}

export function CoreVoiceNode({ npc }: CoreVoiceNodeProps) {
  const meshRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  const { startDialogue, activeDialogue, worldEnergy } = useGameState();
  const [hovered, setHovered] = useState(false);

  // Core energy pulsation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = npc.defaultPosition[1] + Math.sin(state.clock.elapsedTime) * 0.5;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      ringRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      
      // Pulse scale based on world energy
      const scaleBase = 1 + (worldEnergy / 100) * 0.5;
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.1;
      ringRef.current.scale.setScalar(scaleBase + pulse);
    }
  });

  const handleInteract = () => {
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
        position={[0, 0, 0]}
        interactionDistance={15}
        onInteract={handleInteract}
      >
        {(isLookedAt) => {
          if (hovered !== isLookedAt) setHovered(isLookedAt);
          
          return (
            <group>
              {/* Inner Core */}
              <mesh castShadow>
                <octahedronGeometry args={[1, 0]} />
                <meshStandardMaterial 
                  color="#ffffff" 
                  emissive="#ffffff"
                  emissiveIntensity={isTalking ? 2 : 0.8}
                  wireframe
                />
              </mesh>
              
              {/* Energy Ring */}
              <mesh ref={ringRef}>
                <torusGeometry args={[2, 0.05, 16, 100]} />
                <meshStandardMaterial 
                  color="#ffffff" 
                  emissive="#aaffff"
                  emissiveIntensity={1}
                  transparent
                  opacity={0.6}
                />
              </mesh>
              
              {/* Voice Nameplate */}
              <Html position={[0, 3, 0]} center zIndexRange={[100, 0]} distanceFactor={25}>
                <div 
                  className={`flex flex-col items-center pointer-events-none transition-opacity duration-1000 ${
                    hovered || isTalking ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <span 
                    className="font-display font-black tracking-[0.5em] text-xl drop-shadow-md"
                    style={{ color: npc.color, textShadow: '0 0 20px #ffffff' }}
                  >
                    {npc.name}
                  </span>
                  
                  {isTalking && (
                    <div className="mt-4 flex gap-2">
                      <div className="w-1 h-6 bg-white animate-pulse" style={{ animationDelay: '0s', animationDuration: '0.3s' }} />
                      <div className="w-1 h-10 bg-white animate-pulse" style={{ animationDelay: '0.1s', animationDuration: '0.4s' }} />
                      <div className="w-1 h-6 bg-white animate-pulse" style={{ animationDelay: '0.2s', animationDuration: '0.3s' }} />
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
