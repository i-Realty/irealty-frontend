'use client';

import { useEffect } from 'react';
import { useWalletStore } from '@/lib/store/useWalletStore';
import WalletOverviewCard from '@/components/dashboard/agent/wallet/WalletOverviewCard';
import TransactionHistory from '@/components/dashboard/agent/wallet/TransactionHistory';

// Modals
import FundDepositModal from '@/components/dashboard/agent/wallet/modals/FundDepositModal';
import WithdrawModal from '@/components/dashboard/agent/wallet/modals/WithdrawModal';
import ChangeWithdrawMethodModal from '@/components/dashboard/agent/wallet/modals/ChangeWithdrawMethodModal';
import EditBankDetailsModal from '@/components/dashboard/agent/wallet/modals/EditBankDetailsModal';
import WithdrawSuccessModal from '@/components/dashboard/agent/wallet/modals/WithdrawSuccessModal';

export default function WalletPage() {
  const { fetchLedgerMock, activeModal } = useWalletStore();

  useEffect(() => {
    // Fetch ledger strictly once on mount
    fetchLedgerMock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-8 bg-gray-50/20 md:bg-white overflow-y-auto no-scrollbar relative min-h-full">
      
      {/* Upper Metrics Dashboard */}
      <WalletOverviewCard />

      {/* Lower Searchable Ledger */}
      <TransactionHistory />

      {/* Global Modal Controller */}
      {activeModal === 'deposit' && <FundDepositModal />}
      {activeModal === 'withdraw' && <WithdrawModal />}
      {activeModal === 'changeMethod' && <ChangeWithdrawMethodModal />}
      {activeModal === 'editBank' && <EditBankDetailsModal />}
      {activeModal === 'withdrawSuccess' && <WithdrawSuccessModal />}

    </div>
  );
}
