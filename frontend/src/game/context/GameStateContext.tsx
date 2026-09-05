import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { RegionDefinition } from '../data/regionData';
import { 
  loadDiscoveredMemories, saveDiscoveredMemories, 
  loadDiscoveredRegions, saveDiscoveredRegions,
  loadDiscoveredLandmarks, saveDiscoveredLandmarks,
  loadFastTravelNodes, saveFastTravelNodes,
  loadWorldState, saveWorldState,
  loadWorldChoices, saveWorldChoices,
  saveHotbar, loadHotbar,
  saveNPCRelationships, loadNPCRelationships,
  saveActiveCompanion, loadActiveCompanion,
  loadAchievements
} from '../utils/storage';
import { explorationSystem } from '../systems/ExplorationSystem';
import type { NPCDefinition, DialogueNode } from '../data/npcData';
import { NPC_DATA } from '../data/npcData';
import { useAuth } from '../../context/AuthContext';
import { eventSystem } from '../systems/EventSystem';
import { inventorySystem } from '../systems/InventorySystem';
import type { LocalInventory } from '../utils/storage';
import { worldActionSystem } from '../systems/WorldActionSystem';
import { progressionSystem } from '../systems/ProgressionSystem';
import type { LocalProgression } from '../systems/ProgressionSystem';
import { storyManager } from '../story/StoryManager';
import { guardianManager } from '../guardians/GuardianManager';

export interface GameNotification {
  id: string;
  title: string;
  body: string;
}

export interface RegionBannerData {
  title: string;
  name: string;
  color: string;
}

export interface InspectionData {
  title: string;
  description: string;
  type?: string;
  status?: string;
}

export interface ActiveDialogue {
  npc: NPCDefinition;
  currentNode: DialogueNode;
}

interface GameState {
  memoryCount: number;
  evolutionLevel: number; // Derived from impact
  isPaused: boolean;
  activeInteraction: string | null;
  notifications: GameNotification[];
  stamina: number;
  playerName: string;
  currentRegion: RegionDefinition | null;
  discoveredRegions: string[];
  discoveredMemories: string[];
  discoveredLandmarks: string[];
  fastTravelNodes: string[];
  explorationCount: { regions: number; memories: number; landmarks: number; coreActivated: boolean };
  inspectionTarget: InspectionData | null;
  regionBanner: RegionBannerData | null;
  
  // Phase 9 States
  worldImpact: number;
  worldEnergy: number;
  worldStability: number;
  worldChoices: Record<string, string>;
  isMapOpen: boolean;
  isHistoryOpen: boolean;
  setHistoryOpen: (open: boolean) => void;
  isJournalOpen: boolean;
  setJournalOpen: (open: boolean) => void;

  // Phase 10 States
  activeEvents: string[];
  completedEvents: string[];
  discoveredEvents: string[]; // local tracking so we only show the discovery panel once
  trackedEventId: string | null;
  achievements: string[];

  // Phase 11 States
  inventory: LocalInventory;
  hotbar: (string | null)[];
  isInventoryOpen: boolean;
  isCraftingOpen: boolean;
  activeBuffs: {
    explorerModule: boolean;
    worldPulse: boolean;
    echoTonic: boolean;
  };
  droppedItems: { id: string, itemId: string, quantity: number, position: [number, number, number] }[];
  
  // NPC States
  activeDialogue: ActiveDialogue | null;
  npcRelationships: Record<string, number>;
  activeCompanion: string | null;

  discoverMemory: (id: string) => boolean;
  discoverLandmark: (id: string) => boolean;
  unlockFastTravel: (id: string) => void;
  setPaused: (paused: boolean) => void;
  setActiveInteraction: (interaction: string | null) => void;
  showNotification: (title: string, body: string) => void;
  dismissNotification: (id: string) => void;
  setStamina: (stamina: number) => void;
  setCurrentRegion: (region: RegionDefinition | null) => void;
  showInspection: (data: InspectionData) => void;
  dismissInspection: () => void;
  showRegionBanner: (data: RegionBannerData) => void;
  markCoreActivated: () => void;

  // Phase 9 Actions
  updateWorldState: (impactDelta: number, energyDelta: number, stabilityDelta: number) => void;
  recordChoice: (choiceId: string, choiceValue: string) => void;
  setMapOpen: (open: boolean) => void;

