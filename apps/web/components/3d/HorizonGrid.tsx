'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * A ground plane of hairlines, far below the camera and swallowed by fog before
 * it reaches the horizon.
 *
 * This is the cheapest depth cue in the scene — a single LineSegments draw —
 * and the one that most reliably reads as "technical space" rather than "stars".
 */
export function HorizonGrid() {
  const geometry = useMemo(() => {
    const divisions = 22;
    const size = 34;
    const step = size / divisions;
    const half = size / 2;

    const positions: number[] = [];
    const colors: number[] = [];
    const color = new THREE.Color('#5f7791');

    for (let index = 0; index <= divisions; index += 1) {
      const offset = -half + index * step;

      positions.push(-half, 0, offset, half, 0, offset);
      positions.push(offset, 0, -half, offset, 0, half);

      // Lines fade toward the outside so the grid has no visible border.
      const falloff = 1 - Math.abs(offset) / half;
      const intensity = Math.max(0, falloff) ** 1.6;

      for (let vertex = 0; vertex < 4; vertex += 1) {
        colors.push(color.r * intensity, color.g * intensity, color.b * intensity);
      }
    }

    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    buffer.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return buffer;
  }, []);

  return (
    <lineSegments geometry={geometry} position={[0, -4.6, -4]}>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0.22}
        depthWrite={false}
        toneMapped={false}
      />
    </lineSegments>
  );
}
