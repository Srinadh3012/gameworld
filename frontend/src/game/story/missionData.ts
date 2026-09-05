export type MissionStatus = 'LOCKED' | 'AVAILABLE' | 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'ABANDONED';
export type ObjectiveType = 'REACH_LOCATION' | 'DISCOVER_REGION' | 'DISCOVER_LANDMARK' | 'TALK_TO_NPC' | 'INSPECT_OBJECT' | 'COLLECT_ITEM' | 'CRAFT_ITEM' | 'ACTIVATE_CORE' | 'DISCOVER_MEMORY' | 'COMPLETE_EVENT' | 'MAKE_CHOICE' | 'FOLLOW_COMPANION' | 'USE_ABILITY';

export interface MissionObjective {
  id: string;
  type: ObjectiveType;
  description: string;
  target: string;
  requiredAmount?: number;
}

export interface StoryMission {
  id: string;
  title: string;
  description: string;
  chapter: number;
  type: 'STORY' | 'NPC' | 'EXPLORATION' | 'MEMORY' | 'EVENT' | 'DISCOVERY' | 'CHOICE' | 'COMPANION';
  giver?: string;
  objectives: MissionObjective[];
  rewards: { xp?: number; memoryId?: string; flag?: string, artifact?: string }[];
  unlockRequirements: {
    flags?: string[];
    level?: number;
    completedMissions?: string[];
  };
}

