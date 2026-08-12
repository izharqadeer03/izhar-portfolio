'use client';

import { useEffect, type RefObject } from 'react';

interface DismissOptions {
  enabled: boolean;
  onDismiss: () => void;
  /** Elements that should not count as "outside" — e.g. the button that opened it. */
  ignore?: RefObject<HTMLElement | null>[];
}

/**
 * Closes a transient surface (menu, popover, context menu) on outside pointer
 * press, Escape, or a viewport resize. Every dismissible surface in the OS uses
 * this so the behaviour is identical everywhere.
 */
export function useDismiss(
  ref: RefObject<HTMLElement | null>,
  { enabled, onDismiss, ignore = [] }: DismissOptions,
): void {
  useEffect(() => {
    if (!enabled) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (ref.current?.contains(target)) return;
      if (ignore.some((candidate) => candidate.current?.contains(target))) return;
      onDismiss();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onDismiss();
      }
    };

    // `capture` so a menu closes before the click activates something beneath it.
    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', onDismiss);
    window.addEventListener('blur', onDismiss);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', onDismiss);
      window.removeEventListener('blur', onDismiss);
    };
    // `ignore` is a stable-by-convention array of refs; spreading it into the
    // dependency list would re-subscribe on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, onDismiss, ref]);
}
