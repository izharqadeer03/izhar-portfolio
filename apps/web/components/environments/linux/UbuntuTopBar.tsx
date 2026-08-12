'use client';

import { getApplication } from '@izhar-os/config';
import { cn } from '@izhar-os/ui';
import { BatteryMedium, Network, Power, Volume2, VolumeX } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useRef, useState } from 'react';

import { SystemArea } from '@/components/system/SystemArea';
import { useClock } from '@/hooks/useClock';
import { useDismiss } from '@/hooks/useDismiss';
import { LINUX_PANEL_HEIGHT } from '@/lib/environment';
import { useSystemStore } from '@/lib/store/system-store';
import { useWindowStore } from '@/lib/store/window-store';

interface UbuntuTopBarProps {
  isActivitiesOpen: boolean;
  onToggleActivities: () => void;
}

/** Workspaces are a GNOME idea the window manager can honour honestly. */
const WORKSPACE_COUNT = 2;

/**
 * The GNOME top panel.
 *
 * Activities on the left, the clock dead centre, the system menu on the right —
 * the arrangement GNOME has used since 3.0 and the single fastest way to tell a
 * screenshot of Ubuntu from a screenshot of anything else. The workspace pips
 * next to Activities are real: they light according to whether any window is
 * open, rather than pretending to track workspaces that do not exist.
 */
export function UbuntuTopBar({ isActivitiesOpen, onToggleActivities }: UbuntuTopBarProps) {
  const reading = useClock();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const windows = useWindowStore((state) => state.windows);
  const focusedId = useWindowStore((state) => state.focusedId);
  const closeAllWindows = useWindowStore((state) => state.closeAllWindows);
  const soundEnabled = useSystemStore((state) => state.soundEnabled);
  const toggleSound = useSystemStore((state) => state.toggleSound);

  const close = useCallback(() => setMenuOpen(false), []);
  useDismiss(menuRef, { enabled: menuOpen, onDismiss: close });

  const focused = windows.find((instance) => instance.id === focusedId);
  const focusedApplication = focused ? getApplication(focused.applicationId) : undefined;

  return (
    <div
      className="yaru-surface absolute inset-x-0 top-0 z-140 flex items-center gap-2 border-b border-black/40 px-2"
      style={{ height: LINUX_PANEL_HEIGHT }}
    >
      <button
        type="button"
        onClick={onToggleActivities}
        aria-expanded={isActivitiesOpen}
        aria-label="Activities overview"
        className={cn(
          'flex h-[26px] items-center rounded-full px-3 text-[12.5px] font-medium transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70',
          isActivitiesOpen ? 'bg-white/18 text-fg' : 'text-fg/85 hover:bg-white/10',
        )}
      >
        Activities
      </button>

      {/* Workspace pips. */}
      <span className="flex items-center gap-1.5 ps-1" aria-hidden="true">
        {Array.from({ length: WORKSPACE_COUNT }, (_, index) => (
          <span
            key={index}
            className={cn(
              'h-1.5 rounded-full transition-all duration-200',
              index === 0 && windows.length > 0
                ? 'w-4 env-accent-bg'
                : index === 0
                  ? 'w-4 bg-fg/45'
                  : 'w-1.5 bg-fg/20',
            )}
          />
        ))}
      </span>

      {/* Focused application, as GNOME shows it beside Activities. */}
      {focusedApplication ? (
        <span className="ps-1 text-[12.5px] font-medium text-fg/85">
          {focusedApplication.title}
        </span>
      ) : null}

      {/* Centre clock. Absolutely placed so the left group cannot shift it. */}
      <time
        dateTime={reading?.iso}
        className="absolute left-1/2 -translate-x-1/2 text-[12.5px] font-medium tabular-nums text-fg/90"
        aria-label={reading ? `Current time ${reading.time}` : undefined}
      >
        {reading ? `${reading.date}  ${reading.time}` : '—'}
      </time>

      <div className="ms-auto flex items-center gap-1.5">
        <SystemArea tone="bar" />

        <div className="relative">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="System menu"
            className={cn(
              'flex h-[26px] items-center gap-2 rounded-full px-2 transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70',
              menuOpen ? 'bg-white/18' : 'hover:bg-white/10',
            )}
          >
            <Network size={13} strokeWidth={1.8} className="text-fg/80" aria-hidden="true" />
            {soundEnabled ? (
              <Volume2 size={13} strokeWidth={1.8} className="text-fg/80" aria-hidden="true" />
            ) : (
              <VolumeX size={13} strokeWidth={1.8} className="text-faint" aria-hidden="true" />
            )}
            <BatteryMedium size={15} strokeWidth={1.6} className="text-fg/80" aria-hidden="true" />
          </button>

          <AnimatePresence>
            {menuOpen ? (
              <motion.div
                ref={menuRef}
                role="menu"
                aria-label="System menu"
                className="yaru-surface absolute top-[calc(100%+6px)] right-0 z-160 w-[224px] rounded-xl border border-black/45 p-2"
                style={{ boxShadow: '0 24px 56px -18px rgba(0,0,0,0.9)' }}
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.13, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <button
                  type="button"
                  role="menuitemcheckbox"
                  aria-checked={soundEnabled}
                  onClick={toggleSound}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12.5px] text-fg/90 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:bg-white/10"
                >
                  {soundEnabled ? (
                    <Volume2 size={14} strokeWidth={1.7} />
                  ) : (
                    <VolumeX size={14} strokeWidth={1.7} />
                  )}
                  <span className="flex-1">Sound</span>
                  <span className="text-[11px] text-faint">{soundEnabled ? 'On' : 'Off'}</span>
                </button>

                <div className="my-1.5 h-px bg-white/10" role="presentation" />

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    closeAllWindows();
                    close();
                  }}
                  disabled={windows.length === 0}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12.5px] transition-colors',
                    'focus-visible:outline-none focus-visible:bg-white/10',
                    windows.length === 0
                      ? 'cursor-default text-faint/70'
                      : 'text-fg/90 hover:bg-white/10',
                  )}
                >
                  <Power size={14} strokeWidth={1.7} />
                  <span className="flex-1">Close all windows</span>
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
