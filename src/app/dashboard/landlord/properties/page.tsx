'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronLeft, ChevronRight, X, Wrench, Loader2 } from 'lucide-react';
import {
  useLandlordDashboardStore,
  LandlordPropertyTab,
  LandlordProperty,
} from '@/lib/store/useLandlordDashboardStore';
import LandlordPropertyCard from '@/components/dashboard/landlord/LandlordPropertyCard';

const TABS: LandlordPropertyTab[] = ['All', 'Occupied', 'Vacant', 'Maintenance'];
const ITEMS_PER_PAGE = 6;

// ── List Property Modal ────────────────────────────────────────────────

function ListPropertyModal({ property: p, onClose }: { property: LandlordProperty; onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleList = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">List Property</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        {done ? (
          <div className="text-center py-4 space-y-3">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="font-bold text-gray-900">Listing Submitted</h3>
            <p className="text-sm text-gray-500"><span className="font-semibold">{p.title}</span> has been submitted for listing review. It will be live on the platform within 24 hours.</p>
            <button onClick={onClose} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">Done</button>
          </div>
        ) : (
          <>
            <div className="bg-blue-50/60 rounded-xl p-4 mb-4 text-sm space-y-1">
              <p className="font-semibold text-gray-900">{p.title}</p>
              <p className="text-gray-500">{p.location}</p>
              <p className="text-blue-700 font-medium">Rent: {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(p.monthlyRent).replace('NGN', '₦')} / month</p>
            </div>
            <p className="text-sm text-gray-500 mb-4">This will publish your property on i-Realty for prospective tenants to view and inquire about.</p>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleList} disabled={isSubmitting} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting…</> : 'List Now'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Track Repairs Modal ────────────────────────────────────────────────

const REPAIR_CATEGORIES = ['Plumbing', 'Electrical', 'Structural', 'HVAC / AC', 'Painting', 'Cleaning', 'Other'];

function TrackRepairsModal({ property: p, onClose }: { property: LandlordProperty; onClose: () => void }) {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center"><Wrench className="w-4 h-4 text-amber-600" /></div>
            <h2 className="text-lg font-bold text-gray-900">Track Repairs</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        {done ? (
          <div className="text-center py-4 space-y-3">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="font-bold text-gray-900">Repair Request Logged</h3>
            <p className="text-sm text-gray-500">Your <span className="font-semibold">{category}</span> repair request for <span className="font-semibold">{p.title}</span> has been logged.</p>
            <button onClick={onClose} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-gray-500">Property: <span className="font-semibold text-gray-900">{p.title}</span></p>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Repair Category</label>
              <div className="grid grid-cols-2 gap-2">
                {REPAIR_CATEGORIES.map((cat) => (
                  <label key={cat} className={`flex items-center gap-2 cursor-pointer p-2.5 rounded-lg border transition-colors ${category === cat ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-amber-200'}`}>
                    <input type="radio" name="category" value={cat} checked={category === cat} onChange={() => setCategory(cat)} className="accent-amber-500 w-4 h-4" />
                    <span className="text-sm font-medium text-gray-700">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the issue..." rows={3}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-300" />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button type="submit" disabled={!category || isSubmitting} className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" />Logging…</> : 'Log Repair'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────

export default function LandlordPropertiesPage() {
  const router = useRouter();
  const {
    properties, propertiesLoading, fetchPropertiesMock,
    propertyTab, setPropertyTab, propertySearch, setPropertySearch,
  } = useLandlordDashboardStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [listModal, setListModal] = useState<LandlordProperty | null>(null);
  const [repairsModal, setRepairsModal] = useState<LandlordProperty | null>(null);

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
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleTabChange = (tab: LandlordPropertyTab) => {
    setPropertyTab(tab);
    setCurrentPage(1);
  };

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
                <div className="bg-gray-200 rounded h-3 w-1/2" />
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
            onClick={() => handleTabChange(tab)}
            className={`py-3 px-6 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              propertyTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

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
              onChange={(e) => { setPropertySearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="px-6 pb-6">
          {paginated.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">No properties found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {paginated.map((property) => (
                <LandlordPropertyCard
                  key={property.id}
                  property={property}
                  onViewDetails={() => router.push('/listings')}
                  onMessageTenant={() => router.push('/dashboard/landlord/messages')}
                  onListProperty={() => setListModal(property)}
                  onTrackRepairs={() => setRepairsModal(property)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <span>Page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: Math.min(totalPages, 6) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                    currentPage === page ? 'border border-blue-500 text-gray-900 bg-white' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {page}
                </button>
              ))}
              <div className="flex items-center ml-3">
                <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="bg-blue-600 text-white p-1.5 rounded-l-md hover:bg-blue-700 disabled:opacity-50">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="w-px h-8 bg-blue-700" />
                <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="bg-blue-600 text-white p-1.5 rounded-r-md hover:bg-blue-700 disabled:opacity-50">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {listModal && <ListPropertyModal property={listModal} onClose={() => setListModal(null)} />}
      {repairsModal && <TrackRepairsModal property={repairsModal} onClose={() => setRepairsModal(null)} />}
    </div>
  );
}
