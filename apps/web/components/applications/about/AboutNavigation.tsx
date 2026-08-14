'use client';

import { APPLICATIONS } from '@izhar-os/config';
import type { ApplicationDefinition } from '@izhar-os/types';
import { cn } from '@izhar-os/ui';
import { Activity, Boxes, Compass, Route, UserRound, type LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

import { ACCENT_LINE, ACCENT_TEXT } from '@/components/applications/about/theme';
import type { AboutSectionDescriptor } from '@/components/applications/about/sections';
import { AppGlyph, getAccentValue } from '@/components/applications/AppIcon';
import { isApplicationImplemented } from '@/components/applications/ApplicationRegistry';
import { useApplicationChrome } from '@/hooks/useEnvironment';
import { usePrefersReducedMotion } from '@/hooks/useSystemPreferences';
import { useWindowStore } from '@/lib/store/window-store';

const SECTION_GLYPHS: Record<string, LucideIcon> = {
  profile: UserRound,
  snapshot: Activity,
  journey: Route,
  builds: Boxes,
  focus: Compass,
};

/** The rest of the portfolio, in manifest order. About is the one you are in. */
const PORTFOLIO_APPLICATIONS: ApplicationDefinition[] = APPLICATIONS.filter(
  (application) => application.category === 'workspace' && application.id !== 'about',
);

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-1 focus-visible:ring-offset-deep';

interface AboutNavigationProps {
  sections: AboutSectionDescriptor[];
  activeId: string;
  onSelect: (id: string) => void;
  /** Horizontal arrangement: GNOME's view switcher, and every phone. */
  stacked: boolean;
}

/**
 * The application's navigation.
 *
 * One set of destinations, three grammars: a Fluent navigation rail with a
 * sliding accent indicator, a macOS source list with filled selection pills,
 * and a GNOME view switcher across the top. Which one appears is decided by
 * the environment's application chrome, not by this component's caller — and
 * on a phone all three collapse into a scrollable strip, because a 390px
 * screen has no room for a navigation pane.
 */
export function AboutNavigation({ sections, activeId, onSelect, stacked }: AboutNavigationProps) {
  const chrome = useApplicationChrome();
  const reducedMotion = usePrefersReducedMotion();

  if (stacked) {
    return (
      <nav
        aria-label="About sections"
        className={cn('os-scroll shrink-0 overflow-x-auto', chrome.navSurfaceClass)}
      >
        <ul className="flex w-max items-center gap-1 px-2.5 py-2">
          {sections.map((section) => {
            const isActive = section.id === activeId;
            return (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => onSelect(section.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'relative flex items-center gap-1.5 px-3 py-1.5 text-[12px] whitespace-nowrap',
                    'transition-colors duration-150 ease-env',
                    FOCUS_RING,
                    isActive
                      ? 'bg-white/[0.09] text-fg'
                      : 'text-muted hover:bg-white/[0.05] hover:text-fg/90',
                  )}
                  style={{ borderRadius: chrome.controlRadius }}
                >
                  <SectionGlyph id={section.id} size={13} />
                  {section.label}

                  {isActive ? (
                    <motion.span
                      aria-hidden="true"
                      layoutId={reducedMotion ? undefined : 'about-nav-indicator'}
                      className="absolute inset-x-2 -bottom-[7px] h-[2px]"
                      style={{ backgroundColor: ACCENT_TEXT }}
                      transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
                    />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  const isSourceList = chrome.navigation === 'source-list';

  return (
    <nav
      aria-label="About"
      className={cn('os-scroll shrink-0 overflow-y-auto', chrome.navSurfaceClass)}
      style={{ width: chrome.navWidth }}
    >
      <div className={isSourceList ? 'px-2.5 py-3.5' : 'px-2 py-3'}>
        <p className={cn(chrome.eyebrowClass, 'px-2.5 pb-2 text-faint')}>
          {isSourceList ? 'About' : 'Sections'}
        </p>

        <ul className="space-y-0.5">
          {sections.map((section) => {
            const isActive = section.id === activeId;

            return (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => onSelect(section.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'relative flex w-full items-center gap-2.5 text-[12.5px]',
                    'transition-colors duration-150 ease-env',
                    FOCUS_RING,
                    isSourceList ? 'h-8 px-2.5' : 'h-9 ps-4 pe-2.5',
                    isActive
                      ? isSourceList
                        ? 'text-white'
                        : 'bg-white/[0.075] text-fg'
                      : 'text-muted hover:bg-white/[0.05] hover:text-fg/90',
                  )}
                  style={{
                    borderRadius: chrome.controlRadius,
                    // macOS fills the whole pill; Fluent leaves the row neutral
                    // and speaks through the indicator at its leading edge.
                    backgroundColor: isActive && isSourceList ? 'var(--env-accent)' : undefined,
                  }}
                >
                  {/* Fluent's selection indicator, sliding between rows. */}
                  {isActive && !isSourceList ? (
                    <motion.span
                      aria-hidden="true"
                      layoutId={reducedMotion ? undefined : 'about-nav-indicator'}
                      className="absolute start-1 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full"
                      style={{ backgroundColor: ACCENT_TEXT }}
                      transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
                    />
                  ) : null}

                  <SectionGlyph id={section.id} size={14} />
                  <span className="truncate">{section.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 border-t border-line pt-4">
          <p className={cn(chrome.eyebrowClass, 'px-2.5 pb-2 text-faint')}>Portfolio</p>
          <AboutApplicationList compact />
        </div>
      </div>
    </nav>
  );
}

function SectionGlyph({ id, size }: { id: string; size: number }) {
  const Glyph = SECTION_GLYPHS[id] ?? UserRound;
  return <Glyph size={size} strokeWidth={1.7} aria-hidden="true" className="shrink-0" />;
}

/**
 * The rest of the workspace.
 *
 * Every portfolio application, whether or not it has shipped. An application
 * with a registered view opens a real window; one that has not shipped says so
 * and says when, and is a disabled button rather than a link that lies. The
 * status comes from the manifest and the registry, so this list cannot drift
 * out of step with what the system can actually open.
 */
export function AboutApplicationList({ compact = false }: { compact?: boolean }) {
  const chrome = useApplicationChrome();
  const openWindow = useWindowStore((state) => state.openWindow);

  return (
    <ul className={compact ? 'space-y-0.5' : 'grid gap-2 @min-[560px]:grid-cols-2'}>
      {PORTFOLIO_APPLICATIONS.map((application) => {
        const ready = isApplicationImplemented(application.id);

        return (
          <li key={application.id}>
            <button
              type="button"
              disabled={!ready}
              onClick={() => openWindow(application.id)}
              aria-label={
                ready
                  ? `Open ${application.title}`
                  : `${application.title} — ${application.plannedRelease ?? 'coming soon'}`
              }
              className={cn(
                'flex w-full items-center gap-2.5 text-start transition-colors duration-150 ease-env',
                FOCUS_RING,
                compact
                  ? 'h-8 px-2.5 text-[12.5px]'
                  : 'border border-line px-3 py-2.5 text-[12.5px]',
                ready
                  ? 'text-muted hover:bg-white/[0.05] hover:text-fg'
                  : 'cursor-default text-faint/80',
                !compact && ready && 'hover:border-line-strong',
              )}
              style={{ borderRadius: compact ? chrome.controlRadius : chrome.cardRadius }}
            >
              <span
                className="flex shrink-0"
                style={{
                  color: ready ? getAccentValue(application.accent) : undefined,
                  opacity: ready ? 0.9 : 0.45,
                }}
              >
                <AppGlyph icon={application.icon} size={14} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate">{application.shortTitle}</span>
                {!compact ? (
                  <span className="mt-0.5 block truncate text-[11.5px] text-faint">
                    {application.description}
                  </span>
                ) : null}
              </span>

              {!ready ? (
                <span
                  className="shrink-0 border px-1.5 py-0.5 font-mono text-[9.5px] tracking-[0.1em] uppercase"
                  style={{
                    borderRadius: 999,
                    borderColor: ACCENT_LINE,
                    color: ACCENT_TEXT,
                    opacity: 0.7,
                  }}
                >
                  Soon
                </span>
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
