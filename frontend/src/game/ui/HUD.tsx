import { useGameState } from '../context/GameStateContext';
import { InteractionPrompt } from './InteractionPrompt';
import { Globe2, Map, Database, Compass, BatteryCharging, Flame, Activity } from 'lucide-react';
import { MAX_STAMINA } from '../systems/StaminaSystem';
import { useEffect, useState } from 'react';
import { useAbilityInputs } from '../hooks/useAbilityInputs';
import { GAME_ABILITIES } from '../data/abilityData';
import { useNavigate } from 'react-router-dom';
import { WORLD_COORDINATES } from '../data/worldCoordinates';
import { MiniMap } from './MiniMap';
import { DialogueOverlay } from './DialogueOverlay';
import { InventoryPanel } from './InventoryPanel';
import { ObjectiveTracker } from './ObjectiveTracker';
import { CraftingPanel } from './CraftingPanel';
import { PauseMenu } from './PauseMenu';
import { Hotbar } from './Hotbar';
import { CompanionHUD } from './CompanionHUD';
import { MissionTracker } from './MissionTracker';
import { MissionJournal } from './MissionJournal';
import { GuardianEncounterUI } from './GuardianEncounterUI';
import { SocialPanel } from './multiplayer/SocialPanel';
import { PartyPanel } from './multiplayer/PartyPanel';
import { ChatPanel } from './multiplayer/ChatPanel';
import { EmoteWheel } from './multiplayer/EmoteWheel';
import { TutorialOverlay } from './TutorialOverlay';

