'use client';

import { cn } from '@izhar-os/ui';
import { CornerDownLeft, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef } from 'react';

import { AppTile } from '@/components/applications/AppIcon';
import { useLauncherSearch } from '@/hooks/useLauncherSearch';
import { usePrefersReducedMotion } from '@/hooks/useSystemPreferences';
import { useWindowStore } from '@/lib/store/window-store';

interface UbuntuActivitiesProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLUMNS = 6;

/**
 * The Activities overview.
 *
 * GNOME's overview does two things at once — it searches applications and it
 * shows you the windows you already have open — so this one does too. The
 * window strip along the top is live: clicking a card focuses that window and
 * closes the overview, which is the interaction the real thing is built around.
 */
export function UbuntuActivities({ isOpen, onClose }: UbuntuActivitiesProps) {
  return (
    <AnimatePresence>{isOpen ? <ActivitiesSurface onClose={onClose} /> : null}</AnimatePresence>
  );
}

function ActivitiesSurface({ onClose }: { onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const launcher = useLauncherSearch({ columns: COLUMNS, onLaunch: onClose });

  const windows = useWindowStore((state) => state.windows);
  const focusWindow = useWindowStore((state) => state.focusWindow);

  useEffect(() => {
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-165 flex flex-col items-center overflow-y-auto bg-[#1a1015]/86 px-6 py-10 backdrop-blur-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0.08 : 0.2, ease: [0.16, 1, 0.3, 1] }}
      role="dialog"
      aria-label="Activities overview"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={launcher.handleKeyDown}
    >
      <motion.div
        className="w-[min(880px,100%)]"
        initial={{ opacity: 0, y: reducedMotion ? 0 : -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
        transition={{ duration: reducedMotion ? 0.08 : 0.24, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Search */}
        <div className="mx-auto w-[min(420px,86vw)]">
          <div className="relative">
            <Search
              size={15}
              strokeWidth={1.8}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-faint"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded
              aria-controls="activities-results"
              aria-activedescendant={
                launcher.active ? `activities-item-${launcher.active.id}` : undefined
              }
              aria-label="Type to search"
              placeholder="Type to search…"
              value={launcher.query}
              onChange={(event) => launcher.setQuery(event.target.value)}
              className={cn(
                'h-11 w-full rounded-full border border-white/12 bg-black/35 ps-11 pe-4 text-[14px] text-fg',
                'placeholder:text-faint focus:outline-none',
                'focus:border-[color:color-mix(in_oklab,var(--env-accent)_60%,transparent)]',
              )}
            />
          </div>
        </div>

        {/* Open windows. */}
        {windows.length > 0 && !launcher.query ? (
          <section className="mt-10">
            <h2 className="mb-3 font-mono text-[10px] font-medium tracking-[0.2em] text-faint uppercase">
              Windows
            </h2>
            <ul className="flex flex-wrap gap-3">
              {windows.map((instance) => (
                <li key={instance.id}>
                  <button
                    type="button"
                    onClick={() => {
                      focusWindow(instance.id);
                      onClose();
                    }}
                    className={cn(
                      'flex h-[86px] w-[168px] flex-col justify-between rounded-lg border border-white/12',
                      'bg-white/[0.05] p-3 text-left transition-colors duration-150',
                      'hover:border-white/25 hover:bg-white/[0.09]',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70',
                    )}
                  >
                    <span className="truncate text-[12px] font-medium text-fg">
                      {instance.title}
                    </span>
                    <span className="font-mono text-[10px] text-faint">
                      {instance.isMinimized ? 'minimised' : 'workspace 1'}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Applications. */}
        <section className="mt-10 pb-6">
          <h2 className="mb-4 font-mono text-[10px] font-medium tracking-[0.2em] text-faint uppercase">
            {launcher.query ? 'Results' : 'Applications'}
          </h2>

          {launcher.results.length === 0 ? (
            <p className="py-10 text-center text-[13px] text-muted">
              No applications match “{launcher.query}”.
            </p>
          ) : (
            <ul
              id="activities-results"
              role="listbox"
              aria-label="Applications"
              className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-6"
            >
              {launcher.results.map((application, index) => (
                <li key={application.id} role="none">
                  <button
                    type="button"
                    id={`activities-item-${application.id}`}
                    role="option"
                    aria-selected={index === launcher.highlight}
                    tabIndex={-1}
                    onClick={() => launcher.launch(application)}
                    onPointerEnter={() => launcher.setHighlight(index)}
                    className={cn(
                      'flex w-full flex-col items-center gap-2 rounded-lg border px-1.5 py-3',
                      'transition-colors duration-150',
                      index === launcher.highlight
                        ? 'env-selected'
                        : 'border-transparent hover:bg-white/[0.06]',
                    )}
                  >
                    <AppTile
                      icon={application.icon}
                      accent={application.accent}
                      size={46}
                      muted={application.status === 'coming-soon'}
                    />
                    <span className="line-clamp-2 max-w-full text-center text-[11.5px] text-fg/90">
                      {application.shortTitle}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="flex items-center justify-center gap-2 pb-4 text-[11.5px] text-faint">
          <CornerDownLeft size={12} strokeWidth={1.8} aria-hidden="true" />
          <span>
            {launcher.active?.description ?? 'Press Enter to open the highlighted result.'}
          </span>
        </p>
      </motion.div>
    </motion.div>
  );
}
