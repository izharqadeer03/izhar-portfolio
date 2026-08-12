'use client';

import { AnimatePresence } from 'motion/react';

import { Window } from '@/components/windows/Window';
import { useIsMobile } from '@/hooks/useSystemPreferences';
import { useWindowStore } from '@/lib/store/window-store';

/**
 * Renders every open window and owns nothing else — all window state lives in
 * the store, so the taskbar, the launcher and the desktop can all drive the
 * same windows without passing anything through this component.
 *
 * On mobile only the focused window renders: a phone shows one application at
 * a time, and stacked sheets would be a desktop idiom wearing a phone costume.
 */
export function WindowManager() {
  const windows = useWindowStore((state) => state.windows);
  const focusedId = useWindowStore((state) => state.focusedId);
  const isMobile = useIsMobile();

  const visible = isMobile
    ? windows.filter((instance) => instance.id === focusedId && !instance.isMinimized)
    : windows;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <AnimatePresence>
        {visible.map((instance) => (
          <Window
            key={instance.id}
            instance={instance}
            isFocused={instance.id === focusedId}
            isMobile={isMobile}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
