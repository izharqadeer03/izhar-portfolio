'use client';

import { PALETTE } from '@izhar-os/config';
import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

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
 *
 * Nodes sit on a wide cylindrical band around the origin rather than filling a
 * volume, which leaves the centre of frame empty. That hole is the composition:
 * it is where the desktop's icons, windows and branding live.
 */
function buildLayout(count: number, showConnections: boolean): NodeLayout {
  const positions: THREE.Vector3[] = [];
  const scales: number[] = [];
  const colors: THREE.Color[] = [];

  const accent = new THREE.Color(PALETTE.accent);
  const violet = new THREE.Color(PALETTE.violet);
  const neutral = new THREE.Color('#9fb0c6');

  for (let index = 0; index < count; index += 1) {
    const radius = 3.4 + seededRandom(index * 3.1) * 3.6;
    const theta = seededRandom(index * 7.7) * Math.PI * 2;
    const height = (seededRandom(index * 5.3) * 2 - 1) * 2.8;

    positions.push(
      new THREE.Vector3(Math.cos(theta) * radius, height, Math.sin(theta) * radius * 0.85 - 1.6),
    );

    scales.push(0.055 + seededRandom(index * 11.9) * 0.075);

    // Mostly neutral, with a minority of accented nodes. Restraint is the point.
    const tint = seededRandom(index * 13.3);
    colors.push(tint > 0.86 ? accent : tint > 0.72 ? violet : neutral);
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
  const linkColor = new THREE.Color(PALETTE.accent);

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
 * The constellation of nodes and links — the scene's statement of intent:
 * systems, data, connections. Instanced, so 30-odd nodes cost one draw call.
 */
export function DataNodes({ count, showConnections }: DataNodesProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const layout = useMemo(() => buildLayout(count, showConnections), [count, showConnections]);

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

  // One slow rotation for the whole constellation. No per-node animation:
  // the parallax from the camera rig already supplies the sense of life.
  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    group.rotation.y += delta * 0.012;
  });

  // Geometry and material are shared across instances; dispose is handled by R3F.
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
          roughness={0.35}
          metalness={0.15}
          emissive={PALETTE.accent}
          emissiveIntensity={0.18}
          toneMapped={false}
        />
      </instancedMesh>

      {showConnections && layout.linePositions.length > 0 ? (
        <lineSegments geometry={lineGeometry} frustumCulled={false}>
          <lineBasicMaterial
            vertexColors
            transparent
            opacity={0.34}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </lineSegments>
      ) : null}
    </group>
  );
}
