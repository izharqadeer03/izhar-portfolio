import type { ApplicationId, EnvironmentId } from '@izhar-os/types';

import { MOBILE_DOCK_HEIGHT, MOBILE_STATUSBAR_HEIGHT, TASKBAR_HEIGHT } from '@/lib/constants';

/**
 * Environment geometry.
 *
 * This module is the only place that knows an environment's *shape*. The window
 * manager, the icon field and the desktop surface all measure themselves from
 * here, which is why switching environments can rearrange the entire workspace
 * without any of them learning that more than one environment exists.
 */

/** Space each edge of the viewport reserves for chrome, in pixels. */
export interface ChromeInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Where the chrome sits in each environment.
 *
 * - **Windows** — one bar along the bottom.
 * - **macOS** — a thin menu bar on top, a floating dock below.
 * - **Linux** — a panel on top and a vertical dock down the left edge.
 */
export const ENVIRONMENT_CHROME: Record<EnvironmentId, ChromeInsets> = {
  windows: { top: 0, right: 0, bottom: TASKBAR_HEIGHT, left: 0 },
  macos: { top: 30, right: 0, bottom: 82, left: 0 },
  linux: { top: 34, right: 0, bottom: 0, left: 58 },
};

/** Phones use one chrome for every environment — see MobileChrome for why. */
export const MOBILE_CHROME: ChromeInsets = {
  top: MOBILE_STATUSBAR_HEIGHT,
  right: 0,
  bottom: MOBILE_DOCK_HEIGHT,
  left: 0,
};

export function getChromeInsets(environment: EnvironmentId, isMobile: boolean): ChromeInsets {
  return isMobile ? MOBILE_CHROME : ENVIRONMENT_CHROME[environment];
}

/** macOS bar heights, exported so the menu bar and dock agree with the insets. */
export const MAC_MENUBAR_HEIGHT = ENVIRONMENT_CHROME.macos.top;
export const MAC_DOCK_HEIGHT = 62;
export const MAC_DOCK_GAP = ENVIRONMENT_CHROME.macos.bottom - MAC_DOCK_HEIGHT;

/** Linux panel and dock, likewise. */
export const LINUX_PANEL_HEIGHT = ENVIRONMENT_CHROME.linux.top;
export const LINUX_DOCK_WIDTH = ENVIRONMENT_CHROME.linux.left;

/* -------------------------------------------------------------------------- */
/* Window chrome                                                              */
/* -------------------------------------------------------------------------- */

export type WindowControlStyle = 'glyphs' | 'traffic' | 'compact';

export interface WindowChromeSpec {
  /** Corner radius of the frame, in pixels. */
  radius: number;
  /** Title bar height, in pixels. */
  headerHeight: number;
  controls: WindowControlStyle;
  /** Where the controls sit relative to the title. */
  controlsSide: 'start' | 'end';
  titleAlign: 'start' | 'center';
  /** Whether the application glyph appears in the title bar. */
  showIcon: boolean;
  /** Extra classes for the title text — this is where the OS voice comes from. */
  titleClass: string;
  /** Background of the title bar while the window is focused. */
  headerFocusClass: string;
  /** Frame padding around the application surface, in pixels. */
  contentInset: number;
}

/**
 * How a window is drawn in each environment.
 *
 * The same `Window` component reads this — there is one window manager, one
 * drag implementation and one resize implementation, and the differences below
 * are the entire visual delta between a Windows window and a Mac one.
 */
export const WINDOW_CHROME: Record<EnvironmentId, WindowChromeSpec> = {
  windows: {
    radius: 14,
    headerHeight: 40,
    controls: 'glyphs',
    controlsSide: 'end',
    titleAlign: 'start',
    showIcon: true,
    titleClass: 'text-[12.5px] font-medium tracking-tight',
    headerFocusClass: 'bg-white/[0.035]',
    contentInset: 0,
  },
  macos: {
    radius: 12,
    headerHeight: 38,
    controls: 'traffic',
    controlsSide: 'start',
    titleAlign: 'center',
    showIcon: false,
    titleClass: 'text-[13px] font-semibold tracking-[-0.01em]',
    headerFocusClass: 'bg-white/[0.055]',
    contentInset: 0,
  },
  linux: {
    radius: 6,
    headerHeight: 32,
    controls: 'compact',
    controlsSide: 'end',
    titleAlign: 'start',
    showIcon: true,
    titleClass: 'font-mono text-[11.5px] font-medium tracking-[0.02em]',
    headerFocusClass: 'bg-white/[0.04]',
    contentInset: 0,
  },
};

