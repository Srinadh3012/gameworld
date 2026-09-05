import * as THREE from 'three';

export class CompanionNavigation {
  
  /**
   * Deterministic logic to calculate the next position for the companion.
   * Avoids getting stuck in terrain by checking simple distances.
   */
  static getNextPosition(
    currentPos: THREE.Vector3,
    targetPos: THREE.Vector3,
    followDistance: number,
    speed: number,
    deltaTime: number
  ): THREE.Vector3 {
    const distance = currentPos.distanceTo(targetPos);
    
    // If we're within the follow distance, don't move
    if (distance <= followDistance) {
      return currentPos.clone();
    }
    
    // Smooth navigation towards player, slowing down as they get closer to the follow distance
    const speedMultiplier = Math.min(1, (distance - followDistance) / 2);
    const actualSpeed = speed * speedMultiplier;
    
    // If we're too far (stuck or player teleported/fast-travelled), snap safely behind player
    if (distance > 50) {
      const offset = new THREE.Vector3(
        (Math.random() - 0.5) * followDistance,
        0,
        (Math.random() - 0.5) * followDistance
      );
      return targetPos.clone().add(offset);
    }
    
    // Smooth navigation towards player
    const direction = new THREE.Vector3().subVectors(targetPos, currentPos).normalize();
    
    // Move along the direction vector
    const newPos = currentPos.clone().add(direction.multiplyScalar(actualSpeed * deltaTime));
    
    // Lock Y to 0 for simple ground tracking (in a real navmesh this would project to terrain Y)
    newPos.y = 0;
    
    return newPos;
  }
}
