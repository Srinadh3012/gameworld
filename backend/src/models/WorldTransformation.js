const mongoose = require('mongoose');

const worldTransformationSchema = new mongoose.Schema(
  {
    worldId: {
      type: String,
      required: true,
      index: true,
    },
    regionId: {
      type: String,
      required: true,
    },
    trigger: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
    },
    transformation: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

const WorldTransformation = mongoose.model('WorldTransformation', worldTransformationSchema);
module.exports = WorldTransformation;
