import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type NotificationType = 'message' | 'tour' | 'kyc' | 'payment' | 'property' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
  href?: string;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  isOpen: boolean;
  isLoading: boolean;

  toggleDropdown: () => void;
  closeDropdown: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  /**
   * Emit a new notification. Call this from any store action that should produce a visible alert.
   * In production this would be a push from the server; here it writes to the local store.
   */
  emit: (type: NotificationType, title: string, description: string, href?: string) => void;
  /**
   * Broadcast a notification to all users (admin use). In this frontend-only implementation
   * it simply emits a system notification into the current session's notification list.
   */
  broadcast: (title: string, description: string, href?: string) => void;
  clearAll: () => void;
}

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      isOpen: false,
      isLoading: false,

      toggleDropdown: () => set((s) => ({ isOpen: !s.isOpen })),
      closeDropdown: () => set({ isOpen: false }),

      markAsRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markAllAsRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),

      emit: (type, title, description, href) => {
        const now = new Date().toISOString();
        const notification: Notification = {
          id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          type,
          title,
          description,
          time: formatRelativeTime(now),
          read: false,
          href,
          createdAt: now,
        };
        set((s) => ({ notifications: [notification, ...s.notifications].slice(0, 50) }));
      },

      broadcast: (title, description, href) => {
        const now = new Date().toISOString();
        const notification: Notification = {
          id: `broadcast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          type: 'system',
          title,
          description,
          time: formatRelativeTime(now),
          read: false,
          href,
          createdAt: now,
        };
        set((s) => ({ notifications: [notification, ...s.notifications].slice(0, 50) }));
      },

      clearAll: () => set({ notifications: [] }),
    }),
    {
      name: 'irealty-notifications',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
