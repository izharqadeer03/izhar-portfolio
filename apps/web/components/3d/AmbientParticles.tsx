'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import { seededRandom } from '@/lib/utils';

interface AmbientParticlesProps {
  count: number;
}

/**
 * A soft round sprite, drawn once into a 64px canvas.
 * Square points look like dust; round ones look like depth.
 */
function createSpriteTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d');
  if (context) {
    const gradient = context.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.35, 'rgba(255,255,255,0.55)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Atmospheric particulate. Deliberately sparse and slow — this is haze that
 * happens to have structure, not a particle effect.
 *
 * The whole field is animated by rotating a single group, so the per-frame cost
 * is one matrix update regardless of particle count.
 */
export function AmbientParticles({ count }: AmbientParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      array[index * 3] = (seededRandom(index * 2.7) * 2 - 1) * 9;
      array[index * 3 + 1] = (seededRandom(index * 4.1) * 2 - 1) * 5.5;
      array[index * 3 + 2] = (seededRandom(index * 6.9) * 2 - 1) * 7 - 2;
    }
    return array;
  }, [count]);

  const sprite = useMemo(() => createSpriteTexture(), []);
  useEffect(() => () => sprite.dispose(), [sprite]);

  useFrame((state, delta) => {
    const points = pointsRef.current;
    if (!points) return;
    points.rotation.y += delta * 0.016;
    // A barely perceptible tidal drift, so the field never looks frozen.
    points.position.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.14;
  });

  if (count === 0) return null;

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        sizeAttenuation
        map={sprite}
        color="#a9bdd4"
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}
