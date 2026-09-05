export type CompanionState = 
  | 'IDLE' 
  | 'FOLLOWING' 
  | 'WAITING' 
  | 'OBSERVING' 
  | 'INVESTIGATING' 
  | 'TALKING' 
  | 'TRAVELING' 
  | 'DISCOVERING' 
  | 'EVENT' 
  | 'RETURNING';

export interface CompanionFSM {
  currentState: CompanionState;
  targetId: string | null; // e.g. landmark ID, event ID
  targetPosition: [number, number, number] | null;
}

export const INITIAL_COMPANION_FSM: CompanionFSM = {
  currentState: 'IDLE',
  targetId: null,
  targetPosition: null
};

// Pure deterministic function to evaluate next state based on inputs
export function evaluateCompanionState(
  fsm: CompanionFSM,
  playerDistance: number,
  isInDialogue: boolean,
  activeEventId: string | null,
  nearestLandmark: { id: string, distance: number } | null
): CompanionFSM {
  
  if (isInDialogue) {
    return { ...fsm, currentState: 'TALKING' };
  }
  
  if (activeEventId) {
    return { ...fsm, currentState: 'EVENT', targetId: activeEventId };
  }

  // If player is far, we should follow
  const FOLLOW_THRESHOLD = 8;
  const IDLE_THRESHOLD = 3;

  if (playerDistance > FOLLOW_THRESHOLD) {
    return { ...fsm, currentState: 'FOLLOWING' };
  }
  
  // If player is close, but there's a landmark nearby we could observe it
  if (nearestLandmark && nearestLandmark.distance < 15 && fsm.currentState !== 'OBSERVING') {
    return { ...fsm, currentState: 'OBSERVING', targetId: nearestLandmark.id };
  }

  if (playerDistance <= IDLE_THRESHOLD && fsm.currentState !== 'OBSERVING') {
    return { ...fsm, currentState: 'IDLE' };
  }

  // Preserve existing state if no transitions apply
  return fsm;
}
