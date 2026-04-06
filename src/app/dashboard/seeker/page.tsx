'use client';

import { useEffect } from 'react';
import { useSeekerDashboardStore } from '@/lib/store/useSeekerDashboardStore';
import { useSeekerTransactionsStore } from '@/lib/store/useSeekerTransactionsStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import SeekerStats from '@/components/dashboard/seeker/SeekerStats';
import SeekerRecentTransactions from '@/components/dashboard/seeker/SeekerRecentTransactions';

export default function SeekerDashboardPage() {
  const { fetchDashboardDataMock, isLoading } = useSeekerDashboardStore();
  const fetchTransactionsMock = useSeekerTransactionsStore((s) => s.fetchTransactionsMock);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    fetchDashboardDataMock();
    fetchTransactionsMock();
  }, [fetchDashboardDataMock, fetchTransactionsMock]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.displayName ?? 'Waden'}!
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your property investments and escrow transactions securely
        </p>
      </div>

      {/* Stats */}
      <SeekerStats />

      {/* Recent Transactions */}
      <SeekerRecentTransactions />
    </div>
  );
}
