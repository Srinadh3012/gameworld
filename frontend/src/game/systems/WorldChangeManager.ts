export interface WorldTransformationData {
  id: string;
  worldId: string;
  regionId: string;
  trigger: string;
  condition?: string;
  transformation: string;
  active: boolean;
}

class WorldChangeManager {
  private transformations: WorldTransformationData[] = [];
  private subscribers: Set<() => void> = new Set();

  public getTransformations() {
    return this.transformations;
  }

  public getTransformationsForRegion(regionId: string) {
    return this.transformations.filter(t => t.regionId === regionId && t.active);
  }

  public addTransformation(data: WorldTransformationData) {
    if (!this.transformations.find(t => t.id === data.id)) {
      this.transformations.push(data);
      this.notifySubscribers();
    }
  }

  public evaluateWorldPhase(worldEnergy: number, worldStability: number): string {
    if (worldEnergy > 80 && worldStability < 40) return 'Threshold';
    if (worldEnergy > 60) return 'Resonance';
    if (worldEnergy > 40) return 'Transformation';
    if (worldEnergy > 20) return 'Awakening';
    return 'Dormant';
  }

  public evaluateEnvironmentState(regionId: string, worldPhase: string, currentTransformations: WorldTransformationData[]): string {
    const regionTransformations = currentTransformations.filter(t => t.regionId === regionId);
    if (regionTransformations.length > 2 || worldPhase === 'Resonance') return 'HighlyActive';
    if (regionTransformations.length > 0 || worldPhase === 'Transformation') return 'Active';
    if (worldPhase === 'Awakening') return 'Awakening';
    return 'Dormant';
  }

  public subscribe(callback: () => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers() {
    this.subscribers.forEach(cb => cb());
  }
}

export const worldChangeManager = new WorldChangeManager();
