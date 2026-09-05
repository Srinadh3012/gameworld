export function saveDiscoveredMemories(ids: string[]): void {
  try {
    localStorage.setItem('gw_discovered_memories', JSON.stringify(ids));
  } catch (e) {
    console.warn('Failed to save memories', e);
  }
}

export function loadDiscoveredMemories(): string[] {
  try {
    const data = localStorage.getItem('gw_discovered_memories');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn('Failed to load memories', e);
    return [];
  }
}

export function saveDiscoveredRegions(ids: string[]): void {
  try {
    localStorage.setItem('gw_discovered_regions', JSON.stringify(ids));
  } catch (e) {
    console.warn('Failed to save regions', e);
  }
}

export function loadDiscoveredRegions(): string[] {
  try {
    const data = localStorage.getItem('gw_discovered_regions');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn('Failed to load regions', e);
    return [];
  }
}

export function saveDiscoveredLandmarks(ids: string[]): void {
  try {
    localStorage.setItem('gw_discovered_landmarks', JSON.stringify(ids));
  } catch (e) {
    console.warn('Failed to save landmarks', e);
  }
}

export function loadDiscoveredLandmarks(): string[] {
  try {
    const data = localStorage.getItem('gw_discovered_landmarks');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn('Failed to load landmarks', e);
    return [];
  }
}

export function saveFastTravelNodes(ids: string[]): void {
  try {
    localStorage.setItem('gw_fast_travel_nodes', JSON.stringify(ids));
  } catch (e) {
    console.warn('Failed to save fast travel nodes', e);
  }
}

export function loadFastTravelNodes(): string[] {
  try {
    const data = localStorage.getItem('gw_fast_travel_nodes');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn('Failed to load fast travel nodes', e);
    return [];
  }
}

// Any generic world action
export function saveWorldActions(actions: any[]): void {
  try {
    localStorage.setItem('gw_world_actions', JSON.stringify(actions));
  } catch (e) {
    console.warn('Failed to save world actions', e);
  }
}

export function loadWorldActions(): any[] {
  try {
    const data = localStorage.getItem('gw_world_actions');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn('Failed to load world actions', e);
    return [];
  }
}

export function clearAllProgress(): void {
  try {
    localStorage.removeItem('gw_discovered_memories');
    localStorage.removeItem('gw_discovered_regions');
    localStorage.removeItem('gw_discovered_landmarks');
    localStorage.removeItem('gw_fast_travel_nodes');
    localStorage.removeItem('gw_world_actions');
    localStorage.removeItem('gw_world_state');
    localStorage.removeItem('gw_world_choices');
    localStorage.removeItem('gw_active_events');
    localStorage.removeItem('gw_completed_events');
    localStorage.removeItem('gw_failed_events');
    localStorage.removeItem('gw_achievements');
    localStorage.removeItem('gw_inventory');
    localStorage.removeItem('gw_hotbar');
    localStorage.removeItem('gw_npc_relationships');
    localStorage.removeItem('gw_active_companion');
  } catch (e) {
    console.warn('Failed to clear progress', e);
  }
}

// Event Tracking
export function saveEventState(key: 'active' | 'completed' | 'failed', ids: string[]): void {
  try {
    localStorage.setItem(`gw_${key}_events`, JSON.stringify(ids));
  } catch (e) {
    console.warn(`Failed to save ${key} events`, e);
  }
}

export function loadEventState(key: 'active' | 'completed' | 'failed'): string[] {
  try {
    const data = localStorage.getItem(`gw_${key}_events`);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn(`Failed to load ${key} events`, e);
    return [];
  }
}

export function saveAchievements(ids: string[]): void {
  try {
    localStorage.setItem('gw_achievements', JSON.stringify(ids));
  } catch (e) {
    console.warn('Failed to save achievements', e);
  }
}

export function loadAchievements(): string[] {
  try {
    const data = localStorage.getItem('gw_achievements');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn('Failed to load achievements', e);
    return [];
  }
}

export interface LocalWorldState {
  worldImpact: number;
  worldEnergy: number;
  worldStability: number;
}

export function saveWorldState(state: LocalWorldState): void {
  try {
    localStorage.setItem('gw_world_state', JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save world state', e);
  }
}

export function loadWorldState(): LocalWorldState {
  try {
    const data = localStorage.getItem('gw_world_state');
    return data ? JSON.parse(data) : { worldImpact: 0, worldEnergy: 50, worldStability: 100 };
  } catch (e) {
    console.warn('Failed to load world state', e);
    return { worldImpact: 0, worldEnergy: 50, worldStability: 100 };
  }
}

export function saveWorldChoices(choices: Record<string, string>): void {
  try {
    localStorage.setItem('gw_world_choices', JSON.stringify(choices));
  } catch (e) {
    console.warn('Failed to save world choices', e);
  }
}

export function loadWorldChoices(): Record<string, string> {
  try {
    const data = localStorage.getItem('gw_world_choices');
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.warn('Failed to load world choices', e);
    return {};
  }
}

// Inventory Tracking
export interface LocalInventoryItem {
  itemId: string;
  quantity: number;
}

export interface LocalInventory {
  items: LocalInventoryItem[];
  capacity: number;
}

export function saveInventory(inv: LocalInventory): void {
  try {
    localStorage.setItem('gw_inventory', JSON.stringify(inv));
  } catch (e) {
    console.warn('Failed to save inventory', e);
  }
}

export function loadInventory(): LocalInventory {
  try {
    const data = localStorage.getItem('gw_inventory');
    return data ? JSON.parse(data) : { items: [], capacity: 24 };
  } catch (e) {
    console.warn('Failed to load inventory', e);
    return { items: [], capacity: 24 };
  }
}

export function saveHotbar(slots: (string | null)[]): void {
  try {
    localStorage.setItem('gw_hotbar', JSON.stringify(slots));
  } catch (e) {
    console.warn('Failed to save hotbar', e);
  }
}

export function loadHotbar(): (string | null)[] {
  try {
    const data = localStorage.getItem('gw_hotbar');
    return data ? JSON.parse(data) : [null, null, null, null, null];
  } catch (e) {
    console.warn('Failed to load hotbar', e);
    return [null, null, null, null, null];
  }
}

export function saveNPCRelationships(relationships: Record<string, number>): void {
  try {
    localStorage.setItem('gw_npc_relationships', JSON.stringify(relationships));
  } catch (e) {
    console.warn('Failed to save NPC relationships', e);
  }
}

export function loadNPCRelationships(): Record<string, number> {
  try {
    const data = localStorage.getItem('gw_npc_relationships');
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.warn('Failed to load NPC relationships', e);
    return {};
  }
}

export function saveActiveCompanion(npcId: string | null): void {
  try {
    localStorage.setItem('gw_active_companion', JSON.stringify(npcId));
  } catch (e) {
    console.warn('Failed to save active companion', e);
  }
}

export function loadActiveCompanion(): string | null {
  try {
    const data = localStorage.getItem('gw_active_companion');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.warn('Failed to load active companion', e);
    return null;
  }
}

export function saveCompanionStateData(stateData: Record<string, any>): void {
  try {
    localStorage.setItem('gw_companion_state_data', JSON.stringify(stateData));
  } catch (e) {
    console.warn('Failed to save companion state data', e);
  }
}

export function loadCompanionStateData(): Record<string, any> {
  try {
    const data = localStorage.getItem('gw_companion_state_data');
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.warn('Failed to load companion state data', e);
    return {};
  }
}
