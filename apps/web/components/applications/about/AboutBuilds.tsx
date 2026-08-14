'use client';

import { ABOUT_PROFILE, MOTION } from '@izhar-os/config';
import { cn } from '@izhar-os/ui';
import { motion } from 'motion/react';
import type { CSSProperties, RefObject } from 'react';

import { AppGlyph, getAccentValue } from '@/components/applications/AppIcon';
import { useApplicationChrome } from '@/hooks/useEnvironment';
import { usePrefersReducedMotion } from '@/hooks/useSystemPreferences';

interface AboutBuildsProps {
  root: RefObject<HTMLElement | null>;
}

/**
 * What I build, as five categories.
 *
 * Each card keeps its own accent from the manifest palette — the same six
 * tints the desktop icons use — so the section reads as part of the system
 * rather than as a colour scheme invented for one screen. The technologies
 * underneath are the point: the summary says what it is, the tags say what
 * it is made of.
 */
export function AboutBuilds({ root }: AboutBuildsProps) {
  const chrome = useApplicationChrome();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <ul className="grid gap-3 @min-[600px]:grid-cols-2 @min-[960px]:grid-cols-3">
      {ABOUT_PROFILE.buildAreas.map((area, index) => (
        <motion.li
          key={area.id}
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ root, once: true, amount: 0.25 }}
          transition={{ duration: 0.34, delay: index * 0.05, ease: MOTION.easeOut }}
          className={cn(
            'group relative overflow-hidden p-4',
            chrome.cardClass,
            'transition-[transform,border-color,box-shadow] duration-200 ease-env',
            'hover:-translate-y-[2px] hover:border-line-strong hover:shadow-[0_18px_36px_-24px_rgba(0,0,0,0.95)]',
          )}
          style={
            {
              borderRadius: chrome.cardRadius,
              '--area-accent': getAccentValue(area.accent),
            } as CSSProperties
          }
        >
          {/* The card's own light, bottom-weighted so the tile looks lit from within. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 ease-env group-hover:opacity-100"
            style={{
              background:
                'radial-gradient(120% 90% at 50% 130%, color-mix(in oklab, var(--area-accent) 16%, transparent), transparent 70%)',
            }}
          />

          <div className="relative flex items-start gap-3">
            <span
              className="grid size-9 shrink-0 place-items-center border border-line transition-colors duration-200 group-hover:border-line-strong"
              style={{
                borderRadius: chrome.controlRadius + 2,
                background:
                  'linear-gradient(to bottom, rgba(255,255,255,0.07), rgba(255,255,255,0.015))',
                color: 'var(--area-accent)',
              }}
            >
              <AppGlyph icon={area.icon} size={16} strokeWidth={1.6} />
            </span>

            <div className="min-w-0">
              <h4 className="text-[13px] font-medium tracking-tight text-fg">{area.title}</h4>
              <p className="mt-1.5 text-[12px] leading-snug text-muted">{area.summary}</p>
            </div>
          </div>

          <ul className="relative mt-3.5 flex flex-wrap gap-1.5">
            {area.tags.map((tag) => (
              <li
                key={tag}
                className="border border-line/70 px-1.5 py-0.5 font-mono text-[10px] tracking-[0.04em] text-faint transition-colors duration-200 group-hover:text-muted"
                style={{ borderRadius: chrome.controlRadius - 1 }}
              >
                {tag}
              </li>
            ))}
          </ul>
        </motion.li>
      ))}
    </ul>
  );
}
