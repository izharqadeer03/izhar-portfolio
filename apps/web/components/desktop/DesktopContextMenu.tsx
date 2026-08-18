'use client';

import type { IconDensity } from '@izhar-os/types';
import { cn, Separator } from '@izhar-os/ui';
import { Check, ChevronRight, Cpu, Grid2x2, LayoutGrid, Palette, RefreshCw, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { PersonalizationModal } from '@/components/desktop/PersonalizationModal';
import { useDismiss } from '@/hooks/useDismiss';
import { useSystemStore } from '@/lib/store/system-store';
import { THEME_PRESETS, useThemeStore } from '@/lib/store/theme-store';
import { useWindowStore } from '@/lib/store/window-store';

export interface ContextMenuAnchor {
  x: number;
  y: number;
}

interface DesktopContextMenuProps {
  anchor: ContextMenuAnchor | null;
  onClose: () => void;
}

const MENU_WIDTH = 224;
const MENU_HEIGHT_ESTIMATE = 240;

const ITEM =
  'flex w-full items-center gap-2.5 rounded-md px-2.5 py-[7px] text-left text-[12.5px] text-fg/90 ' +
  'transition-colors duration-100 hover:bg-white/8 focus-visible:bg-white/8 focus-visible:outline-none';

const PANEL_SHADOW = '0 24px 56px -18px rgba(0,0,0,0.96), inset 0 1px 0 rgba(255,255,255,0.12)';

function MenuDivider() {
  return (
    <div className="my-1 px-1">
      <Separator />
    </div>
  );
}

function ContextMenuPanel({
  anchor,
  onClose,
  onOpenPersonalize,
}: {
  anchor: ContextMenuAnchor;
  onClose: () => void;
  onOpenPersonalize: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  const iconDensity = useSystemStore((state) => state.iconDensity);
  const iconsVisible = useSystemStore((state) => state.iconsVisible);
  const setIconDensity = useSystemStore((state) => state.setIconDensity);
  const setIconsVisible = useSystemStore((state) => state.setIconsVisible);
  const refreshDesktop = useSystemStore((state) => state.refreshDesktop);
  const arrangeIcons = useSystemStore((state) => state.arrangeIcons);
  const openWindow = useWindowStore((state) => state.openWindow);

  const activeThemeId = useThemeStore((state) => state.themeId);
  const setTheme = useThemeStore((state) => state.setTheme);

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

  const chooseTheme = (id: string) => () => {
    setTheme(id);
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
      className="fixed z-150 rounded-xl border border-white/14 bg-raised/98 p-1.5 backdrop-blur-3xl"
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
              className="absolute top-0 left-full ml-1.5 w-[176px] rounded-xl border border-white/14 bg-raised/98 p-1.5 backdrop-blur-3xl"
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

      {/* Theme & Personalization */}
      <div
        className="relative"
        onPointerEnter={() => setThemeOpen(true)}
        onPointerLeave={() => setThemeOpen(false)}
      >
        <button
          type="button"
          role="menuitem"
          aria-haspopup="menu"
          aria-expanded={themeOpen}
          className={cn(ITEM, themeOpen && 'bg-white/8')}
          onClick={() => setThemeOpen((open) => !open)}
          onFocus={() => setThemeOpen(true)}
        >
          <Palette size={13} strokeWidth={1.7} className="text-amber-400" />
          <span className="flex-1">Theme & Accents</span>
          <ChevronRight size={13} strokeWidth={1.7} className="text-faint" />
        </button>

        <AnimatePresence>
          {themeOpen ? (
            <motion.div
              role="menu"
              aria-label="Theme accents"
              className="absolute top-0 left-full ml-1.5 w-[210px] rounded-xl border border-line bg-raised/96 p-1.5 backdrop-blur-2xl"
              style={{ boxShadow: PANEL_SHADOW, transformOrigin: 'top left' }}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.12 }}
            >
              {Object.values(THEME_PRESETS).slice(0, 6).map((preset) => {
                const isSelected = activeThemeId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    role="menuitemradio"
                    aria-checked={isSelected}
                    className={ITEM}
                    onClick={chooseTheme(preset.id)}
                  >
                    <span
                      className="size-3 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: preset.accent }}
                    />
                    <span className="flex-1 text-[12px] truncate">{preset.name}</span>
                    {isSelected ? (
                      <Check size={11} strokeWidth={2.5} style={{ color: preset.accent }} />
                    ) : null}
                  </button>
                );
              })}

              <MenuDivider />

              <button
                type="button"
                role="menuitem"
                className={ITEM}
                onClick={() => {
                  close();
                  onOpenPersonalize();
                }}
              >
                <Sparkles size={12} strokeWidth={2} className="text-cyan-400" />
                <span className="flex-1 text-[12px]">All Theme Options…</span>
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

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
 * The desktop's right-click menu with Themes & Personalization.
 */
export function DesktopContextMenu({ anchor, onClose }: DesktopContextMenuProps) {
  const [personalizeModalOpen, setPersonalizeModalOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {anchor ? (
          <ContextMenuPanel
            key="context-menu"
            anchor={anchor}
            onClose={onClose}
            onOpenPersonalize={() => setPersonalizeModalOpen(true)}
          />
        ) : null}
      </AnimatePresence>

      <PersonalizationModal
        open={personalizeModalOpen}
        onClose={() => setPersonalizeModalOpen(false)}
      />
    </>
  );
}
