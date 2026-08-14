'use client';

import { DESKTOP_APPLICATIONS } from '@izhar-os/config';
import { useMemo } from 'react';

import { useChromeInsets, useDesktopSurface, useIconStyle } from '@/hooks/useEnvironment';
import { useIsMobile } from '@/hooks/useSystemPreferences';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import { computeLayout, countColumns, type PlacedIcon } from '@/lib/icon-grid';
import { useSystemStore } from '@/lib/store/system-store';

/** Columns in the mobile home-screen grid. Mirrors `grid-cols-4`. */
const MOBILE_COLUMNS = 4;
/** Height of one mobile home-screen row, including its gap, in pixels. */
const MOBILE_ROW_HEIGHT = 96;
/** Padding above the mobile grid, in pixels. Mirrors `pt-5`. */
const MOBILE_TOP_PADDING = 20;

export interface IconField {
  layout: PlacedIcon[];
  cell: { width: number; height: number };
  /** Tile size for the active environment and density, in pixels. */
  tileSize: number;
  padding: number;
  rowCount: number;
  columnCount: number;
  origin: 'left' | 'right';
  /**
   * Horizontal space the field claims on a desktop, including its padding.
   * Zero when icons are hidden or the field runs across the top on a phone.
   */
  reservedWidth: number;
  /** Vertical space the field claims on a phone, where it fills the top. */
  reservedHeight: number;
}

/**
 * The desktop icon field's geometry.
 *
 * Read by the field itself and by anything that has to stand clear of it. The
 * grid is measured in cells rather than pixels, so an environment switch only
 * changes the cell-to-pixel mapping — every icon keeps its place, and the
 * identity block learns immediately how much room the new environment's larger
 * or smaller icons take.
 */
export function useIconField(): IconField {
  const isMobile = useIsMobile();
  const surface = useDesktopSurface();
  const iconStyle = useIconStyle();
  const insets = useChromeInsets();
  const viewportHeight = useViewportHeight();

  const iconDensity = useSystemStore((state) => state.iconDensity);
  const iconsVisible = useSystemStore((state) => state.iconsVisible);
  const placements = useSystemStore((state) => state.iconPlacements);

  const cell = iconStyle.cell[iconDensity];
  const tileSize = iconStyle.tile[iconDensity];
  const padding = surface.iconPadding;

  // Rows that fit inside the work area this environment leaves free. The height
  // arrives through a store rather than from `window` directly, so the field the
  // server rendered is the field the client hydrates — and so the grid reflows
  // when the viewport changes instead of only when the environment does.
  const rowCount = useMemo(() => {
    const usable = viewportHeight - insets.top - insets.bottom - padding * 2;
    return Math.max(1, Math.floor(usable / cell.height));
  }, [cell.height, insets.bottom, insets.top, padding, viewportHeight]);

  const layout = useMemo(
    () => computeLayout(DESKTOP_APPLICATIONS, placements, rowCount),
    [placements, rowCount],
  );

  const columnCount = countColumns(layout);

  const mobileRows = Math.ceil(DESKTOP_APPLICATIONS.length / MOBILE_COLUMNS);

  return {
    layout,
    cell,
    tileSize,
    padding,
    rowCount,
    columnCount,
    origin: surface.iconOrigin,
    reservedWidth: !iconsVisible || isMobile ? 0 : padding + columnCount * cell.width,
    reservedHeight:
      !iconsVisible || !isMobile ? 0 : MOBILE_TOP_PADDING + mobileRows * MOBILE_ROW_HEIGHT,
  };
}
