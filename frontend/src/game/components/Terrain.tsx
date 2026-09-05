import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Seeded pseudo-random for stable scene across renders
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// --- Shared Materials (created once) ---
const groundMat = new THREE.MeshStandardMaterial({ color: '#07071a', roughness: 0.95, metalness: 0.1 });
const gridMat = new THREE.MeshBasicMaterial({ color: '#8a2be2', wireframe: true, transparent: true, opacity: 0.07 });
const mountainMat = new THREE.MeshStandardMaterial({ color: '#0d0d22', roughness: 0.9 });
const treeTrunkMat = new THREE.MeshStandardMaterial({ color: '#1a1a3a', roughness: 0.9 });
const treeLeafMat = new THREE.MeshStandardMaterial({ color: '#0a2a1a', emissive: '#003322', emissiveIntensity: 0.3, roughness: 0.8 });
const rockMat = new THREE.MeshStandardMaterial({ color: '#151530', roughness: 0.85, metalness: 0.3 });
const ruinMat = new THREE.MeshStandardMaterial({ color: '#111128', roughness: 0.7, metalness: 0.4 });
const ruinGlowMat = new THREE.MeshStandardMaterial({ color: '#8a2be2', emissive: '#8a2be2', emissiveIntensity: 0.8, roughness: 0.2 });
const waterMat = new THREE.MeshStandardMaterial({ color: '#000d22', emissive: '#001133', emissiveIntensity: 0.4, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.85 });
const roadMat = new THREE.MeshStandardMaterial({ color: '#0c0c20', roughness: 0.6, metalness: 0.5 });
const roadLineMat = new THREE.MeshStandardMaterial({ color: '#00f3ff', emissive: '#00f3ff', emissiveIntensity: 0.6, roughness: 0.3 });
const particleMat = new THREE.MeshBasicMaterial({ color: '#8a2be2', transparent: true, opacity: 0.6 });

// Tree component
function Tree({ x, z, seed }: { x: number; z: number; seed: number }) {
  const height = 4 + seededRandom(seed) * 5;
  const radius = 0.8 + seededRandom(seed + 1) * 0.6;
  return (
    <group position={[x, 0, z]}>
      {/* Trunk */}
      <mesh position={[0, height * 0.3, 0]} material={treeTrunkMat}>
        <cylinderGeometry args={[0.2, 0.3, height * 0.6, 6]} />
      </mesh>
      {/* Canopy layer 1 */}
      <mesh position={[0, height * 0.7, 0]} material={treeLeafMat}>
        <coneGeometry args={[radius, height * 0.6, 7]} />
      </mesh>
      {/* Canopy layer 2 (smaller top) */}
      <mesh position={[0, height * 0.95, 0]} material={treeLeafMat}>
        <coneGeometry args={[radius * 0.6, height * 0.4, 7]} />
      </mesh>
    </group>
  );
}

// Rock cluster component
function Rock({ x, y, z, seed }: { x: number; y: number; z: number; seed: number }) {
  const s = 0.5 + seededRandom(seed) * 1.5;
  const rx = seededRandom(seed + 2) * Math.PI;
  const ry = seededRandom(seed + 3) * Math.PI;
  return (
    <mesh
      position={[x, y + s * 0.4, z]}
      rotation={[rx, ry, 0]}
      material={rockMat}
    >
      <dodecahedronGeometry args={[s, 0]} />
    </mesh>
  );
}

// Ruin building component  
function Ruin({ x, z, seed }: { x: number; z: number; seed: number }) {
  const w = 3 + seededRandom(seed) * 5;
  const h = 4 + seededRandom(seed + 1) * 10;
  const d = 3 + seededRandom(seed + 2) * 4;
  const glowEdge = seededRandom(seed + 3) > 0.5;
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, h / 2, 0]} material={ruinMat}>
        <boxGeometry args={[w, h, d]} />
      </mesh>
      {/* Glowing accent stripe */}
      {glowEdge && (
        <mesh position={[0, h * 0.3, d / 2 + 0.05]} material={ruinGlowMat}>
          <boxGeometry args={[w * 0.8, 0.15, 0.1]} />
        </mesh>
      )}
      {/* Broken top piece */}
      <mesh position={[w * 0.3, h + 1, 0]} rotation={[0.3, 0.2, 0.4]} material={ruinMat}>
        <boxGeometry args={[w * 0.4, h * 0.3, d * 0.4]} />
      </mesh>
    </group>
  );
}

// Atmospheric particle
function FloatingParticle({ x, y, z, seed }: { x: number; y: number; z: number; seed: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const speed = 0.3 + seededRandom(seed) * 0.5;
  const offset = seededRandom(seed + 1) * Math.PI * 2;
  const radius = 0.04 + seededRandom(seed + 2) * 0.06;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = y + Math.sin(state.clock.elapsedTime * speed + offset) * 1.5;
      meshRef.current.material = particleMat;
    }
  });

  return (
    <mesh ref={meshRef} position={[x, y, z]}>
      <sphereGeometry args={[radius, 4, 4]} />
      <primitive object={particleMat} attach="material" />
    </mesh>
  );
}

// Animated water surface
function Water() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.01;
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
  });
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[-40, 0.15, -50]}>
      <planeGeometry args={[60, 40, 8, 8]} />
      <primitive object={waterMat} attach="material" />
    </mesh>
  );
}

