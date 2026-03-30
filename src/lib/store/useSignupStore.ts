import { create } from 'zustand';

interface SignupState {
  role: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;

  setRole: (role: string) => void;
  setAccountInfo: (info: { username: string; firstName: string; lastName: string; email: string; phone: string; password: string }) => void;
  /** Clear all signup data (call after successful registration) */
  reset: () => void;
}

const INITIAL: Omit<SignupState, 'setRole' | 'setAccountInfo' | 'reset'> = {
  role: '',
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
};

/**
 * In-memory Zustand store for the signup wizard.
 * Never persisted to localStorage — password stays in memory only.
 * Structured so a future API call can consume the full state object.
 */
export const useSignupStore = create<SignupState>((set) => ({
  ...INITIAL,
  setRole: (role) => set({ role }),
  setAccountInfo: (info) => set(info),
  reset: () => set(INITIAL),
}));
