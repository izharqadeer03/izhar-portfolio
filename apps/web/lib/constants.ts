/** Chrome metrics. Mirrored as CSS variables in globals.css. */
export const TASKBAR_HEIGHT = 52;
export const MOBILE_STATUSBAR_HEIGHT = 44;
export const MOBILE_DOCK_HEIGHT = 64;

/** Breakpoint at which the OS switches to its mobile interpretation. */
export const MOBILE_BREAKPOINT = 768;

/**
 * Icon cell and tile footprints are *not* here: they differ per environment,
 * and live with the rest of an environment's geometry in `lib/environment.ts`.
 */

/** Windows stack above the desktop but below the taskbar and menus. */
export const WINDOW_BASE_Z = 100;

/** Cascade step for successive windows, so a new one never lands exactly on the last. */
export const WINDOW_CASCADE_STEP = 30;

/** How much of a window must stay on screen while dragging. */
export const WINDOW_DRAG_MARGIN = 96;
