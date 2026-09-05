const mongoose = require('mongoose');

const worldContributionSchema = new mongoose.Schema({
  worldId: {
    type: String,
    required: true,
    index: true
  },
  playerId: {
    type: String,
    required: true,
    index: true
  },
  eventId: {
    type: String, // ID of the cooperative event or mission
    required: true
  },
  contributionType: {
    type: String,
    enum: ['DISCOVERY', 'INTERACTION', 'RESOURCE', 'PUZZLE', 'EVENT', 'GUARDIAN', 'SUPPORT'],
    required: true
  },
  value: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

module.exports = mongoose.model('WorldContribution', worldContributionSchema);
