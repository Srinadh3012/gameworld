const express = require('express');
const router = express.Router();
const { verifyAuth } = require('../middleware/auth');
const {
  getMyProfile,
  createProfile,
  updateMyProfile,
} = require('../controllers/playerController');

// All player routes require authentication
router.use(verifyAuth);

router.route('/me')
  .get(getMyProfile)
  .patch(updateMyProfile);

router.route('/')
  .post(createProfile);

module.exports = router;
