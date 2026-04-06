'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useDeveloperTransactionsStore, DeveloperTabKey, DeveloperTransactionStatus } from '@/lib/store/useDeveloperTransactionsStore';
import { Search, ChevronDown, ChevronLeft, ChevronRight, ArrowRightLeft } from 'lucide-react';

const TABS: { key: DeveloperTabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'in-progress', label: 'In-Progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'declined', label: 'Declined' },
];

const STATUS_MAP: Record<DeveloperTabKey, DeveloperTransactionStatus | null> = {
  all: null,
  pending: 'Pending',
  'in-progress': 'In-progress',
  completed: 'Completed',
  declined: 'Declined',
};

const PAGE_SIZE = 10;

export default function DeveloperTransactionsPage() {
  const store = useDeveloperTransactionsStore();

  useEffect(() => {
    store.fetchTransactionsMock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    let result = store.transactions;
    const statusMatch = STATUS_MAP[store.activeTab];
    if (statusMatch) {
      result = result.filter((t) => t.status === statusMatch);
    }
    if (store.searchQuery.trim()) {
      const q = store.searchQuery.toLowerCase();
      result = result.filter(
        (t) => t.id.toLowerCase().includes(q) || t.projectName.toLowerCase().includes(q) || t.buyerName.toLowerCase().includes(q)
      );
    }
    if (store.propertyTypeFilter !== 'all') {
      result = result.filter((t) => t.propertyType === store.propertyTypeFilter);
    }
    return result;
  }, [store.transactions, store.activeTab, store.searchQuery, store.propertyTypeFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (store.currentPage - 1) * PAGE_SIZE,
    store.currentPage * PAGE_SIZE,
  );

  const getStatusStyle = (status: DeveloperTransactionStatus) => {
    switch (status) {
      case 'Pending':     return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'Completed':   return 'bg-green-50 text-green-600 border border-green-100';
      case 'Declined':    return 'bg-red-50 text-red-600 border border-red-100';
      case 'In-progress': return 'bg-blue-50 text-blue-600 border border-blue-100';
      default:            return 'bg-gray-50 text-gray-600 border border-gray-100';
    }
  };

  const formatPaid = (paid: number, total: number) => {
    const pct = total > 0 ? Math.round((paid / total) * 100) : 0;
    const display = paid >= 1000000 ? `₦${(paid / 1000000).toFixed(1)}M` : `₦${paid.toLocaleString()}`;
    return { display, pct };
  };

  if (store.isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => store.setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              store.activeTab === tab.key
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={store.searchQuery}
                onChange={(e) => store.setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <select
                className="appearance-none border border-gray-200 rounded-lg px-4 py-2.5 pr-9 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                value={store.propertyTypeFilter}
                onChange={(e) => store.setPropertyTypeFilter(e.target.value)}
              >
                <option value="all">Property Type</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Off-Plan">Off-Plan</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                <tr>
                  <td colSpan={9} className="py-16 text-center text-gray-400">
                    No transactions found
                  </td>
                </tr>
              ) : (
                paginated.map((tx) => {
                  const { display, pct } = formatPaid(tx.paidAmount, tx.totalAmount);
                  return (
                    <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 text-gray-900 font-medium">{tx.id}</td>
                      <td className="py-4 px-6 text-gray-600">{tx.date}</td>
                      <td className="py-4 px-6 text-gray-900 font-medium">{tx.projectName}</td>
                      <td className="py-4 px-6 text-gray-900">{tx.buyerName}</td>
                      <td className="py-4 px-6 text-gray-900 font-medium">₦{tx.totalAmount.toLocaleString()}</td>
                      <td className="py-4 px-6">
                        <span className="text-green-600 font-bold">{display}</span>
                        <br />
                        <span className="text-xs text-gray-400">{pct}% paid</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-blue-600 font-medium text-xs">{tx.progress}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-xs py-1 px-3 rounded-md font-medium ${getStatusStyle(tx.status)}`}>{tx.status}</span>
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
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden p-4 space-y-4">
          {paginated.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                <ArrowRightLeft className="w-7 h-7 text-blue-300" />
              </div>
              <p className="text-gray-400 text-sm">No transactions found</p>
            </div>
          ) : (
            paginated.map((tx) => {
              const { display, pct } = formatPaid(tx.paidAmount, tx.totalAmount);
              return (
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
                    <span className="text-sm text-gray-400 font-medium">Paid</span>
                    <span className="text-sm text-green-600 font-bold">{display} ({pct}%)</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-sm text-gray-400 font-medium">Progress</span>
                    <span className="text-sm text-blue-600 font-medium">{tx.progress}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-sm text-gray-400 font-medium">Status</span>
                    <span className={`text-xs py-1 px-3 rounded-md font-medium ${getStatusStyle(tx.status)}`}>{tx.status}</span>
                  </div>
                  <Link
                    href={`/dashboard/developer/transactions/${tx.id}`}
                    className="block w-full text-center py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    See Details
                  </Link>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <span>Page {store.currentPage} of {totalPages}</span>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: Math.min(totalPages, 6) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => store.setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                    store.currentPage === page
                      ? 'border border-blue-500 text-gray-900 bg-white'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {page}
                </button>
              ))}
              <div className="flex items-center ml-3">
                <button
                  onClick={() => store.setCurrentPage(Math.max(1, store.currentPage - 1))}
                  disabled={store.currentPage === 1}
                  className="bg-blue-600 text-white p-1.5 rounded-l-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="w-px h-8 bg-blue-700" />
                <button
                  onClick={() => store.setCurrentPage(Math.min(totalPages, store.currentPage + 1))}
                  disabled={store.currentPage === totalPages}
                  className="bg-blue-600 text-white p-1.5 rounded-r-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
