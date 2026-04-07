'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import {
  useLandlordDashboardStore,
  LandlordTransactionTabKey,
  LandlordStatusFilter,
  LandlordTransactionStatus,
} from '@/lib/store/useLandlordDashboardStore';

const TABS: { label: string; key: LandlordTransactionTabKey }[] = [
  { label: 'All',          key: 'All' },
  { label: 'Rent',         key: 'Rent' },
  { label: 'Deposit',      key: 'Deposit' },
  { label: 'Maintenance',  key: 'Maintenance' },
  { label: 'Service Fee',  key: 'Service Fee' },
];

const STATUS_FILTERS: LandlordStatusFilter[] = ['All', 'Pending', 'Completed', 'Failed'];

const TAB_TITLES: Record<LandlordTransactionTabKey, string> = {
  All:            'All Transactions',
  Rent:           'Rent Payments',
  Deposit:        'Security Deposits',
  Maintenance:    'Maintenance Costs',
  'Service Fee':  'Service Fees',
};

const ITEMS_PER_PAGE = 10;

function formatNGN(amount: number) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 })
    .format(amount)
    .replace('NGN', '\u20A6');
}

export default function LandlordTransactionsPage() {
  const {
    transactions, transactionsLoading, fetchTransactionsMock,
    activeTab, setActiveTab,
    statusFilter, setStatusFilter,
    searchQuery, setSearchQuery,
    currentPage, setCurrentPage,
  } = useLandlordDashboardStore();

  useEffect(() => {
    fetchTransactionsMock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabFiltered = useMemo(() => {
    if (activeTab === 'All') return transactions;
    return transactions.filter((t) => t.type === activeTab);
  }, [transactions, activeTab]);

  const statusFiltered = useMemo(() =>
    statusFilter === 'All' ? tabFiltered : tabFiltered.filter((t) => t.status === statusFilter),
    [tabFiltered, statusFilter]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return statusFiltered;
    const q = searchQuery.toLowerCase();
    return statusFiltered.filter((t) =>
      t.id.toLowerCase().includes(q) ||
      t.propertyName.toLowerCase().includes(q) ||
      t.tenantName.toLowerCase().includes(q) ||
      t.amount.toString().includes(q)
    );
  }, [statusFiltered, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getStatusStyle = (status: LandlordTransactionStatus) => {
    switch (status) {
      case 'Pending':   return 'text-amber-600';
      case 'Completed': return 'text-green-600';
      case 'Failed':    return 'text-red-500';
      default:          return 'text-gray-600';
    }
  };

  const getPillStyle = (sf: LandlordStatusFilter) =>
    sf === statusFilter
      ? 'bg-blue-600 text-white border-blue-600'
      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50';

  if (transactionsLoading && transactions.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-12 w-full">
      {/* Main Tabs */}
      <div className="flex border-b border-gray-200 w-full overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setCurrentPage(1); }}
            className={`py-3 px-6 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Status Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {STATUS_FILTERS.map((sf) => (
          <button
            key={sf}
            onClick={() => { setStatusFilter(sf); setCurrentPage(1); }}
            className={`whitespace-nowrap px-4 py-2 text-sm rounded-full transition-colors border font-medium ${getPillStyle(sf)}`}
          >
            {sf}
          </button>
        ))}
      </div>

      {/* Card */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <h3 className="text-lg font-bold text-gray-900">{TAB_TITLES[activeTab]}</h3>
        </div>

        {/* Search Row */}
        <div className="px-6 pb-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, property, tenant or amount"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-y border-gray-100 text-sm text-gray-500 font-medium">
                <th className="py-3.5 px-6 font-medium">Transaction ID</th>
                <th className="py-3.5 px-6 font-medium">Date</th>
                <th className="py-3.5 px-6 font-medium">Property</th>
                <th className="py-3.5 px-6 font-medium">Tenant</th>
                <th className="py-3.5 px-6 font-medium">Amount</th>
                <th className="py-3.5 px-6 font-medium">Type</th>
                <th className="py-3.5 px-6 font-medium">Status</th>
                <th className="py-3.5 px-6 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-gray-400">No transactions found</td>
                </tr>
              ) : paginated.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-gray-900 font-medium">{tx.id}</td>
                  <td className="py-4 px-6 text-gray-500">{tx.date}</td>
                  <td className="py-4 px-6 text-gray-900">{tx.propertyName}</td>
                  <td className="py-4 px-6 text-gray-600">{tx.tenantName}</td>
                  <td className="py-4 px-6 text-gray-900 font-medium">{formatNGN(tx.amount)}</td>
                  <td className="py-4 px-6 text-gray-500">{tx.type}</td>
                  <td className="py-4 px-6">
                    <span className={`text-sm font-medium ${getStatusStyle(tx.status)}`}>{tx.status}</span>
                  </td>
                  <td className="py-4 px-6">
                    <Link
                      href={`/dashboard/landlord/transactions/${tx.id}`}
                      className="text-gray-500 hover:text-blue-600 font-medium text-sm border border-gray-200 bg-white px-3 py-1.5 rounded-md transition-colors"
                    >
                      See Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden px-4 pb-4 space-y-4">
          {paginated.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">No transactions found</div>
          ) : paginated.map((tx) => (
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
                <span className={`text-sm font-medium ${getStatusStyle(tx.status)}`}>{tx.status}</span>
              </div>
              <Link
                href={`/dashboard/landlord/transactions/${tx.id}`}
                className="block w-full text-center py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors mt-2"
              >
                See Details
              </Link>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <span>Page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: Math.min(totalPages, 6) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'border border-blue-500 text-gray-900 bg-white'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {page}
                </button>
              ))}
              <div className="flex items-center ml-3">
                <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="bg-blue-600 text-white p-1.5 rounded-l-md hover:bg-blue-700 disabled:opacity-50">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="w-px h-8 bg-blue-700" />
                <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="bg-blue-600 text-white p-1.5 rounded-r-md hover:bg-blue-700 disabled:opacity-50">
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
