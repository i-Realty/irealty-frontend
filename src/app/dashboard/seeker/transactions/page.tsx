'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ChevronDown, Search } from 'lucide-react';
import {
  useSeekerTransactionsStore,
  SeekerTransactionDetail,
  SeekerTabKey,
  SeekerStatusFilter,
} from '@/lib/store/useSeekerTransactionsStore';

const TABS: { label: string; key: SeekerTabKey }[] = [
  { label: 'All',        key: 'all' },
  { label: 'Inspection', key: 'inspection' },
  { label: 'Purchases',  key: 'purchases' },
  { label: 'Rentals',    key: 'rentals' },
];

const STATUS_FILTERS: SeekerStatusFilter[] = ['All', 'Pending', 'In-progress', 'Completed', 'Declined'];

const TAB_TITLES: Record<SeekerTabKey, string> = {
  all:       'All Transactions',
  inspection:'All Inspection',
  purchases: 'All Purchases',
  rentals:   'All Rentals',
};

const ITEMS_PER_PAGE = 10;

export default function SeekerTransactionsPage() {
  const {
    transactions, isLoading, fetchTransactionsMock,
    activeTab, setActiveTab,
    statusFilter, setStatusFilter,
    searchQuery, setSearchQuery,
    propertyTypeFilter, setPropertyTypeFilter,
    currentPage, setCurrentPage,
  } = useSeekerTransactionsStore();

  useEffect(() => {
    fetchTransactionsMock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabFiltered = useMemo(() => {
    if (activeTab === 'all') return transactions;
    if (activeTab === 'inspection') return transactions.filter((t) => t.flow === 'inspection');
    if (activeTab === 'purchases') return transactions.filter((t) => t.flow === 'agent-sale' || t.flow === 'developer-purchase');
    return transactions.filter((t) => t.flow === 'agent-rental');
  }, [transactions, activeTab]);

  const statusFiltered = useMemo(() =>
    statusFilter === 'All' ? tabFiltered : tabFiltered.filter((t) => t.status === statusFilter),
    [tabFiltered, statusFilter]);

  const propFiltered = useMemo(() =>
    !propertyTypeFilter ? statusFiltered : statusFiltered.filter((t) => t.propertyType === propertyTypeFilter),
    [statusFiltered, propertyTypeFilter]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return propFiltered;
    const q = searchQuery.toLowerCase();
    return propFiltered.filter((t) =>
      t.id.toLowerCase().includes(q) ||
      t.propertyName.toLowerCase().includes(q) ||
      t.clientName.toLowerCase().includes(q) ||
      t.amount.toString().includes(q)
    );
  }, [propFiltered, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getStatusStyle = (status: SeekerTransactionDetail['status']) => {
    switch (status) {
      case 'Pending':     return 'text-amber-600';
      case 'Completed':   return 'text-green-600';
      case 'Declined':    return 'text-red-500';
      case 'In-progress': return 'text-blue-600';
      default:            return 'text-gray-600';
    }
  };

  const getPillStyle = (sf: SeekerStatusFilter) =>
    sf === statusFilter
      ? 'bg-blue-600 text-white border-blue-600'
      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50';

  if (isLoading && transactions.length === 0) {
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

        {/* Search + Filter Row */}
        <div className="px-6 pb-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="relative">
            <select
              value={propertyTypeFilter}
              onChange={(e) => setPropertyTypeFilter(e.target.value)}
              className="appearance-none border border-gray-200 rounded-lg px-4 py-2.5 pr-9 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors focus:outline-none cursor-pointer"
            >
              <option value="">Property Type</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Land/Plots">Land/Plots</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-y border-gray-100 text-sm text-gray-500 font-medium">
                <th className="py-3.5 px-6 font-medium">Transaction ID</th>
                <th className="py-3.5 px-6 font-medium">Date</th>
                <th className="py-3.5 px-6 font-medium">Property Name</th>
                <th className="py-3.5 px-6 font-medium">Property Type</th>
                <th className="py-3.5 px-6 font-medium">Client Name</th>
                <th className="py-3.5 px-6 font-medium">Amount</th>
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
                  <td className="py-4 px-6 text-gray-500">{tx.propertyType}</td>
                  <td className="py-4 px-6 text-gray-900">{tx.clientName}</td>
                  <td className="py-4 px-6 text-gray-900 font-medium">₦{tx.amount.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <span className={`text-sm font-medium ${getStatusStyle(tx.status)}`}>{tx.status}</span>
                  </td>
                  <td className="py-4 px-6">
                    <Link
                      href={`/dashboard/seeker/transactions/${tx.id}`}
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
                { label: 'Property Name', value: tx.propertyName },
                { label: 'Property Type', value: tx.propertyType },
                { label: 'Client Name', value: tx.clientName },
                { label: 'Amount', value: `₦${tx.amount.toLocaleString()}` },
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
                href={`/dashboard/seeker/transactions/${tx.id}`}
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
