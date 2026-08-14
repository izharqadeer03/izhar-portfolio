'use client';

import { getApplication } from '@izhar-os/config';
import type { ResizeEdge, WindowInstance } from '@izhar-os/types';
import { cn } from '@izhar-os/ui';
import { motion, useMotionValue } from 'motion/react';
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';

import { ApplicationSurface } from '@/components/applications/ApplicationRegistry';
import { WindowContent } from '@/components/windows/WindowContent';
import { WindowHeader } from '@/components/windows/WindowHeader';
import { usePrefersReducedMotion } from '@/hooks/useSystemPreferences';
import { useEnvironmentMotion, useWindowChrome } from '@/hooks/useEnvironment';
import { MOBILE_DOCK_HEIGHT, MOBILE_STATUSBAR_HEIGHT, WINDOW_DRAG_MARGIN } from '@/lib/constants';
import { getWorkArea, useWindowStore } from '@/lib/store/window-store';
import { clamp } from '@/lib/utils';

interface WindowProps {
  instance: WindowInstance;
  isFocused: boolean;
  isMobile: boolean;
}

/** Edge handles: thin on the sides, chunkier at the corners where aim is worse. */
const RESIZE_HANDLES: { edge: ResizeEdge; className: string }[] = [
  { edge: 'n', className: 'left-3 right-3 top-0 h-1.5 cursor-n-resize' },
  { edge: 's', className: 'left-3 right-3 bottom-0 h-1.5 cursor-s-resize' },
  { edge: 'w', className: 'top-3 bottom-3 left-0 w-1.5 cursor-w-resize' },
  { edge: 'e', className: 'top-3 bottom-3 right-0 w-1.5 cursor-e-resize' },
  { edge: 'nw', className: 'left-0 top-0 size-3.5 cursor-nw-resize' },
  { edge: 'ne', className: 'right-0 top-0 size-3.5 cursor-ne-resize' },
  { edge: 'sw', className: 'left-0 bottom-0 size-3.5 cursor-sw-resize' },
  { edge: 'se', className: 'right-0 bottom-0 size-3.5 cursor-se-resize' },
];

/**
 * A single window.
 *
 * There is exactly one of these, in every environment. The frame reads its
 * corner radius, title bar and control style from the active environment's
 * chrome spec, and nothing else about it changes — the drag maths, the resize
 * maths and the application surface inside are shared. Switching environments
 * while a window is open is therefore a re-render, not a remount: the window
 * stays exactly where it was, wearing different chrome.
 *
 * Two gesture strategies, chosen for what each one costs:
 *
 * - **Drag** writes to motion values, so moving a window re-renders nothing.
 * - **Resize** writes to the DOM node directly and commits on release, because
 *   layout properties cannot be composed into a transform.
 *
 * Both suppress the CSS transition while active, which is what lets maximize
 * animate smoothly without making drags feel like they lag behind the cursor.
 */
