import type { ComponentPropsWithoutRef, Ref } from 'react';

import { cn } from '../lib/cn';

export type OSButtonVariant = 'ghost' | 'subtle' | 'accent' | 'control';
export type OSButtonSize = 'sm' | 'md' | 'icon';

export interface OSButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: OSButtonVariant;
  size?: OSButtonSize;
  ref?: Ref<HTMLButtonElement>;
}

const VARIANTS: Record<OSButtonVariant, string> = {
  ghost: 'text-muted hover:text-fg hover:bg-white/6 active:bg-white/10',
  subtle: 'text-fg/90 bg-white/4 hover:bg-white/8 border border-line active:bg-white/12',
  accent:
    'text-void bg-accent hover:bg-accent/90 active:bg-accent/80 font-medium shadow-[0_0_20px_-6px] shadow-accent/60',
  control: 'text-muted hover:text-fg hover:bg-white/8 active:bg-white/12',
};

const SIZES: Record<OSButtonSize, string> = {
  sm: 'h-7 px-2.5 text-xs gap-1.5',
  md: 'h-9 px-3.5 text-sm gap-2',
  icon: 'size-8 justify-center',
};

/**
 * Every clickable control in the OS. Always a real <button>, always with a
 * visible focus ring — the desktop is fully keyboard operable.
 */
export function OSButton({
  variant = 'ghost',
  size = 'md',
  className,
  type = 'button',
  ref,
  ...props
}: OSButtonProps) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex cursor-default select-none items-center rounded-lg',
        'transition-[background-color,color,transform,box-shadow] duration-150 ease-os',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-deep',
        'disabled:pointer-events-none disabled:opacity-40',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  );
}
