import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh } from 'three';
import { Interactable } from './Interactable';
import { useGameState } from '../context/GameStateContext';
import { GAME_ITEMS } from '../data/itemData';

interface ResourceNodeProps {
  id: string;
  itemId: string;
  position: [number, number, number];
}

export function ResourceNode({ id, itemId, position }: ResourceNodeProps) {
  const group = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const [collected, setCollected] = useState(false);
  const { collectItem, progression } = useGameState();
  
  const hasWorldSense = progression.unlockedAbilities.includes('ability_world_sense');

  const itemDef = GAME_ITEMS[itemId];
  const color = useMemo(() => {
    if (!itemDef) return '#fff';
    switch (itemDef.rarity) {
      case 'COMMON': return '#fff';
      case 'UNCOMMON': return '#4ade80';
      case 'RARE': return '#00f3ff';
      case 'EPIC': return '#8a2be2';
      case 'MYTHIC': return '#ff00ff';
      default: return '#fff';
    }
  }, [itemDef]);

  useFrame(({ clock }) => {
    if (!collected && meshRef.current) {
      meshRef.current.position.y = Math.sin(clock.elapsedTime * 2 + position[0]) * 0.1 + 0.5;
      meshRef.current.rotation.y = clock.elapsedTime * 0.5;
    }
  });

  const handleCollect = async () => {
    if (collected) return;
    const success = await collectItem(itemId);
    if (success) {
      setCollected(true);
    }
  };

  if (collected) return null;

  return (
    <group ref={group} position={position}>
      <Interactable
        id={`res_node_${id}`}
        name={itemDef?.name.toUpperCase() || 'RESOURCE'}
        description="COLLECT"
        interactionDistance={2.5}
        position={position}
        onInteract={handleCollect}
      >
        {(isLookedAt) => (
          <>
            <mesh ref={meshRef}>
              {itemId.includes('crystal') ? (
                <octahedronGeometry args={[0.3, 0]} />
              ) : itemId.includes('metal') ? (
                <boxGeometry args={[0.4, 0.4, 0.4]} />
              ) : (
                <dodecahedronGeometry args={[0.3]} />
              )}
              <meshStandardMaterial 
                color={color} 
                emissive={color} 
                emissiveIntensity={(isLookedAt || hasWorldSense) ? 1.5 : 0.5} 
                roughness={0.2}
                metalness={0.8}
                wireframe={itemDef?.rarity === 'EPIC' || itemDef?.rarity === 'MYTHIC'}
              />
            </mesh>
            <pointLight color={color} intensity={hasWorldSense ? 1.0 : 0.5} distance={hasWorldSense ? 5 : 3} position={[0, 0.5, 0]} />
          </>
        )}
      </Interactable>
    </group>
  );
}
