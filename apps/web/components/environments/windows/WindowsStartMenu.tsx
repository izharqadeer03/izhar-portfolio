'use client';

import { OS_META, SYSTEM_PROFILE } from '@izhar-os/config';
import { cn, SectionLabel, StatusDot } from '@izhar-os/ui';
import { Mail, Power, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useRef, type RefObject } from 'react';

import { AppTile } from '@/components/applications/AppIcon';
import { GithubIcon, LinkedInIcon } from '@/components/system/BrandIcons';
import { EnvironmentSwitcher } from '@/components/system/EnvironmentSwitcher';
import { useDismiss } from '@/hooks/useDismiss';
import { useLauncherSearch } from '@/hooks/useLauncherSearch';
import { TASKBAR_HEIGHT } from '@/lib/constants';
import { useWindowStore } from '@/lib/store/window-store';

interface WindowsStartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  /** The Start button, so clicking it to close doesn't immediately reopen. */
  triggerRef: RefObject<HTMLElement | null>;
}

const COLUMNS = 4;

function LinkGlyph({ icon }: { icon: string }) {
  if (icon === 'github') return <GithubIcon size={14} />;
  if (icon === 'linkedin') return <LinkedInIcon size={14} />;
  return <Mail size={14} strokeWidth={1.7} />;
}

/**
 * The Start menu.
 *
 * Windows 11's arrangement: a search field on top, a grid of pinned
 * applications under it, and an account row along the bottom. It rises from the
 * centre of the taskbar rather than the left corner, which — along with the
 * rounded plate and the acrylic — is what makes it read as Windows 11 rather
 * than as any Start menu from the decade before it.
 */
