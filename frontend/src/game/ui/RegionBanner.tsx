import { useGameState } from '../context/GameStateContext';
import { motion, AnimatePresence } from 'framer-motion';

export function RegionBanner() {
  const { regionBanner } = useGameState();

  return (
    <div className="absolute top-16 left-0 w-full flex justify-center pointer-events-none z-40">
      <AnimatePresence>
        {regionBanner && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <span className="text-white/60 text-xs font-mono uppercase tracking-[0.4em] mb-1">
              {regionBanner.title}
            </span>
            <h2 
              className="text-4xl font-display font-black uppercase tracking-widest"
              style={{ 
                color: regionBanner.color,
                textShadow: `0 0 20px ${regionBanner.color}80, 0 0 10px ${regionBanner.color}40`
              }}
            >
              {regionBanner.name}
            </h2>
            <div 
              className="h-[1px] mt-4 bg-gradient-to-r from-transparent via-current to-transparent w-[150%]"
              style={{ color: regionBanner.color }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
