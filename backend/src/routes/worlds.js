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
  updateEvent, 
  startEvent,
  completeEvent,
  failEvent
} = require('../controllers/eventController');
const {
  getWorldActions,
  createWorldAction,
} = require('../controllers/actionController');

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

router.route('/:id/events/:eventId/start')
  .post(startEvent);

router.route('/:id/events/:eventId/complete')
  .post(completeEvent);

router.route('/:id/events/:eventId/fail')
  .post(failEvent);

// Update event directly (typically mounted at /api/events, but we can do it here if preferred by path or separately)
// The prompt specified PATCH /api/events/:id, so it will be routed through server.js properly.

// World Action Routes
router.route('/:id/actions')
  .get(getWorldActions)
  .post(createWorldAction);

module.exports = router;
