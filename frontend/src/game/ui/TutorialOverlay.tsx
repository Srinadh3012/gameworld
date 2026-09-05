import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TUTORIAL_STEPS = [
  { id: 'move', text: 'Use W A S D to move. Hold SHIFT to sprint.' },
  { id: 'interact', text: 'Press E to interact with objects and characters.' },
  { id: 'inventory', text: 'Press TAB to open your Inventory.' },
  { id: 'social', text: 'Press P to view online Explorers.' },
];

export function TutorialOverlay() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const tutorialCompleted = localStorage.getItem('gw_tutorial_completed');
    if (!tutorialCompleted) {
      setIsVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      handleSkip();
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    localStorage.setItem('gw_tutorial_completed', 'true');
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[150] pointer-events-auto"
      >
        <div className="bg-game-dark/90 backdrop-blur border border-game-neon/50 rounded-lg shadow-[0_0_20px_rgba(0,243,255,0.3)] p-4 w-[400px] flex flex-col font-mono">
          <div className="text-game-neon text-xs tracking-widest uppercase mb-2">
            SYSTEM TUTORIAL ({currentStep + 1}/{TUTORIAL_STEPS.length})
          </div>
          <p className="text-cyan-100 text-sm mb-4 h-10">
            {TUTORIAL_STEPS[currentStep].text}
          </p>
          <div className="flex justify-between items-center mt-2">
            <button onClick={handleSkip} className="text-gray-500 hover:text-white text-xs uppercase tracking-widest transition-colors">
              SKIP TUTORIAL
            </button>
            <button onClick={handleNext} className="px-4 py-1 bg-game-neon/20 hover:bg-game-neon/40 border border-game-neon/50 text-game-neon rounded transition-colors text-sm uppercase tracking-widest">
              {currentStep === TUTORIAL_STEPS.length - 1 ? 'FINISH' : 'NEXT'}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
