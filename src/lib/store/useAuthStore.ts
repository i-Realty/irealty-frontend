import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type UserRole = 'Agent' | 'Property Seeker' | 'Developer' | 'Landlord' | 'Diaspora' | 'Admin';
export type AccountStatus = 'active' | 'suspended' | 'deactivated';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  displayName: string;
  avatarUrl: string;
  kycStatus: 'unverified' | 'in-progress' | 'verified';
  accountStatus: AccountStatus;
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
  /** Update specific user fields (e.g. after profile save or KYC approval). */
  updateUser: (data: Partial<AuthUser>) => void;
  /**
   * Called by admin when approving KYC for the currently logged-in user
   * (or via a server-side sync in production).
   */
  setKycVerified: () => void;
  setKycInProgress: () => void;
  setAccountStatus: (status: AccountStatus) => void;
}

const SESSION_COOKIE = 'irealty-session';

function setSessionCookie(role: UserRole) {
  if (typeof document === 'undefined') return;
  // Encode the role in the cookie so middleware can read it for role-based routing
  document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(role)}; path=/; max-age=604800; SameSite=Lax`;
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
        setSessionCookie(user.role);
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

      setKycVerified: () =>
        set((state) => ({
          user: state.user ? { ...state.user, kycStatus: 'verified' } : null,
        })),

      setKycInProgress: () =>
        set((state) => ({
          user: state.user ? { ...state.user, kycStatus: 'in-progress' } : null,
        })),

      setAccountStatus: (status) =>
        set((state) => ({
          user: state.user ? { ...state.user, accountStatus: status } : null,
        })),
    }),
    {
      name: 'irealty-auth',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.isLoggedIn && state.user) setSessionCookie(state.user.role);
      },
    }
  )
);
