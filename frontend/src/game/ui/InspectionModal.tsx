import { useGameState } from '../context/GameStateContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, X } from 'lucide-react';

export function InspectionModal() {
  const { inspectionTarget, dismissInspection } = useGameState();

  return (
    <AnimatePresence>
      {inspectionTarget && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg"
        >
          <div className="relative w-full max-w-2xl p-8 bg-game-dark/50 border border-game-border rounded-xl shadow-[0_0_50px_rgba(138,43,226,0.15)] overflow-hidden">
            {/* Top decorative line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-game-purple to-game-neon" />
            
            {/* Close button */}
            <button 
              onClick={dismissInspection}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-lg border border-game-purple/50 bg-game-purple/10 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(138,43,226,0.3)]">
                <Database className="w-8 h-8 text-game-purple" />
              </div>
              
              <div className="flex flex-col">
                <span className="text-game-neon text-xs font-mono uppercase tracking-[0.2em] mb-1">
                  {inspectionTarget.type || 'UNKNOWN STRUCTURE'}
                </span>
                <h2 className="text-3xl font-display font-black text-white uppercase tracking-wider mb-6 text-glow">
                  {inspectionTarget.title}
                </h2>
                
                <div className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap border-l-2 border-game-purple/30 pl-4 py-1">
                  {inspectionTarget.description}
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-end gap-4">
              <button 
                onClick={dismissInspection}
                className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono uppercase tracking-widest text-sm rounded transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
