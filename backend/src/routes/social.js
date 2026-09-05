const express = require('express');
const router = express.Router();
const { verifyAuth } = require('../middleware/auth');
const Friendship = require('../models/Friendship');
const Party = require('../models/Party');
const SocialReport = require('../models/SocialReport');
const Player = require('../models/Player');

// Get all friends (accepted and pending)
router.get('/friends', verifyAuth, async (req, res) => {
  try {
    const friends = await Friendship.find({
      $or: [{ requesterId: req.user.uid }, { receiverId: req.user.uid }]
    });
    res.json({ success: true, data: friends });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Send friend request
router.post('/friends/request', verifyAuth, async (req, res) => {
  try {
    const { targetUid } = req.body;
    if (targetUid === req.user.uid) {
      return res.status(400).json({ success: false, error: 'Cannot send request to yourself' });
    }
    
    // Check if exists
    let existing = await Friendship.findOne({
      $or: [
        { requesterId: req.user.uid, receiverId: targetUid },
        { requesterId: targetUid, receiverId: req.user.uid }
      ]
    });
    
    if (existing) {
      return res.status(400).json({ success: false, error: 'Relationship already exists' });
    }
    
    const request = await Friendship.create({
      requesterId: req.user.uid,
      receiverId: targetUid,
      status: 'PENDING'
    });
    
    res.json({ success: true, data: request });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Accept request
router.post('/friends/accept', verifyAuth, async (req, res) => {
  try {
    const { requestId } = req.body;
    const request = await Friendship.findOneAndUpdate(
      { _id: requestId, receiverId: req.user.uid, status: 'PENDING' },
      { status: 'ACCEPTED' },
      { new: true }
    );
    if (!request) return res.status(404).json({ success: false, error: 'Request not found' });
    res.json({ success: true, data: request });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Block and Report
router.post('/block/:id', verifyAuth, async (req, res) => {
  try {
    const block = await Friendship.findOneAndUpdate(
      { requesterId: req.user.uid, receiverId: req.params.id },
      { status: 'BLOCKED' },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: block });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/report', verifyAuth, async (req, res) => {
  try {
    const { targetUid, reason, notes } = req.body;
    const report = await SocialReport.create({
      reporterId: req.user.uid,
      reportedPlayerId: targetUid,
      reason,
      notes
    });
    res.json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
