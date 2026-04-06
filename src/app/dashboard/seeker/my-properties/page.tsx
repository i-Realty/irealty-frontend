'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { useSeekerPropertiesStore, SeekerPropertyTab } from '@/lib/store/useSeekerPropertiesStore';
import SeekerPropertyCard from '@/components/dashboard/seeker/SeekerPropertyCard';

const TABS: SeekerPropertyTab[] = ['All', 'Owned', 'Rented'];

export default function SeekerMyPropertiesPage() {
  const { properties, isLoading, activeTab, setActiveTab, fetchPropertiesMock } = useSeekerPropertiesStore();

  useEffect(() => {
    fetchPropertiesMock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = activeTab === 'All'
    ? properties
    : properties.filter((p) => p.propertyType === activeTab);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  // Empty state
  if (properties.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <Home className="w-8 h-8 text-blue-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Properties Yet</h3>
        <p className="text-gray-500 text-sm text-center mb-6 max-w-xs">
          Start your journey today — explore listings, rent, or buy your dream property.
        </p>
        <Link
          href="/dashboard/seeker/search"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          Browse Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 w-full overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-6 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <SeekerPropertyCard key={p.id} property={p} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6 border-t border-gray-100 pt-4">
        <span className="text-sm text-gray-500">Page 1 of 30</span>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 text-sm">&lt;</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md border border-blue-600 bg-blue-50 text-blue-600 text-sm font-medium">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm">2</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm">3</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm">&gt;</button>
        </div>
      </div>
    </div>
  );
}
