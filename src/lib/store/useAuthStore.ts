import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type UserRole = 'Agent' | 'Property Seeker' | 'Developer' | 'Landlord' | 'Diaspora' | 'Admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  displayName: string;
  avatarUrl: string;
  kycStatus: 'unverified' | 'in-progress' | 'verified';
}

interface AuthState {
  isLoggedIn: boolean;
  user: AuthUser | null;
  /**
   * Call after successful login/signup API response.
   * Also sets the irealty-session cookie for middleware route protection.
   */
  login: (user: AuthUser) => void;
  /**
   * Clears auth state and removes the session cookie.
   */
  logout: () => void;
  /** Update specific user fields (e.g. after profile save). */
  updateUser: (data: Partial<AuthUser>) => void;
}

const SESSION_COOKIE = 'irealty-session';

function setSessionCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = `${SESSION_COOKIE}=1; path=/; max-age=604800; SameSite=Lax`;
}

function clearSessionCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,

      login: (user) => {
        setSessionCookie();
        set({ isLoggedIn: true, user });
      },

      logout: () => {
        clearSessionCookie();
        set({ isLoggedIn: false, user: null });
      },

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    {
      name: 'irealty-auth',
      storage: createJSONStorage(() => localStorage),
      // Re-set cookie on store rehydration so middleware stays in sync
      onRehydrateStorage: () => (state) => {
        if (state?.isLoggedIn) setSessionCookie();
      },
    }
  )
);
