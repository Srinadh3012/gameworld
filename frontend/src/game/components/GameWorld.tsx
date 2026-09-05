import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Line } from '@react-three/drei';
import { Player } from './Player';
import { Terrain } from './Terrain';
import { WorldMemoryStone } from './WorldMemoryStone';
import { WorldCore } from './WorldCore';
import { RegionDetector } from '../systems/RegionSystem';
import { AncientDevice } from './AncientDevice';
import { WorldEvolution } from './WorldEvolution';
import { DynamicEventZone } from './DynamicEventZone';
import { GAME_EVENTS } from '../data/eventData';
import { LandmarkNode } from './LandmarkNode';
import { WORLD_COORDINATES } from '../data/worldCoordinates';
import { ResourceNode } from './ResourceNode';
import { WorldForge } from './WorldForge';
import { DroppedItem } from './DroppedItem';
import { useGameState } from '../context/GameStateContext';
import { useAbilityInputs } from '../hooks/useAbilityInputs';
import { NPCNode } from './npc/NPCNode';
import { CoreVoiceNode } from './npc/CoreVoiceNode';
import { NPC_DATA } from '../data/npcData';
import { multiplayerManager, RemotePlayer } from '../multiplayer/MultiplayerManager';
import { NetworkPlayer } from './NetworkPlayer';

// Phase 19: Remote Players
function RemotePlayersGroup() {
  const [players, setPlayers] = useState<RemotePlayer[]>([]);

  useEffect(() => {
    // Initial fetch
    setPlayers(multiplayerManager.getRemotePlayers());

    // Subscribe to updates (only triggers on join/leave, not every movement frame)
    multiplayerManager.setOnPlayersUpdated((newPlayers) => {
      setPlayers([...newPlayers]);
    });

    return () => {
      multiplayerManager.setOnPlayersUpdated(() => {});
    };
  }, []);

  // Update interpolation loop
  useFrame((state, delta) => {
    multiplayerManager.updateInterpolation(delta);
  });

  return (
    <group>
      {players.map(p => (
        <NetworkPlayer key={p.uid} player={p} />
      ))}
    </group>
  );
}

// Phase 12: Headless component to manage ability inputs
function AbilityController() {
  useAbilityInputs();
  return null;
}

// Phase 12: World Whisper Effect
function WorldWhisperEffect() {
  const [active, setActive] = useState(false);
  const { discoveredMemories } = useGameState();
  const linePoints = useRef<[number, number, number][]>([]);

  useEffect(() => {
    const handleAbility = (e: any) => {
      if (e.detail.abilityId === 'ability_world_whisper') {
        // Hardcoded positions of memory stones for the demo
        const memoryPositions: [string, [number, number, number]][] = [
          ['memory_stone_1', [12, 0, -18]],
          ['memory_stone_2', [-25, 0, -35]],
          ['memory_stone_3', [40, 0, 30]]
        ];
        
        // Find nearest undiscovered
        let nearest: [number, number, number] | null = null;
        for (const [id, pos] of memoryPositions) {
          if (!discoveredMemories.includes(id)) {
            nearest = pos;
            break;
          }
        }
        
        if (nearest) {
          linePoints.current = [[0, 2, 0], [nearest[0], nearest[1] + 2, nearest[2]]];
          setActive(true);
          setTimeout(() => setActive(false), 3000);
        }
      }
    };
    window.addEventListener('gw_ability_used', handleAbility);
    return () => window.removeEventListener('gw_ability_used', handleAbility);
  }, [discoveredMemories]);

  if (!active || linePoints.current.length === 0) return null;

  return (
    <Line
      points={linePoints.current}
      color="#00f3ff"
      lineWidth={3}
      dashed={true}
      dashScale={10}
      dashSize={2}
      dashOffset={0}
      transparent
      opacity={0.8}
    />
  );
}

