import { create } from 'zustand';
import { apiPost, apiPut } from '@/lib/api/client';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

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

export type DiasporaFXPayload = {
  baseCurrency: string;
  displayCurrency: string;
  fxProvider: string;
  autoConvert: boolean;
  rateAlerts: boolean;
  alertThreshold: string;
};

export type DeveloperProjectPayload = {
  defaultMilestone: 'Standard' | 'Fast-Track' | 'Custom';
  defaultPaymentSplit: string;
  autoNotifyBuyers: boolean;
  escrowReleaseAutomatic: boolean;
  virtualTourEnabled: boolean;
  publicListingsDefault: boolean;
};

export type LandlordLeasePayload = {
  renewalPolicy: 'Automatic' | 'Manual' | 'Notify Only';
  noticePeriod: '30 days' | '60 days' | '90 days';
  rentIncreaseEnabled: boolean;
  rentIncreasePercent: string;
  latePaymentFee: string;
  gracePeriodDays: string;
  tenantAlerts: boolean;
  expiryAlerts: boolean;
};

// --- Store State & Interfaces ---

export type SettingsTab = 'Profile' | 'Payout' | 'Subscription Plans' | 'Commissions' | 'Account' | 'Help Center';
export type AccountRole = 'Admin' | 'Agent' | 'Property Seeker' | 'Developer' | 'Diaspora' | 'Landlord';

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
  diasporaFX: DiasporaFXPayload;
  landlordLease: LandlordLeasePayload;
  developerProject: DeveloperProjectPayload;

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
  updateDiasporaFX: (data: Partial<DiasporaFXPayload>) => void;
  updateLandlordLease: (data: Partial<LandlordLeasePayload>) => void;
  updateDeveloperProject: (data: Partial<DeveloperProjectPayload>) => void;

  // Network State
  isSaving: boolean;
  error: string | null;

  // API-ready submit methods
  submitProfile: () => Promise<void>;
  submitPayout: () => Promise<void>;
  submitSecurity: (type: 'password' | 'pin') => Promise<void>;
  submitHelpTicket: () => Promise<void>;
  submitCommission: () => Promise<void>;
  submitDiasporaFX: () => Promise<void>;
  submitLandlordLease: () => Promise<void>;
  submitDeveloperProject: () => Promise<void>;

  /** @deprecated Use submitProfile() */
  submitProfileMock: () => Promise<void>;
  /** @deprecated Use submitPayout() */
  submitPayoutMock: () => Promise<void>;
  /** @deprecated Use submitSecurity() */
  submitSecurityMock: (type: 'password' | 'pin') => Promise<void>;
  /** @deprecated Use submitHelpTicket() */
  submitHelpTicketMock: () => Promise<void>;
  /** @deprecated Use submitCommission() */
  submitCommissionMock: () => Promise<void>;
  /** @deprecated Use submitDiasporaFX() */
  submitDiasporaFXMock: () => Promise<void>;
  /** @deprecated Use submitLandlordLease() */
  submitLandlordLeaseMock: () => Promise<void>;
  /** @deprecated Use submitDeveloperProject() */
  submitDeveloperProjectMock: () => Promise<void>;
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

const defaultDiasporaFX: DiasporaFXPayload = {
  baseCurrency: 'USD',
  displayCurrency: 'NGN',
  fxProvider: 'i-Realty Rate',
  autoConvert: true,
  rateAlerts: true,
  alertThreshold: '5',
};

const defaultDeveloperProject: DeveloperProjectPayload = {
  defaultMilestone: 'Standard',
  defaultPaymentSplit: '30-30-20-20',
  autoNotifyBuyers: true,
  escrowReleaseAutomatic: false,
  virtualTourEnabled: true,
  publicListingsDefault: true,
};

