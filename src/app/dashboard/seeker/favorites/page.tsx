'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { useFavouritesStore } from '@/lib/store/useFavouritesStore';
import { standardProperties, developerProperties } from '@/lib/data/properties';
import PropertyCard from '@/components/shared/PropertyCard';

const CATEGORY_TABS = [
  'All',
  'Residential',
  'Commercial',
  'Plots/Lands',
  'Service Apartments & Short Lets',
  'PG/Hostel',
] as const;
type CategoryTab = (typeof CATEGORY_TABS)[number];

const ITEMS_PER_PAGE = 6;

export default function SeekerFavoritesPage() {
  const { likedIds } = useFavouritesStore();
  const [activeCategory, setActiveCategory] = useState<CategoryTab>('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Derive liked properties from all available property sources
  // When backend is integrated (NEXT_PUBLIC_USE_API=true), replace with GET /api/seeker/favorites
  const allProperties = useMemo(() => [...standardProperties, ...developerProperties], []);
  const likedProperties = useMemo(
    () => allProperties.filter((p) => likedIds.has(String(p.id))),
    [likedIds, allProperties]
  );

  // Map tab labels to title keywords (titles follow "N Bed <Type> ..." convention)
  const CATEGORY_KEYWORD_MAP: Record<CategoryTab, string | null> = {
    'All': null,
    'Residential': 'residential',
    'Commercial': 'commercial',
    'Plots/Lands': 'plot',
    'Service Apartments & Short Lets': 'service',
    'PG/Hostel': 'pg/hostel',
  };

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return likedProperties;
    const keyword = CATEGORY_KEYWORD_MAP[activeCategory];
    if (!keyword) return likedProperties;
    return likedProperties.filter((p) => p.title.toLowerCase().includes(keyword));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [likedProperties, activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Empty state
  if (likedProperties.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <Home className="w-8 h-8 text-blue-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Properties Found!</h3>
        <p className="text-gray-500 text-sm text-center mb-6 max-w-xs">
          Properties you save will appear here. Explore properties and add some properties to your saved dashboard.
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
    <div className="space-y-5 pb-12 w-full">
      {/* Category tabs */}
      <div className="flex border-b border-gray-200 w-full overflow-x-auto no-scrollbar">
        {CATEGORY_TABS.map((cat) => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
            className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {paginated.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-4">
        <span className="text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 disabled:opacity-40 text-sm"
          >
            &lt;
          </button>
          {Array.from({ length: Math.min(totalPages, 6) }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${
                currentPage === page
                  ? 'border border-blue-600 bg-blue-50 text-blue-600'
                  : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 disabled:opacity-40 text-sm"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
