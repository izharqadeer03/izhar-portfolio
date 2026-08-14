'use client';

import { useSyncExternalStore } from 'react';

function subscribe(onChange: () => void) {
  window.addEventListener('resize', onChange);
  return () => window.removeEventListener('resize', onChange);
}

/**
 * Viewport height in pixels, without a hydration mismatch.
 *
 * Anything measuring the viewport during render has to answer for what the
 * server rendered, which measured nothing. The server snapshot is a nominal
 * laptop height — the same one the window manager falls back to — so the first
 * client paint matches the markup and the real height lands in the render
 * immediately after hydration, exactly as `useMediaQuery` does for queries.
 */
export function useViewportHeight(fallback = 848): number {
  return useSyncExternalStore(
    subscribe,
    () => window.innerHeight,
    () => fallback,
  );
}
