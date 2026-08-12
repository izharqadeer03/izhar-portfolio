'use client';

import { OS_META } from '@izhar-os/config';
import { cn } from '@izhar-os/ui';
import { LayoutGrid, Search, X } from 'lucide-react';
import type { RefObject } from 'react';

import { Clock } from '@/components/system/Clock';
import { EnvironmentSwitcher } from '@/components/system/EnvironmentSwitcher';
import { OSMark } from '@/components/system/OSMark';
import { SystemStatus } from '@/components/system/SystemStatus';
import { useEnvironmentDefinition } from '@/hooks/useEnvironment';
import { MOBILE_DOCK_HEIGHT, MOBILE_STATUSBAR_HEIGHT } from '@/lib/constants';
import { useWindowStore } from '@/lib/store/window-store';

/**
 * Mobile chrome.
 *
 * All three environments share it, and that is a design decision rather than a
 * shortcut: a phone has one bar at the top and one row of targets at the
 * bottom, and reproducing a taskbar, a menu bar or a left-edge dock at 390px
 * would be a costume rather than a feature. What does carry across is the
 * environment's identity — its mark, its accent, its file manager's name — plus
 * the switcher itself, so choosing a workspace is never a desktop-only feature.
 */
export function MobileStatusBar() {
  const environment = useEnvironmentDefinition();

  return (
    <div
      className="absolute inset-x-0 top-0 z-140 flex items-center justify-between border-b border-line bg-deep/80 px-3 backdrop-blur-2xl"
      style={{ height: MOBILE_STATUSBAR_HEIGHT }}
    >
      <div className="flex min-w-0 items-center gap-2">
        <OSMark size={15} className="text-accent" frame={false} />
        <span className="truncate font-mono text-[11px] font-medium tracking-[0.16em] text-fg/90 uppercase">
          {OS_META.name}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <SystemStatus iconOnly />
        {/* Compact: on a phone the mark carries the meaning, not the word. */}
        <EnvironmentSwitcher tone="bar" compact />
        <Clock compact />
        <span className="sr-only">Workspace: {environment.name}</span>
      </div>
    </div>
  );
}

interface MobileDockProps {
  isLauncherOpen: boolean;
  onToggleLauncher: () => void;
  dockRef: RefObject<HTMLButtonElement | null>;
}

const DOCK_ITEM =
  'flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-1.5 text-[10px] font-medium ' +
  'transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70';

/**
 * Bottom dock.
 *
 * Four targets, each at least 44px tall, and a close action that only appears
 * when there is something to close. The desktop's window list has no equivalent
 * here on purpose — a phone shows one application at a time, so a row of window
 * buttons would be describing a state that cannot exist.
 */
export function MobileDock({ isLauncherOpen, onToggleLauncher, dockRef }: MobileDockProps) {
  const environment = useEnvironmentDefinition();
  const windows = useWindowStore((state) => state.windows);
  const focusedId = useWindowStore((state) => state.focusedId);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const openWindow = useWindowStore((state) => state.openWindow);

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-140 flex items-stretch gap-1 border-t border-line bg-deep/88 px-3 pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl"
      style={{ height: MOBILE_DOCK_HEIGHT }}
    >
      <button
        ref={dockRef}
        type="button"
        onClick={onToggleLauncher}
        aria-expanded={isLauncherOpen}
        aria-label="Open launcher"
        className={cn(DOCK_ITEM, isLauncherOpen ? 'env-accent-quiet env-accent' : 'text-muted')}
      >
        <OSMark size={17} />
        <span>Home</span>
      </button>

      <button
        type="button"
        onClick={() => openWindow('files')}
        aria-label={`Open the portfolio in ${environment.fileManager}`}
        className={cn(DOCK_ITEM, 'text-muted')}
      >
        <LayoutGrid size={17} strokeWidth={1.7} />
        <span>{environment.fileManager}</span>
      </button>

      <button
        type="button"
        onClick={onToggleLauncher}
        aria-label="Search applications"
        className={cn(DOCK_ITEM, 'text-muted')}
      >
        <Search size={17} strokeWidth={1.7} />
        <span>Search</span>
      </button>

      {windows.length > 0 && focusedId ? (
        <button
          type="button"
          onClick={() => closeWindow(focusedId)}
          aria-label="Close current application"
          className={cn(DOCK_ITEM, 'text-muted')}
        >
          <X size={17} strokeWidth={1.7} />
          <span>Close</span>
        </button>
      ) : null}
    </div>
  );
}
