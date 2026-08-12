import { getApplication } from '@izhar-os/config';
import type {
  ApplicationDefinition,
  ApplicationId,
  Bounds,
  Point,
  Size,
  WindowInstance,
} from '@izhar-os/types';
import { create } from 'zustand';

import { MOBILE_BREAKPOINT, WINDOW_BASE_Z, WINDOW_CASCADE_STEP } from '@/lib/constants';
import { getChromeInsets } from '@/lib/environment';
import { getActiveEnvironment } from '@/lib/store/environment-store';
import { clamp } from '@/lib/utils';

/**
 * The rectangle a window may occupy: the viewport minus whatever chrome the
 * active environment reserves. Its origin is not necessarily (0, 0) — Linux
 * keeps a dock down the left edge and macOS a menu bar across the top.
 */
export interface WorkArea {
  left: number;
  top: number;
  width: number;
  height: number;
  isMobile: boolean;
}

export function getWorkArea(): WorkArea {
  if (typeof window === 'undefined') {
    // Server render: a sensible desktop, never read by the visitor.
    return { left: 0, top: 0, width: 1440, height: 848, isMobile: false };
  }

  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
  const insets = getChromeInsets(getActiveEnvironment(), isMobile);

  return {
    left: insets.left,
    top: insets.top,
    width: Math.max(320, window.innerWidth - insets.left - insets.right),
    height: Math.max(240, window.innerHeight - insets.top - insets.bottom),
    isMobile,
  };
}

/**
 * Places a new window: centred in the work area, nudged up slightly so it reads
 * as floating above the chrome, then cascaded by however many windows are
 * already open.
 */
function computeInitialBounds(
  application: ApplicationDefinition,
  cascadeIndex: number,
  area: WorkArea,
): { position: Point; size: Size } {
  const size: Size = {
    width: clamp(application.defaultSize.width, application.minSize.width, area.width - 48),
    height: clamp(application.defaultSize.height, application.minSize.height, area.height - 48),
  };

  const offset = (cascadeIndex % 5) * WINDOW_CASCADE_STEP;
  const position: Point = {
    x: clamp(
      Math.round(area.left + (area.width - size.width) / 2 + offset - 60),
      area.left + 24,
      Math.max(area.left + 24, area.left + area.width - size.width - 24),
    ),
    y: clamp(
      Math.round(area.top + (area.height - size.height) / 2 + offset - 40),
      area.top + 16,
      Math.max(area.top + 16, area.top + area.height - size.height - 16),
    ),
  };

  return { position, size };
}

interface WindowStoreState {
  windows: WindowInstance[];
  focusedId: string | null;
  /** Monotonic z-index source. Focus assigns the next value. */
  nextZ: number;
  instanceCount: number;

  openWindow: (applicationId: ApplicationId) => void;
  closeWindow: (id: string) => void;
  closeAllWindows: () => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleMinimize: (id: string) => void;
  restoreWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  setWindowPosition: (id: string, position: Point) => void;
  setWindowBounds: (id: string, bounds: Bounds) => void;
  /** Re-clamps every window after a viewport resize so none strand off-screen. */
  reconcileViewport: () => void;
}

