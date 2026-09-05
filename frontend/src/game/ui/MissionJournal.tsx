import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, CheckCircle2, Circle } from 'lucide-react';
import { storyManager } from '../story/StoryManager';
import { useGameState } from '../context/GameStateContext';

export function MissionJournal() {
  const { isJournalOpen, setJournalOpen } = useGameState();
  const [activeMissions, setActiveMissions] = useState(storyManager.getActiveMissions());
  const [completedMissions, setCompletedMissions] = useState(storyManager.getCompletedMissions());
  const [tab, setTab] = useState<'ACTIVE' | 'COMPLETED'>('ACTIVE');

  useEffect(() => {
    if (isJournalOpen) {
      setActiveMissions(storyManager.getActiveMissions());
      setCompletedMissions(storyManager.getCompletedMissions());
    }
  }, [isJournalOpen]);

  return (
    <AnimatePresence>
      {isJournalOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto p-12"
        >
          <div className="bg-gray-900 border border-gray-700 w-full max-w-5xl h-full max-h-[80vh] flex flex-col rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-black/50">
              <div className="flex items-center gap-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
                <div>
                  <h2 className="text-2xl font-display font-black text-white uppercase tracking-widest">
                    Mission Journal
                  </h2>
                </div>
              </div>
              <button 
                onClick={() => setJournalOpen(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar Tabs */}
              <div className="w-64 border-r border-gray-800 bg-black/30 p-4 flex flex-col gap-2">
                <button
                  onClick={() => setTab('ACTIVE')}
                  className={`p-4 text-left rounded-lg transition-colors border font-mono uppercase tracking-widest text-sm ${
                    tab === 'ACTIVE' ? 'bg-white/10 border-white text-white' : 'bg-transparent border-transparent text-gray-500 hover:bg-white/5'
                  }`}
                >
                  Active ({activeMissions.length})
                </button>
                <button
                  onClick={() => setTab('COMPLETED')}
                  className={`p-4 text-left rounded-lg transition-colors border font-mono uppercase tracking-widest text-sm ${
                    tab === 'COMPLETED' ? 'bg-white/10 border-white text-white' : 'bg-transparent border-transparent text-gray-500 hover:bg-white/5'
                  }`}
                >
                  Completed ({completedMissions.length})
                </button>
              </div>

              {/* Main Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {tab === 'ACTIVE' && activeMissions.length === 0 && (
                  <div className="text-gray-500 font-mono text-center mt-20">NO ACTIVE MISSIONS</div>
                )}
                {tab === 'COMPLETED' && completedMissions.length === 0 && (
                  <div className="text-gray-500 font-mono text-center mt-20">NO COMPLETED MISSIONS</div>
                )}

                {(tab === 'ACTIVE' ? activeMissions : completedMissions).map((mission) => (
                  <div key={mission.id} className="bg-black/40 border border-gray-800 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">
                          Chapter {mission.chapter} • {mission.type}
                        </span>
                        <h3 className="text-xl font-bold text-white tracking-wider">{mission.title}</h3>
                      </div>
                      {tab === 'COMPLETED' && (
                        <span className="px-2 py-1 bg-green-900/30 text-green-500 text-[10px] uppercase font-mono tracking-widest rounded border border-green-900">
                          Completed
                        </span>
                      )}
                    </div>

                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                      {mission.description}
                    </p>

                    <div className="space-y-3">
                      <h4 className="text-xs font-mono tracking-widest text-gray-500 uppercase">Objectives</h4>
                      {mission.objectives.map((obj) => {
                        const isCompleted = storyManager.getObjectiveProgress(mission.id, obj.id);
                        return (
                          <div key={obj.id} className="flex items-start gap-3">
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                            ) : (
                              <Circle className="w-5 h-5 text-white shrink-0 mt-0.5" />
                            )}
                            <span className={`text-sm ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                              {obj.description}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
