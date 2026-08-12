'use client';

import { MacDock } from '@/components/environments/macos/MacDock';
import { MacLaunchpad } from '@/components/environments/macos/MacLaunchpad';
import { MacMenuBar } from '@/components/environments/macos/MacMenuBar';

interface MacShellProps {
  isLauncherOpen: boolean;
  onToggleLauncher: () => void;
  onCloseLauncher: () => void;
}

/**
 * The macOS environment's chrome.
 *
 * Menu bar on top, dock below, Launchpad over everything. The system area sits
 * inside the menu bar rather than floating on the desktop, because on a Mac the
 * top-right corner of the screen already *is* the status area — the switcher
 * simply joins the row it belongs in.
 */
export function MacShell({ isLauncherOpen, onToggleLauncher, onCloseLauncher }: MacShellProps) {
  return (
    <>
      <MacMenuBar onOpenLaunchpad={onToggleLauncher} />
      <MacDock onOpenLaunchpad={onToggleLauncher} />
      <MacLaunchpad isOpen={isLauncherOpen} onClose={onCloseLauncher} />
    </>
  );
}
