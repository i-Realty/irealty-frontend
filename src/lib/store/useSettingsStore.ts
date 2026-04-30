import { create } from 'zustand';
import { apiGet, apiPost, apiPut } from '@/lib/api/client';
import { useAuthStore, type AuthUser } from '@/lib/store/useAuthStore';
import { mapRole, mapKycStatus, mapAccountStatus, extractToken, type BackendAuthResponse, type BackendUser, ROLE_TO_BACKEND } from '@/lib/api/adapters';

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
  email: string;
}

interface SettingsStore {
  // Navigation & Global Context
  activeTab: SettingsTab;
  setActiveTab: (tab: SettingsTab) => void;

  // Multi-Account Switcher
  activeAccount: AccountInfo;
  accounts: AccountInfo[];
  /** The original account the user registered with (first login). */
  mainAccountId: string;
  isAddAccountModalOpen: boolean;
  setAddAccountModalOpen: (open: boolean) => void;
  setActiveAccount: (accountId: string) => void;
  /** API-ready: switches the active account and updates the auth user. */
  switchAccount: (accountId: string) => Promise<void>;
  /** Fetch linked accounts from the backend (no-op in mock mode). */
  fetchAccounts: () => Promise<void>;
  /** Add a new linked account role (API mode only). */
  addLinkedAccount: (role: AccountRole) => Promise<void>;

