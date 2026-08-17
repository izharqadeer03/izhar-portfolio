'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { EnvironmentChrome } from '@/components/environments/EnvironmentChrome';
import { DesktopBackground } from '@/components/desktop/DesktopBackground';
import {
  DesktopContextMenu,
  type ContextMenuAnchor,
} from '@/components/desktop/DesktopContextMenu';
import { DesktopHint } from '@/components/desktop/DesktopHint';
import { DesktopIcons } from '@/components/desktop/DesktopIcons';
import { DesktopIdentity } from '@/components/desktop/DesktopIdentity';
import { ProfileWidget } from '@/components/desktop/ProfileWidget';
import { CursorAccent } from '@/components/system/CursorAccent';
import { ToastContainer } from '@/components/system/ToastContainer';
import { WindowManager } from '@/components/windows/WindowManager';
import { useChromeInsets, useEnvironment, useEnvironmentDefinition } from '@/hooks/useEnvironment';
import { useHasFinePointer } from '@/hooks/useSystemPreferences';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useSystemStore } from '@/lib/store/system-store';
import { useThemeStore, THEME_PRESETS, DEFAULT_THEME_ID } from '@/lib/store/theme-store';
import { useToastStore } from '@/lib/store/toast-store';

/**
 * The desktop.
 *
 * A fixed, non-scrolling surface composed in layers: environment, icon field,
 * identity, windows, chrome. Only the outermost layer knows which environment
 * is active — it publishes that environment's accent as a CSS variable and
 * insets the interactive surface by the chrome it reserves. Everything inside
 * reads those two facts and nothing else, which is why the same icon field and
 * the same window manager serve Windows, macOS and Ubuntu without a branch.
 */
export function Desktop() {
  const environment = useEnvironment();
  const definition = useEnvironmentDefinition();
  const insets = useChromeInsets();
  const hasFinePointer = useHasFinePointer();

  const themeId = useThemeStore((state) => state.themeId);
  const themePreset = THEME_PRESETS[themeId] ?? THEME_PRESETS[DEFAULT_THEME_ID]!;
  const activeAccent = environment === 'windows' ? themePreset.accent : definition.accent;

  const selectIcon = useSystemStore((state) => state.selectIcon);

  // The launcher records which environment it was opened in. Start, Launchpad
  // and Activities are different surfaces, so one left open across a switch has
  // nothing to show — deriving `isOpen` from the pair closes it on arrival
  // without an effect chasing the change after the fact.
  const [launcher, setLauncher] = useState({ open: false, environment });
  const launcherOpen = launcher.open && launcher.environment === environment;

  const [contextAnchor, setContextAnchor] = useState<ContextMenuAnchor | null>(null);

  const launcherTriggerRef = useRef<HTMLButtonElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);

  const closeContextMenu = useCallback(() => setContextAnchor(null), []);
  const closeLauncher = useCallback(
    () => setLauncher((current) => ({ ...current, open: false })),
    [],
  );

  /** Clicking bare desktop clears the selection — and nothing else. */
  const handleSurfacePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.target !== surfaceRef.current) return;
      selectIcon(null);
      closeContextMenu();
    },
    [closeContextMenu, selectIcon],
  );

  const handleContextMenu = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      // Only the bare surface gets the custom menu; windows keep the native one
      // so text selection and spellcheck still behave normally inside them.
      if (event.target !== surfaceRef.current) return;
      if (!hasFinePointer) return;

      event.preventDefault();
      closeLauncher();
      setContextAnchor({ x: event.clientX, y: event.clientY });
    },
    [closeLauncher, hasFinePointer],
  );

  const toggleLauncher = useCallback(() => {
    setContextAnchor(null);
    setLauncher((current) => ({
      // Reopening after a switch counts as opening, not as toggling closed.
      open: !(current.open && current.environment === environment),
      environment,
    }));
  }, [environment]);

  // ⌘K / Ctrl+K opens the launcher — the shortcut developers try first, and it
  // reaches whichever launcher the active environment provides.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleLauncher();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleLauncher]);

  // Phase 4: global keyboard shortcuts for window management and desktop control.
  useKeyboardShortcuts({ isLauncherOpen: launcherOpen, onCloseLauncher: closeLauncher });

  // One-time session welcome notification.
  const addToast = useToastStore((state) => state.addToast);
  useEffect(() => {
    try {
      const welcomed = sessionStorage.getItem('izhar_os_welcomed');
      if (!welcomed) {
        sessionStorage.setItem('izhar_os_welcomed', 'true');
        const timer = setTimeout(() => {
          addToast('Welcome to IZHAR OS · Personal Developer Workspace', 'info', 4500);
        }, 1000);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore if storage is restricted
    }
  }, [addToast]);

  return (
    <div
      className="relative h-dvh w-full overflow-hidden bg-void"
      data-environment={environment}
      // The active environment's accent, published once for the whole tree.
      style={{ '--env-accent': activeAccent } as React.CSSProperties}
    >
      <DesktopBackground />
      <CursorAccent />

      {/* Interactive surface: the viewport minus whatever chrome this
          environment reserves on each edge. */}
      <div
        ref={surfaceRef}
        className="absolute"
        style={{
          top: insets.top,
          bottom: insets.bottom,
          left: insets.left,
          right: insets.right,
        }}
        onPointerDown={handleSurfacePointerDown}
        onContextMenu={handleContextMenu}
        onDoubleClick={(event) => {
          // Double-clicking empty desktop is a no-op everywhere sensible; use it
          // to clear state rather than to surprise the visitor.
          if (event.target === surfaceRef.current) selectIcon(null);
        }}
      >
        <DesktopIcons />
        <DesktopIdentity />
        <ProfileWidget />
      </div>

      <WindowManager />

      <DesktopHint />

      <EnvironmentChrome
        isLauncherOpen={launcherOpen}
        onToggleLauncher={toggleLauncher}
        onCloseLauncher={closeLauncher}
        launcherTriggerRef={launcherTriggerRef}
      />

      <DesktopContextMenu anchor={contextAnchor} onClose={closeContextMenu} />

      <ToastContainer />

      {/* Refresh replays the desktop with a single pass of light. */}
      <RefreshSweep />
    </div>
  );
}

/**
 * A thin accent line that sweeps down the desktop when it is refreshed.
 * Mounted here rather than inside the context menu so the effect survives the
 * menu closing.
 */
function RefreshSweep() {
  const epoch = useSystemStore((state) => state.desktopEpoch);

  if (epoch === 0) return null;

  return (
    <div
      key={epoch}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-130 h-px motion-safe:animate-sweep"
      style={{
        background:
          'linear-gradient(to right, transparent, color-mix(in oklab, var(--env-accent) 60%, transparent), transparent)',
      }}
    />
  );
}
