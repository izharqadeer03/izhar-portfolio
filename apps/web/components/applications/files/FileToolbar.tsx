'use client';

import type { EnvironmentId } from '@izhar-os/types';
import { cn } from '@izhar-os/ui';
import { ArrowLeft, ArrowRight, ArrowUp, LayoutGrid, List, Menu, Search } from 'lucide-react';

import type { FileManagerSpec } from '@/lib/environment';

export type ListingView = 'grid' | 'list';

interface FileToolbarProps {
  spec: FileManagerSpec;
  environment: EnvironmentId;
  /** Path segments after the prefix, e.g. ['Portfolio', 'Projects']. */
  segments: string[];
  canGoBack: boolean;
  canGoForward: boolean;
  canGoUp: boolean;
  view: ListingView;
  query: string;
  onBack: () => void;
  onForward: () => void;
  onUp: () => void;
  onView: (view: ListingView) => void;
  onQuery: (value: string) => void;
  /** Jump to a path segment by index (-1 selects the prefix root). */
  onNavigateSegment: (index: number) => void;
}

const NAV_BUTTON =
  'grid size-7 shrink-0 place-items-center rounded-md transition-colors duration-150 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70';

/**
 * The file manager's toolbar.
 *
 * All three carry the same controls — history, location, search, view — in the
 * arrangement their environment uses. Explorer puts the address bar centre
 * stage; Finder leads with a segmented history control and centres the folder
 * name; Nautilus turns the path into a row of buttons. Same actions, three
 * grammars.
 */
export function FileToolbar(props: FileToolbarProps) {
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
  className,
}: Pick<FileToolbarProps, 'canGoBack' | 'canGoForward' | 'onBack' | 'onForward'> & {
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      <button
        type="button"
        onClick={onBack}
        disabled={!canGoBack}
        aria-label="Back"
        className={cn(
          NAV_BUTTON,
          canGoBack ? 'text-fg/80 hover:bg-white/10 hover:text-fg' : 'text-faint/50',
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
          canGoForward ? 'text-fg/80 hover:bg-white/10 hover:text-fg' : 'text-faint/50',
        )}
      >
        <ArrowRight size={15} strokeWidth={1.8} />
      </button>
    </div>
  );
}

function ViewToggle({ view, onView }: Pick<FileToolbarProps, 'view' | 'onView'>) {
  return (
    <div
      className="flex items-center gap-0.5 rounded-md border border-line p-0.5"
      role="group"
      aria-label="View"
    >
      {(['grid', 'list'] as const).map((mode) => (
        <button
          key={mode}
          type="button"
          onClick={() => onView(mode)}
          aria-pressed={view === mode}
          aria-label={mode === 'grid' ? 'Icon view' : 'List view'}
          className={cn(
            'grid size-6 place-items-center rounded transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70',
            view === mode ? 'env-selected env-accent' : 'text-muted hover:bg-white/8 hover:text-fg',
          )}
        >
          {mode === 'grid' ? (
            <LayoutGrid size={13} strokeWidth={1.8} />
          ) : (
            <List size={13} strokeWidth={1.8} />
          )}
        </button>
      ))}
    </div>
  );
}

function SearchField({
  query,
  onQuery,
  placeholder,
  className,
}: Pick<FileToolbarProps, 'query' | 'onQuery'> & { placeholder: string; className?: string }) {
  return (
    <div className={cn('relative', className)}>
      <Search
        size={13}
        strokeWidth={1.8}
        className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-faint"
        aria-hidden="true"
      />
      <input
        type="text"
        value={query}
        onChange={(event) => onQuery(event.target.value)}
        aria-label="Search this folder"
        placeholder={placeholder}
        className={cn(
          'h-7 w-full rounded-md border border-line bg-void/40 ps-7 pe-2 text-[12px] text-fg',
          'placeholder:text-faint focus:outline-none',
          'focus:border-[color:color-mix(in_oklab,var(--env-accent)_55%,transparent)]',
          'transition-[border-color] duration-150',
        )}
      />
    </div>
  );
}

