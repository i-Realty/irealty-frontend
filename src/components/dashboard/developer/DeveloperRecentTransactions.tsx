'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useDeveloperDashboardStore, DeveloperTransaction } from '@/lib/store/useDeveloperDashboardStore';
import { ArrowRightLeft, Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 5;

export default function DeveloperRecentTransactions() {
  const { transactions, profile } = useDeveloperDashboardStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const isVerified = profile?.kycStatus === 'verified';

  const filtered = useMemo(() => {
    let result = transactions;
    if (statusFilter !== 'All') result = result.filter((t) => t.status === statusFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) => t.id.toLowerCase().includes(q) || t.projectName.toLowerCase().includes(q) || t.buyerName.toLowerCase().includes(q)
      );
    }
    return result;
  }, [transactions, statusFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSearch = (val: string) => { setSearchQuery(val); setCurrentPage(1); };
  const handleFilter = (val: string) => { setStatusFilter(val); setCurrentPage(1); setShowFilter(false); };

  if (!isVerified || transactions.length === 0) {
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
              placeholder="Search by ID, project, or buyer"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilter((v) => !v)}
              className={`flex items-center gap-2 border px-4 py-2.5 rounded-lg text-sm transition-colors ${
                statusFilter !== 'All' ? 'border-blue-400 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" /> Filter
              {statusFilter !== 'All' && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
            </button>
            {showFilter && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-100 shadow-lg rounded-xl py-1.5 w-44 z-20 animate-in fade-in slide-in-from-top-2">
                {['All', 'Pending', 'In-progress', 'Completed', 'Declined'].map((s) => (
                  <button key={s} onClick={() => handleFilter(s)}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${statusFilter === s ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
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
            {paginated.length === 0 ? (
              <tr><td colSpan={9} className="py-12 text-center text-gray-400">No transactions found</td></tr>
            ) : paginated.map((tx) => {
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
                    <br /><span className="text-xs text-gray-400">{pct}% paid</span>
                  </td>
                  <td className="py-4 px-6"><span className="text-blue-600 font-medium text-xs">{tx.progress}</span></td>
                  <td className="py-4 px-6">
                    <span className={`text-xs py-1 px-3 rounded-md font-medium ${getStatusStyle(tx.status)}`}>{tx.status}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Link href={`/dashboard/developer/transactions/${tx.id}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">See Details</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden p-4 space-y-4">
        {paginated.map((tx) => (
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
            <div className="flex justify-between items-center pb-2">
              <span className="text-sm text-gray-400 font-medium">Status</span>
              <span className={`text-xs py-1 px-3 rounded-md font-medium ${getStatusStyle(tx.status)}`}>{tx.status}</span>
            </div>
            <Link href={`/dashboard/developer/transactions/${tx.id}`}
              className="block w-full text-center py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              See Details
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>Page {currentPage} of {totalPages}</span>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === page ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                {page}
              </button>
            ))}
            <div className="flex gap-1 ml-2">
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}
                className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center disabled:opacity-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}
                className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center disabled:opacity-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
