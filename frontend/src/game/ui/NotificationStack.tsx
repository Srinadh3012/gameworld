import { useGameState } from '../context/GameStateContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu } from 'lucide-react';

export function NotificationStack() {
  const { notifications, dismissNotification } = useGameState();

  return (
    <div className="absolute top-24 right-6 w-80 z-40 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notif) => {
          if (notif.title === 'LEVEL UP') {
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)', transition: { duration: 0.5 } }}
                className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
              >
                <div className="absolute inset-0 bg-game-purple/5 backdrop-blur-[2px]" />
                <div className="relative flex flex-col items-center">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-game-purple/30 blur-[100px] rounded-full" />
                  <h2 className="text-game-purple text-2xl font-mono uppercase tracking-[0.5em] mb-4">NEURAL EXPANSION</h2>
                  <h1 className="text-7xl font-display font-black text-white text-glow mb-4 tracking-widest uppercase">
                    {notif.title}
                  </h1>
                  <p className="text-xl text-game-neon font-mono">{notif.body}</p>
                  <p className="text-gray-400 mt-6 text-sm tracking-widest uppercase">Skill Point Acquired</p>
                </div>
              </motion.div>
            );
          }

          return (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="pointer-events-auto relative overflow-hidden glass-panel bg-black/70 border border-game-neon/50 p-4 rounded-xl shadow-[0_0_15px_rgba(0,243,255,0.2)] backdrop-blur-md"
          >
            {/* Animated progress bar */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-game-neon shadow-[0_0_8px_rgba(0,243,255,0.8)]"
            />

            <button 
              onClick={() => dismissNotification(notif.id)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex gap-3">
              <Cpu className="w-5 h-5 text-game-neon shrink-0 mt-0.5" />
              <div className="flex flex-col pr-6">
                <span className="text-game-neon text-[10px] font-mono uppercase tracking-widest mb-1">
                  {notif.title}
                </span>
                <span className="text-white text-sm font-sans leading-tight">
                  {notif.body}
                </span>
              </div>
            </div>
          </motion.div>
        )})}
      </AnimatePresence>
    </div>
  );
}
