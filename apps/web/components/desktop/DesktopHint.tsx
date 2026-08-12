'use client';

import { Kbd } from '@izhar-os/ui';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

import { useChromeInsets, useEnvironmentDefinition } from '@/hooks/useEnvironment';
import { useSystemStore } from '@/lib/store/system-store';

const AUTO_HIDE_MS = 9000;

/**
 * A one-time hint that teaches the desktop's gestures.
 *
 * It appears once the workspace is interactive, and leaves the moment the
 * visitor does anything at all — an interface tip that outstays the first
 * click has become an advertisement. It names the active environment's own
 * launcher, because "Activities" and "Start" are not the same word for the
 * same thing to anyone who uses either.
 */
export function DesktopHint() {
  const bootPhase = useSystemStore((state) => state.bootPhase);
  const environment = useEnvironmentDefinition();
  const insets = useChromeInsets();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (bootPhase !== 'ready') return;

    const showTimer = window.setTimeout(() => setVisible(true), 900);
    const hideTimer = window.setTimeout(() => setVisible(false), AUTO_HIDE_MS);

    const dismiss = () => setVisible(false);
    window.addEventListener('pointerdown', dismiss, { once: true });
    window.addEventListener('keydown', dismiss, { once: true });

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
      window.removeEventListener('pointerdown', dismiss);
      window.removeEventListener('keydown', dismiss);
    };
  }, [bootPhase]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="pointer-events-none absolute inset-x-0 z-120 hidden justify-center xl:flex"
          style={{ bottom: insets.bottom + 16 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="flex items-center gap-2.5 rounded-full border border-line bg-surface/70 px-3.5 py-1.5 text-[11.5px] text-muted backdrop-blur-xl">
            <span>Double-click to open</span>
            <span className="text-faint/60">·</span>
            <span>Right-click the desktop</span>
            <span className="text-faint/60">·</span>
            <span className="flex items-center gap-1.5">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
              <span>for {environment.id === 'linux' ? 'Activities' : 'search'}</span>
            </span>
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
