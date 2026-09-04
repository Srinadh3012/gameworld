const mongoose = require('mongoose');

const worldMemorySchema = new mongoose.Schema(
  {
    worldId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'World',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Discovery', 'Battle', 'Creation', 'Mystery', 'Community'],
      required: true,
      index: true,
    },
    impact: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    actorId: {
      type: String,
      required: true, // Tied strictly to Firebase UID
    },
    actorName: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true, // also gives createdAt and updatedAt
  }
);

const WorldMemory = mongoose.model('WorldMemory', worldMemorySchema);
module.exports = WorldMemory;
