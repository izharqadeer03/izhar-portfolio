'use client';

import { ENVIRONMENTS, getEnvironment } from '@izhar-os/config';
import type { EnvironmentId } from '@izhar-os/types';
import { cn } from '@izhar-os/ui';
import { Check, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useMemo, useRef, useState } from 'react';

import { EnvironmentMark } from '@/components/system/OSLogos';
import { useDismiss } from '@/hooks/useDismiss';
import { useEnvironmentStore } from '@/lib/store/environment-store';

export type SwitcherTone = 'floating' | 'bar';

interface EnvironmentSwitcherProps {
  /** `bar` sits inside a menu bar or panel; `floating` sits on the desktop. */
  tone?: SwitcherTone;
  /** Hides the environment name, leaving the mark. For narrow chrome. */
  compact?: boolean;
  className?: string;
  /** Opens upward — for a switcher living in a bottom taskbar. */
  placement?: 'top' | 'bottom';
}

/**
 * The workspace selector.
 *
 * This is the one control that makes the whole idea legible: it names the
 * environment the visitor is in, and it says — without a label explaining
 * itself — that there are others. It is present in every environment, wearing
 * that environment's chrome, and it is the same component each time.
 */
export function EnvironmentSwitcher({
  tone = 'floating',
  compact = false,
  className,
  placement = 'bottom',
}: EnvironmentSwitcherProps) {
  const current = useEnvironmentStore((state) => state.environment);
  const pending = useEnvironmentStore((state) => state.pending);
  const requestEnvironment = useEnvironmentStore((state) => state.requestEnvironment);

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const active = getEnvironment(current);
  const close = useCallback(() => setOpen(false), []);
  const ignore = useMemo(() => [buttonRef], []);
  useDismiss(menuRef, { enabled: open, onDismiss: close, ignore });

  const choose = (id: EnvironmentId) => {
    setOpen(false);
    requestEnvironment(id);
  };

  return (
    <div className={cn('relative', className)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Workspace: ${active.name}. Choose a different workspace.`}
        className={cn(
          'flex items-center gap-2 transition-colors duration-150 ease-os',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70',
          tone === 'bar'
            ? cn(
                'h-7 rounded-md px-2 text-[12px] text-fg/85 hover:bg-white/10',
                open && 'bg-white/12 text-fg',
              )
            : cn(
                'h-8 rounded-lg border px-2.5 text-[12px] backdrop-blur-xl',
                open
                  ? 'border-line-strong bg-white/10 text-fg'
                  : 'border-line bg-surface/60 text-fg/85 hover:border-line-strong hover:bg-white/8',
              ),
        )}
      >
        <EnvironmentMark logo={active.logo} size={14} />
        {!compact ? <span className="font-medium">{active.name}</span> : null}
        <ChevronDown
          size={12}
          strokeWidth={2}
          aria-hidden="true"
          className={cn('text-faint transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            ref={menuRef}
            role="menu"
            aria-label="Choose your workspace"
            className={cn(
              'absolute right-0 z-170 w-[268px] rounded-xl border border-line bg-raised/94 p-1.5 backdrop-blur-2xl',
              placement === 'bottom' ? 'top-[calc(100%+8px)]' : 'bottom-[calc(100%+8px)]',
            )}
            style={{
              boxShadow: '0 26px 60px -18px rgba(0,0,0,0.92), inset 0 1px 0 rgba(255,255,255,0.06)',
              transformOrigin: placement === 'bottom' ? 'top right' : 'bottom right',
            }}
            initial={{ opacity: 0, scale: 0.96, y: placement === 'bottom' ? -6 : 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: placement === 'bottom' ? -4 : 4 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="px-2.5 pt-1.5 pb-2 font-mono text-[10px] font-medium tracking-[0.18em] text-faint uppercase">
              Choose your workspace
            </p>

            {ENVIRONMENTS.map((environment) => {
              const isCurrent = environment.id === current;
              const isPending = environment.id === pending;

              return (
                <button
                  key={environment.id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={isCurrent}
                  onClick={() => choose(environment.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left',
                    'transition-colors duration-120 focus-visible:outline-none',
                    isCurrent
                      ? 'bg-white/[0.08]'
                      : 'hover:bg-white/[0.055] focus-visible:bg-white/[0.055]',
                  )}
                >
                  <span
                    className={cn(
                      'grid size-8 shrink-0 place-items-center rounded-lg border',
                      isCurrent
                        ? 'env-accent-border env-accent-quiet env-accent'
                        : 'border-line bg-white/[0.03] text-muted',
                    )}
                  >
                    <EnvironmentMark logo={environment.logo} size={16} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-[12.5px] font-medium text-fg">
                      {environment.name}
                    </span>
                    <span className="block truncate text-[11px] text-muted">
                      {environment.chromeSummary}
                    </span>
                  </span>

                  {isCurrent ? (
                    <Check
                      size={13}
                      strokeWidth={2.4}
                      className="env-accent shrink-0"
                      aria-hidden="true"
                    />
                  ) : isPending ? (
                    <span
                      className="size-1.5 shrink-0 animate-pulse rounded-full bg-fg/60"
                      aria-hidden="true"
                    />
                  ) : null}
                </button>
              );
            })}

            <p className="border-t border-line px-2.5 pt-2 pb-1 text-[11px] text-faint">
              Same portfolio. Different environment.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
