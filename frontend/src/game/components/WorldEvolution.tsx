import { useGameState } from '../context/GameStateContext';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { REGIONS } from '../data/regionData';

export function WorldEvolution() {
  const { evolutionLevel } = useGameState();
  const groupRef = useRef<THREE.Group>(null);

  // Generate deterministic crystal positions based on regions
  const crystalPositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    
    // We only spawn crystals if evolution >= 2
    if (evolutionLevel >= 2) {
      REGIONS.forEach((region) => {
        // Spawn 3-5 crystals around each region center
        const count = 3 + Math.floor(Math.random() * 3);
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          // Spawn between 10 and 30 units from the region center
          const dist = 10 + Math.random() * 20; 
          const centerX = (region.bounds.minX + region.bounds.maxX) / 2;
          const centerZ = (region.bounds.minZ + region.bounds.maxZ) / 2;
          const x = centerX + Math.cos(angle) * dist;
          const z = centerZ + Math.sin(angle) * dist;
          // y depends on terrain, assuming flat y=0 for now, but we can stick it into the ground slightly
          const y = 0.5 + Math.random() * 2; 
          
          positions.push([x, y, z]);
        }
      });
    }
    
    return positions;
  }, [evolutionLevel]);

  // Animate the crystals gently
  useFrame((state) => {
    if (groupRef.current && evolutionLevel >= 2) {
      groupRef.current.children.forEach((child, i) => {
        // Bobbing motion
        child.position.y += Math.sin(state.clock.elapsedTime * 2 + i) * 0.005;
        // Rotation
        child.rotation.y += 0.01;
      });
    }
  });

  if (evolutionLevel < 2) return null;

  return (
    <group ref={groupRef}>
      {crystalPositions.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          {/* A tall, thin crystal shape */}
          <cylinderGeometry args={[0, 0.5, 3, 4]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={0.8}
            transparent
            opacity={0.8}
            metalness={0.9}
            roughness={0.1}
          />
          {/* Point light for a glow effect on the terrain */}
          <pointLight color="#00ffff" intensity={2} distance={10} decay={2} />
        </mesh>
      ))}
    </group>
  );
}
