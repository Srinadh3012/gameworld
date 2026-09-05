import { GAME_EVENTS } from '../data/eventData';
import { useGameState } from '../context/GameStateContext';
import { companionManager } from '../systems/CompanionManager';
import { storyManager } from '../story/StoryManager';
import { guardianManager } from '../guardians/GuardianManager';
import { GUARDIANS } from '../guardians/GuardianData';
import { WORLD_COORDINATES } from '../data/worldCoordinates';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Map as MapIcon, Database, Orbit, Flame, AlertCircle, MapPin, Shield } from 'lucide-react';
import { REGIONS } from '../data/regionData';
import { useState } from 'react';

export function WorldMap() {
  const { isMapOpen, setMapOpen, discoveredRegions, explorationCount, worldEnergy, worldStability, worldImpact, activeEvents, completedEvents, achievements, activeCompanion } = useGameState();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const mapScale = 150;
  const missionTargets = storyManager.getMissionTargets();

  return (
    <AnimatePresence>
      {isMapOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-xl p-8 pointer-events-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-12 border-b border-game-border pb-6">
            <div className="flex items-center gap-4">
              <MapIcon className="w-8 h-8 text-game-neon" />
              <div>
                <h1 className="text-3xl font-display font-black text-white uppercase tracking-widest text-glow">
                  Sector Alpha
                </h1>
                <p className="text-gray-500 font-mono text-sm tracking-widest uppercase">
                  Topographical Map Data
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setMapOpen(false)}
              className="text-gray-500 hover:text-white transition-colors p-2"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          <div className="flex flex-1 gap-12">
            {/* Map Area */}
            <div className="flex-1 relative border border-game-border bg-game-dark/50 rounded-2xl overflow-hidden shadow-[inset_0_0_50px_rgba(0,243,255,0.05)] flex items-center justify-center p-8">
              {/* Grid Background */}
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
              
              <div className="relative w-full max-w-2xl aspect-square border border-white/5 rounded-full flex items-center justify-center">
                <div className="absolute w-3/4 h-3/4 border border-white/5 rounded-full" />
                <div className="absolute w-1/2 h-1/2 border border-white/10 rounded-full" />
                <div className="absolute w-1/4 h-1/4 border border-white/20 rounded-full" />
                
                {/* World Core Node */}
                <div className="absolute w-6 h-6 rounded-full bg-game-purple shadow-[0_0_20px_#8a2be2] flex items-center justify-center z-20">
                  <Orbit className="w-4 h-4 text-white" />
                </div>
                
                {/* Player Location (Center) */}
                <div className="absolute flex flex-col items-center gap-1 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none" style={{ left: '50%', top: '45%' }}>
                   <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_10px_white]" />
                   <span className="text-[9px] font-mono tracking-widest uppercase text-white font-bold">PLAYER</span>
                   {activeCompanion && (
                     <span className="text-[8px] font-mono tracking-widest uppercase text-cyan-400 leading-none">
                       + {activeCompanion.replace('npc_', '')}
                     </span>
                   )}
                </div>
                
                {/* Render Regions stylized */}
                {REGIONS.map((region, i) => {
                  const isDiscovered = discoveredRegions.includes(region.id);
                  // Calculate approximate polar/cartesian visual layout
                  const angle = (i * Math.PI) / 2;
                  const dist = 40 + (i * 10);
                  const x = Math.cos(angle) * dist;
                  const y = Math.sin(angle) * dist;
                  
                  return (
                    <div 
                      key={region.id}
                      className="absolute flex flex-col items-center gap-2 transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `calc(50% + ${x}%)`, top: `calc(50% + ${y}%)` }}
                    >
                      <div 
                        className={`w-12 h-12 rounded-lg border-2 rotate-45 flex items-center justify-center backdrop-blur-sm transition-all duration-1000 ${isDiscovered ? 'border-current bg-current/20' : 'border-gray-800 bg-gray-900/50'}`}
                        style={{ color: isDiscovered ? region.color : 'inherit' }}
                      >
                        <div className="w-6 h-6 -rotate-45 opacity-80" />
                      </div>
                      <span className={`text-[10px] font-mono tracking-widest uppercase mt-2 whitespace-nowrap ${isDiscovered ? 'text-white' : 'text-gray-700'}`}>
                        {isDiscovered ? region.name : 'Unknown Signal'}
                      </span>
                    </div>
                  );
                })}

                {/* Mission Objectives */}
            {missionTargets.map((m: any, idx: number) => {
              const xPos = 50 + (m.x / mapScale) * 50;
              const yPos = 50 + (m.z / mapScale) * 50;
              
              return (
                <div 
                  key={`mission_${idx}`}
                  className="absolute animate-pulse"
                  style={{
                    left: `${xPos}%`,
                    top: `${yPos}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onMouseEnter={() => setHoveredNode(m.title)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <MapPin className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                </div>
              );
            })}

            {/* Event Markers */}
                {GAME_EVENTS.map((ev, i) => {
                  if (!ev.location) return null;
                  const isActive = activeEvents.includes(ev.id);
                  const isCompleted = completedEvents.includes(ev.id);
                  
                  // Hide if not discovered/active/completed yet, but for simplicity let's show them if active or completed.
                  if (!isActive && !isCompleted) return null;
                  
                  const dist = 30 + (i * 15);
                  const angle = (i * 2) * Math.PI / 3;
                  const x = Math.cos(angle) * dist;
                  const y = Math.sin(angle) * dist;

                  return (
                    <div 
                      key={`evt_${ev.id}`}
                      className="absolute flex flex-col items-center gap-1 transform -translate-x-1/2 -translate-y-1/2 z-30"
                      style={{ left: `calc(50% + ${x}%)`, top: `calc(50% + ${y}%)` }}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? 'bg-game-neon/20 border border-game-neon animate-pulse text-game-neon' : 'bg-gray-800 border border-gray-600 text-gray-400'}`}>
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <span className={`text-[8px] font-mono tracking-widest uppercase whitespace-nowrap ${isActive ? 'text-game-neon' : 'text-gray-500'}`}>
                        {isActive ? 'ACTIVE EVENT' : 'COMPLETED'}
                      </span>
                    </div>
                  );
                })}

                {/* Guardians */}
                {GUARDIANS.map((g, i) => {
                  const encounter = guardianManager.getEncounter(g.id);
                  if (encounter.status === 'DORMANT') return null; // Not discovered

                  // Mock map positions based on their location type
                  const loc = g.locationType === 'REGION' ? WORLD_COORDINATES.regions.find(r => r.id === g.locationId) : WORLD_COORDINATES.landmarks.find(l => l.id === g.locationId);
                  if (!loc) return null;

                  const xPos = 50 + (loc.x / mapScale) * 50;
                  const yPos = 50 + (loc.z / mapScale) * 50;

                  return (
                    <div 
                      key={`guardian_${g.id}`}
                      className="absolute flex flex-col items-center gap-1 transform -translate-x-1/2 -translate-y-1/2 z-40"
                      style={{ left: `${xPos}%`, top: `${yPos}%` }}
                      onMouseEnter={() => setHoveredNode(g.name)}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${encounter.completed ? 'bg-game-neon/20 border border-game-neon text-game-neon' : 'bg-red-900/50 border border-red-500 animate-pulse text-red-500'}`}>
                        <Shield className="w-4 h-4" />
                      </div>
                      <span className={`text-[8px] font-mono tracking-widest uppercase whitespace-nowrap ${encounter.completed ? 'text-game-neon' : 'text-red-500'}`}>
                        {encounter.completed ? 'RESOLVED' : 'CHALLENGE'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Sidebar Stats */}
            <div className="w-80 flex flex-col gap-6">
              <div className="glass-panel p-6 rounded-xl border border-game-border bg-black/60">
                <h3 className="text-white font-mono uppercase tracking-widest text-xs mb-6 opacity-70">
                  Sector Overview
                </h3>
                
                <div className="flex flex-col gap-6">
                  <div>
                    <div className="flex justify-between text-xs font-mono uppercase text-gray-400 mb-2">
                      <span>Regions Charted</span>
                      <span className="text-white">{explorationCount.regions}/{REGIONS.length}</span>
                    </div>
                    <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
                      <div className="h-full bg-game-neon" style={{ width: `${(explorationCount.regions / REGIONS.length) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono uppercase text-gray-400 mb-2">
                      <span>Memories Recovered</span>
                      <span className="text-white">{explorationCount.memories}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs font-mono uppercase text-gray-400 mb-2">
                      <span>Core Status</span>
                      <span className={explorationCount.coreActivated ? 'text-game-purple font-bold text-glow' : 'text-gray-500'}>
                        {explorationCount.coreActivated ? 'SYNCHRONIZED' : 'DORMANT'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono uppercase text-gray-400 mb-2">
                      <span>Achievements</span>
                      <span className="text-game-neon">{achievements.length}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="glass-panel p-6 rounded-xl border border-game-border bg-black/60 flex-1">
                <h3 className="text-white font-mono uppercase tracking-widest text-xs mb-6 opacity-70">
                  Global Metrics
                </h3>
                
                <div className="flex items-center gap-4 mb-6">
                  <Flame className="w-8 h-8 text-orange-500" />
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">World Energy</span>
                    <span className="text-2xl font-bold font-mono text-white">{worldEnergy}%</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Database className="w-8 h-8 text-blue-500" />
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">World Stability</span>
                    <span className="text-2xl font-bold font-mono text-white">{worldStability}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/10">
                  <AlertCircle className="w-8 h-8 text-game-neon" />
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] text-game-neon/70 uppercase tracking-widest">World Impact</span>
                    <span className="text-3xl font-bold font-mono text-game-neon text-glow shadow-game-neon">{worldImpact}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
