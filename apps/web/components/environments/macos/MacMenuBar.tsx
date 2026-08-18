'use client';

import { APPLICATIONS, getApplication, OS_META, SYSTEM_PROFILE } from '@izhar-os/config';
import type { ApplicationId } from '@izhar-os/types';
import { cn } from '@izhar-os/ui';
import { BatteryMedium, Check, Search, SlidersHorizontal, Wifi } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useRef, useState } from 'react';

import { AppleLogo } from '@/components/system/OSLogos';
import { SystemArea } from '@/components/system/SystemArea';
import { useClock } from '@/hooks/useClock';
import { useDismiss } from '@/hooks/useDismiss';
import { MAC_MENUBAR_HEIGHT } from '@/lib/environment';
import { useSystemStore } from '@/lib/store/system-store';
import { useWindowStore } from '@/lib/store/window-store';

interface MenuItem {
  id: string;
  label: string;
  action?: () => void;
  disabled?: boolean;
  checked?: boolean;
  shortcut?: string;
  separatorBefore?: boolean;
}

interface MenuDefinition {
  id: string;
  label: string;
  /** The application menu, drawn in bold. */
  strong?: boolean;
  /** Rendered as the Apple mark rather than as text. */
  mark?: boolean;
  items: MenuItem[];
}

interface MacMenuBarProps {
  onOpenLaunchpad: () => void;
}

/**
 * The macOS menu bar.
 *
 * Every menu here does something. That was the whole design constraint: a
 * menu bar full of dimmed placeholder items is a screenshot, and a screenshot
 * is not what this portfolio is. Edit is the exception, and it is dimmed for
 * exactly the reason Finder's Edit menu is dimmed — there is nothing selected
 * to act on.
 */
