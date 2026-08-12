import type { AvailabilityState } from '@izhar-os/types';

import { cn } from '../lib/cn';

export interface StatusDotProps {
  state: AvailabilityState;
  /** Adds the slow halo pulse. Disabled automatically under reduced motion. */
  pulse?: boolean;
  className?: string;
}

const STATE_COLOR: Record<AvailabilityState, string> = {
  available: 'bg-emerald-400',
  busy: 'bg-amber-400',
  offline: 'bg-faint',
};

/** Small availability indicator used in the tray, launcher and windows. */
export function StatusDot({ state, pulse = true, className }: StatusDotProps) {
  return (
    <span className={cn('relative inline-flex size-1.5 shrink-0', className)} aria-hidden="true">
      <span className={cn('size-full rounded-full', STATE_COLOR[state])} />
      {pulse && state !== 'offline' ? (
        <span
          className={cn(
            'absolute inset-0 rounded-full opacity-70 motion-safe:animate-halo',
            STATE_COLOR[state],
          )}
        />
      ) : null}
    </span>
  );
}
