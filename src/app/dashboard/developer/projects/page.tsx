'use client';

import { useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import { useCreateProjectStore, DeveloperProject } from '@/lib/store/useCreateProjectStore';
import DeveloperProjectCard from '@/components/dashboard/developer/projects/DeveloperProjectCard';
import ProjectEmptyState from '@/components/dashboard/developer/projects/ProjectEmptyState';
import CreateProjectModal from '@/components/dashboard/developer/projects/CreateProjectModal';

type TabKey = 'All' | 'Residential' | 'Commercial' | 'Off-Plan';

const TABS: TabKey[] = ['All', 'Residential', 'Commercial', 'Off-Plan'];

// Mock projects for populated state
const MOCK_PROJECTS: DeveloperProject[] = Array.from({ length: 8 }, (_, i) => ({
  id: `proj-${i + 1}`,
  createdAt: new Date().toISOString(),
  projectType: (['Residential', 'Commercial', 'Off-Plan'] as const)[i % 3],
  projectName: 'Residential Plot \u2013 GRA Enugu',
  description: 'A luxury residential development',
  propertyTypeDropdown: 'Detached Duplex',
  totalUnits: '30',
  bathrooms: '2',
  bedrooms: '3',
  toilets: '3',
  plotSizeSqm: '120',
  builtUpAreaSqm: '350',
  expectedStartDate: '2024-05-02',
  expectedCompletionDate: '2024-05-02',
  stateGeo: 'Enugu',
  city: 'Enugu',
  fullAddress: 'Independence Layout, Enugu',
  documentTypes: ['C Of O'],
  amenities: ['Swimming Pool', 'Gym'],
  landmark: 'Near GRA Junction',
  milestones: [],
  media: [],
  virtualTourUrl: '',
  price: 20000000,
  tag: 'For Sale',
  image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
}));

export default function DeveloperProjectsPage() {
  const openWizard = useCreateProjectStore((s) => s.openWizard);
  const loadProjectForEdit = useCreateProjectStore((s) => s.loadProjectForEdit);
  const [activeTab, setActiveTab] = useState<TabKey>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [projects] = useState<DeveloperProject[]>(MOCK_PROJECTS);

  const filtered = useMemo(() => {
    let result = projects;
    if (activeTab !== 'All') {
      result = result.filter((p) => p.projectType === activeTab);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.projectName.toLowerCase().includes(q) || p.fullAddress.toLowerCase().includes(q)
      );
    }
    return result;
  }, [projects, activeTab, searchQuery]);

  const isEmpty = projects.length === 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {!isEmpty && (
          <button
            onClick={openWizard}
            className="hidden md:flex items-center gap-2 bg-blue-600 text-white font-medium py-2.5 px-5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> New Project
          </button>
        )}
      </div>

      {isEmpty ? (
        <ProjectEmptyState />
      ) : (
        <>
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((project) => (
              <DeveloperProjectCard key={project.id} project={project} onEdit={(id) => {
                const proj = MOCK_PROJECTS.find((p) => p.id === id);
                if (proj) loadProjectForEdit(proj);
              }} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-sm text-gray-500 pt-4">
            <span>Page 1 of 30</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6].map((page) => (
                <button
                  key={page}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    page === 3 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <div className="flex gap-1 ml-2">
                <button className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm">&lt;</button>
                <button className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm">&gt;</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile FAB */}
      {!isEmpty && (
        <button
          onClick={openWizard}
          className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center z-40 hover:bg-blue-700"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      <CreateProjectModal />
    </div>
  );
}
