'use client';

import type { IconDensity } from '@izhar-os/types';
import { cn, Separator } from '@izhar-os/ui';
import { Check, ChevronRight, Cpu, Grid2x2, LayoutGrid, RefreshCw } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useDismiss } from '@/hooks/useDismiss';
import { useSystemStore } from '@/lib/store/system-store';
import { useWindowStore } from '@/lib/store/window-store';

export interface ContextMenuAnchor {
  x: number;
  y: number;
}

interface DesktopContextMenuProps {
  anchor: ContextMenuAnchor | null;
  onClose: () => void;
}

const MENU_WIDTH = 216;
const MENU_HEIGHT_ESTIMATE = 200;

const ITEM =
  'flex w-full items-center gap-2.5 rounded-md px-2.5 py-[7px] text-left text-[12.5px] text-fg/90 ' +
  'transition-colors duration-100 hover:bg-white/8 focus-visible:bg-white/8 focus-visible:outline-none';

const PANEL_SHADOW = '0 24px 56px -18px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.06)';

function MenuDivider() {
  return (
    <div className="my-1 px-1">
      <Separator />
    </div>
  );
}

function ContextMenuPanel({ anchor, onClose }: { anchor: ContextMenuAnchor; onClose: () => void }) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const iconDensity = useSystemStore((state) => state.iconDensity);
  const iconsVisible = useSystemStore((state) => state.iconsVisible);
  const setIconDensity = useSystemStore((state) => state.setIconDensity);
  const setIconsVisible = useSystemStore((state) => state.setIconsVisible);
  const refreshDesktop = useSystemStore((state) => state.refreshDesktop);
  const arrangeIcons = useSystemStore((state) => state.arrangeIcons);
  const openWindow = useWindowStore((state) => state.openWindow);

  const close = useCallback(() => onClose(), [onClose]);
  useDismiss(menuRef, { enabled: true, onDismiss: close });

  // Move focus into the menu so Tab, arrows and Escape behave as expected.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      menuRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const run = (action: () => void) => () => {
    action();
    close();
  };

  const chooseDensity = (density: IconDensity) => () => {
    setIconDensity(density);
    setIconsVisible(true);
    close();
  };

  // Flip back inside the viewport when opened near an edge.
  const left = Math.max(8, Math.min(anchor.x, window.innerWidth - MENU_WIDTH - 8));
  const top = Math.max(8, Math.min(anchor.y, window.innerHeight - MENU_HEIGHT_ESTIMATE - 8));

  return (
    <motion.div
      ref={menuRef}
      role="menu"
      aria-label="Desktop options"
      className="fixed z-150 rounded-xl border border-line bg-raised/92 p-1.5 backdrop-blur-2xl"
      style={{ left, top, width: MENU_WIDTH, boxShadow: PANEL_SHADOW, transformOrigin: 'top left' }}
      initial={{ opacity: 0, scale: 0.96, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: -2 }}
      transition={{ duration: 0.13, ease: [0.2, 0.8, 0.2, 1] }}
      onContextMenu={(event) => event.preventDefault()}
    >
      <button type="button" role="menuitem" className={ITEM} onClick={run(refreshDesktop)}>
        <RefreshCw size={13} strokeWidth={1.7} className="text-muted" />
        <span className="flex-1">Refresh</span>
      </button>

      <MenuDivider />

      <div
        className="relative"
        onPointerEnter={() => setViewOpen(true)}
        onPointerLeave={() => setViewOpen(false)}
      >
        <button
          type="button"
          role="menuitem"
          aria-haspopup="menu"
          aria-expanded={viewOpen}
          className={cn(ITEM, viewOpen && 'bg-white/8')}
          onClick={() => setViewOpen((open) => !open)}
          onFocus={() => setViewOpen(true)}
        >
          <LayoutGrid size={13} strokeWidth={1.7} className="text-muted" />
          <span className="flex-1">View</span>
          <ChevronRight size={13} strokeWidth={1.7} className="text-faint" />
        </button>

        <AnimatePresence>
          {viewOpen ? (
            <motion.div
              role="menu"
              aria-label="View"
              className="absolute top-0 left-full ml-1.5 w-[176px] rounded-xl border border-line bg-raised/94 p-1.5 backdrop-blur-2xl"
              style={{ boxShadow: PANEL_SHADOW, transformOrigin: 'top left' }}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.12 }}
            >
              <button
                type="button"
                role="menuitemradio"
                aria-checked={iconsVisible && iconDensity === 'comfortable'}
                className={ITEM}
                onClick={chooseDensity('comfortable')}
              >
                <span className="w-3.5">
                  {iconsVisible && iconDensity === 'comfortable' ? (
                    <Check size={12} strokeWidth={2.2} className="text-accent" />
                  ) : null}
                </span>
                <span className="flex-1">Large icons</span>
              </button>

              <button
                type="button"
                role="menuitemradio"
                aria-checked={iconsVisible && iconDensity === 'compact'}
                className={ITEM}
                onClick={chooseDensity('compact')}
              >
                <span className="w-3.5">
                  {iconsVisible && iconDensity === 'compact' ? (
                    <Check size={12} strokeWidth={2.2} className="text-accent" />
                  ) : null}
                </span>
                <span className="flex-1">Small icons</span>
              </button>

              <MenuDivider />

              <button
                type="button"
                role="menuitemcheckbox"
                aria-checked={!iconsVisible}
                className={ITEM}
                onClick={run(() => setIconsVisible(!iconsVisible))}
              >
                <span className="w-3.5">
                  {!iconsVisible ? (
                    <Check size={12} strokeWidth={2.2} className="text-accent" />
                  ) : null}
                </span>
                <span className="flex-1">Hide icons</span>
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <button type="button" role="menuitem" className={ITEM} onClick={run(arrangeIcons)}>
        <Grid2x2 size={13} strokeWidth={1.7} className="text-muted" />
        <span className="flex-1">Arrange icons</span>
      </button>

      <MenuDivider />

      <button
        type="button"
        role="menuitem"
        className={ITEM}
        onClick={run(() => openWindow('system-info'))}
      >
        <Cpu size={13} strokeWidth={1.7} className="text-muted" />
        <span className="flex-1">System information</span>
      </button>
    </motion.div>
  );
}

/**
 * The desktop's right-click menu.
 *
 * Four operations that actually do something — refresh, icon density, restore
 * arrangement, system information. No decorative entries: a menu full of
 * disabled items is a Windows impression, not a working system.
 */
export function DesktopContextMenu({ anchor, onClose }: DesktopContextMenuProps) {
  return (
    <AnimatePresence>
      {anchor ? <ContextMenuPanel key="context-menu" anchor={anchor} onClose={onClose} /> : null}
    </AnimatePresence>
  );
}
