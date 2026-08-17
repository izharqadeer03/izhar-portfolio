'use client';

import { Float } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

import { useThemeStore, THEME_PRESETS, DEFAULT_THEME_ID } from '@/lib/store/theme-store';

interface WireframeProps {
  geometry: THREE.BufferGeometry;
  color: string;
  opacity: number;
  position: [number, number, number];
  rotation?: [number, number, number];
}

function Wireframe({ geometry, color, opacity, position, rotation }: WireframeProps) {
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry, 18), [geometry]);

  return (
    <lineSegments geometry={edges} position={position} rotation={rotation}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        toneMapped={false}
      />
    </lineSegments>
  );
}

export function FloatingGeometry() {
  const icosahedron = useMemo(() => new THREE.IcosahedronGeometry(1.7, 0), []);
  const octahedron = useMemo(() => new THREE.OctahedronGeometry(0.85, 0), []);

  const themeId = useThemeStore((state) => state.themeId);
  const preset = THEME_PRESETS[themeId] ?? THEME_PRESETS[DEFAULT_THEME_ID]!;

  return (
    <group>
      <Float speed={0.7} rotationIntensity={0.28} floatIntensity={0.5}>
        <Wireframe
          geometry={icosahedron}
          color={preset.accent}
          opacity={0.22}
          position={[-5.1, 1.5, -3.4]}
          rotation={[0.4, 0.6, 0]}
        />
      </Float>

      <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.4}>
        <Wireframe
          geometry={octahedron}
          color="#cbd5e1"
          opacity={0.25}
          position={[4.6, 2.3, -5.2]}
          rotation={[0.2, 0.9, 0.3]}
        />
      </Float>

      {/* A thin ring, read edge-on */}
      <Float speed={0.4} rotationIntensity={0.15} floatIntensity={0.35}>
        <mesh position={[4.9, -1.9, -4.4]} rotation={[1.15, 0.35, 0.2]}>
          <torusGeometry args={[2.4, 0.012, 6, 96]} />
          <meshBasicMaterial
            color={preset.secondary}
            transparent
            opacity={0.4}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </Float>
    </group>
  );
}
