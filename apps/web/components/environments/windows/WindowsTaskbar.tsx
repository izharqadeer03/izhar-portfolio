'use client';

import { OS_META } from '@izhar-os/config';
import { cn } from '@izhar-os/ui';
import { Search, Volume2, VolumeX, Wifi } from 'lucide-react';
import { motion } from 'motion/react';
import type { Ref } from 'react';

import { AppGlyph, getAccentValue } from '@/components/applications/AppIcon';
import { Clock } from '@/components/system/Clock';
import { WindowsLogo } from '@/components/system/OSLogos';
import { SystemArea } from '@/components/system/SystemArea';
import { describeShellAction, useShellItems } from '@/hooks/useShellItems';
import { TASKBAR_HEIGHT } from '@/lib/constants';
import { useSystemStore } from '@/lib/store/system-store';
import { useWindowStore } from '@/lib/store/window-store';

interface WindowsTaskbarProps {
  isLauncherOpen: boolean;
  onToggleLauncher: () => void;
  startButtonRef: Ref<HTMLButtonElement>;
}

/**
 * The Windows taskbar.
 *
 * Windows 11's most recognisable move is centring the button group, so that is
 * where it starts: Start and Search lead, pinned applications follow, and the
 * tray stays pinned to the right edge where a clock has always been. A pinned
 * application shows whether it is running with a short rule beneath it rather
 * than with a filled plate, because at this size a filled plate reads as
 * selection and selection is a different idea from "open".
 */
export function WindowsTaskbar({
  isLauncherOpen,
  onToggleLauncher,
  startButtonRef,
}: WindowsTaskbarProps) {
  const items = useShellItems();
  const openWindow = useWindowStore((state) => state.openWindow);
  const toggleMinimize = useWindowStore((state) => state.toggleMinimize);
  const soundEnabled = useSystemStore((state) => state.soundEnabled);
  const toggleSound = useSystemStore((state) => state.toggleSound);

  return (
    <div
      className="fluent-acrylic absolute inset-x-0 bottom-0 z-140 flex items-center border-t border-line px-2.5"
      style={{
        height: TASKBAR_HEIGHT,
        boxShadow: '0 -18px 40px -28px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.045)',
      }}
    >
      {/* Centred group. Absolutely positioned so the tray's width cannot pull
          it off centre as the clock's digits change. */}
      <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1">
        <button
          ref={startButtonRef}
          type="button"
          onClick={onToggleLauncher}
          aria-haspopup="dialog"
          aria-expanded={isLauncherOpen}
          aria-label={`${OS_META.name} Start`}
          data-tip="Start"
          className={cn(
            'os-tip grid size-9.5 place-items-center rounded-lg transition-all duration-150 ease-env',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70',
            isLauncherOpen
              ? 'border border-white/20 bg-white/[0.15] text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]'
              : 'border border-transparent text-fg/90 hover:border-white/10 hover:bg-white/[0.08] hover:text-fg',
          )}
        >
          <WindowsLogo size={18} />
        </button>

        <button
          type="button"
          onClick={onToggleLauncher}
          aria-label="Search applications"
          data-tip="Search"
          className={cn(
            'os-tip grid size-9.5 place-items-center rounded-lg transition-all duration-150 ease-env',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70',
            isLauncherOpen
              ? 'border border-white/20 bg-white/[0.12] text-accent'
              : 'border border-transparent text-fg/80 hover:border-white/10 hover:bg-white/[0.08] hover:text-fg',
          )}
        >
          <Search size={17} strokeWidth={1.8} />
        </button>

        <span className="mx-1 h-6 w-px bg-line" role="presentation" />

        {items.map((item) => {
          const accentVal = getAccentValue(item.application.accent);
          return (
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
                'os-tip relative grid size-9.5 place-items-center rounded-lg transition-all duration-150 ease-env',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70',
                item.isActive
                  ? 'border border-white/20 bg-white/[0.15] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.35)] backdrop-blur-sm'
                  : 'border border-transparent hover:border-white/10 hover:bg-white/[0.08]',
                item.isMinimized && 'opacity-65',
              )}
            >
              <span
                className="flex items-center justify-center transition-transform duration-150 group-hover:scale-110"
                style={{
                  color: accentVal,
                  filter: item.isActive
                    ? `drop-shadow(0 0 6px ${accentVal}90)`
                    : 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))',
                }}
              >
                <AppGlyph icon={item.application.icon} size={18} strokeWidth={1.8} />
              </span>

              {/* Running indicator: a glowing accent pill when active, clean dot when running. */}
              <motion.span
                aria-hidden="true"
                className={cn(
                  'absolute bottom-0.5 h-[3px] rounded-full transition-colors',
                  item.isActive ? 'env-accent-bg shadow-[0_0_8px_var(--env-accent)]' : 'bg-white/70',
                )}
                initial={false}
                animate={{
                  width: item.isRunning ? (item.isActive ? 16 : 6) : 0,
                  opacity: item.isRunning ? 1 : 0,
                }}
                transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
              />
            </button>
          );
        })}
      </div>

      {/* Tray. */}
      <div className="ms-auto flex items-center gap-1.5">
        <SystemArea tone="bar" placement="top" />

        <span className="mx-0.5 h-4 w-px bg-line" role="presentation" />

        <button
          type="button"
          aria-label="Internet access"
          data-tip="Internet access · Connected"
          className="os-tip grid size-8 place-items-center rounded-md text-muted transition-colors duration-150 hover:bg-white/8 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
        >
          <Wifi size={15} strokeWidth={1.6} />
        </button>

        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={soundEnabled}
          aria-label={soundEnabled ? 'Mute system sounds' : 'Unmute system sounds'}
          data-tip={soundEnabled ? 'Sound on' : 'Sound off'}
          className={cn(
            'os-tip grid size-8 place-items-center rounded-md transition-colors duration-150',
            'hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70',
            soundEnabled ? 'text-muted hover:text-fg' : 'text-faint',
          )}
        >
          {soundEnabled ? (
            <Volume2 size={15} strokeWidth={1.6} />
          ) : (
            <VolumeX size={15} strokeWidth={1.6} />
          )}
        </button>

        <Clock className="min-w-[52px] pe-1 ps-1" />
      </div>
    </div>
  );
}
