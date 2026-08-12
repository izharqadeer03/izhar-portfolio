'use client';

import { PALETTE } from '@izhar-os/config';

/**
 * Lighting for the environment: one cool key, one violet rim, and enough
 * ambient to keep the node facets readable. Fog does the heavy lifting for
 * depth — anything past the mid layer dissolves into the background colour,
 * which is what stops the scene from reading as a box of floating objects.
 */
export function SceneLighting() {
  return (
    <>
      <fog attach="fog" args={[PALETTE.void, 9, 24]} />

      <ambientLight intensity={0.55} color="#c8d4e4" />

      {/* Key: high and to the left, tinted with the system accent. */}
      <directionalLight position={[-6, 6, 4]} intensity={1.15} color={PALETTE.accent} />

      {/* Rim: low and behind to the right, violet, to separate node silhouettes. */}
      <pointLight position={[6, -3, -4]} intensity={26} distance={22} color={PALETTE.violet} />

      {/* A dim fill so nothing goes fully black. */}
      <pointLight position={[0, 2, 6]} intensity={10} distance={18} color="#5f7086" />
    </>
  );
}
