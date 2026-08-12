/**
 * Environment domain — the *presentation layer* of IZHAR OS.
 *
 * An environment is not a theme and not an application. It decides how the
 * workspace is arranged, what the chrome looks like and how navigation behaves.
 * The applications, the window manager and the profile beneath it are shared:
 * one system, three ways of looking at it.
 */

export type EnvironmentId = 'windows' | 'macos' | 'linux';

/** Which recognizable mark identifies an environment in the selector. */
export type EnvironmentLogo = 'windows' | 'apple' | 'tux';

export interface EnvironmentDefinition {
  id: EnvironmentId;
  /** Name shown in the selector and the transition, e.g. "macOS". */
  name: string;
  /** Condensed name for tight chrome, e.g. the mobile switcher. */
  shortName: string;
  logo: EnvironmentLogo;
  /** One line describing how this environment feels to use. */
  tagline: string;
  /** Three adjectives that describe the environment's personality. */
  personality: [string, string, string];
  /** What the visitor will actually see change, e.g. "Taskbar · Start menu". */
  chromeSummary: string;
  /** Name of this environment's file manager — Explorer, Finder, Files. */
  fileManager: string;
  /**
   * The environment's own accent, in hex.
   *
   * Used by chrome that belongs to the environment: selection, running
   * indicators, hover states, focus rings inside a shell. IZHAR cyan stays the
   * brand accent for the OS mark, the boot screen and application icons, so the
   * hierarchy IZHAR → IZHAR OS → environment is visible in the colour itself.
   */
  accent: string;
  /**
   * Ambient tint for the environment behind the interface. Atmospheric only —
   * this is what makes an Ubuntu desktop feel like one from across the room.
   */
  ambient: {
    /** Primary pool of light. */
    primary: string;
    /** Secondary pool, drifting against the first. */
    secondary: string;
    /** Strength of the engineering grid, 0..1. */
    grid: number;
  };
}
