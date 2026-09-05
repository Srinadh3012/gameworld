const mongoose = require('mongoose');

const majorDecisionSchema = new mongoose.Schema(
  {
    decisionId: {
      type: String,
      required: true,
      index: true,
    },
    playerId: {
      type: String,
      required: true,
      index: true,
    },
    worldId: {
      type: String,
      required: true,
    },
    choice: {
      type: String,
      required: true,
    },
    location: {
      type: [Number],
      default: [0, 0, 0],
    },
    consequence: {
      type: String,
    },
    worldImpact: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

const MajorDecision = mongoose.model('MajorDecision', majorDecisionSchema);
module.exports = MajorDecision;
