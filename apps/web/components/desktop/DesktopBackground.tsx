'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

import { DesktopWallpaper } from '@/components/desktop/DesktopWallpaper';
import { SceneBoundary } from '@/components/system/SceneBoundary';
import { useDeviceCapability } from '@/hooks/useDeviceCapability';
import { useDocumentVisible } from '@/hooks/useDocumentVisibility';
import { useEnvironment, useEnvironmentDefinition } from '@/hooks/useEnvironment';
import { useSystemStore } from '@/lib/store/system-store';
import { useThemeStore, THEME_PRESETS, DEFAULT_THEME_ID } from '@/lib/store/theme-store';
import { getWallpaperSpec, WALLPAPERS } from '@/lib/wallpaper';

// Three.js stays out of the initial bundle entirely — the boot sequence must
// never wait on the environment.
const DesktopScene = dynamic(() => import('@/components/3d/DesktopScene'), {
  ssr: false,
  loading: () => null,
});

/**
 * The desktop environment, in three layers.
 *
 * The wallpaper is the ground — each environment boots into the stock image its
 * real counterpart does, because that is what makes a desktop recognisable from
 * across the table before a single pixel of chrome has been read. The CSS
 * atmosphere sits on it and the WebGL scene composites over both when the
 * machine can afford it; neither is a fallback for the other, and the desktop
 * looks finished whether or not Three.js ever loads.
 *
 * The generated layers are deliberately quieter now than they were when they
 * carried the whole room: their strengths come from the wallpaper spec, tuned
 * per environment so light reads as light falling on the wallpaper rather than
 * as a wash covering it up.
 */
export function DesktopBackground() {
  const { budget, useWebGL } = useDeviceCapability();
  const visible = useDocumentVisible();
  const bootPhase = useSystemStore((state) => state.bootPhase);
  const environmentId = useEnvironment();
  const environment = useEnvironmentDefinition();
  const [sceneFailed, setSceneFailed] = useState(false);

  const themeId = useThemeStore((state) => state.themeId);
  const wallpaperId = useThemeStore((state) => state.wallpaperId);
  const preset = THEME_PRESETS[themeId] ?? THEME_PRESETS[DEFAULT_THEME_ID]!;

  const environmentReady = bootPhase === 'revealing' || bootPhase === 'ready';
  const showScene = useWebGL && environmentReady && !sceneFailed;

  const ambientPrimary = environmentId === 'windows' ? preset.ambientPrimary : environment.ambient.primary;
  const ambientSecondary = environmentId === 'windows' ? preset.ambientSecondary : environment.ambient.secondary;

  const wallpaper =
    environmentId === 'windows'
      ? getWallpaperSpec(wallpaperId, environmentId)
      : WALLPAPERS[environmentId];

  const gridStrength = environment.ambient.grid * wallpaper.grid;

  return (
    <div
      className="os-grain pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Ground colour, behind the wallpaper: what the first frame paints and
          what shows through wherever the image has not arrived yet. */}
      <div className="absolute inset-0 bg-void" />

      <DesktopWallpaper />

      {/* Two pools of light, drifting slowly against each other. */}
      <div
        className="absolute -top-[25%] -left-[15%] size-[70vw] rounded-full blur-[100px] transition-[background,opacity] duration-700 motion-safe:animate-drift"
        style={{
          opacity: wallpaper.ambient,
          background: `radial-gradient(circle, color-mix(in oklab, ${ambientPrimary} 18%, transparent) 0%, transparent 68%)`,
        }}
      />
      <div
        className="absolute -right-[12%] -bottom-[30%] size-[62vw] rounded-full blur-[110px] transition-[background,opacity] duration-700 motion-safe:animate-drift"
        style={{
          opacity: wallpaper.ambient * 0.86,
          background: `radial-gradient(circle, color-mix(in oklab, ${ambientSecondary} 16%, transparent) 0%, transparent 68%)`,
          animationDelay: '-13s',
        }}
      />

      {/* Engineering grid, faded out toward the edges so it has no border.
          macOS sets its strength to zero: an unbroken field is the point. */}
      {gridStrength > 0 ? (
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            opacity: gridStrength,
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.028) 1px, transparent 1px)',
            backgroundSize: '68px 68px',
            maskImage: 'radial-gradient(ellipse 90% 75% at 50% 42%, #000 25%, transparent 78%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 90% 75% at 50% 42%, #000 25%, transparent 78%)',
          }}
        />
      ) : null}

      {/* The WebGL environment. */}
      {showScene ? (
        <SceneBoundary onError={() => setSceneFailed(true)}>
          <DesktopScene budget={budget} paused={!visible} />
        </SceneBoundary>
      ) : null}

      {/* Vignette, above the scene: pulls focus to the centre and keeps the
          chrome sitting on a darker ground. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 120% 100% at 50% 35%, transparent 35%, rgba(5,6,8,0.55) 100%)',
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-void/80 to-transparent" />
    </div>
  );
}
