'use client';

import type { ApplicationDefinition } from '@izhar-os/types';
import { cn } from '@izhar-os/ui';
import type { PointerEvent as ReactPointerEvent, Ref } from 'react';

import { AppTile } from '@/components/applications/AppIcon';
import { useIconStyle } from '@/hooks/useEnvironment';

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
  const iconStyle = useIconStyle();

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
        'group absolute flex select-none flex-col items-center gap-2 px-1 py-2.5',
        // The selection plate takes the environment's own corner: Fluent's small
        // radius, macOS's generous one, GNOME's near-square.
        iconStyle.cellRadiusClass,
        'border border-transparent transition-[background-color,border-color,opacity] duration-(--dur-env) ease-env',
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
          'transition-transform duration-(--dur-env) ease-env',
          'group-hover:-translate-y-0.5 group-active:translate-y-0',
        )}
      >
        <AppTile
          icon={application.icon}
          accent={application.accent}
          size={tileSize}
          // Hover and selection brighten the tile rather than restating its
          // border: each environment already draws its own rim, and overriding
          // that would flatten a lit Aqua icon into a Yaru chip.
          className={cn(
            'transition-[filter] duration-(--dur-env) ease-env',
            'group-hover:brightness-110',
            isSelected && 'brightness-110',
          )}
        />
      </span>

      <span
        className={cn(
          'line-clamp-2 max-w-full text-center transition-colors duration-150',
          iconStyle.labelClass,
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
