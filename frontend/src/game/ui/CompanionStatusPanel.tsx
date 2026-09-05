import React from 'react';
import { useGameState } from "../context/GameStateContext";
import { NPC_DATA } from "../data/npcData";
import { companionManager } from "../systems/CompanionManager";
import { progressionSystem } from "../systems/ProgressionSystem";
import { eventSystem } from "../systems/EventSystem";
import { Users, UserPlus, UserMinus, ShieldAlert } from 'lucide-react';
import type { LocalProgression } from '../../utils/storage';

export function CompanionStatusPanel() {
  const { 
    activeCompanion, setActiveCompanion, npcRelationships, 
    progression
  } = useGameState();

  const completedEvents = eventSystem.getCompletedEventsList();

  const companions = ['npc_arin', 'npc_lyra', 'npc_sera'];

  return (
    <div className="w-full flex flex-col gap-4">
      <h2 className="text-xl font-display text-white uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
        <Users className="w-5 h-5 text-game-neon" />
        Companions
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {companions.map(id => {
          const npc = NPC_DATA[id];
          if (!npc) return null;
          
          const isActive = activeCompanion === id;
          const trust = npcRelationships[id] || 0;
          
          // Using dummy progression cast to pass type checking since LocalProgression is needed
          const prog = progression as any as LocalProgression;
          const { available, reason } = companionManager.canRecruit(id, npcRelationships, completedEvents, prog);
          const specialty = companionManager.getCompanionSpecialty(id);
          
          let rank = 'NEUTRAL';
          if (trust >= 100) rank = 'ALLY';
          else if (trust >= 50) rank = 'TRUSTED';
          else if (trust >= 20) rank = 'FAMILIAR';

          return (
            <div key={id} className={`p-4 rounded-xl border ${isActive ? 'bg-cyan-900/20 border-cyan-500/50' : 'bg-black/40 border-white/10'} flex flex-col gap-3 relative overflow-hidden`}>
              {isActive && (
                <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
              )}
              
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-mono text-white text-lg tracking-widest">{npc.name}</h3>
                  <p className="text-[10px] text-gray-400 uppercase font-sans tracking-widest">{npc.role}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-cyan-400 tracking-widest">{rank}</span>
                  <div className="w-20 h-1 mt-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400" style={{ width: `${Math.min(100, trust)}%` }} />
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-gray-300 font-sans">
                <span className="text-gray-500 font-mono tracking-wider text-[10px]">SPECIALTY: </span>
                {specialty}
              </div>
              
              <div className="mt-auto pt-4 flex justify-end">
                {isActive ? (
                  <button 
                    onClick={() => setActiveCompanion(null)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 border border-red-500/30 rounded text-xs text-red-200 font-mono tracking-wider transition-colors"
                  >
                    <UserMinus className="w-3 h-3" />
                    DISMISS
                  </button>
                ) : available ? (
                  <button 
                    onClick={() => setActiveCompanion(id)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-500/30 rounded text-xs text-cyan-200 font-mono tracking-wider transition-colors"
                  >
                    <UserPlus className="w-3 h-3" />
                    INVITE
                  </button>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1.5 opacity-50 bg-gray-900/30 border border-gray-500/30 rounded text-xs text-gray-400 font-mono tracking-wider cursor-not-allowed">
                    <ShieldAlert className="w-3 h-3" />
                    LOCKED
                  </div>
                )}
              </div>
              
              {!available && (
                <div className="text-[9px] text-gray-500 text-right mt-1 font-mono">{reason}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
