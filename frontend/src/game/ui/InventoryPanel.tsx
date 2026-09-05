import { useGameState } from '../context/GameStateContext';
import { GAME_ITEMS } from '../data/itemData';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Battery, Box, Compass, Droplet, Eye, FlaskConical, Hexagon, MapPin, Orbit, Radio, Sparkles } from 'lucide-react';
import { useState, memo } from 'react';

const ICON_MAP: Record<string, any> = {
  Battery, Box, Compass, Droplet, Eye, FlaskConical, Hexagon, MapPin, Orbit, Radio, Sparkles
};

export const InventoryPanel = memo(function InventoryPanel() {
  const { inventory, isInventoryOpen, setInventoryOpen, useItem, dropItem, setHotbarSlot } = useGameState();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  if (!isInventoryOpen) return null;

  const selectedInvItem = selectedItemId ? inventory.items.find(i => i.itemId === selectedItemId) : null;
  const selectedDef = selectedItemId ? GAME_ITEMS[selectedItemId] : null;

  const handleUse = () => {
    if (selectedItemId) {
      useItem(selectedItemId);
      // Auto-deselect if empty
      const current = inventory.items.find(i => i.itemId === selectedItemId);
      if (current && current.quantity <= 1) setSelectedItemId(null);
    }
  };

  const handleDrop = () => {
    if (selectedItemId) {
      dropItem(selectedItemId, 1);
      const current = inventory.items.find(i => i.itemId === selectedItemId);
      if (current && current.quantity <= 1) setSelectedItemId(null);
    }
  };

  const handleAssignHotbar = (slotIndex: number) => {
    if (selectedItemId) {
      setHotbarSlot(slotIndex, selectedItemId);
    }
  };

  // Generate slots
  const slots = [];
  for (let i = 0; i < inventory.capacity; i++) {
    slots.push(inventory.items[i] || null);
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md pointer-events-auto"
      >
        <div className="w-full max-w-5xl h-[80vh] bg-game-dark/90 border border-game-border rounded-2xl flex overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          
          {/* Main Grid Area */}
          <div className="flex-1 p-8 border-r border-game-border flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-display font-black text-white uppercase tracking-widest text-glow">
                  INVENTORY
                </h1>
                <p className="text-gray-500 font-mono text-sm tracking-widest uppercase">
                  Capacity: {inventory.items.length} / {inventory.capacity}
                </p>
              </div>
              <button onClick={() => setInventoryOpen(false)} className="text-gray-500 hover:text-white p-2 transition-colors">
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="grid grid-cols-6 gap-4 overflow-y-auto pr-4 pb-4 custom-scrollbar">
              {slots.map((slot, index) => {
                if (!slot) {
                  return (
                    <div key={`empty_${index}`} className="aspect-square rounded-lg border border-white/5 bg-black/40" />
                  );
                }
                const def = GAME_ITEMS[slot.itemId];
                if (!def) return null;
                const Icon = ICON_MAP[def.icon] || Box;
                
                const isSelected = selectedItemId === slot.itemId;

                return (
                  <button
                    key={`slot_${index}_${slot.itemId}`}
                    onClick={() => setSelectedItemId(slot.itemId)}
                    className={`aspect-square rounded-lg border flex flex-col items-center justify-center relative transition-all group
                      ${isSelected ? 'border-game-neon bg-game-neon/10' : 'border-white/10 bg-black/60 hover:border-white/30 hover:bg-white/5'}
                    `}
                  >
                    <Icon className={`w-8 h-8 mb-2 ${
                      def.rarity === 'MYTHIC' ? 'text-game-pink' :
                      def.rarity === 'EPIC' ? 'text-game-purple' :
                      def.rarity === 'RARE' ? 'text-game-neon' :
                      def.rarity === 'UNCOMMON' ? 'text-green-400' : 'text-gray-400'
                    }`} />
                    
                    {slot.quantity > 1 && (
                      <div className="absolute bottom-1 right-2 text-xs font-mono font-bold text-white">
                        x{slot.quantity}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details Sidebar */}
          <div className="w-80 bg-black/60 p-8 flex flex-col">
            {selectedDef && selectedInvItem ? (
              <>
                <div className="mb-6 flex justify-center">
                  <div className={`w-24 h-24 rounded-2xl border-2 flex items-center justify-center bg-black/50 ${
                      selectedDef.rarity === 'MYTHIC' ? 'border-game-pink text-game-pink shadow-[0_0_20px_rgba(255,0,255,0.2)]' :
                      selectedDef.rarity === 'EPIC' ? 'border-game-purple text-game-purple shadow-[0_0_20px_rgba(138,43,226,0.2)]' :
                      selectedDef.rarity === 'RARE' ? 'border-game-neon text-game-neon shadow-[0_0_20px_rgba(0,243,255,0.2)]' :
                      selectedDef.rarity === 'UNCOMMON' ? 'border-green-400 text-green-400 shadow-[0_0_20px_rgba(74,222,128,0.2)]' : 'border-gray-500 text-gray-400'
                  }`}>
                    {(() => {
                      const LargeIcon = ICON_MAP[selectedDef.icon] || Box;
                      return <LargeIcon className="w-12 h-12" />;
                    })()}
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h2 className="text-xl font-bold tracking-wider text-white mb-2">{selectedDef.name}</h2>
                  <div className={`text-xs font-mono tracking-widest uppercase mb-4 ${
                    selectedDef.rarity === 'MYTHIC' ? 'text-game-pink' :
                    selectedDef.rarity === 'EPIC' ? 'text-game-purple' :
                    selectedDef.rarity === 'RARE' ? 'text-game-neon' :
                    selectedDef.rarity === 'UNCOMMON' ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {selectedDef.rarity} {selectedDef.type}
                  </div>
                  <p className="text-sm text-gray-400 italic">"{selectedDef.description}"</p>
                </div>

                <div className="mt-auto space-y-3">
                  <div className="text-xs font-mono tracking-widest text-gray-500 uppercase mb-4">
                    Owned: <span className="text-white">{selectedInvItem.quantity}</span>
                  </div>

                  {(selectedDef.type === 'CONSUMABLE' || selectedDef.type === 'TOOL') && (
                    <button
                      onClick={handleUse}
                      className="w-full py-3 bg-white/10 hover:bg-game-neon hover:text-black border border-white/20 hover:border-game-neon transition-all font-mono text-sm tracking-widest uppercase rounded font-bold"
                    >
                      USE ITEM
                    </button>
                  )}

                  {selectedDef.type === 'CONSUMABLE' && (
                    <div className="grid grid-cols-5 gap-2 pt-2 border-t border-white/10">
                      {[0, 1, 2, 3, 4].map(idx => (
                        <button
                          key={idx}
                          onClick={() => handleAssignHotbar(idx)}
                          className="py-2 bg-black/40 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-400 transition-colors rounded"
                          title={`Assign to Hotbar ${idx + 1}`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedDef.type !== 'KEY' && (
                    <button
                      onClick={handleDrop}
                      className="w-full py-3 bg-red-950/30 hover:bg-red-900/50 text-red-500 border border-red-900/50 transition-all font-mono text-sm tracking-widest uppercase rounded"
                    >
                      DROP
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-600 font-mono text-sm uppercase tracking-widest text-center">
                Select an item<br/>to view details
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});
