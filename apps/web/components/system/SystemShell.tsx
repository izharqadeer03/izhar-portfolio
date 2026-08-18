'use client';

import { MOTION } from '@izhar-os/config';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';

import { BootScreen } from '@/components/system/BootScreen';
import { Desktop } from '@/components/desktop/Desktop';
import { WorkspaceGate } from '@/components/system/WorkspaceGate';
import { WorkspaceTransition } from '@/components/system/WorkspaceTransition';
import { useBootSequence } from '@/hooks/useBootSequence';
import { useEnvironmentHydration } from '@/hooks/useEnvironment';
import { subscribeToPointer } from '@/lib/pointer';
import { useEnvironmentStore } from '@/lib/store/environment-store';
import { usePortfolioStore } from '@/lib/store/portfolio-store';
import { useSystemStore } from '@/lib/store/system-store';
import { useWindowStore } from '@/lib/store/window-store';

/**
 * Root of the operating system: owns the boot-to-desktop handoff and the two
 * global listeners (pointer signal, viewport reconciliation) that every other
 * layer reads from.
 *
 * The boot sequence runs once, on arrival. Changing workspace afterwards is a
 * transition rather than a restart — a returning visitor should never sit
 * through the same curtain twice, and a visitor exploring the three
 * environments should never sit through it at all.
 *
 * A first-time visitor gets one extra beat between the two: boot hands off to
 * the workspace question, and only their answer opens the desktop. Everyone who
 * has answered before goes straight through.
 */
export function SystemShell() {
  const boot = useBootSequence();
  const phase = useSystemStore((state) => state.bootPhase);
  const reconcileViewport = useWindowStore((state) => state.reconcileViewport);
  const hydrated = useEnvironmentStore((state) => state.hydrated);
  const hasChosen = useEnvironmentStore((state) => state.hasChosen);
  const fetchPortfolioData = usePortfolioStore((state) => state.fetchPortfolioData);

  const bootVisible = phase === 'idle' || phase === 'booting';
  const desktopRevealed = phase === 'revealing' || phase === 'ready';

  // Held back until storage has actually been read, so a returning visitor is
  // never asked a question they answered in a previous session.
  const gateVisible = desktopRevealed && hydrated && !hasChosen;

  // Restore the stored workspace while the boot screen is still up.
  useEnvironmentHydration();

  // Hydrate dynamic portfolio data from Supabase backend in background
  useEffect(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  // One pointer listener for the whole system; the 3D rig and the parallax
  // layers both sample the same signal.
  useEffect(() => subscribeToPointer(), []);

  // Keep windows inside the work area when the viewport changes.
  useEffect(() => {
    let frame = 0;
    const handleResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(reconcileViewport);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [reconcileViewport]);

  return (
    <>
      <motion.div
        className="h-dvh w-full"
        initial={{ opacity: 0, scale: boot.reducedMotion ? 1 : 1.035, filter: 'blur(8px)' }}
        animate={
          desktopRevealed
            ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
            : { opacity: 0, scale: boot.reducedMotion ? 1 : 1.035, filter: 'blur(8px)' }
        }
        transition={{
          duration: boot.reducedMotion ? 0.15 : 0.75,
          ease: MOTION.easeOut,
        }}
        // Nothing is focusable or clickable until the boot transition finishes —
        // nor while the workspace question is still standing in front of it.
        inert={!desktopRevealed || gateVisible}
      >
        <Desktop />
      </motion.div>

      <WorkspaceTransition />

      {/* The desktop reveals behind the gate rather than after it, so answering
          the question uncovers a workspace that is already there. */}
      <AnimatePresence>{gateVisible ? <WorkspaceGate /> : null}</AnimatePresence>

      <AnimatePresence>{bootVisible ? <BootScreen boot={boot} /> : null}</AnimatePresence>
    </>
  );
}
