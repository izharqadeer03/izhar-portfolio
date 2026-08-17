'use client';

import type { AccentKey, EnvironmentId } from '@izhar-os/types';
import { cn } from '@izhar-os/ui';
import {
  AppWindow,
  AtSign,
  Boxes,
  CircuitBoard,
  Cloud,
  Code2,
  Cpu,
  Database,
  FileText,
  FolderOpen,
  Layers,
  type LucideIcon,
  Mail,
  Route,
  Server,
  Terminal,
  UserRound,
  Waypoints,
} from 'lucide-react';
import { memo, type CSSProperties } from 'react';

import { useEnvironment } from '@/hooks/useEnvironment';
import { DESKTOP_ICONS, type TileFinish } from '@/lib/environment';

/**
 * Icon key → glyph. The manifest in @izhar-os/config only stores the key, which
 * keeps that package free of React and makes adding an application a data edit.
 */
const GLYPHS: Record<string, LucideIcon> = {
  user: UserRound,
  projects: Boxes,
  experience: Route,
  skills: Layers,
  ai: CircuitBoard,
  resume: FileText,
  contact: AtSign,
  files: FolderOpen,
  terminal: Terminal,
  system: Cpu,
  mail: Mail,
  code: Code2,
  // Categories of work, used by the About application.
  interface: AppWindow,
  server: Server,
  realtime: Waypoints,
  database: Database,
  cloud: Cloud,
};

/**
 * Per-application accent. Six tints held at one saturation and one lightness so
 * a full desktop reads as one palette rather than a colour wheel — but saturated
 * enough to survive being the *fill* of an icon, which is how Fluent and Aqua
 * both draw one. A tint that only tinted would give the desktop six grey chips.
 */
const ACCENT_VALUE: Record<AccentKey, string> = {
  cyan: 'var(--color-accent)',
  violet: 'var(--color-violet)',
  amber: '#f0a93f',
  emerald: '#35c48c',
  rose: '#ef6f8b',
  slate: '#8fa2bd',
};

export function getAccentValue(accent: AccentKey): string {
  return ACCENT_VALUE[accent];
}

