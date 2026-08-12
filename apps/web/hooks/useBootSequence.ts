'use client';

import { BOOT_TIMELINE } from '@izhar-os/config';
import type { BootPhase } from '@izhar-os/types';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useSystemStore } from '@/lib/store/system-store';
import { usePrefersReducedMotion } from '@/hooks/useSystemPreferences';

/** Lines shown while the workspace initializes. Deliberately few, and honest. */
export const BOOT_LINES = [
  'Initializing interface',
  'Loading workspace',
  'Mounting applications',
  'Calibrating environment',
] as const;

export interface BootState {
  phase: BootPhase;
  /** 0..1, drives both the bar and the numeric readout. */
  progress: number;
  identityVisible: boolean;
  statusVisible: boolean;
  activeLine: number;
  systemReady: boolean;
  reducedMotion: boolean;
  /** Jump to the end of the sequence. Bound to any key or click. */
  skip: () => void;
}

/**
 * Drives the boot sequence from a single animation frame loop.
 *
 * Everything derives from one elapsed value, which means skipping is just a
 * clock adjustment and reduced motion is just a scale factor — there is no
 * second code path to keep in sync.
 */
export function useBootSequence(): BootState {
  const phase = useSystemStore((state) => state.bootPhase);
  const setBootPhase = useSystemStore((state) => state.setBootPhase);
  const reducedMotion = usePrefersReducedMotion();

  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  // Reduced motion keeps every beat of the sequence, just compressed hard.
  const scale = reducedMotion ? BOOT_TIMELINE.reducedTotal / BOOT_TIMELINE.reveal : 1;
  const revealAt = BOOT_TIMELINE.reveal * scale;

  const skip = useCallback(() => {
    if (startRef.current === null) return;
    const now = performance.now();
    // Rewind the start time so the very next frame lands past the reveal mark.
    if (now - startRef.current < revealAt) startRef.current = now - revealAt;
  }, [revealAt]);

  useEffect(() => {
    setBootPhase('booting');

    const tick = (now: number) => {
      startRef.current ??= now;
      const value = now - startRef.current;
      setElapsed(value);

      if (value < revealAt + 420) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      startRef.current = null;
    };
  }, [revealAt, setBootPhase]);

  // Phase transitions are derived from elapsed rather than scheduled separately,
  // so a skip cannot leave the two out of step.
  useEffect(() => {
    if (elapsed >= revealAt + 400) {
      setBootPhase('ready');
    } else if (elapsed >= revealAt) {
      setBootPhase('revealing');
    }
  }, [elapsed, revealAt, setBootPhase]);

  // Any input skips ahead — a returning visitor should never wait twice.
  useEffect(() => {
    if (phase === 'ready') return;

    const handleKey = (event: KeyboardEvent) => {
      // Let assistive shortcuts through; anything else skips.
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      skip();
    };

    window.addEventListener('keydown', handleKey);
    window.addEventListener('pointerdown', skip);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('pointerdown', skip);
    };
  }, [phase, skip]);

  const progress = Math.min(
    1,
    Math.max(
      0,
      (elapsed - BOOT_TIMELINE.status * scale) / (BOOT_TIMELINE.progressDuration * scale),
    ),
  );

  return {
    phase,
    progress,
    identityVisible: elapsed >= BOOT_TIMELINE.identity * scale,
    statusVisible: elapsed >= BOOT_TIMELINE.status * scale,
    activeLine: Math.min(BOOT_LINES.length - 1, Math.floor(progress * BOOT_LINES.length)),
    systemReady: elapsed >= BOOT_TIMELINE.ready * scale,
    reducedMotion,
    skip,
  };
}
