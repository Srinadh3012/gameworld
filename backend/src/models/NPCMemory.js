const mongoose = require('mongoose');

const npcMemorySchema = new mongoose.Schema({
  playerId: {
    type: String,
    required: true
  },
  npcId: {
    type: String,
    required: true
  },
  memoryType: {
    type: String,
    required: true
  },
  importance: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('NPCMemory', npcMemorySchema);
