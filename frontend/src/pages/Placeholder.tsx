import React from 'react';
import { motion } from 'framer-motion';

interface PlaceholderProps {
  title: string;
}

export function Placeholder({ title }: PlaceholderProps) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-12 rounded-2xl max-w-2xl w-full"
      >
        <h1 className="text-4xl md:text-6xl font-display font-black text-game-neon mb-6 uppercase tracking-widest text-glow">
          {title}
        </h1>
        <p className="text-gray-400 text-lg md:text-xl">
          This sector of the GAMEWORLD is currently under construction.
        </p>
        <div className="mt-8 flex justify-center">
          <div className="w-16 h-1 bg-game-purple/50 rounded-full animate-pulse" />
        </div>
      </motion.div>
    </div>
  );
}
