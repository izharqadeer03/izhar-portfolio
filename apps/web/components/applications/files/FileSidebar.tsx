'use client';

import type { EnvironmentId } from '@izhar-os/types';
import { cn } from '@izhar-os/ui';

import { PlaceGlyph } from '@/components/applications/files/FileGlyphs';
import { getPlace } from '@/components/applications/files/model';
import type { FileManagerSpec, PlaceId } from '@/lib/environment';

interface FileSidebarProps {
  spec: FileManagerSpec;
  environment: EnvironmentId;
  current: PlaceId;
  onSelect: (place: PlaceId) => void;
}

/**
 * The places sidebar.
 *
 * The same list of shortcuts in all three, dressed three ways: Explorer's tight
 * tree with a section heading, Finder's small rounded rows, and Nautilus's
 * flatter, denser list. Every entry navigates somewhere real — see `model.ts`
 * for what each one resolves to.
 */
export function FileSidebar({ spec, environment, current, onSelect }: FileSidebarProps) {
  const isMac = environment === 'macos';
  const isLinux = environment === 'linux';

  return (
    <nav
      aria-label="Places"
      className={cn(
        'os-scroll hidden h-full w-[168px] shrink-0 overflow-y-auto border-e border-line sm:block',
        isMac
          ? 'bg-white/[0.03] px-2 py-3'
          : isLinux
            ? 'bg-black/25 px-1.5 py-2'
            : 'bg-void/25 px-2 py-2.5',
      )}
    >
      {spec.sidebarSections.map((section) => (
        <div key={section.label} className="mb-3 last:mb-0">
          <p
            className={cn(
              'px-2 pb-1.5 text-[10px] font-medium tracking-[0.14em] text-faint uppercase',
              isMac && 'font-sans tracking-[0.06em] normal-case',
            )}
          >
            {section.label}
          </p>

          <ul>
            {section.places.map((id) => {
              const place = getPlace(id, spec.placeLabels);
              const isCurrent = id === current;

              return (
                <li key={id}>
                  <button
                    type="button"
                    aria-current={isCurrent ? 'page' : undefined}
                    onClick={() => onSelect(id)}
                    title={place.summary}
                    className={cn(
                      'flex w-full items-center gap-2.5 px-2 py-[6px] text-left text-[12px]',
                      'transition-colors duration-120',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70',
                      isMac ? 'rounded-md' : isLinux ? 'rounded-[4px]' : 'rounded-sm',
                      isCurrent
                        ? 'env-selected text-fg'
                        : 'text-muted hover:bg-white/[0.055] hover:text-fg',
                    )}
                  >
                    <span className={cn('shrink-0', isCurrent ? 'env-accent' : 'text-faint')}>
                      <PlaceGlyph place={id} size={14} />
                    </span>
                    <span className="truncate">{place.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
