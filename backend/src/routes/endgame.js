const express = require('express');
const router = express.Router();
const { verifyAuth } = require('../middleware/auth');
const EndgameState = require('../models/EndgameState');
const Player = require('../models/Player');

// Get endgame state for current player
router.get('/state/:worldId', verifyAuth, async (req, res) => {
  try {
    let state = await EndgameState.findOne({ playerId: req.user.uid, worldId: req.params.worldId });
    if (!state) {
      state = new EndgameState({ playerId: req.user.uid, worldId: req.params.worldId });
      await state.save();
    }
    res.json(state);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Evaluate and update endgame paths
router.post('/evaluate/:worldId', verifyAuth, async (req, res) => {
  try {
    const { preserverDelta, awakenerDelta, transformerDelta, unlockedPath, thresholdReached } = req.body;
    
    const update = {};
    if (preserverDelta || awakenerDelta || transformerDelta) {
      update.$inc = {};
      if (preserverDelta) update.$inc['scores.preserverScore'] = preserverDelta;
      if (awakenerDelta) update.$inc['scores.awakenerScore'] = awakenerDelta;
      if (transformerDelta) update.$inc['scores.transformerScore'] = transformerDelta;
    }
    if (unlockedPath) {
      update.$addToSet = { unlockedPaths: unlockedPath };
    }
    if (thresholdReached !== undefined) {
      update.thresholdReached = thresholdReached;
    }

    const state = await EndgameState.findOneAndUpdate(
      { playerId: req.user.uid, worldId: req.params.worldId },
      update,
      { new: true, upsert: true }
    );

    // If a definitive path is locked in (e.g. threshold reached and highest score), update Player legacy
    if (thresholdReached) {
      let finalPath = 'The Preserver';
      const { preserverScore, awakenerScore, transformerScore } = state.scores;
      if (awakenerScore > preserverScore && awakenerScore > transformerScore) finalPath = 'The Awakener';
      if (transformerScore > preserverScore && transformerScore > awakenerScore) finalPath = 'The Transformer';
      
      await Player.findOneAndUpdate(
        { firebaseUid: req.user.uid },
        { 'legacyStats.endgamePath': finalPath }
      );
    }

    res.json(state);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
