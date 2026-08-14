'use client';

import { MOTION } from '@izhar-os/config';
import { cn } from '@izhar-os/ui';
import { motion } from 'motion/react';
import type { ReactNode, RefObject } from 'react';

import { ACCENT_TEXT } from '@/components/applications/about/theme';
import type { AboutSectionDescriptor } from '@/components/applications/about/sections';
import { useApplicationChrome } from '@/hooks/useEnvironment';
import { usePrefersReducedMotion } from '@/hooks/useSystemPreferences';

interface AboutSectionProps {
  section: AboutSectionDescriptor;
  /** The application's scroll region, which is what "in view" means here. */
  root: RefObject<HTMLElement | null>;
  children: ReactNode;
}

/**
 * The frame every About section shares: an eyebrow in the environment's accent,
 * a heading in the environment's voice, and a single reveal as it enters the
 * window's scroll region.
 *
 * The reveal runs once and only moves 14 pixels — enough to make the content
 * feel like it arrives, not enough to make reading it a waiting game. Under
 * `prefers-reduced-motion` the section is simply there.
 */
export function AboutSection({ section, root, children }: AboutSectionProps) {
  const chrome = useApplicationChrome();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <motion.section
      data-section={section.id}
      aria-labelledby={`about-${section.id}-heading`}
      initial={reducedMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ root, once: true, amount: 0.1 }}
      transition={{ duration: 0.4, ease: MOTION.easeOut }}
    >
      <header>
        <p className={chrome.eyebrowClass} style={{ color: ACCENT_TEXT }}>
          {section.eyebrow}
        </p>
        <h3 id={`about-${section.id}-heading`} className={cn('mt-2 text-fg', chrome.headingClass)}>
          {section.title}
        </h3>
        {section.description ? (
          <p className="mt-1.5 max-w-[62ch] text-[12.5px] leading-relaxed text-muted">
            {section.description}
          </p>
        ) : null}
      </header>

      <div className="mt-4">{children}</div>
    </motion.section>
  );
}