export const MISSIONS: StoryMission[] = [
  {
    id: 'mission_01_awakening',
    title: 'The Awakening',
    description: 'Enter the Core Zone and discover the World Core. Something inside the world is remembering.',
    chapter: 1,
    type: 'STORY',
    objectives: [
      { id: 'obj_reach_core', type: 'DISCOVER_REGION', description: 'Reach the World Core Region', target: 'core_zone' },
      { id: 'obj_inspect_core', type: 'ACTIVATE_CORE', description: 'Inspect the Core', target: 'world_core' },
      { id: 'obj_listen_signal', type: 'MAKE_CHOICE', description: 'Listen to the Core Signal', target: 'core_signal' },
      { id: 'obj_return_safe', type: 'DISCOVER_REGION', description: 'Return to a safe location (e.g. Silent Valley)', target: 'silent_valley' }
    ],
    rewards: [{ xp: 300, memoryId: 'mem_core_aware', flag: 'firstCoreContact' }],
    unlockRequirements: {}
  },
  {
    id: 'mission_02_observer',
    title: 'The Observer',
    description: 'Find Arin in Silent Valley and ask about the strange signal.',
    chapter: 1,
    type: 'STORY',
    giver: 'npc_arin',
    objectives: [
      { id: 'obj_find_arin', type: 'TALK_TO_NPC', description: 'Find Arin in Silent Valley', target: 'npc_arin' },
      { id: 'obj_ask_signal', type: 'MAKE_CHOICE', description: 'Ask about the signal', target: 'dialogue_signal' },
      { id: 'obj_find_observatory', type: 'DISCOVER_LANDMARK', description: 'Discover the Broken Observatory', target: 'broken_observatory' }
    ],
    rewards: [{ xp: 200, flag: 'metArin' }],
    unlockRequirements: {
      completedMissions: ['mission_01_awakening']
    }
  },
  {
    id: 'mission_03_echoes',
    title: 'Echoes in the Forest',
    description: 'Investigate the strange signal in Lumen Forest with Lyra.',
    chapter: 1,
    type: 'STORY',
    giver: 'npc_lyra',
    objectives: [
      { id: 'obj_enter_forest', type: 'DISCOVER_REGION', description: 'Enter Lumen Forest', target: 'lumen_forest' },
      { id: 'obj_find_lyra', type: 'TALK_TO_NPC', description: 'Find Lyra', target: 'npc_lyra' },
      { id: 'obj_investigate_signal', type: 'DISCOVER_LANDMARK', description: 'Discover the Lumen Grove', target: 'lumen_grove' },
      { id: 'obj_recover_shard', type: 'COLLECT_ITEM', description: 'Recover an Echo Shard', target: 'echo_shard', requiredAmount: 1 }
    ],
    rewards: [{ xp: 250, memoryId: 'mem_forest_reacts', flag: 'metLyra' }],
    unlockRequirements: {
      completedMissions: ['mission_02_observer']
    }
  },
  {
    id: 'mission_04_memory_chamber',
    title: 'The Memory Chamber',
    description: 'Find the Ancient Gate in the Forgotten Ruins and witness a recorded memory of the collapse.',
    chapter: 1,
    type: 'STORY',
    giver: 'npc_sera',
    objectives: [
      { id: 'obj_find_gate', type: 'DISCOVER_REGION', description: 'Enter Forgotten Ruins', target: 'forgotten_ruins' },
      { id: 'obj_find_chamber', type: 'DISCOVER_LANDMARK', description: 'Discover Memory Chamber', target: 'memory_chamber' },
      { id: 'obj_activate_lens', type: 'MAKE_CHOICE', description: 'Activate the Memory Lens', target: 'memory_lens' },
      { id: 'obj_witness_memory', type: 'DISCOVER_MEMORY', description: 'Witness the recorded memory', target: 'mem_ancient_collapse' }
    ],
    rewards: [{ xp: 400, artifact: 'rare_lens', flag: 'discoveredAncientCollapse' }],
    unlockRequirements: {
      completedMissions: ['mission_03_echoes']
    }
  },
  {
    id: 'mission_05_final_signal',
    title: 'The Final Signal',
    description: 'The World Core is emitting a signal that transcends normal space. Prepare for the Endgame.',
    chapter: 3,
    type: 'STORY',
    objectives: [
      { id: 'obj_listen_final_signal', type: 'ACTIVATE_CORE', description: 'Listen to the Final Signal', target: 'world_core' }
    ],
    rewards: [{ xp: 1000, flag: 'heardFinalSignal' }],
    unlockRequirements: {
      completedMissions: ['mission_04_memory_chamber'],
      level: 5
    }
  },
  {
    id: 'mission_06_three_paths',
    title: 'The Three Paths',
    description: 'The world stands at a crossroads. Consider the philosophies of the Preserver, the Awakener, and the Transformer.',
    chapter: 3,
    type: 'CHOICE',
    objectives: [
      { id: 'obj_consult_arin', type: 'TALK_TO_NPC', description: 'Consult Arin about Preservation', target: 'npc_arin' },
      { id: 'obj_consult_lyra', type: 'TALK_TO_NPC', description: 'Consult Lyra about Awakening', target: 'npc_lyra' },
      { id: 'obj_consult_sera', type: 'TALK_TO_NPC', description: 'Consult Sera about Transformation', target: 'npc_sera' }
    ],
    rewards: [{ xp: 800, flag: 'consideredThreePaths' }],
    unlockRequirements: {
      completedMissions: ['mission_05_final_signal']
    }
  },
  {
    id: 'mission_07_world_memory',
    title: 'The World\'s Memory',
    description: 'Locate the deepest memory in the Forgotten Ruins.',
    chapter: 3,
    type: 'MEMORY',
    objectives: [
      { id: 'obj_deepest_memory', type: 'DISCOVER_MEMORY', description: 'Find the World\'s Memory', target: 'mem_world_origin' }
    ],
    rewards: [{ xp: 1000, memoryId: 'mem_world_origin', flag: 'knowsWorldOrigin' }],
    unlockRequirements: {
      completedMissions: ['mission_06_three_paths']
    }
  },
  {
    id: 'mission_08_resonance_chamber',
    title: 'The Resonance Chamber',
    description: 'The gateway to the Resonance Chamber has appeared near the World Core.',
    chapter: 3,
    type: 'STORY',
    objectives: [
      { id: 'obj_enter_chamber', type: 'DISCOVER_REGION', description: 'Enter the Resonance Chamber', target: 'resonance_chamber' }
    ],
    rewards: [{ xp: 1500, flag: 'enteredResonanceChamber' }],
    unlockRequirements: {
      completedMissions: ['mission_07_world_memory']
    }
  },
  {
    id: 'mission_09_beyond_threshold',
    title: 'Beyond the Threshold',
    description: 'The world has reached the Threshold. Make your final preparations.',
    chapter: 3,
    type: 'STORY',
    objectives: [
      { id: 'obj_reach_threshold', type: 'MAKE_CHOICE', description: 'Prepare for the Endgame', target: 'endgame_preparation' }
    ],
    rewards: [{ xp: 2000, flag: 'thresholdReached' }],
    unlockRequirements: {
      completedMissions: ['mission_08_resonance_chamber']
    }
  }
];
