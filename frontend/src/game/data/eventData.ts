export type EventDifficulty = 'UNKNOWN' | 'EASY' | 'MEDIUM' | 'HARD' | 'EXTREME';
export type EventRisk = 'LOW' | 'MEDIUM' | 'HIGH';

export interface EventObjective {
  id: string;
  description: string;
}

export interface GameEventDefinition {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: EventDifficulty;
  risk: EventRisk;
  requiredEvolutionLevel: number;
  impactReward: number;
  objectives: EventObjective[];
  location?: [number, number, number];
  prerequisiteEventId?: string; // For event chains
}

export const GAME_EVENTS: GameEventDefinition[] = [
  {
    id: 'evt_the_signal',
    title: 'THE SIGNAL',
    description: 'Something is calling from beyond the ruins. A faint energy signature has been detected.',
    type: 'DISCOVERY',
    difficulty: 'UNKNOWN',
    risk: 'LOW',
    requiredEvolutionLevel: 1,
    impactReward: 5,
    objectives: [
      { id: 'obj_reach_signal', description: 'Investigate the strange signal in the Forgotten Ruins.' }
    ],
    location: [-50, 0, -50], // Somewhere in the ruins
  },
  {
    id: 'evt_collapsed_path',
    title: 'THE COLLAPSED PATH',
    description: 'A previously stable route near the Lumen Forest has collapsed, revealing an underground hollow.',
    type: 'EXPLORATION',
    difficulty: 'EASY',
    risk: 'MEDIUM',
    requiredEvolutionLevel: 1,
    impactReward: 5,
    objectives: [
      { id: 'obj_investigate_path', description: 'Find the alternate route into the Lumen Forest.' }
    ],
    location: [10, 0, 10], // Edge of Lumen forest
  },
  {
    id: 'evt_the_awakening',
    title: 'THE AWAKENING',
    description: 'The World Core is emitting a powerful resonance. The sector is destabilizing.',
    type: 'CRITICAL',
    difficulty: 'HARD',
    risk: 'HIGH',
    requiredEvolutionLevel: 2, // Needs world impact to have hit level 2
    impactReward: 10,
    objectives: [
      { id: 'obj_stabilize_core', description: 'Reach the World Core and synchronize the resonance.' }
    ],
    location: [-18, 0, -45], // At the world core
    prerequisiteEventId: 'evt_the_signal', // Chained after the signal
  },
  {
    id: 'evt_great_resonance',
    title: 'THE GREAT RESONANCE',
    description: 'The World Energy is peaking, transforming the environment.',
    type: 'CRITICAL',
    difficulty: 'HARD',
    risk: 'HIGH',
    requiredEvolutionLevel: 3,
    impactReward: 20,
    objectives: [{ id: 'obj_observe_resonance', description: 'Witness the resonance at the Core.' }],
    location: [-18, 0, -45],
  },
  {
    id: 'evt_silent_storm',
    title: 'THE SILENT STORM',
    description: 'A storm of quiet energy is passing through Silent Valley.',
    type: 'EXPLORATION',
    difficulty: 'MEDIUM',
    risk: 'MEDIUM',
    requiredEvolutionLevel: 3,
    impactReward: 15,
    objectives: [{ id: 'obj_weather_storm', description: 'Reach the Observatory during the storm.' }],
    location: [-30, 0, 40],
  },
  {
    id: 'evt_coop_breach',
    title: 'THE AETHER BREACH (CO-OP)',
    description: 'A massive anomaly requires multiple explorers to stabilize.',
    type: 'COOPERATIVE',
    difficulty: 'EXTREME',
    risk: 'HIGH',
    requiredEvolutionLevel: 2,
    impactReward: 50,
    objectives: [{ id: 'obj_stabilize_breach', description: 'Work with your party to close the breach.' }],
    location: [0, 0, 0],
  },
  {
    id: 'evt_memory_flood',
    title: 'THE MEMORY FLOOD',
    description: 'Ancient memories are overflowing from the core network.',
    type: 'DISCOVERY',
    difficulty: 'HARD',
    risk: 'LOW',
    requiredEvolutionLevel: 4,
    impactReward: 20,
    objectives: [{ id: 'obj_decode_flood', description: 'Decode 3 new memory signals.' }],
  },
  {
    id: 'evt_core_pulse',
    title: 'THE CORE PULSE',
    description: 'The Core is pulsing rapidly. The Threshold is near.',
    type: 'CRITICAL',
    difficulty: 'EXTREME',
    risk: 'HIGH',
    requiredEvolutionLevel: 5,
    impactReward: 30,
    objectives: [{ id: 'obj_survive_pulse', description: 'Stabilize the Core Pulse.' }],
    location: [-18, 0, -45],
  },
  {
    id: 'evt_vanishing_path',
    title: 'THE VANISHING PATH',
    description: 'Unstable energy is making paths disappear and reappear.',
    type: 'EXPLORATION',
    difficulty: 'HARD',
    risk: 'HIGH',
    requiredEvolutionLevel: 4,
    impactReward: 25,
    objectives: [{ id: 'obj_navigate_path', description: 'Navigate the Lumen Forest without getting lost.' }],
    location: [25, 0, -20],
  }
];
