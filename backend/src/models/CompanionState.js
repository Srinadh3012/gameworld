const mongoose = require('mongoose');

const companionStateSchema = new mongoose.Schema({
  playerId: {
    type: String,
    required: true,
    unique: true
  },
  activeNpcId: {
    type: String,
    default: null
  },
  dismissalLocation: {
    type: [Number],
    default: null
  },
  stateData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('CompanionState', companionStateSchema);
