'use client';

import { getEnvironment } from '@izhar-os/config';
import type { EnvironmentDefinition, EnvironmentId } from '@izhar-os/types';
import { useEffect } from 'react';

import { useIsMobile } from '@/hooks/useSystemPreferences';
import {
  APPLICATION_CHROME,
  DESKTOP_ICONS,
  DESKTOP_SURFACE,
  ENVIRONMENT_MOTION,
  getChromeInsets,
  WINDOW_CHROME,
  type ApplicationChromeSpec,
  type ChromeInsets,
  type DesktopSurfaceSpec,
  type EnvironmentMotionSpec,
  type IconStyleSpec,
  type WindowChromeSpec,
} from '@/lib/environment';
import { useEnvironmentStore } from '@/lib/store/environment-store';

/** The environment the workspace is currently rendered through. */
export function useEnvironment(): EnvironmentId {
  return useEnvironmentStore((state) => state.environment);
}

/** Identity and personality of the active environment. */
export function useEnvironmentDefinition(): EnvironmentDefinition {
  return getEnvironment(useEnvironment());
}

/** Chrome geometry for the active environment on this device. */
export function useChromeInsets(): ChromeInsets {
  const environment = useEnvironment();
  const isMobile = useIsMobile();
  return getChromeInsets(environment, isMobile);
}

/** How windows are drawn in the active environment. */
export function useWindowChrome(): WindowChromeSpec {
  return WINDOW_CHROME[useEnvironment()];
}

/**
 * The design tokens an application surface uses in the active environment —
 * navigation style, radii, density and type. Read by application views, never
 * by the shell.
 */
export function useApplicationChrome(): ApplicationChromeSpec {
  return APPLICATION_CHROME[useEnvironment()];
}

/** How the desktop surface is arranged in the active environment. */
export function useDesktopSurface(): DesktopSurfaceSpec {
  return DESKTOP_SURFACE[useEnvironment()];
}

/** How application icons are drawn in the active environment. */
export function useIconStyle(): IconStyleSpec {
  return DESKTOP_ICONS[useEnvironment()];
}

/** How the active environment moves — easing, duration, stagger. */
export function useEnvironmentMotion(): EnvironmentMotionSpec {
  return ENVIRONMENT_MOTION[useEnvironment()];
}

/**
 * Restores the stored environment on mount.
 *
 * Runs while the boot screen is still up, so a returning visitor never sees the
 * default environment flash before their own. Reading storage in an effect
 * rather than during render is what keeps the server and client markup
 * identical.
 */
export function useEnvironmentHydration(): void {
  const hydrate = useEnvironmentStore((state) => state.hydrate);
  useEffect(() => hydrate(), [hydrate]);
}
