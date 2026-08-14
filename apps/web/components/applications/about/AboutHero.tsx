'use client';

import { ABOUT_PROFILE, MOTION, SYSTEM_PROFILE } from '@izhar-os/config';
import { cn, StatusDot } from '@izhar-os/ui';
import { MapPin, Terminal as TerminalIcon } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useRef, type PointerEvent as ReactPointerEvent } from 'react';

import { ACCENT_GLOW, ACCENT_LINE, ACCENT_TEXT } from '@/components/applications/about/theme';
import { useApplicationChrome } from '@/hooks/useEnvironment';
import { useHasFinePointer, usePrefersReducedMotion } from '@/hooks/useSystemPreferences';
import { useWindowStore } from '@/lib/store/window-store';

/** The three technologies that sit closest to the work, floated around the plate. */
const ORBIT = [
  { label: 'Go', x: '-14%', y: '12%', depth: 34 },
  { label: 'Node', x: '86%', y: '30%', depth: 46 },
  { label: 'LLM', x: '4%', y: '84%', depth: 26 },
];

/**
 * The hero.
 *
 * The one piece of the application allowed to be theatrical — a tilting
 * monogram plate with three technologies floating at different depths, lit by
 * the environment's own accent. It is built from four absolutely positioned
 * layers inside a single 3D context: no WebGL context per window, no images,
 * nothing that keeps running once the pointer leaves.
 *
 * The tilt is driven by motion values, so moving the pointer across the plate
 * re-renders nothing. Without a fine pointer, or under reduced motion, the
 * plate simply sits flat.
 */
export function AboutHero() {
  const chrome = useApplicationChrome();
  const reducedMotion = usePrefersReducedMotion();
  const hasFinePointer = useHasFinePointer();
  const openWindow = useWindowStore((state) => state.openWindow);

  const interactive = hasFinePointer && !reducedMotion;

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const spring = { stiffness: 150, damping: 20, mass: 0.35 };
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [7, -7]), spring);
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-9, 9]), spring);

  // Cached on enter so a pointer move never reads layout.
  const bounds = useRef<DOMRect | null>(null);

  const handleEnter = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    bounds.current = event.currentTarget.getBoundingClientRect();
  };

  const handleMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = bounds.current;
    if (!interactive || !rect || rect.width === 0) return;
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <header
      className="relative overflow-hidden border-b border-line"
      style={{ paddingInline: chrome.contentPadding }}
    >
      {/* Ground: an accent pool, a technical grid, and nothing else. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(120% 140% at 78% -20%, ${ACCENT_GLOW} 0%, transparent 58%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(90% 80% at 20% 0%, black 0%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(90% 80% at 20% 0%, black 0%, transparent 75%)',
        }}
      />

      <div className="relative flex flex-col-reverse items-start gap-7 py-9 @min-[620px]:flex-row @min-[620px]:items-center @min-[620px]:gap-10">
        {/* Identity */}
        <div className="min-w-0 flex-1">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: MOTION.easeOut }}
          >
            <p className={chrome.eyebrowClass} style={{ color: ACCENT_TEXT }}>
              {SYSTEM_PROFILE.status.label} · {SYSTEM_PROFILE.location}
            </p>

            <h2 className={cn('mt-3 text-fg', chrome.displayClass)}>{SYSTEM_PROFILE.name}</h2>

            <p className="mt-2 text-[14px] font-medium text-fg/80">{SYSTEM_PROFILE.role}</p>

            <p className="mt-4 max-w-[54ch] text-[13.5px] leading-relaxed text-muted">
              {ABOUT_PROFILE.positioning}
            </p>
          </motion.div>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.08, ease: MOTION.easeOut }}
            className="mt-6 flex flex-wrap items-center gap-2"
          >
            <span
              className="inline-flex items-center gap-2 border px-2.5 py-1.5 text-[11.5px] text-fg/85"
              style={{ borderRadius: chrome.controlRadius, borderColor: ACCENT_LINE }}
            >
              <StatusDot state={SYSTEM_PROFILE.status.state} />
              {SYSTEM_PROFILE.status.detail}
            </span>

            <button
              type="button"
              onClick={() => openWindow('terminal')}
              className={cn(
                'inline-flex items-center gap-1.5 border border-line bg-white/[0.04] px-2.5 py-1.5',
                'text-[11.5px] text-muted transition-colors duration-150 ease-env',
                'hover:bg-white/[0.08] hover:text-fg',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70',
              )}
              style={{ borderRadius: chrome.controlRadius }}
            >
              <TerminalIcon size={12.5} strokeWidth={1.8} aria-hidden="true" />
              Open the terminal
            </button>

            <span className="inline-flex items-center gap-1.5 px-1 text-[11.5px] text-faint">
              <MapPin size={12} strokeWidth={1.8} aria-hidden="true" />
              {SYSTEM_PROFILE.location}
            </span>
          </motion.div>
        </div>

        {/* The plate. */}
        <div
          className="relative shrink-0 self-center"
          style={{ perspective: 620 }}
          onPointerEnter={handleEnter}
          onPointerMove={handleMove}
          onPointerLeave={handleLeave}
        >
          <motion.div
            aria-hidden="true"
            className="relative grid size-[126px] place-items-center @min-[620px]:size-[146px]"
            style={{
              rotateX: interactive ? rotateX : 0,
              rotateY: interactive ? rotateY : 0,
              transformStyle: 'preserve-3d',
            }}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: MOTION.easeOut }}
          >
            {/* Plate face. */}
            <div
              className="absolute inset-0 overflow-hidden border border-line"
              style={{
                borderRadius: chrome.cardRadius + 10,
                background:
                  'linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 46%, rgba(0,0,0,0.35))',
                boxShadow:
                  '0 30px 60px -30px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.10)',
                transform: 'translateZ(0px)',
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(120% 100% at 50% 120%, ${ACCENT_GLOW} 0%, transparent 64%)`,
                }}
              />
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
                  backgroundSize: '18px 18px',
                  maskImage: 'radial-gradient(70% 70% at 50% 50%, black, transparent)',
                  WebkitMaskImage: 'radial-gradient(70% 70% at 50% 50%, black, transparent)',
                }}
              />
            </div>

            {/* Monogram, lifted off the face. */}
            <span
              className="relative text-[40px] leading-none font-semibold tracking-[-0.04em] @min-[620px]:text-[46px]"
              style={{
                transform: 'translateZ(38px)',
                backgroundImage: `linear-gradient(150deg, #ffffff 10%, ${ACCENT_TEXT} 95%)`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              IQ
            </span>

            {/* Technologies, floating at their own depths. */}
            {ORBIT.map((chip) => (
              <span
                key={chip.label}
                className="absolute rounded-full border border-line bg-void/70 px-2 py-1 font-mono text-[9.5px] tracking-[0.1em] text-muted uppercase backdrop-blur-sm"
                style={{
                  left: chip.x,
                  top: chip.y,
                  transform: `translate(-50%, -50%) translateZ(${chip.depth}px)`,
                  boxShadow: '0 10px 22px -14px rgba(0,0,0,0.9)',
                }}
              >
                {chip.label}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </header>
  );
}
