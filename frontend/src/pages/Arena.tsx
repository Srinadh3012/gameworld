import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Crosshair, Users, Map } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function Arena() {
  const navigate = useNavigate();

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 relative"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-game-purple/20 blur-[100px] rounded-full pointer-events-none" />
        <h1 className="text-5xl font-display font-black text-white mb-4 tracking-widest text-glow relative">
          THE ARENA
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg relative">
          Enter the combat zones and prove your worth in the evolving GAMEWORLD ecosystem.
        </p>
      </motion.div>

      {/* Primary GAMEWORLD Entry */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-16"
      >
        <div className="glass-panel p-1 rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-game-purple to-game-neon opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
          <div className="bg-game-dark/80 backdrop-blur-xl p-12 rounded-xl text-center relative z-10 border border-game-border">
            <h2 className="text-4xl font-display font-bold text-white mb-4">GAMEWORLD PROTOTYPE</h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto text-lg">
              Explore the living world. The world remembers every action you take. Experience the first playable 3D prototype.
            </p>
            <Button 
              onClick={() => navigate('/play')}
              variant="primary" 
              className="py-4 px-12 text-xl font-bold uppercase tracking-widest hover:scale-105 transition-transform"
            >
              Enter Gameworld
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Upcoming Modes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Battle Royale',
            icon: Crosshair,
            status: 'In Development',
            desc: 'Survive the collapsing rifts.',
            color: 'text-red-400',
            border: 'border-red-500/20'
          },
          {
            title: 'Territory War',
            icon: Map,
            status: 'Classified',
            desc: 'Conquer sectors with your faction.',
            color: 'text-game-purple',
            border: 'border-game-purple/20'
          },
          {
            title: 'Squad Tactics',
            icon: Users,
            status: 'Locked',
            desc: '4v4 tactical engagements.',
            color: 'text-game-neon',
            border: 'border-game-neon/20'
          },
          {
            title: 'Survival',
            icon: Shield,
            status: 'Locked',
            desc: 'Endure hostile environments.',
            color: 'text-blue-400',
            border: 'border-blue-500/20'
          }
        ].map((mode, index) => (
          <motion.div
            key={mode.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index + 0.4 }}
          >
            <Card className="h-full relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <mode.icon className={`w-10 h-10 ${mode.color} mb-4 drop-shadow-lg`} />
              <h3 className="text-xl font-bold text-white mb-2">{mode.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{mode.desc}</p>
              <div className={`inline-block px-3 py-1 rounded-full border ${mode.border} bg-white/5 text-xs font-mono text-gray-300`}>
                {mode.status}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
