import * as THREE from 'three';

export interface RegionBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export function isPositionInRegion(pos: THREE.Vector3 | [number, number, number], bounds: RegionBounds): boolean {
  const x = Array.isArray(pos) ? pos[0] : pos.x;
  const z = Array.isArray(pos) ? pos[2] : pos.z;
  
  return x >= bounds.minX && x <= bounds.maxX && z >= bounds.minZ && z <= bounds.maxZ;
}

export function lerpNumber(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

// Basic AABB collision detection to stop player from walking through defined bounds
export function isPositionBlockedByObstacle(x: number, z: number, obstacles: RegionBounds[]): boolean {
  for (const obs of obstacles) {
    if (x >= obs.minX && x <= obs.maxX && z >= obs.minZ && z <= obs.maxZ) {
      return true;
    }
  }
  return false;
}

export function distance2D(a: { x: number, z: number }, b: { x: number, z: number }): number {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.z - b.z, 2));
}
