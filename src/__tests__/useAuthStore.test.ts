import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore, AuthUser } from '@/lib/store/useAuthStore';

const mockUser: AuthUser = {
  id: 'u1',
  name: 'Jane Doe',
  email: 'jane@example.com',
  role: 'Agent',
  displayName: 'Jane',
  avatarUrl: 'https://example.com/avatar.jpg',
  kycStatus: 'verified',
};

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useAuthStore.setState({ isLoggedIn: false, user: null });
  });

  it('has correct initial state', () => {
    const state = useAuthStore.getState();
    expect(state.isLoggedIn).toBe(false);
    expect(state.user).toBeNull();
  });

  it('login() sets user and isLoggedIn to true', () => {
    useAuthStore.getState().login(mockUser);
    const state = useAuthStore.getState();
    expect(state.isLoggedIn).toBe(true);
    expect(state.user).toEqual(mockUser);
  });

  it('logout() clears user and sets isLoggedIn to false', () => {
    // Log in first
    useAuthStore.getState().login(mockUser);
    expect(useAuthStore.getState().isLoggedIn).toBe(true);

    // Then log out
    useAuthStore.getState().logout();
    const state = useAuthStore.getState();
    expect(state.isLoggedIn).toBe(false);
    expect(state.user).toBeNull();
  });

  it('updateUser() partially updates user fields', () => {
    useAuthStore.getState().login(mockUser);
    useAuthStore.getState().updateUser({ displayName: 'JD', kycStatus: 'in-progress' });

    const state = useAuthStore.getState();
    expect(state.user?.displayName).toBe('JD');
    expect(state.user?.kycStatus).toBe('in-progress');
    // Other fields remain unchanged
    expect(state.user?.email).toBe('jane@example.com');
    expect(state.user?.name).toBe('Jane Doe');
  });

  it('updateUser() does nothing when user is null', () => {
    useAuthStore.getState().updateUser({ displayName: 'Ghost' });
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
  });
});
