import { useState, useEffect } from 'react';
import { GameStateProvider } from '../game/context/GameStateContext';
import { GameWorld } from '../game/components/GameWorld';
import { NotificationStack } from '../game/ui/NotificationStack';
import { RegionBanner } from '../game/ui/RegionBanner';
import { InspectionModal } from '../game/ui/InspectionModal';
import { WorldMap } from '../game/ui/WorldMap';
import { WorldHistory } from '../game/ui/WorldHistory';
import { HUD } from '../game/ui/HUD';
import { ObjectiveTracker } from '../game/ui/ObjectiveTracker';
import { InventoryPanel } from '../game/ui/InventoryPanel';
import { CraftingPanel } from '../game/ui/CraftingPanel';
import { Hotbar } from '../game/ui/Hotbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../game/context/GameStateContext';
import { PauseMenu } from '../game/ui/PauseMenu';

// Click-to-play overlay (HTML layer, not 3D)
function ClickToPlayOverlay() {
  const { isPaused, inspectionTarget, isMapOpen, isHistoryOpen, isInventoryOpen, isCraftingOpen } = useGameState();

  // Hide the standard click-to-play prompt if we're in an inspection modal or map/history/inventory/crafting
  if (!isPaused || inspectionTarget || isMapOpen || isHistoryOpen || isInventoryOpen || isCraftingOpen) return null;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="text-center pointer-events-auto"
        onClick={() => document.querySelector('canvas')?.requestPointerLock()}
      >
        <div className="w-16 h-16 rounded-full border-2 border-white/30 flex items-center justify-center mx-auto mb-4 cursor-pointer hover:border-game-neon hover:bg-game-neon/10 transition-all">
          <div className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[16px] border-l-white ml-1" />
        </div>
        <p className="text-white/60 text-sm font-mono uppercase tracking-widest">
          Click to Enter World
        </p>
        <p className="text-white/30 text-xs font-mono mt-1">
          ESC to pause
        </p>
      </motion.div>
    </div>
  );
}

function GameContent() {
  const { isCraftingOpen, setCraftingOpen } = useGameState();

  return (
    <>
      <GameWorld />
      <HUD />
      <ObjectiveTracker />
      <PauseMenu />
      <RegionBanner />
      <NotificationStack />
      <InspectionModal />
      <WorldMap />
      <WorldHistory />
      <InventoryPanel />
      {isCraftingOpen && <CraftingPanel onClose={() => setCraftingOpen(false)} />}
      <Hotbar />
      <ClickToPlayOverlay />
    </>
  );
}


export function Play() {
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('INITIALIZING WORLD...');
  const [error] = useState<string | null>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setLoadingText('SYNCHRONIZING MEMORIES...'), 800);
    const t2 = setTimeout(() => setLoadingText('WORLD SYNCHRONIZED'), 1500);
    const t3 = setTimeout(() => setLoading(false), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // Small-screen warning
  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 768;

  if (isSmallScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-game-dark p-8 text-center">
        <div>
          <div className="text-game-purple text-4xl mb-4">⚡</div>
          <h2 className="text-white font-display font-bold text-xl mb-3">GAMEWORLD</h2>
          <p className="text-gray-400 text-sm">
            GAMEWORLD currently requires a larger screen for the best experience.
          </p>
          <button
            onClick={() => window.location.href = '/arena'}
            className="mt-6 px-6 py-3 border border-game-purple text-game-purple rounded-lg hover:bg-game-purple/20 transition-colors text-sm"
          >
            Return to Arena
          </button>
        </div>
      </div>
    );
  }

  return (
    <GameStateProvider>
      <div className="fixed inset-0 w-full h-full bg-black overflow-hidden select-none">
        {/* Loading Screen */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-game-dark"
            >
              <div className="w-16 h-16 border-4 border-game-purple/20 border-t-game-purple rounded-full animate-spin mb-8" />
              <div className="text-game-neon font-mono text-xs tracking-[0.4em] uppercase mb-2 opacity-80 shadow-[0_0_15px_rgba(0,243,255,0.4)]">
                GAMEWORLD
              </div>
              <div className="text-game-purple font-mono mb-6 animate-pulse tracking-wider text-sm">
                {loadingText}
              </div>
              <div className="w-64 h-0.5 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.0, ease: 'easeInOut' }}
                  className="h-full bg-gradient-to-r from-game-purple to-game-neon shadow-[0_0_10px_rgba(0,243,255,0.6)]"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Screen */}
        {error && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-game-dark/90 backdrop-blur-sm">
            <h2 className="text-red-500 font-display font-bold text-2xl mb-4">
              GAMEWORLD could not initialize the 3D world.
            </h2>
            <p className="text-gray-400 mb-8">{error}</p>
            <button
              onClick={() => window.location.href = '/arena'}
              className="px-6 py-3 border border-game-purple text-game-purple rounded-lg hover:bg-game-purple/20 transition-colors"
            >
              Return to Arena
            </button>
          </div>
        )}

        {/* Game */}
        {!loading && !error && <GameContent />}
      </div>
    </GameStateProvider>
  );
}

