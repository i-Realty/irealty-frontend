import { create } from 'zustand';
import { DeveloperProject } from './useCreateProjectStore';

// --- Mock Data ---
export const mockDeveloperProjects: DeveloperProject[] = Array.from({ length: 8 }, (_, i) => ({
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

interface DeveloperProjectsState {
  projects: DeveloperProject[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProjects: () => Promise<void>;
  addProjectLocally: (project: DeveloperProject) => void;
  updateProjectLocally: (project: DeveloperProject) => void;
  deleteProject: (id: string) => Promise<boolean>;
  getProjectById: (id: string) => DeveloperProject | undefined;
}

export const useDeveloperProjectsStore = create<DeveloperProjectsState>((set, get) => ({
  projects: [],
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({ projects: mockDeveloperProjects, isLoading: false });
  },

  addProjectLocally: (project) => {
    set((state) => ({
      projects: [project, ...state.projects],
    }));
  },

  updateProjectLocally: (project) => {
    set((state) => ({
      projects: state.projects.map((p) => (p.id === project.id ? project : p)),
    }));
  },

  deleteProject: async (id) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 600));
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      isLoading: false,
    }));
    return true;
  },

  getProjectById: (id) => {
    return get().projects.find((p) => p.id === id);
  },
}));
