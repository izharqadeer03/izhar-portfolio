'use client';

import { useFrame } from '@react-three/fiber';

import { pointerSignal } from '@/lib/pointer';
import { damp } from '@/lib/utils';

/** How far the camera may travel from centre, in world units. */
const REACH_X = 0.9;
const REACH_Y = 0.55;
/** Higher damps faster. Low enough that the scene trails the cursor, never tracks it. */
const RESPONSIVENESS = 2.1;

/**
 * Camera parallax.
 *
 * The camera translates a little with the cursor and always looks at the same
 * point, which produces depth rather than rotation — you notice the layers
 * separating, not the scene moving. A slow autonomous drift keeps the
 * environment alive on touch devices and when the cursor is still.
 */
export function CameraRig() {
  useFrame((state, rawDelta) => {
    // Clamp delta so returning from a background tab doesn't snap the camera.
    const delta = Math.min(rawDelta, 0.05);
    const time = state.clock.elapsedTime;

    const driftX = Math.sin(time * 0.08) * 0.26;
    const driftY = Math.cos(time * 0.061) * 0.17;

    const targetX = pointerSignal.x * REACH_X + driftX;
    const targetY = -pointerSignal.y * REACH_Y + driftY;

    state.camera.position.x = damp(state.camera.position.x, targetX, RESPONSIVENESS, delta);
    state.camera.position.y = damp(state.camera.position.y, targetY, RESPONSIVENESS, delta);
    state.camera.lookAt(0, 0, -1.5);
  });

  return null;
}
