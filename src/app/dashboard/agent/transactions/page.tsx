'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  useTransactionsStore,
  TransactionDetail,
  TabKey,
  StatusFilter,
} from '@/lib/store/useTransactionsStore';
import { Search, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const TABS: { label: string; key: TabKey }[] = [
  { label: 'All', key: 'all' },
  { label: 'Inspection', key: 'inspection' },
  { label: 'Sales', key: 'sales' },
  { label: 'Rentals', key: 'rentals' },
];

const STATUS_FILTERS: StatusFilter[] = ['All', 'Pending', 'In-progress', 'Completed', 'Declined'];

const ITEMS_PER_PAGE = 10;

const TAB_TITLES: Record<TabKey, string> = {
  all: 'All Transactions',
  inspection: 'All Inspection',
  sales: 'All Sales',
  rentals: 'All Rentals',
};

export default function TransactionsPage() {
  const {
    transactions,
    isLoading,
    fetchTransactionsMock,
    activeTab,
    setActiveTab,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    propertyTypeFilter,
    setPropertyTypeFilter,
    inspectionTypeFilter,
    setInspectionTypeFilter,
    currentPage,
    setCurrentPage,
  } = useTransactionsStore();

  useEffect(() => {
    fetchTransactionsMock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter by tab
  const tabFiltered = useMemo(() => {
    if (activeTab === 'all') return transactions;
    if (activeTab === 'inspection') return transactions.filter((t) => t.transactionCategory === 'Inspection Fee');
    if (activeTab === 'sales') return transactions.filter((t) => t.transactionCategory === 'Sale');
    return transactions.filter((t) => t.transactionCategory === 'Rental');
  }, [transactions, activeTab]);

  // Filter by status
  const statusFiltered = useMemo(() => {
    if (statusFilter === 'All') return tabFiltered;
    return tabFiltered.filter((t) => t.status === statusFilter);
  }, [tabFiltered, statusFilter]);

  // Filter by property type dropdown
  const propTypeFiltered = useMemo(() => {
    if (!propertyTypeFilter) return statusFiltered;
    return statusFiltered.filter((t) => t.propertyType === propertyTypeFilter);
  }, [statusFiltered, propertyTypeFilter]);

  // Filter by inspection type dropdown (only on inspection tab)
  const inspTypeFiltered = useMemo(() => {
    if (!inspectionTypeFilter || activeTab !== 'inspection') return propTypeFiltered;
    return propTypeFiltered.filter((t) => t.inspectionType === inspectionTypeFilter);
  }, [propTypeFiltered, inspectionTypeFilter, activeTab]);

  // Filter by search
  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return inspTypeFiltered;
    const q = searchQuery.toLowerCase();
    return inspTypeFiltered.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.propertyName.toLowerCase().includes(q) ||
        t.clientName.toLowerCase().includes(q) ||
        t.amount.toString().includes(q)
    );
  }, [inspTypeFiltered, searchQuery]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE));
  const paginated = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusStyle = (status: TransactionDetail['status']) => {
    switch (status) {
      case 'Pending':
        return 'text-amber-600';
      case 'Completed':
        return 'text-green-600';
      case 'Declined':
        return 'text-red-500';
      case 'In-progress':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusPillStyle = (filter: StatusFilter) => {
    if (filter === statusFilter) return 'bg-blue-600 text-white border-blue-600';
    return 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50';
  };

  if (isLoading && transactions.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
            onClick={() => setActiveTab(tab.key)}
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

      {/* Status Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {STATUS_FILTERS.map((sf) => (
          <button
            key={sf}
            onClick={() => setStatusFilter(sf)}
            className={`whitespace-nowrap px-4 py-2 text-sm rounded-full transition-colors border font-medium ${getStatusPillStyle(sf)}`}
          >
            {sf}
          </button>
        ))}
      </div>

      {/* White Card Container */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        {/* Section Title */}
        <div className="px-6 pt-6 pb-4">
          <h3 className="text-lg font-bold text-gray-900">{TAB_TITLES[activeTab]}</h3>
        </div>

        {/* Search + Dropdowns Row */}
        <div className="px-6 pb-5 flex flex-col sm:flex-row gap-3">
          {/* Search */}
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

          {/* Inspection Type Dropdown (only on inspection tab) */}
          {activeTab === 'inspection' && (
            <div className="relative">
              <select
                value={inspectionTypeFilter}
                onChange={(e) => setInspectionTypeFilter(e.target.value)}
                className="appearance-none border border-gray-200 rounded-lg px-4 py-2.5 pr-9 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
              >
                <option value="">Inspection Type</option>
                <option value="In Person">In Person</option>
                <option value="Video Chat">Video Chat</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}

          {/* Property Type Dropdown */}
          <div className="relative">
            <select
              value={propertyTypeFilter}
              onChange={(e) => setPropertyTypeFilter(e.target.value)}
              className="appearance-none border border-gray-200 rounded-lg px-4 py-2.5 pr-9 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
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
                  <td colSpan={8} className="py-16 text-center text-gray-400">
                    No transactions found
                  </td>
                </tr>
              ) : (
                paginated.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 text-gray-900 font-medium">{tx.id}</td>
                    <td className="py-4 px-6 text-gray-500">{tx.date}</td>
                    <td className="py-4 px-6 text-gray-900">{tx.propertyName}</td>
                    <td className="py-4 px-6 text-gray-500">{tx.propertyType}</td>
                    <td className="py-4 px-6 text-gray-900">{tx.clientName}</td>
                    <td className="py-4 px-6 text-gray-900 font-medium">₦{tx.amount.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <span className={`text-sm font-medium ${getStatusStyle(tx.status)}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Link
                        href={`/dashboard/agent/transactions/${tx.id}`}
                        className="text-gray-500 hover:text-blue-600 font-medium text-sm transition-colors border border-gray-200 bg-white px-3 py-1.5 rounded-md"
                      >
                        See Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Vertical Cards */}
        <div className="lg:hidden px-4 pb-4 space-y-4">
          {paginated.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">No transactions found</div>
          ) : (
            paginated.map((tx) => (
              <div key={tx.id} className="border border-gray-200 rounded-xl p-4 bg-white space-y-3">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-400 font-medium">Transaction ID</span>
                  <span className="text-sm text-gray-900 font-medium">{tx.id}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-400 font-medium">Date</span>
                  <span className="text-sm text-gray-900">{tx.date}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-400 font-medium">Property Name</span>
                  <span className="text-sm text-gray-900 font-medium text-right">{tx.propertyName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-400 font-medium">Property Type</span>
                  <span className="text-sm text-gray-900">{tx.propertyType}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-400 font-medium">Client Name</span>
                  <span className="text-sm text-gray-900">{tx.clientName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-400 font-medium">Amount</span>
                  <span className="text-sm text-gray-900 font-bold">₦{tx.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-sm text-gray-400 font-medium">Status</span>
                  <span className={`text-sm font-medium ${getStatusStyle(tx.status)}`}>{tx.status}</span>
                </div>
                <div className="pt-2">
                  <Link
                    href={`/dashboard/agent/transactions/${tx.id}`}
                    className="block w-full text-center py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    See Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredTransactions.length > 0 && (
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
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="bg-blue-600 text-white p-1.5 rounded-l-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="w-px h-8 bg-blue-700"></div>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
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