function StartPanel({ onClose, triggerRef }: Omit<WindowsStartMenuProps, 'isOpen'>) {
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeAllWindows = useWindowStore((state) => state.closeAllWindows);

  const launcher = useLauncherSearch({ columns: COLUMNS, onLaunch: onClose });

  const ignore = useMemo(() => [triggerRef], [triggerRef]);
  useDismiss(panelRef, { enabled: true, onDismiss: onClose, ignore });

  useEffect(() => {
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-label={`${OS_META.name} Start`}
      className="fluent-acrylic fixed left-1/2 z-160 flex w-[min(560px,94vw)] -translate-x-1/2 flex-col overflow-hidden rounded-2xl border border-line"
      style={{
        bottom: TASKBAR_HEIGHT + 10,
        boxShadow: '0 40px 90px -28px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.07)',
        transformOrigin: 'bottom center',
      }}
      initial={{ opacity: 0, y: 18, scale: 0.985, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: 12, scale: 0.99, filter: 'blur(4px)' }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      onKeyDown={launcher.handleKeyDown}
    >
      {/* Search */}
      <div className="px-5 pt-5 pb-4">
        <div className="relative">
          <Search
            size={14}
            strokeWidth={1.7}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-faint"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded
            aria-controls="start-results"
            aria-activedescendant={launcher.active ? `start-item-${launcher.active.id}` : undefined}
            aria-label="Search applications"
            placeholder="Type here to search"
            value={launcher.query}
            onChange={(event) => launcher.setQuery(event.target.value)}
            className={cn(
              'h-10 w-full rounded-full border border-line bg-void/45 ps-10 pe-4 text-[13px] text-fg',
              'placeholder:text-faint focus:outline-none',
              'focus:border-[color:color-mix(in_oklab,var(--env-accent)_55%,transparent)]',
              'transition-[border-color] duration-150',
            )}
          />
        </div>
      </div>

      {/* Pinned */}
      <div className="os-scroll max-h-[46vh] min-h-0 flex-1 overflow-y-auto px-5 pb-3">
        <div className="flex items-center justify-between pb-3">
          <SectionLabel>{launcher.query ? 'Results' : 'Pinned'}</SectionLabel>
          <span className="font-mono text-[10px] text-faint">{launcher.results.length}</span>
        </div>

        {launcher.query.trim() ? (
          /* Global Search Results List */
          launcher.globalResults.length === 0 ? (
            <p className="py-10 text-center text-[12.5px] text-muted">
              No portfolio items match “{launcher.query}”.
            </p>
          ) : (
            <ul
              id="start-results"
              role="listbox"
              aria-label="Portfolio Search Results"
              className="flex flex-col gap-1"
            >
              {launcher.globalResults.map((result, index) => (
                <li key={result.id} role="none">
                  <button
                    type="button"
                    id={`start-item-${result.id}`}
                    role="option"
                    aria-selected={index === launcher.highlight}
                    tabIndex={-1}
                    onClick={() => launcher.launchGlobal(result)}
                    onPointerEnter={() => launcher.setHighlight(index)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left',
                      'transition-colors duration-150 ease-env',
                      index === launcher.highlight
                        ? 'border-line-strong bg-white/[0.08]'
                        : 'border-transparent hover:bg-white/[0.045]',
                    )}
                  >
                    <div className="shrink-0">
                      <AppTile
                        icon={result.icon ?? 'search'}
                        accent={(result.accent as any) ?? 'cyan'}
                        size={32}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-[12.5px] font-semibold text-fg">
                          {result.title}
                        </span>
                        <span className="rounded bg-white/8 px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-wider text-accent shrink-0">
                          {result.categoryLabel}
                        </span>
                      </div>
                      <p className="truncate text-[11px] text-muted">{result.subtitle}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )
        ) : launcher.results.length === 0 ? (
          <p className="py-10 text-center text-[12.5px] text-muted">
            No applications match “{launcher.query}”.
          </p>
        ) : (
          <ul
            id="start-results"
            role="listbox"
            aria-label="Applications"
            className="grid grid-cols-4 gap-1"
          >
            {launcher.results.map((application, index) => (
              <li key={application.id} role="none">
                <button
                  type="button"
                  id={`start-item-${application.id}`}
                  role="option"
                  aria-selected={index === launcher.highlight}
                  tabIndex={-1}
                  onClick={() => launcher.launch(application)}
                  onPointerEnter={() => launcher.setHighlight(index)}
                  className={cn(
                    'flex w-full flex-col items-center gap-2 rounded-lg border px-2 py-3.5',
                    'transition-colors duration-150 ease-env',
                    index === launcher.highlight
                      ? 'border-line-strong bg-white/[0.08]'
                      : 'border-transparent hover:bg-white/[0.045]',
                  )}
                >
                  <AppTile
                    icon={application.icon}
                    accent={application.accent}
                    size={38}
                    muted={application.status === 'coming-soon'}
                  />
                  <span className="line-clamp-1 max-w-full text-[11.5px] text-fg/90">
                    {application.shortTitle}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* The highlighted application explains itself here, so the grid stays clean. */}
        <p className="truncate pt-3 text-[11.5px] text-muted">
          {launcher.query.trim()
            ? launcher.activeGlobal?.subtitle ?? 'Press Enter to open'
            : launcher.active?.description ?? SYSTEM_PROFILE.tagline}
        </p>
      </div>

      {/* Account row. */}
      <footer className="flex items-center gap-3 border-t border-line bg-void/30 px-5 py-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line bg-linear-to-b from-white/10 to-white/[0.02] text-[11px] font-semibold text-fg/85">
          IQ
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-fg">
            {SYSTEM_PROFILE.name}
            <StatusDot state={SYSTEM_PROFILE.status.state} />
          </span>
          <span className="block truncate text-[11px] text-muted">{SYSTEM_PROFILE.role}</span>
        </span>

        <span className="flex items-center gap-0.5">
          {SYSTEM_PROFILE.links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noreferrer noopener' : undefined}
              aria-label={link.label}
              data-tip={link.label}
              className="os-tip grid size-8 place-items-center rounded-md text-muted transition-colors hover:bg-white/8 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
            >
              <LinkGlyph icon={link.icon} />
            </a>
          ))}

          <span className="mx-1 h-5 w-px bg-line" role="presentation" />

          {/* The environment lives in Start too — it is part of the portfolio,
              not a setting buried somewhere. */}
          <EnvironmentSwitcher tone="bar" compact placement="top" />

          <button
            type="button"
            onClick={() => {
              closeAllWindows();
              onClose();
            }}
            aria-label="Close all windows"
            data-tip="Close all windows"
            className="os-tip grid size-8 place-items-center rounded-md text-muted transition-colors hover:bg-white/8 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
          >
            <Power size={14} strokeWidth={1.7} />
          </button>
        </span>
      </footer>
    </motion.div>
  );
}

export function WindowsStartMenu({ isOpen, onClose, triggerRef }: WindowsStartMenuProps) {
  return (
    <AnimatePresence>
      {isOpen ? <StartPanel key="start" onClose={onClose} triggerRef={triggerRef} /> : null}
    </AnimatePresence>
  );
}
