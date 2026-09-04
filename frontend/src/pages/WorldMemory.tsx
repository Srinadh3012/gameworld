import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../components/ui/Badge';
import { BookOpen, Sword, Hammer, Sparkles, Users, Activity, Clock, Loader2 } from 'lucide-react';
import { getWorlds, getWorldMemories } from '../services/api';

const CATEGORIES = [
  { label: 'All', icon: <Clock className="w-4 h-4" /> },
  { label: 'Discovery', icon: <BookOpen className="w-4 h-4" /> },
  { label: 'Battle', icon: <Sword className="w-4 h-4" /> },
  { label: 'Creation', icon: <Hammer className="w-4 h-4" /> },
  { label: 'Mystery', icon: <Sparkles className="w-4 h-4" /> },
  { label: 'Community', icon: <Users className="w-4 h-4" /> },
];

export function WorldMemory() {
  const [filter, setFilter] = useState('All');
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadMemories() {
      try {
        setLoading(true);
        // Step 1: Fetch worlds to get a target world
        const worldsRes = await getWorlds();
        const worlds = worldsRes?.data || [];
        
        if (worlds.length > 0) {
          // Step 2: Fetch memories for the primary world
          const targetWorld = worlds[0];
          const memRes = await getWorldMemories(targetWorld._id);
          setMemories(memRes?.data || []);
        } else {
          setMemories([]);
        }
      } catch (err) {
        console.error('World Memory load error:', err);
        setError('Failed to load memory stream.');
      } finally {
        setLoading(false);
      }
    }
    loadMemories();
  }, []);

  const filteredEvents = useMemo(() => {
    if (filter === 'All') return memories;
    return memories.filter(e => e.type === filter);
  }, [filter, memories]);

  const getImpactLevel = (score: number) => {
    if (score >= 90) return 'Critical';
    if (score >= 70) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  };

  const getImpactColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-400';
      case 'Medium': return 'text-game-neon';
      case 'High': return 'text-game-purple';
      case 'Critical': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Discovery': return <BookOpen className="w-5 h-5" />;
      case 'Battle': return <Sword className="w-5 h-5" />;
      case 'Creation': return <Hammer className="w-5 h-5" />;
      case 'Mystery': return <Sparkles className="w-5 h-5" />;
      case 'Community': return <Users className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center pt-20 text-game-purple gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <div className="font-bold tracking-widest uppercase">Synchronizing Memory Stream...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center pt-20 text-red-400 gap-4">
        <div className="font-bold tracking-widest uppercase">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full pb-32">
      {/* Header & Concept intro */}
      <section className="pt-12 pb-8 px-4 border-b border-game-border/50 bg-game-darker/50">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-black text-white mb-4 tracking-tight"
          >
            WORLD <span className="text-game-purple text-glow">MEMORY</span>
          </motion.h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Not achievements. Not leaderboards. This is the living history of GAMEWORLD. Every major action permanently alters the universe.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 mt-12">
        {/* IMPACT Visualization Graph */}
        {memories.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-game-neon" />
              <h3 className="text-xl font-bold font-display tracking-widest uppercase text-gray-300">Global Impact Resonance</h3>
            </div>
            
            <div className="w-full h-48 glass-panel rounded-xl border border-game-border relative overflow-hidden flex items-end px-4 pb-4">
              <div className="absolute inset-0 bg-gradient-to-t from-game-purple/10 to-transparent pointer-events-none" />
              
              <div className="relative w-full h-full flex items-end justify-between gap-1 z-10">
                {memories.map((evt, idx) => {
                  const heightPercentage = Math.max(10, evt.impact);
                  const isFilteredOut = filter !== 'All' && evt.type !== filter;
                  
                  return (
                    <motion.div 
                      key={`bar-${evt._id}`}
                      className="relative flex-1 group"
                      initial={{ height: 0 }}
                      animate={{ 
                        height: `${heightPercentage}%`,
                        opacity: isFilteredOut ? 0.2 : 1
                      }}
                      transition={{ duration: 1, delay: idx * 0.1, type: 'spring' }}
                    >
                      <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-game-neon/80 to-game-purple/80 rounded-t-sm shadow-[0_0_10px_rgba(0,240,255,0.3)] transition-all group-hover:brightness-150" />
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-game-darker border border-game-border text-xs px-2 py-1 rounded whitespace-nowrap z-20 pointer-events-none">
                        {new Date(evt.timestamp).toLocaleDateString()} - {getImpactLevel(evt.impact)}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Connecting line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" preserveAspectRatio="none">
                <motion.path
                  d={`M 0 ${192} ` + memories.map((evt, idx) => {
                    const x = (idx / (memories.length - 1 || 1)) * 100;
                    const y = 192 - (192 * (Math.max(10, evt.impact) / 100));
                    return `L ${x}% ${y} `;
                  }).join('')}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeOpacity="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </svg>
            </div>
          </section>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setFilter(cat.label)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
                filter === cat.label 
                  ? 'bg-game-neon/10 border-game-neon text-game-neon shadow-[0_0_15px_rgba(0,240,255,0.2)]' 
                  : 'bg-game-panel border-game-border text-gray-400 hover:border-gray-500 hover:text-white'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Interactive Chronological Timeline */}
        <div className="relative border-l-2 border-game-border/50 ml-4 md:ml-1/2 space-y-12 pb-12">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((evt, index) => (
              <motion.div
                key={evt._id}
                layout
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="relative pl-8 md:pl-0 w-full md:w-1/2 md:even:ml-auto md:odd:pr-12 md:even:pl-12 group"
              >
                {/* Timeline Node */}
                <div className="absolute left-[-9px] md:left-auto md:group-odd:-right-[9px] md:group-even:-left-[9px] top-1 w-4 h-4 rounded-full bg-game-darker border-2 border-game-neon shadow-[0_0_10px_rgba(0,240,255,0.5)] z-10 transition-transform group-hover:scale-150 group-hover:bg-game-neon" />
                
                {/* Timeline Line connection for desktop */}
                <div className="hidden md:block absolute top-3 group-odd:-right-0 group-odd:w-12 group-even:-left-0 group-even:w-12 h-0.5 bg-game-border/50 -z-10 group-hover:bg-game-neon/50 transition-colors" />

                <div className="glass-panel p-6 rounded-lg hover:border-game-purple/50 transition-colors duration-300 group-hover:shadow-[0_0_20px_rgba(138,43,226,0.1)]">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3 text-game-neon text-sm font-bold tracking-widest">
                      {new Date(evt.timestamp).toLocaleDateString()}
                    </div>
                    <div className="text-gray-500">
                      {getCategoryIcon(evt.type)}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{evt.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {evt.description}
                  </p>
                  
                  <div className="pt-4 border-t border-game-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="text-xs text-gray-500">
                      Forged by <span className="text-white font-semibold">{evt.actorName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                      Impact: <span className={getImpactColor(getImpactLevel(evt.impact))}>{getImpactLevel(evt.impact)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredEvents.length === 0 && (
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }}
               className="text-center py-12 text-gray-500"
             >
               No history recorded in this sector yet. (Run the seed script)
             </motion.div>
          )}
          
          {/* Origin Point */}
          <div className="absolute bottom-0 left-[-5px] md:left-auto md:right-[50%] md:translate-x-[5px] w-2 h-2 rounded-full bg-game-border" />
        </div>
      </div>
    </div>
  );
}
