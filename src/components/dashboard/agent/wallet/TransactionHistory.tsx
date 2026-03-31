import { useState } from 'react';
import { useWalletStore } from '@/lib/store/useWalletStore';
import { Search, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import TransactionRow from './TransactionRow';

export default function TransactionHistory() {
  const { transactions, isLoadingLedger } = useWalletStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Local Pagination Mock Logic
  // Real implementation would calculate derived state arrays based on filtered queries.

  const filteredData = transactions.filter(t => 
     t.type.toLowerCase().includes(searchQuery.toLowerCase()) || 
     t.amount.toString().includes(searchQuery)
  );

  return (
    <div className="w-full flex flex-col mt-8 animate-in slide-in-from-bottom-2 fade-in duration-300">
       <h3 className="text-lg font-bold text-gray-900 mb-4 px-1">Transaction history</h3>

       <div className="bg-white border text-center border-gray-100 rounded-2xl p-6 md:p-8 min-h-[300px] flex flex-col relative w-full overflow-hidden shadow-sm">
           
           {/* If ledger is entirely empty to start with (mockup 1 logic), show the Empty State graphic */}
           {transactions.length === 0 && !isLoadingLedger ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                 <div className="w-16 h-16 rounded-full bg-blue-50/80 flex items-center justify-center relative">
                    <span className="text-xl font-bold text-blue-500 absolute">$</span>
                    <RotateCcw className="w-6 h-6 text-blue-500 absolute -right-0 -bottom-0 translate-x-[4px] translate-y-[2px]" />
                 </div>
                 <p className="text-gray-400 font-medium text-[15px]">Recent Transactions will be displayed here</p>
              </div>
           ) : (
              // Populated Ledger Logic (mockups 3 and 4)
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
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow bg-gray-50/30"
                     />
                  </div>

                  {/* List Wrapper */}
                  <div className="flex flex-col flex-1 w-full mb-8 relative">
                     {isLoadingLedger && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                           <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                     )}

                     {filteredData.length === 0 && !isLoadingLedger ? (
                        <div className="py-8 text-center text-gray-500 text-sm">No transactions found matching &quot;{searchQuery}&quot;</div>
                     ) : (
                        filteredData.map(tx => <TransactionRow key={tx.id} transaction={tx} />)
                     )}
                  </div>

                  {/* Mock Pagination Footer perfectly matching Mockup */}
                  <div className="mt-auto border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 w-full text-sm font-medium text-gray-400">
                      <span>Page 1 of 30</span>

                      <div className="flex items-center gap-3">
                          <span className="px-2 hover:text-gray-600 cursor-pointer transition-colors">1</span>
                          <span className="px-2 hover:text-gray-600 cursor-pointer transition-colors">2</span>
                          <div className="w-8 h-8 rounded border border-blue-400 text-gray-900 font-bold flex items-center justify-center bg-white shadow-sm">
                             3
                          </div>
                          <span className="px-2 hover:text-gray-600 cursor-pointer transition-colors">4</span>
                          <span className="px-2 hover:text-gray-600 cursor-pointer transition-colors">5</span>
                          <span className="px-2 hover:text-gray-600 cursor-pointer transition-colors">6</span>

                          <div className="flex items-center ml-2 relative z-10">
                              <button className="bg-blue-600 text-white p-1.5 rounded-l-md hover:bg-blue-700 transition-colors shadow-sm">
                                 <ChevronLeft className="w-5 h-5" />
                              </button>
                              <div className="w-px h-8 bg-blue-700"></div>
                              <button className="bg-blue-600 text-white p-1.5 rounded-r-md hover:bg-blue-700 transition-colors shadow-sm">
                                 <ChevronRight className="w-5 h-5" />
                              </button>
                          </div>
                      </div>
                  </div>

              </div>
           )}

       </div>
    </div>
  );
}
