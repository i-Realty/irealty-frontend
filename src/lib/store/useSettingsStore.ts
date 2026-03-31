import { create } from 'zustand';

// --- API Payload Schemas ---

export type UserProfilePayload = {
  firstName: string;
  lastName: string;
  displayName: string;
  phone: string;
  phoneCode: string;
  about: string;
  socials: { linkedin: string; facebook: string; instagram: string; twitter: string };
};

export type PayoutPayload = {
  activeMethod: 'Bank' | 'Crypto';
  bank: { bankName: string; accountName: string; accountNumber: string };
  crypto: { currency: 'USDT' | 'BTC' | 'ETH'; address: string };
};

export type SecurityPayload = {
  passwordForm: { current: string; new: string; confirm: string };
  pinForm: { current: string; new: string; confirm: string };
};

export type HelpTicketPayload = {
  username: string;
  email: string;
  subject: string;
  description: string;
};

export type CommissionPayload = {
  feeType: 'Percentage' | 'Amount';
  value: number | '';
};

// --- Store State & Interfaces ---

export type SettingsTab = 'Profile' | 'Payout' | 'Subscription Plans' | 'Commissions' | 'Account' | 'Help Center';
export type AccountRole = 'Admin' | 'Agent' | 'Property Seeker';

export interface AccountInfo {
  id: string;
  role: AccountRole;
  name: string;
}

interface SettingsStore {
  // Navigation & Global Context
  activeTab: SettingsTab;
  setActiveTab: (tab: SettingsTab) => void;
  
  // Multi-Account Switcher
  activeAccount: AccountInfo;
  accounts: AccountInfo[];
  isAddAccountModalOpen: boolean;
  setAddAccountModalOpen: (open: boolean) => void;
  setActiveAccount: (accountId: string) => void;

  // Payloads
  profile: UserProfilePayload;
  payout: PayoutPayload;
  security: SecurityPayload;
  helpTicket: HelpTicketPayload;
  commission: CommissionPayload;

  // Sync Mutations
  updateProfile: (data: Partial<UserProfilePayload>) => void;
  updateSocials: (data: Partial<UserProfilePayload['socials']>) => void;
  
  updatePayoutMethod: (method: 'Bank' | 'Crypto') => void;
  updateBankPayout: (data: Partial<PayoutPayload['bank']>) => void;
  updateCryptoPayout: (data: Partial<PayoutPayload['crypto']>) => void;

  updatePasswords: (data: Partial<SecurityPayload['passwordForm']>) => void;
  updatePins: (data: Partial<SecurityPayload['pinForm']>) => void;

  updateHelpTicket: (data: Partial<HelpTicketPayload>) => void;
  updateCommission: (data: Partial<CommissionPayload>) => void;

  // Network State
  isSaving: boolean;
  error: string | null;

  // Isolated Mock Endpoints (Promises)
  submitProfileMock: () => Promise<void>;
  submitPayoutMock: () => Promise<void>;
  submitSecurityMock: (type: 'password' | 'pin') => Promise<void>;
  submitHelpTicketMock: () => Promise<void>;
  submitCommissionMock: () => Promise<void>;
}

// Default States
const defaultProfile: UserProfilePayload = {
  firstName: 'Warren',
  lastName: 'Waden',
  displayName: 'Sarah Homes',
  phone: '9045433344',
  phoneCode: '+234',
  about: '',
  socials: { linkedin: '', facebook: '', instagram: '', twitter: '' }
};

const defaultPayout: PayoutPayload = {
  activeMethod: 'Bank',
  bank: { bankName: '', accountName: '', accountNumber: '' },
  crypto: { currency: 'USDT', address: '' }
};

const defaultSecurity: SecurityPayload = {
  passwordForm: { current: '', new: '', confirm: '' },
  pinForm: { current: '', new: '', confirm: '' }
};

const defaultHelpTicket: HelpTicketPayload = {
  username: 'Einstein10',
  email: '',
  subject: '',
  description: ''
};

