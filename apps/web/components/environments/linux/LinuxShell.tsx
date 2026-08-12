'use client';

import { UbuntuActivities } from '@/components/environments/linux/UbuntuActivities';
import { UbuntuDock } from '@/components/environments/linux/UbuntuDock';
import { UbuntuTopBar } from '@/components/environments/linux/UbuntuTopBar';

interface LinuxShellProps {
  isLauncherOpen: boolean;
  onToggleLauncher: () => void;
  onCloseLauncher: () => void;
}

/**
 * The Linux environment's chrome.
 *
 * Panel across the top, dock down the left, Activities over everything — the
 * GNOME Shell arrangement Ubuntu ships. It is the only one of the three that
 * reserves a *side* of the screen, which is why the window manager works from
 * a work-area rectangle rather than from a viewport minus a bar.
 */
export function LinuxShell({ isLauncherOpen, onToggleLauncher, onCloseLauncher }: LinuxShellProps) {
  return (
    <>
      <UbuntuTopBar isActivitiesOpen={isLauncherOpen} onToggleActivities={onToggleLauncher} />
      <UbuntuDock isActivitiesOpen={isLauncherOpen} onToggleActivities={onToggleLauncher} />
      <UbuntuActivities isOpen={isLauncherOpen} onClose={onCloseLauncher} />
    </>
  );
}