export function Window({ instance, isFocused, isMobile }: WindowProps) {
  const { id, applicationId, title, position, size, minSize, isMaximized, isMinimized, zIndex } =
    instance;

  const application = getApplication(applicationId);
  const chrome = useWindowChrome();
  const motionSpec = useEnvironmentMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const [gesture, setGesture] = useState<'drag' | 'resize' | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const focusWindow = useWindowStore((state) => state.focusWindow);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const minimizeWindow = useWindowStore((state) => state.minimizeWindow);
  const toggleMaximize = useWindowStore((state) => state.toggleMaximize);
  const setWindowPosition = useWindowStore((state) => state.setWindowPosition);
  const setWindowBounds = useWindowStore((state) => state.setWindowBounds);

  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  // The committed position is the source of truth; the drag offset always
  // resets in the same commit that applies it, so the window never jumps.
  useLayoutEffect(() => {
    dragX.set(0);
    dragY.set(0);
  }, [position.x, position.y, dragX, dragY]);

  const handleDragStart = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.button !== 0 || isMaximized || isMobile) return;

      focusWindow(id);

      const originX = position.x;
      const originY = position.y;
      const startX = event.clientX;
      const startY = event.clientY;
      const area = getWorkArea();

      setGesture('drag');

      const handleMove = (moveEvent: PointerEvent) => {
        // Always leave a grabbable strip of the window inside the work area.
        const nextX = clamp(
          originX + (moveEvent.clientX - startX),
          area.left - (size.width - WINDOW_DRAG_MARGIN),
          area.left + area.width - WINDOW_DRAG_MARGIN,
        );
        const nextY = clamp(
          originY + (moveEvent.clientY - startY),
          area.top,
          area.top + area.height - 40,
        );

        dragX.set(nextX - originX);
        dragY.set(nextY - originY);
      };

      const handleUp = () => {
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleUp);
        window.removeEventListener('pointercancel', handleUp);
        setGesture(null);

        const nextX = originX + dragX.get();
        const nextY = originY + dragY.get();

        if (nextX === position.x && nextY === position.y) {
          dragX.set(0);
          dragY.set(0);
          return;
        }
        setWindowPosition(id, { x: nextX, y: nextY });
      };

      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
      window.addEventListener('pointercancel', handleUp);
    },
    [
      dragX,
      dragY,
      focusWindow,
      id,
      isMaximized,
      isMobile,
      position.x,
      position.y,
      setWindowPosition,
      size.width,
    ],
  );

  const handleResizeStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>, edge: ResizeEdge) => {
      if (event.button !== 0 || isMaximized || isMobile) return;
      event.stopPropagation();
      event.preventDefault();

      focusWindow(id);

      const frame = frameRef.current;
      if (!frame) return;

      const start = { x: event.clientX, y: event.clientY };
      const origin = { ...position, ...size };
      const area = getWorkArea();
      const current = { ...origin };

      setGesture('resize');

      const handleMove = (moveEvent: PointerEvent) => {
        const deltaX = moveEvent.clientX - start.x;
        const deltaY = moveEvent.clientY - start.y;

        let { x, y, width, height } = origin;

        if (edge.includes('e')) {
          width = clamp(
            origin.width + deltaX,
            minSize.width,
            Math.max(minSize.width, area.left + area.width - origin.x),
          );
        }
        if (edge.includes('s')) {
          height = clamp(
            origin.height + deltaY,
            minSize.height,
            Math.max(minSize.height, area.top + area.height - origin.y),
          );
        }
        if (edge.includes('w')) {
          // Dragging the left edge moves the origin and the width together.
          const right = origin.x + origin.width;
          width = clamp(
            origin.width - deltaX,
            minSize.width,
            Math.max(minSize.width, right - area.left),
          );
          x = right - width;
        }
        if (edge.includes('n')) {
          const bottom = origin.y + origin.height;
          height = clamp(
            origin.height - deltaY,
            minSize.height,
            Math.max(minSize.height, bottom - area.top),
          );
          y = bottom - height;
        }

        current.x = x;
        current.y = y;
        current.width = width;
        current.height = height;

        // Written straight to the node: no React render per pointer move.
        frame.style.left = `${x}px`;
        frame.style.top = `${y}px`;
        frame.style.width = `${width}px`;
        frame.style.height = `${height}px`;
      };

      const handleUp = () => {
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleUp);
        window.removeEventListener('pointercancel', handleUp);
        setGesture(null);
        setWindowBounds(id, current);
      };

      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
      window.addEventListener('pointercancel', handleUp);
    },
    [
      focusWindow,
      id,
      isMaximized,
      isMobile,
      minSize.height,
      minSize.width,
      position,
      setWindowBounds,
      size,
    ],
  );

  if (!application) return null;

  const mobileGeometry = {
    left: 0,
    top: MOBILE_STATUSBAR_HEIGHT,
    width: '100%',
    height: `calc(100dvh - ${MOBILE_STATUSBAR_HEIGHT + MOBILE_DOCK_HEIGHT}px)`,
  } as const;

  const desktopGeometry = {
    left: position.x,
    top: position.y,
    width: size.width,
    height: size.height,
  };

  return (
    <motion.div
      ref={frameRef}
      role="dialog"
      aria-label={title}
      aria-modal={false}
      className={cn(
        'pointer-events-auto absolute flex flex-col overflow-hidden',
        'border bg-surface/88 backdrop-blur-2xl',
        isFocused ? 'border-line-strong' : 'border-line',
      )}
      style={{
        ...(isMobile ? mobileGeometry : desktopGeometry),
        // Drag offsets exist only on desktop; on mobile the same transform
        // channel carries the sheet's slide-up instead.
        ...(isMobile ? {} : { x: dragX, y: dragY }),
        zIndex,
        borderRadius: isMobile ? '16px 16px 0 0' : chrome.radius,
        transformOrigin: '50% 88%',
        // Suppressed mid-gesture; carries the maximize/restore animation, and
        // the reflow that follows an environment switch, otherwise.
        // Maximize, restore and the reflow after an environment switch all run
        // on the active environment's own curve.
        transition: gesture
          ? 'none'
          : 'left 260ms var(--ease-env), top 260ms var(--ease-env), width 260ms var(--ease-env), height 260ms var(--ease-env), border-color 200ms var(--ease-env), border-radius 260ms var(--ease-env), box-shadow 260ms var(--ease-env)',
        boxShadow: isFocused
          ? '0 28px 70px -24px rgba(0,0,0,0.92), 0 0 0 1px rgba(255,255,255,0.035), inset 0 1px 0 rgba(255,255,255,0.05)'
          : '0 16px 40px -22px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.03)',
        pointerEvents: isMinimized ? 'none' : 'auto',
      }}
      // A window opens the way its environment opens windows: Fluent lifts it
      // into place, macOS grows it from the desktop, GNOME just shows it.
      initial={
        isMobile
          ? { opacity: 0, y: reducedMotion ? 0 : 28 }
          : { opacity: 0, scale: reducedMotion ? 1 : motionSpec.window.scaleFrom }
      }
      // `y` is deliberately absent on desktop: that channel carries the drag
      // motion value, and animating it here would fight the pointer for it.
      animate={
        isMobile
          ? { opacity: isMinimized ? 0 : 1, y: 0 }
          : {
              opacity: isMinimized ? 0 : 1,
              scale: isMinimized ? (reducedMotion ? 1 : 0.92) : 1,
            }
      }
      exit={
        isMobile
          ? { opacity: 0, y: reducedMotion ? 0 : 24 }
          : { opacity: 0, scale: reducedMotion ? 1 : 0.97 }
      }
      transition={{
        duration: reducedMotion ? 0.08 : motionSpec.window.duration,
        ease: motionSpec.ease,
      }}
      // Focus can never land inside a minimized window.
      inert={isMinimized}
      onPointerDown={() => focusWindow(id)}
    >
      <WindowHeader
        application={application}
        chrome={chrome}
        title={title}
        isFocused={isFocused}
        isMaximized={isMaximized}
        isMobile={isMobile}
        onDragStart={handleDragStart}
        onMinimize={() => minimizeWindow(id)}
        onToggleMaximize={() => toggleMaximize(id)}
        onClose={() => closeWindow(id)}
      />

      <WindowContent>
        <ApplicationSurface application={application} />
      </WindowContent>

      {/* Resize affordances — desktop only, and never while maximized. */}
      {!isMobile && !isMaximized
        ? RESIZE_HANDLES.map((handle) => (
            <div
              key={handle.edge}
              role="presentation"
              className={cn('absolute z-10', handle.className)}
              onPointerDown={(event) => handleResizeStart(event, handle.edge)}
            />
          ))
        : null}
    </motion.div>
  );
}
