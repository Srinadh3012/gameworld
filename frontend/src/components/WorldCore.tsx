import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const REGIONS = [
  { id: 'neon-rift', name: 'Neon Rift', x: 20, y: 30, color: '#00f0ff', players: 12450, activity: 'High', event: 'Data Heist', level: 45, size: 24 },
  { id: 'forgotten-valley', name: 'Forgotten Valley', x: 75, y: 25, color: '#8a2be2', players: 4320, activity: 'Medium', event: 'Ancient Awakening', level: 22, size: 20 },
  { id: 'iron-district', name: 'Iron District', x: 80, y: 70, color: '#ff4500', players: 28900, activity: 'Critical', event: 'Conflict State', level: 88, size: 28 },
  { id: 'echo-forest', name: 'Echo Forest', x: 25, y: 75, color: '#00ff7f', players: 127, activity: 'Low', event: 'Newly Discovered', level: 1, size: 16 },
  { id: 'zero-sector', name: 'Zero Sector', x: 50, y: 50, color: '#ff00ff', players: 9999, activity: 'Unstable', event: 'Destabilizing', level: 99, size: 36 },
];

const CONNECTIONS = [
  [0, 4], [1, 4], [2, 4], [3, 4], [0, 3], [1, 2]
];

export function WorldCore() {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  
  return (
    <div className="relative w-full max-w-4xl aspect-[4/3] sm:aspect-video mx-auto select-none">
      {/* Background Grid & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-game-panel/20 to-transparent pointer-events-none" />
      
      {/* Connections (SVG Lines) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {CONNECTIONS.map(([startIdx, endIdx], i) => {
          const start = REGIONS[startIdx];
          const end = REGIONS[endIdx];
          const isHighlighted = hoveredRegion === start.id || hoveredRegion === end.id;
          
          return (
            <motion.line
              key={i}
              x1={`${start.x}%`}
              y1={`${start.y}%`}
              x2={`${end.x}%`}
              y2={`${end.y}%`}
              stroke={isHighlighted ? '#ffffff' : '#2a2a35'}
              strokeWidth={isHighlighted ? 2 : 1}
              strokeDasharray={isHighlighted ? '0' : '4'}
              animate={{ opacity: isHighlighted ? 0.8 : 0.3 }}
              className="transition-all duration-300"
            />
          );
        })}
      </svg>
      
      {/* Particles around Zero Sector */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            initial={{ 
              x: `${50 + (Math.random() * 20 - 10)}%`, 
              y: `${50 + (Math.random() * 20 - 10)}%` 
            }}
            animate={{
              x: `${50 + (Math.random() * 30 - 15)}%`,
              y: `${50 + (Math.random() * 30 - 15)}%`,
              opacity: [0.1, 0.5, 0.1]
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Nodes */}
      {REGIONS.map((region) => {
        const isHovered = hoveredRegion === region.id;
        
        return (
          <div key={region.id} className="absolute inset-0 pointer-events-none" style={{ left: `${region.x}%`, top: `${region.y}%` }}>
            {/* Core Node */}
            <motion.div
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer rounded-full bg-game-darker border-2"
              style={{ width: region.size, height: region.size, borderColor: region.color }}
              onHoverStart={() => setHoveredRegion(region.id)}
              onHoverEnd={() => setHoveredRegion(null)}
              animate={{ 
                y: [0, -5, 0],
                boxShadow: isHovered ? `0 0 20px ${region.color}` : `0 0 5px ${region.color}`
              }}
              transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Inner glowing core */}
              <div 
                className="absolute inset-1 rounded-full opacity-50" 
                style={{ backgroundColor: region.color }} 
              />
              
              {/* Pulsing ring for unstable/critical regions */}
              {['Critical', 'Unstable'].includes(region.activity) && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ border: `1px solid ${region.color}` }}
                  animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
              )}
            </motion.div>

            {/* Hover Info Card */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="absolute left-1/2 -translate-x-1/2 mt-6 pointer-events-none z-50 w-64"
                >
                  <div className="glass-panel p-4 rounded-lg shadow-xl" style={{ borderTopColor: region.color }}>
                    <h4 className="font-display font-bold text-lg mb-2" style={{ color: region.color }}>{region.name}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Evolution:</span>
                        <span className="font-semibold text-white">Lvl {region.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Players:</span>
                        <span className="font-semibold text-white">{region.players.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Activity:</span>
                        <span className="font-semibold" style={{ color: region.color }}>{region.activity}</span>
                      </div>
                      <div className="pt-2 mt-2 border-t border-game-border text-xs">
                        <span className="text-gray-400 block mb-1">Current Event:</span>
                        <span className="text-white font-medium animate-pulse">{region.event}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
