const mongoose = require('mongoose');

const playerProgressionSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    level: {
      type: Number,
      default: 1,
    },
    experience: {
      type: Number,
      default: 0,
    },
    totalExperience: {
      type: Number,
      default: 0,
    },
    skillPoints: {
      type: Number,
      default: 0,
    },
    explorationXP: {
      type: Number,
      default: 0,
    },
    discoveryXP: {
      type: Number,
      default: 0,
    },
    memoryXP: {
      type: Number,
      default: 0,
    },
    eventXP: {
      type: Number,
      default: 0,
    },
    craftingXP: {
      type: Number,
      default: 0,
    },
    worldImpactXP: {
      type: Number,
      default: 0,
    },
    unlockedAbilities: {
      type: [String],
      default: [],
    },
    completedMilestones: {
      type: [String],
      default: [],
    },
    claimedRewards: {
      type: [String], // Format: "SOURCE_ID" to prevent duplicate XP
      default: [],
    }
  },
  {
    timestamps: true,
  }
);

const PlayerProgression = mongoose.model('PlayerProgression', playerProgressionSchema);
module.exports = PlayerProgression;
