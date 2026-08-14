'use client';

import { ABOUT_PROFILE, MOTION } from '@izhar-os/config';
import { cn } from '@izhar-os/ui';
import { motion } from 'motion/react';
import type { RefObject } from 'react';

import { ACCENT_LINE, ACCENT_TEXT, ACCENT_WASH } from '@/components/applications/about/theme';
import { usePrefersReducedMotion } from '@/hooks/useSystemPreferences';

interface AboutJourneyProps {
  root: RefObject<HTMLElement | null>;
}

/**
 * The career progression, as a rail.
 *
 * An ordered list with a line drawn down it: the shape carries the meaning, so
 * a screen reader gets the same sequence a sighted reader does without the
 * decoration being announced. The rail draws itself once as the section
 * arrives, which is the only animation here that is not a fade.
 */
export function AboutJourney({ root }: AboutJourneyProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <ol className="relative ps-7">
      {/* The rail. */}
      <motion.span
        aria-hidden="true"
        className="absolute top-1.5 bottom-3 start-[9px] w-px origin-top"
        style={{
          background: `linear-gradient(to bottom, ${ACCENT_LINE}, var(--color-line) 70%, transparent)`,
        }}
        initial={reducedMotion ? false : { scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ root, once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: MOTION.easeOut }}
      />

      {ABOUT_PROFILE.journey.map((stage, index) => (
        <motion.li
          key={stage.id}
          className="group relative pb-5 last:pb-0"
          initial={reducedMotion ? false : { opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ root, once: true, amount: 0.4 }}
          transition={{ duration: 0.34, delay: index * 0.06, ease: MOTION.easeOut }}
        >
          {/* Marker. The final stage is the current one, so it carries the accent. */}
          <span
            aria-hidden="true"
            className={cn(
              'absolute top-[5px] start-[-22px] grid size-[19px] place-items-center rounded-full border',
              'transition-[background-color,border-color] duration-200 ease-env',
            )}
            style={{
              borderColor:
                index === ABOUT_PROFILE.journey.length - 1 ? ACCENT_LINE : 'var(--color-line)',
              backgroundColor:
                index === ABOUT_PROFILE.journey.length - 1 ? ACCENT_WASH : 'var(--color-void)',
            }}
          >
            <span
              className="size-[5px] rounded-full transition-transform duration-200 ease-env group-hover:scale-125"
              style={{
                backgroundColor:
                  index === ABOUT_PROFILE.journey.length - 1 ? ACCENT_TEXT : 'var(--color-faint)',
              }}
            />
          </span>

          <p
            className={cn(
              'text-[13px] font-medium text-fg/90 transition-colors duration-200',
              'group-hover:text-fg',
            )}
          >
            {stage.label}
          </p>
          <p className="mt-1 max-w-[62ch] text-[12px] leading-snug text-muted">{stage.detail}</p>

          {/* The step number, set as a quiet gutter figure. */}
          <span
            aria-hidden="true"
            className="absolute end-0 top-0 font-mono text-[10px] tracking-[0.14em] text-faint opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </motion.li>
      ))}
    </ol>
  );
}
