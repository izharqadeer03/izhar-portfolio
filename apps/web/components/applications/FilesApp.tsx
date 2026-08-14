'use client';

import { getApplication, SYSTEM_PROFILE } from '@izhar-os/config';
import type { ApplicationDefinition, ApplicationId } from '@izhar-os/types';
import { OSButton } from '@izhar-os/ui';
import { ExternalLink } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { ApplicationSurface } from '@/components/applications/ApplicationRegistry';
import { FileListing } from '@/components/applications/files/FileListing';
import { FileSidebar } from '@/components/applications/files/FileSidebar';
import { FileToolbar, type ListingView } from '@/components/applications/files/FileToolbar';
import { getPlace, listPlace } from '@/components/applications/files/model';
import { useEnvironment } from '@/hooks/useEnvironment';
import { useHasFinePointer } from '@/hooks/useSystemPreferences';
import { FILE_MANAGER, type PlaceId } from '@/lib/environment';
import { useWindowStore } from '@/lib/store/window-store';

/**
 * A location in the file manager: a place, and optionally an entry opened
 * inside it. Two fields is the entire navigation model, which is what lets the
 * history be a plain array.
 */
interface Location {
  place: PlaceId;
  entry: ApplicationId | null;
}

const HOME: Location = { place: 'portfolio', entry: null };

const sameLocation = (a: Location, b: Location) => a.place === b.place && a.entry === b.entry;

/**
 * The portfolio, as a file system.
 *
 * One implementation, three faces. Explorer, Finder and Files differ in their
 * toolbar grammar, their sidebar density, their folder artwork and their
 * default view — and share their listing, their navigation model, their history
 * stack and, most importantly, their contents. Everything on screen is derived
 * from the same application manifest that feeds the desktop, the launcher and
 * the terminal, so no environment can show a portfolio the others do not have.
 *
 * Opening a folder navigates *into* it rather than launching a window, which is
 * what a file manager does. The application's own surface is what you find
 * inside, with a control to break it out into a real window.
 */
export function FilesApp() {
  const environment = useEnvironment();
  const spec = FILE_MANAGER[environment];
  const hasFinePointer = useHasFinePointer();

  const windows = useWindowStore((state) => state.windows);
  const openWindow = useWindowStore((state) => state.openWindow);

  // History and cursor move together on every navigation, so they are one
  // piece of state: keeping them separate invites a render where the cursor
  // points past the end of the stack.
  const [nav, setNav] = useState<{ stack: Location[]; cursor: number }>({
    stack: [HOME],
    cursor: 0,
  });
  const [view, setView] = useState<ListingView>(spec.defaultView);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<ApplicationId | null>(null);

  const location = nav.stack[nav.cursor] ?? HOME;
  const place = getPlace(location.place, spec.placeLabels);

  // Recents is the one listing that reflects what the visitor has done rather
  // than what the manifest declares.
  const recentIds = useMemo(
    () =>
      [...windows]
        .sort((a, b) => b.openedAt - a.openedAt)
        .map((instance) => instance.applicationId),
    [windows],
  );

  const entries = useMemo(() => {
    const listing = listPlace(location.place, recentIds);
    const term = query.trim().toLowerCase();
    if (!term) return listing;
    return listing.filter(
      (application) =>
        application.entry.name.toLowerCase().includes(term) ||
        application.title.toLowerCase().includes(term) ||
        application.keywords.some((keyword) => keyword.includes(term)),
    );
  }, [location.place, query, recentIds]);

  const openedEntry = location.entry ? getApplication(location.entry) : undefined;

  /** Pushes a location, discarding anything ahead of the cursor. */
  const navigate = useCallback((next: Location) => {
    setNav((current) => {
      const here = current.stack[current.cursor];
      if (here && sameLocation(here, next)) return current;

      const trimmed = current.stack.slice(0, current.cursor + 1);
      return { stack: [...trimmed, next], cursor: trimmed.length };
    });
    setQuery('');
    setSelectedId(null);
  }, []);

  const step = useCallback((delta: number) => {
    setNav((current) => ({
      ...current,
      cursor: Math.min(current.stack.length - 1, Math.max(0, current.cursor + delta)),
    }));
    setQuery('');
    setSelectedId(null);
  }, []);

  const canGoBack = nav.cursor > 0;
  const canGoForward = nav.cursor < nav.stack.length - 1;
  const canGoUp = location.entry !== null;

  const segments = useMemo(() => {
    const base = [place.label];
    return openedEntry ? [...base, openedEntry.entry.name] : base;
  }, [openedEntry, place.label]);

  const open = useCallback(
    (application: ApplicationDefinition) => {
      // Applications are launched; folders, documents and links are entered.
      if (application.entry.kind === 'application') {
        openWindow(application.id);
        return;
      }
      navigate({ place: location.place, entry: application.id });
    },
    [location.place, navigate, openWindow],
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <FileToolbar
        spec={spec}
        environment={environment}
        segments={segments}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        canGoUp={canGoUp}
        view={view}
        query={query}
        onBack={() => step(-1)}
        onForward={() => step(1)}
        onUp={() => navigate({ place: location.place, entry: null })}
        onView={setView}
        onQuery={setQuery}
        onNavigateSegment={(index) => {
          if (index === 0) navigate({ place: location.place, entry: null });
        }}
      />

      <div className="flex min-h-0 flex-1">
        <FileSidebar
          spec={spec}
          environment={environment}
          current={location.place}
          onSelect={(next) => navigate({ place: next, entry: null })}
        />

        <div className="os-scroll min-w-0 flex-1 overflow-y-auto">
          {openedEntry ? (
            <EntryView application={openedEntry} onOpenWindow={() => openWindow(openedEntry.id)} />
          ) : (
            <FileListing
              entries={entries}
              environment={environment}
              view={view}
              selectedId={selectedId}
              singleClickOpens={!hasFinePointer}
              onSelect={setSelectedId}
              onOpen={open}
            />
          )}
        </div>
      </div>

      {/* Status bar. Every file manager has one, and it is the natural home for
          the one line of identity that must survive every environment. */}
      <footer className="flex shrink-0 items-center gap-3 border-t border-line px-3 py-1.5">
        <span className="truncate text-[11.5px] text-muted">
          {openedEntry ? openedEntry.description : `${entries.length} items · ${place.summary}`}
        </span>
        <span className="ms-auto hidden shrink-0 text-[11.5px] text-faint sm:block">
          {SYSTEM_PROFILE.name} · {SYSTEM_PROFILE.role}
        </span>
      </footer>
    </div>
  );
}

/**
 * What you find inside a folder.
 *
 * The application's own surface, rendered in place — the same component the
 * window manager would render, so the file manager cannot show a different
 * "Projects" from the one the Projects window shows.
 */
function EntryView({
  application,
  onOpenWindow,
}: {
  application: ApplicationDefinition;
  onOpenWindow: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-3 border-b border-line bg-white/[0.02] px-4 py-2.5">
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[12.5px] font-medium text-fg">
            {application.entry.name}
          </span>
          <span className="block truncate text-[11.5px] text-muted">
            {application.entry.typeLabel}
          </span>
        </span>

        <OSButton size="sm" variant="ghost" onClick={onOpenWindow}>
          <ExternalLink size={13} strokeWidth={1.8} aria-hidden="true" />
          <span>Open in a window</span>
        </OSButton>
      </div>

      <div className="min-h-0 flex-1">
        <ApplicationSurface application={application} />
      </div>
    </div>
  );
}
