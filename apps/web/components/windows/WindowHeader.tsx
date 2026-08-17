'use client';

import type { ApplicationDefinition } from '@izhar-os/types';
import { cn } from '@izhar-os/ui';
import { ArrowLeft } from 'lucide-react';
import type { PointerEvent as ReactPointerEvent } from 'react';

import { AppGlyph, getAccentValue } from '@/components/applications/AppIcon';
import { WindowControls } from '@/components/windows/WindowControls';
import type { WindowChromeSpec } from '@/lib/environment';

interface WindowHeaderProps {
  application: ApplicationDefinition;
  chrome: WindowChromeSpec;
  title: string;
  isFocused: boolean;
  isMaximized: boolean;
  isMobile: boolean;
  onDragStart: (event: ReactPointerEvent<HTMLElement>) => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onClose: () => void;
}

/**
 * The window's title bar and its drag handle.
 *
 * One implementation, arranged three ways from the environment's chrome spec:
 * controls at the leading edge with a centred title, or trailing with the title
 * beside the application glyph. The drag gesture is identical in all of them.
 *
 * On a phone it becomes a navigation bar with a single obvious back action —
 * dragging a sheet around a 390px screen would be a costume, not a feature.
 */
export function WindowHeader({
  application,
  chrome,
  title,
  isFocused,
  isMaximized,
  isMobile,
  onDragStart,
  onMinimize,
  onToggleMaximize,
  onClose,
}: WindowHeaderProps) {
  if (isMobile) {
    return (
      <header className="flex h-13 shrink-0 items-center gap-3 border-b border-line px-3">
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${title}`}
          className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-white/8 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
        >
          <ArrowLeft size={17} strokeWidth={1.7} />
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span style={{ color: getAccentValue(application.accent) }} className="flex">
            <AppGlyph icon={application.icon} size={15} />
          </span>
          <h2 className="truncate text-[14px] font-medium text-fg">{title}</h2>
        </div>
      </header>
    );
  }

  const controls = (
    // Controls sit outside the drag gesture.
    <div
      className="shrink-0"
      onPointerDown={(event) => event.stopPropagation()}
      onDoubleClick={(event) => event.stopPropagation()}
    >
      <WindowControls
        title={title}
        style={chrome.controls}
        isFocused={isFocused}
        isMaximized={isMaximized}
        canMaximize
        onMinimize={onMinimize}
        onToggleMaximize={onToggleMaximize}
        onClose={onClose}
      />
    </div>
  );

  const centred = chrome.titleAlign === 'center';

  return (
    <header
      // The whole bar drags, minus the controls (they stop propagation).
      onPointerDown={onDragStart}
      onDoubleClick={onToggleMaximize}
      style={{
        height: chrome.headerHeight,
        borderTopLeftRadius: chrome.radius - 1,
        borderTopRightRadius: chrome.radius - 1,
      }}
      className={cn(
        'relative flex shrink-0 items-center gap-2.5 border-b border-line px-3',
        'touch-none select-none',
        isMaximized ? 'cursor-default' : 'cursor-grab active:cursor-grabbing',
        isFocused ? chrome.headerFocusClass : 'bg-transparent',
      )}
    >
      {chrome.controlsSide === 'start' ? controls : null}

      {chrome.showIcon ? (
        <span
          className="flex shrink-0 transition-opacity duration-200"
          style={{
            color: getAccentValue(application.accent),
            opacity: isFocused ? 0.95 : 0.5,
          }}
        >
          <AppGlyph icon={application.icon} size={14} />
        </span>
      ) : null}

      <h2
        className={cn(
          'min-w-0 flex-1 truncate transition-colors duration-200',
          chrome.titleClass,
          isFocused ? 'text-fg' : 'text-muted',
          // A centred title has to ignore the controls' width to stay optically
          // centred, so it is positioned rather than laid out in the flex row.
          // The padding keeps a long title from running under the lights.
          centred && 'pointer-events-none absolute inset-x-0 px-16 text-center',
        )}
      >
        {title}
      </h2>

      {/* Keeps the flex row honest while the centred title is out of flow. */}
      {centred ? <span className="flex-1" aria-hidden="true" /> : null}

      {chrome.controlsSide === 'end' ? controls : null}
    </header>
  );
}
