import type { EnvironmentId } from '@izhar-os/types';
import type { StaticImageData } from 'next/image';

import macosWallpaper from '@/assets/wallpapers/macos.jpg';
import ubuntuWallpaper from '@/assets/wallpapers/ubuntu.webp';
import windowsWallpaper from '@/assets/wallpapers/windows.jpg';

/**
 * The ground image each environment stands on.
 *
 * A desktop is recognised by its wallpaper before anything else — the taskbar
 * and the dock only confirm what the wallpaper already said. So each
 * environment ships the stock image its real counterpart boots into, and the
 * generated layers that used to carry the whole atmosphere step back to being
 * what they always should have been: light *on* a desktop rather than the
 * desktop itself.
 *
 * These are the vendors' own wallpapers, used to quote the desktops IZHAR OS
 * imitates. They are the only borrowed pixels in the project; everything
 * layered above them is drawn here.
 */
export interface WallpaperSpec {
  /** Statically imported so Next can size, convert and blur-placeholder it. */
  image: StaticImageData;
  /** `object-position`, so the interesting part survives a portrait crop. */
  position: string;
  /**
   * A CSS filter applied to the image itself.
   *
   * Every environment's chrome is dark and its type is light; a stock wallpaper
   * is lit for a desktop that is neither. Pulling brightness and saturation down
   * here rather than piling on more black is what keeps the wallpaper *itself*
   * recognisable — the Big Sur bands stay Big Sur's bands, they simply stop
   * competing with the text standing on them.
   */
  filter: string;
  /**
   * Strength of the darkening scrim above the filtered image, 0..1.
   *
   * The second half of the same job: the filter takes the wallpaper's energy
   * down, this takes its contrast down, and between them the interface has a
   * ground to sit on without the wallpaper turning into a grey rectangle.
   */
  scrim: number;
  /**
   * How much of the drifting light pools survive over the wallpaper, 0..1.
   *
   * At full strength they washed the image out; kept low they still move, so
   * the desktop breathes rather than sitting perfectly still.
   */
  ambient: number;
  /** Multiplier on the engineering grid, so it reads as texture not overlay. */
  grid: number;
}

export const WALLPAPERS: Record<EnvironmentId, WallpaperSpec> = {
  // Windows 10 hero light. Already blue and already dark at the edges; what it
  // needs held back is the blown-out centre the beams converge on.
  windows: {
    image: windowsWallpaper,
    position: '50% 50%',
    filter: 'saturate(0.88) brightness(0.68)',
    scrim: 0.42,
    ambient: 0.3,
    grid: 0.45,
  },
  // Big Sur: the brightest and most saturated of the three, and the only one
  // whose bands run straight through where the identity block stands. It gets
  // the heaviest hand of the three, and still reads as Big Sur.
  macos: {
    image: macosWallpaper,
    position: '50% 45%',
    filter: 'saturate(0.62) brightness(0.5)',
    scrim: 0.5,
    ambient: 0.22,
    grid: 0,
  },
  // Jammy Jellyfish, already aubergine — the palette this environment was
  // tinted toward before it had a wallpaper to be tinted by. The id stays
  // `linux` throughout; only what the visitor reads says Ubuntu.
  linux: {
    image: ubuntuWallpaper,
    position: '50% 50%',
    filter: 'saturate(0.86) brightness(0.66)',
    scrim: 0.44,
    ambient: 0.26,
    grid: 0.5,
  },
};
