'use client';

import { cn } from '@izhar-os/ui';
import { Grip } from 'lucide-react';

import { AppTile } from '@/components/applications/AppIcon';
import { describeShellAction, useShellItems } from '@/hooks/useShellItems';
import { LINUX_DOCK_WIDTH, LINUX_PANEL_HEIGHT } from '@/lib/environment';
import { useWindowStore } from '@/lib/store/window-store';

interface UbuntuDockProps {
  isActivitiesOpen: boolean;
  onToggleActivities: () => void;
}

/**
 * The Ubuntu dock.
 *
 * Vertical, hard against the left edge, with the running indicator as a short
 * bar on the *outside* of the icon rather than a dot beneath it — that detail
 * is most of why Ubuntu's dock never gets mistaken for macOS's, and the reason
 * this environment reserves its space on the left instead of the bottom.
 *
 * The show-applications grid pins to the bottom, where Ubuntu has kept it since
 * it moved to GNOME Shell.
 */
export function UbuntuDock({ isActivitiesOpen, onToggleActivities }: UbuntuDockProps) {
  const items = useShellItems();
  const openWindow = useWindowStore((state) => state.openWindow);
  const toggleMinimize = useWindowStore((state) => state.toggleMinimize);

  return (
    <div
      className="yaru-surface absolute bottom-0 left-0 z-140 flex flex-col items-center gap-1.5 border-r border-black/40 py-2"
      style={{ width: LINUX_DOCK_WIDTH, top: LINUX_PANEL_HEIGHT }}
      role="toolbar"
      aria-label="Dock"
    >
      {items.map((item) => (
        <button
          key={item.application.id}
          type="button"
          onClick={() =>
            item.instance ? toggleMinimize(item.instance.id) : openWindow(item.application.id)
          }
          aria-label={describeShellAction(item)}
          aria-current={item.isActive}
          data-tip={item.application.title}
          className={cn(
            'os-tip relative grid size-11 place-items-center rounded-lg transition-colors duration-150 ease-os',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70',
            item.isActive ? 'bg-white/12' : 'hover:bg-white/8',
            item.isMinimized && 'opacity-70',
          )}
        >
          <AppTile
            icon={item.application.icon}
            accent={item.application.accent}
            size={34}
            muted={item.application.status === 'coming-soon'}
          />

          {/* Running indicator, on the outer edge. */}
          <span
            aria-hidden="true"
            className={cn(
              'absolute left-0 w-[3px] rounded-r-full transition-all duration-200',
              item.isActive ? 'env-accent-bg' : 'bg-fg/50',
              item.isRunning
                ? item.isActive
                  ? 'h-5 opacity-100'
                  : 'h-2.5 opacity-100'
                : 'h-0 opacity-0',
            )}
          />
        </button>
      ))}

      <button
        type="button"
        onClick={onToggleActivities}
        aria-expanded={isActivitiesOpen}
        aria-label="Show applications"
        data-tip="Show applications"
        className={cn(
          'os-tip mt-auto grid size-11 place-items-center rounded-lg transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70',
          isActivitiesOpen ? 'bg-white/14 env-accent' : 'text-fg/75 hover:bg-white/8 hover:text-fg',
        )}
      >
        <Grip size={19} strokeWidth={1.9} />
      </button>
    </div>
  );
}
