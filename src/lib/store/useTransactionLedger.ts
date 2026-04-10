/**
 * useTransactionLedger — Central financial ledger for the entire platform.
 *
 * All money movement passes through this store regardless of role.
 * Role-specific stores (Seeker, Agent, Developer, Landlord) are views on this ledger
 * filtered by payerId or payeeId.
 *
 * Lifecycle:  pending → in_escrow → released | refunded | failed
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useNotificationStore } from './useNotificationStore';
import { useWalletStore } from './useWalletStore';

export type LedgerEntryType =
  | 'inspection'
  | 'rent'
  | 'deposit'
  | 'sale'
  | 'milestone'
  | 'service'
  | 'fee'
  | 'refund';

export type LedgerEntryStatus =
  | 'pending'
  | 'in_escrow'
  | 'released'
  | 'refunded'
  | 'failed';

export interface LedgerEntry {
  id: string;
  type: LedgerEntryType;
  status: LedgerEntryStatus;

  // Parties
  payerId: string;
  payerName: string;
  payeeId: string;
  payeeName: string;

  // Amounts
  amount: number;
  platformFee: number;
  netAmount: number;

  // Context
  propertyId: string;
  propertyTitle: string;
  bookingId?: string;
  milestoneId?: string;
  notes?: string;

  createdAt: string;
  settledAt?: string;
}

interface TransactionLedgerState {
  entries: LedgerEntry[];

  // Core actions
  createEntry: (data: Omit<LedgerEntry, 'id' | 'createdAt'>) => LedgerEntry;
  moveToEscrow: (id: string) => void;
  releaseEscrow: (id: string) => void;
  refundEntry: (id: string) => void;
  failEntry: (id: string) => void;

  // Selectors
  getByPayer: (payerId: string) => LedgerEntry[];
  getByPayee: (payeeId: string) => LedgerEntry[];
  getByProperty: (propertyId: string) => LedgerEntry[];
  getByBooking: (bookingId: string) => LedgerEntry[];
  getEscrowEntries: () => LedgerEntry[];
  getById: (id: string) => LedgerEntry | undefined;

  // Seed mock data so admin has something to show
  seedIfEmpty: () => void;
}

const SEED_ENTRIES: LedgerEntry[] = [
  {
    id: 'TXN-A001',
    type: 'inspection',
    status: 'released',
    payerId: 'USR-002',
    payerName: 'Marcus Bell',
    payeeId: 'USR-001',
    payeeName: 'Sarah Homes',
    amount: 25000,
    platformFee: 2500,
    netAmount: 22500,
    propertyId: 'prop_seed_001',
    propertyTitle: '3-Bed Duplex, Lekki Phase 1',
    createdAt: '2025-08-28T10:00:00Z',
    settledAt: '2025-08-28T14:00:00Z',
  },
  {
    id: 'TXN-A002',
    type: 'sale',
    status: 'in_escrow',
    payerId: 'USR-011',
    payerName: 'Obinna Eze',
    payeeId: 'USR-001',
    payeeName: 'Sarah Homes',
    amount: 45000000,
    platformFee: 1125000,
    netAmount: 43875000,
    propertyId: 'prop_seed_001',
    propertyTitle: '3-Bed Duplex, Lekki Phase 1',
    createdAt: '2025-08-27T10:00:00Z',
  },
  {
    id: 'TXN-A003',
    type: 'milestone',
    status: 'released',
    payerId: 'USR-007',
    payerName: 'Chidi Okeke',
    payeeId: 'USR-003',
    payeeName: 'Amara Osei',
    amount: 18000000,
    platformFee: 540000,
    netAmount: 17460000,
    propertyId: 'prop_seed_003',
    propertyTitle: 'Asokoro Villas Phase 2',
    milestoneId: 'milestone_1',
    createdAt: '2025-08-25T10:00:00Z',
    settledAt: '2025-09-10T12:00:00Z',
  },
  {
    id: 'TXN-A004',
    type: 'service',
    status: 'in_escrow',
    payerId: 'USR-004',
    payerName: 'Ngozi Adeyemi',
    payeeId: 'USR-001',
    payeeName: 'Sarah Homes',
    amount: 625000,
    platformFee: 625000,
    netAmount: 0,
    propertyId: 'prop_seed_001',
    propertyTitle: 'Diaspora Premium Plan',
    createdAt: '2025-08-24T10:00:00Z',
  },
  {
    id: 'TXN-A005',
    type: 'rent',
    status: 'released',
    payerId: 'USR-002',
    payerName: 'Marcus Bell',
    payeeId: 'USR-012',
    payeeName: 'Kemi Afolabi',
    amount: 3500000,
    platformFee: 87500,
    netAmount: 3412500,
    propertyId: 'prop_seed_004',
    propertyTitle: '2-Bedroom Apartment, Victoria Island',
    createdAt: '2025-08-22T10:00:00Z',
    settledAt: '2025-08-25T14:00:00Z',
  },
];

export const useTransactionLedger = create<TransactionLedgerState>()(
  persist(
    (set, get) => ({
      entries: [],

      createEntry: (data) => {
        const entry: LedgerEntry = {
          ...data,
          id: `TXN_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ entries: [entry, ...s.entries] }));
        return entry;
      },

      moveToEscrow: (id) => {
        set((s) => ({
          entries: s.entries.map((e) =>
            e.id === id ? { ...e, status: 'in_escrow' as LedgerEntryStatus } : e
          ),
        }));
      },

      releaseEscrow: (id) => {
        const entry = get().entries.find((e) => e.id === id);
        if (!entry) return;

        const now = new Date().toISOString();
        set((s) => ({
          entries: s.entries.map((e) =>
            e.id === id ? { ...e, status: 'released' as LedgerEntryStatus, settledAt: now } : e
          ),
        }));

        // Credit payee wallet
        useWalletStore.getState().credit(entry.netAmount, id, `Payment from ${entry.payerName}`);

        // Notify payee
        useNotificationStore.getState().emit(
          'payment',
          'Payment released to your wallet',
          `₦${entry.netAmount.toLocaleString()} from "${entry.propertyTitle}" has been credited to your wallet.`,
          '/dashboard/agent/wallet'
        );

        // Notify payer
        useNotificationStore.getState().emit(
          'payment',
          'Escrow payment released',
          `Your escrow payment for "${entry.propertyTitle}" has been released to the seller.`,
          '/dashboard/seeker/transactions'
        );
      },

      refundEntry: (id) => {
        const entry = get().entries.find((e) => e.id === id);
        if (!entry) return;

        const now = new Date().toISOString();
        set((s) => ({
          entries: s.entries.map((e) =>
            e.id === id ? { ...e, status: 'refunded' as LedgerEntryStatus, settledAt: now } : e
          ),
        }));

        // Refund payer wallet
        useWalletStore.getState().credit(entry.amount, id, `Refund: ${entry.propertyTitle}`);

        useNotificationStore.getState().emit(
          'payment',
          'Refund processed',
          `₦${entry.amount.toLocaleString()} for "${entry.propertyTitle}" has been refunded to your wallet.`,
          '/dashboard/seeker/wallet'
        );
      },

      failEntry: (id) => {
        set((s) => ({
          entries: s.entries.map((e) =>
            e.id === id ? { ...e, status: 'failed' as LedgerEntryStatus } : e
          ),
        }));
      },

      getByPayer: (payerId) =>
        get().entries.filter((e) => e.payerId === payerId),

      getByPayee: (payeeId) =>
        get().entries.filter((e) => e.payeeId === payeeId),

      getByProperty: (propertyId) =>
        get().entries.filter((e) => e.propertyId === propertyId),

      getByBooking: (bookingId) =>
        get().entries.filter((e) => e.bookingId === bookingId),

      getEscrowEntries: () =>
        get().entries.filter((e) => e.status === 'in_escrow'),

      getById: (id) =>
        get().entries.find((e) => e.id === id),

      seedIfEmpty: () => {
        if (get().entries.length === 0) {
          set({ entries: SEED_ENTRIES });
        }
      },
    }),
    {
      name: 'irealty-transaction-ledger',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
