'use client';

import { MOTION } from '@izhar-os/config';
import type { ProfileStat } from '@izhar-os/types';
import { cn } from '@izhar-os/ui';
import { motion } from 'motion/react';
import {
  useEffect,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';

import { ACCENT_LINE, ACCENT_WASH } from '@/components/applications/about/theme';
import { useApplicationChrome } from '@/hooks/useEnvironment';
import { useHasFinePointer, usePrefersReducedMotion } from '@/hooks/useSystemPreferences';
import { usePortfolioStore } from '@/lib/store/portfolio-store';

/**
 * Counts up to a figure once, on a cubic ease-out.
 *
 * Runs for well under a second and only for stats that declare a `countTo`,
 * because a number that ticks upward is a nice touch exactly once and an
 * irritation every time after that.
 */
function useCountUp(target: number | undefined, enabled: boolean): number {
  // `null` means "the count has not run": the value shown is then the figure
  // itself, so a card that never animates still reads correctly.
  const [counted, setCounted] = useState<number | null>(null);

  useEffect(() => {
    if (target === undefined || !enabled) return;

    let frame = 0;
    let start = 0;

    const tick = (now: number) => {
      if (start === 0) start = now;
      const progress = Math.min(1, (now - start) / 620);
      setCounted(Math.round((1 - (1 - progress) ** 3) * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, enabled]);

  if (counted !== null) return counted;
  return enabled ? 0 : (target ?? 0);
}

interface AboutStatsProps {
  root: RefObject<HTMLElement | null>;
}

/**
 * The statistics row.
 *
 * Four cards, each lit from the pointer and lifted a hair on hover — depth
 * from light and shadow rather than from borders, which is what keeps them
 * from reading as dashboard tiles.
 */
export function AboutStats({ root }: AboutStatsProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [seen, setSeen] = useState(false);
  const about = usePortfolioStore((state) => state.about);

  return (
    <motion.ul
      className="grid gap-3 @min-[520px]:grid-cols-2 @min-[900px]:grid-cols-4"
      viewport={{ root, once: true, amount: 0.4 }}
      onViewportEnter={() => setSeen(true)}
    >
      {about.stats.map((stat, index) => (
        <StatCard
          key={stat.id}
          stat={stat}
          index={index}
          animate={seen && !reducedMotion}
          reducedMotion={reducedMotion}
          root={root}
        />
      ))}
    </motion.ul>
  );
}

function StatCard({
  stat,
  index,
  animate,
  reducedMotion,
  root,
}: {
  stat: ProfileStat;
  index: number;
  animate: boolean;
  reducedMotion: boolean;
  root: RefObject<HTMLElement | null>;
}) {
  const chrome = useApplicationChrome();
  const hasFinePointer = useHasFinePointer();
  const counted = useCountUp(stat.countTo, animate);

  // "3+" counts to 3 and keeps its sign; everything else is a word, not a number.
  const printed =
    stat.countTo === undefined ? stat.value : `${counted}${stat.value.replace(/^[\d.]+/, '')}`;

  const handleMove = (event: ReactPointerEvent<HTMLLIElement>) => {
    if (!hasFinePointer) return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
  };

  return (
    <motion.li
      onPointerMove={handleMove}
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ root, once: true, amount: 0.3 }}
      transition={{ duration: 0.36, delay: index * 0.05, ease: MOTION.easeOut }}
      className={cn(
        'group relative overflow-hidden p-4',
        chrome.cardClass,
        'transition-[transform,border-color,box-shadow] duration-200 ease-env',
        'hover:-translate-y-[2px] hover:shadow-[0_18px_36px_-24px_rgba(0,0,0,0.95)]',
      )}
      style={
        {
          borderRadius: chrome.cardRadius,
          '--spot-x': '50%',
          '--spot-y': '0%',
        } as CSSProperties
      }
    >
      {/* Pointer light. Present but invisible until the pointer is over the card. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 ease-env group-hover:opacity-100"
        style={{
          background: `radial-gradient(180px circle at var(--spot-x) var(--spot-y), ${ACCENT_WASH}, transparent 72%)`,
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${ACCENT_LINE}, transparent)` }}
      />

      <p className="relative text-[26px] leading-none font-semibold tracking-[-0.03em] text-fg tabular-nums">
        {printed}
      </p>
      <p className="relative mt-2.5 text-[12.5px] font-medium text-fg/85">{stat.label}</p>
      <p className="relative mt-1 text-[11.5px] leading-snug text-faint">{stat.detail}</p>
    </motion.li>
  );
}
