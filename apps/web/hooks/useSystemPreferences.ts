'use client';

import { MOBILE_BREAKPOINT } from '@/lib/constants';
import { useMediaQuery } from '@/hooks/useMediaQuery';

/** True when the visitor has asked the system to reduce motion. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/** True on phone-sized viewports, where the OS switches to its mobile form. */
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
}

/**
 * True when the primary input can hover precisely — the gate for hover states,
 * tooltips, icon dragging, double-click and the custom cursor.
 */
export function useHasFinePointer(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)');
}