  // Payloads
  profile: UserProfilePayload;
  /** Persists each account's profile independently so switching restores the right data. */
  profilesByAccount: Record<string, UserProfilePayload>;
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

// Per-account default profiles — names are used throughout the demo dashboards
const MOCK_ACCOUNT_PROFILES: Record<string, UserProfilePayload> = {
  'demo-admin': {
    firstName: 'Waden', lastName: 'Warren', displayName: 'Waden Warren',
    phone: '8012345678', phoneCode: '+234', about: '',
    socials: { linkedin: '', facebook: '', instagram: '', twitter: '' },
  },
  'demo-agent': {
    firstName: 'Marcus', lastName: 'Bell', displayName: 'Marcus Bell',
    phone: '8023456789', phoneCode: '+234', about: '',
    socials: { linkedin: '', facebook: '', instagram: '', twitter: '' },
  },
  'demo-seeker': {
    firstName: 'Sarah', lastName: 'Homes', displayName: 'Sarah Homes',
    phone: '8034567890', phoneCode: '+234', about: '',
    socials: { linkedin: '', facebook: '', instagram: '', twitter: '' },
  },
  'demo-developer': {
    firstName: 'Chidi', lastName: 'Okeke', displayName: 'Chidi Okeke',
    phone: '8045678901', phoneCode: '+234', about: '',
    socials: { linkedin: '', facebook: '', instagram: '', twitter: '' },
  },
  'demo-diaspora': {
    firstName: 'Ngozi', lastName: 'Adeyemi', displayName: 'Ngozi Adeyemi',
    phone: '8056789012', phoneCode: '+234', about: '',
    socials: { linkedin: '', facebook: '', instagram: '', twitter: '' },
  },
  'demo-landlord': {
    firstName: 'Tunde', lastName: 'Bakare', displayName: 'Tunde Bakare',
    phone: '8067890123', phoneCode: '+234', about: '',
    socials: { linkedin: '', facebook: '', instagram: '', twitter: '' },
  },
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
  { id: 'demo-admin',     role: 'Admin',           name: 'Waden Warren',   email: 'admin@i-realty.app'     },
  { id: 'demo-agent',     role: 'Agent',            name: 'Marcus Bell',    email: 'agent@i-realty.app'     },
  { id: 'demo-seeker',    role: 'Property Seeker',  name: 'Sarah Homes',    email: 'seeker@i-realty.app'    },
  { id: 'demo-developer', role: 'Developer',        name: 'Chidi Okeke',    email: 'developer@i-realty.app' },
  { id: 'demo-diaspora',  role: 'Diaspora',         name: 'Ngozi Adeyemi',  email: 'diaspora@i-realty.app'  },
  { id: 'demo-landlord',  role: 'Landlord',         name: 'Tunde Bakare',   email: 'landlord@i-realty.app'  },
];

// AuthUser objects used when switching accounts in mock mode.
// In API mode these come from the /api/auth/switch-account response.
const MOCK_ACCOUNT_USERS: Record<string, AuthUser> = {
  'demo-admin':     { id: 'demo-admin',     name: 'Waden Warren',  email: 'admin@i-realty.app',     role: 'Admin',           displayName: 'Waden Warren',  avatarUrl: '/images/demo-avatar.jpg', kycStatus: 'verified',   accountStatus: 'active' },
  'demo-agent':     { id: 'demo-agent',     name: 'Marcus Bell',   email: 'agent@i-realty.app',     role: 'Agent',           displayName: 'Marcus Bell',   avatarUrl: '/images/demo-avatar.jpg', kycStatus: 'unverified', accountStatus: 'active' },
  'demo-seeker':    { id: 'demo-seeker',    name: 'Sarah Homes',   email: 'seeker@i-realty.app',    role: 'Property Seeker', displayName: 'Sarah Homes',   avatarUrl: '/images/demo-avatar.jpg', kycStatus: 'unverified', accountStatus: 'active' },
  'demo-developer': { id: 'demo-developer', name: 'Chidi Okeke',   email: 'developer@i-realty.app', role: 'Developer',       displayName: 'Chidi Okeke',   avatarUrl: '/images/demo-avatar.jpg', kycStatus: 'unverified', accountStatus: 'active' },
  'demo-diaspora':  { id: 'demo-diaspora',  name: 'Ngozi Adeyemi', email: 'diaspora@i-realty.app',  role: 'Diaspora',        displayName: 'Ngozi Adeyemi', avatarUrl: '/images/demo-avatar.jpg', kycStatus: 'unverified', accountStatus: 'active' },
  'demo-landlord':  { id: 'demo-landlord',  name: 'Tunde Bakare',  email: 'landlord@i-realty.app',  role: 'Landlord',        displayName: 'Tunde Bakare',  avatarUrl: '/images/demo-avatar.jpg', kycStatus: 'unverified', accountStatus: 'active' },
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  activeTab: 'Profile',
  setActiveTab: (tab) => set({ activeTab: tab }),

  activeAccount: USE_API ? { id: '', role: 'Agent' as AccountRole, name: '', email: '' } : MOCK_ACCOUNTS[0],
  accounts: USE_API ? [] : MOCK_ACCOUNTS,
  mainAccountId: '',
  isAddAccountModalOpen: false,
  setAddAccountModalOpen: (open) => set({ isAddAccountModalOpen: open }),
  setActiveAccount: (accountId) => {
    let target = get().accounts.find(a => a.id === accountId);

    // In API mode the real user's UUID won't exist in mock accounts.
    // Reset the accounts list to ONLY the current user — this clears
    // stale entries from previous logins on the same device.
    // fetchAccounts() will add linked accounts afterwards.
    if (!target && USE_API) {
      const authUser = useAuthStore.getState().user;
      if (authUser && authUser.id === accountId) {
        target = { id: authUser.id, role: authUser.role as AccountRole, name: authUser.displayName || authUser.name, email: authUser.email };
        // The first account set after login is the main (original) account.
        const mainId = get().mainAccountId || accountId;
        set({ accounts: [target], mainAccountId: mainId });
      }
    }

    if (!target) return;

    // Linked accounts share the main account's personal details.
    // Only fetch /me for the main account; linked accounts reuse its profile.
    const mainId = get().mainAccountId;
    const isMainAccount = !mainId || accountId === mainId;

    let profile = get().profilesByAccount[accountId];

    if (!profile && USE_API) {
      // For linked accounts, copy the main account's profile
      const mainProfile = mainId ? get().profilesByAccount[mainId] : null;
      if (mainProfile && !isMainAccount) {
        profile = { ...mainProfile };
      } else {
        const authUser = useAuthStore.getState().user;
        if (authUser) {
          const [firstName = '', ...lastParts] = authUser.name.split(' ');
          profile = {
            firstName,
            lastName:    lastParts.join(' '),
            displayName: authUser.displayName || authUser.name,
            phone:       '',
            phoneCode:   '+234',
            about:       '',
            socials:     { linkedin: '', facebook: '', instagram: '', twitter: '' },
          };
        }
      }
    }
    if (!profile) {
      profile = MOCK_ACCOUNT_PROFILES[accountId] ?? MOCK_ACCOUNT_PROFILES['demo-admin'];
    }

    set({
      activeAccount: target,
      profile,
      profilesByAccount: { ...get().profilesByAccount, [accountId]: profile },
    });

    // Fetch full profile from /me only for the main account.
    // Linked accounts reuse the main account's profile.
    if (USE_API && isMainAccount) {
      apiGet<BackendUser & { phoneNumber?: string; linkedinUrl?: string; facebookUrl?: string; instagramUrl?: string; twitterUrl?: string }>('/api/auth/me')
        .then(me => {
          const phone = me.phoneNumber?.replace(/^\+234/, '') ?? '';
          const fullProfile: UserProfilePayload = {
            firstName:   me.firstName ?? '',
            lastName:    me.lastName ?? '',
            displayName: me.displayName ?? '',
            phone,
            phoneCode:   '+234',
            about:       '',
            socials: {
              linkedin:  me.linkedinUrl ?? '',
              facebook:  me.facebookUrl ?? '',
              instagram: me.instagramUrl ?? '',
              twitter:   me.twitterUrl ?? '',
            },
          };
          set({
            profile: fullProfile,
            profilesByAccount: { ...get().profilesByAccount, [accountId]: fullProfile },
          });
        })
        .catch(() => { /* non-critical */ });
    }
  },

  switchAccount: async (accountId) => {
    let account = get().accounts.find(a => a.id === accountId);
    if (USE_API) {
      try {
        // Backend expects linkedUserId (the target account's UUID)
        const data = await apiPost<BackendAuthResponse>('/api/auth/switch-account', { linkedUserId: accountId });
        const rawUser: BackendUser = data.user ?? (data as unknown as BackendUser);
        // Use the main account's personal details for linked accounts
        const mainProfile = get().profilesByAccount[get().mainAccountId];
        const mainUser = mainProfile
          ? { name: `${mainProfile.firstName} ${mainProfile.lastName}`.trim(), displayName: mainProfile.displayName, email: '' }
          : null;
        const prevUser = useAuthStore.getState().user;

        const rawName = `${rawUser.firstName ?? ''} ${rawUser.lastName ?? ''}`.trim();
        const mappedUser = {
          id:            rawUser.id,
          name:          mainUser?.name || rawName || rawUser.displayName || 'User',
          email:         prevUser?.email ?? rawUser.email,
          role:          mapRole(rawUser.roles?.[0] ?? ''),
          displayName:   mainUser?.displayName || rawUser.displayName || rawName,
          avatarUrl:     prevUser?.avatarUrl ?? rawUser.avatarUrl ?? '/images/demo-avatar.jpg',
          kycStatus:     mapKycStatus(rawUser.verificationStatus ?? ''),
          accountStatus: mapAccountStatus(rawUser.isActive ?? true, rawUser.verificationStatus ?? ''),
        } satisfies AuthUser;
        useAuthStore.getState().login(mappedUser);
        const token = extractToken(data);
        if (token) {
          useAuthStore.getState().setToken(token, data.refreshToken ?? null);
          const { setTokenImmediate } = await import('@/lib/api/client');
          setTokenImmediate(token);
        }
        // Ensure the switched account is in the list
        if (!account) {
          account = { id: mappedUser.id, role: mappedUser.role as AccountRole, name: mappedUser.displayName, email: mappedUser.email };
          set({ accounts: [account, ...get().accounts.filter(a => a.id !== accountId)] });
        }
      } catch {
        // switch-account failed — stay on current account
        return;
      }
    } else {
      if (!account) return;
      await new Promise(r => setTimeout(r, 300));
      const mockUser = MOCK_ACCOUNT_USERS[accountId];
      if (mockUser) useAuthStore.getState().login(mockUser);
    }
    if (!account) return;
    get().setActiveAccount(accountId);
  },

  fetchAccounts: async () => {
    if (!USE_API) return; // mock mode keeps the static MOCK_ACCOUNTS list
    try {
      const data = await apiGet<BackendUser[]>('/api/auth/linked-accounts');
      const linked: AccountInfo[] = (Array.isArray(data) ? data : []).map(u => ({
        id:    u.id,
        role:  mapRole(u.roles?.[0] ?? '') as AccountRole,
        name:  u.displayName || `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || 'User',
        email: u.email,
      }));
      // Ensure the current user is always in the list even if the
      // backend's linked-accounts endpoint doesn't include them.
      const currentUser = useAuthStore.getState().user;
      const currentId = currentUser?.id;
      if (currentId && !linked.some(a => a.id === currentId)) {
        linked.unshift({
          id: currentId,
          role: currentUser.role as AccountRole,
          name: currentUser.displayName || currentUser.name,
          email: currentUser.email,
        });
      }

      // All linked accounts share the main account's personal details.
      const mainId = get().mainAccountId;
      const mainAcc = linked.find(a => a.id === mainId) ?? linked[0];
      if (mainAcc) {
        for (const acc of linked) {
          if (acc.id !== mainAcc.id) {
            acc.name  = mainAcc.name;
            acc.email = mainAcc.email;
          }
        }
      }

      // Put main account first in the list
      linked.sort((a, b) => (a.id === mainId ? -1 : b.id === mainId ? 1 : 0));

      set({ accounts: linked });
    } catch {
      // Non-critical — keep existing accounts list on failure
    }
  },

  addLinkedAccount: async (role) => {
    if (!USE_API) return;
    await apiPost('/api/auth/linked-accounts', {
      role:        ROLE_TO_BACKEND[role],
      displayName: undefined,
    });
    await get().fetchAccounts();
  },

  profile: USE_API
    ? { firstName: '', lastName: '', displayName: '', phone: '', phoneCode: '+234', about: '', socials: { linkedin: '', facebook: '', instagram: '', twitter: '' } }
    : MOCK_ACCOUNT_PROFILES['demo-admin'],
  profilesByAccount: USE_API ? {} : { ...MOCK_ACCOUNT_PROFILES },
  payout: defaultPayout,
  security: defaultSecurity,
  helpTicket: defaultHelpTicket,
  commission: defaultCommission,
  diasporaFX: defaultDiasporaFX,
  landlordLease: defaultLandlordLease,
  developerProject: defaultDeveloperProject,

  updateProfile: (data) => set((state) => {
    const updated = { ...state.profile, ...data };
    return { profile: updated, profilesByAccount: { ...state.profilesByAccount, [state.activeAccount.id]: updated } };
  }),
  updateSocials: (data) => set((state) => {
    const updated = { ...state.profile, socials: { ...state.profile.socials, ...data } };
    return { profile: updated, profilesByAccount: { ...state.profilesByAccount, [state.activeAccount.id]: updated } };
  }),

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
        const p = get().profile;
        await apiPut('/api/auth/me', {
          firstName:   p.firstName,
          lastName:    p.lastName,
          displayName: p.displayName,
          phoneNumber: p.phoneCode + p.phone,
          linkedinUrl:  p.socials.linkedin || undefined,
          facebookUrl:  p.socials.facebook || undefined,
          instagramUrl: p.socials.instagram || undefined,
          twitterUrl:   p.socials.twitter || undefined,
        });
      } else {
        await new Promise(r => setTimeout(r, 1200));
      }
      const { profile, activeAccount } = get();
      const displayName = profile.displayName;
      // Sync the display name into the auth user and the accounts switcher list
      useAuthStore.getState().updateUser({ displayName, name: displayName });
      set((state) => ({
        isSaving: false,
        activeAccount: { ...state.activeAccount, name: displayName },
        accounts: state.accounts.map(a => a.id === activeAccount.id ? { ...a, name: displayName } : a),
      }));
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
