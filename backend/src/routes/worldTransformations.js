const express = require('express');
const router = express.Router();
const { verifyAuth } = require('../middleware/auth');
const WorldTransformation = require('../models/WorldTransformation');
const World = require('../models/World');
const Player = require('../models/Player');
const MajorDecision = require('../models/MajorDecision');

// Get active transformations for a world
router.get('/:worldId/transformations', async (req, res) => {
  try {
    const transformations = await WorldTransformation.find({ worldId: req.params.worldId, active: true });
    res.json(transformations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Apply a new transformation
router.post('/:worldId/transformations/apply', verifyAuth, async (req, res) => {
  try {
    const { regionId, trigger, transformation, condition } = req.body;
    
    // Check for duplicate
    const existing = await WorldTransformation.findOne({
      worldId: req.params.worldId,
      regionId,
      trigger,
      transformation
    });

    if (existing) {
      return res.status(400).json({ message: 'Transformation already applied.' });
    }

    const newTransformation = new WorldTransformation({
      worldId: req.params.worldId,
      regionId,
      trigger,
      transformation,
      condition,
      active: true
    });

    await newTransformation.save();
    
    // Update player legacy stats
    await Player.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      { $inc: { 'legacyStats.worldChangesCaused': 1 } }
    );

    res.status(201).json(newTransformation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Post a major decision
router.post('/:worldId/decisions', verifyAuth, async (req, res) => {
  try {
    const { decisionId, choice, consequence, location, worldImpact } = req.body;

    const decision = new MajorDecision({
      decisionId,
      playerId: req.user.uid,
      worldId: req.params.worldId,
      choice,
      consequence,
      location,
      worldImpact
    });

    await decision.save();

    // Update player legacy stats
    await Player.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      { $inc: { 'legacyStats.majorDecisions': 1 } }
    );

    res.status(201).json(decision);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get decisions history
router.get('/:worldId/history', async (req, res) => {
  try {
    const history = await MajorDecision.find({ worldId: req.params.worldId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
