export type ItemType = 'RESOURCE' | 'TOOL' | 'ARTIFACT' | 'CONSUMABLE' | 'KEY' | 'WORLD_ITEM' | 'COSMETIC';
export type ItemRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'MYTHIC';

export interface GameItem {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  description: string;
  icon: string; // Could be a lucide-react icon name or simple character/emoji for now
  stackable: boolean;
  value?: number; // World impact potential or simple sort weight
}

export const GAME_ITEMS: Record<string, GameItem> = {
  // RESOURCES
  res_lumen_crystal: {
    id: 'res_lumen_crystal',
    name: 'Lumen Crystal',
    type: 'RESOURCE',
    rarity: 'COMMON',
    description: 'A glowing shard of ambient light energy. Used in basic energy crafting.',
    icon: 'Hexagon', // We'll map these strings to Lucide icons in UI
    stackable: true,
    value: 1,
  },
  res_ancient_metal: {
    id: 'res_ancient_metal',
    name: 'Ancient Metal',
    type: 'RESOURCE',
    rarity: 'UNCOMMON',
    description: 'A corroded but incredibly dense alloy from a forgotten era.',
    icon: 'Box',
    stackable: true,
    value: 2,
  },
  res_echo_shard: {
    id: 'res_echo_shard',
    name: 'Echo Shard',
    type: 'RESOURCE',
    rarity: 'RARE',
    description: 'A crystalline structure that seems to hold fragments of past sounds.',
    icon: 'Sparkles',
    stackable: true,
    value: 5,
  },
  res_world_essence: {
    id: 'res_world_essence',
    name: 'World Essence',
    type: 'RESOURCE',
    rarity: 'EPIC',
    description: 'Pure, concentrated ambient energy extracted from the world itself.',
    icon: 'Droplet',
    stackable: true,
    value: 10,
  },
  res_core_fragment: {
    id: 'res_core_fragment',
    name: 'Core Fragment',
    type: 'RESOURCE',
    rarity: 'MYTHIC',
    description: 'A direct shard of the World Core. Extremely dangerous and powerful.',
    icon: 'Orbit',
    stackable: true,
    value: 50,
  },
  
  // CONSUMABLES
  con_lumen_charge: {
    id: 'con_lumen_charge',
    name: 'Lumen Charge',
    type: 'CONSUMABLE',
    rarity: 'COMMON',
    description: 'Restores a small amount of stamina when used.',
    icon: 'Battery',
    stackable: true,
  },
  con_world_pulse: {
    id: 'con_world_pulse',
    name: 'World Pulse',
    type: 'CONSUMABLE',
    rarity: 'RARE',
    description: 'Temporarily reveals nearby interactable objects and memories.',
    icon: 'Radio',
    stackable: true,
  },
  con_echo_tonic: {
    id: 'con_echo_tonic',
    name: 'Echo Tonic',
    type: 'CONSUMABLE',
    rarity: 'EPIC',
    description: 'Temporarily increases discovery range and stamina regeneration.',
    icon: 'FlaskConical',
    stackable: true,
  },

  // TOOLS
  tool_memory_lens: {
    id: 'tool_memory_lens',
    name: 'Memory Lens',
    type: 'TOOL',
    rarity: 'EPIC',
    description: 'A specialized optical device that reveals hidden world memories.',
    icon: 'Eye',
    stackable: false,
  },
  tool_explorer_module: {
    id: 'tool_explorer_module',
    name: 'Explorer Module',
    type: 'TOOL',
    rarity: 'MYTHIC',
    description: 'Enhances map visibility and interaction ranges permanently while in inventory.',
    icon: 'Compass',
    stackable: false,
  },

  // ARTIFACTS
  art_echo_beacon: {
    id: 'art_echo_beacon',
    name: 'Echo Beacon',
    type: 'ARTIFACT',
    rarity: 'RARE',
    description: 'Places a temporary marker in the world for navigation.',
    icon: 'MapPin',
    stackable: true,
  },
};
