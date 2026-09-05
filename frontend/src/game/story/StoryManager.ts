import { MISSIONS, ObjectiveType, StoryMission } from './missionData';
import { loadLocalStoryState, saveLocalStoryState, LocalStoryState } from './StoryState';
import { worldActionSystem } from '../systems/WorldActionSystem';
import { eventSystem } from '../systems/EventSystem';
import { WORLD_COORDINATES } from '../data/worldCoordinates';

export class StoryManager {
  private state: LocalStoryState;
  private syncTimeout: any;

  constructor() {
    this.state = loadLocalStoryState();
    this.evaluateUnlocks();
  }

  public getState(): LocalStoryState {
    return this.state;
  }

  public getActiveMissions(): StoryMission[] {
    return this.state.activeMissions
      .map(id => MISSIONS.find(m => m.id === id))
      .filter((m): m is StoryMission => !!m);
  }

  public getMissionTargets() {
    const targets: {x: number, z: number, id: string, title: string}[] = [];
    this.getActiveMissions().forEach(mission => {
      mission.objectives.forEach(obj => {
        if (!this.getObjectiveProgress(mission.id, obj.id)) {
          const r = WORLD_COORDINATES.regions.find(reg => reg.id === obj.target);
          if (r) targets.push({ x: r.x, z: r.z, id: obj.id, title: obj.description });
          const l = WORLD_COORDINATES.landmarks.find(lm => lm.id === obj.target);
          if (l) targets.push({ x: l.x, z: l.z, id: obj.id, title: obj.description });
        }
      });
    });
    return targets;
  }
  
  public getCompletedMissions(): StoryMission[] {
    return this.state.completedMissions
      .map(id => MISSIONS.find(m => m.id === id))
      .filter((m): m is StoryMission => !!m);
  }

  public getObjectiveProgress(missionId: string, objectiveId: string): boolean {
    return this.state.missionProgress[missionId]?.includes(objectiveId) || false;
  }

  // Hook this into the game's event loop or context actions
  public handleGameAction(
    type: ObjectiveType,
    target: string,
    metadata?: any
  ): void {
    let stateChanged = false;

    // Check if this action completes any active objective in any active mission
    for (const missionId of this.state.activeMissions) {
      const mission = MISSIONS.find(m => m.id === missionId);
      if (!mission) continue;

      if (!this.state.missionProgress[missionId]) {
        this.state.missionProgress[missionId] = [];
      }

      const completedObjIds = this.state.missionProgress[missionId];

      for (const obj of mission.objectives) {
        if (!completedObjIds.includes(obj.id)) {
          if (obj.type === type && obj.target === target) {
            completedObjIds.push(obj.id);
            stateChanged = true;
            // Play a sound or trigger notification here in a real app
          }
        }
      }

      // Check if mission complete
      if (completedObjIds.length === mission.objectives.length) {
        this.completeMission(missionId);
        stateChanged = true;
      }
    }

    if (stateChanged) {
      saveLocalStoryState(this.state);
      this.evaluateUnlocks();
    }
  }

  private completeMission(missionId: string) {
    this.state.activeMissions = this.state.activeMissions.filter(id => id !== missionId);
    if (!this.state.completedMissions.includes(missionId)) {
      this.state.completedMissions.push(missionId);
    }
    
    // Apply rewards and flags
    const mission = MISSIONS.find(m => m.id === missionId);
    if (mission) {
      mission.rewards.forEach(reward => {
        if (reward.flag) {
          this.state.storyFlags[reward.flag] = true;
        }
        if (reward.memoryId) {
          // Trigger a world memory
          worldActionSystem.recordAction({
            playerId: 'local', // ideally injected from auth
            worldId: 'sector-alpha-01',
            actionType: 'MISSION_COMPLETE',
            location: [0, 0, 0],
            metadata: { missionId, memoryId: reward.memoryId }
          });
        }
      });
      
      // Update achievements
      if (this.state.completedMissions.length === 1) eventSystem.unlockAchievement('FIRST_STORY');
      if (this.state.completedMissions.length === 5) eventSystem.unlockAchievement('WORLD_LISTENER');
      if (mission.chapter === 1 && this.state.completedMissions.includes('mission_04_memory_chamber')) {
        eventSystem.unlockAchievement('STORY_KEEPER');
        this.state.currentChapter = 2;
      }
      if (mission.type === 'EXPLORATION') eventSystem.unlockAchievement('DEEP_EXPLORER');
    }
  }

  public recordStoryChoice(choiceId: string, value: string) {
    this.state.choices[choiceId] = value;
    saveLocalStoryState(this.state);
    eventSystem.unlockAchievement('CHOICE_MAKER');
    
    worldActionSystem.recordAction({
      playerId: 'local',
      worldId: 'sector-alpha-01',
      actionType: 'STORY_CHOICE',
      location: [0, 0, 0],
      metadata: { choiceId, value }
    });
    
    // THE REMEMBERED achievement if major choice
    if (choiceId === 'core_signal' || choiceId === 'memory_lens') {
      eventSystem.unlockAchievement('THE_REMEMBERED');
    }
    
    this.evaluateUnlocks();
  }

  public setStoryFlag(flag: string, value: boolean) {
    this.state.storyFlags[flag] = value;
    saveLocalStoryState(this.state);
    this.evaluateUnlocks();
  }

  private evaluateUnlocks() {
    let stateChanged = false;

    // Check all locked missions if they should be unlocked
    for (const mission of MISSIONS) {
      const isLocked = !this.state.activeMissions.includes(mission.id) && !this.state.completedMissions.includes(mission.id) && !this.state.failedMissions.includes(mission.id);
      
      if (isLocked) {
        let canUnlock = true;
        const req = mission.unlockRequirements;
        
        if (req.completedMissions) {
          if (!req.completedMissions.every(id => this.state.completedMissions.includes(id))) canUnlock = false;
        }
        if (req.flags) {
          if (!req.flags.every(f => this.state.storyFlags[f])) canUnlock = false;
        }
        
        // Auto-start MISSION 01 if no active/completed missions
        if (mission.id === 'mission_01_awakening' && this.state.completedMissions.length === 0 && this.state.activeMissions.length === 0) {
          canUnlock = true;
        }

        if (canUnlock) {
          this.state.activeMissions.push(mission.id);
          stateChanged = true;
        }
      }
    }

    if (stateChanged) {
      saveLocalStoryState(this.state);
    }
  }

  // Load from backend API sync
  public async syncWithBackend(token: string) {
    try {
      const res = await fetch('/api/story/state', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data) {
        // Merge backend state over local
        this.state = { ...this.state, ...data.data };
        saveLocalStoryState(this.state);
        this.evaluateUnlocks();
      }
    } catch (e) {
      console.warn('Failed to sync story with backend, using local state.');
    }
  }

  // Async push to backend
  public async pushToBackend(token: string) {
    try {
      await fetch('/api/story/state', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state)
      });
    } catch (e) {
      console.warn('Failed to push story state to backend.');
    }
  }
}

export const storyManager = new StoryManager();
