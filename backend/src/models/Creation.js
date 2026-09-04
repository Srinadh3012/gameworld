const mongoose = require('mongoose');

const creationSchema = new mongoose.Schema(
  {
    creatorId: {
      type: String, // Firebase UID
      required: true,
      index: true,
    },
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
      default: '',
    },
    type: {
      type: String,
      enum: ['Structure', 'Artifact', 'Challenge', 'Lore'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Destroyed', 'Hidden'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

const Creation = mongoose.model('Creation', creationSchema);
module.exports = Creation;
