import { create } from 'zustand';

import { TOAST_MAX_VISIBLE } from '@/lib/constants';

export type ToastType = 'info' | 'success' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  /** Whether the toast is currently exiting (for exit animation). */
  exiting: boolean;
  createdAt: number;
}

interface ToastStoreState {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  dismissToast: (id: string) => void;
}

let nextToastId = 0;

export const useToastStore = create<ToastStoreState>()((set, get) => ({
  toasts: [],

  addToast: (message, type = 'info', duration = 3200) => {
    const id = `toast-${++nextToastId}`;
    const toast: Toast = { id, message, type, exiting: false, createdAt: Date.now() };

    set((state) => {
      // Trim to max visible, evicting the oldest.
      const current = [...state.toasts, toast];
      return {
        toasts:
          current.length > TOAST_MAX_VISIBLE
            ? current.slice(current.length - TOAST_MAX_VISIBLE)
            : current,
      };
    });

    // Auto-dismiss after duration.
    if (duration > 0) {
      setTimeout(() => get().dismissToast(id), duration);
    }
  },

  dismissToast: (id) => {
    const state = get();
    const target = state.toasts.find((t) => t.id === id);
    if (!target || target.exiting) return;

    // Mark as exiting so the component can play the exit animation.
    set((s) => ({
      toasts: s.toasts.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
    }));

    // Remove from DOM after exit animation completes.
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 240);
  },
}));
