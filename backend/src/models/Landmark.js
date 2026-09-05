const mongoose = require('mongoose');

const landmarkSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  worldId: {
    type: String,
    required: true
  },
  regionId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['landmark', 'secret', 'memory', 'event'],
    default: 'landmark'
  },
  position: {
    type: [Number],
    required: true,
    validate: [v => v.length === 3, 'Position must have x, y, z coordinates']
  },
  requiredLevel: {
    type: Number,
    default: 1
  },
  importance: {
    type: String,
    enum: ['normal', 'major', 'critical'],
    default: 'normal'
  }
}, { timestamps: true });

module.exports = mongoose.model('Landmark', landmarkSchema);
