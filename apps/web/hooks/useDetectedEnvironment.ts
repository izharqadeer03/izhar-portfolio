'use client';

import type { EnvironmentId } from '@izhar-os/types';
import { useSyncExternalStore } from 'react';

import { detectEnvironment } from '@/lib/platform';

/** The platform never changes mid-visit, so it is read once and kept. */
let cached: EnvironmentId | null | undefined;

function readDetected(): EnvironmentId | null {
  cached ??= detectEnvironment();
  return cached;
}

/** Nothing to subscribe to — the value is fixed for the life of the page. */
function subscribe(): () => void {
  return () => {};
}

/**
 * The visitor's own platform, or `null` when it isn't one of the three.
 *
 * Same shape as `useMediaQuery`, and for the same reason: the server snapshot is
 * `null`, so the first client paint matches the markup and the real answer lands
 * with hydration. Until then the question is simply asked without a suggestion —
 * which is also the permanent answer on a phone, where none of the three
 * desktops is the machine the visitor is holding.
 */
export function useDetectedEnvironment(): EnvironmentId | null {
  return useSyncExternalStore(subscribe, readDetected, () => null);
}
