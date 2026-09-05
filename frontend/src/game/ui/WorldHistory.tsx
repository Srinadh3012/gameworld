import { useEffect, useState } from 'react';
import { useGameState } from '../context/GameStateContext';
import { worldActionSystem } from '../systems/WorldActionSystem';
import type { WorldAction } from '../systems/WorldActionSystem';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Zap, Target } from 'lucide-react';

export function WorldHistory() {
  const { isHistoryOpen, setHistoryOpen } = useGameState();
  const [actions, setActions] = useState<WorldAction[]>([]);

  // Reload history when opened
  useEffect(() => {
    if (isHistoryOpen) {
      setActions(worldActionSystem.getActions().slice().reverse()); // Show newest first
    }
  }, [isHistoryOpen]);

  return (
    <AnimatePresence>
      {isHistoryOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-8 pointer-events-auto"
        >
          <div className="w-full max-w-4xl h-full max-h-[80vh] flex flex-col border border-game-border rounded-2xl bg-game-dark overflow-hidden shadow-[0_0_50px_rgba(138,43,226,0.1)]">
            
            <div className="flex justify-between items-center p-6 border-b border-game-border bg-black/50">
              <div className="flex items-center gap-4">
                <Clock className="w-6 h-6 text-game-purple" />
                <h1 className="text-2xl font-display font-black text-white uppercase tracking-widest text-glow">
                  World History
                </h1>
              </div>
              <button 
                onClick={() => setHistoryOpen(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {actions.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-600 font-mono uppercase tracking-widest text-sm">
                  No actions recorded yet.
                </div>
              ) : (
                <div className="relative border-l border-game-purple/30 pl-8 ml-4 flex flex-col gap-12">
                  {actions.map((action, i) => (
                    <motion.div 
                      key={action.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="relative"
                    >
                      {/* Timeline Dot */}
                      <div className="absolute -left-10 w-4 h-4 rounded-full bg-game-purple shadow-[0_0_10px_#8a2be2] mt-1" />
                      
                      <div className="glass-panel p-6 rounded-xl border border-white/5 bg-black/40 hover:bg-black/60 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="text-game-neon text-[10px] font-mono uppercase tracking-[0.2em]">
                              {new Date(action.timestamp).toLocaleString()}
                            </span>
                            <h3 className="text-xl font-bold text-white mt-1 uppercase tracking-wide">
                              {action.actionType.replace(/_/g, ' ')}
                            </h3>
                          </div>
                          
                          {action.impact ? (
                            <div className="flex items-center gap-2 bg-game-purple/10 border border-game-purple/30 px-3 py-1 rounded text-game-purple">
                              <Zap className="w-3 h-3" />
                              <span className="text-xs font-mono font-bold">+{action.impact} Impact</span>
                            </div>
                          ) : null}
                        </div>
                        
                        <div className="flex gap-6 mt-4 pt-4 border-t border-white/5 text-sm font-mono text-gray-400">
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-gray-500" />
                            <span>Location: {action.location.map(n => n.toFixed(1)).join(', ')}</span>
                          </div>
                          
                          {action.metadata && Object.keys(action.metadata).length > 0 && (
                            <div>
                              Metadata: {JSON.stringify(action.metadata)}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
