import type { RenderTier, SceneBudget } from '@izhar-os/types';

/**
 * The IZHAR OS palette in raw hex.
 *
 * These values are mirrored as CSS custom properties in `apps/web/app/globals.css`
 * (`@theme`). They exist here in JS form because WebGL materials and lights need
 * numeric colors — Tailwind classes cannot reach into the 3D scene.
 * Keep the two in sync when changing a value.
 */
export const PALETTE = {
  /** Deepest background, behind everything. */
  void: '#050608',
  deep: '#080b10',
  base: '#0b0f15',
  /** Panels, windows, taskbar. */
  surface: '#10151d',
  raised: '#141a23',
  /** Electric cyan — the primary accent, used sparingly. */
  accent: '#38cfe8',
  /** Secondary violet, for depth and contrast in the environment. */
  violet: '#7a6cf0',
  foreground: '#ffffff',
  muted: '#8a94a6',
  faint: '#5a6373',
} as const;

/**
 * Rendering budgets per capability tier. The scene reads these instead of
 * hardcoding counts, so a weak device gets a genuinely lighter scene rather
 * than the same scene at a lower frame rate.
 */
export const SCENE_BUDGETS: Record<RenderTier, SceneBudget> = {
  high: {
    tier: 'high',
    particleCount: 520,
    nodeCount: 34,
    maxPixelRatio: 1.75,
    enableConnections: true,
    enableFloatingGeometry: true,
  },
  balanced: {
    tier: 'balanced',
    particleCount: 220,
    nodeCount: 18,
    maxPixelRatio: 1.35,
    enableConnections: true,
    enableFloatingGeometry: false,
  },
  minimal: {
    tier: 'minimal',
    particleCount: 0,
    nodeCount: 0,
    maxPixelRatio: 1,
    enableConnections: false,
    enableFloatingGeometry: false,
  },
};

/** Motion vocabulary — one easing curve and a few durations, used everywhere. */
export const MOTION = {
  ease: [0.2, 0.8, 0.2, 1] as const,
  easeOut: [0.16, 1, 0.3, 1] as const,
  duration: {
    instant: 0.12,
    fast: 0.18,
    normal: 0.24,
    slow: 0.4,
  },
} as const;

/** Boot choreography, in milliseconds. Kept short on purpose. */
export const BOOT_TIMELINE = {
  identity: 220,
  status: 560,
  progressDuration: 1000,
  ready: 1560,
  reveal: 1880,
  /** Total sequence when prefers-reduced-motion is set. */
  reducedTotal: 520,
} as const;
