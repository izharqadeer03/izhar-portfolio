import { cn } from '@izhar-os/ui';

export interface OSMarkProps {
  /** Rendered size in pixels. */
  size?: number;
  className?: string;
  /** Draws the outer aperture. Off for very small sizes where it muddies. */
  frame?: boolean;
  title?: string;
}

/**
 * The IZHAR OS mark.
 *
 * An aperture rotated onto its point with a Z inscribed inside it — the "I" is
 * the vertical axis of the diamond, the "Z" is the path drawn through it.
 * Original, geometric, and legible down to 16px.
 */
export function OSMark({ size = 24, className, frame = true, title }: OSMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={cn('shrink-0', className)}
    >
      {frame ? (
        <path
          d="M12 1.6 22.4 12 12 22.4 1.6 12 12 1.6Z"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinejoin="round"
          opacity="0.32"
        />
      ) : null}
      <path
        d="M8.4 8.6h7.2L8.4 15.4h7.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
