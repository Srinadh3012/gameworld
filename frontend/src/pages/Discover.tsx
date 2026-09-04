import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { WorldPreviewOverlay } from '../components/discover/WorldPreviewOverlay';
import { LIVE_EVENTS } from '../data/mockDiscoverData'; // Fallback for events if needed
import { Globe2, Radio, Swords, Zap, Users, Loader2 } from 'lucide-react';
import { getWorlds, getCreations } from '../services/api';

export function Discover() {
  const [selectedWorld, setSelectedWorld] = useState<any | null>(null);
  const [worlds, setWorlds] = useState<any[]>([]);
  const [creations, setCreations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [worldsRes, creationsRes] = await Promise.all([
          getWorlds().catch(() => ({ data: [] })),
          getCreations().catch(() => ({ data: [] }))
        ]);
        
        setWorlds(worldsRes?.data || []);
        setCreations(creationsRes?.data || []);
      } catch (err) {
        console.error('Discover load error:', err);
        setError('Failed to load universe data.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="w-full pb-20">
      {/* Header */}
      <section className="pt-12 pb-16 px-4 border-b border-game-border/50 bg-game-darker/50">
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-black text-white mb-4"
          >
            DISCOVER THE <span className="text-game-neon text-glow">UNKNOWN</span>
          </motion.h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Explore evolving player-created worlds, engage in live events, and take on community challenges across the GAMEWORLD universe.
          </p>
        </div>
      </section>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-game-neon gap-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <div className="font-bold tracking-widest uppercase">Scanning Universe...</div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-32 text-red-400 gap-4">
          <div className="font-bold tracking-widest uppercase">{error}</div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-24">
          
          {/* DISCOVER WORLDS */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Globe2 className="w-8 h-8 text-game-neon" />
              <h2 className="text-3xl font-display font-bold">Discover Worlds</h2>
            </div>
            
            {worlds.length === 0 ? (
              <div className="p-8 border border-game-border border-dashed rounded-xl text-center text-gray-500">
                No worlds discovered yet. Run the development seed script to populate data.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {worlds.map((world, i) => (
                  <motion.div
                    key={world._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card 
                      glowOnHover 
                      className="h-full cursor-pointer group flex flex-col"
                      onClick={() => setSelectedWorld(world)}
                    >
                      <div className="h-40 bg-gradient-to-br from-game-border to-game-panel relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-300" />
                        {world.status === 'Unstable' && (
                          <div className="absolute top-2 right-2 bg-red-500/80 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> CRITICAL
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="font-bold text-xl mb-1 text-white group-hover:text-game-neon transition-colors">{world.name}</h3>
                        <p className="text-xs text-gray-500 mb-4">World Region</p>
                        
                        <div className="mt-auto space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">Level {world.evolutionLevel}</span>
                            <span className="flex items-center gap-1 text-gray-300">
                              <Users className="w-3.5 h-3.5 text-game-purple" /> {world.activePlayers || 0}
                            </span>
                          </div>
                          <div className="pt-3 border-t border-game-border flex justify-between items-center">
                            <Badge variant="info" className="text-[10px] truncate max-w-[120px]">{world.status}</Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* LIVE EVENTS */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Radio className="w-8 h-8 text-game-purple" />
              <h2 className="text-3xl font-display font-bold">Live Events</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {LIVE_EVENTS.map((event, i) => (
                <div key={event.id} className="bg-game-panel border border-game-border rounded-lg p-5 flex items-start gap-4">
                  <div className="mt-1">
                    <Zap className="w-5 h-5 text-game-neon" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="warning">{event.type}</Badge>
                      <span className="text-xs text-gray-500">{event.participants} participants</span>
                    </div>
                    <p className="text-gray-300 text-sm">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* DISCOVER CHALLENGES / CREATIONS */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Swords className="w-8 h-8 text-game-neon" />
              <h2 className="text-3xl font-display font-bold">Community Creations & Challenges</h2>
            </div>
            
            {creations.length === 0 ? (
              <div className="p-8 border border-game-border border-dashed rounded-xl text-center text-gray-500">
                No creations found.
              </div>
            ) : (
              <div className="overflow-x-auto pb-4">
                <div className="flex gap-4 min-w-max">
                  {creations.map((creation) => (
                    <Card key={creation._id} className="w-72 p-5 flex flex-col">
                      <Badge className="w-fit mb-3">{creation.type}</Badge>
                      <h3 className="font-bold text-lg mb-1">{creation.title}</h3>
                      <p className="text-xs text-gray-500 mb-4">{creation.description}</p>
                      <div className="mt-auto flex justify-between items-center">
                        <span className="text-sm text-gray-400">Status</span>
                        <span className="text-sm font-semibold text-game-neon">
                          {creation.status}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </section>

        </div>
      )}

      {/* Overlays */}
      {selectedWorld && (
        <WorldPreviewOverlay 
          world={{
            id: selectedWorld._id,
            name: selectedWorld.name,
            creator: selectedWorld.creatorId,
            level: selectedWorld.evolutionLevel,
            players: selectedWorld.activePlayers,
            event: selectedWorld.status,
            difficulty: 'Standard',
            status: selectedWorld.status === 'Unstable' ? 'Critical' : 'Stable',
            image: '' // Fallback to CSS gradient in overlay if possible
          }} 
          onClose={() => setSelectedWorld(null)} 
        />
      )}
    </div>
  );
}
