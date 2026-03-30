'use client';

import { useAgentDashboardStore, Transaction } from '@/lib/store/useAgentDashboardStore';
import { Search, Filter, ArrowRightLeft, Eye } from 'lucide-react';
import React from 'react';

export default function RecentTransactions() {
  const { transactions, profile } = useAgentDashboardStore();
  
  const isVerified = profile?.kycStatus === 'verified';

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

  const getStatusStyle = (status: Transaction['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'Completed':
        return 'bg-green-50 text-green-600 border border-green-100';
      case 'Failed':
        return 'bg-red-50 text-red-600 border border-red-100';
      case 'In-progress':
        return 'bg-blue-50 text-blue-600 border border-blue-100';
      default:
        return 'bg-gray-50 text-gray-600 border border-gray-100';
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl mt-6 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
        
        <div className="flex gap-3 w-full sm:w-auto">
          {/* Desktop Search Wrapper */}
          <div className="relative w-full sm:w-64 hidden sm:block">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          {/* Mobile Search Input directly styled from user's image */}
          <div className="relative w-full flex-1 sm:hidden">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap">
            <Filter className="w-4 h-4" />
            Filter
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
              <th className="py-4 px-6 font-medium">Property Name</th>
              <th className="py-4 px-6 font-medium">Property Type</th>
              <th className="py-4 px-6 font-medium">Client Name</th>
              <th className="py-4 px-6 font-medium">Transaction Type</th>
              <th className="py-4 px-6 font-medium">Amount</th>
              <th className="py-4 px-6 font-medium">Status</th>
              <th className="py-4 px-6 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 text-gray-900 font-medium">{tx.id}</td>
                <td className="py-4 px-6 text-gray-600">{tx.date}</td>
                <td className="py-4 px-6 text-gray-900 font-medium">{tx.propertyName}</td>
                <td className="py-4 px-6 text-gray-600">{tx.propertyType}</td>
                <td className="py-4 px-6 text-gray-900">{tx.clientName}</td>
                <td className="py-4 px-6">
                  <span className="bg-blue-50 text-blue-600 text-xs py-1 px-3 rounded-md font-medium">
                    {tx.transactionType}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-900 font-bold">₦{tx.amount.toLocaleString()}</td>
                <td className="py-4 px-6">
                  <span className={`text-xs py-1 px-3 rounded-md font-medium ${getStatusStyle(tx.status)}`}>
                    {tx.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors border border-blue-100 bg-white px-3 py-1.5 rounded flex items-center gap-1 mx-auto">
                    <Eye className="w-4 h-4" />
                    See Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Vertical Cards (As requested by User in previous image) */}
      <div className="lg:hidden p-4 space-y-4">
        {transactions.map((tx) => (
          <div key={tx.id} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-3">
            
            {/* Row Item Template */}
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
              <span className="text-sm text-gray-400 font-medium">Transaction Type</span>
              <span className="bg-blue-50 text-blue-600 text-xs py-1 px-3 rounded-md font-medium">
                 {tx.transactionType}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <span className="text-sm text-gray-400 font-medium">Amount</span>
              <span className="text-sm text-gray-900 font-bold tracking-tight">₦{tx.amount.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center pb-2">
              <span className="text-sm text-gray-400 font-medium">Status</span>
              <span className={`text-xs py-1 px-3 rounded-md font-medium ${getStatusStyle(tx.status)}`}>
                 {tx.status}
              </span>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button className="w-full text-center py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                See Details
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination (Common) */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
        <span>Showing 1 to {transactions.length} of {transactions.length} entries</span>
        <div className="flex gap-1">
           <button className="px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
           <button className="px-3 py-1 bg-blue-600 text-white rounded-md">1</button>
           <button className="px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50" disabled>Next</button>
        </div>
      </div>
    </div>
  );
}
