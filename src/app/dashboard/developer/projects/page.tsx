'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, ChevronDown, X } from 'lucide-react';
import { useCreateProjectStore } from '@/lib/store/useCreateProjectStore';
import { useDeveloperProjectsStore } from '@/lib/store/useDeveloperProjectsStore';
import DeveloperProjectCard from '@/components/dashboard/developer/projects/DeveloperProjectCard';
import ProjectEmptyState from '@/components/dashboard/developer/projects/ProjectEmptyState';
import CreateProjectModal from '@/components/dashboard/developer/projects/CreateProjectModal';

type TabKey = 'All' | 'Residential' | 'Commercial' | 'Off-Plan';
const TABS: TabKey[] = ['All', 'Residential', 'Commercial', 'Off-Plan'];
const ITEMS_PER_PAGE = 12;

type TimeFilter = 'All time' | 'This week' | 'This month' | 'This year';
const TIME_OPTIONS: TimeFilter[] = ['All time', 'This week', 'This month', 'This year'];

export default function DeveloperProjectsPage() {
  const router = useRouter();
  const openWizard = useCreateProjectStore((s) => s.openWizard);
  const loadProjectForEdit = useCreateProjectStore((s) => s.loadProjectForEdit);
  const { projects, fetchProjects } = useDeveloperProjectsStore();

  const [activeTab, setActiveTab] = useState<TabKey>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('All time');
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateFrom, setDateFrom] = useState('2023-12-12');
  const [dateTo, setDateTo] = useState('2023-12-14');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (projects.length === 0) fetchProjects();
  }, [projects.length, fetchProjects]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowTimeDropdown(false);
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) setShowDatePicker(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    let result = projects;
    if (activeTab !== 'All') result = result.filter((p) => p.projectType === activeTab);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.projectName.toLowerCase().includes(q) || p.fullAddress.toLowerCase().includes(q));
    }
    return result;
  }, [projects, activeTab, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleTabChange = (tab: TabKey) => { setActiveTab(tab); setCurrentPage(1); };
  const handleSearch = (val: string) => { setSearchQuery(val); setCurrentPage(1); };

  const formatDateLabel = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const isEmpty = projects.length === 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2 flex-wrap">
          {TABS.map((tab) => (
            <button key={tab} onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {tab}
            </button>
          ))}
        </div>
        {!isEmpty && (
          <button onClick={openWizard} className="hidden md:flex items-center gap-2 bg-blue-600 text-white font-medium py-2.5 px-5 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" /> New Project
          </button>
        )}
      </div>

      {isEmpty ? (
        <ProjectEmptyState />
      ) : (
        <>
          {/* Date Filters + Search */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Time filter */}
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => { setShowTimeDropdown((v) => !v); setShowDatePicker(false); }}
                className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                {timeFilter} <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showTimeDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showTimeDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-100 shadow-lg rounded-xl py-1.5 w-40 z-20 animate-in fade-in slide-in-from-top-2">
                  {TIME_OPTIONS.map((opt) => (
                    <button key={opt} onClick={() => { setTimeFilter(opt); setShowTimeDropdown(false); }}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors ${timeFilter === opt ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Date range */}
            <div className="relative" ref={dateRef}>
              <button onClick={() => { setShowDatePicker((v) => !v); setShowTimeDropdown(false); }}
                className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                {formatDateLabel(dateFrom)} – {formatDateLabel(dateTo)}
              </button>
              {showDatePicker && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-100 shadow-lg rounded-xl p-4 z-20 w-72 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-900">Date Range</span>
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
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {paginated.length === 0 ? (
              <div className="col-span-full py-16 text-center text-gray-400">No projects found</div>
            ) : paginated.map((project) => (
              <DeveloperProjectCard
                key={project.id}
                project={project}
                onViewDetails={(id) => router.push(`/dashboard/developer/projects/${id}`)}
                onEdit={(id) => { const proj = projects.find((p) => p.id === id); if (proj) loadProjectForEdit(proj); }}
                onDelete={() => {}}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-gray-500 pt-4">
              <span>Page {currentPage} of {totalPages}</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 8) }, (_, i) => i + 1).map((page) => (
                  <button key={page} onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === page ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                    {page}
                  </button>
                ))}
                <div className="flex gap-1 ml-2">
                  <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}
                    className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center disabled:opacity-50 text-sm">
                    &lt;
                  </button>
                  <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}
                    className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center disabled:opacity-50 text-sm">
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Mobile FAB */}
      {!isEmpty && (
        <button onClick={openWizard}
          className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center z-40 hover:bg-blue-700">
          <Plus className="w-6 h-6" />
        </button>
      )}

      <CreateProjectModal />
    </div>
  );
}
