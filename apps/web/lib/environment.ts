import type { ApplicationId, EnvironmentId, IconDensity } from '@izhar-os/types';

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
 * - **Ubuntu** — a panel on top and a vertical dock down the left edge.
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

/** Ubuntu panel and dock, likewise. */
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
/* Application chrome                                                         */
/* -------------------------------------------------------------------------- */

/**
 * How an application arranges its own navigation.
 *
 * - **rail** — Fluent's NavigationView: a vertical pane with an accent
 *   indicator against the selected item.
 * - **source-list** — the macOS sidebar: rounded selection pills under quiet
 *   uppercase group headers.
 * - **header-tabs** — GNOME's linked view-switcher across the top of the view.
 */
export type ApplicationNavigationStyle = 'rail' | 'source-list' | 'header-tabs';

/**
 * The design tokens an application uses to belong to its environment.
 *
 * This is the theme layer of Phase 2: an application writes its content once
 * and reads its *voice* from here, so Windows, macOS and Ubuntu each get a
 * native-feeling surface without a second copy of the application existing.
 * Arrangement that cannot be expressed as a token — where the navigation sits,
 * what the selected item looks like — is driven by `navigation` inside the
 * application's own navigation component.
 */
export interface ApplicationChromeSpec {
  navigation: ApplicationNavigationStyle;
  /** Width of the navigation pane on desktop, in pixels. Rail and list only. */
  navWidth: number;
  /** Material behind the navigation pane. */
  navSurfaceClass: string;
  /** Corner radius of cards and panels, in pixels. */
  cardRadius: number;
  /** Corner radius of controls — chips, buttons, bars — in pixels. */
  controlRadius: number;
  /** Horizontal padding of the content column, in pixels. */
  contentPadding: number;
  /** Vertical rhythm between sections, in pixels. */
  sectionGap: number;
  /** Card material and its resting border. */
  cardClass: string;
  /** The largest type in the application — where the OS voice is loudest. */
  displayClass: string;
  /** Section heading treatment. */
  headingClass: string;
  /** The small label that sits above a section heading. */
  eyebrowClass: string;
}

