'use client';

import { searchApplications, searchGlobalPortfolio } from '@izhar-os/config';
import type { ApplicationDefinition, GlobalSearchResult } from '@izhar-os/types';
import { useCallback, useMemo, useState } from 'react';

import { useWindowStore } from '@/lib/store/window-store';

export interface LauncherSearch {
  query: string;
  setQuery: (value: string) => void;
  results: ApplicationDefinition[];
  globalResults: GlobalSearchResult[];
  /** Index of the visually highlighted result. */
  highlight: number;
  setHighlight: (index: number) => void;
  /** The highlighted application, if there is one. */
  active: ApplicationDefinition | undefined;
  activeGlobal: GlobalSearchResult | undefined;
  /** Opens an application and closes the launcher. */
  launch: (application: ApplicationDefinition) => void;
  launchGlobal: (item: GlobalSearchResult) => void;
  /** Arrow / Home / End / Enter handling. Attach to the search field. */
  handleKeyDown: (event: React.KeyboardEvent) => void;
}

interface LauncherOptions {
  /** Results per row, so ArrowUp/ArrowDown move by a row rather than an item. */
  columns: number;
  onLaunch: () => void;
}

/**
 * Search, highlight and keyboard navigation for a launcher.
 *
 * The Start menu, Launchpad and the Activities overview look nothing alike and
 * behave identically: focus stays in the search field for the whole session,
 * the arrow keys drive a visual highlight rather than real focus, and Enter
 * opens whatever is highlighted. Sharing the behaviour is what keeps the three
 * launchers from drifting into three different ideas of how search works.
 */
export function useLauncherSearch({ columns, onLaunch }: LauncherOptions): LauncherSearch {
  const openWindow = useWindowStore((state) => state.openWindow);

  const [query, setQueryValue] = useState('');
  const [highlight, setHighlight] = useState(0);

  const results = useMemo(() => searchApplications(query), [query]);
  const globalResults = useMemo(() => searchGlobalPortfolio(query), [query]);

  const active = results[highlight];
  const activeGlobal = globalResults[highlight];

  const setQuery = useCallback((value: string) => {
    setQueryValue(value);
    // Refiling the results always re-aims at the best match.
    setHighlight(0);
  }, []);

  const launch = useCallback(
    (application: ApplicationDefinition) => {
      openWindow(application.id);
      onLaunch();
    },
    [onLaunch, openWindow],
  );

  const launchGlobal = useCallback(
    (item: GlobalSearchResult) => {
      openWindow(item.applicationId);
      onLaunch();
    },
    [onLaunch, openWindow],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const activeLength = query.trim() ? globalResults.length : results.length;
      if (activeLength === 0) return;

      const move = (delta: number) => {
        event.preventDefault();
        setHighlight((index) => Math.min(activeLength - 1, Math.max(0, index + delta)));
      };

      switch (event.key) {
        case 'ArrowRight':
          move(1);
          break;
        case 'ArrowLeft':
          move(-1);
          break;
        case 'ArrowDown':
          move(query.trim() ? 1 : columns);
          break;
        case 'ArrowUp':
          move(query.trim() ? -1 : -columns);
          break;
        case 'Home':
          event.preventDefault();
          setHighlight(0);
          break;
        case 'End':
          event.preventDefault();
          setHighlight(activeLength - 1);
          break;
        case 'Enter':
          event.preventDefault();
          if (query.trim() && activeGlobal) {
            launchGlobal(activeGlobal);
          } else if (active) {
            launch(active);
          }
          break;
        default:
          break;
      }
    },
    [active, activeGlobal, columns, globalResults.length, launch, launchGlobal, query, results.length],
  );

  return {
    query,
    setQuery,
    results,
    globalResults,
    highlight,
    setHighlight,
    active,
    activeGlobal,
    launch,
    launchGlobal,
    handleKeyDown,
  };
}

