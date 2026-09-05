import type { LocalProgression } from '../utils/storage';
import { NPC_DATA } from '../data/npcData';
import { loadCompanionStateData, saveCompanionStateData } from '../utils/storage';
import { worldActionSystem } from './WorldActionSystem';
import { eventSystem } from './EventSystem';

export class CompanionManager {
  
  // Deterministic checks for recruitment availability
  static canRecruit(
    npcId: string, 
    relationships: Record<string, number>, 
    completedEvents: string[],
    progression: LocalProgression
  ): { available: boolean; reason?: string } {
    const npc = NPC_DATA[npcId];
    if (!npc) return { available: false, reason: 'Unknown character.' };

    const trustLevel = relationships[npcId] || 0;

    switch (npcId) {
      case 'npc_arin':
        // Requires Familiar relationship (e.g. > 20)
        if (trustLevel >= 20) return { available: true };
        return { available: false, reason: 'Arin does not trust you enough yet.' };
      
      case 'npc_lyra':
        // Complete THE SIGNAL
        if (completedEvents.includes('event_the_signal')) return { available: true };
        return { available: false, reason: 'Complete The Signal first.' };
      
      case 'npc_sera':
        // Unlock ECHO VISION
        if (progression.unlockedAbilities.includes('ability_echo_vision')) return { available: true };
        return { available: false, reason: 'Unlock Echo Vision first.' };
        
      default:
        return { available: false, reason: 'Cannot be recruited.' };
    }
  }

  static getCompanionSpecialty(npcId: string): string {
    switch (npcId) {
      case 'npc_arin': return 'World History & Artifacts';
      case 'npc_lyra': return 'Signals & Anomalies';
      case 'npc_sera': return 'Hidden Memories & Echoes';
      default: return 'Unknown';
    }
  }

  static getContextualCommentary(
    npcId: string, 
    contextType: 'REGION' | 'LANDMARK' | 'EVENT' | 'EVOLUTION', 
    contextId: string,
    evolutionLevel: number
  ): string | null {
    // Basic deterministic deterministic dialogue
    if (contextType === 'REGION') {
      if (npcId === 'npc_lyra' && contextId === 'lumen_forest') return "Something is different today. I can feel the signal.";
      if (npcId === 'npc_arin' && contextId === 'silent_valley') return "This valley holds many secrets from the previous cycle.";
      if (npcId === 'npc_sera' && contextId === 'forgotten_ruins') return "So many echoes here... it's almost overwhelming.";
    }

    if (contextType === 'LANDMARK') {
      if (npcId === 'npc_arin' && contextId === 'broken_observatory') return "That structure predates the current World Core cycle.";
      if (npcId === 'npc_lyra' && contextId === 'whispering_stone') return "Wait. Do you see that anomaly?";
    }
    
    if (contextType === 'EVOLUTION' && evolutionLevel >= 3) {
      if (npcId === 'npc_arin') return "This is no longer the world I remember. The Core is changing everything.";
      if (npcId === 'npc_lyra') return "The frequencies are going wild! Something big is happening.";
    }

    return null;
  }

  static recordMemory(npcId: string, memoryId: string, playerId: string): void {
    const data = loadCompanionStateData();
    if (!data[npcId]) data[npcId] = { memories: [] };
    
    if (!data[npcId].memories.includes(memoryId)) {
      data[npcId].memories.push(memoryId);
      saveCompanionStateData(data);
      
      // Hook into world memories if it's a major event
      if (memoryId.includes('major')) {
        worldActionSystem.recordAction({
          playerId,
          worldId: 'sector-alpha-01',
          actionType: 'COMPANION_MEMORY',
          location: [0, 0, 0],
          metadata: { npcId, memoryId }
        });
      }
      
      const allMemories = Object.values(data).flatMap((d: any) => d.memories || []);
      if (allMemories.length >= 5) {
        eventSystem.unlockAchievement('SHARED_MEMORY');
      }
    }
  }

  static getMemories(npcId: string): string[] {
    const data = loadCompanionStateData();
    return data[npcId]?.memories || [];
  }
}

export const companionManager = new CompanionManager();
