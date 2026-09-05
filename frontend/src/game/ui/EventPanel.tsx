import { motion } from 'framer-motion';
import { useGameState } from '../context/GameStateContext';
import { GAME_EVENTS } from '../data/eventData';
import { AlertCircle, Target, Zap } from 'lucide-react';
import { useState } from 'react';

interface EventPanelProps {
  eventId: string;
  onClose: () => void;
}

export function EventPanel({ eventId, onClose }: EventPanelProps) {
  const { startEvent, showNotification } = useGameState();
  const [isStarting, setIsStarting] = useState(false);

  const ev = GAME_EVENTS.find(e => e.id === eventId);
  if (!ev) return null;

  const handleInvestigate = async () => {
    setIsStarting(true);
    const success = await startEvent(eventId);
    if (success) {
      showNotification('EVENT ACCEPTED', ev.title);
      onClose();
    } else {
      showNotification('ERROR', 'Event cannot be started right now.');
      setIsStarting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-xl bg-[#0a0a14] border border-game-neon/50 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,243,255,0.15)]"
      >
        <div className="p-6 border-b border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-game-neon/5 opacity-50"></div>
          <div className="relative z-10 flex items-center justify-between">
            <h2 className="text-xl font-mono tracking-widest text-game-neon">EVENT DETECTED</h2>
            <AlertCircle className="w-6 h-6 text-game-neon animate-pulse" />
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-wider text-white">{ev.title}</h1>
            <p className="text-lg text-white/70 italic leading-relaxed">
              "{ev.description}"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-2">
              <div className="flex items-center space-x-2 text-white/50 text-sm font-mono">
                <Target className="w-4 h-4" />
                <span>DIFFICULTY</span>
              </div>
              <div className={`text-lg font-bold tracking-wider ${
                ev.difficulty === 'HARD' || ev.difficulty === 'EXTREME' ? 'text-game-pink' : 'text-white'
              }`}>
                {ev.difficulty}
              </div>
            </div>
            
            <div className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-2">
              <div className="flex items-center space-x-2 text-white/50 text-sm font-mono">
                <AlertCircle className="w-4 h-4" />
                <span>RISK</span>
              </div>
              <div className={`text-lg font-bold tracking-wider ${
                ev.risk === 'HIGH' ? 'text-game-pink' : ev.risk === 'MEDIUM' ? 'text-game-gold' : 'text-game-neon'
              }`}>
                {ev.risk}
              </div>
            </div>

            <div className="col-span-2 p-4 bg-game-neon/5 rounded-lg border border-game-neon/20 space-y-2">
              <div className="flex items-center space-x-2 text-game-neon/70 text-sm font-mono">
                <Zap className="w-4 h-4" />
                <span>POTENTIAL IMPACT</span>
              </div>
              <div className="text-2xl font-bold text-game-neon">+{ev.impactReward}</div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleInvestigate}
              disabled={isStarting}
              className="flex-1 bg-game-neon text-black font-bold font-mono tracking-widest py-4 rounded hover:bg-game-neon/90 transition-all hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] disabled:opacity-50"
            >
              {isStarting ? 'INITIALIZING...' : 'INVESTIGATE'}
            </button>
            <button
              onClick={onClose}
              className="px-8 bg-transparent border border-white/20 text-white/70 font-mono tracking-widest py-4 rounded hover:bg-white/5 hover:text-white transition-all"
            >
              LEAVE
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
