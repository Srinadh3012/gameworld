import React, { useEffect, useState, memo } from 'react';
import { multiplayerManager, RemotePlayer } from '../../multiplayer/MultiplayerManager';

export const SocialPanel = memo(function SocialPanel({ onClose }: { onClose: () => void }) {
  const [players, setPlayers] = useState<RemotePlayer[]>([]);

  useEffect(() => {
    setPlayers(multiplayerManager.getRemotePlayers());
    const cb = (newPlayers: RemotePlayer[]) => setPlayers([...newPlayers]);
    multiplayerManager.setOnPlayersUpdated(cb);
    return () => multiplayerManager.setOnPlayersUpdated(() => {});
  }, []);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 max-h-[70vh] bg-black/80 backdrop-blur-md border border-cyan-500/30 rounded shadow-2xl flex flex-col z-[100] text-cyan-100 font-mono">
      <div className="p-4 border-b border-cyan-500/20 flex justify-between items-center">
        <h2 className="text-lg tracking-widest text-cyan-300">ONLINE EXPLORERS</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
      </div>
      
      <div className="overflow-y-auto p-4 space-y-2 flex-1">
        {players.length === 0 ? (
          <div className="text-gray-500 text-sm italic text-center py-4">No other explorers nearby.</div>
        ) : (
          players.map(p => (
            <div key={p.uid} className="flex flex-col p-2 bg-cyan-900/20 border border-cyan-800/50 rounded hover:bg-cyan-800/30 transition-colors">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-cyan-100">{p.username}</span>
                <span className="text-xs text-amber-400">Lv.{p.level}</span>
              </div>
              <div className="text-[10px] text-cyan-500/70">{p.title}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});
