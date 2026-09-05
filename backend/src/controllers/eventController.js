const WorldEvent = require('../models/WorldEvent');
const World = require('../models/World');
const Player = require('../models/Player');
const PlayerEventProgress = require('../models/PlayerEventProgress');
const WorldAction = require('../models/WorldAction');

// @route   GET /api/worlds/:id/events
// @desc    Get events for a specific world
// @access  Private
const getWorldEvents = async (req, res, next) => {
  try {
    const events = await WorldEvent.find({ worldId: req.params.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: events });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/worlds/:id/events
// @desc    Create a new event in a world
// @access  Private
const createEvent = async (req, res, next) => {
  try {
    const { title, description, type, location, startedAt, endedAt } = req.body;
    
    const world = await World.findById(req.params.id);
    if (!world) {
      return res.status(404).json({ success: false, message: 'World not found.' });
    }

    const event = new WorldEvent({
      worldId: req.params.id,
      title,
      description,
      type,
      location,
      status: 'Upcoming',
      participants: [],
      startedAt,
      endedAt,
    });

    await event.save();
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

// @route   PATCH /api/events/:id
// @desc    Update an event
// @access  Private
const updateEvent = async (req, res, next) => {
  try {
    // In a real game, only admins/system should update events.
    // For now, we'll allow it with basic validation.
    const updates = req.body;
    delete updates._id;
    delete updates.worldId;

    const event = await WorldEvent.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    res.json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/worlds/:id/events/:eventId/start
// @desc    Start an event for a player
// @access  Private
const startEvent = async (req, res, next) => {
  try {
    const player = await Player.findOne({ firebaseUid: req.user.uid });
    if (!player) return res.status(404).json({ success: false, message: 'Player not found.' });

    const event = await WorldEvent.findById(req.params.eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });

    let progress = await PlayerEventProgress.findOne({ playerId: player._id, eventId: event._id });
    if (progress) {
      if (progress.status === 'ACTIVE') {
        return res.status(400).json({ success: false, message: 'Event is already active.' });
      }
      if (progress.status === 'COMPLETED') {
        return res.status(400).json({ success: false, message: 'Event already completed.' });
      }
    }

    if (!progress) {
      progress = new PlayerEventProgress({
        playerId: player._id,
        eventId: event._id,
        status: 'ACTIVE',
      });
    } else {
      // Allow restarting a failed event
      progress.status = 'ACTIVE';
      progress.startedAt = Date.now();
    }
    await progress.save();

    res.json({ success: true, data: progress });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/worlds/:id/events/:eventId/complete
// @desc    Complete an event for a player
// @access  Private
const completeEvent = async (req, res, next) => {
  try {
    const player = await Player.findOne({ firebaseUid: req.user.uid });
    if (!player) return res.status(404).json({ success: false, message: 'Player not found.' });

    const progress = await PlayerEventProgress.findOne({ playerId: player._id, eventId: req.params.eventId });
    if (!progress || progress.status !== 'ACTIVE') {
      return res.status(400).json({ success: false, message: 'Event is not active.' });
    }

    progress.status = 'COMPLETED';
    progress.progress = 100;
    progress.completedAt = Date.now();
    await progress.save();

    // Increment player legacy stats
    player.legacyStats.eventsParticipated = (player.legacyStats.eventsParticipated || 0) + 1;
    await player.save();

    res.json({ success: true, data: progress });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/worlds/:id/events/:eventId/fail
// @desc    Fail an event for a player
// @access  Private
const failEvent = async (req, res, next) => {
  try {
    const player = await Player.findOne({ firebaseUid: req.user.uid });
    if (!player) return res.status(404).json({ success: false, message: 'Player not found.' });

    const progress = await PlayerEventProgress.findOne({ playerId: player._id, eventId: req.params.eventId });
    if (!progress || progress.status !== 'ACTIVE') {
      return res.status(400).json({ success: false, message: 'Event is not active.' });
    }

    progress.status = 'FAILED';
    progress.failedAt = Date.now();
    await progress.save();

    res.json({ success: true, data: progress });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWorldEvents,
  createEvent,
  updateEvent,
  startEvent,
  completeEvent,
  failEvent,
};
