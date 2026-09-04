const WorldMemory = require('../models/WorldMemory');
const World = require('../models/World');

// @route   GET /api/worlds/:id/memories
// @desc    Get memories for a specific world
// @access  Private
const getWorldMemories = async (req, res, next) => {
  try {
    const { type } = req.query;
    const filter = { worldId: req.params.id };
    
    if (type) {
      filter.type = type;
    }

    const memories = await WorldMemory.find(filter).sort({ timestamp: 1 }); // Chronological order
    res.json({ success: true, data: memories });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/worlds/:id/memories
// @desc    Create a new memory in a world
// @access  Private
const createMemory = async (req, res, next) => {
  try {
    const { title, description, type, impact, actorName, metadata } = req.body;
    
    // Verify world exists
    const world = await World.findById(req.params.id);
    if (!world) {
      return res.status(404).json({ success: false, message: 'World not found.' });
    }

    const memory = new WorldMemory({
      worldId: req.params.id,
      title,
      description,
      type,
      impact,
      actorId: req.user.uid, // From auth token
      actorName: actorName || 'Unknown Player',
      metadata: metadata || {},
    });

    await memory.save();
    res.status(201).json({ success: true, data: memory });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWorldMemories,
  createMemory,
};
