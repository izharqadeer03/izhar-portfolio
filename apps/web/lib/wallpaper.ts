import type { EnvironmentId } from '@izhar-os/types';
import type { StaticImageData } from 'next/image';

import macosWallpaper from '@/assets/wallpapers/macos.jpg';
import ubuntuWallpaper from '@/assets/wallpapers/ubuntu.webp';
import windowsWallpaper from '@/assets/wallpapers/windows.jpg';
import windows10Wallpaper from '@/assets/wallpapers/windows1.jpg';
import windowsOrangeWallpaper from '@/assets/wallpapers/windows_orange.jpg';

export interface WallpaperSpec {
  id: string;
  name: string;
  image: StaticImageData;
  position: string;
  filter: string;
  scrim: number;
  ambient: number;
  grid: number;
}

export const WALLPAPER_CATALOG: Record<string, WallpaperSpec> = {
  windows_orange: {
    id: 'windows_orange',
    name: 'Windows 11 Orange Flow',
    image: windowsOrangeWallpaper,
    position: '50% 50%',
    filter: 'saturate(1.05) brightness(0.72)',
    scrim: 0.38,
    ambient: 0.35,
    grid: 0.45,
  },
  windows: {
    id: 'windows',
    name: 'Windows 11 Bloom Dark',
    image: windowsWallpaper,
    position: '50% 50%',
    filter: 'saturate(0.88) brightness(0.68)',
    scrim: 0.44,
    ambient: 0.3,
    grid: 0.45,
  },
  windows1: {
    id: 'windows1',
    name: 'Windows 10 Hero',
    image: windows10Wallpaper,
    position: '50% 50%',
    filter: 'saturate(0.9) brightness(0.65)',
    scrim: 0.42,
    ambient: 0.28,
    grid: 0.45,
  },
  macos: {
    id: 'macos',
    name: 'macOS Big Sur',
    image: macosWallpaper,
    position: '50% 45%',
    filter: 'saturate(0.65) brightness(0.52)',
    scrim: 0.5,
    ambient: 0.22,
    grid: 0,
  },
  linux: {
    id: 'linux',
    name: 'Ubuntu Jammy Jellyfish',
    image: ubuntuWallpaper,
    position: '50% 50%',
    filter: 'saturate(0.86) brightness(0.66)',
    scrim: 0.44,
    ambient: 0.26,
    grid: 0.5,
  },
};

export const WALLPAPERS: Record<EnvironmentId, WallpaperSpec> = {
  windows: WALLPAPER_CATALOG.windows!,
  macos: WALLPAPER_CATALOG.macos!,
  linux: WALLPAPER_CATALOG.linux!,
};

export function getWallpaperSpec(wallpaperId?: string, environment?: EnvironmentId): WallpaperSpec {
  if (wallpaperId && WALLPAPER_CATALOG[wallpaperId]) {
    return WALLPAPER_CATALOG[wallpaperId]!;
  }
  if (environment && WALLPAPERS[environment]) {
    return WALLPAPERS[environment]!;
  }
  return WALLPAPER_CATALOG.windows!;
}
