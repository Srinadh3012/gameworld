const Player = require('../models/Player');

// @route   GET /api/players/me
// @desc    Get authenticated player profile
// @access  Private
const getMyProfile = async (req, res, next) => {
  try {
    const player = await Player.findOne({ firebaseUid: req.user.uid });
    
    if (!player) {
      return res.status(404).json({ success: false, message: 'Player profile not found.' });
    }

    res.json({ success: true, data: player });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/players
// @desc    Create or initialize player profile
// @access  Private
const createProfile = async (req, res, next) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ success: false, message: 'Username is required.' });
    }

    // Check if player already exists
    let player = await Player.findOne({ firebaseUid: req.user.uid });
    
    if (player) {
      return res.status(409).json({ success: false, message: 'Player profile already exists.' });
    }

    // Create new player (firebaseUid comes securely from the token)
    player = new Player({
      firebaseUid: req.user.uid,
      username: username,
      // Archetypes and stats will use defaults from the Schema
    });

    await player.save();

    res.status(201).json({ success: true, data: player });
  } catch (error) {
    next(error);
  }
};

// @route   PATCH /api/players/me
// @desc    Update authenticated player profile
// @access  Private
const updateMyProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    
    // Prevent sensitive fields from being updated directly
    delete updates.firebaseUid;
    delete updates._id;

    const player = await Player.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!player) {
      return res.status(404).json({ success: false, message: 'Player profile not found.' });
    }

    res.json({ success: true, data: player });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProfile,
  createProfile,
  updateMyProfile,
};
