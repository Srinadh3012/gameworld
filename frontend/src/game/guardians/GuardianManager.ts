import { GUARDIANS, GuardianData } from './GuardianData';
import { loadLocalGuardianState, saveLocalGuardianState, LocalGuardianEncounter } from './GuardianState';
import { worldActionSystem } from '../systems/WorldActionSystem';
import { eventSystem } from '../systems/EventSystem';
import { storyManager } from '../story/StoryManager';

export class GuardianManager {
  private encounters: Map<string, LocalGuardianEncounter> = new Map();
  // We'll track the currently active encounter globally for UI
  public activeGuardianId: string | null = null;
  private listeners: (() => void)[] = [];

  constructor() {
    // We would normally load all of them from backend here
    // For now we'll lazily load them when required.
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  public getEncounter(guardianId: string): LocalGuardianEncounter {
    if (!this.encounters.has(guardianId)) {
      this.encounters.set(guardianId, loadLocalGuardianState('local', guardianId, 'sector-alpha-01'));
    }
    return this.encounters.get(guardianId)!;
  }

  public getActiveGuardianData(): GuardianData | null {
    if (!this.activeGuardianId) return null;
    return GUARDIANS.find(g => g.id === this.activeGuardianId) || null;
  }

  public getActiveEncounter(): LocalGuardianEncounter | null {
    if (!this.activeGuardianId) return null;
    return this.getEncounter(this.activeGuardianId);
  }

  public checkLocationTrigger(locationId: string) {
    const guardian = GUARDIANS.find(g => g.locationId === locationId);
    if (guardian) {
      const encounter = this.getEncounter(guardian.id);
      if (!encounter.completed && !encounter.failed) {
        if (encounter.status === 'DORMANT' || encounter.status === 'RESTING') {
          this.startEncounter(guardian.id);
        } else if (encounter.status === 'ACTIVE' || encounter.status === 'CHALLENGE') {
          // Re-entering
          this.activeGuardianId = guardian.id;
          this.notify();
        }
      }
    } else {
      // Exited a guardian zone?
      if (this.activeGuardianId) {
        const activeData = this.getActiveGuardianData();
        if (activeData && activeData.locationId !== locationId) {
          // You left the zone. Maybe fail or just pause.
          this.activeGuardianId = null;
          this.notify();
        }
      }
    }
  }

  public startEncounter(guardianId: string) {
    const encounter = this.getEncounter(guardianId);
    encounter.status = 'CHALLENGE';
    encounter.currentPhase = 1;
    encounter.attempts += 1;
    encounter.failed = false;
    
    this.activeGuardianId = guardianId;
    saveLocalGuardianState(guardianId, encounter);
    this.notify();

    worldActionSystem.recordAction({
      playerId: 'local',
      worldId: 'sector-alpha-01',
      actionType: 'GUARDIAN_AWAKENED',
      location: [0,0,0],
      metadata: { guardianId }
    });
  }

  public progressPhase() {
    if (!this.activeGuardianId) return;
    const encounter = this.getEncounter(this.activeGuardianId);
    const data = this.getActiveGuardianData();
    if (!data) return;

    if (encounter.currentPhase < data.phases.length) {
      encounter.currentPhase += 1;
      saveLocalGuardianState(this.activeGuardianId, encounter);
      this.notify();
    } else {
      this.completeEncounter();
    }
  }

  public failEncounter() {
    if (!this.activeGuardianId) return;
    const encounter = this.getEncounter(this.activeGuardianId);
    
    encounter.status = 'RESTING';
    encounter.failed = true;
    encounter.currentPhase = 0;
    
    saveLocalGuardianState(this.activeGuardianId, encounter);
    
    worldActionSystem.recordAction({
      playerId: 'local',
      worldId: 'sector-alpha-01',
      actionType: 'GUARDIAN_FAILED',
      location: [0,0,0],
      metadata: { guardianId: this.activeGuardianId }
    });
    
    this.activeGuardianId = null;
    this.notify();
  }

  public completeEncounter() {
    if (!this.activeGuardianId) return;
    const encounter = this.getEncounter(this.activeGuardianId);
    const data = this.getActiveGuardianData();
    
    encounter.status = 'RESOLVED';
    encounter.completed = true;
    saveLocalGuardianState(this.activeGuardianId, encounter);

    worldActionSystem.recordAction({
      playerId: 'local',
      worldId: 'sector-alpha-01',
      actionType: 'GUARDIAN_COMPLETED',
      location: [0,0,0],
      metadata: { guardianId: this.activeGuardianId }
    });

    if (data) {
      if (data.rewards.flag) {
        storyManager.setStoryFlag(data.rewards.flag, true);
      }
      
      if (data.id === 'guardian_echo_warden') eventSystem.unlockAchievement('WARDENS_TRIAL');
      if (data.id === 'guardian_rootkeeper') eventSystem.unlockAchievement('ROOT_AWAKENED');
      if (data.id === 'guardian_observer') eventSystem.unlockAchievement('THE_OBSERVERS_APPROVAL');
      if (data.id === 'guardian_core_sentinel') eventSystem.unlockAchievement('CORE_RECOGNITION');
      
      // Let's count completions (mocking since we only track locally for now)
      let completedCount = 0;
      this.encounters.forEach(e => { if (e.completed) completedCount++; });
      if (completedCount >= 3) eventSystem.unlockAchievement('GUARDIAN_WALKER');
    }

    this.activeGuardianId = null;
    this.notify();
  }
}

export const guardianManager = new GuardianManager();
