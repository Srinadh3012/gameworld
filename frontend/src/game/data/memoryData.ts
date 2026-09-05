export interface WorldMemory {
  id: string;
  title: string;
  description: string;
  type: 'echo' | 'fragment' | 'core_record';
  impact: string;
  location: [number, number, number];
  discoveryStatus: 'locked' | 'discovered';
  discoveryTimestamp?: string;
}

export const MEMORY_DATA: Record<string, WorldMemory> = {
  'memory_stone_1': {
    id: 'memory_stone_1',
    title: 'The First Footstep',
    description: 'Someone changed this place before you arrived. The ground here remembers footsteps that have not happened yet.',
    type: 'fragment',
    impact: 'Reveals early history of Sector Alpha.',
    location: [12, 0, -18],
    discoveryStatus: 'locked'
  },
  'memory_stone_2': {
    id: 'memory_stone_2',
    title: 'The Shattered Wall',
    description: 'The ground here remembers footsteps that have not happened yet.',
    type: 'fragment',
    impact: 'Hints at previous world collisions.',
    location: [-25, 0, -35],
    discoveryStatus: 'locked'
  },
  'memory_stone_3': {
    id: 'memory_stone_3',
    title: 'Echo of Tomorrow',
    description: 'This fragment holds the echo of a decision not yet made.',
    type: 'echo',
    impact: 'Resonates with the World Core.',
    location: [40, 0, 30],
    discoveryStatus: 'locked'
  }
};
