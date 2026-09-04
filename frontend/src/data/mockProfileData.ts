export interface ArchetypeTraits {
  explorer: number;
  builder: number;
  strategist: number;
  hunter: number;
  creator: number;
  guardian: number;
}

export interface PlayerProfile {
  id: string;
  username: string;
  avatarUrl: string;
  title: string;
  joinDate: string;
  legacyStats: {
    worldsDiscovered: number;
    worldsInfluenced: number;
    eventsParticipated: number;
    creations: number;
    discoveries: number;
    communityImpactScore: number;
  };
  archetypes: ArchetypeTraits;
  worldImpacts: {
    worldName: string;
    impactScore: number; // 0 to 100
    color: string;
  }[];
  memorableMoments: {
    id: string;
    title: string;
    description: string;
    date: string;
  }[];
  timeline: {
    id: string;
    action: string;
    world: string;
    date: string;
  }[];
}

export const MOCK_PLAYER_PROFILE: PlayerProfile = {
  id: 'p-1',
  username: 'Cipher_Vanguard',
  avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Cipher&backgroundColor=0a0a0a',
  title: 'Architect of the Neon Rift',
  joinDate: 'CYCLE 001',
  legacyStats: {
    worldsDiscovered: 4,
    worldsInfluenced: 12,
    eventsParticipated: 34,
    creations: 89,
    discoveries: 15,
    communityImpactScore: 9420,
  },
  archetypes: {
    explorer: 75,
    builder: 90,
    strategist: 60,
    hunter: 30,
    creator: 85,
    guardian: 50,
  },
  worldImpacts: [
    { worldName: 'Neon Rift', impactScore: 95, color: '#00f0ff' },
    { worldName: 'Iron District', impactScore: 60, color: '#ff3366' },
    { worldName: 'Forgotten Valley', impactScore: 25, color: '#22c55e' },
    { worldName: 'Echo Forest', impactScore: 10, color: '#8a2be2' },
  ],
  memorableMoments: [
    {
      id: 'mm-1',
      title: 'Built Foundry Prime',
      description: 'Constructed the largest player-driven trade hub in the Iron District.',
      date: 'CYCLE 018'
    },
    {
      id: 'mm-2',
      title: 'Discovered the Data Core',
      description: 'First player to map the underground networks of the Neon Rift.',
      date: 'CYCLE 004'
    }
  ],
  timeline: [
    { id: 't-1', action: 'Constructed Plasma Bridge', world: 'Neon Rift', date: 'CYCLE 032' },
    { id: 't-2', action: 'Defended Sector 4', world: 'Neon Rift', date: 'CYCLE 028' },
    { id: 't-3', action: 'Forged Alliance with Rust Legion', world: 'Iron District', date: 'CYCLE 024' },
    { id: 't-4', action: 'Discovered Ancient Obelisk', world: 'Forgotten Valley', date: 'CYCLE 015' },
    { id: 't-5', action: 'Entered GAMEWORLD', world: 'Origin Point', date: 'CYCLE 001' },
  ]
};
