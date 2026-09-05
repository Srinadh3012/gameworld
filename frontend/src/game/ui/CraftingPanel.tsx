import { useGameState } from '../context/GameStateContext';
import { GAME_RECIPES } from '../data/recipeData';
import { GAME_ITEMS } from '../data/itemData';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Hammer, Box } from 'lucide-react';
import { useState } from 'react';

interface CraftingPanelProps {
  onClose: () => void;
}

export function CraftingPanel({ onClose }: CraftingPanelProps) {
  const { inventory, craftItem } = useGameState();
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(GAME_RECIPES[0]?.id || null);
  const [isCrafting, setIsCrafting] = useState(false);

  const selectedRecipe = GAME_RECIPES.find(r => r.id === selectedRecipeId);
  const outputDef = selectedRecipe ? GAME_ITEMS[selectedRecipe.outputItem] : null;

  // Check if player has ingredients
  let canCraft = false;
  if (selectedRecipe) {
    canCraft = true;
    for (const req of selectedRecipe.requiredItems) {
      const invItem = inventory.items.find(i => i.itemId === req.itemId);
      if (!invItem || invItem.quantity < req.quantity) {
        canCraft = false;
        break;
      }
    }
  }

  const handleCraft = async () => {
    if (selectedRecipeId && canCraft) {
      setIsCrafting(true);
      await craftItem(selectedRecipeId);
      setTimeout(() => setIsCrafting(false), 500); // Small cooldown
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md pointer-events-auto"
      >
        <div className="w-full max-w-4xl h-[70vh] bg-game-dark/90 border border-game-border rounded-2xl flex overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          
          {/* Recipe List */}
          <div className="w-1/3 border-r border-game-border bg-black/40 flex flex-col">
            <div className="p-6 border-b border-game-border flex justify-between items-center bg-black/60">
              <div className="flex items-center gap-3">
                <Hammer className="w-5 h-5 text-game-neon" />
                <h2 className="text-xl font-display font-black text-white uppercase tracking-widest text-glow">
                  WORLD FORGE
                </h2>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              {GAME_RECIPES.map(recipe => {
                const isSelected = recipe.id === selectedRecipeId;
                const outItem = GAME_ITEMS[recipe.outputItem];
                return (
                  <button
                    key={recipe.id}
                    onClick={() => setSelectedRecipeId(recipe.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      isSelected 
                        ? 'bg-game-neon/10 border-game-neon' 
                        : 'bg-black/40 border-white/10 hover:border-white/30 hover:bg-white/5'
                    }`}
                  >
                    <div className="font-bold tracking-wider text-white truncate">{outItem?.name || recipe.name}</div>
                    <div className="text-xs font-mono text-gray-500 mt-1 uppercase">
                      {outItem?.rarity || 'UNKNOWN'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recipe Details */}
          <div className="flex-1 p-8 flex flex-col relative">
            <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
              <X className="w-8 h-8" />
            </button>

            {selectedRecipe && outputDef ? (
              <>
                <div className="mb-8 flex items-center gap-6">
                  <div className={`w-20 h-20 rounded-xl border-2 flex items-center justify-center bg-black/50 ${
                      outputDef.rarity === 'MYTHIC' ? 'border-game-pink text-game-pink' :
                      outputDef.rarity === 'EPIC' ? 'border-game-purple text-game-purple' :
                      outputDef.rarity === 'RARE' ? 'border-game-neon text-game-neon' :
                      outputDef.rarity === 'UNCOMMON' ? 'border-green-400 text-green-400' : 'border-gray-500 text-gray-400'
                  }`}>
                    <Box className="w-10 h-10" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold tracking-wider text-white mb-2">{outputDef.name}</h1>
                    <div className="text-sm text-gray-400 italic">"{selectedRecipe.description}"</div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xs font-mono tracking-widest text-gray-500 uppercase mb-4">Required Materials</h3>
                  <div className="space-y-3">
                    {selectedRecipe.requiredItems.map(req => {
                      const reqDef = GAME_ITEMS[req.itemId];
                      const invItem = inventory.items.find(i => i.itemId === req.itemId);
                      const hasAmt = invItem ? invItem.quantity : 0;
                      const hasEnough = hasAmt >= req.quantity;

                      return (
                        <div key={req.itemId} className="flex justify-between items-center bg-black/40 p-3 rounded border border-white/5">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-white">{reqDef?.name || req.itemId}</span>
                          </div>
                          <div className="text-sm font-mono tracking-widest">
                            <span className={hasEnough ? 'text-white' : 'text-red-500'}>{hasAmt}</span>
                            <span className="text-gray-500"> / {req.quantity}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-white/10">
                  <button
                    onClick={handleCraft}
                    disabled={!canCraft || isCrafting}
                    className={`w-full py-4 font-mono font-bold tracking-widest uppercase transition-all rounded ${
                      canCraft 
                        ? 'bg-game-neon text-black hover:bg-game-neon/90 shadow-[0_0_20px_rgba(0,243,255,0.3)]' 
                        : 'bg-white/5 text-gray-600 border border-white/10 cursor-not-allowed'
                    }`}
                  >
                    {isCrafting ? 'SYNTHESIZING...' : canCraft ? 'CRAFT ITEM' : 'INSUFFICIENT RESOURCES'}
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
