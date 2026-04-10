'use client';

import { useState, useRef, useEffect } from 'react';
import { useDeveloperDashboardStore } from '@/lib/store/useDeveloperDashboardStore';
import { Home, Briefcase, CheckCircle, ChevronDown, X } from 'lucide-react';

type TimeFilter = 'All time' | 'This week' | 'This month' | 'This year';
const TIME_OPTIONS: TimeFilter[] = ['All time', 'This week', 'This month', 'This year'];

export default function DeveloperStats() {
  const { stats } = useDeveloperDashboardStore();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('All time');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateFrom, setDateFrom] = useState('2023-12-12');
  const [dateTo, setDateTo] = useState('2023-12-14');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowDropdown(false);
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) setShowDatePicker(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDateLabel = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const statItems = [
    { label: 'Total Listings', value: stats.totalListings, icon: Home,         bg: 'bg-blue-50',   color: 'text-blue-600' },
    { label: 'Active Deals',   value: stats.activeDeals,   icon: Briefcase,    bg: 'bg-orange-50', color: 'text-orange-500' },
    { label: 'Closed Deals',   value: stats.closedDeals,   icon: CheckCircle,  bg: 'bg-green-50',  color: 'text-green-500' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center flex-wrap">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => { setShowDropdown((v) => !v); setShowDatePicker(false); }}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium py-1.5 px-3 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            {timeFilter}
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-100 shadow-lg rounded-xl py-1.5 w-40 z-20 animate-in fade-in slide-in-from-top-2">
              {TIME_OPTIONS.map((opt) => (
                <button key={opt} onClick={() => { setTimeFilter(opt); setShowDropdown(false); }}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${timeFilter === opt ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}>
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="relative" ref={dateRef}>
          <button
            onClick={() => { setShowDatePicker((v) => !v); setShowDropdown(false); }}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium py-1.5 px-3 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            {formatDateLabel(dateFrom)} – {formatDateLabel(dateTo)}
          </button>
          {showDatePicker && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-100 shadow-lg rounded-xl p-4 z-20 w-72 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-900">Select Date Range</span>
                <button onClick={() => setShowDatePicker(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-500" /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">From</label>
                  <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">To</label>
                  <input type="date" value={dateTo} min={dateFrom} onChange={(e) => setDateTo(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
                <button onClick={() => setShowDatePicker(false)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">Apply</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <h3 className="text-2xl font-bold text-gray-900">{item.value.toLocaleString()}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}
