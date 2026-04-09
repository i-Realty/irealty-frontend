'use client';

'use client';

import { useEffect, useState } from 'react';
import { useAgentPropertiesStore, PropertyCategory } from '@/lib/store/useAgentPropertiesStore';
import { useCreatePropertyStore } from '@/lib/store/useCreatePropertyStore';
import AgentPropertyCard from '@/components/dashboard/agent/property-create/AgentPropertyCard';
import EmptyState from '@/components/dashboard/agent/property-create/EmptyState';
import CreatePropertyModal from '@/components/dashboard/agent/property-create/CreatePropertyModal';
import { Bell, ChevronDown, Plus, Search } from 'lucide-react';
import Image from 'next/image';

const FILTERS: { label: string; value: 'All' | PropertyCategory }[] = [
  { label: 'All', value: 'All' },
  { label: 'Residential', value: 'Residential' },
  { label: 'Commercial', value: 'Commercial' },
  { label: 'Plots/Lands', value: 'Plots/Lands' },
  { label: 'Service Apartments & Short Lets', value: 'Service Apartments & Short Lets' },
  { label: 'PG/Hostel', value: 'PG/Hostel' },
];

export default function MyPropertiesPage() {
  const {
    properties, isLoading, fetchProperties, activeTab, setActiveTab,
    activeFilter, setActiveFilter, searchQuery, setSearchQuery, deleteProperty,
    getPropertyById
  } = useAgentPropertiesStore();

  const { openWizard, loadPropertyForEdit } = useCreatePropertyStore();
  
  const [localSearch, setLocalSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Initial fetch
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Handle local search sync
  useEffect(() => {
    const timer = setTimeout(() => { setSearchQuery(localSearch); setCurrentPage(1); }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery]);

  // Reset page on tab/filter change
  useEffect(() => { setCurrentPage(1); }, [activeTab, activeFilter]);

  // Derived filtered properties
  const filteredProperties = properties.filter(p => {
    if (p.listingType !== activeTab) return false;
    if (activeFilter !== 'All' && p.propertyCategory !== activeFilter) return false;
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase()) && !p.address.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProperties.length / ITEMS_PER_PAGE));
  const paginatedProperties = filteredProperties.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-6 pb-12 w-full">
      <div className="flex flex-col space-y-4">
          <h1 className="text-[22px] font-bold text-gray-900 md:hidden pb-2">My Properties</h1>
          {/* Top Tabs and Action Button row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex border-b border-gray-200 w-full md:w-auto overflow-x-auto no-scrollbar">
              <button 
                className={`flex-1 md:flex-none py-3 px-6 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'For Sale' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('For Sale')}
              >
                For Sale
              </button>
              <button 
                className={`flex-1 md:flex-none py-3 px-6 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'For Rent' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('For Rent')}
              >
                For Rent
              </button>
            </div>
            
            <button 
              onClick={openWizard}
              className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg items-center gap-2 transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              New Listing
            </button>
          </div>

          {/* Sub Filters & Search */}
          <div className="flex flex-col space-y-4">
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setActiveFilter(f.value)}
                    className={`whitespace-nowrap px-4 py-2 text-sm rounded-md transition-colors border ${
                      activeFilter === f.value 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                />
              </div>
          </div>
      </div>

      {/* Grid / Empty State */}
      {isLoading ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {Array.from({ length: 6 }).map((_, i) => (
             <div key={i} className="animate-pulse">
               <div className="bg-gray-200 rounded-xl h-40 w-full mb-3" />
               <div className="bg-gray-200 rounded h-4 w-3/4 mb-2" />
               <div className="bg-gray-200 rounded h-3 w-1/2 mb-2" />
               <div className="bg-gray-200 rounded h-3 w-1/3" />
             </div>
           ))}
         </div>
      ) : filteredProperties.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProperties.map(property => (
              <AgentPropertyCard 
                key={property.id} 
                property={property} 
                onEdit={(id) => {
                  const prop = getPropertyById(id);
                  if (prop) {
                    loadPropertyForEdit(prop);
                  }
                }}
                onDelete={(id) => {
                   if (confirm('Are you sure you want to delete this listing?')) {
                      deleteProperty(id);
                   }
                }} 
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 border-t border-gray-100 pt-4">
              <span className="text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 disabled:opacity-40 text-sm"
                >&lt;</button>
                {Array.from({ length: Math.min(totalPages, 6) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${
                      currentPage === page
                        ? 'border border-blue-600 bg-blue-50 text-blue-600'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >{page}</button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 disabled:opacity-40 text-sm"
                >&gt;</button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Mobile Floating Action Button */}
      <button
        onClick={openWizard}
        className="md:hidden fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl shadow-blue-600/30 transition-transform active:scale-95 focus:outline-none"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Render Modal if open */}
      <CreatePropertyModal />
    </div>
  );
}
