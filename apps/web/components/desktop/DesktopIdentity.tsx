'use client';

import { SYSTEM_PROFILE } from '@izhar-os/config';
import type { EnvironmentId } from '@izhar-os/types';
import { cn, StatusDot } from '@izhar-os/ui';
import { motion } from 'motion/react';

import { useEnvironment, useEnvironmentMotion } from '@/hooks/useEnvironment';
import { useIconField } from '@/hooks/useIconField';
import { useIsMobile, usePrefersReducedMotion } from '@/hooks/useSystemPreferences';

interface IdentityStyle {
  /** Position within the desktop surface. */
  wrapper: string;
  align: 'center' | 'start';
  name: string;
  role: string;
  disciplines: string;
  statement: string;
}

/** Gap left between the identity block and the icon field, in pixels. */
const ICON_FIELD_GAP = 32;

/**
 * The same five facts, arranged in each environment's own voice.
 *
 * Windows centres them and leans on weight; macOS lifts them, thins them and
 * gives them air; Ubuntu left-aligns them and sets them in mono, the way a
 * developer's desktop reads. Nothing is added or removed between the three —
 * that is the point.
 */
const STYLES: Record<EnvironmentId, IdentityStyle> = {
  windows: {
    wrapper: 'inset-x-0 top-[26%] items-center px-6 text-center',
    align: 'center',
    name: 'text-[clamp(1.9rem,4.4vw,3.1rem)] font-semibold tracking-[-0.02em]',
    role: 'mt-2 text-[13px] font-medium tracking-[0.22em] uppercase',
    disciplines: 'mt-4 gap-3 justify-center text-[12px]',
    statement: 'mt-5 max-w-[42ch] text-center text-[13.5px]',
  },
  macos: {
    wrapper: 'inset-x-0 top-[20%] items-center px-6 text-center',
    align: 'center',
    name: 'text-[clamp(2.1rem,5vw,3.6rem)] font-light tracking-[-0.03em]',
    role: 'mt-3 text-[12px] font-medium tracking-[0.34em] uppercase',
    disciplines: 'mt-6 gap-4 justify-center text-[12px]',
    statement: 'mt-7 max-w-[38ch] text-center text-[14px] font-light leading-relaxed',
  },
  linux: {
    // Left-aligned like a tiling desktop, but starting *after* the icon field —
    // the inline start padding is supplied at render time from the field's own
    // measured width, so a denser grid pushes the text rather than colliding
    // with it.
    wrapper: 'inset-x-0 top-[24%] items-start pe-6 text-left',
    align: 'start',
    name: 'font-mono text-[clamp(1.6rem,3.6vw,2.5rem)] font-semibold tracking-[-0.01em]',
    role: 'mt-2 font-mono text-[12px] tracking-[0.2em] uppercase',
    disciplines: 'mt-4 gap-2.5 justify-start font-mono text-[11.5px]',
    statement: 'mt-4 max-w-[46ch] text-left text-[13px]',
  },
};

/**
 * Identity, as part of the desktop rather than as a banner across it.
 *
 * A visitor should know whose workspace this is before they open anything, so
 * this is not decoration and not a watermark — it is real text, it carries the
 * document's only `h1`, and it says the five things that matter: name, role,
 * disciplines, what the work is, and whether the person is available.
 */
export function DesktopIdentity() {
  const environment = useEnvironment();
  const style = STYLES[environment];
  const motionSpec = useEnvironmentMotion();
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const field = useIconField();

  /**
   * Room the icon field has already claimed.
   *
   * On a phone the field fills the top, so the identity starts below it. On a
   * desktop it runs down one edge: a centred block reserves that width on
   * *both* sides so it stays centred on the screen while never reaching the
   * icons, and a left-aligned one simply begins after them. Either way the two
   * never share a pixel, in any environment, at any density.
   */
  const reserved = field.reservedWidth + ICON_FIELD_GAP;
  const clearance: React.CSSProperties = isMobile
    ? { top: field.reservedHeight + ICON_FIELD_GAP }
    : style.align === 'center'
      ? { paddingInline: reserved }
      : field.origin === 'right'
        ? { paddingInlineEnd: reserved }
        : { paddingInlineStart: reserved };

  // A phone has one column and no icon field beside it, so every environment's
  // block centres there — including the ones that left-align on a desktop.
  const align = isMobile ? 'center' : style.align;

  const rise = (delay: number) => ({
    initial: {
      opacity: 0,
      y: reducedMotion ? 0 : motionSpec.rise,
      scale: reducedMotion ? 1 : motionSpec.scaleFrom,
    },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: {
      duration: reducedMotion ? 0.12 : motionSpec.duration,
      delay,
      ease: motionSpec.ease,
    },
  });

  return (
    <div
      className={cn(
        'pointer-events-none absolute z-10 flex flex-col select-none',
        // On a phone the identity is placed below the icon grid, so its own
        // vertical anchor is dropped.
        isMobile ? 'inset-x-0 items-center px-6 text-center' : style.wrapper,
      )}
      style={clearance}
    >
      <motion.h1
        key={`${environment}-name`}
        {...rise(0.05)}
        className={cn('text-fg drop-shadow-[0_2px_16px_rgba(0,0,0,0.85)]', style.name)}
      >
        {SYSTEM_PROFILE.name}
      </motion.h1>

      <motion.p
        key={`${environment}-role`}
        {...rise(0.11)}
        className={cn('env-accent font-semibold drop-shadow-[0_1px_8px_rgba(0,0,0,0.75)]', style.role)}
      >
        {SYSTEM_PROFILE.role}
      </motion.p>

      <motion.p
        key={`${environment}-disciplines`}
        {...rise(0.16)}
        className={cn(
          'flex flex-wrap items-center text-slate-200/95 font-medium drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]',
          style.disciplines,
          isMobile && 'justify-center',
        )}
      >
        {SYSTEM_PROFILE.disciplines.map((discipline, index) => (
          <span key={discipline} className="flex items-center gap-3">
            {index > 0 ? (
              <span className="size-[3.5px] rounded-full bg-white/40" aria-hidden="true" />
            ) : null}
            <span>{discipline}</span>
          </span>
        ))}
      </motion.p>

      <motion.p
        key={`${environment}-statement`}
        {...rise(0.21)}
        className={cn(
          'text-slate-200/90 font-normal leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]',
          isMobile ? 'mt-5 max-w-[38ch] text-center text-[13.5px]' : style.statement,
        )}
      >
        {SYSTEM_PROFILE.statement}
      </motion.p>

      <motion.p
        key={`${environment}-status`}
        {...rise(0.26)}
        className={cn(
          'mt-6 flex items-center gap-2 rounded-full border border-white/10 bg-surface/65 px-3.5 py-1.5 backdrop-blur-xl shadow-lg',
          align === 'center' ? 'self-center' : 'self-start',
        )}
      >
        <StatusDot state={SYSTEM_PROFILE.status.state} />
        <span className="text-[11.5px] font-medium text-fg">
          {SYSTEM_PROFILE.status.label} for opportunities
        </span>
      </motion.p>
    </div>
  );
}
