export type GuardianStatus = 'DORMANT' | 'WATCHING' | 'AWAKENING' | 'ACTIVE' | 'CHALLENGE' | 'ENRAGED' | 'RESOLVED' | 'RESTING';

export interface LocalGuardianEncounter {
  playerId: string;
  guardianId: string;
  worldId: string;
  status: GuardianStatus;
  attempts: number;
  currentPhase: number;
  completed: boolean;
  failed: boolean;
  choices: Record<string, string>;
  discoveredSecrets: string[];
}

export function saveLocalGuardianState(guardianId: string, state: LocalGuardianEncounter): void {
  try {
    localStorage.setItem(`gw_guardian_${guardianId}`, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save guardian state locally', e);
  }
}

export function loadLocalGuardianState(playerId: string, guardianId: string, worldId: string): LocalGuardianEncounter {
  try {
    const data = localStorage.getItem(`gw_guardian_${guardianId}`);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Failed to load guardian state locally', e);
  }
  
  return {
    playerId,
    guardianId,
    worldId,
    status: 'DORMANT',
    attempts: 0,
    currentPhase: 0,
    completed: false,
    failed: false,
    choices: {},
    discoveredSecrets: []
  };
}
