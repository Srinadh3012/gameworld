import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Activity, ExternalLink, Calendar, Map } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { World } from '../../data/mockDiscoverData';

interface WorldPreviewOverlayProps {
  world: World | null;
  onClose: () => void;
}

export function WorldPreviewOverlay({ world, onClose }: WorldPreviewOverlayProps) {
  // Prevent body scroll when open
  useEffect(() => {
    if (world) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [world]);

  if (!world) return null;

  const getStatusBadge = (status: World['status']) => {
    switch (status) {
      case 'Stable': return <Badge variant="success">Stable</Badge>;
      case 'Evolving': return <Badge variant="info">Evolving</Badge>;
      case 'Unstable': return <Badge variant="warning">Unstable</Badge>;
      case 'Critical': return <Badge variant="danger">Critical</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-game-darker/90 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0 }}
          className="relative w-full max-w-4xl bg-game-panel border border-game-border rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-game-darker/50 hover:bg-game-border rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Column: Visualization & Core Stats */}
          <div className="w-full md:w-2/5 bg-game-darker p-6 flex flex-col relative overflow-hidden border-r border-game-border">
            {/* Abstract visual background */}
            <div className="absolute inset-0 bg-hero-glow opacity-10 animate-pulse blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex-grow flex items-center justify-center min-h-[200px]">
               {/* Animated World Abstract Representation */}
               <motion.div 
                 className="w-32 h-32 rounded-full border border-game-neon flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.2)]"
                 animate={{ rotate: 360 }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               >
                 <div className="w-24 h-24 rounded-full border border-game-purple border-dashed opacity-50" />
                 <Map className="absolute w-10 h-10 text-white/50" />
               </motion.div>
            </div>

            <div className="relative z-10 mt-6 space-y-4">
              <h2 className="text-3xl font-display font-bold text-white text-glow">{world.name}</h2>
              <p className="text-gray-400 text-sm">Created by <span className="text-game-neon">{world.creator}</span></p>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-game-border/50">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Level</p>
                  <p className="text-xl font-bold text-white">{world.level}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Players</p>
                  <p className="text-xl font-bold text-white flex items-center gap-1">
                    <Users className="w-4 h-4 text-game-purple" /> {world.players.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Details & History */}
          <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col overflow-y-auto">
            <div className="flex gap-2 mb-6 flex-wrap">
              {getStatusBadge(world.status)}
              <Badge variant={world.difficulty === 'Extreme' ? 'danger' : 'default'}>Diff: {world.difficulty}</Badge>
            </div>

            <div className="space-y-8 flex-grow">
              <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Current Event
                </h3>
                <div className="bg-game-darker rounded p-4 border border-game-border/50">
                  <p className="font-semibold text-game-neon">{world.event}</p>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">World History</h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  {world.history}
                </p>
              </section>

              <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Recent Events Log
                </h3>
                <ul className="space-y-3">
                  {world.recentEvents.map((evt, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-gray-300">
                      <span className="text-game-purple/50">[{world.level}.{world.players % 100}]</span> 
                      {evt}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="mt-8 pt-6 border-t border-game-border flex gap-4">
              <Button variant="primary" className="flex-1 gap-2">
                <ExternalLink className="w-4 h-4" /> Enter World
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
