/**
 * Colour expressions used across the About application.
 *
 * They resolve `--env-accent` — the active environment's own accent, published
 * on the desktop root — so a card lit in Fluent blue on Windows is lit in
 * Ubuntu orange on Ubuntu without the component knowing either colour. They live
 * as strings rather than Tailwind classes because `color-mix()` inside an
 * arbitrary class value is unreadable at this density.
 */

/** Accent text, lifted toward white so it stays legible on the dark ground. */
export const ACCENT_TEXT = 'color-mix(in oklab, var(--env-accent) 78%, white)';

/** Accent hairline, for borders that should read as a tint rather than a line. */
export const ACCENT_LINE = 'color-mix(in oklab, var(--env-accent) 42%, transparent)';

/** Quiet accent wash behind a selected or hovered surface. */
export const ACCENT_WASH = 'color-mix(in oklab, var(--env-accent) 14%, transparent)';

/** The pool of light behind the hero plate. */
export const ACCENT_GLOW = 'color-mix(in oklab, var(--env-accent) 30%, transparent)';
