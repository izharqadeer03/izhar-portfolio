'use client';

import type { EnvironmentId } from '@izhar-os/types';
import { cn } from '@izhar-os/ui';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  LayoutGrid,
  List,
  Menu,
  Search,
} from 'lucide-react';

export type ListingView = 'grid' | 'list';
export type SortOption = 'name' | 'featured' | 'tech-count';

interface ProjectsToolbarProps {
  environment: EnvironmentId;
  segments: string[];
  canGoBack: boolean;
  canGoForward: boolean;
  canGoUp: boolean;
  view: ListingView;
  sort: SortOption;
  query: string;
  onBack: () => void;
  onForward: () => void;
  onUp: () => void;
  onView: (view: ListingView) => void;
  onSort: (sort: SortOption) => void;
  onQuery: (query: string) => void;
  onNavigateSegment: (index: number) => void;
}

const NAV_BUTTON =
  'grid size-7 shrink-0 place-items-center rounded-md transition-colors duration-150 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70';

export function ProjectsToolbar(props: ProjectsToolbarProps) {
  const { environment } = props;
  if (environment === 'macos') return <FinderToolbar {...props} />;
  if (environment === 'linux') return <NautilusToolbar {...props} />;
  return <ExplorerToolbar {...props} />;
}

function HistoryButtons({
  canGoBack,
  canGoForward,
  onBack,
  onForward,
}: Pick<ProjectsToolbarProps, 'canGoBack' | 'canGoForward' | 'onBack' | 'onForward'>) {
  return (
    <div className="flex items-center gap-0.5">
      <button
        type="button"
        onClick={onBack}
        disabled={!canGoBack}
        aria-label="Back"
        className={cn(
          NAV_BUTTON,
          canGoBack ? 'text-fg/80 hover:bg-white/10 hover:text-fg' : 'text-faint/40',
        )}
      >
        <ArrowLeft size={15} strokeWidth={1.8} />
      </button>
      <button
        type="button"
        onClick={onForward}
        disabled={!canGoForward}
        aria-label="Forward"
        className={cn(
          NAV_BUTTON,
          canGoForward ? 'text-fg/80 hover:bg-white/10 hover:text-fg' : 'text-faint/40',
        )}
      >
        <ArrowRight size={15} strokeWidth={1.8} />
      </button>
    </div>
  );
}

function ViewToggle({ view, onView }: Pick<ProjectsToolbarProps, 'view' | 'onView'>) {
  return (
    <div
      className="flex items-center gap-0.5 rounded-md border border-line p-0.5"
      role="group"
      aria-label="View Mode"
    >
      <button
        type="button"
        onClick={() => onView('grid')}
        aria-pressed={view === 'grid'}
        aria-label="Grid view"
        className={cn(
          'grid size-6 place-items-center rounded transition-colors duration-150',
          view === 'grid' ? 'env-selected env-accent' : 'text-muted hover:bg-white/8 hover:text-fg',
        )}
      >
        <LayoutGrid size={13} strokeWidth={1.8} />
      </button>
      <button
        type="button"
        onClick={() => onView('list')}
        aria-pressed={view === 'list'}
        aria-label="List view"
        className={cn(
          'grid size-6 place-items-center rounded transition-colors duration-150',
          view === 'list' ? 'env-selected env-accent' : 'text-muted hover:bg-white/8 hover:text-fg',
        )}
      >
        <List size={13} strokeWidth={1.8} />
      </button>
    </div>
  );
}

function SortSelector({ sort, onSort }: Pick<ProjectsToolbarProps, 'sort' | 'onSort'>) {
  return (
    <div className="flex items-center gap-1">
      <ArrowUpDown size={12} className="text-faint" />
      <select
        value={sort}
        onChange={(e) => onSort(e.target.value as SortOption)}
        aria-label="Sort projects"
        className={cn(
          'h-7 rounded-md border border-line bg-void/40 px-2 text-[11.5px] text-fg',
          'focus:outline-none focus:border-accent/70 transition-colors',
        )}
      >
        <option value="featured">Featured First</option>
        <option value="name">Name (A-Z)</option>
        <option value="tech-count">Most Technologies</option>
      </select>
    </div>
  );
}

function SearchInput({
  query,
  onQuery,
  placeholder = 'Search projects...',
}: Pick<ProjectsToolbarProps, 'query' | 'onQuery'> & { placeholder?: string }) {
  return (
    <div className="relative flex-1 sm:flex-none sm:w-48">
      <Search
        size={13}
        className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-faint"
      />
      <input
        type="text"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Search projects"
        className={cn(
          'h-7 w-full rounded-md border border-line bg-void/40 ps-7 pe-2 text-[12px] text-fg',
          'placeholder:text-faint focus:outline-none focus:border-accent/70 transition-colors',
        )}
      />
    </div>
  );
}

