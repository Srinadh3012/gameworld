import type { RegionBounds } from '../utils/gameHelpers';

export interface RegionDefinition {
  id: string;
  name: string;
  description: string;
  color: string;
  type: 'valley' | 'ruins' | 'forest' | 'core';
  bounds: RegionBounds;
}

export const REGIONS: RegionDefinition[] = [
  {
    id: 'region_silent_valley',
    name: 'The Silent Valley',
    description: 'The quiet plains where journeys begin.',
    color: '#00f3ff', // neon cyan
    type: 'valley',
    bounds: { minX: -15, maxX: 20, minZ: -15, maxZ: 15 }
  },
  {
    id: 'region_forgotten_ruins',
    name: 'The Forgotten Ruins',
    description: 'Ancient structures left behind by previous architects.',
    color: '#ffaa00', // amber
    type: 'ruins',
    bounds: { minX: -60, maxX: -15, minZ: -60, maxZ: -20 }
  },
  {
    id: 'region_lumen_forest',
    name: 'The Lumen Forest',
    description: 'A dense grove of bioluminescent flora.',
    color: '#00ffaa', // green
    type: 'forest',
    bounds: { minX: 25, maxX: 80, minZ: 10, maxZ: 80 }
  },
  {
    id: 'region_core_zone',
    name: 'The Core Zone',
    description: 'The pulsing heart of Sector Alpha.',
    color: '#8a2be2', // game purple
    type: 'core',
    bounds: { minX: -24, maxX: -12, minZ: -52, maxZ: -38 }
  }
];

// Simple AABB exclusion zones for major structures (ruins, pillars) so the player cannot walk through them
// This is a lightweight alternative to a full physics engine like Rapier/Cannon
export const COLLISION_OBSTACLES: RegionBounds[] = [
  // Example boundary boxes for the ruins cluster
  { minX: -36, maxX: -30, minZ: -36, maxZ: -30 },
  { minX: -26, maxX: -20, minZ: -46, maxZ: -40 },
  // World Core pedestal base
  { minX: -19, maxX: -17, minZ: -46, maxZ: -44 },
];
