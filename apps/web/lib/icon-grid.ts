import type { ApplicationDefinition, ApplicationId } from '@izhar-os/types';

import type { GridCell } from '@/lib/store/system-store';
import { clamp } from '@/lib/utils';

/**
 * The desktop icon grid.
 *
 * Kept out of the icon field component because two layers need the same
 * answer: the field, to place icons, and the identity block, to know how much
 * of the desktop the field has already claimed. One implementation means the
 * two can never disagree about where the icons are.
 */

export interface PlacedIcon extends GridCell {
  application: ApplicationDefinition;
}

export const cellKey = (cell: GridCell) => `${cell.col}:${cell.row}`;

/** Nearest free cell to `desired`, searched outward ring by ring. */
export function findFreeCell(
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
export function computeLayout(
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

/** Columns a resolved layout occupies. */
export function countColumns(layout: PlacedIcon[]): number {
  return layout.reduce((widest, icon) => Math.max(widest, icon.col + 1), 0);
}
