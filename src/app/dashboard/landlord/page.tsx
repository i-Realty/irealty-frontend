'use client';

import { useEffect } from 'react';
import { useLandlordDashboardStore } from '@/lib/store/useLandlordDashboardStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import LandlordStats from '@/components/dashboard/landlord/LandlordStats';
import LandlordRecentTransactions from '@/components/dashboard/landlord/LandlordRecentTransactions';

export default function LandlordDashboardPage() {
  const { fetchDashboardDataMock, fetchTransactionsMock, isLoading } = useLandlordDashboardStore();
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
          Welcome back, {user?.displayName ?? 'Landlord'}!
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your rental properties, track income, and oversee tenant activities
        </p>
      </div>

      {/* Stats */}
      <LandlordStats />

      {/* Recent Transactions */}
      <LandlordRecentTransactions />
    </div>
  );
}
