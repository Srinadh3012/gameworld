import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh } from 'three';
import { Interactable } from './Interactable';
import { useGameState } from '../context/GameStateContext';

export function WorldForge({ position }: { position: [number, number, number] }) {
  const group = useRef<Group>(null);
  const ring1 = useRef<Mesh>(null);
  const ring2 = useRef<Mesh>(null);
  const { setCraftingOpen } = useGameState();

  useFrame(({ clock }) => {
    if (ring1.current && ring2.current) {
      const t = clock.elapsedTime;
      ring1.current.rotation.x = Math.sin(t * 0.5) * 0.2;
      ring1.current.rotation.z = t * 0.8;
      
      ring2.current.rotation.x = Math.cos(t * 0.4) * 0.2;
      ring2.current.rotation.y = t * 0.5;
      ring2.current.rotation.z = -t * 0.6;
    }
  });

  return (
    <group ref={group} position={position}>
      <Interactable
        id="world_forge"
        name="WORLD FORGE"
        description="USE"
        interactionDistance={4}
        position={position}
        onInteract={() => setCraftingOpen(true)}
      >
        {(isLookedAt) => (
          <group position={[0, 1.5, 0]}>
            <mesh>
              <cylinderGeometry args={[1, 1.2, 0.2, 8]} />
              <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 1, 0]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={isLookedAt ? 3 : 2} />
            </mesh>
            
            <mesh ref={ring1} position={[0, 1, 0]}>
              <torusGeometry args={[0.8, 0.05, 16, 32]} />
              <meshStandardMaterial color="#fff" metalness={1} roughness={0.1} />
            </mesh>
            <mesh ref={ring2} position={[0, 1, 0]}>
              <torusGeometry args={[1.2, 0.03, 16, 32]} />
              <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={0.5} wireframe />
            </mesh>
            
            <pointLight color="#00f3ff" intensity={2} distance={8} position={[0, 1, 0]} />
          </group>
        )}
      </Interactable>
    </group>
  );
}
