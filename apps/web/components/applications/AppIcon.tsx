'use client';

import type { AccentKey } from '@izhar-os/types';
import { cn } from '@izhar-os/ui';
import {
  AtSign,
  Boxes,
  CircuitBoard,
  Cpu,
  FileText,
  FolderOpen,
  Layers,
  type LucideIcon,
  Mail,
  Route,
  Terminal,
  UserRound,
} from 'lucide-react';
import type { CSSProperties } from 'react';

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
};

/**
 * Per-application accent. Six tints, all desaturated toward the same value so
 * a full desktop of icons reads as one palette rather than a colour wheel.
 */
const ACCENT_VALUE: Record<AccentKey, string> = {
  cyan: 'var(--color-accent)',
  violet: 'var(--color-violet)',
  amber: '#e2b070',
  emerald: '#63cfa5',
  rose: '#e28ba0',
  slate: '#9fb0c6',
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
export function AppGlyph({ icon, size = 16, className, strokeWidth = 1.6 }: AppGlyphProps) {
  const Glyph = GLYPHS[icon] ?? Boxes;
  return <Glyph size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" />;
}

export interface AppTileProps {
  icon: string;
  accent: AccentKey;
  /** Outer tile size in pixels. */
  size?: number;
  className?: string;
  /** Dims the tile for applications that have not shipped yet. */
  muted?: boolean;
}

/**
 * The framed application icon.
 *
 * A single tile treatment — hairline border, top-lit gradient, and a soft pool
 * of the application's accent behind the glyph. Built from CSS rather than
 * bitmaps so it stays crisp at every size the OS uses it.
 */
export function AppTile({ icon, accent, size = 46, className, muted = false }: AppTileProps) {
  const glyphSize = Math.round(size * 0.46);

  return (
    <span
      className={cn(
        'relative grid place-items-center overflow-hidden rounded-[26%]',
        'border border-line bg-linear-to-b from-white/8 to-white/[0.015]',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_6px_16px_-8px_rgba(0,0,0,0.9)]',
        'transition-[border-color,box-shadow] duration-200 ease-os',
        className,
      )}
      style={
        {
          width: size,
          height: size,
          '--tile-accent': ACCENT_VALUE[accent],
        } as CSSProperties
      }
    >
      {/* Accent pool, bottom-weighted so the tile looks lit from within. */}
      <span
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 118%, color-mix(in oklab, var(--tile-accent) 34%, transparent) 0%, transparent 62%)',
          opacity: muted ? 0.55 : 1,
        }}
      />

      {/* The glyph carries the accent; the tile only hints at it. */}
      <span
        className="relative flex"
        style={{ color: 'var(--tile-accent)', opacity: muted ? 0.75 : 0.95 }}
      >
        <AppGlyph icon={icon} size={glyphSize} strokeWidth={1.5} />
      </span>
    </span>
  );
}
