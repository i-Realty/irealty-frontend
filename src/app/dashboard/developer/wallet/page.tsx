'use client';

import { useEffect } from 'react';
import { useWalletStore } from '@/lib/store/useWalletStore';
import WalletOverviewCard from '@/components/dashboard/agent/wallet/WalletOverviewCard';
import TransactionHistory from '@/components/dashboard/agent/wallet/TransactionHistory';
import DirectDebitMandates from '@/components/dashboard/agent/wallet/DirectDebitMandates';
import FundDepositModal from '@/components/dashboard/agent/wallet/modals/FundDepositModal';
import WithdrawModal from '@/components/dashboard/agent/wallet/modals/WithdrawModal';
import ChangeWithdrawMethodModal from '@/components/dashboard/agent/wallet/modals/ChangeWithdrawMethodModal';
import EditBankDetailsModal from '@/components/dashboard/agent/wallet/modals/EditBankDetailsModal';
import WithdrawSuccessModal from '@/components/dashboard/agent/wallet/modals/WithdrawSuccessModal';

export default function DeveloperWalletPage() {
  const { fetchLedgerMock, activeModal } = useWalletStore();

  useEffect(() => {
    fetchLedgerMock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-8 bg-gray-50/20 md:bg-white overflow-y-auto no-scrollbar relative min-h-full">
      <WalletOverviewCard />
      <TransactionHistory />

      {/* Direct Debit Mandates */}
      <DirectDebitMandates />
      {activeModal === 'deposit'        && <FundDepositModal />}
      {activeModal === 'withdraw'       && <WithdrawModal />}
      {activeModal === 'changeMethod'   && <ChangeWithdrawMethodModal />}
      {activeModal === 'editBank'       && <EditBankDetailsModal />}
      {activeModal === 'withdrawSuccess' && <WithdrawSuccessModal />}
    </div>
  );
}
