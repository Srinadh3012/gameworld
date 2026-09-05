export type GuardianPhaseType = 'OBSERVE' | 'EXPLORE' | 'PUZZLE' | 'RESONANCE' | 'SURVIVAL' | 'CHOICE' | 'ESCAPE' | 'DISCOVERY';

export interface GuardianPhase {
  id: string;
  type: GuardianPhaseType;
  objective: string;
  requirements?: Record<string, any>;
  hint?: string;
}

export interface GuardianData {
  id: string;
  name: string;
  title: string;
  locationId: string;
  locationType: 'REGION' | 'LANDMARK';
  description: string;
  phases: GuardianPhase[];
  rewards: { xp?: number, memoryId?: string, flag?: string, artifact?: string };
}

export const GUARDIANS: GuardianData[] = [
  {
    id: 'guardian_echo_warden',
    name: 'Echo Warden',
    title: 'Guardian of Forgotten Memories',
    locationId: 'memory_chamber',
    locationType: 'LANDMARK',
    description: 'An ancient construct made from stone and glowing memory fragments.',
    phases: [
      { id: 'phase_observe', type: 'OBSERVE', objective: 'Observe memory fragments', hint: 'Use Echo Vision' },
      { id: 'phase_sequence', type: 'PUZZLE', objective: 'Identify the correct sequence', hint: 'Look for environmental clues' },
      { id: 'phase_core', type: 'RESONANCE', objective: 'Reach the Memory Core' }
    ],
    rewards: { xp: 500, memoryId: 'mem_echo_warden_resolved', flag: 'wardenResolved', artifact: 'memory_crystal' }
  },
  {
    id: 'guardian_rootkeeper',
    name: 'Rootkeeper',
    title: 'Protector of the Root Memory',
    locationId: 'lumen_forest',
    locationType: 'REGION',
    description: 'An ancient tree-like guardian with glowing roots and energy.',
    phases: [
      { id: 'phase_explore', type: 'EXPLORE', objective: 'Locate energy nodes', hint: 'Explore the surrounding area' },
      { id: 'phase_nodes', type: 'RESONANCE', objective: 'Activate nodes in correct sequence', hint: 'Use World Sense' },
      { id: 'phase_restore', type: 'CHOICE', objective: 'Restore Root Memory' }
    ],
    rewards: { xp: 700, memoryId: 'mem_root_memory', flag: 'rootAwakened' }
  },
  {
    id: 'guardian_observer',
    name: 'The Observer',
    title: 'The Silent Witness',
    locationId: 'broken_observatory',
    locationType: 'LANDMARK',
    description: 'It watches and waits for those who understand.',
    phases: [
      { id: 'phase_clues', type: 'EXPLORE', objective: 'Follow environmental clues' },
      { id: 'phase_points', type: 'RESONANCE', objective: 'Activate observation points' },
      { id: 'phase_reconstruct', type: 'PUZZLE', objective: 'Reconstruct a forgotten event' }
    ],
    rewards: { xp: 900, memoryId: 'mem_observer_truth', flag: 'observerApproved' }
  },
  {
    id: 'guardian_core_sentinel',
    name: 'Core Sentinel',
    title: 'Protector of the World Core',
    locationId: 'world_core',
    locationType: 'REGION', // Or landmark depending on map setup
    description: 'The final protector of the deepest chamber.',
    phases: [
      { id: 'phase_recognition', type: 'OBSERVE', objective: 'Survive the recognition scan' },
      { id: 'phase_nodes', type: 'RESONANCE', objective: 'Interact with environmental energy nodes' },
      { id: 'phase_choice', type: 'CHOICE', objective: 'Make a world-altering decision' }
    ],
    rewards: { xp: 1500, flag: 'coreRecognized' }
  }
];
