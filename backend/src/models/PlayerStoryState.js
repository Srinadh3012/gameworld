const mongoose = require('mongoose');

const playerStoryStateSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  currentChapter: { type: Number, default: 1 },
  storyFlags: { type: mongoose.Schema.Types.Mixed, default: {} },
  activeMissions: { type: [String], default: [] },
  completedMissions: { type: [String], default: [] },
  failedMissions: { type: [String], default: [] },
  choices: { type: mongoose.Schema.Types.Mixed, default: {} },
  missionProgress: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('PlayerStoryState', playerStoryStateSchema);