  // Phase 10 Actions
  discoverEvent: (eventId: string) => boolean;
  startEvent: (eventId: string) => Promise<boolean>;
  completeEvent: (eventId: string) => Promise<boolean>;
  failEvent: (eventId: string) => Promise<boolean>;
  setTrackedEvent: (eventId: string | null) => void;
  unlockAchievement: (achievementId: string) => void;

  // Phase 11 Actions
  setInventoryOpen: (open: boolean) => void;
  setCraftingOpen: (open: boolean) => void;
  collectItem: (itemId: string, quantity?: number) => Promise<boolean>;
  useItem: (itemId: string) => Promise<boolean>;
  dropItem: (itemId: string, quantity?: number) => Promise<boolean>;
  removeDroppedItem: (id: string) => void;
  craftItem: (recipeId: string) => Promise<boolean>;
  setHotbarSlot: (index: number, itemId: string | null) => void;

  // Phase 12 Actions
  progression: LocalProgression;
  awardXP: (amount: number, source: string, sourceId?: string) => Promise<void>;
  unlockAbility: (abilityId: string) => Promise<boolean>;

  // NPC Actions
  startDialogue: (npcId: string) => void;
  selectDialogueOption: (optionId: string) => void;
  endDialogue: () => void;
  setActiveCompanion: (npcId: string | null) => void;

  // Phase 18 States
  worldPhase: string;
  dominantResonance: string;
  environmentState: Record<string, string>;
  unlockedEndgamePaths: string[];
  worldTransformationLevel: number;
  majorDecisions: Record<string, any>;
  
  // Phase 18 Actions
  setWorldPhase: (phase: string) => void;
  applyEnvironmentState: (regionId: string, state: string) => void;
  recordMajorDecision: (decisionId: string, details: any) => void;
  evaluateEndgamePath: () => Promise<void>;

  // Phase 19 Additions
  multiplayerState: {
    connected: boolean;
    onlinePlayers: number;
    party: any | null;
    chatMessages: any[];
    offlineFallback: boolean;
  };
  setMultiplayerState: React.Dispatch<React.SetStateAction<any>>;
}

const GameStateContext = createContext<GameState | undefined>(undefined);

// Helper for evolution
function getEvolutionLevel(impact: number) {
  if (impact < 20) return 1;
  if (impact < 50) return 2;
  if (impact < 100) return 3;
  if (impact < 200) return 4;
  return 5;
}

