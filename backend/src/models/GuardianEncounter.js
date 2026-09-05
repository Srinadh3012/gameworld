const mongoose = require('mongoose');

const guardianEncounterSchema = new mongoose.Schema({
  playerId: { type: String, required: true },
  guardianId: { type: String, required: true },
  worldId: { type: String, required: true },
  status: { type: String, enum: ['DORMANT', 'WATCHING', 'AWAKENING', 'ACTIVE', 'CHALLENGE', 'ENRAGED', 'RESOLVED', 'RESTING'], default: 'DORMANT' },
  attempts: { type: Number, default: 0 },
  currentPhase: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  failed: { type: Boolean, default: false },
  choices: { type: mongoose.Schema.Types.Mixed, default: {} },
  discoveredSecrets: { type: [String], default: [] },
  rewardsGranted: { type: Boolean, default: false },
  worldImpact: { type: Number, default: 0 },
  startedAt: { type: Date },
  completedAt: { type: Date }
}, { timestamps: true });

// Ensure unique encounter per player per guardian
guardianEncounterSchema.index({ playerId: 1, guardianId: 1, worldId: 1 }, { unique: true });

module.exports = mongoose.model('GuardianEncounter', guardianEncounterSchema);
