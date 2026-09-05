import { useState, useEffect } from 'react';
import { storyManager } from '../story/StoryManager';
import { BookOpen, CheckCircle2, Circle } from 'lucide-react';

export function MissionTracker() {
  // We need to re-render when storyManager updates.
  // In a real app we'd use a context or event listener. For now, we'll just poll every 1s or rely on GameState updates.
  const [activeMissions, setActiveMissions] = useState(storyManager.getActiveMissions());

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMissions(storyManager.getActiveMissions());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (activeMissions.length === 0) return null;

  // Track the most important mission (the first one)
  const mission = activeMissions[0];

  return (
    <div className="fixed top-48 right-8 z-30 pointer-events-none">
      <div className="bg-black/60 backdrop-blur-md border border-white/20 p-4 rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.05)] w-72">
        <div className="flex items-center space-x-2 mb-2">
          <BookOpen className="w-4 h-4 text-gray-400" />
          <h3 className="text-gray-400 text-xs font-mono tracking-widest font-bold uppercase">MISSION</h3>
        </div>
        
        <h4 className="text-white text-md font-bold tracking-wider mb-3 border-b border-white/10 pb-2">
          {mission.title}
        </h4>

        <div className="space-y-2">
          {mission.objectives.map(obj => {
            const isCompleted = storyManager.getObjectiveProgress(mission.id, obj.id);
            return (
              <div key={obj.id} className="flex items-start space-x-2">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-4 h-4 text-white shrink-0 mt-0.5" />
                )}
                <p className={`text-xs ${isCompleted ? 'text-gray-500 line-through' : 'text-white'}`}>
                  {obj.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
