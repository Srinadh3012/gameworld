export type MemoryCategory = 'Discoveries' | 'Battles' | 'Creations' | 'Mysteries' | 'Community';
export type ImpactLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface WorldMemoryEvent {
  id: string;
  day: number;
  date: string;
  title: string;
  category: MemoryCategory;
  responsibleEntity: string;
  impactLevel: ImpactLevel;
  description: string;
  impactScore: number; // for visualization (1-100)
}

export const MEMORY_EVENTS: WorldMemoryEvent[] = [
  {
    id: 'm-1',
    day: 1,
    date: 'CYCLE 001',
    title: 'First player entered Neon Rift',
    category: 'Discoveries',
    responsibleEntity: 'WandererX',
    impactLevel: 'Medium',
    description: 'The digital seal was broken, allowing the first human consciousness to sync with the Neon Rift sector.',
    impactScore: 30,
  },
  {
    id: 'm-2',
    day: 3,
    date: 'CYCLE 003',
    title: 'An ancient structure was discovered',
    category: 'Mysteries',
    responsibleEntity: 'Exploration Guild',
    impactLevel: 'Low',
    description: 'Deep within the Forgotten Valley, a colossal obelisk humming with dark energy was mapped by scouts.',
    impactScore: 15,
  },
  {
    id: 'm-3',
    day: 7,
    date: 'CYCLE 007',
    title: 'Players defeated the Rift Guardian',
    category: 'Battles',
    responsibleEntity: 'Alliance of Seven',
    impactLevel: 'Critical',
    description: 'A massive coordinated attack by 5,000 players brought down the prime Guardian, permanently unlocking the core network.',
    impactScore: 85,
  },
  {
    id: 'm-4',
    day: 12,
    date: 'CYCLE 012',
    title: 'Neon Rift entered unstable state',
    category: 'Community',
    responsibleEntity: 'System Reaction',
    impactLevel: 'High',
    description: 'Following the Guardian\'s defeat, the regional stability collapsed, introducing dynamic weather and glitch anomalies.',
    impactScore: 70,
  },
  {
    id: 'm-5',
    day: 18,
    date: 'CYCLE 018',
    title: 'Players built the first settlement',
    category: 'Creations',
    responsibleEntity: 'Iron Builders',
    impactLevel: 'High',
    description: 'The Iron District saw the erection of Foundry Prime, a player-built fortress that now serves as a central hub.',
    impactScore: 60,
  },
  {
    id: 'm-6',
    day: 24,
    date: 'CYCLE 024',
    title: 'The Great Server War initiated',
    category: 'Battles',
    responsibleEntity: 'Rust Legion vs Vanguard',
    impactLevel: 'Critical',
    description: 'A dispute over resource nodes in the Iron District escalated into a massive territorial war, altering the regional borders permanently.',
    impactScore: 95,
  },
  {
    id: 'm-7',
    day: 30,
    date: 'CYCLE 030',
    title: 'Echo Forest manifested',
    category: 'Discoveries',
    responsibleEntity: 'Community Action',
    impactLevel: 'Medium',
    description: 'A new biome generated organically in response to the massive energy released during the Great Server War.',
    impactScore: 40,
  }
];
