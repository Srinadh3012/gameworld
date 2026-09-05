const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      index: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: 'Initiate',
    },
    archetypes: {
      type: Map,
      of: Number,
      default: {
        Explorer: 10,
        Builder: 10,
        Strategist: 10,
        Hunter: 10,
        Creator: 10,
        Guardian: 10,
      }
    },
    evolution: {
      level: { type: Number, default: 1 },
      xp: { type: Number, default: 0 },
    },
    legacyStats: {
      worldsDiscovered: { type: Number, default: 0 },
      worldsInfluenced: { type: Number, default: 0 },
      eventsParticipated: { type: Number, default: 0 },
      creations: { type: Number, default: 0 },
      communityImpact: { type: Number, default: 0 },
      worldChangesCaused: { type: Number, default: 0 },
      majorDecisionsMade: { type: Number, default: 0 },
      endgamePathProgress: {
        type: Map,
        of: Number,
        default: () => new Map([['The Preserver', 0], ['The Awakener', 0], ['The Transformer', 0]])
      },
      // Multiplayer legacy stats
      explorersMet: { type: Number, default: 0 },
      cooperativeEvents: { type: Number, default: 0 },
      sharedDiscoveries: { type: Number, default: 0 },
      worldContributions: { type: Number, default: 0 },
      guardiansAssisted: { type: Number, default: 0 },
      partyMissions: { type: Number, default: 0 }
    },
  },
  {
    timestamps: true,
  }
);

// We ensure no client-provided firebaseUid can override the actual token UID 
// at the controller level, but this schema sets the permanent foundation.

const Player = mongoose.model('Player', playerSchema);
module.exports = Player;
