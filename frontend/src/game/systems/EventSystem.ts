import { saveEventState, loadEventState, saveAchievements, loadAchievements } from '../utils/storage';
import { startEvent as apiStartEvent, completeEvent as apiCompleteEvent, failEvent as apiFailEvent } from '../../services/api';
import { GAME_EVENTS } from '../data/eventData';
import type { GameEventDefinition } from '../data/eventData';

export type EventStatus = 'LOCKED' | 'AVAILABLE' | 'ACTIVE' | 'COMPLETED' | 'FAILED';

class EventSystem {
  private activeEvents: Set<string> = new Set();
  private completedEvents: Set<string> = new Set();
  private failedEvents: Set<string> = new Set();
  private achievements: Set<string> = new Set();

  constructor() {
    this.activeEvents = new Set(loadEventState('active'));
    this.completedEvents = new Set(loadEventState('completed'));
    this.failedEvents = new Set(loadEventState('failed'));
    this.achievements = new Set(loadAchievements());
  }

  public getEvent(id: string): GameEventDefinition | undefined {
    return GAME_EVENTS.find(e => e.id === id);
  }

  public getStatus(id: string): EventStatus {
    if (this.completedEvents.has(id)) return 'COMPLETED';
    if (this.activeEvents.has(id)) return 'ACTIVE';
    if (this.failedEvents.has(id)) return 'FAILED';
    
    // Check prerequisites
    const ev = this.getEvent(id);
    if (ev && ev.prerequisiteEventId && !this.completedEvents.has(ev.prerequisiteEventId)) {
      return 'LOCKED';
    }
    return 'AVAILABLE';
  }

  public async startEvent(id: string): Promise<boolean> {
    if (this.getStatus(id) !== 'AVAILABLE') return false;
    
    this.activeEvents.add(id);
    saveEventState('active', Array.from(this.activeEvents));
    
    try {
      await apiStartEvent('sector-alpha-01', id);
    } catch (e) {
      console.warn('[EventSystem] Start Event sync failed, using local.', e);
    }
    return true;
  }

  public async completeEvent(id: string): Promise<boolean> {
    if (!this.activeEvents.has(id)) return false;
    
    this.activeEvents.delete(id);
    this.completedEvents.add(id);
    saveEventState('active', Array.from(this.activeEvents));
    saveEventState('completed', Array.from(this.completedEvents));

    try {
      await apiCompleteEvent('sector-alpha-01', id);
    } catch (e) {
      console.warn('[EventSystem] Complete Event sync failed, using local.', e);
    }
    return true;
  }

  public async failEvent(id: string): Promise<boolean> {
    if (!this.activeEvents.has(id)) return false;
    
    this.activeEvents.delete(id);
    this.failedEvents.add(id);
    saveEventState('active', Array.from(this.activeEvents));
    saveEventState('failed', Array.from(this.failedEvents));

    try {
      await apiFailEvent('sector-alpha-01', id);
    } catch (e) {
      console.warn('[EventSystem] Fail Event sync failed, using local.', e);
    }
    return true;
  }

  public unlockAchievement(id: string) {
    if (!this.achievements.has(id)) {
      this.achievements.add(id);
      saveAchievements(Array.from(this.achievements));
      // Could also push to backend if we had an endpoint to explicitly unlock one
    }
  }

  public hasAchievement(id: string): boolean {
    return this.achievements.has(id);
  }

  public getActiveEventsList(): string[] {
    return Array.from(this.activeEvents);
  }
  public getCompletedEventsList(): string[] {
    return Array.from(this.completedEvents);
  }
}

export const eventSystem = new EventSystem();
