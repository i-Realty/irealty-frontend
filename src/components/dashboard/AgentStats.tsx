import { useAgentDashboardStore } from '@/lib/store/useAgentDashboardStore';
import { Home, Briefcase, CheckCircle, Calendar, ChevronDown } from 'lucide-react';

export default function AgentStats() {
  const { stats } = useAgentDashboardStore();

  const statItems = [
    { label: 'Total Listings', value: stats.totalListings, icon: Home, bg: 'bg-blue-50', color: 'text-blue-600' },
    { label: 'Active Deals', value: stats.activeDeals, icon: Briefcase, bg: 'bg-orange-50', color: 'text-orange-500' },
    { label: 'Closed Deals', value: stats.closedDeals, icon: CheckCircle, bg: 'bg-green-50', color: 'text-green-500' },
    { label: 'Upcoming Tours', value: stats.upcomingTours, icon: Calendar, bg: 'bg-blue-50', color: 'text-blue-500' },
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

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between h-32">
              <div>
                <div className={`w-10 h-10 ${item.bg} rounded-full flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <p className="text-gray-500 text-sm font-medium">{item.label}</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{item.value.toLocaleString()}</h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
