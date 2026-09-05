import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { REGIONS } from '../data/regionData';
import type { RegionDefinition } from '../data/regionData';
import { isPositionInRegion } from '../utils/gameHelpers';
import { useGameState } from '../context/GameStateContext';
import { worldActionSystem } from './WorldActionSystem';

export function RegionDetector() {
  const { camera } = useThree();
  const { currentRegion, setCurrentRegion, showRegionBanner } = useGameState();
  
  // Track last region in a ref so we don't trigger state updates unnecessarily in useFrame/intervals
  const lastRegionId = useRef<string | null>(currentRegion?.id || null);

  useEffect(() => {
    // We don't need to check region every frame. 4 times a second is plenty for region detection.
    const interval = setInterval(() => {
      let foundRegion: RegionDefinition | null = null;
      
      for (const region of REGIONS) {
        if (isPositionInRegion(camera.position, region.bounds)) {
          foundRegion = region;
          break;
        }
      }

      const foundId = foundRegion?.id || null;

      if (foundId !== lastRegionId.current) {
        lastRegionId.current = foundId;
        setCurrentRegion(foundRegion);

        if (foundRegion) {
          showRegionBanner({ title: 'REGION DISCOVERED', name: foundRegion.name, color: foundRegion.color });
          
          worldActionSystem.recordAction({
            playerId: 'local', // will be replaced by context
            worldId: 'sector-alpha-01',
            actionType: 'ENTERED_REGION',
            location: [camera.position.x, camera.position.y, camera.position.z],
            metadata: { regionId: foundRegion.id, regionName: foundRegion.name }
          });
        }
      }
    }, 250);

    return () => clearInterval(interval);
  }, [camera, setCurrentRegion, showRegionBanner]);

  return null;
}
