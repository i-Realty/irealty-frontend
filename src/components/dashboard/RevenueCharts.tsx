'use client';

import { useAgentDashboardStore } from '@/lib/store/useAgentDashboardStore';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Legend } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { Coins, ChevronDown } from 'lucide-react';

const COLORS = ['#F59E0B', '#3B82F6']; // Amber and Blue

export default function RevenueCharts() {
  const { revenueData, escrowData, profile } = useAgentDashboardStore();

  const isVerified = profile?.kycStatus === 'verified';

  if (!isVerified || revenueData.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-8 flex flex-col items-center justify-center min-h-[300px] shadow-sm">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <Coins className="w-8 h-8 text-blue-300 transform -rotate-12" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Revenue Yet!</h3>
        <p className="text-gray-500 text-sm">All revenue will be displayed here</p>
      </div>
    );
  }

  const doughnutData = escrowData ? [
    { name: 'Funds in Escrow', value: escrowData.fundsInEscrow },
    { name: 'Available for Withdrawal', value: escrowData.availableForWithdrawal },
  ] : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Revenue Chart */}
      <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Revenue</h3>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 text-sm text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg">
              This Week <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} tickFormatter={(value) => `${value}k`} />
              <Tooltip cursor={{ fill: '#F9FAFB' }} />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="inspectionFee" name="Inspection Fee" stackId="a" fill="#10B981" radius={[0, 0, 4, 4]} barSize={24} />
              <Bar dataKey="sales" name="Sales" stackId="a" fill="#3B82F6" />
              <Bar dataKey="rentals" name="Rentals" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Escrow Chart */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col items-center">
        <div className="w-full mb-2">
           <h3 className="text-lg font-bold text-gray-900">Total Revenue</h3>
           <p className="text-2xl font-bold text-blue-600 mt-1">₦200,000,000.00</p>
        </div>
        
        <div className="h-56 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={doughnutData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {doughnutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `₦${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
          {/* Centered text in doughnut */}
          <div className="absolute inset-0 flex items-center justify-center flex-col pt-2 pointer-events-none">
            <span className="text-xs text-gray-400">Total Value</span>
            <span className="text-sm font-bold text-gray-800">100%</span>
          </div>
        </div>

        <div className="w-full space-y-3 mt-4">
          {doughnutData.map((item, index) => (
            <div key={item.name} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></span>
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{((item.value / 200000000) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
