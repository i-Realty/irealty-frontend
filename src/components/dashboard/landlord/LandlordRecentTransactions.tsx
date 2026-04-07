'use client';

import Link from 'next/link';
import { ArrowRightLeft, Eye } from 'lucide-react';
import { useLandlordDashboardStore, LandlordTransactionStatus } from '@/lib/store/useLandlordDashboardStore';

const RECENT_LIMIT = 5;

function formatNGN(amount: number) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 })
    .format(amount)
    .replace('NGN', '\u20A6');
}

export default function LandlordRecentTransactions() {
  const { transactions } = useLandlordDashboardStore();
  const recent = transactions.slice(0, RECENT_LIMIT);

  if (recent.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-8 flex flex-col items-center justify-center min-h-[300px] shadow-sm mt-6">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <ArrowRightLeft className="w-8 h-8 text-blue-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Recent Transaction Yet!</h3>
        <p className="text-gray-500 text-sm">All recent transactions will be displayed here</p>
      </div>
    );
  }

  const getStatusStyle = (status: LandlordTransactionStatus) => {
    switch (status) {
      case 'Pending':   return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'Completed': return 'bg-green-50 text-green-600 border border-green-100';
      case 'Failed':    return 'bg-red-50 text-red-600 border border-red-100';
      default:          return 'bg-gray-50 text-gray-600 border border-gray-100';
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl mt-6 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
        <Link
          href="/dashboard/landlord/transactions"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          View all
        </Link>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 font-medium">
              <th className="py-4 px-6 font-medium">Transaction ID</th>
              <th className="py-4 px-6 font-medium">Date</th>
              <th className="py-4 px-6 font-medium">Property</th>
              <th className="py-4 px-6 font-medium">Tenant</th>
              <th className="py-4 px-6 font-medium">Amount</th>
              <th className="py-4 px-6 font-medium">Type</th>
              <th className="py-4 px-6 font-medium">Status</th>
              <th className="py-4 px-6 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {recent.map((tx) => (
              <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 text-gray-900 font-medium">{tx.id}</td>
                <td className="py-4 px-6 text-gray-600">{tx.date}</td>
                <td className="py-4 px-6 text-gray-900 font-medium">{tx.propertyName}</td>
                <td className="py-4 px-6 text-gray-600">{tx.tenantName}</td>
                <td className="py-4 px-6 text-gray-900 font-bold">{formatNGN(tx.amount)}</td>
                <td className="py-4 px-6 text-gray-600">{tx.type}</td>
                <td className="py-4 px-6">
                  <span className={`text-xs py-1 px-3 rounded-md font-medium ${getStatusStyle(tx.status)}`}>
                    {tx.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <Link
                    href={`/dashboard/landlord/transactions/${tx.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors border border-blue-100 bg-white px-3 py-1.5 rounded inline-flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" /> See Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden p-4 space-y-4">
        {recent.map((tx) => (
          <div key={tx.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
            {[
              { label: 'Transaction ID', value: tx.id },
              { label: 'Date', value: tx.date },
              { label: 'Property', value: tx.propertyName },
              { label: 'Tenant', value: tx.tenantName },
              { label: 'Amount', value: formatNGN(tx.amount) },
              { label: 'Type', value: tx.type },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="text-sm text-gray-400 font-medium">{label}</span>
                <span className="text-sm text-gray-900 font-medium">{value}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pb-2">
              <span className="text-sm text-gray-400 font-medium">Status</span>
              <span className={`text-xs py-1 px-3 rounded-md font-medium ${getStatusStyle(tx.status)}`}>{tx.status}</span>
            </div>
            <Link
              href={`/dashboard/landlord/transactions/${tx.id}`}
              className="block w-full text-center py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              See Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
