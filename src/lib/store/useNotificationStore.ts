import { create } from 'zustand';

export type NotificationType = 'message' | 'tour' | 'kyc' | 'payment' | 'property' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
  href?: string;
}

interface NotificationState {
  notifications: Notification[];
  isOpen: boolean;
  isLoading: boolean;

  toggleDropdown: () => void;
  closeDropdown: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  fetchNotificationsMock: () => Promise<void>;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'message',
    title: 'New message from Marcus Bell',
    description: 'I need help with my KYC verification...',
    time: '5m ago',
    read: false,
  },
  {
    id: 'n2',
    type: 'tour',
    title: 'Tour booking confirmed',
    description: '3-Bed Duplex, Lekki — scheduled for Apr 10',
    time: '1h ago',
    read: false,
  },
  {
    id: 'n3',
    type: 'payment',
    title: 'Payment received',
    description: 'Escrow funded: ₦25,000,000 for Ikoyi Mansion',
    time: '3h ago',
    read: false,
  },
  {
    id: 'n4',
    type: 'kyc',
    title: 'KYC verification approved',
    description: 'Your identity has been verified successfully',
    time: '1d ago',
    read: true,
  },
  {
    id: 'n5',
    type: 'property',
    title: 'Listing approved',
    description: 'Your property "Office Space, Ikeja GRA" is now live',
    time: '1d ago',
    read: true,
  },
  {
    id: 'n6',
    type: 'system',
    title: 'Platform update',
    description: 'New escrow protection features are now available',
    time: '2d ago',
    read: true,
  },
];

export const useNotificationStore = create<NotificationState>((set) => ({
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

  fetchNotificationsMock: async () => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 300));
    set({ notifications: MOCK_NOTIFICATIONS, isLoading: false });
  },
}));
