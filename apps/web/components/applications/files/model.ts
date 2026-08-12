import { APPLICATIONS, PORTFOLIO_ENTRIES } from '@izhar-os/config';
import type { ApplicationDefinition, ApplicationId } from '@izhar-os/types';

import type { PlaceId } from '@/lib/environment';

/**
 * What the file manager shows, and where.
 *
 * Every listing below is derived from the application manifest, so Explorer,
 * Finder and Files cannot disagree with each other, with the desktop, with the
 * launcher or with `ls` in the terminal. There is no second copy of the
 * portfolio's structure anywhere in the system.
 */

export interface Place {
  id: PlaceId;
  label: string;
  /** Icon key resolved by the file manager's glyph map. */
  icon: PlaceId;
  /** One line explaining what the visitor is looking at. */
  summary: string;
}

const PLACES: Record<PlaceId, Place> = {
  portfolio: {
    id: 'portfolio',
    label: 'Portfolio',
    icon: 'portfolio',
    summary: 'Everything in this portfolio, as a folder.',
  },
  desktop: {
    id: 'desktop',
    label: 'Desktop',
    icon: 'desktop',
    summary: 'The shortcuts that sit on the desktop.',
  },
  documents: {
    id: 'documents',
    label: 'Documents',
    icon: 'documents',
    summary: 'Written material — the résumé and the introduction.',
  },
  downloads: {
    id: 'downloads',
    label: 'Downloads',
    icon: 'downloads',
    summary: 'What this portfolio offers to take away.',
  },
  recents: {
    id: 'recents',
    label: 'Recents',
    icon: 'recents',
    summary: 'Applications opened in this session, most recent first.',
  },
  applications: {
    id: 'applications',
    label: 'Applications',
    icon: 'applications',
    summary: 'The tools this workspace runs on.',
  },
};

export function getPlace(id: PlaceId, overrides?: Partial<Record<PlaceId, string>>): Place {
  const place = PLACES[id];
  const label = overrides?.[id];
  return label ? { ...place, label } : place;
}

/**
 * The entries a place contains.
 *
 * `recentIds` comes from the window store, which is the only listing that
 * depends on what the visitor has actually done rather than on the manifest.
 */
export function listPlace(place: PlaceId, recentIds: ApplicationId[]): ApplicationDefinition[] {
  switch (place) {
    case 'portfolio':
      return PORTFOLIO_ENTRIES;

    case 'desktop':
      return APPLICATIONS.filter((application) => application.showOnDesktop);

    case 'documents':
      return PORTFOLIO_ENTRIES.filter((application) => application.entry.kind === 'document');

    case 'downloads':
      return APPLICATIONS.filter((application) => application.id === 'resume');

    case 'recents': {
      const byId = new Map(APPLICATIONS.map((application) => [application.id, application]));
      return recentIds
        .map((id) => byId.get(id))
        .filter((application): application is ApplicationDefinition => application !== undefined);
    }

    case 'applications':
      return APPLICATIONS.filter((application) => application.category === 'system');

    default:
      return PORTFOLIO_ENTRIES;
  }
}

/** The column an environment's details view sorts by, and how it renders it. */
export function entrySizeLabel(application: ApplicationDefinition): string {
  if (application.entry.kind === 'folder') {
    const count = application.plannedFeatures?.length ?? 0;
    return count > 0 ? `${count} items` : '—';
  }
  return application.status === 'available' ? 'Ready' : 'Pending';
}