const defaultLandlordLease: LandlordLeasePayload = {
  renewalPolicy: 'Notify Only',
  noticePeriod: '60 days',
  rentIncreaseEnabled: false,
  rentIncreasePercent: '5',
  latePaymentFee: '5000',
  gracePeriodDays: '7',
  tenantAlerts: true,
  expiryAlerts: true,
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
  diasporaFX: defaultDiasporaFX,
  landlordLease: defaultLandlordLease,
  developerProject: defaultDeveloperProject,

  updateProfile: (data) => set((state) => ({ profile: { ...state.profile, ...data } })),
  updateSocials: (data) => set((state) => ({ profile: { ...state.profile, socials: { ...state.profile.socials, ...data } } })),

  updatePayoutMethod: (method) => set((state) => ({ payout: { ...state.payout, activeMethod: method } })),
  updateBankPayout: (data) => set((state) => ({ payout: { ...state.payout, bank: { ...state.payout.bank, ...data } } })),
  updateCryptoPayout: (data) => set((state) => ({ payout: { ...state.payout, crypto: { ...state.payout.crypto, ...data } } })),

  updatePasswords: (data) => set((state) => ({ security: { ...state.security, passwordForm: { ...state.security.passwordForm, ...data } } })),
  updatePins: (data) => set((state) => ({ security: { ...state.security, pinForm: { ...state.security.pinForm, ...data } } })),

  updateHelpTicket: (data) => set((state) => ({ helpTicket: { ...state.helpTicket, ...data } })),
  updateCommission: (data) => set((state) => ({ commission: { ...state.commission, ...data } })),
  updateDiasporaFX: (data) => set((state) => ({ diasporaFX: { ...state.diasporaFX, ...data } })),
  updateLandlordLease: (data) => set((state) => ({ landlordLease: { ...state.landlordLease, ...data } })),
  updateDeveloperProject: (data) => set((state) => ({ developerProject: { ...state.developerProject, ...data } })),

  isSaving: false,
  error: null,

  submitProfile: async () => {
    set({ isSaving: true, error: null });
    try {
      if (USE_API) {
        await apiPut('/api/settings/profile', get().profile);
      } else {
        await new Promise(r => setTimeout(r, 1200));
      }
      set({ isSaving: false });
    } catch (err) {
      set({ isSaving: false, error: err instanceof Error ? err.message : 'Failed to save profile' });
    }
  },

  submitPayout: async () => {
    set({ isSaving: true, error: null });
    try {
      if (USE_API) {
        await apiPut('/api/settings/payout', get().payout);
      } else {
        await new Promise(r => setTimeout(r, 1200));
      }
      set({ isSaving: false });
    } catch (err) {
      set({ isSaving: false, error: err instanceof Error ? err.message : 'Failed to save payout settings' });
    }
  },

  submitSecurity: async (type) => {
    set({ isSaving: true, error: null });
    const sec = get().security;
    if (type === 'password' && sec.passwordForm.new !== sec.passwordForm.confirm) {
      set({ isSaving: false, error: 'New passwords do not match' });
      return;
    }
    if (type === 'pin' && sec.pinForm.new !== sec.pinForm.confirm) {
      set({ isSaving: false, error: 'New PINs do not match' });
      return;
    }
    try {
      if (USE_API) {
        const payload = type === 'password'
          ? { type, current: sec.passwordForm.current, new: sec.passwordForm.new }
          : { type, current: sec.pinForm.current, new: sec.pinForm.new };
        await apiPost('/api/settings/security', payload);
      } else {
        await new Promise(r => setTimeout(r, 1200));
      }
      if (type === 'password') {
        set((s) => ({ security: { ...s.security, passwordForm: { current: '', new: '', confirm: '' } }, isSaving: false }));
      } else {
        set((s) => ({ security: { ...s.security, pinForm: { current: '', new: '', confirm: '' } }, isSaving: false }));
      }
    } catch (err) {
      set({ isSaving: false, error: err instanceof Error ? err.message : 'Failed to update security settings' });
    }
  },

  submitHelpTicket: async () => {
    set({ isSaving: true, error: null });
    try {
      if (USE_API) {
        await apiPost('/api/settings/help-ticket', get().helpTicket);
      } else {
        await new Promise(r => setTimeout(r, 1200));
      }
      set({ isSaving: false, helpTicket: defaultHelpTicket });
    } catch (err) {
      set({ isSaving: false, error: err instanceof Error ? err.message : 'Failed to submit help ticket' });
    }
  },

  submitCommission: async () => {
    set({ isSaving: true, error: null });
    try {
      if (USE_API) {
        await apiPut('/api/settings/commission', get().commission);
      } else {
        await new Promise(r => setTimeout(r, 1200));
      }
      set({ isSaving: false });
    } catch (err) {
      set({ isSaving: false, error: err instanceof Error ? err.message : 'Failed to save commission settings' });
    }
  },

  submitDiasporaFX: async () => {
    set({ isSaving: true, error: null });
    try {
      if (USE_API) {
        await apiPut('/api/settings/diaspora-fx', get().diasporaFX);
      } else {
        await new Promise(r => setTimeout(r, 1000));
      }
      set({ isSaving: false });
    } catch (err) {
      set({ isSaving: false, error: err instanceof Error ? err.message : 'Failed to save FX settings' });
    }
  },

  submitLandlordLease: async () => {
    set({ isSaving: true, error: null });
    try {
      if (USE_API) {
        await apiPut('/api/settings/landlord-lease', get().landlordLease);
      } else {
        await new Promise(r => setTimeout(r, 1000));
      }
      set({ isSaving: false });
    } catch (err) {
      set({ isSaving: false, error: err instanceof Error ? err.message : 'Failed to save lease settings' });
    }
  },

  // Backward-compatible aliases
  submitProfileMock: async () => get().submitProfile(),
  submitPayoutMock: async () => get().submitPayout(),
  submitSecurityMock: async (type) => get().submitSecurity(type),
  submitHelpTicketMock: async () => get().submitHelpTicket(),
  submitCommissionMock: async () => get().submitCommission(),
  submitDiasporaFXMock: async () => get().submitDiasporaFX(),
  submitLandlordLeaseMock: async () => get().submitLandlordLease(),

  submitDeveloperProject: async () => {
    set({ isSaving: true, error: null });
    try {
      if (USE_API) {
        await apiPut('/api/settings/developer-project', get().developerProject);
      } else {
        await new Promise(r => setTimeout(r, 1000));
      }
      set({ isSaving: false });
    } catch (err) {
      set({ isSaving: false, error: err instanceof Error ? err.message : 'Failed to save project settings' });
    }
  },

  submitDeveloperProjectMock: async () => get().submitDeveloperProject(),
}));
