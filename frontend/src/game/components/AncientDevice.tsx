import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Interactable } from './Interactable';
import { useGameState } from '../context/GameStateContext';
import { worldActionSystem } from '../systems/WorldActionSystem';
import { ChoiceModal } from '../ui/ChoiceModal';

export function AncientDevice({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  
  const { worldChoices, recordChoice, updateWorldState, showNotification, setPaused } = useGameState();
  const [isModalOpen, setModalOpen] = useState(false);
  
  const hasMadeChoice = !!worldChoices['ancient_device'];
  const choiceMade = worldChoices['ancient_device'];

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
    if (coreRef.current) {
      coreRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      coreRef.current.rotation.y = state.clock.elapsedTime * 0.8;
      
      // Pulse if awakened
      if (choiceMade === 'AWAKEN') {
        const pulse = (Math.sin(state.clock.elapsedTime * 3) + 1) / 2;
        (coreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1 + pulse * 2;
      }
    }
  });

  const handleInteract = () => {
    if (hasMadeChoice) {
      showNotification('ANCIENT DEVICE', `It remembers your choice: ${choiceMade}`);
      return;
    }
    
    setModalOpen(true);
    setPaused(true); // Pause game while choosing
  };

  const handleSelectChoice = async (optionId: string) => {
    setModalOpen(false);
    setPaused(false);
    
    recordChoice('ancient_device', optionId);
    
    let impactDelta = 0;
    if (optionId === 'AWAKEN') {
      impactDelta = await worldActionSystem.recordAction({
        worldId: 'sector-alpha-01',
        playerId: 'local-player',
        actionType: 'MAKE_WORLD_CHOICE',
        location: position,
        metadata: { choiceId: 'ancient_device', selection: 'AWAKEN' }
      });
      updateWorldState(impactDelta, 20, -10); // Increases energy, decreases stability
      showNotification('WORLD STATE CHANGED', 'The device awakens. World Energy surges.');
    } else {
      impactDelta = await worldActionSystem.recordAction({
        worldId: 'sector-alpha-01',
        playerId: 'local-player',
        actionType: 'MAKE_WORLD_CHOICE',
        location: position,
        metadata: { choiceId: 'ancient_device', selection: 'DORMANT' }
      });
      updateWorldState(impactDelta, -10, 20); // Decreases energy, increases stability
      showNotification('WORLD STATE CHANGED', 'The device slumbers. World Stability increases.');
    }
  };

  const deviceColor = choiceMade === 'AWAKEN' ? '#ff4500' : (choiceMade === 'DORMANT' ? '#4169e1' : '#ffaa00');

  return (
    <group position={position}>
      {/* Visuals */}
      <mesh ref={meshRef} position={[0, 2, 0]} castShadow>
        <octahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial 
          color="#333" 
          metalness={0.9} 
          roughness={0.1}
          wireframe={!hasMadeChoice}
        />
      </mesh>
      
      <mesh ref={coreRef} position={[0, 2, 0]}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial 
          color={deviceColor}
          emissive={deviceColor}
          emissiveIntensity={hasMadeChoice ? 2 : 0.5}
          toneMapped={false}
        />
      </mesh>

      {/* Floating particles or rings could go here */}
      <mesh position={[0, 0.1, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[2, 2.5, 32]} />
        <meshStandardMaterial 
          color={deviceColor} 
          emissive={deviceColor} 
          emissiveIntensity={0.5} 
          transparent 
          opacity={0.3} 
        />
      </mesh>

      {/* Interaction Volume */}
      <Interactable
        id="ancient_device_interaction"
        name="Ancient Device"
        description={hasMadeChoice ? "The mechanism remembers." : "A dormant mechanism."}
        position={[0, 1.5, 0]}
        interactionDistance={8}
        onInteract={handleInteract}
      >
        {() => (
          <mesh visible={false}>
            <boxGeometry args={[3, 3, 3]} />
            <meshBasicMaterial />
          </mesh>
        )}
      </Interactable>

      {/* UI Overlay */}
      {isModalOpen && (
        <Html center zIndexRange={[100, 0]}>
          <div className="fixed inset-0 pointer-events-none w-screen h-screen -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
             <ChoiceModal
                isOpen={isModalOpen}
                title="THE ANCIENT DEVICE"
                description="A mechanism of unknown origin lies before you. It resonates with latent power. To awaken it is to risk the stability of this sector, but it may reveal new paths. Leaving it dormant preserves the fragile balance."
                options={[
                  {
                    id: 'AWAKEN',
                    label: 'AWAKEN',
                    description: '+Energy / -Stability / World Impact',
                    color: '#ff4500' // Orange-red
                  },
                  {
                    id: 'DORMANT',
                    label: 'LEAVE DORMANT',
                    description: '+Stability / -Energy / Safe Path',
                    color: '#4169e1' // Royal blue
                  }
                ]}
                onSelect={handleSelectChoice}
             />
          </div>
        </Html>
      )}
    </group>
  );
}
