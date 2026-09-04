const World = require('../models/World');

// @route   GET /api/worlds
// @desc    Get all worlds
// @access  Public (or Private depending on design, assuming Private for GAMEWORLD)
const getWorlds = async (req, res, next) => {
  try {
    const worlds = await World.find().sort({ createdAt: -1 });
    res.json({ success: true, data: worlds });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/worlds/:id
// @desc    Get a single world by ID
// @access  Private
const getWorldById = async (req, res, next) => {
  try {
    const world = await World.findById(req.params.id).populate('currentEvent');
    
    if (!world) {
      return res.status(404).json({ success: false, message: 'World not found.' });
    }
    
    res.json({ success: true, data: world });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/worlds
// @desc    Create a new world
// @access  Private
const createWorld = async (req, res, next) => {
  try {
    const { name, slug, description } = req.body;
    
    if (!name || !slug) {
      return res.status(400).json({ success: false, message: 'Name and slug are required.' });
    }

    const world = new World({
      name,
      slug,
      description,
      creatorId: req.user.uid, // Tie to authenticated user
    });

    await world.save();
    res.status(201).json({ success: true, data: world });
  } catch (error) {
    next(error);
  }
};

// @route   PATCH /api/worlds/:id
// @desc    Update a world
// @access  Private
const updateWorld = async (req, res, next) => {
  try {
    const world = await World.findById(req.params.id);
    
    if (!world) {
      return res.status(404).json({ success: false, message: 'World not found.' });
    }

    // Ownership check
    if (world.creatorId !== req.user.uid) {
      return res.status(403).json({ success: false, message: 'Unauthorized to modify this world.' });
    }

    const updates = req.body;
    delete updates._id;
    delete updates.creatorId; // Prevent changing ownership

    const updatedWorld = await World.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updatedWorld });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWorlds,
  getWorldById,
  createWorld,
  updateWorld,
};
