import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { WorldCore } from '../components/WorldCore';
import { Sparkles, Activity, Users, Globe2, AlertCircle } from 'lucide-react';

const LIVE_EVENTS = [
  "Iron District entered conflict state",
  "Echo Forest discovered by 127 players",
  "New artifact discovered in Neon Rift",
  "Zero Sector destabilizing...",
  "Global evolution level reached 42",
];

export function Home() {
  const [currentEventIdx, setCurrentEventIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEventIdx((prev) => (prev + 1) % LIVE_EVENTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      {/* Interactive Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-10 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow opacity-10 animate-pulse blur-3xl pointer-events-none" />
        
        {/* WORLD IS CHANGING Live Indicator */}
        <div className="absolute top-24 left-0 w-full flex justify-center z-20 pointer-events-none">
          <div className="glass-panel rounded-full px-4 py-2 flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-game-neon animate-pulse" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">World Feed</span>
            <div className="w-[1px] h-4 bg-game-border mx-1" />
            <div className="overflow-hidden h-5 min-w-[280px]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentEventIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="text-sm font-medium text-white truncate"
                >
                  {LIVE_EVENTS[currentEventIdx]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col xl:flex-row items-center gap-12 mt-16">
          
          {/* Text Content */}
          <div className="flex-1 text-center xl:text-left">
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-display font-black text-white mb-6 tracking-tight leading-tight"
            >
              THE WORLD IS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-game-neon to-game-purple text-glow">YOUR GAME</span>.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-400 font-medium mb-10 max-w-xl mx-auto xl:mx-0"
            >
              Every choice ripples across the universe. Dive into an ever-evolving digital world shaped entirely by player actions.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center xl:justify-start"
            >
              <Button size="lg" variant="primary" className="min-w-[180px]">
                Enter World
              </Button>
              <Button size="lg" variant="secondary" className="min-w-[180px]">
                Discover
              </Button>
            </motion.div>
          </div>

          {/* Interactive World Core Visualization */}
          <div className="flex-1 w-full relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <WorldCore />
            </motion.div>
          </div>

        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-32">
        {/* Live World Events */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-8 h-8 text-game-purple" />
            <h2 className="text-3xl font-display font-bold">Active Conflicts</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} glowOnHover className="p-6">
                <div className="aspect-video bg-game-darker rounded-md mb-4 overflow-hidden relative">
                  <div className="absolute top-2 right-2 bg-red-500/80 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" /> LIVE
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Neon Heist Protocol</h3>
                <p className="text-gray-400 text-sm mb-4">Join 50,000+ players in the massive cyber-heist event. Rewards multiplier active.</p>
                <Button variant="secondary" size="sm" className="w-full border-game-border hover:border-game-neon">Intervene</Button>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
