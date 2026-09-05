import { useGameState } from '../context/GameStateContext';
import { motion, AnimatePresence } from 'framer-motion';

export function InteractionPrompt() {
  const { activeInteraction } = useGameState();

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <AnimatePresence>
        {activeInteraction && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col items-center mt-32"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded bg-white/10 text-white font-bold text-sm mb-2 border border-white/30 backdrop-blur-md shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              E
            </div>
            <span className="text-white font-mono uppercase tracking-[0.2em] text-xs font-bold shadow-black drop-shadow-md">
              {activeInteraction}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
