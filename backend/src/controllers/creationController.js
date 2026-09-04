const Creation = require('../models/Creation');

// @route   GET /api/creations
// @desc    Get creations (can filter by worldId or creatorId)
// @access  Private
const getCreations = async (req, res, next) => {
  try {
    const { worldId, creatorId } = req.query;
    const filter = {};
    
    if (worldId) filter.worldId = worldId;
    if (creatorId) filter.creatorId = creatorId;

    const creations = await Creation.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: creations });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/creations/:id
// @desc    Get a single creation
// @access  Private
const getCreationById = async (req, res, next) => {
  try {
    const creation = await Creation.findById(req.params.id);
    
    if (!creation) {
      return res.status(404).json({ success: false, message: 'Creation not found.' });
    }
    
    res.json({ success: true, data: creation });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/creations
// @desc    Create a new creation
// @access  Private
const createCreation = async (req, res, next) => {
  try {
    const { worldId, title, description, type } = req.body;
    
    const creation = new Creation({
      creatorId: req.user.uid,
      worldId,
      title,
      description,
      type,
    });

    await creation.save();
    res.status(201).json({ success: true, data: creation });
  } catch (error) {
    next(error);
  }
};

// @route   PATCH /api/creations/:id
// @desc    Update a creation
// @access  Private
const updateCreation = async (req, res, next) => {
  try {
    const creation = await Creation.findById(req.params.id);
    
    if (!creation) {
      return res.status(404).json({ success: false, message: 'Creation not found.' });
    }

    if (creation.creatorId !== req.user.uid) {
      return res.status(403).json({ success: false, message: 'Unauthorized to modify this creation.' });
    }

    const updates = req.body;
    delete updates._id;
    delete updates.creatorId;
    delete updates.worldId;

    const updatedCreation = await Creation.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updatedCreation });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCreations,
  getCreationById,
  createCreation,
  updateCreation,
};
