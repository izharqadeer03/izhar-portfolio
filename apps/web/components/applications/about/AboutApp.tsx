'use client';

import { OS_META, SYSTEM_PROFILE } from '@izhar-os/config';
import { cn } from '@izhar-os/ui';
import { Mail } from 'lucide-react';
import { useCallback, useRef, type ComponentType, type RefObject } from 'react';

import { AboutBuilds } from '@/components/applications/about/AboutBuilds';
import { AboutFocus } from '@/components/applications/about/AboutFocus';
import { AboutHero } from '@/components/applications/about/AboutHero';
import { AboutJourney } from '@/components/applications/about/AboutJourney';
import {
  AboutApplicationList,
  AboutNavigation,
} from '@/components/applications/about/AboutNavigation';
import { AboutProfile } from '@/components/applications/about/AboutProfile';
import { AboutSection } from '@/components/applications/about/AboutSection';
import { AboutStats } from '@/components/applications/about/AboutStats';
import { ABOUT_SECTIONS, ABOUT_SECTION_IDS } from '@/components/applications/about/sections';
import { GithubIcon, LinkedInIcon } from '@/components/system/BrandIcons';
import { useApplicationChrome } from '@/hooks/useEnvironment';
import { useIsNarrow } from '@/hooks/useNarrow';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { useIsMobile, usePrefersReducedMotion } from '@/hooks/useSystemPreferences';

type SectionRoot = RefObject<HTMLElement | null>;

/**
 * What each section contains. Keyed by the descriptor's id, so the order on
 * screen, the order in the navigation and the order here can never disagree.
 */
const SECTION_CONTENT: Record<string, ComponentType<{ root: SectionRoot }>> = {
  profile: AboutProfile,
  snapshot: AboutStats,
  journey: AboutJourney,
  builds: AboutBuilds,
  focus: AboutFocus,
};

/** Below this window width the navigation pane becomes a strip along the top. */
const NARROW_WIDTH = 620;

/**
 * About Izhar — the first portfolio application in IZHAR OS.
 *
 * The content is written once and rendered once; everything that makes it feel
 * like a Windows, macOS or Ubuntu application comes from the environment's
 * application chrome — navigation grammar, radii, density and type — read
 * through `useApplicationChrome`. There is no Windows copy of this screen.
 *
 * The window is its own scroll region and its own container: the layout answers
 * to the window's width rather than the viewport's, so the same application
 * reads correctly at 420px in a restored window and at 1600px maximised.
 */
export function AboutApp() {
  const chrome = useApplicationChrome();
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isNarrow = useIsNarrow(rootRef, NARROW_WIDTH);
  const activeId = useScrollSpy(scrollRef, ABOUT_SECTION_IDS);

  // GNOME switches views from the header; the other two do it from a pane —
  // until the window is too narrow to spare the width for one.
  const stacked = isMobile || isNarrow || chrome.navigation === 'header-tabs';

  const handleSelect = useCallback(
    (id: string) => {
      const container = scrollRef.current;
      const target = container?.querySelector<HTMLElement>(`[data-section="${id}"]`);
      if (!container || !target) return;

      container.scrollTo({
        top: Math.max(0, target.offsetTop - 14),
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    },
    [reducedMotion],
  );

  return (
    <div
      ref={rootRef}
      className={cn('@container flex h-full min-h-0 min-w-0', stacked ? 'flex-col' : 'flex-row')}
    >
      <AboutNavigation
        sections={ABOUT_SECTIONS}
        activeId={activeId}
        onSelect={handleSelect}
        stacked={stacked}
      />

      <div
        ref={scrollRef}
        className="os-scroll os-selectable relative @container min-h-0 min-w-0 flex-1 overflow-y-auto"
      >
        <AboutHero />

        <div
          className="flex flex-col"
          style={{ padding: chrome.contentPadding, rowGap: chrome.sectionGap }}
        >
          {ABOUT_SECTIONS.map((section) => {
            const Content = SECTION_CONTENT[section.id];
            return (
              <AboutSection key={section.id} section={section} root={scrollRef}>
                {Content ? <Content root={scrollRef} /> : null}
              </AboutSection>
            );
          })}

          {/* With no navigation pane there is nowhere else for the rest of the
              workspace to live, so it closes the document instead. */}
          {stacked ? (
            <section aria-label="Portfolio applications">
              <p className={cn(chrome.eyebrowClass, 'pb-3 text-faint')}>Portfolio</p>
              <AboutApplicationList />
            </section>
          ) : null}
        </div>

        <AboutColophon />
      </div>
    </div>
  );
}

/** The closing strip: who wrote this, where to find them, and what it runs on. */
function AboutColophon() {
  const chrome = useApplicationChrome();

  return (
    <footer
      className="flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-line bg-void/25 py-4"
      style={{ paddingInline: chrome.contentPadding }}
    >
      <p className="text-[11.5px] text-faint">
        {SYSTEM_PROFILE.name} · {SYSTEM_PROFILE.role}
      </p>

      <div className="ms-auto flex items-center gap-1">
        {SYSTEM_PROFILE.links.map((link) => (
          <a
            key={link.id}
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel={link.href.startsWith('http') ? 'noreferrer noopener' : undefined}
            aria-label={link.label}
            data-tip={link.label}
            className={cn(
              'os-tip grid size-8 place-items-center text-muted transition-colors duration-150',
              'hover:bg-white/8 hover:text-fg',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70',
            )}
            style={{ borderRadius: chrome.controlRadius }}
          >
            <LinkGlyph icon={link.icon} />
          </a>
        ))}
      </div>

      <p className="w-full font-mono text-[10px] tracking-[0.14em] text-faint/70 uppercase">
        {OS_META.name} {OS_META.version} · {OS_META.channel}
      </p>
    </footer>
  );
}

function LinkGlyph({ icon }: { icon: string }) {
  if (icon === 'github') return <GithubIcon size={14} />;
  if (icon === 'linkedin') return <LinkedInIcon size={14} />;
  return <Mail size={14} strokeWidth={1.7} aria-hidden="true" />;
}
