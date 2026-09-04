const mongoose = require('mongoose');

const worldEventSchema = new mongoose.Schema(
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
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Completed', 'Failed', 'Upcoming'],
      default: 'Upcoming',
      index: true,
    },
    location: {
      type: String,
    },
    participants: [{
      type: String, // Firebase UIDs
    }],
    startedAt: {
      type: Date,
    },
    endedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const WorldEvent = mongoose.model('WorldEvent', worldEventSchema);
module.exports = WorldEvent;
