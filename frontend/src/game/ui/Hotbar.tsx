import { useGameState } from '../context/GameStateContext';
import { GAME_ITEMS } from '../data/itemData';
import { useEffect } from 'react';
import { Box, Battery, Compass, Droplet, Eye, FlaskConical, Hexagon, MapPin, Orbit, Radio, Sparkles } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Battery, Box, Compass, Droplet, Eye, FlaskConical, Hexagon, MapPin, Orbit, Radio, Sparkles
};

export function Hotbar() {
  const { hotbar, useItem, isPaused, inspectionTarget } = useGameState();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused || inspectionTarget) return;
      const num = parseInt(e.key);
      if (num >= 1 && num <= 5) {
        const slotIndex = num - 1;
        const itemId = hotbar[slotIndex];
        if (itemId) {
          useItem(itemId);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hotbar, useItem, isPaused, inspectionTarget]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-end gap-2 z-10 pointer-events-none">
      {hotbar.map((itemId, idx) => {
        const def = itemId ? GAME_ITEMS[itemId] : null;
        
        return (
          <div 
            key={idx} 
            className={`w-14 h-14 rounded bg-black/60 backdrop-blur-sm border flex flex-col items-center justify-center relative
              ${def ? 'border-white/30 shadow-[0_0_10px_rgba(255,255,255,0.05)]' : 'border-white/10'}
            `}
          >
            <div className="absolute top-1 left-1 text-[9px] font-mono text-gray-500 font-bold">
              {idx + 1}
            </div>
            
            {def && (
              <div className={`${
                def.rarity === 'MYTHIC' ? 'text-game-pink' :
                def.rarity === 'EPIC' ? 'text-game-purple' :
                def.rarity === 'RARE' ? 'text-game-neon' :
                def.rarity === 'UNCOMMON' ? 'text-green-400' : 'text-gray-400'
              }`}>
                {(() => {
                  const Icon = ICON_MAP[def.icon] || Box;
                  return <Icon className="w-6 h-6" />;
                })()}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
