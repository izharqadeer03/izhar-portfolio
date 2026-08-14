'use client';

import { useEffect, useState, type RefObject } from 'react';

/**
 * Whether an element is narrower than a breakpoint.
 *
 * Windows are resized independently of the viewport, so an application's
 * layout has to answer to its *own* width — a media query would tell it about
 * a screen it does not occupy. State flips only when the threshold is crossed,
 * so dragging a window's edge does not re-render the application on every
 * frame.
 */
export function useIsNarrow(ref: RefObject<HTMLElement | null>, maxWidth: number): boolean {
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      setNarrow((current) => {
        const next = width < maxWidth;
        return current === next ? current : next;
      });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, maxWidth]);

  return narrow;
}