export function Terrain() {
  // Generate stable world data using seeded randoms
  const trees = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 60; i++) {
      const angle = seededRandom(i * 7 + 1) * Math.PI * 2;
      const dist = 15 + seededRandom(i * 7 + 2) * 130;
      arr.push({ x: Math.cos(angle) * dist, z: Math.sin(angle) * dist, seed: i * 7 });
    }
    return arr;
  }, []);

  const rocks = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 80; i++) {
      const angle = seededRandom(i * 3 + 5) * Math.PI * 2;
      const dist = 8 + seededRandom(i * 3 + 6) * 100;
      arr.push({ x: Math.cos(angle) * dist, z: Math.sin(angle) * dist, seed: i * 3 });
    }
    return arr;
  }, []);

  const ruins = useMemo(() => {
    const positions = [
      [20, -15], [-25, -20], [35, 25], [-30, 30], [10, 40],
      [-45, -10], [50, -40], [15, -55], [-20, 55], [60, 10],
    ] as [number, number][];
    return positions.map(([x, z], i) => ({ x, z, seed: i * 11 + 13 }));
  }, []);

  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 40; i++) {
      const angle = seededRandom(i * 13) * Math.PI * 2;
      const dist = 5 + seededRandom(i * 13 + 1) * 80;
      arr.push({
        x: Math.cos(angle) * dist,
        y: 2 + seededRandom(i * 13 + 2) * 8,
        z: Math.sin(angle) * dist,
        seed: i * 13,
      });
    }
    return arr;
  }, []);

  return (
    <group>
      {/* === GROUND === */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow material={groundMat}>
        <planeGeometry args={[500, 500]} />
      </mesh>

      {/* Grid overlay — futuristic feel */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} material={gridMat}>
        <planeGeometry args={[500, 500, 80, 80]} />
      </mesh>

      {/* === DISTANT MOUNTAINS (background structures) === */}
      {[...Array(24)].map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const dist = 160 + seededRandom(i * 5) * 80;
        const x = Math.cos(angle) * dist;
        const z = Math.sin(angle) * dist;
        const h = 40 + seededRandom(i * 5 + 1) * 80;
        const w = 20 + seededRandom(i * 5 + 2) * 30;
        return (
          <mesh key={`mtn-${i}`} position={[x, h / 2, z]} material={mountainMat}>
            <boxGeometry args={[w, h, w * 0.8]} />
          </mesh>
        );
      })}

      {/* === TREES === */}
      {trees.map((t, i) => (
        <Tree key={`tree-${i}`} {...t} />
      ))}

      {/* === ROCKS === */}
      {rocks.map((r, i) => (
        <Rock key={`rock-${i}`} {...r} y={0} />
      ))}

      {/* === RUINS === */}
      {ruins.map((r, i) => (
        <Ruin key={`ruin-${i}`} {...r} />
      ))}

      {/* === WATER === */}
      <Water />

      {/* Water glow light */}
      <pointLight position={[-40, 2, -50]} color="#0044ff" intensity={2} distance={40} />

      {/* === ROAD / PATH (leading from spawn area) === */}
      {/* Main road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -20]} material={roadMat}>
        <planeGeometry args={[4, 60]} />
      </mesh>
      {/* Road center line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, -20]} material={roadLineMat}>
        <planeGeometry args={[0.15, 60]} />
      </mesh>
      {/* Branch road */}
      <mesh rotation={[-Math.PI / 2, Math.PI / 2, 0]} position={[20, 0.02, -30]} material={roadMat}>
        <planeGeometry args={[4, 40]} />
      </mesh>

      {/* === FLOATING MONOLITHS === */}
      {[
        { pos: [30, 15, -60] as [number, number, number], rot: [0.3, 0.5, 0.1] as [number, number, number] },
        { pos: [-50, 20, -40] as [number, number, number], rot: [0.1, 1.2, 0.3] as [number, number, number] },
        { pos: [70, 12, 30] as [number, number, number], rot: [0.4, 0.8, 0.2] as [number, number, number] },
        { pos: [-60, 18, 60] as [number, number, number], rot: [0.2, 1.5, 0.4] as [number, number, number] },
      ].map((m, i) => (
        <mesh key={`mono-${i}`} position={m.pos} rotation={m.rot} castShadow>
          <octahedronGeometry args={[4, 0]} />
          <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={0.6} roughness={0.1} metalness={0.9} />
        </mesh>
      ))}

      {/* === SPAWN AREA LANDMARK (near player start) === */}
      {/* Central platform */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[8, 9, 0.2, 32]} />
        <meshStandardMaterial color="#0f0f25" roughness={0.5} metalness={0.6} />
      </mesh>
      {/* Platform ring */}
      <mesh position={[0, 0.21, 0]}>
        <torusGeometry args={[8, 0.1, 8, 64]} />
        <meshStandardMaterial color="#8a2be2" emissive="#8a2be2" emissiveIntensity={1} />
      </mesh>

      {/* === ATMOSPHERIC PARTICLES === */}
      {particles.map((p, i) => (
        <FloatingParticle key={`p-${i}`} {...p} />
      ))}

      {/* === CRATER (visual landmark) === */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[45, 0.02, 45]}>
        <ringGeometry args={[8, 15, 32]} />
        <meshStandardMaterial color="#0a0a1f" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[45, 0.03, 45]}>
        <ringGeometry args={[8, 8.5, 32]} />
        <meshStandardMaterial color="#4a1082" emissive="#4a1082" emissiveIntensity={0.5} />
      </mesh>

      {/* World boundary fog pillars */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 180;
        const z = Math.sin(angle) * 180;
        return (
          <mesh key={`pillar-${i}`} position={[x, 15, z]}>
            <cylinderGeometry args={[2, 3, 30, 8]} />
            <meshStandardMaterial color="#050515" emissive="#8a2be2" emissiveIntensity={0.2} transparent opacity={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}

