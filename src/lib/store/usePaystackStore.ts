/**
 * usePaystackStore
 *
 * Fetches and caches the list of Nigerian banks from Paystack via the backend.
 * Used by the wallet payout form, KYC payment step, and anywhere bank selection is needed.
 */
import { create } from 'zustand';
import { apiGet } from '@/lib/api/client';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

export interface PaystackBank {
  name: string;
  code: string;
  slug?: string;
}

interface BackendBank {
  name: string;
  code: string;
  slug?: string;
  active?: boolean;
}

interface PaystackStore {
  banks: PaystackBank[];
  isLoadingBanks: boolean;

  fetchBanks: () => Promise<void>;
  resolveBankAccount: (accountNumber: string, bankCode: string) => Promise<string | null>;
}

export const usePaystackStore = create<PaystackStore>((set) => ({
  banks: [],
  isLoadingBanks: false,

  fetchBanks: async () => {
    if (!USE_API) return;
    set({ isLoadingBanks: true });
    try {
      const raw = await apiGet<BackendBank[] | { data?: BackendBank[] }>('/api/paystack/banks');
      const list: BackendBank[] = Array.isArray(raw)
        ? raw
        : Array.isArray((raw as { data?: BackendBank[] }).data)
          ? (raw as { data: BackendBank[] }).data
          : [];
      const banks: PaystackBank[] = list
        .filter(b => b.active !== false)
        .map(b => ({ name: b.name, code: b.code, slug: b.slug }))
        .sort((a, b) => a.name.localeCompare(b.name));
      set({ banks, isLoadingBanks: false });
    } catch {
      set({ isLoadingBanks: false });
    }
  },

  resolveBankAccount: async (accountNumber, bankCode) => {
    if (!USE_API) return null;
    try {
      const raw = await apiGet<{ accountName?: string; account_name?: string }>(
        `/api/paystack/banks/resolve?accountNumber=${accountNumber}&bankCode=${bankCode}`
      );
      return raw.accountName ?? raw.account_name ?? null;
    } catch {
      return null;
    }
  },
}));
