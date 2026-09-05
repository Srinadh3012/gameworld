const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
  getStoryState,
  updateStoryState,
  startMission,
  completeMission
} = require('../controllers/storyController');

// All story routes require authentication
router.use(verifyToken);

router.route('/state')
  .get(getStoryState)
  .patch(updateStoryState);

router.route('/missions/:id/start')
  .post(startMission);

router.route('/missions/:id/complete')
  .post(completeMission);

module.exports = router;
