'use client';

import { cn } from '@izhar-os/ui';

import { useClock } from '@/hooks/useClock';

interface ClockProps {
  /** Single line, time only — used in the mobile status bar. */
  compact?: boolean;
  className?: string;
}

/**
 * The system clock. Local browser time, ticking on the minute boundary.
 * Renders a stable placeholder before mount so the server and client agree.
 */
export function Clock({ compact = false, className }: ClockProps) {
  const reading = useClock();

  return (
    <time
      dateTime={reading?.iso}
      className={cn('flex flex-col items-end leading-none', className)}
      // Announced on demand rather than on every tick.
      aria-label={reading ? `Current time ${reading.time}` : undefined}
    >
      <span className="text-[12.5px] font-medium tabular-nums text-fg/90">
        {reading?.time ?? '--:--'}
      </span>
      {!compact ? (
        <span className="mt-1 text-[10px] tabular-nums text-faint">{reading?.date ?? '—'}</span>
      ) : null}
    </time>
  );
}
