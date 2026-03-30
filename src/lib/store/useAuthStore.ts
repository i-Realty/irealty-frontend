import { create } from 'zustand';

interface User {
  name: string;
  email: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  /**
   * Set auth state after successful login / signup.
   * In demo mode this is called with mock data.
   * When a backend is connected, call this with the API response.
   */
  login: (user: User) => void;
  /** Clear auth state. */
  logout: () => void;
}

/**
 * Minimal auth state store.
 * Currently demo-only (in-memory). When a backend is added:
 *  - `login()` should be called after a successful /api/auth/login response
 *  - `logout()` should call /api/auth/logout and clear tokens/cookies
 *  - Consider persisting with zustand/middleware `persist` using cookies
 */
export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  login: (user) => set({ isLoggedIn: true, user }),
  logout: () => set({ isLoggedIn: false, user: null }),
}));
