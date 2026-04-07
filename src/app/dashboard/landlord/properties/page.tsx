'use client';

import { useEffect, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  useLandlordDashboardStore,
  LandlordPropertyTab,
} from '@/lib/store/useLandlordDashboardStore';
import LandlordPropertyCard from '@/components/dashboard/landlord/LandlordPropertyCard';

const TABS: LandlordPropertyTab[] = ['All', 'Occupied', 'Vacant', 'Maintenance'];
const ITEMS_PER_PAGE = 6;

export default function LandlordPropertiesPage() {
  const {
    properties,
    propertiesLoading,
    fetchPropertiesMock,
    propertyTab,
    setPropertyTab,
    propertySearch,
    setPropertySearch,
  } = useLandlordDashboardStore();

  useEffect(() => {
    fetchPropertiesMock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabFiltered = useMemo(() => {
    if (propertyTab === 'All') return properties;
    return properties.filter((p) => p.status === propertyTab);
  }, [properties, propertyTab]);

  const filtered = useMemo(() => {
    if (!propertySearch.trim()) return tabFiltered;
    const q = propertySearch.toLowerCase();
    return tabFiltered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        (p.tenant?.toLowerCase().includes(q) ?? false)
    );
  }, [tabFiltered, propertySearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = 1;
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (propertiesLoading && properties.length === 0) {
    return (
      <div className="space-y-5 pb-12 w-full">
        <div className="flex border-b border-gray-200 gap-4 pb-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 rounded h-4 w-20" />
          ))}
        </div>
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden px-6 pb-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-xl h-40 w-full mb-3" />
                <div className="bg-gray-200 rounded h-4 w-3/4 mb-2" />
                <div className="bg-gray-200 rounded h-3 w-1/2 mb-2" />
                <div className="bg-gray-200 rounded h-3 w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-12 w-full">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 w-full overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setPropertyTab(tab)}
            className={`py-3 px-6 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              propertyTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            {propertyTab === 'All' ? 'All Properties' : `${propertyTab} Properties`}
          </h3>
          <div className="relative w-full sm:w-72">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={propertySearch}
              onChange={(e) => setPropertySearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Property Grid */}
        <div className="px-6 pb-6">
          {paginated.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">No properties found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {paginated.map((property) => (
                <LandlordPropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <span>Page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: Math.min(totalPages, 6) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
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
                <button disabled={currentPage === 1} className="bg-blue-600 text-white p-1.5 rounded-l-md hover:bg-blue-700 disabled:opacity-50">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="w-px h-8 bg-blue-700" />
                <button disabled={currentPage === totalPages} className="bg-blue-600 text-white p-1.5 rounded-r-md hover:bg-blue-700 disabled:opacity-50">
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
