'use client';

import { cn } from '@izhar-os/ui';
import { CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useCallback } from 'react';

import { useApplicationChrome } from '@/hooks/useEnvironment';
import { useIsMobile } from '@/hooks/useSystemPreferences';
import { useToastStore, type ToastType } from '@/lib/store/toast-store';

const TOAST_ICONS: Record<ToastType, typeof Info> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
};

const TOAST_ACCENT: Record<ToastType, string> = {
  info: 'text-accent',
  success: 'text-emerald-400',
  warning: 'text-amber-400',
};

/**
 * Toast notification container.
 *
 * Sits at the bottom-right on desktop (above the taskbar) and bottom-center on
 * mobile. Reads the environment's card radius and animation curve so toasts
 * belong to whichever desktop is active.
 */
export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);
  const isMobile = useIsMobile();
  const chrome = useApplicationChrome();

  const handleDismiss = useCallback(
    (id: string) => {
      dismissToast(id);
    },
    [dismissToast],
  );

  if (toasts.length === 0) return null;

  return (
    <div
      className={cn(
        'pointer-events-none fixed z-200 flex flex-col gap-2',
        isMobile
          ? 'inset-x-4 bottom-[calc(var(--mobile-dock-height)+12px)]'
          : 'right-4 bottom-[calc(var(--taskbar-height)+12px)]',
      )}
    >
      {toasts.map((toast) => {
        const Icon = TOAST_ICONS[toast.type];
        return (
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            className={cn(
              'pointer-events-auto flex items-center gap-2.5 border border-line bg-surface/92 px-3.5 py-2.5 backdrop-blur-xl',
              isMobile ? 'w-full' : 'ms-auto min-w-[260px] max-w-[380px]',
              toast.exiting ? 'os-toast-exit' : 'os-toast-enter',
            )}
            style={{
              borderRadius: chrome.cardRadius,
              boxShadow:
                '0 16px 40px -16px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.03)',
            }}
          >
            <Icon
              size={15}
              strokeWidth={1.8}
              className={cn('shrink-0', TOAST_ACCENT[toast.type])}
              aria-hidden="true"
            />

            <span className="min-w-0 flex-1 text-[12.5px] leading-snug text-fg/90">
              {toast.message}
            </span>

            <button
              type="button"
              onClick={() => handleDismiss(toast.id)}
              aria-label="Dismiss notification"
              className="grid size-5 shrink-0 place-items-center rounded text-muted transition-colors duration-150 hover:bg-white/10 hover:text-fg"
            >
              <X size={12} strokeWidth={2} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
