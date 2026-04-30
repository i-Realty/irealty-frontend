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

  describe('emit', () => {
    it('adds a notification to the list', () => {
      useNotificationStore.getState().emit('system', 'Test Title', 'Test description');
      const state = useNotificationStore.getState();

      expect(state.notifications.length).toBe(1);
    });

    it('populates notifications with expected fields', () => {
      useNotificationStore.getState().emit('payment', 'Payment received', 'You received ₦25,000');
      const first = useNotificationStore.getState().notifications[0];

      expect(first).toHaveProperty('id');
      expect(first).toHaveProperty('type');
      expect(first).toHaveProperty('title');
      expect(first).toHaveProperty('description');
      expect(first).toHaveProperty('time');
      expect(first).toHaveProperty('read');
      expect(first.type).toBe('payment');
      expect(first.title).toBe('Payment received');
      expect(first.read).toBe(false);
    });
  });

  describe('markAsRead', () => {
    it('marks a specific notification as read', () => {
      useNotificationStore.getState().emit('system', 'N1', 'Desc 1');
      useNotificationStore.getState().emit('kyc', 'N2', 'Desc 2');

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

    it('does not affect other notifications', () => {
      useNotificationStore.getState().emit('system', 'N1', 'Desc 1');
      useNotificationStore.getState().emit('kyc', 'N2', 'Desc 2');
      const notifications = useNotificationStore.getState().notifications;
      const unreadBefore = notifications.filter((n) => !n.read).length;

      const firstUnread = notifications.find((n) => !n.read);
      useNotificationStore.getState().markAsRead(firstUnread!.id);

      const unreadAfter = useNotificationStore
        .getState()
        .notifications.filter((n) => !n.read).length;
      expect(unreadAfter).toBe(unreadBefore - 1);
    });
  });

  describe('markAllAsRead', () => {
    it('marks all notifications as read', () => {
      useNotificationStore.getState().emit('system', 'N1', 'Desc 1');
      useNotificationStore.getState().emit('kyc', 'N2', 'Desc 2');
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