export function MacMenuBar({ onOpenLaunchpad }: MacMenuBarProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const reading = useClock();

  const windows = useWindowStore((state) => state.windows);
  const focusedId = useWindowStore((state) => state.focusedId);
  const openWindow = useWindowStore((state) => state.openWindow);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const closeAllWindows = useWindowStore((state) => state.closeAllWindows);
  const minimizeWindow = useWindowStore((state) => state.minimizeWindow);
  const toggleMaximize = useWindowStore((state) => state.toggleMaximize);
  const focusWindow = useWindowStore((state) => state.focusWindow);

  const iconsVisible = useSystemStore((state) => state.iconsVisible);
  const iconDensity = useSystemStore((state) => state.iconDensity);
  const setIconsVisible = useSystemStore((state) => state.setIconsVisible);
  const setIconDensity = useSystemStore((state) => state.setIconDensity);
  const refreshDesktop = useSystemStore((state) => state.refreshDesktop);

  const close = useCallback(() => setOpenId(null), []);
  useDismiss(barRef, { enabled: openId !== null, onDismiss: close });

  const focused = windows.find((instance) => instance.id === focusedId);
  const focusedApplication = focused ? getApplication(focused.applicationId) : undefined;
  // With no window open the file manager owns the menu bar, exactly as Finder
  // does when you click the desktop.
  const activeName = focusedApplication?.title ?? 'Finder';

  const open = (id: ApplicationId) => () => openWindow(id);

  const menus: MenuDefinition[] = [
    {
      id: 'apple',
      label: OS_META.name,
      mark: true,
      items: [
        { id: 'about', label: `About ${OS_META.name}`, action: open('system-info') },
        {
          id: 'info',
          label: 'System Information…',
          action: open('system-info'),
          separatorBefore: true,
        },
        { id: 'files', label: 'Open Portfolio', action: open('files') },
        {
          id: 'close-all',
          label: 'Close All Windows',
          action: closeAllWindows,
          disabled: windows.length === 0,
          separatorBefore: true,
        },
      ],
    },
    {
      id: 'app',
      label: activeName,
      strong: true,
      items: [
        { id: 'about-app', label: `About ${activeName}`, action: open('system-info') },
        {
          id: 'hide',
          label: `Hide ${activeName}`,
          shortcut: '⌘H',
          disabled: !focused,
          action: focused ? () => minimizeWindow(focused.id) : undefined,
          separatorBefore: true,
        },
        {
          id: 'quit',
          label: `Quit ${activeName}`,
          shortcut: '⌘Q',
          disabled: !focused,
          action: focused ? () => closeWindow(focused.id) : undefined,
        },
      ],
    },
    {
      id: 'file',
      label: 'File',
      items: [
        { id: 'new-finder', label: 'New Finder Window', shortcut: '⌘N', action: open('files') },
        { id: 'new-terminal', label: 'New Terminal Window', action: open('terminal') },
        {
          id: 'close',
          label: 'Close Window',
          shortcut: '⌘W',
          disabled: !focused,
          action: focused ? () => closeWindow(focused.id) : undefined,
          separatorBefore: true,
        },
      ],
    },
    {
      id: 'edit',
      label: 'Edit',
      items: [
        { id: 'undo', label: 'Undo', shortcut: '⌘Z', disabled: true },
        { id: 'cut', label: 'Cut', shortcut: '⌘X', disabled: true, separatorBefore: true },
        { id: 'copy', label: 'Copy', shortcut: '⌘C', disabled: true },
        { id: 'paste', label: 'Paste', shortcut: '⌘V', disabled: true },
      ],
    },
    {
      id: 'view',
      label: 'View',
      items: [
        {
          id: 'icons',
          label: 'Show Desktop Icons',
          checked: iconsVisible,
          action: () => setIconsVisible(!iconsVisible),
        },
        {
          id: 'large',
          label: 'Large Icons',
          checked: iconDensity === 'comfortable',
          action: () => setIconDensity('comfortable'),
          separatorBefore: true,
        },
        {
          id: 'small',
          label: 'Small Icons',
          checked: iconDensity === 'compact',
          action: () => setIconDensity('compact'),
        },
        { id: 'refresh', label: 'Refresh Desktop', action: refreshDesktop, separatorBefore: true },
      ],
    },
    {
      id: 'go',
      label: 'Go',
      items: [
        { id: 'launchpad', label: 'Launchpad', shortcut: '⌘K', action: onOpenLaunchpad },
        ...APPLICATIONS.filter((application) => application.category === 'workspace').map(
          (application, index) => ({
            id: application.id,
            label: application.title,
            action: open(application.id),
            separatorBefore: index === 0,
          }),
        ),
      ],
    },
    {
      id: 'window',
      label: 'Window',
      items: [
        {
          id: 'minimize',
          label: 'Minimize',
          shortcut: '⌘M',
          disabled: !focused,
          action: focused ? () => minimizeWindow(focused.id) : undefined,
        },
        {
          id: 'zoom',
          label: 'Zoom',
          disabled: !focused,
          action: focused ? () => toggleMaximize(focused.id) : undefined,
        },
        ...windows.map((instance, index) => ({
          id: instance.id,
          label: instance.title,
          checked: instance.id === focusedId,
          action: () => focusWindow(instance.id),
          separatorBefore: index === 0,
        })),
      ],
    },
    {
      id: 'help',
      label: 'Help',
      items: [
        { id: 'help-system', label: `${OS_META.name} Help`, action: open('system-info') },
        ...SYSTEM_PROFILE.links.map((link, index) => ({
          id: link.id,
          label: link.label,
          action: () => window.open(link.href, '_blank', 'noreferrer,noopener'),
          separatorBefore: index === 0,
        })),
      ],
    },
  ];

  return (
    <div
      ref={barRef}
      className="mac-vibrancy absolute inset-x-0 top-0 z-140 flex items-center gap-0.5 border-b border-line px-2.5"
      style={{ height: MAC_MENUBAR_HEIGHT }}
      role="menubar"
      aria-label="Menu bar"
    >
      {menus.map((menu) => (
        <div key={menu.id} className="relative">
          <button
            type="button"
            role="menuitem"
            aria-haspopup="menu"
            aria-expanded={openId === menu.id}
            aria-label={menu.mark ? OS_META.name : undefined}
            onClick={() => setOpenId((current) => (current === menu.id ? null : menu.id))}
            // Once a menu is open, sliding across the bar switches menus — the
            // behaviour every menu bar has had for forty years.
            onPointerEnter={() => setOpenId((current) => (current === null ? null : menu.id))}
            className={cn(
              'flex h-[22px] items-center rounded-[5px] px-2 text-[12.5px] transition-colors duration-100',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70',
              menu.strong ? 'font-semibold text-fg' : 'text-fg/85',
              openId === menu.id ? 'bg-white/18 text-fg' : 'hover:bg-white/10',
            )}
          >
            {menu.mark ? <AppleLogo size={13} /> : menu.label}
          </button>

          <AnimatePresence>
            {openId === menu.id ? <MenuPanel menu={menu} onClose={close} /> : null}
          </AnimatePresence>
        </div>
      ))}

      {/* Status area. */}
      <div className="ms-auto flex items-center gap-1">
        <span
          className="os-tip grid size-6 place-items-center rounded-[5px] text-fg/75 transition-colors hover:bg-white/10 hover:text-fg"
          aria-label="Battery: 100%"
          data-tip="Battery: 100% · Power Adapter"
        >
          <BatteryMedium size={16} strokeWidth={1.5} />
        </span>
        <span
          className="os-tip grid size-6 place-items-center rounded-[5px] text-fg/75 transition-colors hover:bg-white/10 hover:text-fg"
          aria-label="Wi-Fi"
          data-tip="Wi-Fi: Connected to IZHAR-Net"
        >
          <Wifi size={14} strokeWidth={1.7} />
        </span>
        <button
          type="button"
          onClick={onOpenLaunchpad}
          aria-label="Search applications"
          data-tip="Spotlight Search"
          className="os-tip grid size-6 place-items-center rounded-[5px] text-fg/75 transition-colors hover:bg-white/10 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
        >
          <Search size={14} strokeWidth={1.7} />
        </button>
        <span
          className="os-tip grid size-6 place-items-center rounded-[5px] text-fg/75 transition-colors hover:bg-white/10 hover:text-fg"
          aria-label="Control Centre"
          data-tip="Control Centre"
        >
          <SlidersHorizontal size={14} strokeWidth={1.7} />
        </span>

        <SystemArea tone="bar" />

        <time
          dateTime={reading?.iso}
          className="ps-1 pe-0.5 text-[12px] tabular-nums text-fg/85"
          aria-label={reading ? `Current time ${reading.time}` : undefined}
        >
          {reading ? `${reading.date}  ${reading.time}` : '—'}
        </time>
      </div>
    </div>
  );
}

