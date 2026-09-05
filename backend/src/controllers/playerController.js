const Player = require('../models/Player');
const PlayerEventProgress = require('../models/PlayerEventProgress');
const PlayerAchievement = require('../models/PlayerAchievement');
const PlayerInventory = require('../models/PlayerInventory');
const PlayerProgression = require('../models/PlayerProgression');
const CompanionState = require('../models/CompanionState');
const { ITEMS, RECIPES } = require('../data/gameData');

// --- COMPANION ENDPOINTS ---

const getCompanionStateRecord = async (playerId) => {
  let state = await CompanionState.findOne({ playerId });
  if (!state) {
    state = new CompanionState({ playerId });
    await state.save();
  }
  return state;
};

// @route   GET /api/players/me/companions
// @access  Private
const getCompanions = async (req, res, next) => {
  try {
    const state = await getCompanionStateRecord(req.user.uid);
    res.json({ success: true, data: state });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/players/me/companions/:npcId/invite
// @access  Private
const inviteCompanion = async (req, res, next) => {
  try {
    const { npcId } = req.params;
    
    // In a full implementation, validate recruitment requirements here on the backend
    
    const state = await getCompanionStateRecord(req.user.uid);
    state.activeNpcId = npcId;
    state.dismissalLocation = null;
    await state.save();

    res.json({ success: true, data: state });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/players/me/companions/:npcId/dismiss
// @access  Private
const dismissCompanion = async (req, res, next) => {
  try {
    const { npcId } = req.params;
    const { dismissalLocation } = req.body;
    
    const state = await getCompanionStateRecord(req.user.uid);
    if (state.activeNpcId === npcId) {
      state.activeNpcId = null;
      state.dismissalLocation = dismissalLocation || null;
      await state.save();
    }

    res.json({ success: true, data: state });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/players/me/companions/:npcId/interact
// @access  Private
const interactCompanion = async (req, res, next) => {
  try {
    const { npcId } = req.params;
    const { action, memoryId, metadata } = req.body;
    
    const state = await getCompanionStateRecord(req.user.uid);
    
    if (!state.stateData[npcId]) {
      state.stateData[npcId] = { memories: [] };
    }
    
    if (action === 'ADD_MEMORY' && memoryId) {
      if (!state.stateData[npcId].memories.includes(memoryId)) {
        state.stateData[npcId].memories.push(memoryId);
        state.markModified('stateData');
        await state.save();
      }
    }

    res.json({ success: true, data: state });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/players/me/companions/:npcId/memories
// @access  Private
const getCompanionMemories = async (req, res, next) => {
  try {
    const { npcId } = req.params;
    const state = await getCompanionStateRecord(req.user.uid);
    const memories = state.stateData[npcId]?.memories || [];
    
    res.json({ success: true, data: memories });
  } catch (error) {
    next(error);
  }
};


// @route   GET /api/players/me
// @desc    Get authenticated player profile
// @access  Private
const getMyProfile = async (req, res, next) => {
  try {
    const player = await Player.findOne({ firebaseUid: req.user.uid });
    
    if (!player) {
      return res.status(404).json({ success: false, message: 'Player profile not found.' });
    }

    res.json({ success: true, data: player });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/players
// @desc    Create or initialize player profile
// @access  Private
const createProfile = async (req, res, next) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ success: false, message: 'Username is required.' });
    }

    // Check if player already exists
    let player = await Player.findOne({ firebaseUid: req.user.uid });
    
    if (player) {
      return res.status(409).json({ success: false, message: 'Player profile already exists.' });
    }

    // Create new player (firebaseUid comes securely from the token)
    player = new Player({
      firebaseUid: req.user.uid,
      username: username,
      // Archetypes and stats will use defaults from the Schema
    });

    await player.save();

    res.status(201).json({ success: true, data: player });
  } catch (error) {
    next(error);
  }
};

// @route   PATCH /api/players/me
// @desc    Update authenticated player profile
// @access  Private
const updateMyProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    
    // Prevent sensitive fields from being updated directly
    delete updates.firebaseUid;
    delete updates._id;

    const player = await Player.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!player) {
      return res.status(404).json({ success: false, message: 'Player profile not found.' });
    }

    res.json({ success: true, data: player });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/players/me/events
// @desc    Get authenticated player's event progress
// @access  Private
const getMyEvents = async (req, res, next) => {
  try {
    const player = await Player.findOne({ firebaseUid: req.user.uid });
    if (!player) return res.status(404).json({ success: false, message: 'Player not found.' });

    const events = await PlayerEventProgress.find({ playerId: player._id }).populate('eventId');
    res.json({ success: true, data: events });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/players/me/achievements
// @desc    Get authenticated player's achievements
// @access  Private
const getMyAchievements = async (req, res, next) => {
  try {
    const player = await Player.findOne({ firebaseUid: req.user.uid });
    if (!player) return res.status(404).json({ success: false, message: 'Player not found.' });

    const achievements = await PlayerAchievement.find({ playerId: player._id });
    res.json({ success: true, data: achievements });
  } catch (error) {
    next(error);
  }
};

// --- INVENTORY ENDPOINTS ---

const getInventory = async (playerId) => {
  let inv = await PlayerInventory.findOne({ playerId });
  if (!inv) {
    inv = new PlayerInventory({ playerId, items: [] });
    await inv.save();
  }
  return inv;
};

// @route   GET /api/players/me/inventory
// @access  Private
const getMyInventory = async (req, res, next) => {
  try {
    const player = await Player.findOne({ firebaseUid: req.user.uid });
    if (!player) return res.status(404).json({ success: false, message: 'Player not found.' });

    const inv = await getInventory(player._id);
    res.json({ success: true, data: inv });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/players/me/inventory/collect
// @access  Private
const collectItem = async (req, res, next) => {
  try {
    const { itemId, quantity = 1 } = req.body;
    if (!ITEMS[itemId]) return res.status(400).json({ success: false, message: 'Invalid item ID.' });

    const player = await Player.findOne({ firebaseUid: req.user.uid });
    if (!player) return res.status(404).json({ success: false, message: 'Player not found.' });

    const inv = await getInventory(player._id);
    
    // Check capacity (simple slot count)
    const existingItem = inv.items.find(i => i.itemId === itemId);
    if (!existingItem && inv.items.length >= inv.capacity) {
      return res.status(400).json({ success: false, message: 'Inventory full.' });
    }

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      inv.items.push({ itemId, quantity });
    }
    await inv.save();

    res.json({ success: true, data: inv });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/players/me/inventory/use
// @access  Private
const useItem = async (req, res, next) => {
  try {
    const { itemId } = req.body;
    
    const player = await Player.findOne({ firebaseUid: req.user.uid });
    const inv = await getInventory(player._id);
    
    const itemIndex = inv.items.findIndex(i => i.itemId === itemId);
    if (itemIndex === -1 || inv.items[itemIndex].quantity < 1) {
      return res.status(400).json({ success: false, message: 'Item not found in inventory.' });
    }

    inv.items[itemIndex].quantity -= 1;
    if (inv.items[itemIndex].quantity <= 0) {
      inv.items.splice(itemIndex, 1);
    }
    await inv.save();

    res.json({ success: true, data: inv });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/players/me/inventory/drop
// @access  Private
const dropItem = async (req, res, next) => {
  try {
    const { itemId, quantity = 1 } = req.body;
    
    const player = await Player.findOne({ firebaseUid: req.user.uid });
    const inv = await getInventory(player._id);
    
    const itemIndex = inv.items.findIndex(i => i.itemId === itemId);
    if (itemIndex === -1 || inv.items[itemIndex].quantity < quantity) {
      return res.status(400).json({ success: false, message: 'Not enough item in inventory.' });
    }

    inv.items[itemIndex].quantity -= quantity;
    if (inv.items[itemIndex].quantity <= 0) {
      inv.items.splice(itemIndex, 1);
    }
    await inv.save();

    res.json({ success: true, data: inv });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/players/me/crafting/craft
// @access  Private
const craftItem = async (req, res, next) => {
  try {
    const { recipeId } = req.body;
    const recipe = RECIPES[recipeId];
    if (!recipe) return res.status(400).json({ success: false, message: 'Invalid recipe ID.' });

    const player = await Player.findOne({ firebaseUid: req.user.uid });
    const inv = await getInventory(player._id);

    // Validate resources
    for (const reqItem of recipe.requiredItems) {
      const invItem = inv.items.find(i => i.itemId === reqItem.itemId);
      if (!invItem || invItem.quantity < reqItem.quantity) {
        return res.status(400).json({ success: false, message: `Missing required item: ${reqItem.itemId}` });
      }
    }

    // Check capacity if new item
    const existingOutput = inv.items.find(i => i.itemId === recipe.outputItem);
    if (!existingOutput && inv.items.length >= inv.capacity) {
      return res.status(400).json({ success: false, message: 'Inventory full.' });
    }

    // Deduct resources
    for (const reqItem of recipe.requiredItems) {
      const invItem = inv.items.find(i => i.itemId === reqItem.itemId);
      invItem.quantity -= reqItem.quantity;
    }
    inv.items = inv.items.filter(i => i.quantity > 0);

    // Add output
    if (existingOutput) {
      existingOutput.quantity += recipe.outputQuantity;
    } else {
      inv.items.push({ itemId: recipe.outputItem, quantity: recipe.outputQuantity });
    }
    
    await inv.save();
    
    // Player Legacy integration can be expanded here (e.g., FIRST_CRAFT achievement)

    res.json({ success: true, data: inv });
  } catch (error) {
    next(error);
  }
};

// --- PROGRESSION ENDPOINTS ---

const getProgressionRecord = async (firebaseUid) => {
  let prog = await PlayerProgression.findOne({ firebaseUid });
  if (!prog) {
    prog = new PlayerProgression({ firebaseUid });
    await prog.save();
  }
  return prog;
};

// @route   GET /api/players/me/progression
// @access  Private
const getProgression = async (req, res, next) => {
  try {
    const prog = await getProgressionRecord(req.user.uid);
    res.json({ success: true, data: prog });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/players/me/progression/xp
// @access  Private
const awardXP = async (req, res, next) => {
  try {
    const { amount, source, sourceId } = req.body;
    if (!amount || amount <= 0 || !source) {
      return res.status(400).json({ success: false, message: 'Invalid XP amount or source.' });
    }

    const prog = await getProgressionRecord(req.user.uid);

    // Prevent duplicate rewards if sourceId is provided
    if (sourceId) {
      const rewardKey = `${source}_${sourceId}`;
      if (prog.claimedRewards.includes(rewardKey)) {
        return res.status(400).json({ success: false, message: 'XP already claimed for this source.' });
      }
      prog.claimedRewards.push(rewardKey);
    }

    // Add XP to specific category
    if (source === 'EXPLORATION' || source === 'REGION_DISCOVERY' || source === 'HIDDEN_LOCATION') prog.explorationXP += amount;
    else if (source === 'DISCOVERY' || source === 'INSPECT') prog.discoveryXP += amount;
    else if (source === 'MEMORY') prog.memoryXP += amount;
    else if (source === 'EVENT') prog.eventXP += amount;
    else if (source === 'CRAFTING') prog.craftingXP += amount;
    else if (source === 'WORLD_IMPACT' || source === 'CORE_ACTIVATION' || source === 'WORLD_CHOICE') prog.worldImpactXP += amount;

    // Add to total
    prog.totalExperience += amount;
    prog.experience += amount;

    let leveledUp = false;
    let xpRequired = 100 + ((prog.level - 1) * 75);

    // Process multiple level ups if enough XP
    while (prog.experience >= xpRequired) {
      prog.experience -= xpRequired;
      prog.level += 1;
      prog.skillPoints += 1;
      leveledUp = true;
      xpRequired = 100 + ((prog.level - 1) * 75);
    }

    await prog.save();

    // Optionally sync level with Player model
    await Player.findOneAndUpdate({ firebaseUid: req.user.uid }, {
      'evolution.level': prog.level,
      'evolution.xp': prog.totalExperience
    });

    res.json({ success: true, data: prog, leveledUp });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/players/me/progression/unlock-ability
// @access  Private
const unlockAbility = async (req, res, next) => {
  try {
    const { abilityId, cost, levelRequirement } = req.body;
    
    if (!abilityId || cost === undefined || levelRequirement === undefined) {
      return res.status(400).json({ success: false, message: 'Invalid ability data.' });
    }

    const prog = await getProgressionRecord(req.user.uid);

    if (prog.unlockedAbilities.includes(abilityId)) {
      return res.status(400).json({ success: false, message: 'Ability already unlocked.' });
    }

    if (prog.level < levelRequirement) {
      return res.status(400).json({ success: false, message: 'Level requirement not met.' });
    }

    if (prog.skillPoints < cost) {
      return res.status(400).json({ success: false, message: 'Not enough skill points.' });
    }

    prog.skillPoints -= cost;
    prog.unlockedAbilities.push(abilityId);
    
    await prog.save();

    res.json({ success: true, data: prog });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProfile,
  createProfile,
  updateMyProfile,
  getMyEvents,
  getMyAchievements,
  getMyInventory,
  collectItem,
  useItem,
  dropItem,
  craftItem,
  getProgression,
  awardXP,
  unlockAbility,
  getCompanions,
  inviteCompanion,
  dismissCompanion,
  interactCompanion,
  getCompanionMemories
};