/* -------------------------------------------------------------------------- */
/* Desktop surface                                                            */
/* -------------------------------------------------------------------------- */

export interface DesktopSurfaceSpec {
  /** Which edge the icon field grows from. Mac desktops fill from the right. */
  iconOrigin: 'left' | 'right';
  /** Inset between the icon field and the work-area edges, in pixels. */
  iconPadding: number;
}

export const DESKTOP_SURFACE: Record<EnvironmentId, DesktopSurfaceSpec> = {
  windows: { iconOrigin: 'left', iconPadding: 24 },
  // Mac desktops have filled from the top-right corner since 1984.
  macos: { iconOrigin: 'right', iconPadding: 28 },
  linux: { iconOrigin: 'left', iconPadding: 16 },
};

/**
 * Applications pinned to each environment's taskbar or dock, in order.
 *
 * The file manager leads everywhere, because it is the door into the portfolio
 * — the same door in all three, wearing Explorer, Finder or Files chrome.
 */
export const ENVIRONMENT_PINS: Record<EnvironmentId, ApplicationId[]> = {
  windows: ['files', 'projects', 'experience', 'terminal', 'contact'],
  macos: ['files', 'projects', 'skills', 'ai-lab', 'resume', 'terminal', 'contact'],
  linux: ['files', 'terminal', 'projects', 'skills', 'ai-lab', 'contact'],
};

/* -------------------------------------------------------------------------- */
/* File manager                                                               */
/* -------------------------------------------------------------------------- */

/** A shortcut in the file manager's sidebar. Every one of them does something. */
export type PlaceId =
  'portfolio' | 'desktop' | 'documents' | 'downloads' | 'recents' | 'applications';

export interface FileManagerSpec {
  /** Name shown in the toolbar and the window's path bar. */
  name: string;
  /** Non-navigable ancestors shown before the root, e.g. `This PC`. */
  pathPrefix: string[];
  /** Separator drawn between path segments. */
  pathSeparator: string;
  /** Sidebar sections, in order. */
  sidebarSections: { label: string; places: PlaceId[] }[];
  /** Overrides for a place's name in this environment, e.g. Portfolio → Home. */
  placeLabels?: Partial<Record<PlaceId, string>>;
  /** Default listing mode when the window opens. */
  defaultView: 'grid' | 'list';
}

/**
 * How each environment's file manager introduces itself.
 *
 * The *contents* are shared — every listing is built from the same manifest —
 * so this describes only the frame around them: what the places sidebar calls
 * its shortcuts, and how a path is spelled. Note that no environment lists a
 * shortcut it cannot honour: a sidebar full of decorative entries would be a
 * screenshot of a file manager rather than one.
 */
export const FILE_MANAGER: Record<EnvironmentId, FileManagerSpec> = {
  windows: {
    name: 'File Explorer',
    pathPrefix: ['This PC', 'Izhar Qadeer'],
    pathSeparator: '›',
    sidebarSections: [
      { label: 'Quick access', places: ['portfolio', 'desktop', 'documents', 'downloads'] },
      { label: 'This PC', places: ['recents', 'applications'] },
    ],
    defaultView: 'list',
  },
  macos: {
    name: 'Finder',
    pathPrefix: ['Izhar Qadeer'],
    pathSeparator: '›',
    sidebarSections: [
      {
        label: 'Favourites',
        places: ['recents', 'applications', 'desktop', 'documents', 'downloads'],
      },
      { label: 'Locations', places: ['portfolio'] },
    ],
    defaultView: 'grid',
  },
  linux: {
    name: 'Files',
    pathPrefix: [],
    pathSeparator: '/',
    sidebarSections: [
      { label: 'Places', places: ['portfolio', 'desktop', 'documents', 'downloads'] },
      { label: 'System', places: ['recents', 'applications'] },
    ],
    // Nautilus calls the user's root Home, and spells the path like a shell does.
    placeLabels: { portfolio: 'Home' },
    defaultView: 'grid',
  },
};

/** Transition timing when the visitor changes environment, in milliseconds. */
export const WORKSPACE_TRANSITION = {
  /** The moment the new environment actually mounts, mid-fade. */
  commit: 340,
  /** When the overlay finishes leaving. */
  total: 820,
  /** Compressed sequence under `prefers-reduced-motion`. */
  reducedCommit: 60,
  reducedTotal: 160,
} as const;
