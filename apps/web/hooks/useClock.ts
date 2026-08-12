'use client';

import { useSyncExternalStore } from 'react';

export interface ClockReading {
  /** e.g. "16:42" — locale-aware, 24h or 12h per the visitor's settings. */
  time: string;
  /** e.g. "Mon 11 Aug" */
  date: string;
  /** ISO string for <time dateTime>. */
  iso: string;
}

const TIME_FORMAT: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
};

function read(): ClockReading {
  const now = new Date();
  return {
    time: now.toLocaleTimeString([], TIME_FORMAT),
    date: now.toLocaleDateString([], DATE_FORMAT),
    iso: now.toISOString(),
  };
}

/**
 * The clock is an external system, so it is modelled as one: a single timer
 * shared by every subscriber, aligned to the minute boundary because the
 * display only shows minutes. One timer serves the taskbar and the mobile
 * status bar alike, and it stops entirely when nothing is watching.
 */
const listeners = new Set<() => void>();
let snapshot: ClockReading | null = null;
let timeoutId: number | undefined;

function scheduleTick() {
  const now = new Date();
  // +20ms guard so the timer never fires a hair before the minute rolls over.
  const delay = (60 - now.getSeconds()) * 1000 - now.getMilliseconds() + 20;

  timeoutId = window.setTimeout(() => {
    snapshot = read();
    for (const listener of listeners) listener();
    scheduleTick();
  }, delay);
}

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);

  if (listeners.size === 1) {
    snapshot = read();
    scheduleTick();
  }

  return () => {
    listeners.delete(onStoreChange);
    if (listeners.size === 0) {
      window.clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };
}

/** Null until the first client subscription, so SSR and hydration agree. */
function getSnapshot(): ClockReading | null {
  return snapshot;
}

function getServerSnapshot(): ClockReading | null {
  return null;
}

export function useClock(): ClockReading | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
