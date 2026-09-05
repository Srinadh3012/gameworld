import React from 'react';
import { multiplayerManager } from '../../multiplayer/MultiplayerManager';

const EMOTES = [
  { id: 'WAVE', label: 'Wave' },
  { id: 'POINT', label: 'Point' },
  { id: 'SIT', label: 'Sit' },
  { id: 'CELEBRATE', label: 'Celebrate' }
];

export function EmoteWheel({ onClose }: { onClose: () => void }) {
  const handleEmote = (emoteId: string) => {
    multiplayerManager.emitEmote(emoteId);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-64 h-64" onClick={e => e.stopPropagation()}>
        {EMOTES.map((emote, idx) => {
          const angle = (idx * (360 / EMOTES.length)) * (Math.PI / 180);
          const x = Math.cos(angle) * 100;
          const y = Math.sin(angle) * 100;
          
          return (
            <button
              key={emote.id}
              onClick={() => handleEmote(emote.id)}
              className="absolute w-20 h-20 -ml-10 -mt-10 rounded-full bg-cyan-900/50 border border-cyan-500 hover:bg-cyan-500 hover:text-black text-cyan-100 flex items-center justify-center text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,255,255,0.2)]"
              style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
            >
              {emote.label}
            </button>
          );
        })}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-cyan-500/50 text-xs tracking-widest font-mono">EMOTES</div>
        </div>
      </div>
    </div>
  );
}
