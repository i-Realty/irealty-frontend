import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { apiGet, apiPost, apiPut } from '@/lib/api/client';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

export type WalletTransaction = {
  id: string;
  type: 'Deposit' | 'Withdrawal' | 'Credit' | 'Debit' | 'Refund';
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  date: string;
  description?: string;
  sourceTransactionId?: string;
};

/** @deprecated use WalletTransaction */
export type Transaction = WalletTransaction;

export type BankDetailsPayload = {
  bankName: string;
  accountName: string;
  accountNumber: string;
};

export type WithdrawalMethod = 'Fiat' | 'Crypto';

export type ModalType = 'deposit' | 'withdraw' | 'changeMethod' | 'editBank' | 'withdrawSuccess' | null;

export interface PayoutRequest {
  id: string;
  amount: number;
  method: WithdrawalMethod;
  bankDetails?: BankDetailsPayload;
  cryptoDetails?: { network: string; address: string };
  status: 'Pending' | 'Approved' | 'Rejected' | 'Processing';
  requestedAt: string;
  processedAt?: string;
}

interface WalletStore {
  walletBalance: number;
  escrowBalance: number;

  transactions: WalletTransaction[];
  isLoadingLedger: boolean;
  isProcessingAction: boolean;
  error: string | null;

  currentWithdrawMethod: WithdrawalMethod;
  fiatDetails: BankDetailsPayload;
  cryptoDetails: { network: string; address: string };

  payoutRequests: PayoutRequest[];

  activeModal: ModalType;
  setActiveModal: (modal: ModalType) => void;
  setWithdrawMethod: (method: WithdrawalMethod) => void;

  fetchLedger: () => Promise<void>;
  processWithdrawal: (amount: number) => Promise<void>;
  updateFiatDetails: (details: BankDetailsPayload) => Promise<void>;

  /** @deprecated Use fetchLedger() */
  fetchLedgerMock: () => Promise<void>;
  /** @deprecated Use processWithdrawal() */
  processWithdrawalMock: (amount: number) => Promise<void>;
  /** @deprecated Use updateFiatDetails() */
  updateFiatDetailsMock: (details: BankDetailsPayload) => Promise<void>;

  /** Credit wallet after escrow release or payment received */
  credit: (amount: number, sourceTransactionId: string, description: string) => void;
  /** Debit wallet when seeker pays */
  debit: (amount: number, sourceTransactionId: string, description: string) => void;
  /** Request a payout (agent/developer/landlord action) */
  requestPayout: (amount: number, method: WithdrawalMethod) => PayoutRequest;
  /** Admin approves payout */
  approvePayout: (payoutId: string) => void;
  /** Admin rejects payout */
  rejectPayout: (payoutId: string) => void;

  getPendingPayouts: () => PayoutRequest[];
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      walletBalance: 25000000.00,
      escrowBalance: 0.00,

      transactions: [],
      isLoadingLedger: false,
      isProcessingAction: false,
      error: null,

      currentWithdrawMethod: 'Fiat',
      fiatDetails: {
        bankName: 'Zenith bank',
        accountName: 'Oyakhilome Einstein Godstime',
        accountNumber: '22242356712',
      },
      cryptoDetails: {
        network: 'USDT',
        address: '0XYJFHD....34HSAVS',
      },

      payoutRequests: [],

      activeModal: null,
      setActiveModal: (modal) => set({ activeModal: modal }),
      setWithdrawMethod: (method) => set({ currentWithdrawMethod: method }),

      fetchLedger: async () => {
        set({ isLoadingLedger: true, error: null });
        try {
          if (USE_API) {
            // Balance returned in kobo — divide by 100 for naira display
            const data = await apiGet<{ availableBalance: number; escrowBalance: number }>('/api/wallet/balance');
            set({
              walletBalance: (data.availableBalance ?? 0) / 100,
              escrowBalance: (data.escrowBalance ?? 0) / 100,
              isLoadingLedger: false,
            });
          } else {
            await new Promise((resolve) => setTimeout(resolve, 800));
            const { transactions } = get();
            if (transactions.length === 0) {
              set({
                transactions: [
                  { id: 'tx1', type: 'Deposit', amount: 24000, status: 'Completed', date: '15 Dec, 2023' },
                  { id: 'tx2', type: 'Deposit', amount: 24000, status: 'Completed', date: '15 Dec, 2023' },
                  { id: 'tx3', type: 'Withdrawal', amount: 24000, status: 'Pending', date: '15 Dec, 2023' },
                  { id: 'tx4', type: 'Withdrawal', amount: 24000, status: 'Pending', date: '15 Dec, 2023' },
                  { id: 'tx5', type: 'Withdrawal', amount: 24000, status: 'Pending', date: '15 Dec, 2023' },
                ],
                isLoadingLedger: false,
              });
            } else {
              set({ isLoadingLedger: false });
            }
          }
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to load ledger', isLoadingLedger: false });
        }
      },

