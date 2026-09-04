export interface World {
  id: string;
  name: string;
  creator: string;
  level: number;
  players: number;
  event: string;
  difficulty: 'Peaceful' | 'Normal' | 'Hard' | 'Extreme';
  status: 'Stable' | 'Evolving' | 'Critical' | 'Unstable';
  history: string;
  recentEvents: string[];
}

export const DISCOVER_WORLDS: World[] = [
  {
    id: 'w-1',
    name: 'Neon Rift',
    creator: 'CyberArchitect_99',
    level: 45,
    players: 12450,
    event: 'Data Heist',
    difficulty: 'Hard',
    status: 'Evolving',
    history: 'Forged from the remnants of the old internet, Neon Rift is a vertical cyberpunk city where data is currency. Originally a peaceful trading hub, it recently fell into chaos after a massive data leak.',
    recentEvents: ['Sector 4 blackout', 'Corpo-sec forces deployed', 'Underground resistance mobilized']
  },
  {
    id: 'w-2',
    name: 'Forgotten Valley',
    creator: 'AncientOne',
    level: 22,
    players: 4320,
    event: 'Ancient Awakening',
    difficulty: 'Normal',
    status: 'Stable',
    history: 'A lush, overgrown ruin of a civilization that relied on magic instead of tech. The valley is known for its hidden artifacts and shifting labyrinthine dungeons.',
    recentEvents: ['Temple doors unlocked by community', 'New artifact type discovered', 'Mana storm passed']
  },
  {
    id: 'w-3',
    name: 'Iron District',
    creator: 'ForgeMaster',
    level: 88,
    players: 28900,
    event: 'Conflict State',
    difficulty: 'Extreme',
    status: 'Critical',
    history: 'A relentless industrial wasteland where factions fight for control of the grand foundries. The sky is perpetually gray, and the environment is harsh and unforgiving.',
    recentEvents: ['Foundry Alpha captured by Rust Legion', 'Toxin levels rising in lower sectors', 'Mecha-boss spawned']
  },
  {
    id: 'w-4',
    name: 'Echo Forest',
    creator: 'WandererX',
    level: 1,
    players: 127,
    event: 'Newly Discovered',
    difficulty: 'Peaceful',
    status: 'Stable',
    history: 'A bizarre biome where sounds manifest as physical structures. It was just discovered yesterday, and players are currently mapping its boundaries.',
    recentEvents: ['First outpost established', 'Flora cataloging started']
  }
];

export const LIVE_EVENTS = [
  { id: 'e-1', type: 'Territory Conflict', description: 'Rust Legion attempting to seize Foundry Alpha in the Iron District.', participants: '15,000+' },
  { id: 'e-2', type: 'World Anomaly', description: 'Gravity fluctuations detected in the upper levels of Neon Rift.', participants: 'Global' },
  { id: 'e-3', type: 'Mystery Discovery', description: 'A hidden vault was unsealed in the Forgotten Valley.', participants: '432' },
  { id: 'e-4', type: 'Resource Collapse', description: 'Crystal mines in Sector 7 are completely depleted.', participants: 'N/A' },
];

export const CHALLENGES = [
  { id: 'c-1', title: 'Survive the Mana Storm', type: 'Survival', creator: 'AncientOne', difficulty: 'Hard' },
  { id: 'c-2', title: 'Neon Highway Drift', type: 'Racing', creator: 'SpeedDemon', difficulty: 'Normal' },
  { id: 'c-3', title: 'Decrypt the Vault', type: 'Puzzle', creator: 'CyberArchitect_99', difficulty: 'Extreme' },
  { id: 'c-4', title: 'Clear the Rust Legion', type: 'Combat', creator: 'ForgeMaster', difficulty: 'Normal' },
];
