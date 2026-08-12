import type { ApplicationId } from './application';

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Bounds extends Point, Size {}

/**
 * A live window instance. `id` is unique per instance so the manager can
 * support multiple windows of the same application later without a rewrite.
 */
export interface WindowInstance {
  id: string;
  applicationId: ApplicationId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: Point;
  size: Size;
  minSize: Size;
  zIndex: number;
  /** Bounds to restore to when un-maximizing. */
  restoreBounds: Bounds | null;
  /** Monotonic stamp used to order taskbar buttons by launch time. */
  openedAt: number;
}

/** Which edges a resize gesture is pulling. */
export type ResizeEdge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
