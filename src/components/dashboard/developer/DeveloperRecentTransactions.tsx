'use client';

import Link from 'next/link';
import { useDeveloperDashboardStore, DeveloperTransaction } from '@/lib/store/useDeveloperDashboardStore';
import { ArrowRightLeft, Search, SlidersHorizontal } from 'lucide-react';

const RECENT_LIMIT = 5;

export default function DeveloperRecentTransactions() {
  const { transactions, profile } = useDeveloperDashboardStore();

  const isVerified = profile?.kycStatus === 'verified';
  const recent = transactions.slice(0, RECENT_LIMIT);

  if (!isVerified || recent.length === 0) {
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

  const getStatusStyle = (status: DeveloperTransaction['status']) => {
    switch (status) {
      case 'Pending':     return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'Completed':   return 'bg-green-50 text-green-600 border border-green-100';
      case 'Declined':    return 'bg-red-50 text-red-600 border border-red-100';
      case 'In-progress': return 'bg-blue-50 text-blue-600 border border-blue-100';
      default:            return 'bg-gray-50 text-gray-600 border border-gray-100';
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl mt-6 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 border border-gray-200 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 font-medium">
              <th className="py-4 px-6 font-medium">Transaction ID</th>
              <th className="py-4 px-6 font-medium">Date</th>
              <th className="py-4 px-6 font-medium">Project / Unit</th>
              <th className="py-4 px-6 font-medium">Buyer Name</th>
              <th className="py-4 px-6 font-medium">Total Amount</th>
              <th className="py-4 px-6 font-medium">Paid Amount</th>
              <th className="py-4 px-6 font-medium">Progress</th>
              <th className="py-4 px-6 font-medium">Status</th>
              <th className="py-4 px-6 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {recent.map((tx) => {
              const pct = tx.totalAmount > 0 ? Math.round((tx.paidAmount / tx.totalAmount) * 100) : 0;
              const paidDisplay = tx.paidAmount >= 1000000 ? `₦${(tx.paidAmount / 1000000).toFixed(1)}M` : `₦${tx.paidAmount.toLocaleString()}`;
              return (
                <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-gray-900 font-medium">{tx.id}</td>
                  <td className="py-4 px-6 text-gray-600">{tx.date}</td>
                  <td className="py-4 px-6 text-gray-900 font-medium">{tx.projectName}</td>
                  <td className="py-4 px-6 text-gray-900">{tx.buyerName}</td>
                  <td className="py-4 px-6 text-gray-900 font-medium">₦{tx.totalAmount.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <span className="text-green-600 font-bold">{paidDisplay}</span>
                    <br />
                    <span className="text-xs text-gray-400">{pct}% paid</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-blue-600 font-medium text-xs">{tx.progress}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-xs py-1 px-3 rounded-md font-medium ${getStatusStyle(tx.status)}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Link
                      href={`/dashboard/developer/transactions/${tx.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                    >
                      See Details
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden p-4 space-y-4">
        {recent.map((tx) => (
          <div key={tx.id} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-3">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <span className="text-sm text-gray-400 font-medium">Transaction ID</span>
              <span className="text-sm text-gray-900 font-medium">{tx.id}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <span className="text-sm text-gray-400 font-medium">Project</span>
              <span className="text-sm text-gray-900 font-medium text-right">{tx.projectName}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <span className="text-sm text-gray-400 font-medium">Buyer</span>
              <span className="text-sm text-gray-900">{tx.buyerName}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <span className="text-sm text-gray-400 font-medium">Progress</span>
              <span className="text-sm text-blue-600 font-medium">{tx.progress}</span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-sm text-gray-400 font-medium">Status</span>
              <span className={`text-xs py-1 px-3 rounded-md font-medium ${getStatusStyle(tx.status)}`}>
                {tx.status}
              </span>
            </div>
            <Link
              href={`/dashboard/developer/transactions/${tx.id}`}
              className="block w-full text-center py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              See Details
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
        <span>Page 1 of 30</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5, 6].map((page) => (
            <button
              key={page}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                page === 3
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
          <div className="flex gap-1 ml-2">
            <button className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm">&lt;</button>
            <button className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