export function GameWorld() {
  const { droppedItems, removeDroppedItem, activeEvents } = useGameState();
  const [echoVisionActive, setEchoVisionActive] = useState(false);

  useEffect(() => {
    const handleAbility = (e: any) => {
      if (e.detail.abilityId === 'ability_echo_vision') {
        setEchoVisionActive(true);
        setTimeout(() => setEchoVisionActive(false), 10000); // 10 seconds duration
      }
    };
    window.addEventListener('gw_ability_used', handleAbility);
    return () => window.removeEventListener('gw_ability_used', handleAbility);
  }, []);

  return (
    <>
      {/* Echo Vision Screen Overlay */}
      {echoVisionActive && (
        <div className="pointer-events-none fixed inset-0 z-10 mix-blend-screen bg-blue-900/20 backdrop-invert/10 transition-all duration-1000" />
      )}
      <Canvas
        shadows
        camera={{ fov: 80, position: [0, 1.7, 5], near: 0.1, far: 600 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
      <Suspense fallback={null}>
        <RegionDetector />
        <AbilityController />
        <WorldWhisperEffect />
        
        {/* Sky / Background */}
        <color attach="background" args={[echoVisionActive ? '#0a1a3a' : '#030310']} />
        <fog attach="fog" args={[echoVisionActive ? '#0f2a5c' : '#050514', 10, echoVisionActive ? 400 : 220]} />

        {/* Ambient — very dim, futuristic dark world */}
        <ambientLight intensity={echoVisionActive ? 1.0 : 0.15} color={echoVisionActive ? "#5a8aee" : "#1a0a3a"} />

        {/* Main directional — purple-tinted moonlight */}
        <directionalLight
          castShadow
          position={[60, 80, -60]}
          intensity={1.2}
          color="#7a3be2"
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={0.5}
          shadow-camera-far={400}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
        />

        {/* Secondary fill — neon cyan rim */}
        <directionalLight position={[-40, 20, 40]} intensity={0.4} color="#00f3ff" />

        {/* Ground bounce — subtle purple */}
        <hemisphereLight args={['#0a0a25', '#000008', 0.3]} />

        {/* Stars */}
        <Stars radius={200} depth={80} count={6000} factor={4} saturation={0} fade speed={0.5} />

        {/* World Components */}
        <Terrain />

        {/* Landmarks */}
        {WORLD_COORDINATES.landmarks.map(landmark => (
          <LandmarkNode key={landmark.id} landmark={landmark} />
        ))}

        {/* Memory Stones */}
        <WorldMemoryStone position={[12, 0, -18]} stoneId="memory_stone_1" />
        <WorldMemoryStone position={[-25, 0, -35]} stoneId="memory_stone_2" />
        <WorldMemoryStone position={[40, 0, 30]} stoneId="memory_stone_3" />

        {/* World Core */}
        <WorldCore position={[-18, 0, -45]} />

        {/* World Forge */}
        <WorldForge position={[-15, 0, -10]} />

        {/* Resources */}
        <ResourceNode id="res_1" itemId="res_lumen_crystal" position={[10, 0, 10]} />
        <ResourceNode id="res_2" itemId="res_lumen_crystal" position={[12, 0, 8]} />
        <ResourceNode id="res_3" itemId="res_lumen_crystal" position={[8, 0, 15]} />
        <ResourceNode id="res_4" itemId="res_ancient_metal" position={[-20, 0, 20]} />
        <ResourceNode id="res_5" itemId="res_ancient_metal" position={[-25, 0, 18]} />
        <ResourceNode id="res_6" itemId="res_echo_shard" position={[30, 0, -30]} />
        <ResourceNode id="res_7" itemId="res_world_essence" position={[0, 0, -50]} />

        {/* Dropped Items */}
        {droppedItems.map(item => (
          <DroppedItem 
            key={item.id}
            id={item.id}
            itemId={item.itemId}
            quantity={item.quantity}
            position={item.position}
            onCollect={() => removeDroppedItem(item.id)}
          />
        ))}

        {/* Global Evolutions */}
        <WorldEvolution />

        {/* The Ancient Device (Player Choice structure) */}
        <AncientDevice position={[-40, 0, -35]} />

        {/* NPCs */}
        <NPCNode npc={NPC_DATA['npc_arin']} />
        <NPCNode npc={NPC_DATA['npc_lyra']} />
        <NPCNode npc={NPC_DATA['npc_kael']} />
        <NPCNode npc={NPC_DATA['npc_sera']} />
        <NPCNode npc={NPC_DATA['npc_orin']} />
        <CoreVoiceNode npc={NPC_DATA['npc_core_voice']} />

        {/* Phase 19 Multiplayer */}
        <RemotePlayersGroup />

        {/* Dynamic Events */}
        {activeEvents.map(eventId => {
          const ev = GAME_EVENTS.find(e => e.id === eventId);
          if (!ev || !ev.location) return null;
          return <DynamicEventZone key={eventId} eventId={eventId} position={ev.location as [number, number, number]} />;
        })}

        {/* Player Controller */}
        <Player />
      </Suspense>
    </Canvas>
    </>
  );
}
