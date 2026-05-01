import { create } from 'zustand';
import { apiGet, apiPost, apiDelete } from '@/lib/api/client';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MandateStatus = 'PENDING' | 'CREATED' | 'ACTIVE' | 'DEACTIVATED' | 'FAILED';

export interface DirectDebitMandate {
  id: string;
  reference: string;
  status: MandateStatus;
  bank: string;
  last4: string;
  accountName: string;
  authorizationCode?: string;
  customerCode?: string;
  activatedAt?: string;
  redirectUrl?: string;
}

export interface InitializeMandatePayload {
  callbackUrl?: string;
  account?: { number: string; bankCode: string };
  address?: { state: string; city: string; street: string };
}

// ---------------------------------------------------------------------------
// Store interface
// ---------------------------------------------------------------------------

interface DirectDebitStore {
  mandates: DirectDebitMandate[];
  isLoading: boolean;
  isActionLoading: boolean;
  error: string | null;

  fetchMandates: () => Promise<void>;
  initializeMandate: (data?: InitializeMandatePayload) => Promise<{ redirectUrl?: string } | null>;
  verifyMandate: (reference: string) => Promise<DirectDebitMandate | null>;
  retryActivation: (id: string) => Promise<void>;
  deactivateMandate: (id: string) => Promise<void>;
}

// ---------------------------------------------------------------------------
// Adapter
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapMandate(m: Record<string, any>): DirectDebitMandate {
  return {
    id:                m.id ?? '',
    reference:         m.reference ?? '',
    status:            m.status ?? 'PENDING',
    bank:              m.bank ?? '',
    last4:             m.last4 ?? '',
    accountName:       m.accountName ?? m.account_name ?? '',
    authorizationCode: m.authorizationCode,
    customerCode:      m.customerCode,
    activatedAt:       m.activatedAt,
    redirectUrl:       m.redirectUrl ?? m.redirect_url,
  };
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useDirectDebitStore = create<DirectDebitStore>((set, get) => ({
  mandates: [],
  isLoading: false,
  isActionLoading: false,
  error: null,

  fetchMandates: async () => {
    set({ isLoading: true, error: null });
    try {
      if (USE_API) {
        const raw = await apiGet<unknown>('/api/direct-debit/mandates');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const list: any[] = Array.isArray(raw) ? raw : (raw as any)?.items ?? (raw as any)?.mandates ?? [];
        set({ mandates: list.map(mapMandate), isLoading: false });
      } else {
        await new Promise(r => setTimeout(r, 500));
        set({ isLoading: false });
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load mandates', isLoading: false });
    }
  },

  initializeMandate: async (data = {}) => {
    set({ isActionLoading: true, error: null });
    try {
      if (USE_API) {
        const res = await apiPost<Record<string, unknown>>('/api/direct-debit/mandates/initialize', data);
        set({ isActionLoading: false });
        return { redirectUrl: String(res.redirectUrl ?? res.redirect_url ?? res.authorizationUrl ?? '') };
      }
      await new Promise(r => setTimeout(r, 800));
      set({ isActionLoading: false });
      return { redirectUrl: '' };
    } catch (err) {
      set({ isActionLoading: false, error: err instanceof Error ? err.message : 'Failed to initialize mandate' });
      return null;
    }
  },

  verifyMandate: async (reference) => {
    try {
      if (!USE_API) return null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw = await apiGet<Record<string, any>>(`/api/direct-debit/mandates/verify/${reference}`);
      const mandate = mapMandate(raw);
      // Update in local list if present, otherwise prepend
      set(s => ({
        mandates: s.mandates.some(m => m.reference === reference)
          ? s.mandates.map(m => m.reference === reference ? mandate : m)
          : [mandate, ...s.mandates],
      }));
      return mandate;
    } catch {
      return null;
    }
  },

  retryActivation: async (id) => {
    set({ isActionLoading: true });
    try {
      if (USE_API) await apiPost(`/api/direct-debit/mandates/${id}/retry-activation`);
      else await new Promise(r => setTimeout(r, 600));
      set({ isActionLoading: false });
      get().fetchMandates();
    } catch (err) {
      set({ isActionLoading: false, error: err instanceof Error ? err.message : 'Retry failed' });
    }
  },

  deactivateMandate: async (id) => {
    set({ isActionLoading: true });
    try {
      if (USE_API) await apiDelete(`/api/direct-debit/mandates/${id}`);
      else await new Promise(r => setTimeout(r, 600));
      set(s => ({
        mandates: s.mandates.map(m => m.id === id ? { ...m, status: 'DEACTIVATED' as MandateStatus } : m),
        isActionLoading: false,
      }));
    } catch (err) {
      set({ isActionLoading: false, error: err instanceof Error ? err.message : 'Failed to deactivate' });
    }
  },
}));
