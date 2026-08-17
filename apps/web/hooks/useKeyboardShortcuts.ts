import { useEffect } from 'react';

import { useWindowStore } from '@/lib/store/window-store';
import { useSystemStore } from '@/lib/store/system-store';

/**
 * Global keyboard shortcuts for the desktop.
 *
 * Mounted once in `Desktop.tsx`. Every shortcut here targets the desktop shell
 * itself — window management, icon selection, launcher — rather than anything
 * inside an application. Applications handle their own keys.
 *
 * The modifier key adapts: ⌘ on macOS, Ctrl elsewhere, so the shortcut a
 * visitor tries first always works.
 */
export function useKeyboardShortcuts({
  isLauncherOpen,
  onCloseLauncher,
}: {
  isLauncherOpen: boolean;
  onCloseLauncher: () => void;
}) {
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const focusWindow = useWindowStore((state) => state.focusWindow);
  const selectIcon = useSystemStore((state) => state.selectIcon);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const meta = event.metaKey || event.ctrlKey;

      // Escape — close launcher or deselect icon.
      if (event.key === 'Escape') {
        if (isLauncherOpen) {
          event.preventDefault();
          onCloseLauncher();
          return;
        }
        selectIcon(null);
        return;
      }

      // Ctrl+W / ⌘+W — close the focused window.
      if (meta && event.key.toLowerCase() === 'w') {
        // Don't steal the shortcut from the browser when no window is focused.
        const { focusedId } = useWindowStore.getState();
        if (focusedId) {
          event.preventDefault();
          closeWindow(focusedId);
        }
        return;
      }

      // Alt+Tab — cycle focus to the next non-minimized window.
      if (event.altKey && event.key === 'Tab') {
        event.preventDefault();
        const { windows, focusedId } = useWindowStore.getState();
        const visible = windows.filter((w) => !w.isMinimized);
        if (visible.length < 2) return;

        const currentIndex = visible.findIndex((w) => w.id === focusedId);
        const nextIndex = (currentIndex + 1) % visible.length;
        focusWindow(visible[nextIndex]!.id);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeWindow, focusWindow, isLauncherOpen, onCloseLauncher, selectIcon]);
}