      processWithdrawal: async (amount: number) => {
        // Guard: never allow overdraft regardless of how the call was triggered
        if (amount > get().walletBalance) {
          set({ error: 'Insufficient wallet balance' });
          return;
        }
        set({ isProcessingAction: true, error: null });
        try {
          if (USE_API) {
            const { currentWithdrawMethod, fiatDetails, cryptoDetails } = get();
            // Amount sent in kobo (smallest NGN unit)
            await apiPost('/api/paystack/withdraw', {
              amount: Math.round(amount * 100),
              method: currentWithdrawMethod,
              ...(currentWithdrawMethod === 'Fiat' ? { bankDetails: fiatDetails } : { cryptoDetails }),
            });
          } else {
            await new Promise((resolve) => setTimeout(resolve, 1500));
          }
          // Deduct balance and log the transaction regardless of mock/API mode
          const entry: WalletTransaction = {
            id: `wdraw_${Date.now()}`,
            type: 'Withdrawal',
            amount,
            status: 'Pending', // bank/crypto transfer takes up to 48 h
            date: new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }),
            description: `Withdrawal via ${get().currentWithdrawMethod}`,
          };
          set((s) => ({
            walletBalance: Math.max(0, s.walletBalance - amount),
            transactions: [entry, ...s.transactions],
            isProcessingAction: false,
            activeModal: 'withdrawSuccess',
          }));
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Withdrawal failed', isProcessingAction: false });
        }
      },

      updateFiatDetails: async (details: BankDetailsPayload) => {
        set({ isProcessingAction: true, error: null });
        try {
          if (USE_API) {
            // Register bank account as a Paystack transfer recipient
            await apiPost('/api/paystack/transfer/recipient', details);
          } else {
            await new Promise((resolve) => setTimeout(resolve, 600));
          }
          set({ fiatDetails: details, isProcessingAction: false, activeModal: 'withdraw' });
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Update failed', isProcessingAction: false });
        }
      },

      // Backward-compatible aliases
      fetchLedgerMock: async () => get().fetchLedger(),
      processWithdrawalMock: async (amount) => get().processWithdrawal(amount),
      updateFiatDetailsMock: async (details) => get().updateFiatDetails(details),

      credit: (amount, sourceTransactionId, description) => {
        const entry: WalletTransaction = {
          id: `wcredit_${Date.now()}`,
          type: 'Credit',
          amount,
          status: 'Completed',
          date: new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }),
          description,
          sourceTransactionId,
        };
        set((s) => ({
          walletBalance: s.walletBalance + amount,
          transactions: [entry, ...s.transactions],
        }));
      },

      debit: (amount, sourceTransactionId, description) => {
        const entry: WalletTransaction = {
          id: `wdebit_${Date.now()}`,
          type: 'Debit',
          amount,
          status: 'Completed',
          date: new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }),
          description,
          sourceTransactionId,
        };
        set((s) => ({
          walletBalance: Math.max(0, s.walletBalance - amount),
          transactions: [entry, ...s.transactions],
        }));
      },

      requestPayout: (amount, method) => {
        const request: PayoutRequest = {
          id: `PAY_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          amount,
          method,
          bankDetails: method === 'Fiat' ? get().fiatDetails : undefined,
          cryptoDetails: method === 'Crypto' ? get().cryptoDetails : undefined,
          status: 'Pending',
          requestedAt: new Date().toISOString(),
        };
        set((s) => ({ payoutRequests: [request, ...s.payoutRequests] }));
        return request;
      },

      approvePayout: (payoutId) => {
        const request = get().payoutRequests.find((p) => p.id === payoutId);
        if (!request) return;
        set((s) => ({
          walletBalance: Math.max(0, s.walletBalance - request.amount),
          payoutRequests: s.payoutRequests.map((p) =>
            p.id === payoutId ? { ...p, status: 'Approved' as const, processedAt: new Date().toISOString() } : p
          ),
          transactions: [
            {
              id: `wpayout_${Date.now()}`,
              type: 'Withdrawal' as const,
              amount: request.amount,
              status: 'Completed' as const,
              date: new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }),
              description: `Payout approved — ${request.method}`,
            },
            ...s.transactions,
          ],
        }));
      },

      rejectPayout: (payoutId) => {
        set((s) => ({
          payoutRequests: s.payoutRequests.map((p) =>
            p.id === payoutId ? { ...p, status: 'Rejected' as const, processedAt: new Date().toISOString() } : p
          ),
        }));
      },

      getPendingPayouts: () =>
        get().payoutRequests.filter((p) => p.status === 'Pending'),
    }),
    {
      name: 'irealty-wallet',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
