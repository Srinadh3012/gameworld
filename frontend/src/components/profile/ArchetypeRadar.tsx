import React from 'react';
import { motion } from 'framer-motion';
import type { ArchetypeTraits } from '../../data/mockProfileData';

interface ArchetypeRadarProps {
  traits: ArchetypeTraits;
}

export function ArchetypeRadar({ traits }: ArchetypeRadarProps) {
  const size = 300;
  const center = size / 2;
  const radius = (size / 2) - 40; // leave room for labels
  
  const axes = [
    { key: 'explorer', label: 'EXPLORER' },
    { key: 'builder', label: 'BUILDER' },
    { key: 'strategist', label: 'STRATEGIST' },
    { key: 'hunter', label: 'HUNTER' },
    { key: 'creator', label: 'CREATOR' },
    { key: 'guardian', label: 'GUARDIAN' },
  ];

  const getCoordinates = (value: number, index: number) => {
    const angle = (Math.PI * 2 * index) / axes.length - Math.PI / 2;
    const distance = (value / 100) * radius;
    return {
      x: center + distance * Math.cos(angle),
      y: center + distance * Math.sin(angle),
    };
  };

  const traitPoints = axes.map((axis, i) => getCoordinates(traits[axis.key as keyof ArchetypeTraits], i));
  const pathData = traitPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + ' Z';
  
  // Background webs
  const levels = [20, 40, 60, 80, 100];

  return (
    <div className="relative w-full flex justify-center items-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grids */}
        {levels.map((level) => {
          const levelPoints = axes.map((_, i) => getCoordinates(level, i));
          const levelPath = levelPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + ' Z';
          return (
            <path
              key={level}
              d={levelPath}
              fill="none"
              stroke="currentColor"
              className="text-game-border/30"
              strokeWidth="1"
            />
          );
        })}

        {/* Axes Lines */}
        {axes.map((_, i) => {
          const endPoint = getCoordinates(100, i);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={endPoint.x}
              y2={endPoint.y}
              stroke="currentColor"
              className="text-game-border/50"
              strokeWidth="1"
            />
          );
        })}

        {/* Data Polygon with Glow */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          d={pathData}
          fill="rgba(0, 240, 255, 0.15)"
          stroke="#00f0ff"
          strokeWidth="2"
          className="drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]"
        />

        {/* Data Points */}
        {traitPoints.map((p, i) => (
          <motion.circle
            key={i}
            initial={{ r: 0 }}
            animate={{ r: 4 }}
            transition={{ delay: 1.5 + (i * 0.1) }}
            cx={p.x}
            cy={p.y}
            fill="#ffffff"
            className="drop-shadow-[0_0_5px_rgba(255,255,255,1)]"
          />
        ))}

        {/* Labels */}
        {axes.map((axis, i) => {
          const labelPoint = getCoordinates(125, i);
          return (
            <text
              key={i}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor="middle"
              alignmentBaseline="middle"
              className="text-[10px] font-bold font-display uppercase fill-gray-400 tracking-widest"
            >
              {axis.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
