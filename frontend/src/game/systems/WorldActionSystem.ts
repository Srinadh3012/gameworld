import { saveWorldActions, loadWorldActions } from '../utils/storage';
import { createWorldAction } from '../../services/api';

export type ActionType = 'DISCOVER_REGION' | 'DISCOVER_MEMORY' | 'INSPECT_OBJECT' | 'ACTIVATE_CORE' | 'ENTER_LANDMARK' | 'COMPLETE_EVENT' | 'MAKE_WORLD_CHOICE' | 'DISCOVERED_MEMORY' | 'ENTERED_REGION' | 'ACTIVATED_CORE';

export interface WorldAction {
  id: string;
  playerId: string;
  worldId: string;
  actionType: ActionType;
  location: [number, number, number];
  timestamp: string;
  metadata: Record<string, unknown>;
  impact?: number;
}

export function calculateLocalImpact(actionType: ActionType): number {
  switch (actionType) {
    case 'DISCOVER_REGION':
    case 'ENTERED_REGION':
      return 1;
    case 'DISCOVER_MEMORY':
    case 'DISCOVERED_MEMORY':
      return 3;
    case 'MAKE_WORLD_CHOICE':
      return 5;
    case 'ACTIVATE_CORE':
    case 'ACTIVATED_CORE':
      return 10;
    default:
      return 0;
  }
}

class WorldActionSystem {
  private actions: WorldAction[] = [];

  constructor() {
    this.actions = loadWorldActions();
  }

  public async recordAction(action: Omit<WorldAction, 'id' | 'timestamp'>): Promise<number> {
    const impact = calculateLocalImpact(action.actionType);
    
    const newAction: WorldAction = {
      ...action,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      impact
    };
    
    this.actions.push(newAction);
    saveWorldActions(this.actions);

    // Best-effort backend sync
    this.syncWithBackend(newAction);

    return impact; // Return impact so UI can update context
  }

  public getActions() {
    return this.actions;
  }

  private async syncWithBackend(action: WorldAction) {
    try {
      // worldId could be dynamically passed from game, defaulting to generic sector
      const worldId = action.worldId || 'sector-alpha-01'; 
      // Call our API. If it fails (e.g. backend offline or not seeded), we swallow it safely.
      await createWorldAction(worldId, action);
    } catch (e) {
      console.warn('[WorldActionSystem] Backend sync failed, using local state only.', e);
    }
  }
}

export const worldActionSystem = new WorldActionSystem();
