import { DEFAULT_ENVIRONMENT, ENVIRONMENT_STORAGE_KEY, isEnvironmentId } from '@izhar-os/config';
import type { EnvironmentId } from '@izhar-os/types';
import { create } from 'zustand';

/**
 * Which environment the workspace is currently rendered through.
 *
 * Deliberately tiny: an id, and the id being switched *to*. Everything else —
 * open windows, icon placements, the profile, the application registry — lives
 * in the stores it already lived in, and survives a switch untouched. That is
 * the whole point of the architecture: the environment is a presentation layer,
 * not a second copy of the system.
 */
interface EnvironmentStoreState {
  environment: EnvironmentId;
  /**
   * The environment being transitioned to, or null when settled. The desktop
   * keeps rendering `environment` until the transition commits, so the swap
   * happens behind the overlay rather than in front of the visitor.
   */
  pending: EnvironmentId | null;
  /** True once the stored preference has been read. */
  hydrated: boolean;
  /** True when this visitor has chosen an environment before, in any session. */
  hasChosen: boolean;

  /** Reads the stored preference. Safe to call more than once. */
  hydrate: () => void;
  /**
   * Records a first-run choice, without a transition.
   *
   * The switching curtain exists to cover a desktop being rebuilt in front of
   * someone. On arrival there is nothing to cover — the desktop has not been
   * revealed yet — so this settles immediately and the visitor lands in the
   * environment they picked, as though it had always been theirs.
   */
  chooseEnvironment: (id: EnvironmentId) => void;
  /** Begins a switch. A no-op if already there, or if one is already running. */
  requestEnvironment: (id: EnvironmentId) => void;
  /** Swaps the renderer. Called by the transition at its midpoint. */
  commitPending: () => void;
  /** Clears the transition once the overlay has left. */
  endTransition: () => void;
}

function readStoredEnvironment(): { environment: EnvironmentId; hasChosen: boolean } {
  if (typeof window === 'undefined') {
    return { environment: DEFAULT_ENVIRONMENT, hasChosen: false };
  }

  try {
    const stored = window.localStorage.getItem(ENVIRONMENT_STORAGE_KEY);
    if (isEnvironmentId(stored)) return { environment: stored, hasChosen: true };
  } catch {
    // Private browsing, or storage disabled entirely. The default is a fine
    // answer to "what did they pick last time" when there is no last time.
  }

  return { environment: DEFAULT_ENVIRONMENT, hasChosen: false };
}

function persistEnvironment(id: EnvironmentId): void {
  try {
    window.localStorage.setItem(ENVIRONMENT_STORAGE_KEY, id);
  } catch {
    // Losing the preference is survivable; failing to switch is not.
  }
}

export const useEnvironmentStore = create<EnvironmentStoreState>()((set, get) => ({
  // The server and the first client render must agree, so hydration happens in
  // an effect rather than here — see `useEnvironmentHydration`.
  environment: DEFAULT_ENVIRONMENT,
  pending: null,
  hydrated: false,
  hasChosen: false,

  hydrate: () => {
    if (get().hydrated) return;
    const { environment, hasChosen } = readStoredEnvironment();
    set({ environment, hasChosen, hydrated: true });
  },

  chooseEnvironment: (id) => {
    persistEnvironment(id);
    set({ environment: id, hasChosen: true, pending: null });
  },

  requestEnvironment: (id) => {
    const state = get();
    if (state.pending !== null) return;
    if (state.environment === id) return;
    set({ pending: id });
  },

  commitPending: () => {
    const { pending } = get();
    if (pending === null) return;
    persistEnvironment(pending);
    set({ environment: pending, hasChosen: true });
  },

  endTransition: () => set({ pending: null }),
}));

/**
 * The active environment, readable outside React.
 *
 * The window manager needs the current chrome geometry from plain functions
 * that run during pointer moves, where a hook would be the wrong tool.
 */
export function getActiveEnvironment(): EnvironmentId {
  return useEnvironmentStore.getState().environment;
}