const defaultCommission: CommissionPayload = {
  feeType: 'Percentage',
  value: ''
};

const MOCK_ACCOUNTS: AccountInfo[] = [
  { id: 'acc-1', role: 'Admin', name: 'Waden Warren' },
  { id: 'acc-2', role: 'Agent', name: 'Waden Warren' },
  { id: 'acc-3', role: 'Property Seeker', name: 'Waden Warren' },
];

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  activeTab: 'Profile',
  setActiveTab: (tab) => set({ activeTab: tab }),

  activeAccount: MOCK_ACCOUNTS[0],
  accounts: MOCK_ACCOUNTS,
  isAddAccountModalOpen: false,
  setAddAccountModalOpen: (open) => set({ isAddAccountModalOpen: open }),
  setActiveAccount: (accountId) => {
     const target = get().accounts.find(a => a.id === accountId);
     if (target) set({ activeAccount: target });
  },

  profile: defaultProfile,
  payout: defaultPayout,
  security: defaultSecurity,
  helpTicket: defaultHelpTicket,
  commission: defaultCommission,

  updateProfile: (data) => set((state) => ({ profile: { ...state.profile, ...data } })),
  updateSocials: (data) => set((state) => ({ profile: { ...state.profile, socials: { ...state.profile.socials, ...data } }})),

  updatePayoutMethod: (method) => set((state) => ({ payout: { ...state.payout, activeMethod: method } })),
  updateBankPayout: (data) => set((state) => ({ payout: { ...state.payout, bank: { ...state.payout.bank, ...data } }})),
  updateCryptoPayout: (data) => set((state) => ({ payout: { ...state.payout, crypto: { ...state.payout.crypto, ...data } }})),

  updatePasswords: (data) => set((state) => ({ security: { ...state.security, passwordForm: { ...state.security.passwordForm, ...data } }})),
  updatePins: (data) => set((state) => ({ security: { ...state.security, pinForm: { ...state.security.pinForm, ...data } }})),

  updateHelpTicket: (data) => set((state) => ({ helpTicket: { ...state.helpTicket, ...data } })),
  updateCommission: (data) => set((state) => ({ commission: { ...state.commission, ...data } })),

  isSaving: false,
  error: null,

  // Mocks Simulator
  submitProfileMock: async () => {
     set({ isSaving: true, error: null });
     await new Promise(r => setTimeout(r, 1200));
     set({ isSaving: false });
     // In a real app we'd trigger a toast success here natively
  },
  submitPayoutMock: async () => {
     set({ isSaving: true, error: null });
     await new Promise(r => setTimeout(r, 1200));
     set({ isSaving: false });
  },
  submitSecurityMock: async (type) => {
     set({ isSaving: true, error: null });
     const sec = get().security;
     // simple validation trap
     if (type === 'password' && sec.passwordForm.new !== sec.passwordForm.confirm) {
        set({ isSaving: false, error: 'New passwords do not match' });
        return;
     }
     if (type === 'pin' && sec.pinForm.new !== sec.pinForm.confirm) {
        set({ isSaving: false, error: 'New PINs do not match' });
        return;
     }
     await new Promise(r => setTimeout(r, 1200));
     
     // Reset form upon success simulating native backend clear cache
     if (type === 'password') {
       set((s) => ({ security: { ...s.security, passwordForm: { current: '', new: '', confirm: '' } }, isSaving: false }));
     } else {
       set((s) => ({ security: { ...s.security, pinForm: { current: '', new: '', confirm: '' } }, isSaving: false }));
     }
  },
  submitHelpTicketMock: async () => {
     set({ isSaving: true, error: null });
     await new Promise(r => setTimeout(r, 1200));
     set({ isSaving: false, helpTicket: defaultHelpTicket });
  },
  submitCommissionMock: async () => {
     set({ isSaving: true, error: null });
     await new Promise(r => setTimeout(r, 1200));
     set({ isSaving: false });
  }

}));
