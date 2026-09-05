const mongoose = require('mongoose');

const playerEventProgressSchema = new mongoose.Schema(
  {
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
      index: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorldEvent',
      required: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'COMPLETED', 'FAILED'],
      default: 'ACTIVE',
    },
    progress: {
      type: Number,
      default: 0,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    failedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate tracking records for the same event and player
playerEventProgressSchema.index({ playerId: 1, eventId: 1 }, { unique: true });

const PlayerEventProgress = mongoose.model('PlayerEventProgress', playerEventProgressSchema);
module.exports = PlayerEventProgress;
