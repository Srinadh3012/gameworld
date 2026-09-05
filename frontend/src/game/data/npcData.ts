export type NPCKnowledgeCategory = 'WORLD_HISTORY' | 'SILENT_VALLEY' | 'ANCIENT_EVENTS' | 'WORLD_SIGNAL' | 'LUMEN_FOREST' | 'ENERGY' | 'MEMORIES' | 'RUINS' | 'ECHO_VISION' | 'CRAFTING' | 'RESOURCES' | 'ANCIENT_TECH';

export interface DialogueRequirement {
  type: 'EVOLUTION_LEVEL' | 'ITEM' | 'KNOWLEDGE' | 'MEMORY' | 'RELATIONSHIP';
  value: any;
}

export interface DialogueEffect {
  type: 'GRANT_KNOWLEDGE' | 'RELATIONSHIP_CHANGE' | 'GRANT_MEMORY' | 'TRIGGER_EVENT' | 'INVITE_COMPANION' | 'DISMISS_COMPANION';
  value: any;
}

export interface DialogueOption {
  id: string;
  text: string;
  nextNodeId: string | null;
  requirements?: DialogueRequirement[];
  effects?: DialogueEffect[];
}

export interface DialogueNode {
  id: string;
  speaker: string;
  text: string;
  options: DialogueOption[];
}

export interface NPCDefinition {
  id: string;
  name: string;
  title: string;
  description: string;
  role: string;
  personality: string;
  color: string;
  defaultPosition: [number, number, number];
  dialogueNodes: Record<string, DialogueNode>;
  defaultNodeId: string;
}

