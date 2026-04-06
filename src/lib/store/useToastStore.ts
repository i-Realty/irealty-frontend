import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number; // ms, default 4000
}

interface ToastStore {
  toasts: Toast[];
  show: (message: string, type?: ToastType, duration?: number) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  show: (message, type = 'info', duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    set((state) => ({ toasts: [...state.toasts, { id, type, message, duration }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, duration);
  },

  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  dismissAll: () => set({ toasts: [] }),
}));

/** Convenience shorthand functions */
export const toast = {
  success: (msg: string, duration?: number) =>
    useToastStore.getState().show(msg, 'success', duration),
  error: (msg: string, duration?: number) =>
    useToastStore.getState().show(msg, 'error', duration),
  info: (msg: string, duration?: number) =>
    useToastStore.getState().show(msg, 'info', duration),
  warning: (msg: string, duration?: number) =>
    useToastStore.getState().show(msg, 'warning', duration),
};
