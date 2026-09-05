export interface Ability {
  id: string;
  name: string;
  description: string;
  category: 'Exploration' | 'Memory' | 'Traversal' | 'World';
  levelRequirement: number;
  skillPointCost: number;
  cooldown?: number; // in seconds
}

export const GAME_ABILITIES: Record<string, Ability> = {
  ability_world_sense: {
    id: 'ability_world_sense',
    name: 'WORLD SENSE',
    description: 'Nearby World Memories and important interactive objects become subtly highlighted.',
    category: 'Exploration',
    levelRequirement: 2,
    skillPointCost: 1,
  },
  ability_echo_vision: {
    id: 'ability_echo_vision',
    name: 'ECHO VISION',
    description: 'Allows the player to temporarily reveal hidden traces of previous events.',
    category: 'Memory',
    levelRequirement: 3,
    skillPointCost: 2,
    cooldown: 30,
  },
  ability_aether_step: {
    id: 'ability_aether_step',
    name: 'AETHER STEP',
    description: 'Allows a short controlled forward burst/dash. Manipulate world energy.',
    category: 'Traversal',
    levelRequirement: 4,
    skillPointCost: 2,
    cooldown: 8,
  },
  ability_memory_link: {
    id: 'ability_memory_link',
    name: 'MEMORY LINK',
    description: 'Allows the player to interact with certain advanced World Memory objects that were previously inaccessible.',
    category: 'World',
    levelRequirement: 5,
    skillPointCost: 3,
  },
  ability_world_whisper: {
    id: 'ability_world_whisper',
    name: 'WORLD WHISPER',
    description: 'Provides subtle directional hints toward undiscovered important locations.',
    category: 'Exploration',
    levelRequirement: 6,
    skillPointCost: 3,
    cooldown: 60,
  },
  ability_core_resonance: {
    id: 'ability_core_resonance',
    name: 'CORE RESONANCE',
    description: 'Allows deeper interaction with the World Core, revealing hidden information and evolution possibilities.',
    category: 'World',
    levelRequirement: 8,
    skillPointCost: 4,
  }
};
