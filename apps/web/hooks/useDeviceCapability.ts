'use client';

import { SCENE_BUDGETS } from '@izhar-os/config';
import type { RenderTier, SceneBudget } from '@izhar-os/types';
import { useSyncExternalStore } from 'react';

import { MOBILE_BREAKPOINT } from '@/lib/constants';

interface NavigatorWithHints extends Navigator {
  /** Chromium-only hint, in GB. Absent elsewhere. */
  deviceMemory?: number;
}

let webglSupport: boolean | null = null;

/** One-time, cached WebGL probe. A failure here means the CSS environment ships. */
function supportsWebGL(): boolean {
  if (webglSupport !== null) return webglSupport;

  try {
    const canvas = document.createElement('canvas');
    const context =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl');
    webglSupport = Boolean(context);
  } catch {
    webglSupport = false;
  }

  return webglSupport;
}

/**
 * Resolves how much environment this device should render.
 *
 * The point is not to detect a device — it is to spend a budget. A weak machine
 * gets a genuinely lighter scene rather than the same scene at 20fps, and a
 * machine that cannot render WebGL at all still gets a complete desktop.
 */
function resolveTier(): RenderTier {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'minimal';
  if (!supportsWebGL()) return 'minimal';

  const navigatorWithHints = navigator as NavigatorWithHints;
  const cores = navigatorWithHints.hardwareConcurrency ?? 4;
  const memory = navigatorWithHints.deviceMemory ?? 8;
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  const isNarrow = window.innerWidth < MOBILE_BREAKPOINT;

  if (cores <= 2 || memory <= 2) return 'minimal';
  if (isCoarse || isNarrow || cores <= 4 || memory <= 4) return 'balanced';

  return 'high';
}

/**
 * The capability probe is an external system too — it reads the platform, not
 * React state. Modelling it as a store keeps the result shared across every
 * consumer and re-resolves it if the visitor flips reduced motion mid-session.
 */
let tier: RenderTier | null = null;

function subscribe(onStoreChange: () => void): () => void {
  tier ??= resolveTier();

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handleChange = () => {
    tier = resolveTier();
    onStoreChange();
  };

  motionQuery.addEventListener('change', handleChange);
  return () => motionQuery.removeEventListener('change', handleChange);
}

/** Null until the first client subscription, so nothing renders on a guess. */
function getSnapshot(): RenderTier | null {
  return tier;
}

function getServerSnapshot(): RenderTier | null {
  return null;
}

export interface DeviceCapability {
  budget: SceneBudget;
  /** False until the probe has run. */
  resolved: boolean;
  /** Whether the WebGL environment should mount at all. */
  useWebGL: boolean;
}

export function useDeviceCapability(): DeviceCapability {
  const resolvedTier = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    budget: SCENE_BUDGETS[resolvedTier ?? 'minimal'],
    resolved: resolvedTier !== null,
    useWebGL: resolvedTier !== null && resolvedTier !== 'minimal',
  };
}
