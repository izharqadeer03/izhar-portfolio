import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';

import { cn } from '../lib/cn';

export type PanelTone = 'surface' | 'raised' | 'sunken';

export interface PanelProps extends ComponentPropsWithoutRef<'div'> {
  tone?: PanelTone;
  /** Adds the 1px inner highlight that gives panels their lift. */
  highlight?: boolean;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

const TONES: Record<PanelTone, string> = {
  surface: 'bg-surface/85 backdrop-blur-2xl',
  raised: 'bg-raised/90 backdrop-blur-2xl',
  sunken: 'bg-void/60',
};

/**
 * The single surface primitive of IZHAR OS. Windows, menus, the taskbar and
 * tray popovers are all Panels, which is what makes the system read as one
 * material rather than a collection of boxes.
 */
export function Panel({
  tone = 'surface',
  highlight = true,
  className,
  children,
  ref,
  ...props
}: PanelProps) {
  return (
    <div
      ref={ref}
      className={cn(
        'relative rounded-xl border border-line',
        TONES[tone],
        highlight &&
          'before:pointer-events-none before:absolute before:inset-x-3 before:top-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-white/12 before:to-transparent',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
