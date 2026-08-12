/**
 * System-level domain types: identity, availability and rendering capability.
 * Everything here is static in Phase 1 and becomes remotely sourced later
 * without changing the shape the UI consumes.
 */

export type BootPhase = 'idle' | 'booting' | 'revealing' | 'ready';

export type AvailabilityState = 'available' | 'busy' | 'offline';

export interface SystemStatus {
  state: AvailabilityState;
  /** Short label rendered in the system tray, e.g. "Available". */
  label: string;
  /** Longer sentence surfaced on hover and in System Information. */
  detail: string;
}

export interface SystemLink {
  id: string;
  label: string;
  href: string;
  /** Icon key resolved by the renderer's icon map. */
  icon: string;
}

export interface SystemProfile {
  /** Display name shown on the desktop and in the launcher. */
  name: string;
  /** Wordmark used as the desktop watermark. */
  wordmark: string;
  role: string;
  /** Three-or-so discipline tags, e.g. Frontend • Backend • AI. */
  disciplines: string[];
  location: string;
  /** Short line used in tight chrome — the launcher footer, window subtitles. */
  tagline: string;
  /**
   * The one sentence the desktop leads with. Longer than the tagline and
   * written to be read on its own, because for most visitors it is the first
   * thing they will read about the operator.
   */
  statement: string;
  /** Human-readable time in the craft, e.g. "3+ Years". */
  experience: string;
  status: SystemStatus;
  links: SystemLink[];
}

export interface OperatingSystemMeta {
  name: string;
  shortName: string;
  version: string;
  /** Human label for the current milestone, e.g. "Phase 1 — Foundation". */
  channel: string;
  description: string;
}

/** Named technology row shown in System Information. */
export interface PlatformEntry {
  label: string;
  value: string;
}

/**
 * Rendering budget tier resolved at runtime from device signals.
 * `minimal` skips WebGL entirely and uses the CSS environment.
 */
export type RenderTier = 'high' | 'balanced' | 'minimal';

export interface SceneBudget {
  tier: RenderTier;
  particleCount: number;
  nodeCount: number;
  /** Upper bound handed to the renderer's device pixel ratio range. */
  maxPixelRatio: number;
  enableConnections: boolean;
  enableFloatingGeometry: boolean;
}

/** Desktop icon layout density, toggled from the desktop context menu. */
export type IconDensity = 'comfortable' | 'compact';
