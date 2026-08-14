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

/**
 * Ubuntu's Circle of Friends: three figures joined in a ring.
 *
 * Built from one stroked circle rather than three drawn arcs — `pathLength`
 * normalises the circumference to 90 units, so the dashes divide it into exact
 * thirds and the three heads land in the gaps by construction rather than by
 * hand-fitted path data.
 */
export function UbuntuLogo({ size = 16, className }: OSLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      {/* The ring, broken into three arcs. The offset is half a dash, which
          starts the pattern mid-arc so a gap sits over every head. */}
      <circle
        cx="12"
        cy="12"
        r="7.2"
        stroke="currentColor"
        strokeWidth="2.4"
        pathLength="90"
        strokeDasharray="17 13"
        strokeDashoffset="8.5"
      />
      {/* The heads, at thirds of the circle. */}
      <circle cx="4.8" cy="12" r="2.5" fill="currentColor" />
      <circle cx="15.6" cy="5.77" r="2.5" fill="currentColor" />
      <circle cx="15.6" cy="18.23" r="2.5" fill="currentColor" />
    </svg>
  );
}

const LOGOS = {
  windows: WindowsLogo,
  apple: AppleLogo,
  ubuntu: UbuntuLogo,
} as const;

export interface EnvironmentLogoProps extends OSLogoProps {
  logo: EnvironmentLogo;
}

/** Resolves an environment's `logo` key to its mark. */
export function EnvironmentMark({ logo, size, className }: EnvironmentLogoProps) {
  const Logo = LOGOS[logo];
  return <Logo size={size} className={className} />;
}