export interface AppGlyphProps {
  icon: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

/** The bare glyph — used in the taskbar, window headers and menus. */
export const AppGlyph = memo(function AppGlyph({
  icon,
  size = 16,
  className,
  strokeWidth = 1.6,
}: AppGlyphProps) {
  const Glyph = GLYPHS[icon] ?? Boxes;
  return <Glyph size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" />;
});

/**
 * The three materials a tile can be made of.
 *
 * `frame` is the plate, `fill` the body of the icon, and `sheen` the highlight
 * across the top — the last only exists on macOS, because a gloss is exactly
 * what separates an Aqua icon from a Fluent or Yaru one.
 *
 * Fluent and Aqua both *fill* an app icon with its colour and set a light glyph
 * on top; only Yaru leaves the plate dark and lets the glyph carry the colour.
 * That single difference is why `glyph` is part of the finish and not a prop.
 */
interface TileFinishSpec {
  frame: string;
  fill: string;
  sheen: string | null;
  /** `light` puts a white glyph on a coloured plate; `accent` does the reverse. */
  glyph: 'light' | 'accent';
}

const FINISHES: Record<TileFinish, TileFinishSpec> = {
  fluent: {
    // Fluent plates are lit from the top-left and edged with one bright hairline.
    frame:
      'border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(0,0,0,0.18),0_6px_14px_-6px_rgba(0,0,0,0.75)]',
    fill: `linear-gradient(160deg,
      color-mix(in oklab, var(--tile-accent) 72%, white) 0%,
      var(--tile-accent) 52%,
      color-mix(in oklab, var(--tile-accent) 76%, black) 100%)`,
    sheen: null,
    glyph: 'light',
  },
  aqua: {
    // Deeper top-to-bottom ramp, a brighter rim and a longer drop — Big Sur's
    // icons sit further off the desktop than anyone else's.
    frame:
      'border border-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.42),inset_0_-2px_4px_rgba(0,0,0,0.16),0_10px_22px_-9px_rgba(0,0,0,0.85)]',
    fill: `linear-gradient(180deg,
      color-mix(in oklab, var(--tile-accent) 62%, white) 0%,
      var(--tile-accent) 48%,
      color-mix(in oklab, var(--tile-accent) 70%, black) 100%)`,
    // The classic gloss, stopping at the tile's waist.
    sheen:
      'linear-gradient(to bottom, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.08) 44%, transparent 52%)',
    glyph: 'light',
  },
  yaru: {
    // No glass and no gradient: a flat aubergine chip with a hard edge.
    frame: 'border border-black/55 bg-[#2b2126] shadow-[0_2px_6px_-3px_rgba(0,0,0,0.95)]',
    fill: 'radial-gradient(100% 100% at 50% 50%, color-mix(in oklab, var(--tile-accent) 26%, transparent) 0%, transparent 72%)',
    sheen: null,
    glyph: 'accent',
  },
};

export interface AppTileProps {
  icon: string;
  accent: AccentKey;
  /** Outer tile size in pixels. */
  size?: number;
  className?: string;
  /** Dims the tile for applications that have not shipped yet. */
  muted?: boolean;
  /** Draw the tile in a specific environment's style rather than the active one. */
  environment?: EnvironmentId;
  /**
   * Fill the parent instead of measuring `size` in pixels, glyph included.
   * The Dock needs this: its icons are sized by a motion value every frame, and
   * a fixed tile inside a growing button would magnify the frame but not the
   * icon standing in it.
   */
  fill?: boolean;
}

/**
 * The framed application icon.
 *
 * One component, three icon sets: the shape, the glyph weight and the material
 * all come from the active environment, so the same application is a Fluent
 * plate, an Aqua squircle or a Yaru disc without a second asset existing.
 * Built from CSS rather than bitmaps, so it stays crisp at every size the OS
 * uses it and costs nothing to restyle.
 */
export const AppTile = memo(function AppTile({
  icon,
  accent,
  size = 46,
  className,
  muted = false,
  environment,
  fill = false,
}: AppTileProps) {
  const active = useEnvironment();
  const style = DESKTOP_ICONS[environment ?? active];
  const finish = FINISHES[style.finish];
  const glyphSize = Math.round(size * style.glyphRatio);
  const glyphPercent = `${Math.round(style.glyphRatio * 100)}%`;

  return (
    <span
      className={cn(
        'relative grid shrink-0 place-items-center overflow-hidden',
        finish.frame,
        'transition-[border-color,box-shadow,border-radius] duration-(--dur-env) ease-env',
        className,
      )}
      style={
        {
          ...(fill ? {} : { width: size, height: size }),
          borderRadius: style.tileRadius,
          '--tile-accent': ACCENT_VALUE[accent],
        } as CSSProperties
      }
    >
      {/* The body of the icon: a colour ramp on Fluent and Aqua, a centred pool
          of light on Yaru, whose plate stays dark. */}
      <span
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: finish.fill, opacity: muted ? 0.55 : 1 }}
      />

      {finish.sheen ? (
        <span aria-hidden="true" className="absolute inset-0" style={{ background: finish.sheen }} />
      ) : null}

      {/* Light glyph on a filled plate, or accent glyph on a dark one. The shadow
          is what keeps a white glyph from floating off a bright fill — kept
          tight, since a soft one under a thin stroke just re-thickens it. */}
      <span
        className="relative flex"
        style={{
          color: finish.glyph === 'light' ? '#ffffff' : 'var(--tile-accent)',
          opacity: muted ? 0.75 : finish.glyph === 'light' ? 1 : 0.95,
          filter:
            finish.glyph === 'light' ? 'drop-shadow(0 0.5px 1px rgba(0,0,0,0.2))' : undefined,
          ...(fill ? { width: glyphPercent, height: glyphPercent } : {}),
        }}
      >
        <AppGlyph
          icon={icon}
          size={glyphSize}
          strokeWidth={style.glyphStroke}
          className={fill ? 'size-full' : undefined}
        />
      </span>
    </span>
  );
});

