'use client';

import { cn } from '@izhar-os/ui';
import { LayoutGrid } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react';
import { useRef } from 'react';

import { AppTile } from '@/components/applications/AppIcon';
import { describeShellAction, useShellItems, type ShellItem } from '@/hooks/useShellItems';
import { usePrefersReducedMotion } from '@/hooks/useSystemPreferences';
import { MAC_DOCK_GAP, MAC_DOCK_HEIGHT } from '@/lib/environment';
import { useWindowStore } from '@/lib/store/window-store';

/** Resting icon size, and the size directly under the pointer. */
const BASE_SIZE = 42;
const MAX_SIZE = 66;
/** How far the magnification reaches, in pixels either side of the pointer. */
const REACH = 130;

interface MacDockProps {
  onOpenLaunchpad: () => void;
}

/**
 * The Dock.
 *
 * The magnification is the real thing: each icon measures its own distance from
 * the pointer and scales on a falloff curve, with a spring so the row settles
 * rather than snaps. It runs entirely on motion values — the pointer moving
 * across the dock re-renders nothing, it only writes to transforms — which is
 * what keeps a fifty-times-a-second effect off the React critical path.
 *
 * Under `prefers-reduced-motion` the icons hold their resting size and the dock
 * behaves like any other row of buttons.
 */
export function MacDock({ onOpenLaunchpad }: MacDockProps) {
  const items = useShellItems();
  const reducedMotion = usePrefersReducedMotion();
  const openWindow = useWindowStore((state) => state.openWindow);
  const toggleMinimize = useWindowStore((state) => state.toggleMinimize);

  // Infinity parks every icon at its resting size.
  const pointerX = useMotionValue(Number.POSITIVE_INFINITY);

  const activate = (item: ShellItem) => {
    if (item.instance) toggleMinimize(item.instance.id);
    else openWindow(item.application.id);
  };

  const [finder, ...rest] = items;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 z-140 flex justify-center"
      style={{ bottom: MAC_DOCK_GAP / 2 }}
    >
      <div
        onPointerMove={(event) => {
          if (reducedMotion) return;
          pointerX.set(event.clientX);
        }}
        onPointerLeave={() => pointerX.set(Number.POSITIVE_INFINITY)}
        className="mac-vibrancy pointer-events-auto flex items-end gap-2 rounded-2xl border border-line px-2.5 pt-1.5 pb-2"
        style={{
          minHeight: MAC_DOCK_HEIGHT,
          boxShadow: '0 24px 60px -20px rgba(0,0,0,0.85)',
        }}
        role="toolbar"
        aria-label="Dock"
      >
        {finder ? (
          <DockIcon
            key={finder.application.id}
            item={finder}
            pointerX={pointerX}
            reducedMotion={reducedMotion}
            onActivate={() => activate(finder)}
          />
        ) : null}

        <DockButton
          pointerX={pointerX}
          reducedMotion={reducedMotion}
          label="Launchpad"
          onClick={onOpenLaunchpad}
        >
          <LayoutGrid size={20} strokeWidth={1.6} className="env-accent" />
        </DockButton>

        <span className="mx-0.5 h-10 w-px self-center bg-line" role="presentation" />

        {rest.map((item) => (
          <DockIcon
            key={item.application.id}
            item={item}
            pointerX={pointerX}
            reducedMotion={reducedMotion}
            onActivate={() => activate(item)}
          />
        ))}
      </div>
    </div>
  );
}

/** Shared magnification maths: distance from the pointer to a springy size. */
function useMagnifiedSize(
  ref: React.RefObject<HTMLElement | null>,
  pointerX: MotionValue<number>,
  reducedMotion: boolean,
) {
  const distance = useTransform(pointerX, (value) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return Number.POSITIVE_INFINITY;
    return value - (bounds.left + bounds.width / 2);
  });

  const target = useTransform(distance, [-REACH, 0, REACH], [BASE_SIZE, MAX_SIZE, BASE_SIZE], {
    clamp: true,
  });

  const size = useSpring(target, { stiffness: 340, damping: 26, mass: 0.32 });
  return reducedMotion ? undefined : size;
}

interface DockIconProps {
  item: ShellItem;
  pointerX: MotionValue<number>;
  reducedMotion: boolean;
  onActivate: () => void;
}

function DockIcon({ item, pointerX, reducedMotion, onActivate }: DockIconProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const size = useMagnifiedSize(ref, pointerX, reducedMotion);

  return (
    <div className="flex flex-col items-center">
      <motion.button
        ref={ref}
        type="button"
        onClick={onActivate}
        aria-label={describeShellAction(item)}
        aria-current={item.isActive}
        data-tip={item.application.title}
        style={size ? { width: size, height: size } : { width: BASE_SIZE, height: BASE_SIZE }}
        className={cn(
          'os-tip grid origin-bottom place-items-center rounded-[22%]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70',
          item.isMinimized && 'opacity-70',
        )}
      >
        <AppTile
          icon={item.application.icon}
          accent={item.application.accent}
          size={BASE_SIZE}
          muted={item.application.status === 'coming-soon'}
          // The tile itself is fixed-size and scaled by the button, so the
          // magnification costs one transform rather than a relayout.
          className="size-full"
        />
      </motion.button>

      {/* Running indicator. */}
      <span
        aria-hidden="true"
        className={cn(
          'mt-1 size-1 rounded-full transition-opacity duration-200',
          item.isActive ? 'env-accent-bg' : 'bg-fg/55',
          item.isRunning ? 'opacity-100' : 'opacity-0',
        )}
      />
    </div>
  );
}

interface DockButtonProps {
  pointerX: MotionValue<number>;
  reducedMotion: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}

function DockButton({ pointerX, reducedMotion, label, onClick, children }: DockButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const size = useMagnifiedSize(ref, pointerX, reducedMotion);

  return (
    <div className="flex flex-col items-center">
      <motion.button
        ref={ref}
        type="button"
        onClick={onClick}
        aria-label={label}
        data-tip={label}
        style={size ? { width: size, height: size } : { width: BASE_SIZE, height: BASE_SIZE }}
        className={cn(
          'os-tip grid origin-bottom place-items-center rounded-[22%] border border-line',
          'bg-linear-to-b from-white/10 to-white/[0.02]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70',
        )}
      >
        {children}
      </motion.button>
      <span className="mt-1 size-1 rounded-full opacity-0" aria-hidden="true" />
    </div>
  );
}