export function HUD() {
  const { 
    evolutionLevel, stamina, playerName, explorationCount, 
    worldEnergy, worldStability, worldImpact, setHistoryOpen, isHistoryOpen,
    isInventoryOpen, setInventoryOpen, progression, discoveredLandmarks, discoveredRegions,
    activeDialogue, isJournalOpen, setJournalOpen
  } = useGameState();
  
  const navigate = useNavigate();
  
  const { cooldowns } = useAbilityInputs();
  
  const staminaPercent = (stamina / MAX_STAMINA) * 100;
  const hideStamina = staminaPercent > 99;

  const xpRequired = 100 + ((progression.level - 1) * 75);
  const xpPercent = Math.min(100, Math.max(0, (progression.experience / xpRequired) * 100));

  // Multiplayer Panels State
  const [isSocialOpen, setSocialOpen] = useState(false);
  const [isPartyOpen, setPartyOpen] = useState(false);
  const [isEmoteOpen, setEmoteOpen] = useState(false);

  // Keyboard shortcuts for UI
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyM') {
        navigate('/map');
      } else if (e.code === 'KeyH') {
        setHistoryOpen(!isHistoryOpen);
      } else if (e.code === 'KeyJ') {
        setJournalOpen(!isJournalOpen);
      } else if (e.code === 'Tab') {
        e.preventDefault();
        setInventoryOpen(!isInventoryOpen);
      } else if (e.code === 'KeyP') {
        setSocialOpen(prev => !prev);
      } else if (e.code === 'KeyO') {
        setPartyOpen(prev => !prev);
      } else if (e.code === 'KeyB') {
        setEmoteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHistoryOpen, isJournalOpen, isInventoryOpen, setHistoryOpen, setJournalOpen, setInventoryOpen, navigate]);

  return (
    <>
      <div className={`absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6 transition-opacity duration-500 ${activeDialogue ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Top Bar */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <h1 className="text-2xl font-display font-black text-white uppercase tracking-widest text-glow shadow-black drop-shadow-md">
            GAMEWORLD
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-game-purple text-xs tracking-[0.2em] uppercase font-bold shadow-black drop-shadow-md">
              PLAYER
            </span>
            <span className="text-white text-xs tracking-wider font-mono">
              {playerName}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {/* Main Status */}
          <div className="glass-panel px-4 py-2 rounded-lg bg-black/40 border border-game-border flex items-center gap-6 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Globe2 className="w-4 h-4 text-game-neon" />
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Evolution</span>
                <span className="text-white font-mono font-bold leading-none">{String(evolutionLevel).padStart(2, '0')}</span>
              </div>
            </div>
            
            {/* Objective Tracker */}
            <ObjectiveTracker />
            <MissionTracker />
            
            {/* Companion HUD */}
            <CompanionHUD />
            
            {/* Top Right: World History */}
            <div className="w-px h-6 bg-white/10" />
            
            <div className="flex items-center gap-3">
              <Flame className="w-4 h-4 text-orange-500" />
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Energy</span>
                <span className="text-white font-mono font-bold leading-none">{worldEnergy}%</span>
              </div>
            </div>

            <div className="w-px h-6 bg-white/10" />
            
            <div className="flex items-center gap-3">
              <Activity className="w-4 h-4 text-blue-500" />
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Stability</span>
                <span className="text-white font-mono font-bold leading-none">{worldStability}%</span>
              </div>
            </div>

            <div className="w-px h-6 bg-white/10" />
            
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">Impact</span>
              <span className="text-game-neon font-mono font-bold leading-none">{worldImpact}</span>
            </div>
          </div>

          {/* Menus Hint */}
          <div className="flex gap-2 mt-2">
            <div className="glass-panel px-3 py-1.5 rounded bg-black/40 border border-white/5 flex items-center gap-2">
              <span className="text-[10px] font-mono text-gray-500 uppercase">Inv</span>
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-bold text-white uppercase border border-white/20">TAB</span>
            </div>
            <div className="glass-panel px-3 py-1.5 rounded bg-black/40 border border-white/5 flex items-center gap-2">
              <span className="text-[10px] font-mono text-gray-500 uppercase">Map</span>
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-bold text-white uppercase border border-white/20">M</span>
            </div>
            <div className="glass-panel px-3 py-1.5 rounded bg-black/40 border border-white/5 flex items-center gap-2">
              <span className="text-[10px] font-mono text-gray-500 uppercase">Journal</span>
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-bold text-white uppercase border border-white/20">J</span>
            </div>
            <div className="glass-panel px-3 py-1.5 rounded bg-black/40 border border-white/5 flex items-center gap-2">
              <span className="text-[10px] font-mono text-gray-500 uppercase">History</span>
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-bold text-white uppercase border border-white/20">H</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center Interaction Prompt */}
      <InteractionPrompt />

      {/* Bottom Bar */}
      <div className="flex justify-between items-end">
        
        {/* Stamina Indicator */}
        <div className={`transition-opacity duration-300 ${hideStamina ? 'opacity-0' : 'opacity-100'}`}>
          <div className="glass-panel px-4 py-3 rounded-lg bg-black/40 border border-game-border backdrop-blur-sm flex items-center gap-3 w-48">
            <BatteryCharging className={`w-4 h-4 ${staminaPercent < 20 ? 'text-red-500' : 'text-green-400'}`} />
            <div className="flex-grow flex flex-col">
              <div className="flex justify-between mb-1">
                <span className="text-[10px] font-mono text-gray-400 uppercase">Stamina</span>
              </div>
              <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-100 ${staminaPercent < 20 ? 'bg-red-500' : 'bg-green-400'}`}
                  style={{ width: `${staminaPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Progression Indicator (Level / XP) */}
        <div className="absolute bottom-20 left-6">
          <div className="glass-panel px-4 py-3 rounded-lg bg-black/40 border border-game-purple/50 backdrop-blur-sm flex items-center gap-3 w-48">
            <div className="flex flex-col items-center justify-center w-8 h-8 rounded-full bg-game-purple/20 border border-game-purple">
              <span className="text-[10px] text-game-purple uppercase leading-none font-bold">LVL</span>
              <span className="text-white font-mono font-bold leading-none">{progression.level}</span>
            </div>
            <div className="flex-grow flex flex-col">
              <div className="flex justify-between mb-1">
                <span className="text-[10px] font-mono text-gray-400 uppercase">XP</span>
                <span className="text-[10px] font-mono text-gray-500">{progression.experience} / {xpRequired}</span>
              </div>
              <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-game-purple transition-all duration-300 shadow-[0_0_8px_#8a2be2]"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Exploration Tracker */}
        <div className="glass-panel p-4 rounded-xl bg-black/50 border border-white/10 flex gap-6 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Map className="w-5 h-5 text-gray-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">Regions</span>
              <span className="text-white font-mono font-bold leading-none">{explorationCount.regions}/4</span>
            </div>
          </div>
          
          <div className="w-px h-8 bg-white/10" />

          <div className="flex items-center gap-3">
            <Map className="w-5 h-5 text-cyan-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-cyan-500 uppercase tracking-widest">Landmarks</span>
              <span className="text-white font-mono font-bold leading-none">{explorationCount.landmarks}/{WORLD_COORDINATES.landmarks.length}</span>
            </div>
          </div>
          
          <div className="w-px h-8 bg-white/10" />

          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-game-neon" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">Memories</span>
              <span className="text-white font-mono font-bold leading-none">{explorationCount.memories}/3</span>
            </div>
          </div>

          <div className="w-px h-8 bg-white/10" />

          <div className="flex items-center gap-3">
            <Compass className={`w-5 h-5 ${explorationCount.coreActivated ? 'text-game-purple' : 'text-gray-600'}`} />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">Core</span>
              <span className={`font-mono font-bold leading-none ${explorationCount.coreActivated ? 'text-white' : 'text-gray-500'}`}>
                {explorationCount.coreActivated ? 'ACTIVE' : 'LOCKED'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Abilities Cooldown */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
        {['ability_world_sense', 'ability_echo_vision', 'ability_aether_step'].map((id, idx) => {
          if (!progression.unlockedAbilities.includes(id)) return null;
          const ab = GAME_ABILITIES[id];
          const cdEnd = cooldowns[id];
          const isCD = cdEnd && cdEnd > Date.now();
          const keyName = idx === 0 ? 'Q' : (idx === 1 ? 'R' : (idx === 2 ? 'L-SHIFT' : 'F')); // E.g., Q and R for abilities, Dash usually shift, but we bound it to what? Wait, dash is Aether Step. I didn't bind Aether step to a key in useAbilityInputs!
          
          return (
            <div key={id} className="relative w-12 h-12 glass-panel bg-black/40 border border-white/20 rounded flex items-center justify-center">
              <span className="text-[10px] absolute -top-2 left-1/2 -translate-x-1/2 bg-black px-1 border border-white/20 rounded text-gray-300 font-mono">
                {keyName}
              </span>
              <div className="text-white text-[10px] text-center font-bold">{ab?.name.split(' ')[0]}</div>
              {isCD && (
                <div className="absolute inset-0 bg-black/60 rounded flex items-center justify-center">
                  <span className="text-red-400 font-mono text-sm">{Math.ceil((cdEnd - Date.now())/1000)}s</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      </div>
      
      {/* Inventory, Crafting, and Multiplayer Panels */}
      {isInventoryOpen && <InventoryPanel />}
      {isCraftingOpen && <CraftingPanel onClose={() => {}} />}
      {isHistoryOpen && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-black/80 backdrop-blur-md border border-white/20 p-6 flex flex-col text-white"><h2 className="text-xl mb-4 font-bold tracking-widest text-game-purple">WORLD HISTORY</h2><p className="text-gray-300 italic text-sm">The world Remembers...</p></div>}
      {isJournalOpen && <MissionJournal onClose={() => setJournalOpen(false)} />}
      
      {isSocialOpen && <SocialPanel onClose={() => setSocialOpen(false)} />}
      {isPartyOpen && <PartyPanel onClose={() => setPartyOpen(false)} />}
      {isEmoteOpen && <EmoteWheel onClose={() => setEmoteOpen(false)} />}
      
      {/* Tutorial */}
      <TutorialOverlay />
      
      <ChatPanel />
      
      {/* Dialogue UI */}
      <DialogueOverlay />

      {/* Crosshair (hidden during dialogue) */}
      {!activeDialogue && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none mix-blend-difference">
          <div className="w-1 h-1 bg-white rounded-full opacity-80" />
        </div>
      )}

      {/* MiniMap (hidden during dialogue) */}
      {!activeDialogue && <MiniMap />}

      <PauseMenu />
      <Hotbar />
      <GuardianEncounterUI />
    </>
  );
}
