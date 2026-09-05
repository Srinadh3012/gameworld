import React from 'react';
import { useGameState } from '../context/GameStateContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Save, Home, X } from 'lucide-react';
import { clearProgress } from '../utils/storage';
import { CompanionStatusPanel } from './CompanionStatusPanel';
import { SettingsPanel } from './SettingsPanel';

export function PauseMenu() {
  const { isPaused, setPaused } = useGameState();
  const [showSettings, setShowSettings] = React.useState(false);
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isPaused && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
        >
          <div className="glass-panel w-full max-w-4xl p-8 rounded-2xl border border-game-border flex flex-row shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-game-purple to-game-neon" />
            
            <div className="flex flex-col flex-1 border-r border-white/10 pr-8 mr-8">
              <h2 className="text-2xl font-display text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-2 flex items-center gap-2">
                <Settings className="w-6 h-6 text-game-neon" />
                System Menu
              </h2>
              
              <div className="flex flex-col gap-3 flex-grow">
                <button 
                  onClick={() => setPaused(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-game-purple/20 border border-white/10 hover:border-game-purple rounded transition-colors text-left font-mono tracking-widest text-white group"
                >
                  <X className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  Resume
                </button>
                
                <button 
                  className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded transition-colors text-left font-mono tracking-widest text-white group"
                  onClick={() => {
                    setPaused(false);
                    window.location.reload();
                  }}
                >
                  <Save className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  Force Save & Reload
                </button>

                <button 
                  className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded transition-colors text-left font-mono tracking-widest text-white group"
                  onClick={() => setShowSettings(true)}
                >
                  <Settings className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  Settings
                </button>

                <button 
                  className="w-full flex items-center gap-3 px-4 py-3 bg-red-900/10 hover:bg-red-900/30 border border-red-500/20 hover:border-red-500/50 rounded transition-colors text-left font-mono tracking-widest text-red-200 group mt-auto"
                  onClick={() => {
                    if(confirm("Are you sure you want to reset all progress?")) {
                      clearProgress();
                      window.location.href = '/';
                    }
                  }}
                >
                  <Home className="w-5 h-5 text-red-500/70 group-hover:text-red-400 transition-colors" />
                  Hard Reset Progress
                </button>
              </div>
              
              <div className="mt-8 text-center text-gray-500 font-mono text-xs">
                Sector Alpha-01 System v2.0
              </div>
            </div>
            
            <div className="flex-[1.5]">
               <CompanionStatusPanel />
            </div>
          </div>
          
          {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
