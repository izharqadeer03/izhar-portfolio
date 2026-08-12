'use client';

import { getApplication } from '@izhar-os/config';
import type { ApplicationDefinition, ApplicationId, WindowInstance } from '@izhar-os/types';
import { useMemo } from 'react';

import { useEnvironment } from '@/hooks/useEnvironment';
import { ENVIRONMENT_PINS } from '@/lib/environment';
import { useWindowStore } from '@/lib/store/window-store';

export interface ShellItem {
  application: ApplicationDefinition;
  /** The open window for this application, if it has one. */
  instance: WindowInstance | undefined;
  isRunning: boolean;
  isActive: boolean;
  isMinimized: boolean;
  isPinned: boolean;
}

/**
 * What a taskbar or dock should show: the environment's pinned applications,
 * plus anything else the visitor has opened, in a stable order.
 *
 * Pins come first in their configured order and never move; running-but-not-
 * pinned applications are appended in launch order. Buttons that reshuffle when
 * you click them are the fastest way to make a taskbar feel untrustworthy, and
 * that is as true of a dock as it is of a taskbar.
 */
export function useShellItems(): ShellItem[] {
  const environment = useEnvironment();
  // Insertion order is launch order — see the note in the window store.
  const windows = useWindowStore((state) => state.windows);
  const focusedId = useWindowStore((state) => state.focusedId);

  return useMemo(() => {
    const pins = ENVIRONMENT_PINS[environment];
    const byApplication = new Map<ApplicationId, WindowInstance>();
    for (const instance of windows) byApplication.set(instance.applicationId, instance);

    const order: ApplicationId[] = [...pins];
    for (const instance of windows) {
      if (!order.includes(instance.applicationId)) order.push(instance.applicationId);
    }

    const items: ShellItem[] = [];
    for (const id of order) {
      const application = getApplication(id);
      if (!application) continue;

      const instance = byApplication.get(id);
      items.push({
        application,
        instance,
        isRunning: instance !== undefined,
        isActive: instance !== undefined && instance.id === focusedId && !instance.isMinimized,
        isMinimized: instance?.isMinimized ?? false,
        isPinned: pins.includes(id),
      });
    }

    return items;
  }, [environment, focusedId, windows]);
}

/** Accessible name for a taskbar or dock button, given what it will do. */
export function describeShellAction(item: ShellItem): string {
  const name = item.application.title;
  if (!item.isRunning) return `Open ${name}`;
  if (item.isMinimized) return `Restore ${name}`;
  if (item.isActive) return `Minimize ${name}`;
  return `Focus ${name}`;
}
