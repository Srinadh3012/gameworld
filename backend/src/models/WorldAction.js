const mongoose = require('mongoose');

const worldActionSchema = new mongoose.Schema(
  {
    worldId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'World',
      required: true,
      index: true,
    },
    playerId: {
      type: String,
      required: true,
      index: true, // Firebase UID
    },
    actionType: {
      type: String,
      required: true,
      enum: ['DISCOVER_REGION', 'DISCOVER_MEMORY', 'INSPECT_OBJECT', 'ACTIVATE_CORE', 'ENTER_LANDMARK', 'COMPLETE_EVENT', 'MAKE_WORLD_CHOICE', 'DISCOVERED_MEMORY', 'ENTERED_REGION', 'ACTIVATED_CORE'],
      index: true,
    },
    location: {
      type: [Number], // [x, y, z]
      default: [0, 0, 0],
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    impact: {
      type: Number,
      default: 0,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const WorldAction = mongoose.model('WorldAction', worldActionSchema);
module.exports = WorldAction;
