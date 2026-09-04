const WorldEvent = require('../models/WorldEvent');
const World = require('../models/World');

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

module.exports = {
  getWorldEvents,
  createEvent,
  updateEvent,
};
