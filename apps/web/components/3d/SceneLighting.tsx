'use client';

import { PALETTE } from '@izhar-os/config';
import { useThemeStore, THEME_PRESETS, DEFAULT_THEME_ID } from '@/lib/store/theme-store';

export function SceneLighting() {
  const themeId = useThemeStore((state) => state.themeId);
  const preset = THEME_PRESETS[themeId] ?? THEME_PRESETS[DEFAULT_THEME_ID]!;

  return (
    <>
      <fog attach="fog" args={[PALETTE.void, 9, 24]} />

      <ambientLight intensity={0.6} color="#dbe6f5" />

      {/* Key: high and to the left, tinted with the dynamic system accent. */}
      <directionalLight position={[-6, 6, 4]} intensity={1.3} color={preset.accent} />

      {/* Rim: low and behind to the right, tinted with secondary ambient tone. */}
      <pointLight position={[6, -3, -4]} intensity={28} distance={22} color={preset.secondary} />

      {/* A dim fill so nothing goes fully black. */}
      <pointLight position={[0, 2, 6]} intensity={12} distance={18} color="#64748b" />
    </>
  );
}
