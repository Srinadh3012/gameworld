const mongoose = require('mongoose');

const worldEventSchema = new mongoose.Schema(
  {
    worldId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'World',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['UNKNOWN', 'EASY', 'MEDIUM', 'HARD', 'EXTREME'],
      default: 'UNKNOWN',
    },
    risk: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'LOW',
    },
    requiredEvolutionLevel: {
      type: Number,
      default: 1,
    },
    reward: {
      type: String,
    },
    impactReward: {
      type: Number,
      default: 0,
    },
    objectives: [{
      id: String,
      description: String,
    }],
    status: {
      type: String,
      enum: ['LOCKED', 'AVAILABLE', 'ACTIVE', 'COMPLETED', 'FAILED', 'EXPIRED', 'Upcoming'],
      default: 'LOCKED',
      index: true,
    },
    location: {
      type: [Number], // x, y, z
    },
    expiresAt: {
      type: Date,
    },
    participants: [{
      type: String, // Firebase UIDs
    }],
    startedAt: {
      type: Date,
    },
    endedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const WorldEvent = mongoose.model('WorldEvent', worldEventSchema);
module.exports = WorldEvent;
