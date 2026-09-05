const express = require('express');
const router = express.Router();
const PlayerExploration = require('../models/PlayerExploration');
const { verifyAuth } = require('../middleware/auth');
const {
  getMyProfile,
  createProfile,
  updateMyProfile,
  getMyEvents,
  getMyAchievements,
  getMyInventory,
  collectItem,
  useItem,
  dropItem,
  craftItem,
  getProgression,
  awardXP,
  unlockAbility,
  getCompanions,
  inviteCompanion,
  dismissCompanion,
  interactCompanion,
  getCompanionMemories
} = require('../controllers/playerController');

// All player routes require authentication
router.use(verifyAuth);

router.route('/me')
  .get(getMyProfile)
  .patch(updateMyProfile);

router.route('/me/events')
  .get(getMyEvents);

router.route('/me/achievements')
  .get(getMyAchievements);

router.route('/me/inventory')
  .get(getMyInventory);

router.route('/me/inventory/collect')
  .post(collectItem);

router.route('/me/inventory/use')
  .post(useItem);

router.route('/me/inventory/drop')
  .post(dropItem);

router.route('/me/crafting/craft')
  .post(craftItem);

router.route('/me/progression')
  .get(getProgression);

router.route('/me/progression/xp')
  .post(awardXP);

router.route('/me/progression/unlock-ability')
  .post(unlockAbility);

router.route('/')
  .post(createProfile);

// Companion routes
router.route('/me/companions')
  .get(getCompanions);

router.route('/me/companions/:npcId/invite')
  .post(inviteCompanion);

router.route('/me/companions/:npcId/dismiss')
  .post(dismissCompanion);

router.route('/me/companions/:npcId/interact')
  .post(interactCompanion);

router.route('/me/companions/:npcId/memories')
  .get(getCompanionMemories);

// Get Player Exploration State
router.get('/me/exploration', async (req, res) => {
  try {
    let exploration = await PlayerExploration.findOne({ playerId: req.user.uid });
    if (!exploration) {
      exploration = new PlayerExploration({ playerId: req.user.uid });
      await exploration.save();
    }
    res.json(exploration);
  } catch (error) {
    console.error('Error fetching exploration:', error);
    res.status(500).json({ error: 'Server error fetching exploration' });
  }
});

// Update Discovered Regions/Landmarks
router.post('/me/exploration/discover', async (req, res) => {
  try {
    const { type, id } = req.body;
    let exploration = await PlayerExploration.findOne({ playerId: req.user.uid });
    
    if (!exploration) {
      exploration = new PlayerExploration({ playerId: req.user.uid });
    }

    if (type === 'region' && !exploration.discoveredRegions.includes(id)) {
      exploration.discoveredRegions.push(id);
    } else if (type === 'landmark' && !exploration.discoveredLandmarks.includes(id)) {
      exploration.discoveredLandmarks.push(id);
    }

    await exploration.save();
    res.json(exploration);
  } catch (error) {
    console.error('Error updating exploration:', error);
    res.status(500).json({ error: 'Server error updating exploration' });
  }
});

// Fast Travel Unlock
router.post('/me/fast-travel', async (req, res) => {
  try {
    const { landmarkId } = req.body;
    let exploration = await PlayerExploration.findOne({ playerId: req.user.uid });
    
    if (!exploration) {
      exploration = new PlayerExploration({ playerId: req.user.uid });
    }

    if (!exploration.fastTravelNodes.includes(landmarkId)) {
      exploration.fastTravelNodes.push(landmarkId);
      await exploration.save();
    }
    
    res.json({ success: true, fastTravelNodes: exploration.fastTravelNodes });
  } catch (error) {
    console.error('Error unlocking fast travel:', error);
    res.status(500).json({ error: 'Server error unlocking fast travel' });
  }
});

module.exports = router;
