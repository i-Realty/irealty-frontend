import { create } from 'zustand';
import { apiGet, apiPost, apiPut, setTokenImmediate } from '@/lib/api/client';
import { useAuthStore, type AuthUser, type UserRole } from '@/lib/store/useAuthStore';
import { mapRole, mapKycStatus, mapAccountStatus, extractToken, type BackendAuthResponse, type BackendUser, ROLE_TO_BACKEND } from '@/lib/api/adapters';

export interface PublicAgentProfile {
  id: string;
  name: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  kycStatus: 'unverified' | 'in-progress' | 'verified';
  socials: { linkedin: string; facebook: string; instagram: string; twitter: string };
}

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
  /**
   * JWT for the main account — stored so all switch-account calls are
   * always authenticated as the main account regardless of which linked
   * account is currently active.
   */
  mainToken: string | null;
  isAddAccountModalOpen: boolean;
  setAddAccountModalOpen: (open: boolean) => void;
  setActiveAccount: (accountId: string) => void;
  /**
   * API-ready: switches the active account and updates the auth user.
   * Returns the new role on success. Throws on failure.
   */
  switchAccount: (accountId: string) => Promise<UserRole>;
  /** Fetch linked accounts from the backend (no-op in mock mode). */
  fetchAccounts: () => Promise<void>;
  /**
   * Fetch the current agent's own profile (GET /api/agents/profile).
   * Populates the settings profile including bio/about field.
   * No-op for non-agent roles.
   */
  fetchAgentProfile: () => Promise<void>;
  /**
   * Fetch a public agent profile by user ID (GET /api/agents/{id}/profile).
   * Returns the agent's public-facing data, or null on failure.
   */
  getPublicAgentProfile: (agentId: string) => Promise<PublicAgentProfile | null>;
  /** Add a new linked account role (API mode only). */
  addLinkedAccount: (role: AccountRole) => Promise<void>;
  /** Clear all user-specific data (call on logout). */
  resetUserData: () => void;

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
  mainToken: null,
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
        // Fresh login — this user is the main account. Clear all stale
        // data from any previous user's session. Capture the current
        // JWT so all subsequent switch-account calls can use it.
        set({
          accounts: [target],
          mainAccountId: accountId,
          mainToken: useAuthStore.getState().token,
          profilesByAccount: {},
        });
      }
    }

    if (!target) return;

    const mainId = get().mainAccountId;

    // Use any previously stored profile as the immediate value
    let profile = get().profilesByAccount[accountId];

    if (!profile && USE_API) {
      // Seed linked accounts with the main account's profile as default
      const mainProfile = mainId ? get().profilesByAccount[mainId] : null;
      if (mainProfile && accountId !== mainId) {
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

    // Always fetch /me in the background to get the latest data for this account.
    // If the backend returns placeholder data (linked accounts that haven't been
    // customized yet), keep the main account's profile as default.
    if (USE_API) {
      apiGet<BackendUser & { phoneNumber?: string; linkedinUrl?: string; facebookUrl?: string; instagramUrl?: string; twitterUrl?: string }>('/api/auth/me')
        .then(me => {
          const phone = me.phoneNumber?.replace(/^\+234/, '') ?? '';
          const fetched: UserProfilePayload = {
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

          // Detect placeholder linked accounts ("Linked Account", "linked-...@internal")
          const isPlaceholder = fetched.firstName === 'Linked' && fetched.lastName === 'Account';

          if (isPlaceholder && accountId !== mainId) {
            // Keep the main account's profile as default — don't overwrite
            return;
          }

          set({
            profile: fetched,
            profilesByAccount: { ...get().profilesByAccount, [accountId]: fetched },
          });
        })
        .catch(() => { /* non-critical */ });
    }
  },

  switchAccount: async (accountId) => {
    let account = get().accounts.find(a => a.id === accountId);
    let newRole: UserRole;

    if (USE_API) {
      const prevUser = useAuthStore.getState().user;

      // Always use the main account's token for the switch-account call.
      // Linked-account tokens may lack permission to switch to sibling accounts.
      const mainToken = get().mainToken;
      if (mainToken) setTokenImmediate(mainToken);

      // Backend expects linkedUserId (the target account's UUID)
      const data = await apiPost<BackendAuthResponse>('/api/auth/switch-account', { linkedUserId: accountId });

      // Extract new token from response and activate it immediately
      const token = extractToken(data);
      const refreshToken = data.refreshToken ?? (data as Record<string, string>).refresh_token ?? null;
      if (token) {
        useAuthStore.getState().setToken(token, refreshToken);
        setTokenImmediate(token);
      }

      // Call /api/auth/me to get authoritative user data with the new token —
      // the switch-account response body is undocumented and unreliable.
      const me = await apiGet<BackendUser & {
        phoneNumber?: string; linkedinUrl?: string; facebookUrl?: string;
        instagramUrl?: string; twitterUrl?: string;
      }>('/api/auth/me');

      const mainProfile = get().profilesByAccount[get().mainAccountId];
      const realName = mainProfile
        ? (`${mainProfile.firstName} ${mainProfile.lastName}`.trim() || mainProfile.displayName)
        : (prevUser?.name || prevUser?.displayName || '');
      const realDisplayName = mainProfile?.displayName || realName;
      const realEmail = prevUser?.email || '';

      const meName = `${me.firstName ?? ''} ${me.lastName ?? ''}`.trim();
      const isPlaceholder = meName === 'Linked Account' || me.displayName === 'Linked Account';

      // Role from /api/auth/me is authoritative; fall back to pre-known role
      const preKnownRole = account?.role as UserRole | undefined;
      const meRole = me.roles?.length ? mapRole(me.roles[0]) : null;
      newRole = meRole ?? preKnownRole ?? 'Property Seeker';

      const mappedUser = {
        id:            me.id,
        name:          isPlaceholder ? (realName || 'User') : (meName || me.displayName || realName || 'User'),
        email:         realEmail || me.email,
        role:          newRole,
        displayName:   isPlaceholder ? (realDisplayName || 'User') : (me.displayName || meName || realDisplayName || 'User'),
        avatarUrl:     prevUser?.avatarUrl ?? me.avatarUrl ?? '/images/demo-avatar.jpg',
        kycStatus:     mapKycStatus(me.verificationStatus ?? ''),
        accountStatus: mapAccountStatus(me.isActive ?? true, me.verificationStatus ?? ''),
      } satisfies AuthUser;

      useAuthStore.getState().login(mappedUser);

      // If switching back to main account, refresh the stored main token
      if (accountId === get().mainAccountId && token) {
        set({ mainToken: token });
      }

      // Ensure the switched account is in the list
      if (!account) {
        account = { id: mappedUser.id, role: newRole as AccountRole, name: mappedUser.displayName, email: mappedUser.email };
        set({ accounts: [account, ...get().accounts.filter(a => a.id !== accountId)] });
      }

      // Refresh linked accounts and agent profile using new token (non-blocking)
      get().fetchAccounts().catch(() => {});
      get().fetchAgentProfile().catch(() => {});
    } else {
      const mockUser = MOCK_ACCOUNT_USERS[accountId];
      if (!mockUser) throw new Error(`No mock account found for id: ${accountId}`);
      await new Promise(r => setTimeout(r, 300));
      useAuthStore.getState().login(mockUser);
      newRole = mockUser.role;
      if (!account) {
        account = { id: mockUser.id, role: newRole as AccountRole, name: mockUser.displayName, email: mockUser.email };
        set({ accounts: [account, ...get().accounts.filter(a => a.id !== accountId)] });
      }
    }

    get().setActiveAccount(account!.id);
    return newRole;
  },

  fetchAccounts: async () => {
    if (!USE_API) return; // mock mode keeps the static MOCK_ACCOUNTS list
    try {
      const data = await apiGet<BackendUser[]>('/api/auth/linked-accounts');
      const linked: AccountInfo[] = (Array.isArray(data) ? data : []).map(u => ({
        id:    u.id,
        role:  mapRole(u.roles?.[0] ?? '') as AccountRole,
        name:  u.displayName || `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || '',
        email: u.email,
      }));

      // Ensure the current user is always in the list
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

      // The reliable source for the user's real name is either the
      // main account's stored profile or the auth store — NOT the
      // backend's linked-accounts list which has placeholder data.
      const mainId = get().mainAccountId;
      const mainProfile = mainId ? get().profilesByAccount[mainId] : null;
      const realName = mainProfile
        ? (mainProfile.displayName || `${mainProfile.firstName} ${mainProfile.lastName}`.trim())
        : (currentUser?.displayName || currentUser?.name || '');
      const realEmail = currentUser?.email || '';

      // Apply the real name/email to ALL accounts (main + linked)
      for (const acc of linked) {
        if (!acc.name || acc.name === 'Linked Account' || acc.name === 'User') {
          acc.name = realName || acc.name || 'User';
        }
        if (!acc.email || acc.email.includes('@internal')) {
          acc.email = realEmail || acc.email;
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

  fetchAgentProfile: async () => {
    if (!USE_API) return;
    const currentRole = useAuthStore.getState().user?.role;
    if (currentRole !== 'Agent') return;
    try {
      type AgentUser = BackendUser & { bio?: string; phoneNumber?: string; linkedinUrl?: string; facebookUrl?: string; instagramUrl?: string; twitterUrl?: string };
      const data = await apiGet<{ user?: AgentUser }>('/api/agents/profile');
      const u = (data.user ?? data) as AgentUser;
      if (!u?.firstName && !u?.displayName) return;
      const phone = (u.phoneNumber ?? '').replace(/^\+234/, '');
      const fetched: UserProfilePayload = {
        firstName:   u.firstName ?? '',
        lastName:    u.lastName  ?? '',
        displayName: u.displayName ?? '',
        phone,
        phoneCode:   '+234',
        about:       u.bio ?? '',
        socials: {
          linkedin:  u.linkedinUrl  ?? '',
          facebook:  u.facebookUrl  ?? '',
          instagram: u.instagramUrl ?? '',
          twitter:   u.twitterUrl   ?? '',
        },
      };
      const activeId = get().activeAccount.id;
      set({
        profile: fetched,
        profilesByAccount: { ...get().profilesByAccount, [activeId]: fetched },
      });
    } catch {
      // Non-critical — keep existing profile data
    }
  },

  getPublicAgentProfile: async (agentId) => {
    if (!USE_API) return null;
    try {
      type AgentUser = BackendUser & { bio?: string; linkedinUrl?: string; facebookUrl?: string; instagramUrl?: string; twitterUrl?: string };
      const data = await apiGet<{ user?: AgentUser }>(`/api/agents/${agentId}/profile`);
      const u = (data.user ?? data) as AgentUser;
      if (!u?.id) return null;
      const name = `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.displayName || 'Agent';
      return {
        id:          u.id,
        name,
        displayName: u.displayName || name,
        avatarUrl:   u.avatarUrl ?? '/images/demo-avatar.jpg',
        bio:         u.bio ?? '',
        kycStatus:   mapKycStatus(u.verificationStatus ?? ''),
        socials: {
          linkedin:  u.linkedinUrl  ?? '',
          facebook:  u.facebookUrl  ?? '',
          instagram: u.instagramUrl ?? '',
          twitter:   u.twitterUrl   ?? '',
        },
      } satisfies PublicAgentProfile;
    } catch {
      return null;
    }
  },

  resetUserData: () => {
    set({
      mainAccountId: '',
      mainToken: null,
      accounts: USE_API ? [] : MOCK_ACCOUNTS,
      activeAccount: USE_API ? { id: '', role: 'Agent' as AccountRole, name: '', email: '' } : MOCK_ACCOUNTS[0],
      profilesByAccount: USE_API ? {} : { ...MOCK_ACCOUNT_PROFILES },
      profile: USE_API
        ? { firstName: '', lastName: '', displayName: '', phone: '', phoneCode: '+234', about: '', socials: { linkedin: '', facebook: '', instagram: '', twitter: '' } }
        : MOCK_ACCOUNT_PROFILES['demo-admin'],
      isAddAccountModalOpen: false,
    });
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
        // Save payout bank details via Paystack recipient endpoint
        const p = get().payout;
        if (p.activeMethod === 'Bank') {
          await apiPost('/api/paystack/transfer/recipient', p.bank);
        }
        // Crypto payout endpoint not yet available — save locally only
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
        // Security/PIN endpoint not yet available — save locally only
        await new Promise(r => setTimeout(r, 600));
        set({ error: 'Security settings will be available in an upcoming update.', isSaving: false });
        return;
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
        // Help ticket endpoint not yet available — save locally only
        await new Promise(r => setTimeout(r, 600));
        set({ isSaving: false, helpTicket: defaultHelpTicket });
        return;
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
        // Commission endpoint not yet available — save locally only
        await new Promise(r => setTimeout(r, 600));
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
        // Diaspora FX endpoint not yet available — save locally only
        await new Promise(r => setTimeout(r, 600));
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
        // Landlord lease endpoint not yet available — save locally only
        await new Promise(r => setTimeout(r, 600));
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
        // Developer project endpoint not yet available — save locally only
        await new Promise(r => setTimeout(r, 600));
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
