const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
  getGuardians,
  getGuardianState,
  startGuardian,
  progressGuardian,
  completeGuardian,
  failGuardian
} = require('../controllers/guardianController');

router.use(verifyToken);

router.route('/')
  .get(getGuardians);

router.route('/:id/state')
  .get(getGuardianState);

router.route('/:id/start')
  .post(startGuardian);

router.route('/:id/progress')
  .post(progressGuardian);

router.route('/:id/complete')
  .post(completeGuardian);

router.route('/:id/fail')
  .post(failGuardian);

module.exports = router;
