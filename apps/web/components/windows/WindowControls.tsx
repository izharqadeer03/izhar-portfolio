'use client';

import { cn } from '@izhar-os/ui';
import { Minus, X } from 'lucide-react';

import type { WindowControlStyle } from '@/lib/environment';

interface WindowControlsProps {
  title: string;
  style: WindowControlStyle;
  isMaximized: boolean;
  canMaximize: boolean;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onClose: () => void;
}

/**
 * Minimize / maximize / close, in three dialects.
 *
 * The set of actions is identical everywhere — only their drawing changes,
 * because that is the single most recognisable difference between one desktop
 * and another. Every variant renders three real buttons with accessible names
 * that say which window they act on, including the traffic lights, whose
 * meaning is otherwise carried entirely by colour.
 */
export function WindowControls({
  title,
  style,
  isMaximized,
  canMaximize,
  onMinimize,
  onToggleMaximize,
  onClose,
}: WindowControlsProps) {
  if (style === 'traffic') {
    return (
      <TrafficLights
        title={title}
        isMaximized={isMaximized}
        canMaximize={canMaximize}
        onMinimize={onMinimize}
        onToggleMaximize={onToggleMaximize}
        onClose={onClose}
      />
    );
  }

  const compact = style === 'compact';

  const control = cn(
    'grid place-items-center transition-colors duration-150 ease-env',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70',
    'focus-visible:ring-offset-1 focus-visible:ring-offset-surface',
    compact
      ? 'size-6 rounded-[3px] text-muted hover:bg-white/10 hover:text-fg'
      : 'size-7 rounded-md text-faint hover:bg-white/8 hover:text-fg',
  );

  return (
    <div className={cn('flex items-center', compact ? 'gap-px' : 'gap-0.5')}>
      <button
        type="button"
        className={cn(control, 'os-tip')}
        data-tip="Minimize"
        aria-label={`Minimize ${title}`}
        onClick={onMinimize}
      >
        <Minus size={compact ? 12 : 13} strokeWidth={1.8} />
      </button>

      {canMaximize ? (
        <button
          type="button"
          className={cn(control, 'os-tip')}
          data-tip={isMaximized ? 'Restore' : 'Maximize'}
          aria-label={`${isMaximized ? 'Restore' : 'Maximize'} ${title}`}
          onClick={onToggleMaximize}
        >
          {isMaximized ? (
            // Restore: two offset frames, drawn rather than imported so the
            // pair reads as one idea at 13px.
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <rect
                x="1.5"
                y="4.5"
                width="8"
                height="8"
                rx={compact ? 0.6 : 1.6}
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path
                d="M4.5 4.2V3.1A1.6 1.6 0 0 1 6.1 1.5h6.3"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M12.5 1.9v6.2a1.6 1.6 0 0 1-1.6 1.6h-1"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <rect
                x="2"
                y="2"
                width="10"
                height="10"
                // Square corners in the technical environment, rounded in the
                // familiar one — the same glyph, in two accents.
                rx={compact ? 0.8 : 1.8}
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
          )}
        </button>
      ) : null}

      <button
        type="button"
        className={cn(control, 'os-tip hover:bg-rose-500/18 hover:text-rose-200')}
        data-tip="Close"
        aria-label={`Close ${title}`}
        onClick={onClose}
      >
        <X size={compact ? 13 : 14} strokeWidth={1.8} />
      </button>
    </div>
  );
}

const LIGHT =
  'group/light grid size-3 place-items-center rounded-full transition-[filter,transform] duration-150 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 ' +
  'focus-visible:ring-offset-surface hover:brightness-110';

/** The glyph inside a light, revealed when the row is hovered. */
const LIGHT_GLYPH =
  'opacity-0 transition-opacity duration-150 group-hover/lights:opacity-100 group-focus-visible/light:opacity-100';

function TrafficLights({
  title,
  isMaximized,
  canMaximize,
  onMinimize,
  onToggleMaximize,
  onClose,
}: Omit<WindowControlsProps, 'style'>) {
  return (
    <div className="group/lights flex items-center gap-2">
      <button
        type="button"
        className={cn(LIGHT, 'bg-[#ff5f57]')}
        aria-label={`Close ${title}`}
        onClick={onClose}
      >
        <svg width="7" height="7" viewBox="0 0 8 8" aria-hidden="true" className={LIGHT_GLYPH}>
          <path d="M2 2l4 4M6 2L2 6" stroke="#7d0f08" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </button>

      <button
        type="button"
        className={cn(LIGHT, 'bg-[#febc2e]')}
        aria-label={`Minimize ${title}`}
        onClick={onMinimize}
      >
        <svg width="7" height="7" viewBox="0 0 8 8" aria-hidden="true" className={LIGHT_GLYPH}>
          <path d="M1.8 4h4.4" stroke="#87550a" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </button>

      <button
        type="button"
        className={cn(LIGHT, canMaximize ? 'bg-[#28c840]' : 'bg-white/15')}
        aria-label={`${isMaximized ? 'Restore' : 'Maximize'} ${title}`}
        onClick={onToggleMaximize}
        disabled={!canMaximize}
      >
        <svg width="7" height="7" viewBox="0 0 8 8" aria-hidden="true" className={LIGHT_GLYPH}>
          {isMaximized ? (
            <path d="M1.4 4h5.2" stroke="#0b5417" strokeWidth="1.3" strokeLinecap="round" />
          ) : (
            <path
              d="M2.6 5.4V2.6h2.8M5.4 2.6 2.6 5.4"
              stroke="#0b5417"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </button>
    </div>
  );
}
