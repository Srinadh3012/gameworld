const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
  leaderId: {
    type: String,
    required: true
  },
  members: [{
    uid: String,
    username: String,
    joinedAt: { type: Date, default: Date.now }
  }],
  activeMissionId: {
    type: String,
    default: null
  },
  maxSize: {
    type: Number,
    default: 4
  }
}, { timestamps: true });

module.exports = mongoose.model('Party', partySchema);
