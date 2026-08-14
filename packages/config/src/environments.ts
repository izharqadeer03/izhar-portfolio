import type { EnvironmentDefinition, EnvironmentId } from '@izhar-os/types';

/**
 * The three environments IZHAR OS can be explored through.
 *
 * Order matters — it is the order of the selector, and Windows leads because it
 * is the default a first-time visitor lands in.
 *
 * Each environment quotes the visual language of a real desktop without
 * borrowing a pixel of it: the palettes below are the recognisable *accents* of
 * Fluent, macOS and Yaru, applied to IZHAR OS's own dark ground so that all
 * three still read as one portfolio.
 */
export const ENVIRONMENTS: EnvironmentDefinition[] = [
  {
    id: 'windows',
    name: 'Windows',
    shortName: 'Windows',
    logo: 'windows',
    tagline: 'A structured desktop with everything where you expect it.',
    personality: ['Structured', 'Familiar', 'Productive'],
    chromeSummary: 'Taskbar · Start menu · Explorer',
    fileManager: 'Explorer',
    // Fluent's dark-theme accent.
    accent: '#4cc2ff',
    ambient: {
      primary: '#2f6fd0',
      secondary: '#7a6cf0',
      grid: 0.55,
    },
  },
  {
    id: 'macos',
    name: 'macOS',
    shortName: 'macOS',
    logo: 'apple',
    tagline: 'More air, fewer edges — the work is left to speak.',
    personality: ['Elegant', 'Minimal', 'Spacious'],
    chromeSummary: 'Menu bar · Dock · Finder',
    fileManager: 'Finder',
    // The macOS system blue.
    accent: '#0a84ff',
    ambient: {
      primary: '#3f6db8',
      secondary: '#b06ab3',
      grid: 0,
    },
  },
  {
    // Id stays `linux`; everything the visitor reads says Ubuntu.
    id: 'linux',
    name: 'Ubuntu',
    shortName: 'Ubuntu',
    logo: 'ubuntu',
    tagline: 'Dense, keyboard-first and built for people who read the source.',
    personality: ['Technical', 'Efficient', 'Configurable'],
    chromeSummary: 'Top bar · Dock · Files · Terminal',
    fileManager: 'Files',
    // Ubuntu orange.
    accent: '#e95420',
    ambient: {
      // Aubergine, the colour Ubuntu has used since 10.04.
      primary: '#77216f',
      secondary: '#e95420',
      grid: 0.9,
    },
  },
];

/** The environment a first-time visitor lands in. */
export const DEFAULT_ENVIRONMENT: EnvironmentId = 'windows';

/** localStorage key holding the visitor's chosen environment. */
export const ENVIRONMENT_STORAGE_KEY = 'izhar-os-environment';

const ENVIRONMENT_INDEX = new Map<EnvironmentId, EnvironmentDefinition>(
  ENVIRONMENTS.map((environment) => [environment.id, environment]),
);

export function getEnvironment(id: EnvironmentId): EnvironmentDefinition {
  // Every id in the union has an entry; the fallback keeps a corrupted
  // localStorage value from taking the desktop down with it.
  return ENVIRONMENT_INDEX.get(id) ?? ENVIRONMENTS[0]!;
}

/** Narrows an unknown value (a stored string, a URL param) to an environment id. */
export function isEnvironmentId(value: unknown): value is EnvironmentId {
  return typeof value === 'string' && ENVIRONMENT_INDEX.has(value as EnvironmentId);
}
