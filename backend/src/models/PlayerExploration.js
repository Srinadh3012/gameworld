const mongoose = require('mongoose');

const playerExplorationSchema = new mongoose.Schema({
  playerId: {
    type: String,
    required: true,
    unique: true
  },
  discoveredRegions: {
    type: [String],
    default: []
  },
  discoveredLandmarks: {
    type: [String],
    default: []
  },
  fastTravelNodes: {
    type: [String],
    default: []
  },
  overallExplorationPercentage: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('PlayerExploration', playerExplorationSchema);
