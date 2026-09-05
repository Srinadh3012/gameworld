const ITEMS = {
  res_lumen_crystal: { id: 'res_lumen_crystal', type: 'RESOURCE' },
  res_ancient_metal: { id: 'res_ancient_metal', type: 'RESOURCE' },
  res_echo_shard: { id: 'res_echo_shard', type: 'RESOURCE' },
  res_world_essence: { id: 'res_world_essence', type: 'RESOURCE' },
  res_core_fragment: { id: 'res_core_fragment', type: 'RESOURCE' },
  
  con_lumen_charge: { id: 'con_lumen_charge', type: 'CONSUMABLE' },
  con_world_pulse: { id: 'con_world_pulse', type: 'CONSUMABLE' },
  con_echo_tonic: { id: 'con_echo_tonic', type: 'CONSUMABLE' },

  tool_memory_lens: { id: 'tool_memory_lens', type: 'TOOL' },
  tool_explorer_module: { id: 'tool_explorer_module', type: 'TOOL' },
  
  art_echo_beacon: { id: 'art_echo_beacon', type: 'ARTIFACT' },
};

const RECIPES = {
  rec_lumen_charge: {
    id: 'rec_lumen_charge',
    requiredItems: [{ itemId: 'res_lumen_crystal', quantity: 2 }, { itemId: 'res_world_essence', quantity: 1 }],
    outputItem: 'con_lumen_charge',
    outputQuantity: 1,
  },
  rec_echo_beacon: {
    id: 'rec_echo_beacon',
    requiredItems: [{ itemId: 'res_echo_shard', quantity: 3 }, { itemId: 'res_ancient_metal', quantity: 1 }],
    outputItem: 'art_echo_beacon',
    outputQuantity: 1,
  },
  rec_memory_lens: {
    id: 'rec_memory_lens',
    requiredItems: [{ itemId: 'res_lumen_crystal', quantity: 5 }, { itemId: 'res_ancient_metal', quantity: 2 }],
    outputItem: 'tool_memory_lens',
    outputQuantity: 1,
  },
  rec_explorer_module: {
    id: 'rec_explorer_module',
    requiredItems: [{ itemId: 'res_world_essence', quantity: 3 }, { itemId: 'res_core_fragment', quantity: 1 }],
    outputItem: 'tool_explorer_module',
    outputQuantity: 1,
  }
};

module.exports = { ITEMS, RECIPES };
