'use client';

import { SYSTEM_PROFILE } from '@izhar-os/config';
import type { EnvironmentId } from '@izhar-os/types';
import { cn, StatusDot } from '@izhar-os/ui';
import { motion } from 'motion/react';

import { useEnvironment, useEnvironmentMotion } from '@/hooks/useEnvironment';
import { usePrefersReducedMotion } from '@/hooks/useSystemPreferences';

/**
 * Where the widget sits, and how it is drawn.
 *
 * Each environment puts it somewhere its own chrome leaves free, and dresses it
 * the way that environment dresses a small panel: Fluent's acrylic plate,
 * macOS's vibrant rounded card, Yaru's flat dense readout.
 */
const PLACEMENT: Record<EnvironmentId, { position: string; surface: string; radius: string }> = {
  windows: {
    position: 'right-4 bottom-4',
    surface: 'fluent-acrylic border border-line',
    radius: 'rounded-xl',
  },
  macos: {
    position: 'left-6 bottom-6',
    surface: 'mac-vibrancy border border-line',
    radius: 'rounded-2xl',
  },
  linux: {
    position: 'right-4 bottom-4',
    surface: 'yaru-surface border border-black/40',
    radius: 'rounded-lg',
  },
};

/**
 * The profile widget.
 *
 * An OS widget, not a marketing card: no call to action, no border-glow, no
 * gradient headline. It reports five facts at a glance the way a desktop widget
 * reports the weather, and it is the only place on the desktop that states the
 * years of experience.
 *
 * Hidden below `lg` — on a smaller desktop the identity block above it already
 * carries every one of these facts, and two copies of the same information is
 * worse than one.
 */
export function ProfileWidget() {
  const environment = useEnvironment();
  const placement = PLACEMENT[environment];
  const motionSpec = useEnvironmentMotion();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <motion.aside
      key={environment}
      aria-label="Profile"
      className={cn(
        'absolute z-10 hidden w-[212px] select-none p-3.5 lg:block',
        placement.position,
        placement.surface,
        placement.radius,
      )}
      style={{ boxShadow: '0 22px 50px -22px rgba(0,0,0,0.85)' }}
      initial={{
        opacity: 0,
        y: reducedMotion ? 0 : motionSpec.rise,
        scale: reducedMotion ? 1 : motionSpec.scaleFrom,
      }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: reducedMotion ? 0.12 : motionSpec.duration,
        delay: 0.4,
        ease: motionSpec.ease,
      }}
    >
      <p className="text-[12.5px] font-semibold tracking-tight text-fg">{SYSTEM_PROFILE.name}</p>
      <p className="mt-0.5 text-[11.5px] text-muted">{SYSTEM_PROFILE.role}</p>

      <div className="mt-3 h-px bg-line" role="presentation" />

      <dl className="mt-3 space-y-1.5">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-[11px] text-faint">Experience</dt>
          <dd className="font-mono text-[11.5px] text-fg/85">{SYSTEM_PROFILE.experience}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-[11px] text-faint">Location</dt>
          <dd className="font-mono text-[11.5px] text-fg/85">{SYSTEM_PROFILE.location}</dd>
        </div>
      </dl>

      <div className="mt-3 flex flex-wrap gap-1">
        {SYSTEM_PROFILE.disciplines.map((discipline) => (
          <span
            key={discipline}
            className="rounded border border-line bg-white/[0.035] px-1.5 py-0.5 text-[10.5px] text-muted"
          >
            {discipline}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
        <StatusDot state={SYSTEM_PROFILE.status.state} />
        <span className="text-[11px] font-medium text-fg/85">{SYSTEM_PROFILE.status.label}</span>
      </div>
    </motion.aside>
  );
}
