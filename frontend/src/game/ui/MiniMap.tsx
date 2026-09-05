import React, { useEffect, useRef, useState } from 'react';
import { explorationSystem } from '../systems/ExplorationSystem';
import { WORLD_COORDINATES } from '../data/worldCoordinates';
import { useGameState } from '../context/GameStateContext';
import { storyManager } from '../story/StoryManager';

export function MiniMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { discoveredLandmarks, activeCompanion, activeMissions } = useGameState();
  const mapScale = 2; // Scale down for minimap
  const mapSize = 150; // Pixels

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, mapSize, mapSize);
      
      const px = explorationSystem.playerPosition[0];
      const pz = explorationSystem.playerPosition[2];

      // Draw map background/grid
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, mapSize, mapSize);

      ctx.save();
      // Center the map on player
      ctx.translate(mapSize / 2, mapSize / 2);
      
      // Draw discovered landmarks
      WORLD_COORDINATES.landmarks.forEach(landmark => {
        if (discoveredLandmarks.includes(landmark.id)) {
          const dx = (landmark.position[0] - px) * mapScale;
          const dz = (landmark.position[2] - pz) * mapScale;
          
          // Only draw if within bounds
          if (Math.abs(dx) < mapSize/2 && Math.abs(dz) < mapSize/2) {
            ctx.fillStyle = '#00f3ff';
            ctx.beginPath();
            ctx.arc(dx, dz, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // Draw active mission targets
      storyManager.getMissionTargets().forEach(target => {
        const dx = (target.x - px) * mapScale;
        const dz = (target.z - pz) * mapScale;

        if (Math.abs(dx) < mapSize/2 && Math.abs(dz) < mapSize/2) {
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(dx, dz, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw player
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();

      // Draw companion if active (slightly offset from player)
      if (activeCompanion) {
        ctx.fillStyle = '#22d3ee'; // cyan-400
        ctx.beginPath();
        // Just an abstract offset for the minimap since we don't have the exact scene node position here easily
        ctx.arc(-6, 6, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw small direction indicator (Assuming camera looks -z locally, but since we don't have rotation here easily, just dot)
      
      ctx.restore();

      // Border
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, mapSize, mapSize);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [discoveredLandmarks]);

  return (
    <div className="absolute top-6 right-6 z-20 rounded overflow-hidden shadow-[0_0_15px_rgba(0,243,255,0.1)] border border-cyan-900/50 backdrop-blur-md">
      <canvas ref={canvasRef} width={mapSize} height={mapSize} />
      <div className="absolute bottom-1 w-full text-center text-[9px] text-cyan-400 font-mono tracking-widest bg-black/40">
        MINIMAP
      </div>
    </div>
  );
}
