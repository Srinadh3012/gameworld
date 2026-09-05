import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '../game/context/GameStateContext';
import { WORLD_COORDINATES } from '../game/data/worldCoordinates';
import type { Landmark } from '../game/data/worldCoordinates';
import { motion, AnimatePresence } from 'framer-motion';
import { NPC_DATA } from '../game/data/npcData';

export function WorldMapPage() {
  const navigate = useNavigate();
  const { discoveredLandmarks, discoveredRegions, fastTravelNodes, unlockFastTravel, progression, npcRelationships } = useGameState();
  
  const [filter, setFilter] = useState<'ALL' | 'LANDMARKS' | 'REGIONS'>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const handleFastTravel = (landmarkId: string) => {
    if (fastTravelNodes.includes(landmarkId)) {
      navigate('/play');
      // In a real implementation, we'd trigger a transition and move the player.
    }
  };

  const mapScale = 4; // Scaling 3D coords to Map pixels
  const centerOffset = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  // Calculate Region Stats
  const regionStats = (regionId: string) => {
    const regionLandmarks = WORLD_COORDINATES.landmarks.filter(l => l.regionId === regionId);
    const discovered = regionLandmarks.filter(l => discoveredLandmarks.includes(l.id)).length;
    return { discovered, total: regionLandmarks.length, percentage: regionLandmarks.length ? Math.round((discovered/regionLandmarks.length)*100) : 0 };
  };

  const canSeeHidden = progression.unlockedAbilities.includes('ability_world_sense');

  return (
    <div className="fixed inset-0 bg-gray-950 text-cyan-400 font-mono overflow-hidden flex flex-col">
      {/* Header */}
      <div className="absolute top-0 w-full p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div>
          <h1 className="text-2xl font-bold tracking-[0.2em] text-cyan-300">SECTOR ALPHA MAP</h1>
          <div className="text-sm text-cyan-600">CARTOGRAPHIC RECONSTRUCTION</div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setFilter('ALL')} className={`px-4 py-1 border border-cyan-800 ${filter === 'ALL' ? 'bg-cyan-900/50' : 'hover:bg-cyan-900/30'}`}>ALL</button>
          <button onClick={() => setFilter('REGIONS')} className={`px-4 py-1 border border-cyan-800 ${filter === 'REGIONS' ? 'bg-cyan-900/50' : 'hover:bg-cyan-900/30'}`}>REGIONS</button>
          <button onClick={() => setFilter('LANDMARKS')} className={`px-4 py-1 border border-cyan-800 ${filter === 'LANDMARKS' ? 'bg-cyan-900/50' : 'hover:bg-cyan-900/30'}`}>LANDMARKS</button>
          <button onClick={() => navigate('/play')} className="px-4 py-1 bg-cyan-600 text-black hover:bg-cyan-400 font-bold ml-4">CLOSE MAP (ESC)</button>
        </div>
      </div>

      {/* Map Surface (Draggable in a real app, static for now with CSS pan/zoom if needed) */}
      <div className="flex-1 relative w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#4f4f4f_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        <div className="absolute top-1/2 left-1/2" style={{ transform: 'translate(-50%, -50%)' }}>
          
          {/* Render Regions as blurred shapes or borders if discovered */}
          {(filter === 'ALL' || filter === 'REGIONS') && WORLD_COORDINATES.regions.map(region => {
            const isDiscovered = discoveredRegions.includes(region.id);
            const w = (region.bounds.maxX - region.bounds.minX) * mapScale;
            const h = (region.bounds.maxZ - region.bounds.minZ) * mapScale;
            const x = (region.bounds.minX + (region.bounds.maxX - region.bounds.minX)/2) * mapScale;
            const z = (region.bounds.minZ + (region.bounds.maxZ - region.bounds.minZ)/2) * mapScale;

            return (
              <div 
                key={region.id}
                onClick={() => setSelectedRegion(region.id)}
                className={`absolute border-2 transition-all cursor-pointer ${isDiscovered ? 'border-cyan-500/30 hover:border-cyan-400 bg-cyan-900/10 hover:bg-cyan-900/20' : 'border-gray-800/20 bg-gray-900/40 backdrop-blur-md'}`}
                style={{
                  width: w,
                  height: h,
                  left: x - w/2,
                  top: z - h/2,
                }}
              >
                {isDiscovered && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50 text-cyan-200 uppercase tracking-widest text-xs">
                    {region.name}
                  </div>
                )}
                {!isDiscovered && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 text-gray-500 uppercase tracking-widest text-xs">
                    UNKNOWN SECTOR
                  </div>
                )}
              </div>
            );
          })}

          {/* Render Landmarks */}
          {(filter === 'ALL' || filter === 'LANDMARKS') && WORLD_COORDINATES.landmarks.map(landmark => {
            const isDiscovered = discoveredLandmarks.includes(landmark.id);
            const isSecret = landmark.type === 'secret';
            
            // Only show undiscovered secrets if they have the ability, otherwise hide
            if (isSecret && !isDiscovered && !canSeeHidden) return null;

            // Fog of discovery - don't show normal undiscovered unless nearby or revealed
            if (!isDiscovered && !discoveredRegions.includes(landmark.regionId)) return null;

            return (
              <motion.div
                key={landmark.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`absolute w-4 h-4 -ml-2 -mt-2 rounded-full border border-cyan-400 cursor-pointer ${isDiscovered ? 'bg-cyan-500 shadow-[0_0_10px_#00f3ff]' : 'bg-transparent border-dashed opacity-50'}`}
                style={{
                  left: landmark.position[0] * mapScale,
                  top: landmark.position[2] * mapScale,
                }}
                onClick={() => {
                  if (isDiscovered) {
                    setSelectedRegion(landmark.regionId);
                  }
                }}
                title={isDiscovered ? landmark.name : "Unknown Signal"}
              />
            );
          })}

          {/* NPCs */}
          {Object.values(NPC_DATA).map(npc => {
            if (npcRelationships[npc.id] === undefined) return null; // Not met yet
            return (
              <div
                key={npc.id}
                className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer hover:scale-150 transition-transform shadow-lg z-20 flex items-center justify-center animate-pulse"
                style={{
                  backgroundColor: npc.color,
                  left: npc.defaultPosition[0] * mapScale,
                  top: npc.defaultPosition[2] * mapScale,
                  boxShadow: `0 0 10px ${npc.color}`
                }}
                title={`${npc.name} (${npc.title})`}
              >
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Region Detail Panel */}
      <AnimatePresence>
        {selectedRegion && (
          <motion.div 
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="absolute right-0 top-0 bottom-0 w-80 bg-black/90 border-l border-cyan-900 p-6 flex flex-col z-20"
          >
            <button onClick={() => setSelectedRegion(null)} className="self-end text-cyan-600 hover:text-cyan-300">✕ CLOSE</button>
            
            {(() => {
              const region = WORLD_COORDINATES.regions.find(r => r.id === selectedRegion);
              if (!region) return null;
              
              const isLocked = region.type === 'core' && !progression.unlockedAbilities.includes('ability_core_resonance');
              const stats = regionStats(region.id);

              return (
                <div className="mt-8 space-y-6">
                  <div>
                    <h2 className="text-xl font-bold tracking-widest text-cyan-300">{region.name}</h2>
                    <p className="text-sm text-cyan-600 mt-2">{isLocked ? 'ACCESS RESTRICTED' : region.description}</p>
                  </div>

                  {isLocked ? (
                    <div className="p-4 border border-red-900 bg-red-950/30 text-red-400">
                      <div className="font-bold">CORE ZONE</div>
                      <div className="text-xs mt-2">Required: Core Resonance</div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="text-xs text-cyan-600 mb-1">EXPLORATION</div>
                        <div className="w-full bg-cyan-950 h-2">
                          <div className="bg-cyan-400 h-full" style={{ width: `${stats.percentage}%` }}></div>
                        </div>
                        <div className="text-right text-xs mt-1 text-cyan-400">{stats.percentage}%</div>
                      </div>

                      <div>
                        <div className="text-xs text-cyan-600 mb-2">LANDMARKS</div>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                          {WORLD_COORDINATES.landmarks.filter(l => l.regionId === region.id).map(l => {
                            const disc = discoveredLandmarks.includes(l.id);
                            return (
                              <div key={l.id} className={`p-2 border ${disc ? 'border-cyan-800 bg-cyan-900/20' : 'border-gray-800 bg-gray-900/20 text-gray-500'}`}>
                                <div className="text-sm font-bold">{disc ? l.name : 'Unknown Signal'}</div>
                                {disc && fastTravelNodes.includes(l.id) && (
                                  <button onClick={() => handleFastTravel(l.id)} className="mt-2 text-xs bg-cyan-800 px-2 py-1 text-white hover:bg-cyan-600 w-full">
                                    FAST TRAVEL
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
