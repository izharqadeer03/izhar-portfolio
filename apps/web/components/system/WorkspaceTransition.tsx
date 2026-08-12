'use client';

import { getEnvironment, OS_META } from '@izhar-os/config';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';

import { EnvironmentMark } from '@/components/system/OSLogos';
import { usePrefersReducedMotion } from '@/hooks/useSystemPreferences';
import { WORKSPACE_TRANSITION } from '@/lib/environment';
import { useEnvironmentStore } from '@/lib/store/environment-store';
import { useWindowStore } from '@/lib/store/window-store';

/**
 * The workspace switch.
 *
 * A short veil, not a reboot. The renderer swaps at the midpoint — behind full
 * opacity — so the visitor never sees a half-built desktop, and the open
 * windows are re-clamped to the new chrome in the same beat. Everything else
 * about the system, including which windows are open and where, survives
 * untouched: that is the proof that an environment is a presentation layer.
 */
export function WorkspaceTransition() {
  const pending = useEnvironmentStore((state) => state.pending);
  const commitPending = useEnvironmentStore((state) => state.commitPending);
  const endTransition = useEnvironmentStore((state) => state.endTransition);
  const reconcileViewport = useWindowStore((state) => state.reconcileViewport);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (pending === null) return;

    const commitAt = reducedMotion
      ? WORKSPACE_TRANSITION.reducedCommit
      : WORKSPACE_TRANSITION.commit;
    const endAt = reducedMotion ? WORKSPACE_TRANSITION.reducedTotal : WORKSPACE_TRANSITION.total;

    const commitTimer = window.setTimeout(() => {
      commitPending();
      // The new environment reserves different edges; windows that would now
      // sit under a dock or a menu bar are pulled back into the work area.
      reconcileViewport();
    }, commitAt);

    const endTimer = window.setTimeout(endTransition, endAt);

    return () => {
      window.clearTimeout(commitTimer);
      window.clearTimeout(endTimer);
    };
  }, [commitPending, endTransition, pending, reconcileViewport, reducedMotion]);

  const target = pending ? getEnvironment(pending) : null;

  return (
    <AnimatePresence>
      {target ? (
        <motion.div
          key="workspace-transition"
          // Above every window and every piece of chrome, below nothing.
          className="pointer-events-auto fixed inset-0 z-190 grid place-items-center bg-void/88 backdrop-blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.06 : 0.26, ease: [0.16, 1, 0.3, 1] }}
          role="status"
          aria-live="polite"
        >
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reducedMotion ? 1 : 1.05 }}
            transition={{ duration: reducedMotion ? 0.06 : 0.34, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-mono text-[10px] font-medium tracking-[0.3em] text-faint uppercase">
              {OS_META.name}
            </span>

            <span className="mt-6 flex size-16 items-center justify-center text-fg">
              <EnvironmentMark logo={target.logo} size={44} />
            </span>

            <span className="mt-6 text-[19px] font-medium tracking-tight text-fg">
              {target.name}
            </span>

            <span className="mt-1.5 text-[12.5px] text-muted">Switching workspace…</span>

            {/* A single determinate rail: the transition has a known length, so
                pretending otherwise with a spinner would be dishonest. */}
            <span className="mt-6 h-px w-40 overflow-hidden bg-white/10">
              <motion.span
                className="block h-full bg-fg/70"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                style={{ transformOrigin: 'left' }}
                transition={{
                  duration: reducedMotion ? 0.08 : WORKSPACE_TRANSITION.total / 1000,
                  ease: 'linear',
                }}
              />
            </span>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