export const useWindowStore = create<WindowStoreState>()((set, get) => ({
  windows: [],
  focusedId: null,
  nextZ: WINDOW_BASE_Z,
  instanceCount: 0,

  openWindow: (applicationId) => {
    const state = get();
    const existing = state.windows.find((entry) => entry.applicationId === applicationId);

    // Phase 1 is single-instance per application: relaunching focuses instead.
    if (existing) {
      set({
        focusedId: existing.id,
        nextZ: state.nextZ + 1,
        windows: state.windows.map((entry) =>
          entry.id === existing.id
            ? { ...entry, isMinimized: false, zIndex: state.nextZ + 1 }
            : entry,
        ),
      });
      return;
    }

    const application = getApplication(applicationId);
    if (!application) return;

    const area = getWorkArea();
    const { position, size } = computeInitialBounds(application, state.windows.length, area);
    const id = `${applicationId}:${state.instanceCount + 1}`;
    const zIndex = state.nextZ + 1;

    const instance: WindowInstance = {
      id,
      applicationId,
      title: application.title,
      isOpen: true,
      isMinimized: false,
      // On phones a window is a full-screen view, never a floating pane.
      isMaximized: area.isMobile,
      position,
      size,
      minSize: application.minSize,
      zIndex,
      restoreBounds: area.isMobile ? { ...position, ...size } : null,
      openedAt: Date.now(),
    };

    set({
      windows: [...state.windows, instance],
      focusedId: id,
      nextZ: zIndex,
      instanceCount: state.instanceCount + 1,
    });
  },

  closeWindow: (id) =>
    set((state) => {
      const remaining = state.windows.filter((entry) => entry.id !== id);
      const nextFocus =
        state.focusedId === id
          ? (remaining.filter((entry) => !entry.isMinimized).sort((a, b) => b.zIndex - a.zIndex)[0]
              ?.id ?? null)
          : state.focusedId;

      return { windows: remaining, focusedId: nextFocus };
    }),

  closeAllWindows: () => set({ windows: [], focusedId: null }),

  focusWindow: (id) =>
    set((state) => {
      const target = state.windows.find((entry) => entry.id === id);
      if (!target) return state;
      // Already on top and visible — skip the state churn.
      if (state.focusedId === id && !target.isMinimized) return state;

      const zIndex = state.nextZ + 1;
      return {
        focusedId: id,
        nextZ: zIndex,
        windows: state.windows.map((entry) =>
          entry.id === id ? { ...entry, isMinimized: false, zIndex } : entry,
        ),
      };
    }),

  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((entry) =>
        entry.id === id ? { ...entry, isMinimized: true } : entry,
      ),
      focusedId:
        state.focusedId === id
          ? (state.windows
              .filter((entry) => entry.id !== id && !entry.isMinimized)
              .sort((a, b) => b.zIndex - a.zIndex)[0]?.id ?? null)
          : state.focusedId,
    })),

  toggleMinimize: (id) => {
    const target = get().windows.find((entry) => entry.id === id);
    if (!target) return;
    if (target.isMinimized) {
      get().focusWindow(id);
      return;
    }
    // Clicking the taskbar button of the focused window tucks it away.
    if (get().focusedId === id) {
      get().minimizeWindow(id);
      return;
    }
    get().focusWindow(id);
  },

  restoreWindow: (id) => get().focusWindow(id),

  toggleMaximize: (id) =>
    set((state) => {
      const area = getWorkArea();
      return {
        windows: state.windows.map((entry) => {
          if (entry.id !== id) return entry;

          if (entry.isMaximized && entry.restoreBounds) {
            const { x, y, width, height } = entry.restoreBounds;
            return {
              ...entry,
              isMaximized: false,
              position: { x, y },
              size: { width, height },
              restoreBounds: null,
            };
          }

          return {
            ...entry,
            isMaximized: true,
            restoreBounds: { ...entry.position, ...entry.size },
            position: { x: area.left, y: area.top },
            size: { width: area.width, height: area.height },
          };
        }),
      };
    }),

  setWindowPosition: (id, position) =>
    set((state) => ({
      windows: state.windows.map((entry) => (entry.id === id ? { ...entry, position } : entry)),
    })),

  setWindowBounds: (id, bounds) =>
    set((state) => ({
      windows: state.windows.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              position: { x: bounds.x, y: bounds.y },
              size: { width: bounds.width, height: bounds.height },
            }
          : entry,
      ),
    })),

  reconcileViewport: () =>
    set((state) => {
      const area = getWorkArea();
      return {
        windows: state.windows.map((entry) => {
          if (entry.isMaximized) {
            return {
              ...entry,
              position: { x: area.left, y: area.top },
              size: { width: area.width, height: area.height },
            };
          }

          const width = clamp(entry.size.width, entry.minSize.width, area.width);
          const height = clamp(entry.size.height, entry.minSize.height, area.height);

          return {
            ...entry,
            size: { width, height },
            position: {
              // Always leave a grabbable strip inside the work area, whichever
              // edge the environment's chrome happens to occupy.
              x: clamp(
                entry.position.x,
                area.left - (width - 120),
                Math.max(area.left, area.left + area.width - 120),
              ),
              y: clamp(entry.position.y, area.top, Math.max(area.top, area.top + area.height - 48)),
            },
          };
        }),
      };
    }),
}));

/**
 * `windows` is append-only and never reordered, so its natural order *is*
 * launch order — which is what the taskbar wants. Do not add a sorting selector
 * here: a selector that builds a new array on every call breaks zustand's
 * snapshot caching and sends React into a render loop.
 */
