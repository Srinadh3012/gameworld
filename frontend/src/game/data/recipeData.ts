export interface RecipeRequirement {
  itemId: string;
  quantity: number;
}

export interface CraftingRecipe {
  id: string;
  name: string;
  description: string;
  requiredItems: RecipeRequirement[];
  outputItem: string;
  outputQuantity: number;
}

export const GAME_RECIPES: CraftingRecipe[] = [
  {
    id: 'rec_lumen_charge',
    name: 'Lumen Charge',
    description: 'Synthesize raw light energy into a usable stamina charge.',
    requiredItems: [
      { itemId: 'res_lumen_crystal', quantity: 2 },
      { itemId: 'res_world_essence', quantity: 1 }
    ],
    outputItem: 'con_lumen_charge',
    outputQuantity: 1,
  },
  {
    id: 'rec_echo_beacon',
    name: 'Echo Beacon',
    description: 'Construct a spatial anchor to mark your location.',
    requiredItems: [
      { itemId: 'res_echo_shard', quantity: 3 },
      { itemId: 'res_ancient_metal', quantity: 1 }
    ],
    outputItem: 'art_echo_beacon',
    outputQuantity: 1,
  },
  {
    id: 'rec_memory_lens',
    name: 'Memory Lens',
    description: 'Forge an artifact capable of perceiving the past.',
    requiredItems: [
      { itemId: 'res_lumen_crystal', quantity: 5 },
      { itemId: 'res_ancient_metal', quantity: 2 }
    ],
    outputItem: 'tool_memory_lens',
    outputQuantity: 1,
  },
  {
    id: 'rec_explorer_module',
    name: 'Explorer Module',
    description: 'A powerful upgrade to your world-interaction suite.',
    requiredItems: [
      { itemId: 'res_world_essence', quantity: 3 },
      { itemId: 'res_core_fragment', quantity: 1 }
    ],
    outputItem: 'tool_explorer_module',
    outputQuantity: 1,
  },
];
