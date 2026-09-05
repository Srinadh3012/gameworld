const mongoose = require('mongoose');

const InventoryItemSchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 1,
  },
});

const PlayerInventorySchema = new mongoose.Schema({
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
    unique: true,
  },
  capacity: {
    type: Number,
    required: true,
    default: 24,
  },
  items: [InventoryItemSchema],
}, { timestamps: true });

module.exports = mongoose.model('PlayerInventory', PlayerInventorySchema);
