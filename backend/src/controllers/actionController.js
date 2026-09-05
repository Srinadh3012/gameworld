const World = require('../models/World');
const WorldAction = require('../models/WorldAction');
const WorldMemory = require('../models/WorldMemory');

// Helper to determine impact based on action
function calculateImpact(actionType) {
  switch (actionType) {
    case 'DISCOVER_REGION':
    case 'ENTERED_REGION':
      return 1;
    case 'DISCOVER_MEMORY':
    case 'DISCOVERED_MEMORY':
      return 3;
    case 'MAKE_WORLD_CHOICE':
      return 5;
    case 'ACTIVATE_CORE':
    case 'ACTIVATED_CORE':
      return 10;
    default:
      return 0;
  }
}

// Helper to calculate evolution level based on total impact
function getEvolutionLevel(totalImpact) {
  if (totalImpact < 20) return 1;
  if (totalImpact < 50) return 2;
  if (totalImpact < 100) return 3;
  if (totalImpact < 200) return 4;
  return 5;
}

// @route   POST /api/worlds/:id/actions
// @desc    Record a new world action and potentially evolve the world
// @access  Private
const createWorldAction = async (req, res, next) => {
  try {
    const worldId = req.params.id;
    const { actionType, location, metadata, createMemory } = req.body;
    
    // Check if world exists
    const world = await World.findById(worldId);
    if (!world) {
      return res.status(404).json({ success: false, message: 'World not found.' });
    }

    const impact = calculateImpact(actionType);

    // Create Action
    const action = new WorldAction({
      worldId,
      playerId: req.user.uid,
      actionType,
      location,
      metadata,
      impact
    });
    
    await action.save();

    // If requested, also create a memory (for big choices)
    if (createMemory) {
      const memory = new WorldMemory({
        worldId,
        title: createMemory.title || `Memory of ${actionType}`,
        description: createMemory.description || 'A trace left behind.',
        type: createMemory.type || 'Discovery',
        impact: impact,
        actorId: req.user.uid,
        actorName: createMemory.actorName || 'Explorer',
        metadata
      });
      await memory.save();
    }

    // Update World State (Impact sum isn't explicitly stored, but we can store it in 'activePlayers' as a hack or just update evolution)
    // For a real app we'd add `totalImpact` to the World schema, but we'll try to just query it
    const allActions = await WorldAction.find({ worldId });
    const totalImpact = allActions.reduce((sum, a) => sum + a.impact, 0);
    
    const newEvolutionLevel = getEvolutionLevel(totalImpact);
    
    let status = world.status;
    if (newEvolutionLevel >= 2) status = 'Evolving';
    
    world.evolutionLevel = newEvolutionLevel;
    world.status = status;
    await world.save();

    res.status(201).json({ 
      success: true, 
      data: {
        action,
        worldState: {
          evolutionLevel: world.evolutionLevel,
          totalImpact,
          status: world.status
        }
      } 
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/worlds/:id/actions
// @desc    Get actions for a world
// @access  Private
const getWorldActions = async (req, res, next) => {
  try {
    const actions = await WorldAction.find({ worldId: req.params.id }).sort({ timestamp: 1 });
    res.json({ success: true, data: actions });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createWorldAction,
  getWorldActions
};
