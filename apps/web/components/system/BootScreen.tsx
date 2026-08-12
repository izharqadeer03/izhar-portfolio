'use client';

import { MOTION, OS_META } from '@izhar-os/config';
import { AnimatePresence, motion } from 'motion/react';

import { OSMark } from '@/components/system/OSMark';
import { BOOT_LINES, type BootState } from '@/hooks/useBootSequence';

interface BootScreenProps {
  boot: BootState;
}

/**
 * The first two seconds of IZHAR OS.
 *
 * Four beats — black, identity, initialization, ready — then the screen hands
 * off to the desktop. Nothing here pretends to load a real system; it is a
 * curtain, and it knows it.
 */
export function BootScreen({ boot }: BootScreenProps) {
  const { progress, identityVisible, statusVisible, activeLine, systemReady, reducedMotion } = boot;
  const percent = Math.round(progress * 100);

  return (
    <motion.div
      key="boot"
      className="fixed inset-0 z-200 flex flex-col items-center justify-center bg-void"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: reducedMotion ? 1 : 1.03,
        filter: reducedMotion ? 'blur(0px)' : 'blur(10px)',
      }}
      transition={{
        duration: reducedMotion ? 0.12 : 0.5,
        ease: MOTION.easeOut,
      }}
    >
      {/* A single soft pool of light behind the identity — the only glow on screen. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--color-accent) 12%, transparent) 0%, transparent 65%)',
        }}
      />

      <div className="relative flex w-[min(320px,78vw)] flex-col items-center">
        {/* Identity */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 6, filter: 'blur(6px)' }}
          animate={
            identityVisible
              ? { opacity: 1, y: 0, filter: 'blur(0px)' }
              : { opacity: 0, y: 6, filter: 'blur(6px)' }
          }
          transition={{ duration: reducedMotion ? 0.1 : 0.6, ease: MOTION.easeOut }}
        >
          <OSMark size={30} className="text-accent" />

          <motion.h1
            className="mt-5 font-mono text-[13px] font-medium uppercase text-fg"
            initial={{ letterSpacing: '0.5em', opacity: 0 }}
            animate={
              identityVisible
                ? { letterSpacing: '0.28em', opacity: 1 }
                : { letterSpacing: '0.5em', opacity: 0 }
            }
            transition={{ duration: reducedMotion ? 0.1 : 0.9, ease: MOTION.easeOut }}
          >
            {/* Trailing indent compensates for the trailing letter-space. */}
            <span className="inline-block ps-[0.28em]">{OS_META.name}</span>
          </motion.h1>

          <motion.p
            className="mt-2 text-[11px] tracking-[0.14em] text-faint uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: identityVisible ? 1 : 0 }}
            transition={{ duration: 0.5, delay: reducedMotion ? 0 : 0.15 }}
          >
            {OS_META.description}
          </motion.p>
        </motion.div>

        {/* Initialization */}
        <motion.div
          className="mt-12 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: statusVisible ? 1 : 0 }}
          transition={{ duration: reducedMotion ? 0.1 : 0.4 }}
        >
          <div
            className="h-px w-full overflow-hidden bg-white/8"
            role="progressbar"
            aria-label="Initializing workspace"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
          >
            <motion.div
              className="h-full bg-accent"
              style={{ width: `${percent}%` }}
              // The rail itself is the animation; no spring needed on top of it.
              transition={{ duration: 0 }}
            />
          </div>

          <div className="mt-3 flex items-baseline justify-between font-mono text-[10px] tracking-[0.16em] uppercase">
            <div className="relative h-3 flex-1 overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={systemReady ? 'ready' : activeLine}
                  className={
                    systemReady ? 'absolute inset-0 text-accent' : 'absolute inset-0 text-muted'
                  }
                  initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reducedMotion ? 0 : -6 }}
                  transition={{ duration: reducedMotion ? 0.05 : 0.2, ease: MOTION.ease }}
                >
                  {systemReady ? 'System ready' : BOOT_LINES[activeLine]}
                </motion.span>
              </AnimatePresence>
            </div>

            <span className="tabular-nums text-faint">{String(percent).padStart(3, '0')}</span>
          </div>
        </motion.div>
      </div>

      <p className="absolute bottom-6 font-mono text-[10px] tracking-[0.16em] text-faint/60 uppercase">
        {OS_META.version} · {OS_META.channel}
      </p>
    </motion.div>
  );
}
