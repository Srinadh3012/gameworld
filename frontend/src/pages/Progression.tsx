import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { progressionSystem } from '../game/systems/ProgressionSystem';
import type { LocalProgression } from '../game/systems/ProgressionSystem';
import { GAME_ABILITIES } from '../game/data/abilityData';
import type { Ability } from '../game/data/abilityData';
import { Lock, Unlock, Zap, Brain, Eye, Activity } from 'lucide-react';

export function Progression() {
  const [progression, setProgression] = useState<LocalProgression | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProg = async () => {
      const data = await progressionSystem.getProgression();
      setProgression(data);
      setLoading(false);
    };
    fetchProg();
  }, []);

  if (loading || !progression) {
    return (
      <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
        <div className="text-game-neon animate-pulse tracking-widest font-mono">LOADING PROGRESSION...</div>
      </div>
    );
  }

  const xpRequired = 100 + ((progression.level - 1) * 75);
  const xpPercent = Math.min(100, Math.max(0, (progression.experience / xpRequired) * 100));

  const handleUnlock = async (abilityId: string) => {
    if (progression.skillPoints <= 0) return;
    const newProg = await progressionSystem.unlockAbility(abilityId, progression);
    if (newProg) {
      setProgression(newProg);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 relative"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-game-purple/20 blur-[100px] rounded-full pointer-events-none" />
        <h1 className="text-5xl font-display font-black text-white mb-4 tracking-widest text-glow relative uppercase">
          Neural Progression
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg relative">
          Evolve your abilities by exploring the world and interfacing with its remnants.
        </p>
      </motion.div>

      {/* Main Status Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <Card className="lg:col-span-2 p-8 relative overflow-hidden bg-black/40 border border-game-purple/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-game-purple/10 blur-[50px] rounded-full pointer-events-none" />
          <div className="flex items-center gap-8 mb-8 relative z-10">
            <div className="flex flex-col items-center justify-center w-24 h-24 rounded-full bg-game-purple/20 border-2 border-game-purple shadow-[0_0_20px_rgba(138,43,226,0.4)]">
              <span className="text-xs text-game-purple uppercase font-bold tracking-widest mb-1">Level</span>
              <span className="text-4xl text-white font-mono font-bold leading-none">{progression.level}</span>
            </div>
            <div className="flex-grow">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-mono text-gray-300 uppercase">Experience</span>
                <span className="text-sm font-mono text-game-neon">{progression.experience} / {xpRequired} XP</span>
              </div>
              <div className="h-3 w-full bg-gray-900 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="h-full bg-gradient-to-r from-game-purple to-game-neon transition-all duration-500 shadow-[0_0_10px_#00f3ff]"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            <div className="bg-black/50 p-4 rounded border border-white/5">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Exploration</div>
              <div className="text-lg font-mono text-white">{progression.explorationXP} <span className="text-xs text-gray-600">XP</span></div>
            </div>
            <div className="bg-black/50 p-4 rounded border border-white/5">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Discovery</div>
              <div className="text-lg font-mono text-white">{progression.discoveryXP} <span className="text-xs text-gray-600">XP</span></div>
            </div>
            <div className="bg-black/50 p-4 rounded border border-white/5">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Memories</div>
              <div className="text-lg font-mono text-white">{progression.memoryXP} <span className="text-xs text-gray-600">XP</span></div>
            </div>
            <div className="bg-black/50 p-4 rounded border border-white/5">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total Earned</div>
              <div className="text-lg font-mono text-game-neon">{progression.totalExperience} <span className="text-xs text-game-neon/50">XP</span></div>
            </div>
          </div>
        </Card>

        <Card className="p-8 flex flex-col items-center justify-center text-center bg-black/40 border border-game-neon/30">
          <Brain className="w-12 h-12 text-game-neon mb-4 opacity-80" />
          <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-2">Available Skill Points</h2>
          <div className="text-6xl font-display font-black text-white text-glow mb-6">
            {progression.skillPoints}
          </div>
          <p className="text-xs text-gray-500 max-w-xs">
            Earn skill points by leveling up. Use them to unlock advanced abilities and interface directly with the world.
          </p>
        </Card>
      </div>

      {/* Skill Tree */}
      <h2 className="text-2xl font-display font-bold text-white mb-6 tracking-widest border-b border-white/10 pb-4">
        ABILITY MATRIX
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(GAME_ABILITIES).map((ability: Ability) => {
          const isUnlocked = progression.unlockedAbilities.includes(ability.id);
          // Cast ability to any to check for prerequisites if we want to add them later, or just ignore since they aren't in Ability interface yet
          const hasPrereq = !(ability as any).prerequisites || (ability as any).prerequisites.every((p: string) => progression.unlockedAbilities.includes(p));
          const canUnlock = hasPrereq && !isUnlocked && progression.skillPoints > 0 && progression.level >= ability.levelRequirement;
          const levelLocked = progression.level < ability.levelRequirement;

          return (
            <Card key={ability.id} className={`p-6 relative overflow-hidden transition-all duration-300 ${isUnlocked ? 'border-game-purple/50 bg-game-purple/5' : (canUnlock ? 'border-game-neon/50 hover:bg-white/5' : 'border-white/5 bg-black/60 opacity-60')}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded ${isUnlocked ? 'bg-game-purple/20 text-game-purple' : 'bg-white/5 text-gray-500'}`}>
                    {ability.id.includes('sense') || ability.id.includes('vision') ? <Eye className="w-5 h-5" /> : 
                     ability.id.includes('step') ? <Zap className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className={`font-bold uppercase tracking-wider ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>{ability.name}</h3>
                    <div className="text-[10px] font-mono text-gray-500">LVL REQ: {ability.levelRequirement}</div>
                  </div>
                </div>
                {isUnlocked ? (
                  <Unlock className="w-4 h-4 text-game-purple" />
                ) : (
                  <Lock className={`w-4 h-4 ${canUnlock ? 'text-game-neon' : 'text-gray-600'}`} />
                )}
              </div>
              
              <p className="text-sm text-gray-400 mb-6 min-h-[40px]">
                {ability.description}
              </p>

              {!isUnlocked && (
                <Button 
                  disabled={!canUnlock}
                  onClick={() => handleUnlock(ability.id)}
                  className={`w-full py-2 text-xs uppercase tracking-widest font-bold ${canUnlock ? 'bg-game-neon/10 text-game-neon border border-game-neon hover:bg-game-neon/20' : 'bg-white/5 text-gray-600 border border-white/5'}`}
                >
                  {levelLocked ? `Unlocks at LVL ${ability.levelRequirement}` : (!hasPrereq ? 'Prerequisites Missing' : 'Unlock Ability')}
                </Button>
              )}
              {isUnlocked && (
                <div className="w-full py-2 text-center text-xs uppercase tracking-widest font-bold text-game-purple border border-game-purple/30 bg-game-purple/10 rounded">
                  Active
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
