const GuardianEncounter = require('../models/GuardianEncounter');

const getOrCreateEncounter = async (playerId, worldId, guardianId) => {
  let encounter = await GuardianEncounter.findOne({ playerId, worldId, guardianId });
  if (!encounter) {
    encounter = new GuardianEncounter({ playerId, worldId, guardianId });
    await encounter.save();
  }
  return encounter;
};

// @route   GET /api/guardians
// @desc    Get all guardian encounters for player
// @access  Private
const getGuardians = async (req, res, next) => {
  try {
    const encounters = await GuardianEncounter.find({ playerId: req.user.uid });
    res.json({ success: true, data: encounters });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/guardians/:id/state
// @desc    Get specific guardian encounter state
// @access  Private
const getGuardianState = async (req, res, next) => {
  try {
    const { id: guardianId } = req.params;
    // Assume worldId is passed in query or default for now
    const worldId = req.query.worldId || 'sector-alpha-01';
    
    const encounter = await getOrCreateEncounter(req.user.uid, worldId, guardianId);
    res.json({ success: true, data: encounter });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/guardians/:id/start
// @desc    Start or restart a guardian encounter
// @access  Private
const startGuardian = async (req, res, next) => {
  try {
    const { id: guardianId } = req.params;
    const { worldId = 'sector-alpha-01' } = req.body;
    
    const encounter = await getOrCreateEncounter(req.user.uid, worldId, guardianId);
    
    if (!encounter.completed) {
      encounter.status = 'ACTIVE';
      encounter.currentPhase = 1;
      encounter.attempts += 1;
      encounter.failed = false;
      if (!encounter.startedAt) encounter.startedAt = new Date();
      await encounter.save();
    }
    
    res.json({ success: true, data: encounter });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/guardians/:id/progress
// @desc    Progress guardian phase
// @access  Private
const progressGuardian = async (req, res, next) => {
  try {
    const { id: guardianId } = req.params;
    const { worldId = 'sector-alpha-01', phase, choiceId, choiceValue } = req.body;
    
    const encounter = await getOrCreateEncounter(req.user.uid, worldId, guardianId);
    
    if (encounter.completed || encounter.failed) {
      return res.status(400).json({ success: false, message: 'Encounter is not active.' });
    }
    
    if (phase) encounter.currentPhase = phase;
    if (choiceId && choiceValue) {
      encounter.choices = { ...encounter.choices, [choiceId]: choiceValue };
      encounter.markModified('choices');
    }
    
    await encounter.save();
    res.json({ success: true, data: encounter });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/guardians/:id/complete
// @desc    Complete guardian encounter
// @access  Private
const completeGuardian = async (req, res, next) => {
  try {
    const { id: guardianId } = req.params;
    const { worldId = 'sector-alpha-01' } = req.body;
    
    const encounter = await getOrCreateEncounter(req.user.uid, worldId, guardianId);
    
    if (!encounter.completed) {
      encounter.status = 'RESOLVED';
      encounter.completed = true;
      encounter.completedAt = new Date();
      encounter.rewardsGranted = true;
      await encounter.save();
    }
    
    res.json({ success: true, data: encounter });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/guardians/:id/fail
// @desc    Fail guardian encounter
// @access  Private
const failGuardian = async (req, res, next) => {
  try {
    const { id: guardianId } = req.params;
    const { worldId = 'sector-alpha-01' } = req.body;
    
    const encounter = await getOrCreateEncounter(req.user.uid, worldId, guardianId);
    
    if (!encounter.completed) {
      encounter.status = 'RESTING';
      encounter.failed = true;
      encounter.currentPhase = 0;
      await encounter.save();
    }
    
    res.json({ success: true, data: encounter });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGuardians,
  getGuardianState,
  startGuardian,
  progressGuardian,
  completeGuardian,
  failGuardian
};