export const APPLICATION_CHROME: Record<EnvironmentId, ApplicationChromeSpec> = {
  // Fluent: structured, mid-density, Segoe-weight headings, soft acrylic panes.
  windows: {
    navigation: 'rail',
    navWidth: 210,
    navSurfaceClass: 'bg-white/[0.022] border-e border-line',
    cardRadius: 8,
    controlRadius: 6,
    contentPadding: 28,
    sectionGap: 40,
    cardClass: 'border border-line bg-white/[0.028]',
    displayClass: 'text-[32px] leading-[1.08] font-semibold tracking-[-0.022em]',
    headingClass: 'text-[15px] font-semibold tracking-[-0.01em]',
    eyebrowClass: 'font-mono text-[10px] tracking-[0.18em] uppercase',
  },
  // macOS: more air, deeper display type, vibrancy instead of borders.
  macos: {
    navigation: 'source-list',
    navWidth: 218,
    navSurfaceClass: 'mac-vibrancy border-e border-line',
    cardRadius: 12,
    controlRadius: 8,
    contentPadding: 36,
    sectionGap: 52,
    cardClass: 'border border-white/8 bg-white/[0.04]',
    displayClass: 'text-[36px] leading-[1.04] font-semibold tracking-[-0.032em]',
    headingClass: 'text-[15.5px] font-semibold tracking-[-0.016em]',
    eyebrowClass: 'text-[10.5px] font-semibold tracking-[0.1em] uppercase',
  },
  // Yaru: denser, flatter, small radii, bold GNOME headings.
  linux: {
    navigation: 'header-tabs',
    navWidth: 0,
    navSurfaceClass: 'bg-black/25 border-b border-black/40',
    cardRadius: 6,
    controlRadius: 5,
    contentPadding: 22,
    sectionGap: 34,
    cardClass: 'border border-white/10 bg-white/[0.035]',
    displayClass: 'text-[29px] leading-[1.1] font-bold tracking-[-0.012em]',
    headingClass: 'text-[14.5px] font-bold tracking-[-0.005em]',
    eyebrowClass: 'font-mono text-[10px] tracking-[0.14em] uppercase',
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

/* -------------------------------------------------------------------------- */
/* Icons                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * The material an application tile is made of.
 *
 * - **fluent** — the plate is filled with the application's colour and edged
 *   with one bright hairline, a light glyph on top.
 * - **aqua** — the same fill, but a deeper ramp, a gloss across the top half
 *   and a longer drop, the way Big Sur sits an app above the desktop.
 * - **yaru** — no glass and no fill: a solid warm-dark chip with a hard edge,
 *   where the glyph is the only thing carrying colour.
 */
export type TileFinish = 'fluent' | 'aqua' | 'yaru';

export interface IconStyleSpec {
  /** Cell footprint per density, in pixels. Mac cells are the roomiest. */
  cell: Record<IconDensity, { width: number; height: number }>;
  /** Tile size per density, in pixels. */
  tile: Record<IconDensity, number>;
  /** Tile corner radius, as a CSS length or percentage. */
  tileRadius: string;
  finish: TileFinish;
  /** Glyph size as a fraction of the tile. */
  glyphRatio: number;
  /** Glyph stroke weight — Yaru's icon set is drawn heavier than Fluent's. */
  glyphStroke: number;
  /** Label typography beneath a desktop icon. */
  labelClass: string;
  /** Corner radius of the selection plate behind a whole desktop cell. */
  cellRadiusClass: string;
}

/**
 * How each environment draws an application icon.
 *
 * Icon shape is the fastest way an eye names a desktop — before the taskbar,
 * before the type. So the three differ in every dimension that reads at a
 * glance: Fluent's square-ish plate, Big Sur's large glossy squircle, Yaru's
 * small flat disc — each with the label voice that environment sets it in.
 */
export const DESKTOP_ICONS: Record<EnvironmentId, IconStyleSpec> = {
  windows: {
    cell: { comfortable: { width: 92, height: 104 }, compact: { width: 76, height: 84 } },
    tile: { comfortable: 46, compact: 38 },
    tileRadius: '22%',
    finish: 'fluent',
    // A white glyph on a lit plate already carries; drawn at Yaru's weight it
    // reads as bold. Fluent's own set is a thin line held clear of the edges.
    glyphRatio: 0.46,
    glyphStroke: 1.5,
    labelClass: 'text-[11.5px] leading-tight tracking-tight',
    cellRadiusClass: 'rounded-md',
  },
  macos: {
    cell: { comfortable: { width: 104, height: 116 }, compact: { width: 86, height: 96 } },
    tile: { comfortable: 56, compact: 46 },
    tileRadius: '23%',
    finish: 'aqua',
    // Aqua's glyphs are lighter still than Fluent's, and sit on a bigger tile.
    glyphRatio: 0.48,
    glyphStroke: 1.45,
    labelClass: 'text-[11px] font-medium leading-tight tracking-[-0.005em]',
    cellRadiusClass: 'rounded-xl',
  },
  linux: {
    cell: { comfortable: { width: 84, height: 96 }, compact: { width: 72, height: 80 } },
    tile: { comfortable: 40, compact: 34 },
    // Yaru's app icons are discs; nothing else on the desktop is this round.
    tileRadius: '50%',
    finish: 'yaru',
    glyphRatio: 0.48,
    glyphStroke: 2,
    labelClass: 'font-mono text-[11px] leading-tight tracking-[0.005em]',
    cellRadiusClass: 'rounded',
  },
};

/* -------------------------------------------------------------------------- */
/* Motion                                                                     */
/* -------------------------------------------------------------------------- */

export interface EnvironmentMotionSpec {
  /** The environment's easing curve, for motion/react. */
  ease: readonly [number, number, number, number];
  /** Base entrance duration, in seconds. */
  duration: number;
  /** Delay between successive siblings entering, in milliseconds. */
  stagger: number;
  /** Distance an entering element rises from, in pixels. */
  rise: number;
  /** Scale an entering element grows from. */
  scaleFrom: number;
  /** CSS keyframes the desktop icon field enters on. */
  iconEnter: string;
  /** Duration of that keyframe animation, in milliseconds. */
  iconEnterDuration: number;
  /**
   * How a window opens and closes. Scale only — the vertical channel belongs
   * to the drag gesture, and an entrance may not compete with it.
   */
  window: { duration: number; scaleFrom: number };
}

/**
 * How each environment moves.
 *
 * Fluent decelerates hard and finishes quickly; macOS glides in on a long,
 * soft curve and scales rather than slides; GNOME is the briskest of the
 * three and barely moves at all. Every entrance on the desktop reads from
 * here, so switching environments changes the *feel* of the workspace and not
 * only its colours.
 */
export const ENVIRONMENT_MOTION: Record<EnvironmentId, EnvironmentMotionSpec> = {
  windows: {
    ease: [0, 0, 0, 1],
    duration: 0.32,
    stagger: 30,
    rise: 14,
    scaleFrom: 1,
    iconEnter: 'icon-in-windows',
    iconEnterDuration: 320,
    window: { duration: 0.22, scaleFrom: 0.96 },
  },
  macos: {
    ease: [0.32, 0.72, 0, 1],
    duration: 0.58,
    stagger: 46,
    rise: 0,
    scaleFrom: 0.86,
    iconEnter: 'icon-in-macos',
    iconEnterDuration: 520,
    window: { duration: 0.34, scaleFrom: 0.9 },
  },
  linux: {
    ease: [0.4, 0, 0.2, 1],
    duration: 0.2,
    stagger: 16,
    rise: 6,
    scaleFrom: 0.985,
    iconEnter: 'icon-in-linux',
    iconEnterDuration: 180,
    window: { duration: 0.16, scaleFrom: 0.98 },
  },
};

/**
 * Applications pinned to each environment's taskbar or dock, in order.
 *
 * The file manager leads everywhere, because it is the door into the portfolio
 * — the same door in all three, wearing Explorer, Finder or Files chrome — and
 * About follows it, being the one portfolio application that has shipped.
 */
export const ENVIRONMENT_PINS: Record<EnvironmentId, ApplicationId[]> = {
  windows: ['files', 'about', 'projects', 'experience', 'terminal', 'contact'],
  macos: ['files', 'about', 'projects', 'skills', 'ai-lab', 'resume', 'terminal', 'contact'],
  linux: ['files', 'about', 'terminal', 'projects', 'skills', 'ai-lab', 'contact'],
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
