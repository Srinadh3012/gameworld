const mongoose = require('mongoose');

const worldSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
    },
    creatorId: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['Stable', 'Unstable', 'Evolving', 'Collapsed'],
      default: 'Stable',
    },
    evolutionLevel: {
      type: Number,
      default: 1,
    },
    activePlayers: {
      type: Number,
      default: 0,
    },
    regions: [{
      name: String,
      activity: String,
      players: Number,
    }],
    currentEvent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorldEvent',
    },
  },
  {
    timestamps: true,
  }
);

const World = mongoose.model('World', worldSchema);
module.exports = World;
