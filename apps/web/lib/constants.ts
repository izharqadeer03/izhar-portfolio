import type { IconDensity } from '@izhar-os/types';

/** Chrome metrics. Mirrored as CSS variables in globals.css. */
export const TASKBAR_HEIGHT = 52;
export const MOBILE_STATUSBAR_HEIGHT = 44;
export const MOBILE_DOCK_HEIGHT = 64;

/** Breakpoint at which the OS switches to its mobile interpretation. */
export const MOBILE_BREAKPOINT = 768;

/** Inset between the desktop icon field and the viewport edges. */
export const DESKTOP_PADDING = 24;

/** Icon cell footprint per density, in pixels. */
export const ICON_CELL: Record<IconDensity, { width: number; height: number }> = {
  comfortable: { width: 92, height: 104 },
  compact: { width: 76, height: 84 },
};

/** Windows stack above the desktop but below the taskbar and menus. */
export const WINDOW_BASE_Z = 100;

/** Cascade step for successive windows, so a new one never lands exactly on the last. */
export const WINDOW_CASCADE_STEP = 30;

/** How much of a window must stay on screen while dragging. */
export const WINDOW_DRAG_MARGIN = 96;
