const PlayerStoryState = require('../models/PlayerStoryState');

const getStoryStateRecord = async (firebaseUid) => {
  let state = await PlayerStoryState.findOne({ firebaseUid });
  if (!state) {
    state = new PlayerStoryState({ firebaseUid });
    await state.save();
  }
  return state;
};

// @route   GET /api/story/state
// @desc    Get authenticated player's story state
// @access  Private
const getStoryState = async (req, res, next) => {
  try {
    const state = await getStoryStateRecord(req.user.uid);
    res.json({ success: true, data: state });
  } catch (error) {
    next(error);
  }
};

// @route   PATCH /api/story/state
// @desc    Update story state directly (syncing from local to backend)
// @access  Private
const updateStoryState = async (req, res, next) => {
  try {
    const { storyFlags, activeMissions, completedMissions, failedMissions, choices, missionProgress, currentChapter } = req.body;
    const state = await getStoryStateRecord(req.user.uid);
    
    if (storyFlags) state.storyFlags = { ...state.storyFlags, ...storyFlags };
    if (choices) state.choices = { ...state.choices, ...choices };
    if (missionProgress) state.missionProgress = { ...state.missionProgress, ...missionProgress };
    
    if (activeMissions) state.activeMissions = activeMissions;
    if (completedMissions) state.completedMissions = completedMissions;
    if (failedMissions) state.failedMissions = failedMissions;
    if (currentChapter) state.currentChapter = currentChapter;
    
    state.markModified('storyFlags');
    state.markModified('choices');
    state.markModified('missionProgress');
    
    await state.save();
    res.json({ success: true, data: state });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/story/missions/:id/start
// @desc    Start a mission
// @access  Private
const startMission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const state = await getStoryStateRecord(req.user.uid);
    
    if (!state.activeMissions.includes(id) && !state.completedMissions.includes(id)) {
      state.activeMissions.push(id);
      await state.save();
    }
    res.json({ success: true, data: state });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/story/missions/:id/complete
// @desc    Complete a mission
// @access  Private
const completeMission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const state = await getStoryStateRecord(req.user.uid);
    
    state.activeMissions = state.activeMissions.filter(m => m !== id);
    if (!state.completedMissions.includes(id)) {
      state.completedMissions.push(id);
      await state.save();
    }
    res.json({ success: true, data: state });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStoryState,
  updateStoryState,
  startMission,
  completeMission
};
