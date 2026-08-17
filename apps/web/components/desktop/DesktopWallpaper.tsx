'use client';

import Image from 'next/image';
import { useEffect } from 'react';

import { useEnvironment } from '@/hooks/useEnvironment';
import { useThemeStore } from '@/lib/store/theme-store';
import { getWallpaperSpec, WALLPAPERS } from '@/lib/wallpaper';

export function DesktopWallpaper() {
  const environment = useEnvironment();
  const wallpaperId = useThemeStore((state) => state.wallpaperId);
  const hydrate = useThemeStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // For Windows, use the theme-chosen wallpaper; for mac/linux, use default unless specified
  const wallpaper =
    environment === 'windows'
      ? getWallpaperSpec(wallpaperId, environment)
      : WALLPAPERS[environment];

  return (
    <>
      <Image
        key={wallpaper.id}
        src={wallpaper.image}
        alt=""
        fill
        priority
        // One image, always full-bleed: no layout to guess at.
        sizes="100vw"
        placeholder="blur"
        className="object-cover transition-[filter,opacity] duration-700"
        style={{ objectPosition: wallpaper.position, filter: wallpaper.filter }}
      />

      {/* Scrim with central legibility wash for crystal-clear text contrast */}
      <div
        className="absolute inset-0 transition-opacity duration-700 pointer-events-none"
        style={{
          opacity: wallpaper.scrim,
          background:
            'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(5,6,8,0.55) 0%, rgba(5,6,8,0.85) 100%), linear-gradient(to bottom, rgba(5,6,8,0.8) 0%, rgba(5,6,8,0.5) 45%, rgba(5,6,8,0.92) 100%)',
        }}
      />
    </>
  );
}
