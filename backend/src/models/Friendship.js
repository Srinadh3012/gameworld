const mongoose = require('mongoose');

const friendshipSchema = new mongoose.Schema({
  requesterId: {
    type: String,
    required: true,
    index: true
  },
  receiverId: {
    type: String,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'DECLINED', 'BLOCKED'],
    default: 'PENDING'
  }
}, { timestamps: true });

friendshipSchema.index({ requesterId: 1, receiverId: 1 }, { unique: true });

module.exports = mongoose.model('Friendship', friendshipSchema);
