import React from 'react';
import { motion } from 'framer-motion';

interface WorldImpactsProps {
  impacts: { worldName: string; impactScore: number; color: string }[];
}

export function WorldImpactChart({ impacts }: WorldImpactsProps) {
  // Sort to make the largest one center, or just layout sequentially.
  return (
    <div className="flex flex-wrap gap-6 items-center justify-center p-4 min-h-[250px]">
      {impacts.map((impact, i) => {
        // Calculate size based on impact score (0-100)
        // Min size 60px, max size 160px
        const size = 60 + (impact.impactScore / 100) * 100;
        
        return (
          <motion.div
            key={impact.worldName}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", delay: i * 0.2 }}
            className="flex flex-col items-center gap-3 relative group"
          >
            {/* The Node */}
            <motion.div
              style={{ 
                width: size, 
                height: size, 
                borderColor: impact.color,
                boxShadow: `0 0 ${impact.impactScore / 2}px ${impact.color}60, inset 0 0 ${impact.impactScore / 4}px ${impact.color}40`
              }}
              className="rounded-full border-2 flex items-center justify-center bg-game-darker relative overflow-hidden"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4 + (i % 2), repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Inner core pulse */}
              <motion.div 
                className="rounded-full opacity-50"
                style={{ width: '40%', height: '40%', backgroundColor: impact.color }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
            
            {/* Label */}
            <div className="text-center">
              <h4 className="text-sm font-bold text-white tracking-wide">{impact.worldName}</h4>
              <p className="text-xs text-gray-500">{impact.impactScore}% Influence</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
