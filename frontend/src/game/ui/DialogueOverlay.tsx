import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../context/GameStateContext';

export function DialogueOverlay() {
  const { activeDialogue, selectDialogueOption, endDialogue, activeCompanion } = useGameState();

  // Keyboard navigation for dialogue choices
  useEffect(() => {
    if (!activeDialogue) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Space or Enter to advance if there's only 1 option (or to continue)
      if (e.code === 'Space' || e.code === 'Enter') {
        if (activeDialogue.currentNode.options.length === 1) {
          selectDialogueOption(activeDialogue.currentNode.options[0].id);
        }
      }
      
      // Number keys for selecting options
      if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1;
        if (index >= 0 && index < activeDialogue.currentNode.options.length) {
          selectDialogueOption(activeDialogue.currentNode.options[index].id);
        }
      }

      // Escape to exit early if allowed
      if (e.code === 'Escape') {
        endDialogue();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDialogue, selectDialogueOption, endDialogue]);

  if (!activeDialogue) return null;

  const { npc, currentNode } = activeDialogue;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl z-50 pointer-events-auto"
      >
        <div className="glass-panel p-8 rounded-xl bg-black/80 border border-white/20 backdrop-blur-md shadow-2xl relative overflow-hidden">
          {/* Subtle colored glow based on NPC color */}
          <div 
            className="absolute top-0 left-0 w-full h-1" 
            style={{ backgroundColor: npc.color, boxShadow: `0 0 20px ${npc.color}` }}
          />
          
          <div className="flex flex-col gap-4">
            {/* Speaker Info */}
            <div>
              <h2 className="text-2xl font-display font-black tracking-widest text-white uppercase drop-shadow-md">
                {currentNode.speaker}
              </h2>
              <h3 
                className="text-xs font-mono tracking-[0.3em] uppercase mb-4"
                style={{ color: npc.color }}
              >
                {npc.title}
              </h3>
            </div>

            {/* Dialogue Text (Animated typewriter effect could be added here via motion) */}
            <motion.div 
              key={currentNode.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-lg text-gray-200 leading-relaxed max-w-3xl font-light"
            >
              {currentNode.text}
            </motion.div>

            {/* Options */}
            <div className="mt-8 flex flex-col gap-2">
              {currentNode.options.filter(opt => {
                const hasInvite = opt.effects?.some(e => e.type === 'INVITE_COMPANION');
                const hasDismiss = opt.effects?.some(e => e.type === 'DISMISS_COMPANION');
                if (hasInvite && activeCompanion === npc.id) return false;
                if (hasDismiss && activeCompanion !== npc.id) return false;
                return true;
              }).map((option, idx) => (
                <button
                  key={option.id}
                  onClick={() => selectDialogueOption(option.id)}
                  className="text-left px-4 py-3 rounded bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20 transition-all text-sm font-mono tracking-wider flex items-center gap-4 group"
                >
                  <span className="text-gray-500 group-hover:text-white transition-colors">{idx + 1}</span>
                  <span className="text-gray-300 group-hover:text-white transition-colors">{option.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
