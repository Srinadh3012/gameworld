import { useCallback } from 'react';
import { useGameState } from '../context/GameStateContext';
import { MEMORY_DATA } from '../data/memoryData';
import { worldActionSystem } from './WorldActionSystem';
import { audioSystem } from './AudioSystem';

export function useMemorySystem() {
  const { discoverMemory, showNotification } = useGameState();

  const handleMemoryDiscovery = useCallback((id: string, location: [number, number, number]) => {
    const memory = MEMORY_DATA[id];
    if (!memory) return;

    // The context will deduplicate and save to localStorage
    const wasNew = discoverMemory(id);

    if (wasNew) {
      audioSystem.playDiscoverySound();
      showNotification('WORLD MEMORY DISCOVERED', memory.title);
      
      worldActionSystem.recordAction({
        playerId: 'local',
        worldId: 'sector-alpha-01',
        actionType: 'DISCOVERED_MEMORY',
        location,
        metadata: { memoryId: id, memoryTitle: memory.title }
      });
    }
  }, [discoverMemory, showNotification]);

  return { handleMemoryDiscovery };
}
