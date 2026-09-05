import type { RegionDefinition } from './regionData';
import { REGIONS } from './regionData';
import type { WorldMemory } from './memoryData';
import { MEMORY_DATA } from './memoryData';
import type { GameEventDefinition } from './eventData';
import { GAME_EVENTS } from './eventData';

export type MapNodeType = 'region' | 'landmark' | 'memory' | 'event' | 'secret';

export interface Landmark {
  id: string;
  regionId: string;
  name: string;
  description: string;
  position: [number, number, number];
  type: MapNodeType;
  requiredLevel: number;
  importance: 'normal' | 'major' | 'critical';
}

export const LANDMARKS: Landmark[] = [
  // SILENT VALLEY
  {
    id: 'lm_broken_observatory',
    regionId: 'region_silent_valley',
    name: 'The Broken Observatory',
    description: 'An ancient viewing deck shattered by unknown forces.',
    position: [10, 0, -10],
    type: 'landmark',
    requiredLevel: 1,
    importance: 'major'
  },
  {
    id: 'lm_echo_bridge',
    regionId: 'region_silent_valley',
    name: 'Echo Bridge',
    description: 'A structure that hums with old resonant energy.',
    position: [-5, 0, 5],
    type: 'landmark',
    requiredLevel: 1,
    importance: 'normal'
  },
  // LUMEN FOREST
  {
    id: 'lm_lumen_grove',
    regionId: 'region_lumen_forest',
    name: 'Lumen Grove',
    description: 'The densest cluster of bioluminescent trees.',
    position: [40, 0, 45],
    type: 'landmark',
    requiredLevel: 1,
    importance: 'major'
  },
  {
    id: 'lm_whispering_stone',
    regionId: 'region_lumen_forest',
    name: 'Whispering Stone',
    description: 'A monolithic stone that seems to speak in the wind.',
    position: [60, 0, 20],
    type: 'landmark',
    requiredLevel: 2,
    importance: 'normal'
  },
  // FORGOTTEN RUINS
  {
    id: 'lm_ancient_gate',
    regionId: 'region_forgotten_ruins',
    name: 'Ancient Gate',
    description: 'A massive threshold leading deeper into the ruins.',
    position: [-30, 0, -25],
    type: 'landmark',
    requiredLevel: 2,
    importance: 'major'
  },
  {
    id: 'lm_memory_chamber',
    regionId: 'region_forgotten_ruins',
    name: 'Memory Chamber',
    description: 'A sealed room overflowing with data fragments.',
    position: [-45, 0, -55],
    type: 'landmark',
    requiredLevel: 3,
    importance: 'normal'
  },
  // CORE ZONE
  {
    id: 'lm_world_core',
    regionId: 'region_core_zone',
    name: 'World Core',
    description: 'The beating heart of Sector Alpha.',
    position: [-18, 0, -45],
    type: 'landmark',
    requiredLevel: 4,
    importance: 'critical'
  },
  {
    id: 'lm_resonance_chamber',
    regionId: 'region_core_zone',
    name: 'Resonance Chamber',
    description: 'An area resonating with pure creative energy.',
    position: [-22, 0, -40],
    type: 'landmark',
    requiredLevel: 5,
    importance: 'major'
  },
  // SECRETS
  {
    id: 'lm_secret_silent_chamber',
    regionId: 'region_silent_valley',
    name: 'The Silent Chamber',
    description: 'A completely soundless pocket dimension.',
    position: [18, 0, -12], // Hidden near observatory
    type: 'secret',
    requiredLevel: 1,
    importance: 'normal'
  }
];

export const WORLD_COORDINATES = {
  regions: REGIONS,
  landmarks: LANDMARKS,
  memories: Object.values(MEMORY_DATA),
  events: GAME_EVENTS,
  spawnPoint: [0, 1, 0] as [number, number, number]
};
