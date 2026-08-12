import type { EnvironmentLogo } from '@izhar-os/types';
import { cn } from '@izhar-os/ui';

/**
 * Marks that identify each environment.
 *
 * These are secondary identifiers and are used in exactly three places — the
 * workspace selector, the switching transition and the system area. IZHAR OS
 * remains the primary brand everywhere else; scattering these through the
 * interface would turn one portfolio into three borrowed ones.
 *
 * Drawn as flat single-colour glyphs so they sit at the same optical weight as
 * the rest of the system's iconography and inherit `currentColor`.
 */

interface OSLogoProps {
  size?: number;
  className?: string;
}

/** Four panes in perspective — the modern Windows mark. */
export function WindowsLogo({ size = 16, className }: OSLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      <path d="M3 5.4 11.1 4.3v7.2H3V5.4Z" />
      <path d="M12.3 4.13 21 3v8.5h-8.7V4.13Z" />
      <path d="M3 12.7h8.1v7.2L3 18.8v-6.1Z" />
      <path d="M12.3 12.7H21V21l-8.7-1.17V12.7Z" />
    </svg>
  );
}

/** The Apple silhouette. */
export function AppleLogo({ size = 16, className }: OSLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      <path d="M17.29 12.63c-.03-2.72 2.22-4.03 2.32-4.09-1.27-1.85-3.24-2.1-3.94-2.13-1.68-.17-3.27.98-4.12.98-.85 0-2.16-.96-3.55-.93-1.83.03-3.51 1.06-4.45 2.69-1.9 3.29-.48 8.17 1.36 10.85.9 1.31 1.97 2.78 3.38 2.73 1.35-.06 1.87-.88 3.5-.88 1.63 0 2.1.88 3.53.85 1.46-.02 2.38-1.33 3.27-2.65 1.03-1.52 1.46-2.99 1.48-3.06-.03-.01-2.84-1.09-2.87-4.32Z" />
      <path d="M14.83 4.63c.74-.9 1.25-2.15 1.11-3.4-1.07.05-2.37.72-3.14 1.61-.69.79-1.3 2.07-1.14 3.29 1.2.09 2.42-.61 3.17-1.5Z" />
    </svg>
  );
}

/** Tux, reduced to the shapes that still read as Tux at 14px. */
export function TuxLogo({ size = 16, className }: OSLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      {/* Body and head, one silhouette. */}
      <path
        d="M12 1.9c-2.36 0-4.05 1.72-4.05 4.06v2.13c0 .93-.4 1.6-1.03 2.42-1.2 1.55-2.13 3.2-2.65 5.16-.29 1.1-.45 2.1-.9 2.93-.36.66-.1 1.44.6 1.72 1.2.47 2.2.2 2.86-.2.2-.13.45-.06.57.14.7 1.14 2.1 1.85 4.6 1.85s3.9-.71 4.6-1.85c.12-.2.37-.27.57-.14.66.4 1.66.67 2.86.2.7-.28.96-1.06.6-1.72-.45-.83-.61-1.83-.9-2.93-.52-1.96-1.45-3.61-2.65-5.16-.63-.82-1.03-1.49-1.03-2.42V5.96c0-2.34-1.69-4.06-4.05-4.06Z"
        fill="currentColor"
      />
      {/* Belly — punched out of the silhouette so it reads on any ground. */}
      <path
        d="M12 11.1c1.9 0 3.35 1.32 4.06 2.9.62 1.4.9 2.86.9 3.94 0 2.06-2.2 3.36-4.96 3.36s-4.96-1.3-4.96-3.36c0-1.08.28-2.55.9-3.95.71-1.57 2.16-2.89 4.06-2.89Z"
        fill="var(--color-void)"
        opacity="0.55"
      />
      {/* Eyes and beak. */}
      <ellipse cx="10.35" cy="6.1" rx="0.95" ry="1.25" fill="var(--color-void)" />
      <ellipse cx="13.65" cy="6.1" rx="0.95" ry="1.25" fill="var(--color-void)" />
      <path
        d="M12 7.05c1.05 0 1.85.5 1.85 1.13 0 .62-.8 1.12-1.85 1.12s-1.85-.5-1.85-1.12c0-.63.8-1.13 1.85-1.13Z"
        fill="#f0a92e"
      />
    </svg>
  );
}

const LOGOS = {
  windows: WindowsLogo,
  apple: AppleLogo,
  tux: TuxLogo,
} as const;

export interface EnvironmentLogoProps extends OSLogoProps {
  logo: EnvironmentLogo;
}

/** Resolves an environment's `logo` key to its mark. */
export function EnvironmentMark({ logo, size, className }: EnvironmentLogoProps) {
  const Logo = LOGOS[logo];
  return <Logo size={size} className={className} />;
}
