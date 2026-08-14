'use client';

import { ABOUT_PROFILE, MOTION } from '@izhar-os/config';
import { motion } from 'motion/react';
import type { CSSProperties, RefObject } from 'react';

import { ACCENT_TEXT } from '@/components/applications/about/theme';
import { usePrefersReducedMotion } from '@/hooks/useSystemPreferences';

interface AboutFocusProps {
  root: RefObject<HTMLElement | null>;
}

/** Twenty blocks across the track, drawn as a gradient rather than 20 elements. */
const SEGMENTS = 20;
const STEP = 100 / SEGMENTS;
const BLOCKS = `repeating-linear-gradient(90deg, currentColor 0 calc(${STEP}% - 3px), transparent calc(${STEP}% - 3px) ${STEP}%)`;
const MASK = 'linear-gradient(90deg, black 0 var(--fill), transparent var(--fill))';

/** Emphasis, quantised to whole blocks. */
const fillWidth = (emphasis: number) => `${Math.round(emphasis * SEGMENTS) * STEP}%`;

/**
 * Where the work goes.
 *
 * Rendered as blocks rather than percentages on purpose: a filled bar with
 * "92%" beside it claims a measurement nobody took. These are quantised to a
 * twentieth, labelled as emphasis, and each carries a line saying what that
 * emphasis actually consists of — which is the part worth reading.
 *
 * Both tracks are one element each: the blocks are a repeating gradient, so a
 * six-row chart costs twelve nodes rather than two hundred and forty.
 */
export function AboutFocus({ root }: AboutFocusProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    // Capped: a track stretched across a maximised window would read as a
    // progress bar rather than as a chart.
    <ul className="max-w-[620px] space-y-3.5">
      {ABOUT_PROFILE.focusAreas.map((area, index) => (
        <li key={area.id} className="group grid grid-cols-[92px_minmax(0,1fr)] items-center gap-3">
          <span className="truncate text-[12.5px] font-medium text-fg/85 transition-colors duration-200 group-hover:text-fg">
            {area.label}
          </span>

          <span className="flex min-w-0 flex-col gap-1.5">
            <span aria-hidden="true" className="relative block h-[9px] w-full">
              {/* Track and fill are both full width, so their blocks line up
                  exactly; the fill is revealed by a mask rather than by a
                  width, which would have rescaled the blocks as it grew. */}
              <span
                className="absolute inset-0 text-white/10"
                style={{ backgroundImage: BLOCKS }}
              />
              <motion.span
                className="absolute inset-0"
                style={
                  {
                    color: ACCENT_TEXT,
                    backgroundImage: BLOCKS,
                    maskImage: MASK,
                    WebkitMaskImage: MASK,
                    '--fill': reducedMotion ? fillWidth(area.emphasis) : '0%',
                  } as CSSProperties
                }
                whileInView={{ '--fill': fillWidth(area.emphasis) }}
                viewport={{ root, once: true, amount: 0.6 }}
                transition={{
                  duration: reducedMotion ? 0 : 0.62,
                  delay: reducedMotion ? 0 : 0.06 + index * 0.05,
                  ease: MOTION.easeOut,
                }}
              />
            </span>

            <span className="truncate text-[11.5px] text-faint transition-colors duration-200 group-hover:text-muted">
              {area.note}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
