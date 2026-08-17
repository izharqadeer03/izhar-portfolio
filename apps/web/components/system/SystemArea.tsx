'use client';

import { SYSTEM_PROFILE } from '@izhar-os/config';
import { cn, StatusDot } from '@izhar-os/ui';

import { Clock } from '@/components/system/Clock';
import { EnvironmentSwitcher } from '@/components/system/EnvironmentSwitcher';

interface SystemAreaProps {
  /** Adds the clock. Off where the environment already shows one elsewhere. */
  showClock?: boolean;
  /** `bar` sits inside a menu bar or panel; `floating` sits on the desktop. */
  tone?: 'floating' | 'bar';
  className?: string;
  placement?: 'top' | 'bottom';
}

/**
 * The system area: availability, workspace, and — where the
 * environment has no other clock — the time.
 */
export function SystemArea({
  showClock = false,
  tone = 'floating',
  className,
  placement = 'bottom',
}: SystemAreaProps) {
  const { status } = SYSTEM_PROFILE;

  return (
    <div
      className={cn(
        'flex items-center',
        tone === 'floating'
          ? 'gap-2 rounded-xl border border-line bg-surface/55 px-2 py-1.5 backdrop-blur-xl'
          : 'gap-1.5',
        className,
      )}
    >
      <span
        className={cn(
          'os-tip flex items-center gap-2',
          tone === 'floating' ? 'ps-1.5 pe-1' : 'rounded-md px-2 py-1 hover:bg-white/10',
        )}
        data-tip={status.detail}
      >
        <StatusDot state={status.state} />
        <span className="text-[11.5px] font-medium text-muted">{status.label}</span>
      </span>

      <span
        className={cn('h-4 w-px shrink-0 bg-line', tone === 'bar' && 'mx-0.5')}
        role="presentation"
      />

      <EnvironmentSwitcher tone={tone === 'floating' ? 'floating' : 'bar'} placement={placement} />

      {showClock ? (
        <>
          <span className="mx-0.5 h-4 w-px shrink-0 bg-line" role="presentation" />
          <Clock compact className="pe-1 ps-1" />
        </>
      ) : null}
    </div>
  );
}
