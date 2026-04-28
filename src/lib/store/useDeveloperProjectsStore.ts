import { create } from 'zustand';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client';
import { DeveloperProject } from './useCreateProjectStore';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

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
  addProject: (project: DeveloperProject) => Promise<void>;
  updateProject: (project: DeveloperProject) => Promise<void>;
  deleteProject: (id: string) => Promise<boolean>;
  getProjectById: (id: string) => DeveloperProject | undefined;

  /** @deprecated Use addProject() */
  addProjectLocally: (project: DeveloperProject) => void;
  /** @deprecated Use updateProject() */
  updateProjectLocally: (project: DeveloperProject) => void;
}

export const useDeveloperProjectsStore = create<DeveloperProjectsState>((set, get) => ({
  projects: [],
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      if (USE_API) {
        const data = await apiGet<{ projects: DeveloperProject[] }>('/api/developer/projects');
        set({ projects: data.projects, isLoading: false });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
        set({ projects: mockDeveloperProjects, isLoading: false });
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed', isLoading: false });
    }
  },

  addProject: async (project) => {
    if (USE_API) {
      await apiPost('/api/developer/projects', project);
    }
    set((state) => ({ projects: [project, ...state.projects] }));
  },

  updateProject: async (project) => {
    if (USE_API) {
      await apiPut(`/api/developer/projects/${project.id}`, project);
    }
    set((state) => ({
      projects: state.projects.map((p) => (p.id === project.id ? project : p)),
    }));
  },

  deleteProject: async (id) => {
    set({ isLoading: true });
    try {
      if (USE_API) {
        await apiDelete(`/api/developer/projects/${id}`);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
      set((state) => ({ projects: state.projects.filter((p) => p.id !== id), isLoading: false }));
      return true;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed', isLoading: false });
      return false;
    }
  },

  getProjectById: (id) => get().projects.find((p) => p.id === id),

  // Backward-compatible aliases
  addProjectLocally: (project) => { void get().addProject(project); },
  updateProjectLocally: (project) => { void get().updateProject(project); },
}));
