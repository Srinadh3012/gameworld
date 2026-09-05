/**
 * GAMEWORLD — World Data
 *
 * Central configuration for world entities, interactables, and extension points.
 * Future phases can add multiplayer, dynamic events, and player legacy by
 * extending these interfaces — no refactoring required.
 */

// ─── Interactable Definition ─────────────────────────────────────────────────

export type InteractionType = 'memory' | 'core' | 'npc' | 'loot' | 'structure' | 'portal';

export interface InteractableDefinition {
  id: string;
  name: string;
  description: string;
  interactionType: InteractionType;
  position: [number, number, number];
  /** Optional: lore text shown on discovery */
  lore?: string;
  /** Extension point: future backend resource ID */
  resourceId?: string;
}

// ─── World Meta ──────────────────────────────────────────────────────────────

export interface WorldMeta {
  id: string;
  name: string;
  sector: string;
  evolutionLevel: number;
  /** Extension point: current active events fetched from backend */
  activeEventIds: string[];
  /** Extension point: connected player IDs for multiplayer */
  connectedPlayerIds: string[];
}

// ─── World Event (future dynamic events system) ──────────────────────────────

export interface WorldEvent {
  id: string;
  type: 'rift' | 'memory_storm' | 'core_pulse' | 'territory_shift';
  title: string;
  description: string;
  /** ISO timestamp when event started */
  startedAt: string;
  /** Extension point: affected region in world coordinates */
  region?: { center: [number, number, number]; radius: number };
}

// ─── Player Legacy Entry (future persistence) ─────────────────────────────────

export interface LegacyEntry {
  playerId: string;
  playerName: string;
  action: string;
  timestamp: string;
  position: [number, number, number];
}

// ─── Default World Configuration ─────────────────────────────────────────────

export const SECTOR_ALPHA_META: WorldMeta = {
  id: 'sector-alpha-01',
  name: 'Sector Alpha',
  sector: 'Alpha',
  evolutionLevel: 1,
  activeEventIds: ['event-core-pulse-01'],
  connectedPlayerIds: [], // populated by multiplayer system in future phases
};

export const WORLD_INTERACTABLES: InteractableDefinition[] = [
  {
    id: 'memory_stone_1',
    name: 'World Memory Stone',
    description: 'A fragment of the world\'s past.',
    interactionType: 'memory',
    position: [12, 0, -18],
    lore: 'Someone changed this place before you arrived.',
  },
  {
    id: 'memory_stone_2',
    name: 'World Memory Stone',
    description: 'A fragment of the world\'s past.',
    interactionType: 'memory',
    position: [-25, 0, -35],
    lore: 'The ground here remembers footsteps that have not happened yet.',
  },
  {
    id: 'memory_stone_3',
    name: 'World Memory Stone',
    description: 'A fragment of the world\'s past.',
    interactionType: 'memory',
    position: [40, 0, 30],
    lore: 'This fragment holds the echo of a decision not yet made.',
  },
  {
    id: 'world_core_prime',
    name: 'World Core',
    description: 'The heart of the sector.',
    interactionType: 'core',
    position: [-18, 0, -45],
    lore: 'Every action leaves a trace. This core records the history of this sector.',
  },
];

// ─── Extension Points ─────────────────────────────────────────────────────────
// These are intentionally empty — future phases populate them:

/** Phase 8+: Multiplayer player roster */
export const CONNECTED_PLAYERS: { id: string; displayName: string; position: [number, number, number] }[] = [];

/** Phase 8+: Active world events fetched from backend */
export const ACTIVE_WORLD_EVENTS: WorldEvent[] = [
  {
    id: 'event-core-pulse-01',
    type: 'core_pulse',
    title: 'Core Pulse',
    description: 'The World Core is pulsing with unusual energy.',
    startedAt: new Date().toISOString(),
  },
];

/** Phase 9+: Player legacy entries */
export const LEGACY_ENTRIES: LegacyEntry[] = [];

