require('dotenv').config();
const mongoose = require('mongoose');
const Player = require('../src/models/Player');
const World = require('../src/models/World');
const WorldMemory = require('../src/models/WorldMemory');
const WorldEvent = require('../src/models/WorldEvent');
const Creation = require('../src/models/Creation');

const seedDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is required to run the seed script.');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    // ONLY RUN IN DEV/SEED DB. We clear it out for a fresh seed.
    console.log('Clearing existing data...');
    await Promise.all([
      World.deleteMany({}),
      WorldMemory.deleteMany({}),
      WorldEvent.deleteMany({}),
      Creation.deleteMany({}),
    ]);

    // Create fake user ID since we don't have a real Firebase one right now
    const dummyUserId = 'dummy-firebase-uid-for-seed';

    console.log('Seeding worlds...');
    const world1 = await World.create({
      name: 'Neon Rift',
      slug: 'neon-rift',
      description: 'A cyberpunk metropolis bridging multiple dimensions.',
      creatorId: dummyUserId,
      status: 'Stable',
      evolutionLevel: 42,
      activePlayers: 12500,
    });

    const world2 = await World.create({
      name: 'Iron District',
      slug: 'iron-district',
      description: 'An industrial wasteland recovering from the Great Collapse.',
      creatorId: dummyUserId,
      status: 'Unstable',
      evolutionLevel: 15,
      activePlayers: 3200,
    });

    console.log('Seeding memories...');
    await WorldMemory.create([
      {
        worldId: world1._id,
        title: 'Built Foundry Prime',
        description: 'Constructed the largest player-driven trade hub.',
        type: 'Creation',
        impact: 85,
        actorId: dummyUserId,
        actorName: 'Cipher_Vanguard',
      },
      {
        worldId: world1._id,
        title: 'Discovered the Data Core',
        description: 'First player to map the underground networks.',
        type: 'Discovery',
        impact: 95,
        actorId: dummyUserId,
        actorName: 'Cipher_Vanguard',
      }
    ]);

    console.log('Seeding events...');
    await WorldEvent.create([
      {
        worldId: world1._id,
        title: 'Cyber Storm',
        description: 'Massive grid failure. Players must restore power.',
        type: 'Crisis',
        status: 'Active',
      }
    ]);

    console.log('Seeding creations...');
    await Creation.create([
      {
        creatorId: dummyUserId,
        worldId: world1._id,
        title: 'Plasma Bridge',
        description: 'A glowing bridge connecting Sector 4 and 5.',
        type: 'Structure',
        status: 'Active'
      },
      {
        creatorId: dummyUserId,
        worldId: world2._id,
        title: 'Rust Legion Outpost',
        description: 'Defensive perimeter for new players.',
        type: 'Structure',
        status: 'Active'
      }
    ]);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
