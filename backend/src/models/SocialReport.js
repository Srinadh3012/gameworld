const mongoose = require('mongoose');

const socialReportSchema = new mongoose.Schema({
  reporterId: {
    type: String,
    required: true
  },
  reportedPlayerId: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    enum: ['HARASSMENT', 'SPAM', 'INAPPROPRIATE_BEHAVIOR', 'EXPLOIT', 'OTHER'],
    required: true
  },
  notes: String,
  status: {
    type: String,
    enum: ['OPEN', 'REVIEWED', 'ACTIONED'],
    default: 'OPEN'
  }
}, { timestamps: true });

module.exports = mongoose.model('SocialReport', socialReportSchema);