export function GameStateProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  
  // Phase 7 Existing
  const [memoryCount, setMemoryCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeInteraction, setActiveInteraction] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<GameNotification[]>([]);
  const [discoveredMemories, setDiscoveredMemories] = useState<Set<string>>(new Set());

  // Phase 8 Additions
  const [stamina, setStamina] = useState(100);
  const playerName = currentUser?.displayName || 'Guest Explorer';
  const [currentRegion, setCurrentRegion] = useState<RegionDefinition | null>(null);
  const [discoveredRegions, setDiscoveredRegions] = useState<Set<string>>(new Set());
  const [discoveredLandmarks, setDiscoveredLandmarks] = useState<Set<string>>(new Set());
  const [fastTravelNodes, setFastTravelNodes] = useState<Set<string>>(new Set());
  const [coreActivated, setCoreActivated] = useState(false);
  const [inspectionTarget, setInspectionTarget] = useState<InspectionData | null>(null);
  const [regionBanner, setRegionBanner] = useState<RegionBannerData | null>(null);

  // Phase 9 Additions
  const [worldImpact, setWorldImpact] = useState(0);
  const [worldEnergy, setWorldEnergy] = useState(50);
  const [worldStability, setWorldStability] = useState(100);
  const [worldChoices, setWorldChoices] = useState<Record<string, string>>({});
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isJournalOpen, setJournalOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isCraftingOpen, setIsCraftingOpen] = useState(false);
  const evolutionLevel = getEvolutionLevel(worldImpact);

  // Phase 10 Additions
  const [activeEvents, setActiveEvents] = useState<string[]>([]);
  const [completedEvents, setCompletedEvents] = useState<string[]>([]);
  const [discoveredEvents, setDiscoveredEvents] = useState<Set<string>>(new Set());
  const [trackedEventId, setTrackedEventId] = useState<string | null>(null);
  const [achievements, setAchievements] = useState<Set<string>>(new Set());

  // Phase 11 Additions
  const [inventory, setInventory] = useState<LocalInventory>(inventorySystem.getInventory());
  const [hotbar, setHotbar] = useState<(string | null)[]>(inventorySystem.getHotbar());
  const [activeBuffs, setActiveBuffs] = useState({
    explorerModule: false,
    worldPulse: false,
    echoTonic: false,
  });
  const [droppedItems, setDroppedItems] = useState<{ id: string, itemId: string, quantity: number, position: [number, number, number] }[]>([]);

  // Phase 12 Additions
  const [progression, setProgression] = useState<LocalProgression>(progressionSystem['localFallback'] ? { 
    level: 1, experience: 0, totalExperience: 0, skillPoints: 0, explorationXP: 0, discoveryXP: 0, memoryXP: 0, eventXP: 0, craftingXP: 0, worldImpactXP: 0, unlockedAbilities: [], claimedRewards: [] 
  } : { level: 1, experience: 0, totalExperience: 0, skillPoints: 0, explorationXP: 0, discoveryXP: 0, memoryXP: 0, eventXP: 0, craftingXP: 0, worldImpactXP: 0, unlockedAbilities: [], claimedRewards: [] });

  // Phase 18 Additions
  const [worldPhase, setWorldPhase] = useState('Dormant');
  const [dominantResonance, setDominantResonance] = useState('Neutral');
  const [environmentState, setEnvironmentState] = useState<Record<string, string>>({});
  const [unlockedEndgamePaths, setUnlockedEndgamePaths] = useState<string[]>([]);
  const [worldTransformationLevel, setWorldTransformationLevel] = useState(0);
  const [majorDecisions, setMajorDecisions] = useState<Record<string, any>>({});

  // NPC States
  const [activeDialogue, setActiveDialogue] = useState<ActiveDialogue | null>(null);
  const [npcRelationships, setNpcRelationships] = useState<Record<string, number>>(loadNPCRelationships());
  const [activeCompanion, setActiveCompanionState] = useState<string | null>(loadActiveCompanion());

  // Phase 19 Additions
  const [multiplayerState, setMultiplayerState] = useState({
    connected: false,
    onlinePlayers: 0,
    party: null,
    chatMessages: [],
    offlineFallback: false
  });

  // Load from local storage on mount
  useEffect(() => {
    const mems = loadDiscoveredMemories();
    const regs = loadDiscoveredRegions();
    const ws = loadWorldState();
    const wc = loadWorldChoices();
    
    setDiscoveredMemories(new Set(mems));
    setMemoryCount(mems.length);
    setDiscoveredRegions(new Set(regs));
    setDiscoveredLandmarks(new Set(loadDiscoveredLandmarks()));
    setFastTravelNodes(new Set(loadFastTravelNodes()));
    setWorldImpact(ws.worldImpact);
    setWorldEnergy(ws.worldEnergy);
    setWorldStability(ws.worldStability);
    setWorldChoices(wc);
    setActiveEvents(eventSystem.getActiveEventsList());
    setCompletedEvents(eventSystem.getCompletedEventsList());
    setAchievements(new Set(loadAchievements()));

    const unsubInventory = inventorySystem.subscribe(() => {
      setInventory(inventorySystem.getInventory());
      setHotbar(inventorySystem.getHotbar());
      
      // Update persistent buffs
      setActiveBuffs(prev => ({
        ...prev,
        explorerModule: inventorySystem.getItemQuantity('tool_explorer_module') > 0
      }));
    });

    // Initial buff check
    setActiveBuffs(prev => ({
      ...prev,
      explorerModule: inventorySystem.getItemQuantity('tool_explorer_module') > 0
    }));

    // Init progression
    progressionSystem.init().then(prog => {
      setProgression(prog);
    });

    return () => unsubInventory();
  }, []);

  const showNotification = useCallback((title: string, body: string) => {
    const id = crypto.randomUUID();
    setNotifications(prev => [...prev, { id, title, body }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const unlockAchievement = useCallback((id: string) => {
    if (!achievements.has(id)) {
      eventSystem.unlockAchievement(id);
      setAchievements(prev => new Set(prev).add(id));
      showNotification('ACHIEVEMENT UNLOCKED', id.replace(/_/g, ' ').toUpperCase());
    }
  }, [achievements, showNotification]);

  const awardXP = useCallback(async (amount: number, source: string, sourceId?: string) => {
    const result = await progressionSystem.awardXP(amount, source, sourceId, progression);
    if (result) {
      setProgression(result.progression);
      showNotification(`+${amount} XP`, source.replace(/_/g, ' '));
      if (result.leveledUp) {
        showNotification('LEVEL UP', `You reached Level ${result.progression.level}!`);
        // We could also do a cinematic level up here later
        if (result.progression.level >= 5) unlockAchievement('PATHFINDER');
        if (result.progression.level >= 8) unlockAchievement('CORE_SEEKER');
        if (result.progression.level >= 10) unlockAchievement('LEGACY_BUILDER');
      }
    }
  }, [progression, showNotification, unlockAchievement]);

  const discoverMemory = useCallback((id: string) => {
    if (!discoveredMemories.has(id)) {
      const newSet = new Set(discoveredMemories).add(id);
      setDiscoveredMemories(newSet);
      setMemoryCount(newSet.size);
      saveDiscoveredMemories(Array.from(newSet));
      awardXP(250, 'MEMORY_DECODED', `memory_${id}`);
      storyManager.handleGameAction('DISCOVER_MEMORY', id);
      return true; // was new
    }
    return false; // already discovered
  }, [discoveredMemories, awardXP]);

  const discoverLandmark = useCallback((id: string) => {
    if (!discoveredLandmarks.has(id)) {
      const newSet = new Set(discoveredLandmarks).add(id);
      setDiscoveredLandmarks(newSet);
      saveDiscoveredLandmarks(Array.from(newSet));
      awardXP(75, 'LANDMARK_DISCOVERED', `landmark_${id}`);
      storyManager.handleGameAction('DISCOVER_LANDMARK', id);
      guardianManager.checkLocationTrigger(id);
      return true;
    }
    return false;
  }, [discoveredLandmarks, awardXP]);

  const unlockFastTravel = useCallback((id: string) => {
    if (!fastTravelNodes.has(id)) {
      const newSet = new Set(fastTravelNodes).add(id);
      setFastTravelNodes(newSet);
      saveFastTravelNodes(Array.from(newSet));
      showNotification('FAST TRAVEL UNLOCKED', 'Location added to Map.');
    }
  }, [fastTravelNodes, showNotification]);

  const setPaused = useCallback((paused: boolean) => setIsPaused(paused), []);


  const showInspection = useCallback((data: InspectionData) => {
    setInspectionTarget(data);
    setPaused(true);
  }, [setPaused]);

  const dismissInspection = useCallback(() => {
    setInspectionTarget(null);
    setPaused(false);
  }, [setPaused]);

  const showRegionBannerHandler = useCallback((data: RegionBannerData) => {
    setRegionBanner(data);
    setTimeout(() => setRegionBanner(null), 4000);
  }, []);

  const markCoreActivated = useCallback(() => {
    if (!coreActivated) {
      setCoreActivated(true);
      awardXP(500, 'CORE_ACTIVATION', 'world_core');
      worldActionSystem.recordAction({
        playerId: playerName,
        worldId: 'sector-alpha-01',
        actionType: 'CORE_ACTIVATION',
        location: [0,0,0]
      });
      showNotification('World Core Synchronized', 'success');
      storyManager.handleGameAction('ACTIVATE_CORE', 'world_core');
      guardianManager.checkLocationTrigger('world_core');
    }
  }, [coreActivated, playerName, awardXP, showNotification]);

  const updateWorldState = useCallback((impactDelta: number, energyDelta: number, stabilityDelta: number) => {
    setWorldImpact(prev => {
      const newVal = prev + impactDelta;
      return newVal;
    });
    setWorldEnergy(prev => Math.max(0, Math.min(100, prev + energyDelta)));
    setWorldStability(prev => Math.max(0, Math.min(100, prev + stabilityDelta)));
  }, []);

  const recordChoice = useCallback((choiceId: string, choiceValue: string) => {
    setWorldChoices(prev => {
      const next = { ...prev, [choiceId]: choiceValue };
      saveWorldChoices(next);
      return next;
    });
  }, []);

  useEffect(() => {
    saveWorldState({ worldImpact, worldEnergy, worldStability });
  }, [worldImpact, worldEnergy, worldStability]);

  useEffect(() => {
    saveNPCRelationships(npcRelationships);
  }, [npcRelationships]);

  useEffect(() => {
    saveActiveCompanion(activeCompanion);
  }, [activeCompanion]);

  useEffect(() => {
    const currentLvl = getEvolutionLevel(worldImpact);
    const storedWs = loadWorldState();
    const oldLvl = getEvolutionLevel(storedWs.worldImpact);
    
    if (currentLvl > oldLvl && worldImpact > 0) {
      showNotification('WORLD STATE CHANGED', `Evolution Level ${currentLvl}. The world is reacting.`);
    }
  }, [worldImpact, showNotification]);

  const setMapOpen = useCallback((open: boolean) => {
    setIsMapOpen(open);
    if (open) setPaused(true);
    else if (!isHistoryOpen && !inspectionTarget) setPaused(false);
  }, [setPaused, isHistoryOpen, inspectionTarget]);

  const setHistoryOpen = useCallback((open: boolean) => {
    setIsHistoryOpen(open);
    if (open) setPaused(true);
    else if (!isMapOpen && !inspectionTarget) setPaused(false);
  }, [setPaused, isMapOpen, inspectionTarget]);

  const discoverEvent = useCallback((eventId: string) => {
    if (!discoveredEvents.has(eventId)) {
      setDiscoveredEvents(prev => new Set(prev).add(eventId));
      return true;
    }
    return false;
  }, [discoveredEvents]);

  const startEvent = useCallback(async (eventId: string) => {
    const success = await eventSystem.startEvent(eventId);
    if (success) {
      setActiveEvents(eventSystem.getActiveEventsList());
      setTrackedEventId(eventId);
    }
    return success;
  }, []);

  const completeEvent = useCallback(async (eventId: string) => {
    const success = await eventSystem.completeEvent(eventId);
    if (success) {
      setActiveEvents(eventSystem.getActiveEventsList());
      setCompletedEvents(eventSystem.getCompletedEventsList());
      if (trackedEventId === eventId) setTrackedEventId(null);
      
      const ev = eventSystem.getEvent(eventId);
      if (ev) {
        updateWorldState(ev.impactReward, 0, 0);
        showNotification('EVENT COMPLETED', `${ev.title}`);
        awardXP(500, 'EVENT_COMPLETED', `event_${eventId}`);
        worldActionSystem.recordAction({
          playerId: currentUser?.uid || 'guest',
          worldId: 'sector-alpha-01',
          actionType: 'COMPLETE_EVENT',
          location: ev.location as [number, number, number] || [0,0,0],
          metadata: { eventId, title: ev.title }
        });
      }
    }
    return success;
  }, [trackedEventId, updateWorldState, showNotification, currentUser, awardXP]);

  const failEvent = useCallback(async (eventId: string) => {
    const success = await eventSystem.failEvent(eventId);
    if (success) {
      setActiveEvents(eventSystem.getActiveEventsList());
      if (trackedEventId === eventId) setTrackedEventId(null);
      const ev = eventSystem.getEvent(eventId);
      if (ev) showNotification('EVENT FAILED', `${ev.title}`);
    }
    return success;
  }, [trackedEventId, showNotification]);

  const setTrackedEvent = useCallback((eventId: string | null) => {
    setTrackedEventId(eventId);
  }, []);

  const setInventoryOpen = useCallback((open: boolean) => {
    setIsInventoryOpen(open);
    if (open) setPaused(true);
    else if (!isMapOpen && !isHistoryOpen && !inspectionTarget && !isCraftingOpen) setPaused(false);
  }, [setPaused, isMapOpen, isHistoryOpen, inspectionTarget, isCraftingOpen]);

  const setCraftingOpen = useCallback((open: boolean) => {
    setIsCraftingOpen(open);
    if (open) setPaused(true);
    else if (!isMapOpen && !isHistoryOpen && !inspectionTarget && !isInventoryOpen) setPaused(false);
  }, [setPaused, isMapOpen, isHistoryOpen, inspectionTarget, isInventoryOpen]);

  const collectItem = useCallback(async (itemId: string, quantity: number = 1) => {
    const success = await inventorySystem.collectItem(itemId, quantity);
    if (success) {
      showNotification('ITEM ACQUIRED', `Collected ${quantity}x ${itemId.replace(/_/g, ' ').replace('res ', '').replace('art ', '').replace('tool ', '').replace('con ', '')}`);
      awardXP(25, 'RESOURCE_HARVESTED', `collect_${itemId}_${Date.now()}`); 
      if (inventorySystem.getInventory().items.length >= 1) unlockAchievement('RESOURCE_HUNTER');
    }
    return success;
  }, [showNotification, unlockAchievement, awardXP]);

  const useItem = useCallback(async (itemId: string) => {
    const success = await inventorySystem.useItem(itemId);
    if (success) {
      if (itemId === 'con_lumen_charge') {
        setStamina(prev => Math.min(100, prev + 25));
        showNotification('CONSUMED', 'Lumen Charge used. Stamina restored.');
      } else if (itemId === 'con_world_pulse') {
        setActiveBuffs(prev => ({ ...prev, worldPulse: true }));
        showNotification('CONSUMED', 'World Pulse active. Interactions revealed.');
        setTimeout(() => setActiveBuffs(prev => ({ ...prev, worldPulse: false })), 30000);
      } else if (itemId === 'con_echo_tonic') {
        setActiveBuffs(prev => ({ ...prev, echoTonic: true }));
        showNotification('CONSUMED', 'Echo Tonic active. Senses heightened.');
        setTimeout(() => setActiveBuffs(prev => ({ ...prev, echoTonic: false })), 30000);
      }
    }
    return success;
  }, [setStamina, showNotification]);

  const dropItem = useCallback(async (itemId: string, quantity: number = 1) => {
    const success = await inventorySystem.dropItem(itemId, quantity);
    if (success) {
      setDroppedItems(prev => [...prev, {
        id: Math.random().toString(36).substring(7),
        itemId,
        quantity,
        position: [Math.random() * 4 - 2, 0, Math.random() * 4 - 2]
      }]);
    }
    return success;
  }, []);

  const removeDroppedItem = useCallback((id: string) => {
    setDroppedItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const craftItem = useCallback(async (recipeId: string) => {
    const success = await inventorySystem.craftItem(recipeId);
    if (success) {
      showNotification('CRAFTING SUCCESS', 'Item synthesized successfully.');
      awardXP(150, 'ITEM_SYNTHESIZED', `craft_${recipeId}_${Date.now()}`);
      unlockAchievement('FIRST_CRAFT');
    } else {
      showNotification('CRAFTING FAILED', 'Not enough resources or invalid recipe.');
    }
    return success;
  }, [showNotification, unlockAchievement, awardXP]);

  const setHotbarSlot = useCallback((index: number, itemId: string | null) => {
    inventorySystem.setHotbarSlot(index, itemId);
  }, []);

  const unlockAbility = useCallback(async (abilityId: string) => {
    const newProg = await progressionSystem.unlockAbility(abilityId, progression);
    if (newProg) {
      setProgression(newProg);
      showNotification('ABILITY UNLOCKED', abilityId.replace('ability_', '').replace(/_/g, ' ').toUpperCase());
      if (newProg.unlockedAbilities.length >= 3) unlockAchievement('RESONANT');
      return true;
    }
    return false;
  }, [progression, showNotification, unlockAchievement]);

  const startDialogue = (npcId: string) => {
    const npc = NPC_DATA.find(n => n.id === npcId);
    if (!npc) return;
    
    setActiveDialogue({
      npc,
      currentNode: npc.dialogueNodes[npc.defaultNodeId]
    });
    setPaused(true);
    storyManager.handleGameAction('TALK_TO_NPC', npcId);
  };

  const selectDialogueOption = (optionId: string) => {
    if (!activeDialogue) return;
    
    const option = activeDialogue.currentNode.options.find(o => o.id === optionId);
    if (!option) return;
    
    // Process effects
    if (option.effects) {
      option.effects.forEach(effect => {
        if (effect.type === 'INVITE_COMPANION') {
          setActiveCompanion(effect.value);
        } else if (effect.type === 'DISMISS_COMPANION') {
          setActiveCompanion(null);
        }
      });
    }
    
    if (option.nextNodeId) {
      setActiveDialogue({
        ...activeDialogue,
        currentNode: activeDialogue.npc.dialogueNodes[option.nextNodeId]
      });
    } else {
      endDialogue();
    }
  };

  const endDialogue = () => {
    setActiveDialogue(null);
    setPaused(false);
  };

  const setActiveCompanion = useCallback(async (npcId: string | null) => {
    setActiveCompanionState(npcId);
    if (npcId) {
      unlockAchievement('FIRST_COMPANION');
      try {
        const token = await currentUser?.getIdToken();
        if (token) {
          await fetch(`/api/players/me/companions/${npcId}/invite`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          });
        }
      } catch (e) {
        console.warn('Backend unavailable, using local fallback for companion invite', e);
      }
    } else if (activeCompanion) {
      try {
        const token = await currentUser?.getIdToken();
        if (token) {
          await fetch(`/api/players/me/companions/${activeCompanion}/dismiss`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          });
        }
      } catch (e) {
        console.warn('Backend unavailable, using local fallback for companion dismiss', e);
      }
    }
  }, [currentUser, activeCompanion, unlockAchievement]);

  const applyEnvironmentState = useCallback((regionId: string, state: string) => {
    setEnvironmentState(prev => ({ ...prev, [regionId]: state }));
  }, []);

  const recordMajorDecision = useCallback((decisionId: string, details: any) => {
    setMajorDecisions(prev => ({ ...prev, [decisionId]: details }));
  }, []);

  const evaluateEndgamePath = useCallback(async () => {
    // Implement threshold evaluation
  }, []);

  const handleSetCurrentRegion = useCallback((region: RegionDefinition | null) => {
    setCurrentRegion(region);
    if (region && !discoveredRegions.has(region.id)) {
      const newSet = new Set(discoveredRegions).add(region.id);
      setDiscoveredRegions(newSet);
      saveDiscoveredRegions(Array.from(newSet));
      awardXP(100, 'REGION_DISCOVERED', `region_${region.id}`);
      if (activeCompanionState) unlockAchievement('TRAVEL_TOGETHER'); // Simplification
      
      storyManager.handleGameAction('DISCOVER_REGION', region.id);
      guardianManager.checkLocationTrigger(region.id);
    }
  }, [discoveredRegions, awardXP, activeCompanionState, unlockAchievement]);

  return (
    <GameStateContext.Provider value={{
      memoryCount, evolutionLevel, isPaused, activeInteraction, notifications,
      stamina, playerName, currentRegion, discoveredRegions: Array.from(discoveredRegions),
      discoveredMemories: Array.from(discoveredMemories),
      discoveredLandmarks: Array.from(discoveredLandmarks),
      fastTravelNodes: Array.from(fastTravelNodes),
      explorationCount: { regions: discoveredRegions.size, memories: discoveredMemories.size, landmarks: discoveredLandmarks.size, coreActivated },
      inspectionTarget, regionBanner,
      worldImpact, worldEnergy, worldStability, worldChoices, isMapOpen, isHistoryOpen, isJournalOpen,
      activeEvents, completedEvents, discoveredEvents: Array.from(discoveredEvents), trackedEventId, achievements: Array.from(achievements),
      inventory, hotbar, isInventoryOpen, isCraftingOpen, activeBuffs, droppedItems,
      discoverMemory, discoverLandmark, unlockFastTravel, setPaused, setActiveInteraction, showNotification, dismissNotification,
      setStamina, setCurrentRegion: handleSetCurrentRegion,
      showInspection, dismissInspection, showRegionBanner: showRegionBannerHandler,
      markCoreActivated,
      updateWorldState, recordChoice, setMapOpen, setHistoryOpen, setJournalOpen,
      discoverEvent, startEvent, completeEvent, failEvent, setTrackedEvent, unlockAchievement,
      setInventoryOpen, setCraftingOpen, collectItem, useItem, dropItem, removeDroppedItem, craftItem, setHotbarSlot,
      progression, awardXP, unlockAbility,
      activeDialogue, npcRelationships, startDialogue, selectDialogueOption, endDialogue,
      activeCompanion, setActiveCompanion,
      worldPhase, dominantResonance, environmentState, unlockedEndgamePaths, worldTransformationLevel, majorDecisions,
      setWorldPhase, applyEnvironmentState, recordMajorDecision, evaluateEndgamePath,
      multiplayerState, setMultiplayerState
    }}>
      {children}
    </GameStateContext.Provider>
  );
}

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};

