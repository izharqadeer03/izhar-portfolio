'use client';

import { ENVIRONMENTS, SYSTEM_PROFILE } from '@izhar-os/config';
import { cn, StatusDot } from '@izhar-os/ui';
import { Check, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useRef, type RefObject } from 'react';

import { AppTile } from '@/components/applications/AppIcon';
import { EnvironmentMark } from '@/components/system/OSLogos';
import { useDismiss } from '@/hooks/useDismiss';
import { useLauncherSearch } from '@/hooks/useLauncherSearch';
import { useEnvironmentStore } from '@/lib/store/environment-store';

interface MobileLauncherProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLElement | null>;
}

const COLUMNS = 3;

/**
 * The phone launcher: a sheet with search, an application grid, and the
 * workspace choice at the bottom with targets big enough to hit with a thumb.
 *
 * Putting the environments *inside* the launcher rather than behind a menu is
 * deliberate — on a phone the switcher in the status bar is one small mark, and
 * this is where a visitor who missed it will still find the choice.
 */
export function MobileLauncher({ isOpen, onClose, triggerRef }: MobileLauncherProps) {
  return (
    <AnimatePresence>
      {isOpen ? <LauncherSheet key="sheet" onClose={onClose} triggerRef={triggerRef} /> : null}
    </AnimatePresence>
  );
}

function LauncherSheet({ onClose, triggerRef }: Omit<MobileLauncherProps, 'isOpen'>) {
  const panelRef = useRef<HTMLDivElement>(null);
  const launcher = useLauncherSearch({ columns: COLUMNS, onLaunch: onClose });

  const current = useEnvironmentStore((state) => state.environment);
  const requestEnvironment = useEnvironmentStore((state) => state.requestEnvironment);

  const ignore = useMemo(() => [triggerRef], [triggerRef]);
  useDismiss(panelRef, { enabled: true, onDismiss: onClose, ignore });

  // Focus goes to the sheet rather than the field: a keyboard springing up the
  // moment a phone launcher opens hides most of what it just opened.
  useEffect(() => {
    const frame = requestAnimationFrame(() => panelRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <motion.div
        className="fixed inset-0 z-155 bg-void/60 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onPointerDown={onClose}
      />

      <motion.div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-label="Launcher"
        className="fixed inset-x-0 bottom-0 z-160 flex max-h-[86dvh] flex-col overflow-hidden rounded-t-2xl border border-line bg-surface/94 backdrop-blur-2xl focus:outline-none"
        style={{
          boxShadow: '0 -24px 60px -20px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 22 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        onKeyDown={launcher.handleKeyDown}
      >
        <span
          className="mx-auto mt-2.5 h-1 w-9 shrink-0 rounded-full bg-white/18"
          role="presentation"
        />

        {/* Identity — the same three facts every environment leads with. */}
        <header className="flex items-center gap-3 px-4 pt-3.5 pb-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-line bg-linear-to-b from-white/10 to-white/[0.02] text-[11px] font-semibold text-fg/85">
            IQ
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13.5px] font-medium text-fg">
              {SYSTEM_PROFILE.name}
            </span>
            <span className="block truncate text-[11.5px] text-muted">{SYSTEM_PROFILE.role}</span>
          </span>
          <StatusDot state={SYSTEM_PROFILE.status.state} />
        </header>

        <div className="px-4 pb-3">
          <div className="relative">
            <Search
              size={14}
              strokeWidth={1.7}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-faint"
              aria-hidden="true"
            />
            <input
              type="text"
              inputMode="search"
              aria-label="Search applications"
              placeholder="Search applications…"
              value={launcher.query}
              onChange={(event) => launcher.setQuery(event.target.value)}
              className="h-10 w-full rounded-lg border border-line bg-void/50 ps-9 pe-3 text-[13px] text-fg placeholder:text-faint focus:outline-none"
            />
          </div>
        </div>

        <div className="os-scroll min-h-0 flex-1 overflow-y-auto px-4">
          <ul className="grid grid-cols-3 gap-1" aria-label="Applications">
            {launcher.results.map((application) => (
              <li key={application.id}>
                <button
                  type="button"
                  onClick={() => launcher.launch(application)}
                  className="flex w-full flex-col items-center gap-2 rounded-xl px-2 py-3 transition-colors hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                >
                  <AppTile
                    icon={application.icon}
                    accent={application.accent}
                    size={44}
                    muted={application.status === 'coming-soon'}
                  />
                  <span className="line-clamp-1 max-w-full text-[11.5px] text-fg/90">
                    {application.shortTitle}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {launcher.results.length === 0 ? (
            <p className="py-10 text-center text-[12.5px] text-muted">
              No applications match “{launcher.query}”.
            </p>
          ) : null}
        </div>

        {/* Workspace choice. */}
        <footer className="border-t border-line px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]">
          <p className="pb-2.5 font-mono text-[10px] font-medium tracking-[0.18em] text-faint uppercase">
            Choose your workspace
          </p>

          <div className="grid grid-cols-3 gap-2">
            {ENVIRONMENTS.map((environment) => {
              const isCurrent = environment.id === current;
              return (
                <button
                  key={environment.id}
                  type="button"
                  aria-pressed={isCurrent}
                  onClick={() => {
                    onClose();
                    requestEnvironment(environment.id);
                  }}
                  className={cn(
                    'flex min-h-[64px] flex-col items-center justify-center gap-1.5 rounded-xl border',
                    'transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70',
                    isCurrent
                      ? 'env-selected env-accent'
                      : 'border-line bg-white/[0.03] text-muted hover:bg-white/[0.06]',
                  )}
                >
                  <EnvironmentMark logo={environment.logo} size={18} />
                  <span className="flex items-center gap-1 text-[11.5px] font-medium">
                    {environment.shortName}
                    {isCurrent ? <Check size={11} strokeWidth={2.6} aria-hidden="true" /> : null}
                  </span>
                </button>
              );
            })}
          </div>
        </footer>
      </motion.div>
    </>
  );
}
