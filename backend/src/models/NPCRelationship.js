const mongoose = require('mongoose');

const npcRelationshipSchema = new mongoose.Schema({
  playerId: {
    type: String,
    required: true
  },
  npcId: {
    type: String,
    required: true
  },
  relationshipLevel: {
    type: Number,
    default: 0,
    min: -100,
    max: 100
  },
  unlockedKnowledge: {
    type: [String],
    default: []
  },
  lastInteraction: {
    type: Date,
    default: Date.now
  },
  flags: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: true });

// A player can only have one relationship state per NPC
npcRelationshipSchema.index({ playerId: 1, npcId: 1 }, { unique: true });

module.exports = mongoose.model('NPCRelationship', npcRelationshipSchema);
