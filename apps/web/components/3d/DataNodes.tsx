'use client';

import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import { useThemeStore, THEME_PRESETS, DEFAULT_THEME_ID } from '@/lib/store/theme-store';
import { seededRandom } from '@/lib/utils';

interface DataNodesProps {
  count: number;
  showConnections: boolean;
}

interface NodeLayout {
  positions: THREE.Vector3[];
  scales: number[];
  colors: THREE.Color[];
  /** Flat [x,y,z, x,y,z, ...] pairs for the connection line segments. */
  linePositions: Float32Array;
  lineColors: Float32Array;
}

/** Maximum links per node — the constellation should read as sparse, not woven. */
const MAX_LINKS_PER_NODE = 2;
const LINK_DISTANCE = 3.1;

/**
 * Builds the constellation once, deterministically.
 */
function buildLayout(
  count: number,
  showConnections: boolean,
  accentHex: string,
  secondaryHex: string,
): NodeLayout {
  const positions: THREE.Vector3[] = [];
  const scales: number[] = [];
  const colors: THREE.Color[] = [];

  const accent = new THREE.Color(accentHex);
  const secondary = new THREE.Color(secondaryHex);
  const neutral = new THREE.Color('#d1dbe8');

  for (let index = 0; index < count; index += 1) {
    const radius = 3.4 + seededRandom(index * 3.1) * 3.6;
    const theta = seededRandom(index * 7.7) * Math.PI * 2;
    const height = (seededRandom(index * 5.3) * 2 - 1) * 2.8;

    positions.push(
      new THREE.Vector3(Math.cos(theta) * radius, height, Math.sin(theta) * radius * 0.85 - 1.6),
    );

    scales.push(0.06 + seededRandom(index * 11.9) * 0.08);

    // Mostly neutral, with a minority of accented nodes.
    const tint = seededRandom(index * 13.3);
    colors.push(tint > 0.84 ? accent : tint > 0.68 ? secondary : neutral);
  }

  if (!showConnections) {
    return {
      positions,
      scales,
      colors,
      linePositions: new Float32Array(0),
      lineColors: new Float32Array(0),
    };
  }

  const linkCounts = new Array<number>(count).fill(0);
  const segments: number[] = [];
  const segmentColors: number[] = [];
  const linkColor = new THREE.Color(accentHex);

  for (let a = 0; a < count; a += 1) {
    for (let b = a + 1; b < count; b += 1) {
      if ((linkCounts[a] ?? 0) >= MAX_LINKS_PER_NODE) break;
      if ((linkCounts[b] ?? 0) >= MAX_LINKS_PER_NODE) continue;

      const from = positions[a]!;
      const to = positions[b]!;
      const distance = from.distanceTo(to);
      if (distance > LINK_DISTANCE) continue;

      // Longer links fade out, so the mesh reads as depth rather than a net.
      const strength = 1 - distance / LINK_DISTANCE;

      segments.push(from.x, from.y, from.z, to.x, to.y, to.z);
      for (let end = 0; end < 2; end += 1) {
        segmentColors.push(linkColor.r * strength, linkColor.g * strength, linkColor.b * strength);
      }

      linkCounts[a] = (linkCounts[a] ?? 0) + 1;
      linkCounts[b] = (linkCounts[b] ?? 0) + 1;
    }
  }

  return {
    positions,
    scales,
    colors,
    linePositions: new Float32Array(segments),
    lineColors: new Float32Array(segmentColors),
  };
}

/**
 * The constellation of nodes and links.
 */
export function DataNodes({ count, showConnections }: DataNodesProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const themeId = useThemeStore((state) => state.themeId);
  const preset = THEME_PRESETS[themeId] ?? THEME_PRESETS[DEFAULT_THEME_ID]!;

  const layout = useMemo(
    () => buildLayout(count, showConnections, preset.accent, preset.secondary),
    [count, showConnections, preset.accent, preset.secondary],
  );

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(layout.linePositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(layout.lineColors, 3));
    return geometry;
  }, [layout]);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const matrix = new THREE.Matrix4();
    layout.positions.forEach((position, index) => {
      const scale = layout.scales[index] ?? 0.07;
      matrix.makeScale(scale, scale, scale);
      matrix.setPosition(position);
      mesh.setMatrixAt(index, matrix);
      mesh.setColorAt(index, layout.colors[index] ?? new THREE.Color('#ffffff'));
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [layout]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    group.rotation.y += delta * 0.012;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, count]}
        frustumCulled={false}
        renderOrder={1}
      >
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          roughness={0.25}
          metalness={0.2}
          emissive={preset.accent}
          emissiveIntensity={0.25}
          toneMapped={false}
        />
      </instancedMesh>

      {showConnections && layout.linePositions.length > 0 ? (
        <lineSegments geometry={lineGeometry} frustumCulled={false}>
          <lineBasicMaterial
            vertexColors
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </lineSegments>
      ) : null}
    </group>
  );
}
