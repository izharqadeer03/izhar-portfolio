'use client';

import type { ApplicationDefinition, ApplicationId, EnvironmentId } from '@izhar-os/types';
import { cn } from '@izhar-os/ui';

import { AppGlyph, getAccentValue } from '@/components/applications/AppIcon';
import { EntryGlyph } from '@/components/applications/files/FileGlyphs';
import { entrySizeLabel } from '@/components/applications/files/model';
import type { ListingView } from '@/components/applications/files/FileToolbar';

interface FileListingProps {
  entries: ApplicationDefinition[];
  environment: EnvironmentId;
  view: ListingView;
  selectedId: ApplicationId | null;
  /** True on touch, where a single tap must open rather than select. */
  singleClickOpens: boolean;
  onSelect: (id: ApplicationId) => void;
  onOpen: (application: ApplicationDefinition) => void;
}

/**
 * The listing itself — the one part of the file manager that is genuinely the
 * same in all three environments, because a grid of files is a grid of files.
 *
 * Selection and opening are separate on a pointer device (click, then double
 * click) and collapsed on touch, where a "double tap to open" affordance is
 * invisible and a single tap is what everybody will try.
 */
export function FileListing({
  entries,
  environment,
  view,
  selectedId,
  singleClickOpens,
  onSelect,
  onOpen,
}: FileListingProps) {
  if (entries.length === 0) {
    return (
      <p className="grid h-full place-items-center px-6 text-center text-[12.5px] text-muted">
        This folder is empty.
      </p>
    );
  }

  const activate = (application: ApplicationDefinition) => {
    if (singleClickOpens) onOpen(application);
    else onSelect(application.id);
  };

  if (view === 'list') {
    return (
      <table className="w-full border-collapse text-left">
        <thead className="sticky top-0 z-10 bg-surface/95 backdrop-blur-sm">
          <tr className="border-b border-line">
            <th scope="col" className="px-3 py-1.5 text-[11px] font-medium text-faint">
              Name
            </th>
            <th
              scope="col"
              className="hidden px-3 py-1.5 text-[11px] font-medium text-faint sm:table-cell"
            >
              Type
            </th>
            <th
              scope="col"
              className="hidden px-3 py-1.5 text-[11px] font-medium text-faint md:table-cell"
            >
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {entries.map((application) => {
            const isSelected = application.id === selectedId;

            return (
              <tr
                key={application.id}
                tabIndex={0}
                aria-selected={isSelected}
                onClick={() => activate(application)}
                onDoubleClick={() => onOpen(application)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') onOpen(application);
                }}
                className={cn(
                  'cursor-default border-b border-line/50 transition-colors duration-120',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-inset',
                  isSelected ? 'env-selected' : 'hover:bg-white/[0.045]',
                )}
              >
                <td className="px-3 py-1.5">
                  <span className="flex items-center gap-2.5">
                    <EntryGlyph
                      kind={application.entry.kind}
                      environment={environment}
                      size={18}
                      fallback={
                        <span
                          className="flex"
                          style={{ color: getAccentValue(application.accent) }}
                        >
                          <AppGlyph icon={application.icon} size={16} />
                        </span>
                      }
                    />
                    <span className="truncate text-[12.5px] text-fg/90">
                      {application.entry.name}
                    </span>
                  </span>
                </td>
                <td className="hidden px-3 py-1.5 text-[12px] text-muted sm:table-cell">
                  {application.entry.typeLabel}
                </td>
                <td className="hidden px-3 py-1.5 text-[12px] text-muted md:table-cell">
                  {entrySizeLabel(application)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  return (
    <ul
      className={cn(
        'grid gap-1 p-3',
        // Finder gives its icons noticeably more room than Nautilus does.
        environment === 'macos'
          ? 'grid-cols-[repeat(auto-fill,minmax(112px,1fr))] gap-3'
          : 'grid-cols-[repeat(auto-fill,minmax(94px,1fr))]',
      )}
    >
      {entries.map((application) => {
        const isSelected = application.id === selectedId;

        return (
          <li key={application.id}>
            <button
              type="button"
              aria-pressed={isSelected}
              onClick={() => activate(application)}
              onDoubleClick={() => onOpen(application)}
              className={cn(
                'flex w-full flex-col items-center gap-2 rounded-lg border px-2 py-3',
                'transition-colors duration-120',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70',
                isSelected ? 'env-selected' : 'border-transparent hover:bg-white/[0.05]',
              )}
            >
              <EntryGlyph
                kind={application.entry.kind}
                environment={environment}
                size={environment === 'macos' ? 46 : 40}
                fallback={
                  <span
                    className="grid place-items-center"
                    style={{
                      color: getAccentValue(application.accent),
                      width: environment === 'macos' ? 46 : 40,
                      height: environment === 'macos' ? 46 : 40,
                    }}
                  >
                    <AppGlyph icon={application.icon} size={environment === 'macos' ? 26 : 23} />
                  </span>
                }
              />

              <span className="line-clamp-2 max-w-full text-center text-[11.5px] leading-tight text-fg/90">
                {application.entry.name}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
