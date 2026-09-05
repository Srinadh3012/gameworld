import React from 'react';
import { useGameState } from '../../game/context/GameStateContext';

export const WorldThresholdScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { evolutionLevel, worldEnergy, worldStability, majorDecisions, unlockedEndgamePaths } = useGameState();

  const getPathPhilosophy = () => {
    if (unlockedEndgamePaths.includes('The Awakener')) return 'THE AWAKENER';
    if (unlockedEndgamePaths.includes('The Transformer')) return 'THE TRANSFORMER';
    if (unlockedEndgamePaths.includes('The Preserver')) return 'THE PRESERVER';
    return 'UNDETERMINED';
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="max-w-2xl w-full mx-4 border border-cyan-500/30 bg-black/50 p-8 rounded shadow-2xl relative overflow-hidden">
        {/* Cinematic glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
        
        <h1 className="text-3xl font-light text-cyan-400 mb-8 tracking-[0.2em] text-center border-b border-cyan-900/50 pb-4">
          WORLD THRESHOLD
        </h1>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div>
              <div className="text-cyan-600/70 text-xs tracking-wider mb-1">EVOLUTION LEVEL</div>
              <div className="text-2xl text-cyan-100 font-mono">{evolutionLevel}</div>
            </div>
            
            <div>
              <div className="text-cyan-600/70 text-xs tracking-wider mb-1">WORLD ENERGY</div>
              <div className="flex items-center space-x-4">
                <div className="flex-1 h-2 bg-gray-800 rounded overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500 transition-all duration-1000"
                    style={{ width: `${worldEnergy}%` }}
                  />
                </div>
                <div className="text-cyan-300 font-mono text-sm w-8">{worldEnergy}%</div>
              </div>
            </div>

            <div>
              <div className="text-cyan-600/70 text-xs tracking-wider mb-1">WORLD STABILITY</div>
              <div className="flex items-center space-x-4">
                <div className="flex-1 h-2 bg-gray-800 rounded overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 transition-all duration-1000"
                    style={{ width: `${worldStability}%` }}
                  />
                </div>
                <div className="text-amber-300 font-mono text-sm w-8">{worldStability}%</div>
              </div>
            </div>
          </div>

          <div className="space-y-4 border-l border-cyan-900/30 pl-8">
            <div>
              <div className="text-cyan-600/70 text-xs tracking-wider mb-1">CURRENT PATH</div>
              <div className="text-xl text-white tracking-widest">{getPathPhilosophy()}</div>
            </div>
            
            <div>
              <div className="text-cyan-600/70 text-xs tracking-wider mb-1">MAJOR DECISIONS</div>
              <div className="text-cyan-100/70 text-sm h-24 overflow-y-auto pr-2 space-y-1">
                {Object.keys(majorDecisions).length === 0 ? (
                  <div className="italic text-gray-500">No major decisions recorded yet.</div>
                ) : (
                  Object.entries(majorDecisions).map(([id, details], idx) => (
                    <div key={id} className="border-b border-white/5 pb-1">
                      <span className="text-cyan-400">Decision {idx + 1}:</span> {JSON.stringify(details).substring(0, 40)}...
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 pt-6 border-t border-cyan-900/50">
          <button 
            onClick={onClose}
            className="px-8 py-3 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all tracking-widest"
          >
            RETURN TO WORLD
          </button>
        </div>
      </div>
    </div>
  );
};
