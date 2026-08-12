import type { ApplicationEntryKind, EnvironmentId } from '@izhar-os/types';
import { cn } from '@izhar-os/ui';
import {
  Clock3,
  Download,
  FileText,
  FolderClosed,
  LayoutGrid,
  type LucideIcon,
  Monitor,
} from 'lucide-react';

import type { PlaceId } from '@/lib/environment';

/**
 * Folder and document artwork, drawn three ways.
 *
 * A file manager is recognised by its folders before anything else — the tab,
 * the corner radius and above all the colour are what tell you at a glance
 * whether you are looking at Explorer, Finder or Files. So these are drawn per
 * environment rather than tinted from one shape, and each one is built from
 * flat vectors that stay crisp at 18px and at 64px.
 */

/** Fill pairs per environment: [front face, back tab]. */
const FOLDER_FILL: Record<EnvironmentId, [string, string]> = {
  // Windows 11's warm amber folder.
  windows: ['#f0b429', '#c98a12'],
  // Finder's blue.
  macos: ['#54a9f7', '#2b7fd4'],
  // Yaru's muted slate, with the tab a shade deeper.
  linux: ['#8a7f97', '#655c72'],
};

/** Accent line on a document, per environment. */
const DOCUMENT_ACCENT: Record<EnvironmentId, string> = {
  windows: '#4cc2ff',
  macos: '#0a84ff',
  linux: '#e95420',
};

interface GlyphProps {
  environment: EnvironmentId;
  size?: number;
  className?: string;
}

function FolderGlyph({ environment, size = 22, className }: GlyphProps) {
  const [front, back] = FOLDER_FILL[environment];
  // Explorer's folders are squarer than Finder's; Nautilus sits between them.
  const radius = environment === 'macos' ? 2.6 : environment === 'windows' ? 1.4 : 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      {/* Back tab. */}
      <path
        d="M2.4 6.4a1.9 1.9 0 0 1 1.9-1.9h4.2l2 2.2h11.1a1.9 1.9 0 0 1 1.9 1.9v1.2H2.4V6.4Z"
        fill={back}
      />
      {/* Front face. Its corner radius is the environment's tell. */}
      <rect x="2.4" y="9.1" width="19.2" height="10.4" rx={radius} fill={front} />
      {/* A single highlight along the top edge keeps it from reading as flat. */}
      <path d="M3.4 9.1h17.2v.9H3.4z" fill="#ffffff" opacity="0.22" />
    </svg>
  );
}

function DocumentGlyph({ environment, size = 22, className }: GlyphProps) {
  const accent = DOCUMENT_ACCENT[environment];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      <path
        d="M5.2 3.4a1.6 1.6 0 0 1 1.6-1.6h7L19.4 7v13.6a1.6 1.6 0 0 1-1.6 1.6H6.8a1.6 1.6 0 0 1-1.6-1.6V3.4Z"
        fill="#e8ecf2"
      />
      {/* Folded corner. */}
      <path d="M13.8 1.8 19.4 7h-4a1.6 1.6 0 0 1-1.6-1.6V1.8Z" fill="#b9c2cf" />
      {/* Content rules, with the environment's accent on the first. */}
      <rect x="7.7" y="10.2" width="9" height="1.4" rx="0.7" fill={accent} />
      <rect x="7.7" y="13.2" width="9" height="1.2" rx="0.6" fill="#9aa5b4" />
      <rect x="7.7" y="15.9" width="6" height="1.2" rx="0.6" fill="#9aa5b4" />
    </svg>
  );
}

function LinkGlyph({ environment, size = 22, className }: GlyphProps) {
  const accent = DOCUMENT_ACCENT[environment];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      <circle cx="12" cy="12" r="9" fill={accent} opacity="0.22" />
      <circle cx="12" cy="12" r="9" stroke={accent} strokeWidth="1.4" />
      <ellipse cx="12" cy="12" rx="4" ry="9" stroke={accent} strokeWidth="1.2" opacity="0.75" />
      <path d="M3.4 9.6h17.2M3.4 14.4h17.2" stroke={accent} strokeWidth="1.2" opacity="0.75" />
    </svg>
  );
}

export interface EntryGlyphProps extends GlyphProps {
  kind: ApplicationEntryKind;
  /** Application glyph fallback for entries that are applications, not files. */
  fallback?: React.ReactNode;
}

/** Resolves an entry's kind to the right artwork for this environment. */
export function EntryGlyph({ kind, environment, size, className, fallback }: EntryGlyphProps) {
  if (kind === 'folder')
    return <FolderGlyph environment={environment} size={size} className={className} />;
  if (kind === 'document')
    return <DocumentGlyph environment={environment} size={size} className={className} />;
  if (kind === 'link')
    return <LinkGlyph environment={environment} size={size} className={className} />;
  return <>{fallback}</>;
}

const PLACE_GLYPHS: Record<PlaceId, LucideIcon> = {
  portfolio: FolderClosed,
  desktop: Monitor,
  documents: FileText,
  downloads: Download,
  recents: Clock3,
  applications: LayoutGrid,
};

export function PlaceGlyph({ place, size = 14 }: { place: PlaceId; size?: number }) {
  const Glyph = PLACE_GLYPHS[place];
  return <Glyph size={size} strokeWidth={1.7} aria-hidden="true" />;
}
