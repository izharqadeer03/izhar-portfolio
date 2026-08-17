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

import { AppArt } from '@/components/applications/AppArt';

export { AppArt } from '@/components/applications/AppArt';

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
   */
  fill?: boolean;
}

/**
 * The framed application icon.
 *
 * Renders rich, bespoke 3D and glassmorphic vector artwork for each application,
 * framed in the active environment's iconic material geometry (Fluent, Aqua, Yaru).
 */
export const AppTile = memo(function AppTile({
  icon,
  accent,
  size = 46,
  className,
  muted = false,
  fill = false,
}: AppTileProps) {
  return (
    <span
      className={cn(
        'relative grid shrink-0 place-items-center select-none overflow-visible',
        className,
      )}
      style={
        {
          ...(fill ? { width: '100%', height: '100%' } : { width: size, height: size }),
          ['--tile-accent' as string]: ACCENT_VALUE[accent],
        } as unknown as CSSProperties
      }
    >
      <AppArt
        icon={icon}
        size={fill ? undefined : size}
        isMuted={muted}
        className={fill ? 'size-full' : undefined}
      />
    </span>
  );
});



