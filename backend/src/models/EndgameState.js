const mongoose = require('mongoose');

const endgameStateSchema = new mongoose.Schema(
  {
    playerId: {
      type: String,
      required: true,
      index: true,
    },
    worldId: {
      type: String,
      required: true,
    },
    unlockedPaths: {
      type: [String], // Preserver, Awakener, Transformer
      default: [],
    },
    scores: {
      preserverScore: { type: Number, default: 0 },
      awakenerScore: { type: Number, default: 0 },
      transformerScore: { type: Number, default: 0 }
    },
    thresholdReached: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

const EndgameState = mongoose.model('EndgameState', endgameStateSchema);
module.exports = EndgameState;
