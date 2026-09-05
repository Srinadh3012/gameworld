import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { guardianManager } from '../guardians/GuardianManager';
import { useGameState } from '../context/GameStateContext';

export function GuardianEncounterUI() {
  const [activeGuardian, setActiveGuardian] = useState(guardianManager.getActiveGuardianData());
  const [encounter, setEncounter] = useState(guardianManager.getActiveEncounter());
  const [showCinematicBanner, setShowCinematicBanner] = useState(false);

  useEffect(() => {
    const checkState = () => {
      const g = guardianManager.getActiveGuardianData();
      const e = guardianManager.getActiveEncounter();
      
      // If we just entered a challenge state from dormant
      if (e && e.status === 'CHALLENGE' && (!encounter || encounter.status !== 'CHALLENGE')) {
        setShowCinematicBanner(true);
        setTimeout(() => setShowCinematicBanner(false), 4000);
      }
      
      setActiveGuardian(g);
      setEncounter(e);
    };

    const unsubscribe = guardianManager.subscribe(checkState);
    checkState(); // initial
    return unsubscribe;
  }, [encounter]);

  if (!activeGuardian || !encounter) return null;

  const currentPhase = activeGuardian.phases[encounter.currentPhase - 1];

  return (
    <>
      {/* Cinematic intro banner */}
      <AnimatePresence>
        {showCinematicBanner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, letterSpacing: '0em' }}
            animate={{ opacity: 1, scale: 1, letterSpacing: '0.2em' }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-black/40 px-24 py-12 rounded-3xl backdrop-blur-md border border-white/5 flex flex-col items-center">
              <span className="text-gray-400 font-mono text-sm tracking-[0.5em] uppercase mb-4 opacity-80">
                An Ancient Presence Awakens
              </span>
              <h1 className="text-5xl font-display font-black text-white uppercase tracking-widest text-glow mb-6">
                {activeGuardian.name}
              </h1>
              <p className="text-gray-300 italic font-serif text-xl opacity-90 text-center max-w-xl">
                "{activeGuardian.title}"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle ongoing challenge tracker */}
      <AnimatePresence>
        {!showCinematicBanner && encounter.status === 'CHALLENGE' && currentPhase && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
          >
            <div className="bg-black/60 backdrop-blur-md border border-red-500/20 px-8 py-4 rounded-full shadow-[0_0_30px_rgba(239,68,68,0.1)] flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-400 font-mono text-xs uppercase tracking-widest font-bold">Guardian Encounter</span>
              </div>
              <div className="w-px h-6 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-white font-bold tracking-wider">{activeGuardian.name}</span>
                <span className="text-gray-400 text-xs">{currentPhase.objective}</span>
              </div>
              <div className="w-px h-6 bg-white/10" />
              <span className="text-gray-500 font-mono text-xs">Phase {encounter.currentPhase}/{activeGuardian.phases.length}</span>
            </div>
            {currentPhase.hint && (
              <div className="text-center mt-2 text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                Hint: {currentPhase.hint}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
