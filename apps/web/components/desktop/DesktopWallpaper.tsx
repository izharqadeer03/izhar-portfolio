'use client';

import Image from 'next/image';

import { useEnvironment } from '@/hooks/useEnvironment';
import { WALLPAPERS } from '@/lib/wallpaper';

/**
 * The desktop's ground image.
 *
 * Rendered through `next/image` from a static import, which is what buys the
 * three things a wallpaper needs and a raw `background-image` cannot give it:
 * a responsive `srcset` so a phone never downloads the 4K plate, automatic
 * AVIF/WebP conversion, and a build-time blur placeholder so the first paint is
 * the wallpaper's own colour instead of a flash of void.
 *
 * It mounts before the boot screen lifts — the fetch happens behind the boot
 * sequence, so the desktop is already wearing its wallpaper the moment it is
 * revealed.
 */
export function DesktopWallpaper() {
  const environment = useEnvironment();
  const wallpaper = WALLPAPERS[environment];

  return (
    <>
      <Image
        src={wallpaper.image}
        alt=""
        fill
        priority
        // One image, always full-bleed: no layout to guess at.
        sizes="100vw"
        placeholder="blur"
        className="object-cover transition-[filter] duration-700"
        style={{ objectPosition: wallpaper.position, filter: wallpaper.filter }}
      />

      {/* Scrim, over the already-filtered image. Weighted to both ends — the top
          carries the menu bar and the bottom the taskbar or dock — and kept
          nearly as strong through the middle, because the middle is where the
          identity block stands and a wallpaper band running under a line of
          type is exactly where legibility is lost. */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: wallpaper.scrim,
          background:
            'linear-gradient(to bottom, rgba(5,6,8,0.8) 0%, rgba(5,6,8,0.66) 45%, rgba(5,6,8,0.92) 100%)',
        }}
      />
    </>
  );
}
