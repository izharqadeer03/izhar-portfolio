import type { ReactNode } from 'react';

import { cn } from '../lib/cn';

export interface SectionLabelProps {
  children: ReactNode;
  className?: string;
}

/** Uppercase micro-heading that separates regions inside windows and menus. */
export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        'font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-faint',
        className,
      )}
    >
      {children}
    </p>
  );
}

export interface DataRowProps {
  label: string;
  value: ReactNode;
  className?: string;
}

/** Label/value pair used throughout System Information. */
export function DataRow({ label, value, className }: DataRowProps) {
  return (
    <div
      className={cn(
        'flex items-baseline justify-between gap-4 border-b border-line/60 py-2 last:border-b-0',
        className,
      )}
    >
      <span className="text-[13px] text-muted">{label}</span>
      <span className="text-right font-mono text-[13px] text-fg/90">{value}</span>
    </div>
  );
}

export interface SeparatorProps {
  className?: string;
}

export function Separator({ className }: SeparatorProps) {
  return <div className={cn('h-px w-full bg-line', className)} role="presentation" />;
}

export interface KbdProps {
  children: ReactNode;
  className?: string;
}

export function Kbd({ children, className }: KbdProps) {
  return (
    <kbd
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border border-line bg-white/5 px-1.5',
        'font-mono text-[10px] font-medium text-muted',
        className,
      )}
    >
      {children}
    </kbd>
  );
}
