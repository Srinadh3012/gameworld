import React, { useState } from 'react';

export function PartyPanel({ onClose }: { onClose: () => void }) {
  const [partyMembers, setPartyMembers] = useState<any[]>([]); // Placeholder for party logic

  return (
    <div className="absolute top-1/2 left-[30%] -translate-x-1/2 -translate-y-1/2 w-80 max-h-[60vh] bg-black/90 backdrop-blur-md border border-purple-500/30 rounded shadow-2xl flex flex-col z-[100] text-purple-100 font-mono">
      <div className="p-4 border-b border-purple-500/20 flex justify-between items-center">
        <h2 className="text-lg tracking-widest text-purple-300">EXPLORATION PARTY</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
      </div>
      
      <div className="p-4 flex-1">
        {partyMembers.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-purple-500/50 mb-4">You are exploring alone.</div>
            <button className="px-4 py-2 bg-purple-900/30 border border-purple-500/50 hover:bg-purple-800/50 text-sm transition-colors">
              CREATE PARTY
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {partyMembers.map((m, i) => (
              <div key={i} className="p-2 border border-purple-900/50 bg-purple-900/20 rounded flex justify-between">
                <span>{m.username}</span>
                <span className="text-purple-400 text-xs">Lv.{m.level}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
