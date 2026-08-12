'use client';

import { SYSTEM_PROFILE } from '@izhar-os/config';
import type { EnvironmentId } from '@izhar-os/types';
import { cn, StatusDot } from '@izhar-os/ui';
import { motion } from 'motion/react';

import { useEnvironment } from '@/hooks/useEnvironment';
import { usePrefersReducedMotion } from '@/hooks/useSystemPreferences';

interface IdentityStyle {
  /** Position within the desktop surface. */
  wrapper: string;
  align: 'center' | 'start';
  name: string;
  role: string;
  disciplines: string;
  statement: string;
}

/**
 * The same five facts, arranged in each environment's own voice.
 *
 * Windows centres them and leans on weight; macOS lifts them, thins them and
 * gives them air; Linux left-aligns them and sets them in mono, the way a
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
    wrapper: 'left-0 top-[24%] items-start ps-2 pe-6 text-left',
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
  const reducedMotion = usePrefersReducedMotion();

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reducedMotion ? 0 : 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reducedMotion ? 0.12 : 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <div
      className={cn('pointer-events-none absolute z-10 flex flex-col select-none', style.wrapper)}
    >
      <motion.h1 key={`${environment}-name`} {...rise(0.05)} className={cn('text-fg', style.name)}>
        {SYSTEM_PROFILE.name}
      </motion.h1>

      <motion.p
        key={`${environment}-role`}
        {...rise(0.11)}
        className={cn('env-accent', style.role)}
      >
        {SYSTEM_PROFILE.role}
      </motion.p>

      <motion.p
        key={`${environment}-disciplines`}
        {...rise(0.16)}
        className={cn('flex flex-wrap items-center text-muted', style.disciplines)}
      >
        {SYSTEM_PROFILE.disciplines.map((discipline, index) => (
          <span key={discipline} className="flex items-center gap-3">
            {index > 0 ? (
              <span className="size-[3px] rounded-full bg-faint" aria-hidden="true" />
            ) : null}
            <span>{discipline}</span>
          </span>
        ))}
      </motion.p>

      <motion.p
        key={`${environment}-statement`}
        {...rise(0.21)}
        className={cn('text-faint', style.statement)}
      >
        {SYSTEM_PROFILE.statement}
      </motion.p>

      <motion.p
        key={`${environment}-status`}
        {...rise(0.26)}
        className={cn(
          'mt-6 flex items-center gap-2 rounded-full border border-line bg-surface/45 px-3 py-1.5 backdrop-blur-xl',
          style.align === 'center' ? 'self-center' : 'self-start',
        )}
      >
        <StatusDot state={SYSTEM_PROFILE.status.state} />
        <span className="text-[11.5px] font-medium text-fg/85">
          {SYSTEM_PROFILE.status.label} for opportunities
        </span>
      </motion.p>
    </div>
  );
}
