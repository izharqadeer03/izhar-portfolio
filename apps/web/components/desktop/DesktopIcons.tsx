'use client';

import { DESKTOP_APPLICATIONS } from '@izhar-os/config';
import type { ApplicationDefinition, ApplicationId } from '@izhar-os/types';
import { useCallback, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

import { DesktopIcon } from '@/components/desktop/DesktopIcon';
import { useChromeInsets, useEnvironmentMotion } from '@/hooks/useEnvironment';
import { useIconField } from '@/hooks/useIconField';
import { useHasFinePointer, useIsMobile } from '@/hooks/useSystemPreferences';
import { type PlacedIcon } from '@/lib/icon-grid';
import { useSystemStore } from '@/lib/store/system-store';
import { useWindowStore } from '@/lib/store/window-store';
import { clamp } from '@/lib/utils';

/** Movement past this many pixels turns a press into a drag, not a click. */
const DRAG_THRESHOLD = 5;

/**
 * The desktop icon field.
 *
 * On a pointer device this behaves like a real desktop: click selects, double
 * click opens, icons drag to a snapped grid, and arrow keys walk the field.
 * On touch it becomes a home screen where one tap opens — the desktop idioms
 * are dropped rather than emulated.
 *
 * Positions are stored as grid cells rather than pixels, which is what lets the
 * field re-anchor from the left edge to the right one when the environment
 * changes without an icon losing its place: only the mapping from cell to
 * pixel changes, and the arrangement is preserved.
 */
export function DesktopIcons() {
  const isMobile = useIsMobile();
  const hasFinePointer = useHasFinePointer();
  const insets = useChromeInsets();
  const motion = useEnvironmentMotion();
  const { layout, cell, tileSize, padding, rowCount, origin } = useIconField();

  const iconsVisible = useSystemStore((state) => state.iconsVisible);
  const desktopEpoch = useSystemStore((state) => state.desktopEpoch);
  const selectedIconId = useSystemStore((state) => state.selectedIconId);
  const selectIcon = useSystemStore((state) => state.selectIcon);
  const setIconPlacement = useSystemStore((state) => state.setIconPlacement);

  const openWindow = useWindowStore((state) => state.openWindow);

  const [activeIndex, setActiveIndex] = useState(0);
  const [draggingId, setDraggingId] = useState<ApplicationId | null>(null);
  const nodesRef = useRef(new Map<ApplicationId, HTMLButtonElement | null>());
  const didDragRef = useRef(false);

  /** Right-anchored fields count columns leftward from the right edge. */
  const direction = origin === 'right' ? -1 : 1;

  /** The active environment's entrance, as a CSS shorthand. */
  const enterAnimation = (index: number) =>
    `${motion.iconEnter} ${motion.iconEnterDuration}ms var(--ease-env) ${index * motion.stagger}ms backwards`;

  /** Keyboard order: down a column, then across — matching what the eye does. */
  const keyboardOrder = useMemo(
    () => [...layout].sort((a, b) => (a.col === b.col ? a.row - b.row : a.col - b.col)),
    [layout],
  );

  const focusIndex = useCallback(
    (index: number) => {
      const target = keyboardOrder[index];
      if (!target) return;
      setActiveIndex(index);
      nodesRef.current.get(target.application.id)?.focus();
    },
    [keyboardOrder],
  );

  const handleKeyDown = useCallback(
    (
      event: React.KeyboardEvent<HTMLButtonElement>,
      application: ApplicationDefinition,
      index: number,
    ) => {
      const columnLength = Math.min(rowCount, keyboardOrder.length);

      switch (event.key) {
        case 'Enter':
          event.preventDefault();
          openWindow(application.id);
          break;
        case 'ArrowDown':
          event.preventDefault();
          focusIndex(Math.min(keyboardOrder.length - 1, index + 1));
          break;
        case 'ArrowUp':
          event.preventDefault();
          focusIndex(Math.max(0, index - 1));
          break;
        case 'ArrowRight':
          event.preventDefault();
          // On a right-anchored field the next column is to the *left*, so the
          // arrow that moves toward it is flipped with the origin.
          focusIndex(clamp(index + direction * columnLength, 0, keyboardOrder.length - 1));
          break;
        case 'ArrowLeft':
          event.preventDefault();
          focusIndex(clamp(index - direction * columnLength, 0, keyboardOrder.length - 1));
          break;
        default:
          break;
      }
    },
    [direction, focusIndex, keyboardOrder.length, openWindow, rowCount],
  );

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>, placedIcon: PlacedIcon) => {
      if (!hasFinePointer || event.button !== 0) return;

      const node = event.currentTarget;
      const startX = event.clientX;
      const startY = event.clientY;
      didDragRef.current = false;

      const handleMove = (moveEvent: PointerEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;

        if (!didDragRef.current) {
          if (Math.hypot(deltaX, deltaY) < DRAG_THRESHOLD) return;
          didDragRef.current = true;
          setDraggingId(placedIcon.application.id);
          node.style.zIndex = '30';
        }

        node.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      };

      const handleUp = (upEvent: PointerEvent) => {
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleUp);
        window.removeEventListener('pointercancel', handleUp);

        node.style.transform = '';
        node.style.zIndex = '';
        setDraggingId(null);

        if (!didDragRef.current) return;

        // Snap to whichever cell the icon's centre landed nearest. Horizontal
        // movement counts against the origin on a right-anchored field.
        const deltaX = (upEvent.clientX - startX) * direction;
        const deltaY = upEvent.clientY - startY;
        const droppedCol = Math.round((placedIcon.col * cell.width + deltaX) / cell.width);
        const droppedRow = Math.round((placedIcon.row * cell.height + deltaY) / cell.height);

        const usableWidth = window.innerWidth - insets.left - insets.right - padding * 2;
        const maxCol = Math.max(0, Math.floor(usableWidth / cell.width) - 1);

        setIconPlacement(placedIcon.application.id, {
          col: clamp(droppedCol, 0, maxCol),
          row: clamp(droppedRow, 0, rowCount - 1),
        });
      };

      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
      window.addEventListener('pointercancel', handleUp);
    },
    [
      cell.height,
      cell.width,
      direction,
      hasFinePointer,
      insets.left,
      insets.right,
      padding,
      rowCount,
      setIconPlacement,
    ],
  );

  if (!iconsVisible) return null;

  // -- Mobile: a home screen, not a shrunken desktop. --------------------------
  if (isMobile) {
    return (
      <div
        key={desktopEpoch}
        className="absolute inset-x-0 top-0 px-5 pt-5"
        role="group"
        aria-label="Applications"
      >
        <div className="grid grid-cols-4 gap-x-2 gap-y-4">
          {DESKTOP_APPLICATIONS.map((application, index) => (
            <DesktopIcon
              key={application.id}
              application={application}
              isSelected={false}
              isDragging={false}
              tileSize={tileSize}
              tabIndex={0}
              onClick={() => openWindow(application.id)}
              onDoubleClick={() => openWindow(application.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') openWindow(application.id);
              }}
              className="static w-full"
              style={{ animation: enterAnimation(index) }}
            />
          ))}
        </div>
      </div>
    );
  }

  // -- Desktop: a real icon field. ---------------------------------------------
  return (
    <div
      key={desktopEpoch}
      className="absolute inset-0"
      role="group"
      aria-label="Desktop shortcuts"
    >
      {layout.map((placedIcon, index) => {
        const orderIndex = keyboardOrder.findIndex(
          (entry) => entry.application.id === placedIcon.application.id,
        );

        const offset = padding + placedIcon.col * cell.width;

        return (
          <DesktopIcon
            key={placedIcon.application.id}
            application={placedIcon.application}
            isSelected={selectedIconId === placedIcon.application.id}
            isDragging={draggingId === placedIcon.application.id}
            tileSize={tileSize}
            tabIndex={orderIndex === activeIndex ? 0 : -1}
            ref={(node) => {
              nodesRef.current.set(placedIcon.application.id, node);
            }}
            onPointerDown={(event) => handlePointerDown(event, placedIcon)}
            onClick={() => {
              if (didDragRef.current) return;
              setActiveIndex(orderIndex);
              selectIcon(placedIcon.application.id);
            }}
            onDoubleClick={() => {
              if (didDragRef.current) return;
              openWindow(placedIcon.application.id);
            }}
            onKeyDown={(event) => handleKeyDown(event, placedIcon.application, orderIndex)}
            style={{
              ...(origin === 'right' ? { right: offset } : { left: offset }),
              top: padding + placedIcon.row * cell.height,
              width: cell.width,
              animation: enterAnimation(index),
            }}
          />
        );
      })}
    </div>
  );
}
