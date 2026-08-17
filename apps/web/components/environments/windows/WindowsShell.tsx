'use client';

import type { RefObject } from 'react';

import { WindowsStartMenu } from '@/components/environments/windows/WindowsStartMenu';
import { WindowsTaskbar } from '@/components/environments/windows/WindowsTaskbar';

interface WindowsShellProps {
  isLauncherOpen: boolean;
  onToggleLauncher: () => void;
  onCloseLauncher: () => void;
  startButtonRef: RefObject<HTMLButtonElement | null>;
}

/**
 * The Windows environment's chrome.
 *
 * A taskbar along the bottom, Start rising from the middle of it, and the
 * system area floating in the top-right corner where this portfolio always
 * keeps it. Nothing here knows what an application *is* — it reads the same
 * manifest and the same window store the other two shells read.
 */
export function WindowsShell({
  isLauncherOpen,
  onToggleLauncher,
  onCloseLauncher,
  startButtonRef,
}: WindowsShellProps) {
  return (
    <>
      <WindowsTaskbar
        isLauncherOpen={isLauncherOpen}
        onToggleLauncher={onToggleLauncher}
        startButtonRef={startButtonRef}
      />

      <WindowsStartMenu
        isOpen={isLauncherOpen}
        onClose={onCloseLauncher}
        triggerRef={startButtonRef}
      />
    </>
  );
}