export const NPC_DATA: Record<string, NPCDefinition> = {
  'npc_arin': {
    id: 'npc_arin',
    name: 'ARIN',
    title: 'The Observer',
    description: 'A calm, mysterious figure recording the history of the world.',
    role: 'World historian',
    personality: 'Calm, mysterious, analytical.',
    color: '#88ccff',
    defaultPosition: [10, 0, -5], // Near Silent Valley Broken Observatory
    defaultNodeId: 'intro',
    dialogueNodes: {
      'intro': {
        id: 'intro',
        speaker: 'ARIN',
        text: "You're beginning to notice what the world remembers.",
        options: [
          { id: 'opt_what', text: 'What happened here?', nextNodeId: 'history' },
          { id: 'opt_core', text: 'What do you know about the Core?', nextNodeId: 'core_info' },
          { id: 'opt_transformation', text: 'The world feels different...', nextNodeId: 'transformation', requirements: [{ type: 'EVOLUTION_LEVEL', value: 3 }] },
          { id: 'opt_threshold', text: 'The Core is pulsing rapidly.', nextNodeId: 'threshold', requirements: [{ type: 'EVOLUTION_LEVEL', value: 5 }] },
          { id: 'opt_invite', text: '[INVITE COMPANION]', nextNodeId: 'invited', effects: [{ type: 'INVITE_COMPANION', value: 'npc_arin' }] },
          { id: 'opt_dismiss', text: '[DISMISS COMPANION]', nextNodeId: 'dismissed', effects: [{ type: 'DISMISS_COMPANION', value: 'npc_arin' }] },
          { id: 'opt_leave', text: 'Leave', nextNodeId: null }
        ]
      },
      'transformation': {
        id: 'transformation',
        speaker: 'ARIN',
        text: "The forest isn't quiet anymore. It's listening. The World Core is reshaping our history.",
        options: [{ id: 'opt_back', text: 'Back', nextNodeId: 'intro' }]
      },
      'threshold': {
        id: 'threshold',
        speaker: 'ARIN',
        text: "We have reached the Threshold. The Preserver path would mean archiving this state forever. Choose wisely.",
        options: [{ id: 'opt_back', text: 'Back', nextNodeId: 'intro' }]
      },
      'history': {
        id: 'history',
        speaker: 'ARIN',
        text: 'This valley was once vibrant. Now it is silent, waiting for the energy to return.',
        options: [
          { id: 'opt_back', text: 'Back', nextNodeId: 'intro' },
          { id: 'opt_leave', text: 'Leave', nextNodeId: null }
        ]
      },
      'core_info': {
        id: 'core_info',
        speaker: 'ARIN',
        text: 'The World Core is the seed of this sector. Your actions shape its growth.',
        options: [
          { id: 'opt_back', text: 'Back', nextNodeId: 'intro' },
          { id: 'opt_leave', text: 'Leave', nextNodeId: null }
        ]
      },
      'invited': {
        id: 'invited',
        speaker: 'ARIN',
        text: 'I shall accompany you. There is much history yet to uncover.',
        options: [{ id: 'opt_leave', text: 'Let us go.', nextNodeId: null }]
      },
      'dismissed': {
        id: 'dismissed',
        speaker: 'ARIN',
        text: 'I will return to my studies. Seek me if you require insight.',
        options: [{ id: 'opt_leave', text: 'Goodbye.', nextNodeId: null }]
      }
    }
  },
  'npc_lyra': {
    id: 'npc_lyra',
    name: 'LYRA',
    title: 'The Signal Keeper',
    description: 'An energetic researcher studying the strange signals of the forest.',
    role: 'Studies World Signals',
    personality: 'Curious, energetic, intelligent.',
    color: '#33ff88',
    defaultPosition: [40, 0, 40], // Lumen Forest
    defaultNodeId: 'intro',
    dialogueNodes: {
      'intro': {
        id: 'intro',
        speaker: 'LYRA',
        text: "Something is disturbing the forest. Can you hear the signal?",
        options: [
          { id: 'opt_signal', text: 'Tell me about the signal.', nextNodeId: 'signal_info' },
          { id: 'opt_invite', text: '[INVITE COMPANION]', nextNodeId: 'invited', effects: [{ type: 'INVITE_COMPANION', value: 'npc_lyra' }] },
          { id: 'opt_dismiss', text: '[DISMISS COMPANION]', nextNodeId: 'dismissed', effects: [{ type: 'DISMISS_COMPANION', value: 'npc_lyra' }] },
          { id: 'opt_leave', text: 'Leave', nextNodeId: null }
        ]
      },
      'signal_info': {
        id: 'signal_info',
        speaker: 'LYRA',
        text: 'It hums beneath the trees. If you follow the glowing flora, you might find the source.',
        options: [
          { id: 'opt_back', text: 'Back', nextNodeId: 'intro' },
          { id: 'opt_leave', text: 'Leave', nextNodeId: null }
        ]
      },
      'invited': {
        id: 'invited',
        speaker: 'LYRA',
        text: 'Yes! Let\'s go find where these signals are coming from.',
        options: [{ id: 'opt_leave', text: 'Let us go.', nextNodeId: null }]
      },
      'dismissed': {
        id: 'dismissed',
        speaker: 'LYRA',
        text: 'Oh, alright. I\'ll keep monitoring from here.',
        options: [{ id: 'opt_leave', text: 'Goodbye.', nextNodeId: null }]
      }
    }
  },
  'npc_kael': {
    id: 'npc_kael',
    name: 'KAEL',
    title: 'The Wanderer',
    description: 'An explorer who travels the forgotten paths.',
    role: 'Explorer',
    personality: 'Friendly but unpredictable.',
    color: '#ffcc33',
    defaultPosition: [5, 0, 15], // Between regions
    defaultNodeId: 'intro',
    dialogueNodes: {
      'intro': {
        id: 'intro',
        speaker: 'KAEL',
        text: 'The paths change when you are not looking. Keep your eyes open.',
        options: [
          { id: 'opt_secrets', text: 'Any hidden locations nearby?', nextNodeId: 'secrets' },
          { id: 'opt_leave', text: 'Leave', nextNodeId: null }
        ]
      },
      'secrets': {
        id: 'secrets',
        speaker: 'KAEL',
        text: 'Look for the Whispering Stone in the east. It remembers things we have forgotten.',
        options: [
          { id: 'opt_leave', text: 'Leave', nextNodeId: null }
        ]
      }
    }
  },
  'npc_sera': {
    id: 'npc_sera',
    name: 'SERA',
    title: 'The Memory Weaver',
    description: 'A quiet thinker studying the fragments of the past.',
    role: 'Studies memories',
    personality: 'Quiet, thoughtful.',
    color: '#cc88ff',
    defaultPosition: [-30, 0, -20], // Forgotten Ruins
    defaultNodeId: 'intro',
    dialogueNodes: {
      'intro': {
        id: 'intro',
        speaker: 'SERA',
        text: 'The ruins are scattered with memories. Do you have the vision to see them?',
        options: [
          { id: 'opt_echo', text: 'How do I see them?', nextNodeId: 'echo_vision' },
          { id: 'opt_invite', text: '[INVITE COMPANION]', nextNodeId: 'invited', effects: [{ type: 'INVITE_COMPANION', value: 'npc_sera' }] },
          { id: 'opt_dismiss', text: '[DISMISS COMPANION]', nextNodeId: 'dismissed', effects: [{ type: 'DISMISS_COMPANION', value: 'npc_sera' }] },
          { id: 'opt_leave', text: 'Leave', nextNodeId: null }
        ]
      },
      'echo_vision': {
        id: 'echo_vision',
        speaker: 'SERA',
        text: 'You must awaken your Echo Vision. Only then will the shards reveal their truth.',
        options: [
          { id: 'opt_back', text: 'Back', nextNodeId: 'intro' },
          { id: 'opt_leave', text: 'Leave', nextNodeId: null }
        ]
      },
      'invited': {
        id: 'invited',
        speaker: 'SERA',
        text: 'I will walk with you. Perhaps together we can interpret the echoes.',
        options: [{ id: 'opt_leave', text: 'Let us go.', nextNodeId: null }]
      },
      'dismissed': {
        id: 'dismissed',
        speaker: 'SERA',
        text: 'The memories will remain here. I shall wait.',
        options: [{ id: 'opt_leave', text: 'Goodbye.', nextNodeId: null }]
      }
    }
  },
  'npc_orin': {
    id: 'npc_orin',
    name: 'ORIN',
    title: 'The Forge Keeper',
    description: 'A serious and practical worker surrounded by ancient tech.',
    role: 'Crafting specialist',
    personality: 'Practical, serious.',
    color: '#ff6633',
    defaultPosition: [0, 0, -40], // Near World Forge / Core Zone edge
    defaultNodeId: 'intro',
    dialogueNodes: {
      'intro': {
        id: 'intro',
        speaker: 'ORIN',
        text: 'Raw materials are useless without intent. What are you building?',
        options: [
          { id: 'opt_crafting', text: 'Teach me about crafting.', nextNodeId: 'crafting' },
          { id: 'opt_leave', text: 'Leave', nextNodeId: null }
        ]
      },
      'crafting': {
        id: 'crafting',
        speaker: 'ORIN',
        text: 'Combine energy with matter. If you find rare crystals, bring them to me.',
        options: [
          { id: 'opt_leave', text: 'Leave', nextNodeId: null }
        ]
      }
    }
  },
  'npc_core_voice': {
    id: 'npc_core_voice',
    name: 'THE CORE VOICE',
    title: 'World Intelligence',
    description: 'A disembodied voice resonating from the World Core.',
    role: 'World Core intelligence',
    personality: 'Unknown, non-human, vast.',
    color: '#ffffff',
    defaultPosition: [-18, 0, -45], // Core Zone
    defaultNodeId: 'intro',
    dialogueNodes: {
      'intro': {
        id: 'intro',
        speaker: 'THE CORE VOICE',
        text: '[ RESONANCE DETECTED. YOUR PRESENCE ALTERS THE SYSTEM. ]',
        options: [
          { id: 'opt_who', text: 'What are you?', nextNodeId: 'who' },
          { id: 'opt_leave', text: 'Step back', nextNodeId: null }
        ]
      },
      'who': {
        id: 'who',
        speaker: 'THE CORE VOICE',
        text: '[ WE ARE THE FOUNDATION. THE MEMORY. THE EVOLUTION. ]',
        options: [
          { id: 'opt_leave', text: 'Leave', nextNodeId: null }
        ]
      }
    }
  }
};
