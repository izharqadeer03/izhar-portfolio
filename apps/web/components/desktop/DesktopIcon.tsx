'use client';

import type { ApplicationDefinition } from '@izhar-os/types';
import { cn } from '@izhar-os/ui';
import type { PointerEvent as ReactPointerEvent, Ref } from 'react';

import { AppTile } from '@/components/applications/AppIcon';

interface DesktopIconProps {
  application: ApplicationDefinition;
  isSelected: boolean;
  isDragging: boolean;
  tileSize: number;
  /** Roving tabindex: only the active icon is in the tab order. */
  tabIndex: number;
  ref?: Ref<HTMLButtonElement>;
  onPointerDown?: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onClick: () => void;
  onDoubleClick: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A desktop shortcut.
 *
 * Hover lifts the tile a hair and lights its border; selection is a filled
 * plate behind the whole cell. Both are short — an icon field that bounces
 * reads as a toy, and this one has to read as a workspace.
 */
export function DesktopIcon({
  application,
  isSelected,
  isDragging,
  tileSize,
  tabIndex,
  ref,
  onPointerDown,
  onClick,
  onDoubleClick,
  onKeyDown,
  className,
  style,
}: DesktopIconProps) {
  return (
    <button
      ref={ref}
      type="button"
      tabIndex={tabIndex}
      aria-label={`${application.title}. ${application.description}`}
      aria-pressed={isSelected}
      data-application={application.id}
      onPointerDown={onPointerDown}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onKeyDown={onKeyDown}
      style={style}
      className={cn(
        'group absolute flex select-none flex-col items-center gap-2 rounded-xl px-1 py-2.5',
        'border border-transparent transition-[background-color,border-color,opacity] duration-150 ease-os',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70',
        isSelected
          ? 'border-line-strong bg-white/[0.07] backdrop-blur-md'
          : 'hover:border-line hover:bg-white/[0.035]',
        isDragging && 'opacity-45',
        className,
      )}
    >
      <span
        className={cn(
          'transition-transform duration-200 ease-os',
          'group-hover:-translate-y-0.5 group-active:translate-y-0',
        )}
      >
        <AppTile
          icon={application.icon}
          accent={application.accent}
          size={tileSize}
          className={cn('group-hover:border-line-strong', isSelected && 'border-line-strong')}
        />
      </span>

      <span
        className={cn(
          'line-clamp-2 max-w-full text-center text-[11.5px] leading-tight tracking-tight transition-colors duration-150',
          // A soft shadow keeps labels legible wherever they land on the environment.
          '[text-shadow:0_1px_3px_rgba(0,0,0,0.85)]',
          isSelected ? 'text-fg' : 'text-fg/80 group-hover:text-fg',
        )}
      >
        {application.shortTitle}
      </span>
    </button>
  );
}