/** Windows: history + up, then a full-width address bar, then search. */
function ExplorerToolbar({
  spec,
  segments,
  canGoBack,
  canGoForward,
  canGoUp,
  view,
  query,
  onBack,
  onForward,
  onUp,
  onView,
  onQuery,
  onNavigateSegment,
}: FileToolbarProps) {
  return (
    <div className="flex shrink-0 flex-col gap-2 border-b border-line bg-white/[0.02] px-2.5 py-2">
      <div className="flex items-center gap-1.5">
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
            canGoUp ? 'text-fg/80 hover:bg-white/10 hover:text-fg' : 'text-faint/50',
          )}
        >
          <ArrowUp size={15} strokeWidth={1.8} />
        </button>

        {/* Address bar. */}
        <div className="os-scroll flex min-w-0 flex-1 items-center gap-1 overflow-x-auto rounded-md border border-line bg-void/40 px-2 py-1">
          {spec.pathPrefix.map((segment) => (
            <span key={segment} className="flex shrink-0 items-center gap-1">
              <span className="text-[12px] whitespace-nowrap text-muted">{segment}</span>
              <span className="text-[11px] text-faint">{spec.pathSeparator}</span>
            </span>
          ))}

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
                <span className="text-[11px] text-faint">{spec.pathSeparator}</span>
              ) : null}
            </span>
          ))}
        </div>

        <SearchField
          query={query}
          onQuery={onQuery}
          placeholder="Search"
          className="w-[152px] shrink-0"
        />
      </div>

      {/* Command strip, Windows 11's row of verbs under the address bar. */}
      <div className="flex items-center gap-2">
        <ViewToggle view={view} onView={onView} />
        <span className="h-4 w-px bg-line" role="presentation" />
        <span className="text-[11.5px] text-faint">{spec.name}</span>
      </div>
    </div>
  );
}

/** macOS: segmented history at the leading edge, folder name centred. */
function FinderToolbar({
  segments,
  canGoBack,
  canGoForward,
  view,
  query,
  onBack,
  onForward,
  onView,
  onQuery,
}: FileToolbarProps) {
  return (
    <div className="flex h-11 shrink-0 items-center gap-3 border-b border-line px-3">
      <div className="rounded-md border border-line bg-white/[0.05] p-0.5">
        <HistoryButtons
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          onBack={onBack}
          onForward={onForward}
        />
      </div>

      <span className="min-w-0 flex-1 truncate text-[13px] font-semibold tracking-tight text-fg">
        {segments[segments.length - 1]}
      </span>

      <ViewToggle view={view} onView={onView} />

      <SearchField
        query={query}
        onQuery={onQuery}
        placeholder="Search"
        className="w-[150px] shrink-0"
      />
    </div>
  );
}

/** Ubuntu: the path becomes a row of buttons, GNOME's header-bar idiom. */
function NautilusToolbar({
  spec,
  segments,
  canGoBack,
  canGoForward,
  view,
  query,
  onBack,
  onForward,
  onView,
  onQuery,
  onNavigateSegment,
}: FileToolbarProps) {
  return (
    <div className="flex h-11 shrink-0 items-center gap-2 border-b border-black/40 bg-black/25 px-2.5">
      <div className="rounded-[5px] border border-white/10 bg-white/[0.04] p-0.5">
        <HistoryButtons
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          onBack={onBack}
          onForward={onForward}
        />
      </div>

      {/* Path buttons. */}
      <div className="os-scroll flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto">
        {segments.map((segment, index) => (
          <button
            key={segment}
            type="button"
            onClick={() => onNavigateSegment(index)}
            className={cn(
              'shrink-0 rounded-[5px] px-2 py-1 text-[12px] whitespace-nowrap transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70',
              index === segments.length - 1
                ? 'env-selected font-medium text-fg'
                : 'text-muted hover:bg-white/10 hover:text-fg',
            )}
          >
            {segment}
          </button>
        ))}
      </div>

      <SearchField
        query={query}
        onQuery={onQuery}
        placeholder="Search"
        className="w-[132px] shrink-0"
      />

      <ViewToggle view={view} onView={onView} />

      <span
        className="grid size-7 shrink-0 place-items-center rounded-[5px] text-muted"
        aria-hidden="true"
        title={spec.name}
      >
        <Menu size={15} strokeWidth={1.8} />
      </span>
    </div>
  );
}
