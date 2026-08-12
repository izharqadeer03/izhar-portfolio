'use client';

import { ENVIRONMENTS, MOTION, SYSTEM_PROFILE } from '@izhar-os/config';
import type { EnvironmentId } from '@izhar-os/types';
import { cn } from '@izhar-os/ui';
import { ArrowRight, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useRef, type CSSProperties } from 'react';

import { EnvironmentMark } from '@/components/system/OSLogos';
import { useDetectedEnvironment } from '@/hooks/useDetectedEnvironment';
import { usePrefersReducedMotion } from '@/hooks/useSystemPreferences';
import { useEnvironmentStore } from '@/lib/store/environment-store';

/**
 * The first question IZHAR OS asks, and the only one it insists on.
 *
 * A visitor arriving for the first time should not be dropped into a desktop
 * nobody chose. Boot ends here instead: three doors, the visitor's own platform
 * marked so the obvious answer costs one glance, and every other answer costs
 * exactly the same single click. Whatever they pick is remembered, so this
 * screen is seen once in a visitor's life and never again — which is why it can
 * afford to take the whole viewport and ask properly.
 *
 * It is not a settings panel. Changing workspace afterwards belongs to the
 * switcher in the chrome, where a returning visitor already knows to look.
 */
export function WorkspaceGate() {
  const chooseEnvironment = useEnvironmentStore((state) => state.chooseEnvironment);
  const detected = useDetectedEnvironment();
  const reducedMotion = usePrefersReducedMotion();

  // Focus opens on the suggested card — with a detection, Enter alone gets in.
  const focused: EnvironmentId = detected ?? ENVIRONMENTS[0]!.id;
  const focusRef = useRef<HTMLButtonElement>(null);
  useEffect(() => focusRef.current?.focus(), [focused]);

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reducedMotion ? 0 : 12 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reducedMotion ? 0.12 : 0.55,
      delay: reducedMotion ? 0 : delay,
      ease: MOTION.easeOut,
    },
  });

  return (
    <motion.div
      key="workspace-gate"
      role="dialog"
      aria-modal="true"
      aria-labelledby="workspace-question"
      className="fixed inset-0 z-190 flex flex-col items-center justify-center overflow-y-auto bg-void px-6 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: reducedMotion ? 1 : 1.03,
        filter: reducedMotion ? 'blur(0px)' : 'blur(10px)',
      }}
      transition={{ duration: reducedMotion ? 0.12 : 0.45, ease: MOTION.easeOut }}
    >
      {/* The same single pool of light the boot screen sits in, so the two read
          as one continuous arrival rather than two separate screens. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 size-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--color-accent) 12%, transparent) 0%, transparent 65%)',
        }}
      />

      <div className="relative flex w-full max-w-[560px] flex-col items-center text-center">
        <motion.p
          {...rise(0.02)}
          className="text-[clamp(1.5rem,4vw,2.1rem)] font-semibold tracking-[-0.02em] text-fg"
        >
          {SYSTEM_PROFILE.name}
        </motion.p>

        <motion.p
          {...rise(0.07)}
          className="mt-1.5 font-mono text-[10.5px] font-medium tracking-[0.28em] text-accent uppercase"
        >
          {SYSTEM_PROFILE.role}
        </motion.p>

        <motion.h2
          {...rise(0.14)}
          id="workspace-question"
          className="mt-9 text-[clamp(1.05rem,2.6vw,1.35rem)] font-light text-fg/90"
        >
          Which workspace feels like home?
        </motion.h2>

        <motion.div {...rise(0.2)} className="mt-7 flex flex-wrap justify-center gap-3">
          {ENVIRONMENTS.map((environment) => {
            const isDetected = environment.id === detected;

            return (
              <button
                key={environment.id}
                ref={environment.id === focused ? focusRef : undefined}
                type="button"
                onClick={() => chooseEnvironment(environment.id)}
                data-detected={isDetected}
                aria-label={
                  isDetected
                    ? `${environment.name} — ${environment.chromeSummary}. Detected as your platform.`
                    : `${environment.name} — ${environment.chromeSummary}`
                }
                // Each card wears its own environment's accent rather than the
                // active one — three doors, three colours, none of them yet chosen.
                style={{ '--card-accent': environment.accent } as CSSProperties}
                className={cn(
                  'workspace-card group relative flex w-[152px] flex-col items-center gap-3 rounded-2xl border px-4 py-5',
                  'backdrop-blur-xl transition-[background-color,border-color,transform,box-shadow] duration-200 ease-os',
                  'hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none',
                )}
              >
                <span
                  className={cn(
                    'transition-colors duration-200',
                    isDetected ? 'text-fg' : 'text-fg/65 group-hover:text-fg',
                  )}
                >
                  <EnvironmentMark logo={environment.logo} size={26} />
                </span>

                <span className="text-[13.5px] font-medium text-fg">{environment.name}</span>

                {isDetected ? (
                  <span
                    className="flex items-center gap-1.5 text-[10.5px] font-medium"
                    style={{ color: environment.accent }}
                  >
                    <Check size={11} strokeWidth={3} aria-hidden="true" />
                    You&rsquo;re on this
                  </span>
                ) : (
                  <span className="text-[10.5px] leading-tight text-faint">
                    {environment.personality[0]}
                  </span>
                )}
              </button>
            );
          })}
        </motion.div>

        <motion.p {...rise(0.28)} className="mt-7 text-[12px] leading-relaxed text-faint">
          Same developer. Same work. A different way of exploring it.
        </motion.p>

        {/* Offered only when there is something to accept. With no detection the
            three cards are the only way through, and saying "take me in" would
            be asking the visitor to trust a coin flip. */}
        {detected ? (
          <motion.button
            {...rise(0.34)}
            type="button"
            onClick={() => chooseEnvironment(detected)}
            className={cn(
              'mt-5 flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5',
              'text-[11.5px] font-medium text-fg/70 transition-colors duration-150 ease-os',
              'hover:border-line-strong hover:text-fg',
              'focus-visible:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70',
            )}
          >
            Take me in
            <ArrowRight size={12} strokeWidth={2.2} aria-hidden="true" />
          </motion.button>
        ) : null}
      </div>

      <p className="absolute bottom-6 font-mono text-[10px] tracking-[0.16em] text-faint/60 uppercase">
        You can change this any time
      </p>
    </motion.div>
  );
}
