'use client';

import type { ApplicationDefinition } from '@izhar-os/types';
import { cn } from '@izhar-os/ui';
import type { PointerEvent as ReactPointerEvent, Ref } from 'react';

import { AppTile, getAccentValue } from '@/components/applications/AppIcon';
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
 * Hover lifts the tile with a soft ambient aura matching its accent color;
 * selection provides a polished frosted glass plate with subtle luminous rim.
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
  const accentColor = getAccentValue(application.accent);

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
        'group absolute flex select-none flex-col items-center gap-2 px-1.5 py-2.5',
        iconStyle.cellRadiusClass,
        'border transition-all duration-(--dur-env) ease-env',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70',
        isSelected
          ? 'border-white/20 bg-white/[0.10] shadow-[0_0_16px_rgba(56,207,232,0.12),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md'
          : 'border-transparent hover:border-white/10 hover:bg-white/[0.04]',
        isDragging && 'opacity-40 scale-95',
        className,
      )}
    >
      <span className="relative flex shrink-0 items-center justify-center">
        {/* Soft Ambient Radial Glow behind the icon on hover and active */}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute -inset-3 rounded-full opacity-0 blur-xl transition-opacity duration-300',
            'group-hover:opacity-45',
            isSelected && 'opacity-50',
          )}
          style={{ background: accentColor }}
        />

        <span
          className={cn(
            'relative transition-transform duration-(--dur-env) ease-env',
            'group-hover:-translate-y-1 group-hover:scale-[1.03] group-active:translate-y-0 group-active:scale-100',
          )}
        >
          <AppTile
            icon={application.icon}
            accent={application.accent}
            size={tileSize}
            className={cn(
              'transition-[filter] duration-(--dur-env) ease-env',
              'group-hover:brightness-110 drop-shadow-[0_4px_10px_rgba(0,0,0,0.45)]',
              isSelected && 'brightness-110 drop-shadow-[0_6px_14px_rgba(0,0,0,0.6)]',
            )}
          />
        </span>
      </span>

      <span
        className={cn(
          'line-clamp-2 max-w-full px-1 text-center font-medium transition-colors duration-150',
          iconStyle.labelClass,
          '[text-shadow:0_1px_4px_rgba(0,0,0,0.9),0_0_2px_rgba(0,0,0,0.85)]',
          isSelected ? 'text-fg font-semibold' : 'text-fg/90 group-hover:text-fg',
        )}
      >
        {application.shortTitle}
      </span>
    </button>
  );
}

