'use client';

import { SYSTEM_PROFILE } from '@izhar-os/config';
import { cn, StatusDot } from '@izhar-os/ui';

interface SystemStatusProps {
  /** Hides the visible label; the text stays available to screen readers. */
  iconOnly?: boolean;
  className?: string;
}

/**
 * Availability indicator.
 *
 * This reports whether the operator is open to work — it is not a network or
 * device reading, and the OS never pretends otherwise. Static in Phase 1; the
 * shape it consumes is already what a remote source would return.
 */
export function SystemStatus({ iconOnly = false, className }: SystemStatusProps) {
  const { status } = SYSTEM_PROFILE;

  return (
    <div className={cn('os-tip flex items-center gap-2', className)} data-tip={status.detail}>
      <StatusDot state={status.state} />

      <span
        className={cn(
          'text-[11.5px] font-medium text-muted',
          // Hidden visually on compact chrome, never hidden from assistive tech.
          iconOnly && 'sr-only',
        )}
      >
        {status.label}
      </span>

      <span className="sr-only">{status.detail}</span>
    </div>
  );
}
