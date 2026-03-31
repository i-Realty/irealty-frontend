import { create } from 'zustand';

export type Transaction = {
  id: string;
  type: 'Deposit' | 'Withdrawal';
  amount: number;
  status: 'Completed' | 'Pending';
  date: string; // ISO String or exactly formatted per mockup e.g., "15 Dec, 2023"
};

export type BankDetailsPayload = {
  bankName: string;
  accountName: string;
  accountNumber: string;
};

export type WithdrawalMethod = 'Fiat' | 'Crypto';

export type ModalType = 'deposit' | 'withdraw' | 'changeMethod' | 'editBank' | 'withdrawSuccess' | null;

interface WalletStore {
  // Wallet Balances
  walletBalance: number;
  escrowBalance: number;
  
  // Transactions Ledger
  transactions: Transaction[];
  isLoadingLedger: boolean;
  isProcessingAction: boolean;
  error: string | null;

  // Active Payout Target Info
  currentWithdrawMethod: WithdrawalMethod;
  fiatDetails: BankDetailsPayload;
  cryptoDetails: { network: string; address: string };

  // Modals & Navigation
  activeModal: ModalType;
  setActiveModal: (modal: ModalType) => void;

  // Mock API Triggers
  fetchLedgerMock: () => Promise<void>;
  processWithdrawalMock: (amount: number) => Promise<void>;
  updateFiatDetailsMock: (details: BankDetailsPayload) => Promise<void>;
  setWithdrawMethod: (method: WithdrawalMethod) => void;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  // Seed Mockup Base Balances
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

  activeModal: null,
  setActiveModal: (modal) => set({ activeModal: modal }),
  setWithdrawMethod: (method) => set({ currentWithdrawMethod: method }),

  fetchLedgerMock: async () => {
    set({ isLoadingLedger: true, error: null });
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Seed Mockup Transactions exactly as shown
    const mockLedger: Transaction[] = [
      { id: 'tx1', type: 'Deposit', amount: 24000.00, status: 'Completed', date: '15 Dec, 2023' },
      { id: 'tx2', type: 'Deposit', amount: 24000.00, status: 'Completed', date: '15 Dec, 2023' },
      { id: 'tx3', type: 'Withdrawal', amount: 24000.00, status: 'Pending', date: '15 Dec, 2023' },
      { id: 'tx4', type: 'Withdrawal', amount: 24000.00, status: 'Pending', date: '15 Dec, 2023' },
      { id: 'tx5', type: 'Withdrawal', amount: 24000.00, status: 'Pending', date: '15 Dec, 2023' },
    ];
    set({ transactions: mockLedger, isLoadingLedger: false });
  },

  processWithdrawalMock: async (amount: number) => {
    set({ isProcessingAction: true, error: null });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    set({ isProcessingAction: false, activeModal: 'withdrawSuccess' });
  },

  updateFiatDetailsMock: async (details: BankDetailsPayload) => {
    set({ isProcessingAction: true, error: null });
    await new Promise((resolve) => setTimeout(resolve, 600));
    set({ fiatDetails: details, isProcessingAction: false, activeModal: 'withdraw' }); 
    // Go "Back" to main withdraw modal after edit
  }
}));
