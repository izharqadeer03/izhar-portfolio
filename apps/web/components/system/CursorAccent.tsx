'use client';

import { useEffect, useRef } from 'react';

import { useHasFinePointer, usePrefersReducedMotion } from '@/hooks/useSystemPreferences';
import { pointerSignal } from '@/lib/pointer';
import { damp } from '@/lib/utils';

/**
 * A soft accent that trails the cursor.
 *
 * Deliberately *not* a cursor replacement. Hiding the native cursor would cost
 * the resize handles their directional arrows and text fields their I-beam —
 * real affordances traded for a decoration. This adds a light source instead,
 * so the environment feels responsive while every native cue survives.
 *
 * Disabled on touch and under reduced motion.
 */
export function CursorAccent() {
  const hasFinePointer = useHasFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  const nodeRef = useRef<HTMLDivElement>(null);

  const enabled = hasFinePointer && !reducedMotion;

  useEffect(() => {
    if (!enabled) return;

    const node = nodeRef.current;
    if (!node) return;

    let x = pointerSignal.clientX;
    let y = pointerSignal.clientY;
    let last = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;

      // Trails behind the pointer — the lag is the whole effect.
      x = damp(x, pointerSignal.clientX, 9, delta);
      y = damp(y, pointerSignal.clientY, 9, delta);

      node.style.transform = `translate3d(${x - 90}px, ${y - 90}px, 0)`;
      node.style.opacity = pointerSignal.active ? '1' : '0';

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={nodeRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-10 size-[180px] opacity-0 transition-opacity duration-500 will-change-transform"
      style={{
        background:
          'radial-gradient(circle, color-mix(in oklab, var(--color-accent) 7%, transparent) 0%, transparent 62%)',
      }}
    />
  );
}
