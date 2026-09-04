const express = require('express');
const router = express.Router();
const { verifyAuth } = require('../middleware/auth');
const {
  getWorlds,
  getWorldById,
  createWorld,
  updateWorld,
} = require('../controllers/worldController');
const {
  getWorldMemories,
  createMemory,
} = require('../controllers/memoryController');
const {
  getWorldEvents,
  createEvent,
  updateEvent, // Note: updateEvent is technically /api/events/:id, but we'll mount it accordingly
} = require('../controllers/eventController');

// All world routes require authentication for GAMEWORLD
router.use(verifyAuth);

// Core World Routes
router.route('/')
  .get(getWorlds)
  .post(createWorld);

router.route('/:id')
  .get(getWorldById)
  .patch(updateWorld);

// World Memory Routes
router.route('/:id/memories')
  .get(getWorldMemories)
  .post(createMemory);

// World Event Routes
router.route('/:id/events')
  .get(getWorldEvents)
  .post(createEvent);

// Update event directly (typically mounted at /api/events, but we can do it here if preferred by path or separately)
// The prompt specified PATCH /api/events/:id, so it will be routed through server.js properly.

module.exports = router;
