import React from 'react';
import { useGameState } from "../context/GameStateContext";
import { NPC_DATA } from "../data/npcData";

export function CompanionHUD() {
  const { activeCompanion, npcRelationships, activeDialogue } = useGameState();

  if (!activeCompanion || activeDialogue) return null;

  const npc = NPC_DATA[activeCompanion];
  if (!npc) return null;

  const trustLevel = npcRelationships[activeCompanion] || 0;
  
  // Calculate trust rank
  let rank = 'NEUTRAL';
  if (trustLevel >= 100) rank = 'ALLY';
  else if (trustLevel >= 50) rank = 'TRUSTED';
  else if (trustLevel >= 20) rank = 'FAMILIAR';

  return (
    <div className="absolute top-20 right-6 w-64 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-3 pointer-events-none transition-opacity duration-300">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-mono text-white text-sm tracking-widest">{npc.name}</h3>
          <p className="text-[10px] text-gray-400 font-sans tracking-wide uppercase">{npc.role}</p>
        </div>
        <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center overflow-hidden bg-black/60 shadow-[0_0_10px_rgba(255,255,255,0.1)]">
          <div className="text-[10px] text-white font-mono opacity-80">{npc.name[0]}</div>
        </div>
      </div>
      
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-cyan-400/80 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (trustLevel / 100) * 100)}%` }} />
        </div>
        <span className="text-[9px] text-cyan-400 font-mono tracking-widest">{rank}</span>
      </div>
      
      <div className="mt-2 text-[10px] text-gray-500 font-mono flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        ACTIVE
      </div>
    </div>
  );
}
