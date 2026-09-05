import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh } from 'three';
import { Interactable } from './Interactable';
import { useGameState } from '../context/GameStateContext';
import { GAME_ITEMS } from '../data/itemData';

interface DroppedItemProps {
  id: string;
  itemId: string;
  quantity: number;
  position: [number, number, number];
  onCollect: () => void;
}

export function DroppedItem({ id, itemId, quantity, position, onCollect }: DroppedItemProps) {
  const group = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const { collectItem } = useGameState();

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
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(clock.elapsedTime * 3 + position[0]) * 0.1 + 0.2;
      meshRef.current.rotation.y = clock.elapsedTime;
      meshRef.current.rotation.x = clock.elapsedTime * 0.5;
    }
  });

  const handleCollect = async () => {
    const success = await collectItem(itemId, quantity);
    if (success) {
      onCollect();
    }
  };

  return (
    <group ref={group} position={position}>
      <Interactable
        id={`dropped_${id}`}
        name={`${itemDef?.name.toUpperCase() || 'ITEM'} (x${quantity})`}
        description="PICK UP"
        interactionDistance={2.5}
        position={position}
        onInteract={handleCollect}
      >
        {(isLookedAt) => (
          <>
            <mesh ref={meshRef}>
              <boxGeometry args={[0.3, 0.3, 0.3]} />
              <meshStandardMaterial 
                color={color} 
                emissive={color} 
                emissiveIntensity={isLookedAt ? 1.5 : 0.8} 
                roughness={0.1}
                metalness={0.9}
                wireframe={false}
              />
            </mesh>
            <pointLight color={color} intensity={0.5} distance={2} position={[0, 0.5, 0]} />
          </>
        )}
      </Interactable>
    </group>
  );
}
