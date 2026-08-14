'use client';

import type { SceneBudget } from '@izhar-os/types';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

import { AmbientParticles } from '@/components/3d/AmbientParticles';
import { CameraRig } from '@/components/3d/CameraRig';
import { DataNodes } from '@/components/3d/DataNodes';
import { FloatingGeometry } from '@/components/3d/FloatingGeometry';
import { HorizonGrid } from '@/components/3d/HorizonGrid';
import { SceneLighting } from '@/components/3d/SceneLighting';
import { filterUpstreamThreeWarnings } from '@/lib/three-console';

// At import rather than in an effect: fiber builds the clock the deprecation
// warning comes from while the Canvas below is mounting, which is already too
// late for anything that runs after the first render.
filterUpstreamThreeWarnings();

interface DesktopSceneProps {
  budget: SceneBudget;
  /** When true the render loop stops completely — no frames, no cost. */
  paused: boolean;
}

/**
 * The desktop environment.
 *
 * Composed in four depth layers — grid, structure, constellation, haze — with
 * the centre of frame deliberately left empty for the interface that sits on
 * top of it. Loaded through a dynamic import, so none of Three.js is in the
 * initial bundle and the boot sequence never waits on it.
 */
export default function DesktopScene({ budget, paused }: DesktopSceneProps) {
  return (
    <Canvas
      dpr={[1, budget.maxPixelRatio]}
      camera={{ position: [0, 0, 9], fov: 42, near: 0.1, far: 40 }}
      gl={{
        antialias: budget.tier === 'high',
        alpha: true,
        powerPreference: 'high-performance',
        // The desktop composites over the CSS environment beneath it.
        premultipliedAlpha: false,
      }}
      // Tab hidden, reduced motion, or nothing to draw: the loop simply stops.
      frameloop={paused ? 'never' : 'always'}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <SceneLighting />

      <Suspense fallback={null}>
        <HorizonGrid />
        {budget.enableFloatingGeometry ? <FloatingGeometry /> : null}
        <DataNodes count={budget.nodeCount} showConnections={budget.enableConnections} />
        <AmbientParticles count={budget.particleCount} />
      </Suspense>

      <CameraRig />
    </Canvas>
  );
}
