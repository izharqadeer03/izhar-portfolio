'use client';

import { SYSTEM_PROFILE } from '@izhar-os/config';
import { cn } from '@izhar-os/ui';
import { Search } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef } from 'react';

import { AppTile } from '@/components/applications/AppIcon';
import { useLauncherSearch } from '@/hooks/useLauncherSearch';
import { usePrefersReducedMotion } from '@/hooks/useSystemPreferences';

interface MacLaunchpadProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLUMNS = 5;

/**
 * Launchpad.
 *
 * The whole screen blurs back and the applications come forward — the same
 * search and the same keyboard model as the Start menu and the Activities
 * overview, given the room macOS would give it. Escape or a click on the
 * background dismisses it, which is the only way out Launchpad has ever had.
 */
export function MacLaunchpad({ isOpen, onClose }: MacLaunchpadProps) {
  return (
    <AnimatePresence>{isOpen ? <LaunchpadSurface onClose={onClose} /> : null}</AnimatePresence>
  );
}

function LaunchpadSurface({ onClose }: { onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const launcher = useLauncherSearch({ columns: COLUMNS, onLaunch: onClose });

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
      className="fixed inset-0 z-165 flex flex-col items-center bg-void/72 backdrop-blur-3xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0.08 : 0.22, ease: [0.16, 1, 0.3, 1] }}
      role="dialog"
      aria-label="Launchpad"
      onPointerDown={(event) => {
        // Only the backdrop dismisses; the grid and the field do not.
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={launcher.handleKeyDown}
    >
      <motion.div
        className="relative mt-[13vh] w-[min(760px,88vw)]"
        initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: reducedMotion ? 1 : 1.04 }}
        transition={{ duration: reducedMotion ? 0.08 : 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mx-auto w-[min(320px,70vw)]">
          <div className="relative">
            <Search
              size={14}
              strokeWidth={1.8}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-faint"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded
              aria-controls="launchpad-results"
              aria-activedescendant={
                launcher.active ? `launchpad-item-${launcher.active.id}` : undefined
              }
              aria-label="Search applications"
              placeholder="Search"
              value={launcher.query}
              onChange={(event) => launcher.setQuery(event.target.value)}
              className="mac-vibrancy h-9 w-full rounded-lg border border-line ps-10 pe-4 text-center text-[13px] text-fg placeholder:text-faint focus:outline-none"
            />
          </div>
        </div>

        {launcher.query.trim() ? (
          launcher.globalResults.length === 0 ? (
            <p className="mt-16 text-center text-[13px] text-muted">
              No portfolio items match “{launcher.query}”.
            </p>
          ) : (
            <ul
              id="launchpad-results"
              role="listbox"
              aria-label="Portfolio Search Results"
              className="mt-8 flex flex-col gap-1.5 max-h-[55vh] overflow-y-auto os-scroll px-2"
            >
              {launcher.globalResults.map((result, index) => (
                <li key={result.id} role="none">
                  <button
                    type="button"
                    id={`launchpad-item-${result.id}`}
                    role="option"
                    aria-selected={index === launcher.highlight}
                    tabIndex={-1}
                    onClick={() => launcher.launchGlobal(result)}
                    onPointerEnter={() => launcher.setHighlight(index)}
                    className={cn(
                      'flex w-full items-center gap-3.5 rounded-xl border px-4 py-3 text-left',
                      'transition-colors duration-150 ease-env backdrop-blur-md',
                      index === launcher.highlight
                        ? 'border-line-strong bg-white/[0.12] shadow-lg'
                        : 'border-line/40 bg-white/[0.04] hover:bg-white/[0.08]',
                    )}
                  >
                    <div className="shrink-0">
                      <AppTile
                        icon={result.icon ?? 'search'}
                        accent={(result.accent as any) ?? 'cyan'}
                        size={36}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-[13px] font-semibold text-fg">
                          {result.title}
                        </span>
                        <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent shrink-0">
                          {result.categoryLabel}
                        </span>
                      </div>
                      <p className="truncate text-[11.5px] text-muted">{result.subtitle}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )
        ) : launcher.results.length === 0 ? (
          <p className="mt-16 text-center text-[13px] text-muted">
            No applications match “{launcher.query}”.
          </p>
        ) : (
          <ul
            id="launchpad-results"
            role="listbox"
            aria-label="Applications"
            className="mt-12 grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 md:grid-cols-5"
          >
            {launcher.results.map((application, index) => (
              <li key={application.id} role="none">
                <button
                  type="button"
                  id={`launchpad-item-${application.id}`}
                  role="option"
                  aria-selected={index === launcher.highlight}
                  tabIndex={-1}
                  onClick={() => launcher.launch(application)}
                  onPointerEnter={() => launcher.setHighlight(index)}
                  className="group flex w-full flex-col items-center gap-2.5 rounded-xl px-1 py-2 focus-visible:outline-none"
                >
                  <span
                    className={cn(
                      'transition-transform duration-200 ease-env',
                      index === launcher.highlight ? 'scale-[1.06]' : 'group-hover:scale-[1.04]',
                    )}
                  >
                    <AppTile
                      icon={application.icon}
                      accent={application.accent}
                      size={62}
                      muted={application.status === 'coming-soon'}
                      className={index === launcher.highlight ? 'brightness-110' : undefined}
                    />
                  </span>
                  <span className="line-clamp-2 max-w-full text-center text-[12px] text-fg/90 [text-shadow:0_1px_3px_rgba(0,0,0,0.7)]">
                    {application.shortTitle}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-10 text-center text-[12px] text-muted">
          {launcher.query.trim()
            ? launcher.activeGlobal?.subtitle ?? 'Press Enter to open'
            : launcher.active?.description ?? SYSTEM_PROFILE.statement}
        </p>
      </motion.div>
    </motion.div>
  );
}
