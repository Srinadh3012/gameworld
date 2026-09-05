import { WORLD_COORDINATES } from '../data/worldCoordinates';
import type { Landmark } from '../data/worldCoordinates';
import { distance2D } from '../utils/gameHelpers';

type Listener = () => void;

class ExplorationSystem {
  private listeners: Set<Listener> = new Set();
  
  public playerPosition: [number, number, number] = [0, 0, 0];
  
  // Distances for discovering items
  private readonly LANDMARK_DISCOVERY_RADIUS = 15;
  
  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(l => l());
  }

  // Check if a player at position [x, y, z] is close enough to any undiscovered landmark
  checkLandmarkProximity(playerPosition: [number, number, number], discoveredLandmarks: string[]): Landmark | null {
    this.playerPosition = playerPosition;
    for (const landmark of WORLD_COORDINATES.landmarks) {
      if (!discoveredLandmarks.includes(landmark.id)) {
        const dist = distance2D(
          { x: playerPosition[0], z: playerPosition[2] },
          { x: landmark.position[0], z: landmark.position[2] }
        );
        
        if (dist <= this.LANDMARK_DISCOVERY_RADIUS) {
          return landmark;
        }
      }
    }
    return null;
  }
}

export const explorationSystem = new ExplorationSystem();
