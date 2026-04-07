'use client';

import { Home, Users, DoorOpen, Coins, ChevronDown } from 'lucide-react';
import { useLandlordDashboardStore } from '@/lib/store/useLandlordDashboardStore';

function formatNGN(amount: number) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 })
    .format(amount)
    .replace('NGN', '\u20A6');
}

export default function LandlordStats() {
  const { stats } = useLandlordDashboardStore();

  const statItems = [
    { label: 'Total Properties', value: stats.totalProperties.toLocaleString(), icon: Home,     bg: 'bg-blue-50',  color: 'text-blue-600' },
    { label: 'Occupied Units',   value: stats.occupiedUnits.toLocaleString(),   icon: Users,    bg: 'bg-green-50', color: 'text-green-500' },
    { label: 'Vacant Units',     value: stats.vacantUnits.toLocaleString(),     icon: DoorOpen, bg: 'bg-amber-50', color: 'text-amber-500' },
    { label: 'Monthly Income',   value: formatNGN(stats.monthlyIncome),         icon: Coins,    bg: 'bg-purple-50', color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-4">
      {/* Date Filters */}
      <div className="flex gap-2 items-center">
        <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium py-1.5 px-3 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
          All time
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
        <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium py-1.5 px-3 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
          12 Dec, 2023 - 14 Dec, 2023
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between h-32">
              <div>
                <div className={`w-10 h-10 ${item.bg} rounded-full flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <p className="text-gray-500 text-sm font-medium">{item.label}</p>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{item.value}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}
