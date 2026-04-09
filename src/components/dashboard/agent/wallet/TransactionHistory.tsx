'use client';

import { useState } from 'react';
import { useWalletStore } from '@/lib/store/useWalletStore';
import { Search, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import TransactionRow from './TransactionRow';

const ITEMS_PER_PAGE = 5;

export default function TransactionHistory() {
  const { transactions, isLoadingLedger } = useWalletStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = transactions.filter((t) =>
    t.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.amount.toString().includes(searchQuery)
  );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const paginated = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const pageNumbers = Array.from({ length: Math.min(totalPages, 6) }, (_, i) => i + 1);

  return (
    <div className="w-full flex flex-col mt-8 animate-in slide-in-from-bottom-2 fade-in duration-300">
      <h3 className="text-lg font-bold text-gray-900 mb-4 px-1">Transaction history</h3>

      <div className="bg-white border text-center border-gray-100 rounded-2xl p-6 md:p-8 min-h-[300px] flex flex-col relative w-full overflow-hidden shadow-sm">

        {transactions.length === 0 && !isLoadingLedger ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-50/80 flex items-center justify-center relative">
              <span className="text-xl font-bold text-blue-500 absolute">$</span>
              <RotateCcw className="w-6 h-6 text-blue-500 absolute -right-0 -bottom-0 translate-x-[4px] translate-y-[2px]" />
            </div>
            <p className="text-gray-400 font-medium text-[15px]">Recent Transactions will be displayed here</p>
          </div>
        ) : (
          <div className="flex flex-col flex-1 text-left">

            {/* Search Input */}
            <div className="relative w-full mb-6">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow bg-gray-50/30"
              />
            </div>

            {/* List */}
            <div className="flex flex-col flex-1 w-full mb-8 relative">
              {isLoadingLedger && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {filteredData.length === 0 && !isLoadingLedger ? (
                <div className="py-8 text-center text-gray-500 text-sm">
                  No transactions found matching &quot;{searchQuery}&quot;
                </div>
              ) : (
                paginated.map((tx) => <TransactionRow key={tx.id} transaction={tx} />)
              )}
            </div>

            {/* Pagination Footer */}
            {totalPages > 1 && (
              <div className="mt-auto border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 w-full text-sm font-medium text-gray-400">
                <span>Page {currentPage} of {totalPages}</span>

                <div className="flex items-center gap-3">
                  {pageNumbers.map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-2 transition-colors ${
                        currentPage === page
                          ? 'w-8 h-8 rounded border border-blue-400 text-gray-900 font-bold flex items-center justify-center bg-white shadow-sm'
                          : 'hover:text-gray-600 cursor-pointer'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <div className="flex items-center ml-2 relative z-10">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="bg-blue-600 text-white p-1.5 rounded-l-md hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="w-px h-8 bg-blue-700" />
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="bg-blue-600 text-white p-1.5 rounded-r-md hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
