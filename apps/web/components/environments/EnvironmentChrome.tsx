'use client';

import type { RefObject } from 'react';

import { LinuxShell } from '@/components/environments/linux/LinuxShell';
import { MacShell } from '@/components/environments/macos/MacShell';
import { MobileDock, MobileStatusBar } from '@/components/environments/shared/MobileChrome';
import { MobileLauncher } from '@/components/environments/shared/MobileLauncher';
import { WindowsShell } from '@/components/environments/windows/WindowsShell';
import { useEnvironment } from '@/hooks/useEnvironment';
import { useIsMobile } from '@/hooks/useSystemPreferences';

interface EnvironmentChromeProps {
  isLauncherOpen: boolean;
  onToggleLauncher: () => void;
  onCloseLauncher: () => void;
  /** The control that opens the launcher, so clicking it to close won't reopen. */
  launcherTriggerRef: RefObject<HTMLButtonElement | null>;
}

/**
 * The one fork in the entire system.
 *
 * Everything above this line — the window manager, the application registry,
 * the desktop surface, the profile, the stores — is shared. Everything below it
 * is chrome: bars, docks, launchers and system menus. Adding a fourth
 * environment would mean writing one more shell and adding one more case here;
 * it would not mean touching an application.
 */
export function EnvironmentChrome({
  isLauncherOpen,
  onToggleLauncher,
  onCloseLauncher,
  launcherTriggerRef,
}: EnvironmentChromeProps) {
  const environment = useEnvironment();
  const isMobile = useIsMobile();

  // A phone gets one chrome for every environment — see MobileChrome for why.
  if (isMobile) {
    return (
      <>
        <MobileStatusBar />
        <MobileDock
          isLauncherOpen={isLauncherOpen}
          onToggleLauncher={onToggleLauncher}
          dockRef={launcherTriggerRef}
        />
        <MobileLauncher
          isOpen={isLauncherOpen}
          onClose={onCloseLauncher}
          triggerRef={launcherTriggerRef}
        />
      </>
    );
  }

  if (environment === 'macos') {
    return (
      <MacShell
        isLauncherOpen={isLauncherOpen}
        onToggleLauncher={onToggleLauncher}
        onCloseLauncher={onCloseLauncher}
      />
    );
  }

  if (environment === 'linux') {
    return (
      <LinuxShell
        isLauncherOpen={isLauncherOpen}
        onToggleLauncher={onToggleLauncher}
        onCloseLauncher={onCloseLauncher}
      />
    );
  }

  return (
    <WindowsShell
      isLauncherOpen={isLauncherOpen}
      onToggleLauncher={onToggleLauncher}
      onCloseLauncher={onCloseLauncher}
      startButtonRef={launcherTriggerRef}
    />
  );
}
