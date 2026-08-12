'use client';

import { DESKTOP_APPLICATIONS } from '@izhar-os/config';
import type { ApplicationDefinition, ApplicationId } from '@izhar-os/types';
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';

import { DesktopIcon } from '@/components/desktop/DesktopIcon';
import { useChromeInsets, useDesktopSurface } from '@/hooks/useEnvironment';
import { useHasFinePointer, useIsMobile } from '@/hooks/useSystemPreferences';
import { ICON_CELL } from '@/lib/constants';
import { useSystemStore, type GridCell } from '@/lib/store/system-store';
import { useWindowStore } from '@/lib/store/window-store';
import { clamp } from '@/lib/utils';

interface PlacedIcon extends GridCell {
  application: ApplicationDefinition;
}

const cellKey = (cell: GridCell) => `${cell.col}:${cell.row}`;
/** Movement past this many pixels turns a press into a drag, not a click. */
const DRAG_THRESHOLD = 5;

/** Nearest free cell to `desired`, searched outward ring by ring. */
function findFreeCell(
  desired: GridCell,
  occupied: Map<string, ApplicationId>,
  rowCount: number,
): GridCell {
  const start = { col: Math.max(0, desired.col), row: clamp(desired.row, 0, rowCount - 1) };
  if (!occupied.has(cellKey(start))) return start;

  for (let radius = 1; radius <= 10; radius += 1) {
    for (let deltaCol = -radius; deltaCol <= radius; deltaCol += 1) {
      for (let deltaRow = -radius; deltaRow <= radius; deltaRow += 1) {
        if (Math.max(Math.abs(deltaCol), Math.abs(deltaRow)) !== radius) continue;

        const candidate = { col: start.col + deltaCol, row: start.row + deltaRow };
        if (candidate.col < 0 || candidate.row < 0 || candidate.row >= rowCount) continue;
        if (!occupied.has(cellKey(candidate))) return candidate;
      }
    }
  }

  return start;
}

/**
 * Resolves final cells for every icon: explicitly placed ones keep their spot,
 * everything else flows column-major into the gaps.
 */
function computeLayout(
  applications: ApplicationDefinition[],
  placements: Partial<Record<ApplicationId, GridCell>>,
  rowCount: number,
): PlacedIcon[] {
  const occupied = new Map<string, ApplicationId>();
  const placed: PlacedIcon[] = [];
  const flowing: ApplicationDefinition[] = [];

  for (const application of applications) {
    const requested = placements[application.id];
    if (!requested) {
      flowing.push(application);
      continue;
    }
    const cell = findFreeCell(requested, occupied, rowCount);
    occupied.set(cellKey(cell), application.id);
    placed.push({ application, ...cell });
  }

  let cursor = 0;
  for (const application of flowing) {
    let cell: GridCell;
    do {
      cell = { col: Math.floor(cursor / rowCount), row: cursor % rowCount };
      cursor += 1;
    } while (occupied.has(cellKey(cell)));

    occupied.set(cellKey(cell), application.id);
    placed.push({ application, ...cell });
  }

  return placed;
}

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
  const surface = useDesktopSurface();
  const insets = useChromeInsets();

  const iconDensity = useSystemStore((state) => state.iconDensity);
  const iconsVisible = useSystemStore((state) => state.iconsVisible);
  const desktopEpoch = useSystemStore((state) => state.desktopEpoch);
  const placements = useSystemStore((state) => state.iconPlacements);
  const selectedIconId = useSystemStore((state) => state.selectedIconId);
  const selectIcon = useSystemStore((state) => state.selectIcon);
  const setIconPlacement = useSystemStore((state) => state.setIconPlacement);

  const openWindow = useWindowStore((state) => state.openWindow);

  const [activeIndex, setActiveIndex] = useState(0);
  const [draggingId, setDraggingId] = useState<ApplicationId | null>(null);
  const nodesRef = useRef(new Map<ApplicationId, HTMLButtonElement | null>());
  const didDragRef = useRef(false);

  const cell = ICON_CELL[iconDensity];
  const tileSize = iconDensity === 'comfortable' ? 46 : 38;
  const padding = surface.iconPadding;
  /** Right-anchored fields count columns leftward from the right edge. */
  const direction = surface.iconOrigin === 'right' ? -1 : 1;

  // Rows that fit inside the work area this environment leaves free.
  const rowCount = useMemo(() => {
    if (typeof window === 'undefined') return 6;
    const usable = window.innerHeight - insets.top - insets.bottom - padding * 2;
    return Math.max(1, Math.floor(usable / cell.height));
  }, [cell.height, insets.bottom, insets.top, padding]);

  const layout = useMemo(
    () => computeLayout(DESKTOP_APPLICATIONS, placements, rowCount),
    [placements, rowCount],
  );

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
              tileSize={46}
              tabIndex={0}
              onClick={() => openWindow(application.id)}
              onDoubleClick={() => openWindow(application.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') openWindow(application.id);
              }}
              className="static w-full"
              style={{ animation: `icon-in 420ms var(--ease-os) ${index * 35}ms backwards` }}
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
              ...(surface.iconOrigin === 'right' ? { right: offset } : { left: offset }),
              top: padding + placedIcon.row * cell.height,
              width: cell.width,
              animation: `icon-in 420ms var(--ease-os) ${index * 35}ms backwards`,
            }}
          />
        );
      })}
    </div>
  );
}
