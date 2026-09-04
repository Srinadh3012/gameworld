const express = require('express');
const router = express.Router();
const { verifyAuth } = require('../middleware/auth');
const {
  getCreations,
  getCreationById,
  createCreation,
  updateCreation,
} = require('../controllers/creationController');

router.use(verifyAuth);

router.route('/')
  .get(getCreations)
  .post(createCreation);

router.route('/:id')
  .get(getCreationById)
  .patch(updateCreation);

module.exports = router;
