const mongoose = require('mongoose');

const playerAchievementSchema = new mongoose.Schema(
  {
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
      index: true,
    },
    achievementId: {
      type: String,
      required: true,
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate achievements for the same player
playerAchievementSchema.index({ playerId: 1, achievementId: 1 }, { unique: true });

const PlayerAchievement = mongoose.model('PlayerAchievement', playerAchievementSchema);
module.exports = PlayerAchievement;
