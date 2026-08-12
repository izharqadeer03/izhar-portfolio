import type { ApplicationId, BootPhase, IconDensity } from '@izhar-os/types';
import { create } from 'zustand';

/** A desktop icon's home, in grid cells rather than pixels. */
export interface GridCell {
  col: number;
  row: number;
}

interface SystemState {
  bootPhase: BootPhase;
  /** Timestamp the desktop became interactive — drives the uptime readout. */
  readyAt: number | null;

  iconDensity: IconDensity;
  iconsVisible: boolean;
  /**
   * Bumped by "Refresh". Layers keyed on it remount, which replays their
   * entrance animation — the OS equivalent of a repaint.
   */
  desktopEpoch: number;
  /** Purely a UI state: IZHAR OS never plays audio or touches device volume. */
  soundEnabled: boolean;

  /**
   * Icons the visitor has moved. Stored as grid cells so the arrangement
   * survives a resize — pixel coordinates would strand icons off-screen.
   * Anything absent falls back to default flow order.
   */
  iconPlacements: Partial<Record<ApplicationId, GridCell>>;
  selectedIconId: ApplicationId | null;

  setBootPhase: (phase: BootPhase) => void;
  setIconDensity: (density: IconDensity) => void;
  setIconsVisible: (visible: boolean) => void;
  refreshDesktop: () => void;
  toggleSound: () => void;
  setIconPlacement: (id: ApplicationId, cell: GridCell) => void;
  arrangeIcons: () => void;
  selectIcon: (id: ApplicationId | null) => void;
}

export const useSystemStore = create<SystemState>()((set) => ({
  bootPhase: 'idle',
  readyAt: null,

  iconDensity: 'comfortable',
  iconsVisible: true,
  desktopEpoch: 0,
  soundEnabled: true,
  iconPlacements: {},
  selectedIconId: null,

  setBootPhase: (phase) =>
    set((state) => ({
      bootPhase: phase,
      readyAt: phase === 'ready' && state.readyAt === null ? Date.now() : state.readyAt,
    })),

  setIconDensity: (iconDensity) => set({ iconDensity }),
  setIconsVisible: (iconsVisible) => set({ iconsVisible }),

  // Refresh clears transient desktop state and replays the icon entrance.
  refreshDesktop: () =>
    set((state) => ({ desktopEpoch: state.desktopEpoch + 1, selectedIconId: null })),

  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

  setIconPlacement: (id, cell) =>
    set((state) => ({ iconPlacements: { ...state.iconPlacements, [id]: cell } })),

  arrangeIcons: () => set({ iconPlacements: {}, selectedIconId: null }),

  selectIcon: (selectedIconId) => set({ selectedIconId }),
}));
