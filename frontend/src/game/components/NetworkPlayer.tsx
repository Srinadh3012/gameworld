import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface NetworkPlayerProps {
  player: {
    uid: string;
    username: string;
    title: string;
    level: number;
    position?: [number, number, number];
    rotation?: [number, number, number];
    state?: string;
  };
}

export function NetworkPlayer({ player }: NetworkPlayerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pos = player.position || [0, 0, 0];
  const rot = player.rotation || [0, 0, 0];

  useFrame(() => {
    if (groupRef.current) {
      // Direct assignment here because MultiplayerManager handles interpolation
      // and updates the player object reference values over time
      groupRef.current.position.set(pos[0], pos[1], pos[2]);
      groupRef.current.rotation.set(rot[0], rot[1], rot[2]);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Simple Avatar Representation */}
      <mesh position={[0, 1, 0]}>
        <capsuleGeometry args={[0.4, 1, 4, 8]} />
        <meshStandardMaterial color="#00f0ff" wireframe={player.state === 'SPRINT'} opacity={0.6} transparent />
      </mesh>
      
      {/* Nameplate */}
      <Html position={[0, 2.2, 0]} center zIndexRange={[100, 0]}>
        <div className="flex flex-col items-center justify-center pointer-events-none select-none">
          <div className="text-cyan-400 font-bold text-xs tracking-wider" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
            {player.username}
          </div>
          <div className="text-gray-300 text-[10px] tracking-widest" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
            {player.title} <span className="text-amber-400">Lv.{player.level}</span>
          </div>
        </div>
      </Html>
    </group>
  );
}