function MenuPanel({ menu, onClose }: { menu: MenuDefinition; onClose: () => void }) {
  return (
    <motion.div
      role="menu"
      aria-label={menu.label}
      className="mac-vibrancy absolute top-[calc(100%+4px)] left-0 z-160 min-w-[232px] rounded-[10px] border border-white/14 p-1.5"
      style={{
        boxShadow: '0 26px 60px -18px rgba(0,0,0,0.96), inset 0 1px 0 rgba(255,255,255,0.12)',
        transformOrigin: 'top left',
      }}
      initial={{ opacity: 0, scale: 0.97, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -2 }}
      transition={{ duration: 0.12, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {menu.items.map((item) => (
        <div key={item.id}>
          {item.separatorBefore ? (
            <div className="my-1.5 h-px bg-line" role="presentation" />
          ) : null}

          <button
            type="button"
            role={item.checked !== undefined ? 'menuitemcheckbox' : 'menuitem'}
            aria-checked={item.checked}
            disabled={item.disabled || !item.action}
            onClick={() => {
              item.action?.();
              onClose();
            }}
            className={cn(
              'flex w-full items-center gap-2 rounded-md px-2 py-[5px] text-left text-[12.5px]',
              'transition-colors duration-100 focus-visible:outline-none',
              item.disabled || !item.action
                ? 'cursor-default text-faint/70'
                : 'text-fg/90 hover:bg-[color:color-mix(in_oklab,var(--env-accent)_75%,transparent)] hover:text-white focus-visible:bg-white/10',
            )}
          >
            <span className="w-3.5 shrink-0">
              {item.checked ? <Check size={11} strokeWidth={2.6} aria-hidden="true" /> : null}
            </span>
            <span className="flex-1 truncate">{item.label}</span>
            {item.shortcut ? (
              <span className="shrink-0 text-[11px] text-faint">{item.shortcut}</span>
            ) : null}
          </button>
        </div>
      ))}
    </motion.div>
  );
}
