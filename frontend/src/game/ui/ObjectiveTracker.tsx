import { useGameState } from '../context/GameStateContext';
import { GAME_EVENTS } from '../data/eventData';
import { Target, CheckCircle2 } from 'lucide-react';

export function ObjectiveTracker() {
  const { trackedEventId, completedEvents } = useGameState();

  if (!trackedEventId) return null;

  const ev = GAME_EVENTS.find(e => e.id === trackedEventId);
  if (!ev) return null;

  const isCompleted = completedEvents.includes(trackedEventId);
  const currentObjective = ev.objectives[0]; // For phase 10, keep it simple with 1 objective

  return (
    <div className="fixed top-24 right-8 z-40 pointer-events-none">
      <div className="bg-black/60 backdrop-blur-md border border-game-neon/30 p-4 rounded-lg shadow-[0_0_15px_rgba(0,243,255,0.1)] w-72">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-game-neon animate-pulse rounded-full" />
          <h3 className="text-game-neon text-xs font-mono tracking-widest font-bold">WORLD EVENT</h3>
        </div>
        
        <h4 className="text-white text-lg font-bold tracking-wider mb-4 border-b border-white/10 pb-2">
          {ev.title}
        </h4>

        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-game-neon shrink-0 mt-0.5" />
            ) : (
              <Target className="w-5 h-5 text-white/50 shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`text-sm ${isCompleted ? 'text-game-neon line-through' : 'text-white/80'}`}>
                {currentObjective?.description || 'Follow the signal.'}
              </p>
              <div className="mt-2 text-xs font-mono tracking-widest text-white/40">
                PROGRESS: <span className={isCompleted ? 'text-game-neon' : 'text-white'}>{isCompleted ? '100%' : '0%'}</span>
              </div>
            </div>
          </div>
        </div>
        
        {isCompleted && (
          <div className="mt-4 pt-3 border-t border-game-neon/20 text-center animate-pulse">
            <span className="text-game-neon font-mono text-sm tracking-widest">WORLD IMPACT +{ev.impactReward}</span>
          </div>
        )}
      </div>
    </div>
  );
}
