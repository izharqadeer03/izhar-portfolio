'use client';

import { create } from 'zustand';

export interface ThemePreset {
  id: string;
  name: string;
  accent: string;
  secondary: string;
  ambientPrimary: string;
  ambientSecondary: string;
  defaultWallpaper: string;
  colorSwatch: string;
}

export const THEME_PRESETS: Record<string, ThemePreset> = {
  orange: {
    id: 'orange',
    name: 'Fluent Orange',
    accent: '#ff6a00',
    secondary: '#f97316',
    ambientPrimary: '#c2410c',
    ambientSecondary: '#ea580c',
    defaultWallpaper: 'windows',
    colorSwatch: '#ff6a00',
  },
  cyan: {
    id: 'cyan',
    name: 'Electric Cyan (Default)',
    accent: '#4cc2ff',
    secondary: '#7a6cf0',
    ambientPrimary: '#2f6fd0',
    ambientSecondary: '#7a6cf0',
    defaultWallpaper: 'windows',
    colorSwatch: '#4cc2ff',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Mint',
    accent: '#10b981',
    secondary: '#059669',
    ambientPrimary: '#047857',
    ambientSecondary: '#10b981',
    defaultWallpaper: 'windows',
    colorSwatch: '#10b981',
  },
  amethyst: {
    id: 'amethyst',
    name: 'Amethyst Purple',
    accent: '#a855f7',
    secondary: '#7c3aed',
    ambientPrimary: '#7e22ce',
    ambientSecondary: '#c084fc',
    defaultWallpaper: 'windows',
    colorSwatch: '#a855f7',
  },
  rose: {
    id: 'rose',
    name: 'Crimson Rose',
    accent: '#f43f5e',
    secondary: '#e11d48',
    ambientPrimary: '#be123c',
    ambientSecondary: '#fb7185',
    defaultWallpaper: 'windows',
    colorSwatch: '#f43f5e',
  },
  amber: {
    id: 'amber',
    name: 'Solar Amber',
    accent: '#f59e0b',
    secondary: '#d97706',
    ambientPrimary: '#b45309',
    ambientSecondary: '#fbbf24',
    defaultWallpaper: 'windows',
    colorSwatch: '#f59e0b',
  },
  azure: {
    id: 'azure',
    name: 'Windows 10 Hero',
    accent: '#0078d4',
    secondary: '#38bdf8',
    ambientPrimary: '#0284c7',
    ambientSecondary: '#60a5fa',
    defaultWallpaper: 'windows1',
    colorSwatch: '#0078d4',
  },
};

export const DEFAULT_THEME_ID = 'orange';

const THEME_STORAGE_KEY = 'izhar-os-theme-id';
const WALLPAPER_STORAGE_KEY = 'izhar-os-wallpaper-id';

interface ThemeStoreState {
  themeId: string;
  wallpaperId: string;
  hydrated: boolean;

  hydrate: () => void;
  setTheme: (themeId: string, overrideWallpaper?: boolean) => void;
  setWallpaper: (wallpaperId: string) => void;
  getActivePreset: () => ThemePreset;
}

function readStoredTheme(): { themeId: string; wallpaperId: string } {
  if (typeof window === 'undefined') {
    return {
      themeId: DEFAULT_THEME_ID,
      wallpaperId: 'windows',
    };
  }

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const storedWallpaper = window.localStorage.getItem(WALLPAPER_STORAGE_KEY);

    const validTheme = storedTheme && THEME_PRESETS[storedTheme] ? storedTheme : DEFAULT_THEME_ID;
    const validWallpaper = storedWallpaper || 'windows';

    return { themeId: validTheme, wallpaperId: validWallpaper };
  } catch {
    return {
      themeId: DEFAULT_THEME_ID,
      wallpaperId: 'windows',
    };
  }
}

export const useThemeStore = create<ThemeStoreState>()((set, get) => ({
  themeId: DEFAULT_THEME_ID,
  wallpaperId: 'windows',
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return;
    const { themeId, wallpaperId } = readStoredTheme();
    set({ themeId, wallpaperId, hydrated: true });
  },

  setTheme: (themeId: string, overrideWallpaper = true) => {
    const preset = THEME_PRESETS[themeId];
    if (!preset) return;

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, themeId);
      if (overrideWallpaper) {
        window.localStorage.setItem(WALLPAPER_STORAGE_KEY, preset.defaultWallpaper);
      }
    } catch {
      // Storage unavailable
    }

    set((state) => ({
      themeId,
      wallpaperId: overrideWallpaper ? preset.defaultWallpaper : state.wallpaperId,
    }));
  },

  setWallpaper: (wallpaperId: string) => {
    try {
      window.localStorage.setItem(WALLPAPER_STORAGE_KEY, wallpaperId);
    } catch {
      // Storage unavailable
    }
    set({ wallpaperId });
  },

  getActivePreset: () => {
    const { themeId } = get();
    return THEME_PRESETS[themeId] ?? THEME_PRESETS[DEFAULT_THEME_ID]!;
  },
}));
