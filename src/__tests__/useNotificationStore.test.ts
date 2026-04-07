import { describe, it, expect, beforeEach } from 'vitest';
import { useNotificationStore } from '@/lib/store/useNotificationStore';

describe('useNotificationStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useNotificationStore.setState({
      notifications: [],
      isOpen: false,
      isLoading: false,
    });
  });

  describe('fetchNotificationsMock', () => {
    it('loads mock notification data', async () => {
      await useNotificationStore.getState().fetchNotificationsMock();
      const state = useNotificationStore.getState();

      expect(state.notifications.length).toBeGreaterThan(0);
      expect(state.isLoading).toBe(false);
    });

    it('sets isLoading to false after fetching', async () => {
      await useNotificationStore.getState().fetchNotificationsMock();
      expect(useNotificationStore.getState().isLoading).toBe(false);
    });

    it('populates notifications with expected fields', async () => {
      await useNotificationStore.getState().fetchNotificationsMock();
      const first = useNotificationStore.getState().notifications[0];

      expect(first).toHaveProperty('id');
      expect(first).toHaveProperty('type');
      expect(first).toHaveProperty('title');
      expect(first).toHaveProperty('description');
      expect(first).toHaveProperty('time');
      expect(first).toHaveProperty('read');
    });
  });

  describe('markAsRead', () => {
    it('marks a specific notification as read', async () => {
      await useNotificationStore.getState().fetchNotificationsMock();

      // Find an unread notification
      const unread = useNotificationStore
        .getState()
        .notifications.find((n) => !n.read);
      expect(unread).toBeDefined();

      useNotificationStore.getState().markAsRead(unread!.id);

      const updated = useNotificationStore
        .getState()
        .notifications.find((n) => n.id === unread!.id);
      expect(updated?.read).toBe(true);
    });

    it('does not affect other notifications', async () => {
      await useNotificationStore.getState().fetchNotificationsMock();
      const notifications = useNotificationStore.getState().notifications;
      const unreadBefore = notifications.filter((n) => !n.read).length;

      // Mark just the first unread
      const firstUnread = notifications.find((n) => !n.read);
      useNotificationStore.getState().markAsRead(firstUnread!.id);

      const unreadAfter = useNotificationStore
        .getState()
        .notifications.filter((n) => !n.read).length;
      expect(unreadAfter).toBe(unreadBefore - 1);
    });
  });

  describe('markAllAsRead', () => {
    it('marks all notifications as read', async () => {
      await useNotificationStore.getState().fetchNotificationsMock();
      useNotificationStore.getState().markAllAsRead();

      const allRead = useNotificationStore
        .getState()
        .notifications.every((n) => n.read);
      expect(allRead).toBe(true);
    });
  });

  describe('toggleDropdown', () => {
    it('toggles isOpen from false to true', () => {
      expect(useNotificationStore.getState().isOpen).toBe(false);
      useNotificationStore.getState().toggleDropdown();
      expect(useNotificationStore.getState().isOpen).toBe(true);
    });

    it('toggles isOpen from true to false', () => {
      useNotificationStore.getState().toggleDropdown(); // true
      useNotificationStore.getState().toggleDropdown(); // false
      expect(useNotificationStore.getState().isOpen).toBe(false);
    });
  });

  describe('closeDropdown', () => {
    it('sets isOpen to false', () => {
      useNotificationStore.getState().toggleDropdown(); // open
      expect(useNotificationStore.getState().isOpen).toBe(true);

      useNotificationStore.getState().closeDropdown();
      expect(useNotificationStore.getState().isOpen).toBe(false);
    });
  });
});
