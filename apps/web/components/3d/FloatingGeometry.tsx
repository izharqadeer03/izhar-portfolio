'use client';

import { PALETTE } from '@izhar-os/config';
import { Float } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

interface WireframeProps {
  geometry: THREE.BufferGeometry;
  color: string;
  opacity: number;
  position: [number, number, number];
  rotation?: [number, number, number];
}

/**
 * Edge-only rendering rather than `wireframe: true` — showing the triangulation
 * of a sphere looks like a debug view, showing its edges looks like a drawing.
 */
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

/**
 * The structural layer: three quiet forms placed off-centre, drifting.
 *
 * They carry the "engineering" half of the scene's vocabulary — precise,
 * constructed shapes — without ever becoming a spinning-logo centrepiece.
 */
export function FloatingGeometry() {
  const icosahedron = useMemo(() => new THREE.IcosahedronGeometry(1.7, 0), []);
  const octahedron = useMemo(() => new THREE.OctahedronGeometry(0.85, 0), []);

  return (
    <group>
      <Float speed={0.7} rotationIntensity={0.28} floatIntensity={0.5}>
        <Wireframe
          geometry={icosahedron}
          color={PALETTE.accent}
          opacity={0.16}
          position={[-5.1, 1.5, -3.4]}
          rotation={[0.4, 0.6, 0]}
        />
      </Float>

      <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.4}>
        <Wireframe
          geometry={octahedron}
          color="#9fb0c6"
          opacity={0.2}
          position={[4.6, 2.3, -5.2]}
          rotation={[0.2, 0.9, 0.3]}
        />
      </Float>

      {/* A thin ring, read edge-on. The one solid form in the scene. */}
      <Float speed={0.4} rotationIntensity={0.15} floatIntensity={0.35}>
        <mesh position={[4.9, -1.9, -4.4]} rotation={[1.15, 0.35, 0.2]}>
          <torusGeometry args={[2.4, 0.012, 6, 96]} />
          <meshBasicMaterial
            color={PALETTE.violet}
            transparent
            opacity={0.35}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </Float>
    </group>
  );
}