/** Windows Explorer Toolbar */
function ExplorerToolbar({
  segments,
  canGoBack,
  canGoForward,
  canGoUp,
  view,
  sort,
  query,
  onBack,
  onForward,
  onUp,
  onView,
  onSort,
  onQuery,
  onNavigateSegment,
}: ProjectsToolbarProps) {
  return (
    <div className="flex shrink-0 flex-col gap-2 border-b border-line bg-surface/30 px-3 py-2">
      <div className="flex items-center gap-2">
        <HistoryButtons
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          onBack={onBack}
          onForward={onForward}
        />
        <button
          type="button"
          onClick={onUp}
          disabled={!canGoUp}
          aria-label="Up one level"
          className={cn(
            NAV_BUTTON,
            canGoUp ? 'text-fg/80 hover:bg-white/10 hover:text-fg' : 'text-faint/40',
          )}
        >
          <ArrowUp size={15} strokeWidth={1.8} />
        </button>

        {/* Address Bar */}
        <div className="os-scroll flex min-w-0 flex-1 items-center gap-1 overflow-x-auto rounded-md border border-line bg-void/50 px-2.5 py-1">
          {segments.map((segment, index) => (
            <span key={segment} className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => onNavigateSegment(index)}
                className={cn(
                  'rounded px-1 text-[12px] whitespace-nowrap transition-colors',
                  index === segments.length - 1
                    ? 'font-medium text-fg'
                    : 'text-muted hover:bg-white/8 hover:text-fg',
                )}
              >
                {segment}
              </button>
              {index < segments.length - 1 ? (
                <span className="text-[11px] text-faint">›</span>
              ) : null}
            </span>
          ))}
        </div>

        <SearchInput query={query} onQuery={onQuery} />
      </div>

      {/* Command Strip */}
      <div className="flex items-center gap-3 pt-0.5">
        <ViewToggle view={view} onView={onView} />
        <span className="h-4 w-px bg-line" role="presentation" />
        <SortSelector sort={sort} onSort={onSort} />
        <span className="ms-auto text-[11px] text-faint">Windows File Explorer</span>
      </div>
    </div>
  );
}

/** macOS Finder Toolbar */
function FinderToolbar({
  segments,
  canGoBack,
  canGoForward,
  view,
  sort,
  query,
  onBack,
  onForward,
  onView,
  onSort,
  onQuery,
}: ProjectsToolbarProps) {
  return (
    <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-line bg-surface/40 px-3">
      <div className="flex items-center gap-2">
        <div className="rounded-md border border-line bg-white/[0.05] p-0.5">
          <HistoryButtons
            canGoBack={canGoBack}
            canGoForward={canGoForward}
            onBack={onBack}
            onForward={onForward}
          />
        </div>
        <ViewToggle view={view} onView={onView} />
      </div>

      <span className="truncate text-[13px] font-semibold text-fg">
        {segments[segments.length - 1]}
      </span>

      <div className="flex items-center gap-2">
        <SortSelector sort={sort} onSort={onSort} />
        <SearchInput query={query} onQuery={onQuery} />
      </div>
    </div>
  );
}

/** Linux GNOME Files Toolbar */
function NautilusToolbar({
  segments,
  canGoBack,
  canGoForward,
  view,
  sort,
  query,
  onBack,
  onForward,
  onView,
  onSort,
  onQuery,
  onNavigateSegment,
}: ProjectsToolbarProps) {
  return (
    <div className="flex h-12 shrink-0 items-center gap-2 border-b border-black/40 bg-black/30 px-3">
      <div className="rounded-[5px] border border-white/10 bg-white/[0.04] p-0.5">
        <HistoryButtons
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          onBack={onBack}
          onForward={onForward}
        />
      </div>

      {/* Path Buttons */}
      <div className="os-scroll flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
        {segments.map((segment, index) => (
          <button
            key={segment}
            type="button"
            onClick={() => onNavigateSegment(index)}
            className={cn(
              'shrink-0 rounded-[5px] px-2 py-1 text-[12px] whitespace-nowrap transition-colors',
              index === segments.length - 1
                ? 'env-selected font-medium text-fg'
                : 'text-muted hover:bg-white/10 hover:text-fg',
            )}
          >
            {segment}
          </button>
        ))}
      </div>

      <SearchInput query={query} onQuery={onQuery} />
      <SortSelector sort={sort} onSort={onSort} />
      <ViewToggle view={view} onView={onView} />

      <span className="grid size-7 shrink-0 place-items-center rounded-[5px] text-muted">
        <Menu size={15} />
      </span>
    </div>
  );
}
