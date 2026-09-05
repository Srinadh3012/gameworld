const express = require('express');
const router = express.Router();
const NPCRelationship = require('../models/NPCRelationship');
const NPCMemory = require('../models/NPCMemory');
const { verifyAuth } = require('../middleware/auth');

router.use(verifyAuth);

// Get all NPC relationships for the player
router.get('/', async (req, res) => {
  try {
    const relationships = await NPCRelationship.find({ playerId: req.user.uid });
    res.json(relationships);
  } catch (error) {
    console.error('Error fetching NPC relationships:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get memories for a specific NPC
router.get('/:npcId/memories', async (req, res) => {
  try {
    const memories = await NPCMemory.find({ 
      playerId: req.user.uid, 
      npcId: req.params.npcId 
    });
    res.json(memories);
  } catch (error) {
    console.error('Error fetching NPC memories:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Record interaction / choice consequences
router.post('/:npcId/interact', async (req, res) => {
  try {
    const { npcId } = req.params;
    const { relationshipDelta, newKnowledge, memory } = req.body;
    
    // Find or create relationship
    let rel = await NPCRelationship.findOne({ playerId: req.user.uid, npcId });
    if (!rel) {
      rel = new NPCRelationship({ playerId: req.user.uid, npcId, relationshipLevel: 0 });
    }
    
    // Update relationship securely
    if (relationshipDelta) {
      // Basic bounds checking
      rel.relationshipLevel += Math.min(Math.max(relationshipDelta, -10), 10);
      rel.relationshipLevel = Math.max(-100, Math.min(100, rel.relationshipLevel));
    }
    
    if (newKnowledge && !rel.unlockedKnowledge.includes(newKnowledge)) {
      rel.unlockedKnowledge.push(newKnowledge);
    }
    
    rel.lastInteraction = new Date();
    await rel.save();
    
    // Record memory if passed
    if (memory) {
      const newMem = new NPCMemory({
        playerId: req.user.uid,
        npcId,
        memoryType: memory.type,
        importance: memory.importance || 'low',
        metadata: memory.metadata || {}
      });
      await newMem.save();
    }
    
    res.json(rel);
  } catch (error) {
    console.error('Error recording interaction:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
