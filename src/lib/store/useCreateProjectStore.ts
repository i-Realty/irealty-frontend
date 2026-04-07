import { create } from 'zustand';

export type DeveloperProjectType = 'Residential' | 'Commercial' | 'Off-Plan';

export interface ProjectMilestone {
  name: string;
  description: string;
  percentageOfTotal: number;
}

export interface DeveloperProject {
  id: string;
  createdAt: string;
  projectType: DeveloperProjectType;
  projectName: string;
  description: string;
  propertyTypeDropdown: string;
  totalUnits: string;
  bathrooms: string;
  bedrooms: string;
  toilets: string;
  plotSizeSqm: string;
  builtUpAreaSqm: string;
  expectedStartDate: string;
  expectedCompletionDate: string;
  stateGeo: string;
  city: string;
  fullAddress: string;
  documentTypes: string[];
  amenities: string[];
  landmark: string;
  milestones: ProjectMilestone[];
  media: string[];
  virtualTourUrl: string;
  price: number;
  tag: 'For Sale';
  image: string;
}

interface CreateProjectState {
  isOpen: boolean;
  currentStep: number;
  isLoading: boolean;
  error: string | null;

  // Edit mode
  isEditMode: boolean;
  editingProjectId: string | null;

  // Step 1
  projectType: DeveloperProjectType | null;

  // Step 2
  projectName: string;
  description: string;
  propertyTypeDropdown: string;
  totalUnits: string;
  bathrooms: string;
  bedrooms: string;
  toilets: string;
  plotSizeSqm: string;
  builtUpAreaSqm: string;
  expectedStartDate: string;
  expectedCompletionDate: string;
  stateGeo: string;
  city: string;
  fullAddress: string;
  documentTypes: string[];
  amenities: string[];
  landmark: string;

  // Step 3
  milestones: ProjectMilestone[];

  // Step 4
  media: string[];
  virtualTourUrl: string;

  // Actions
  openWizard: () => void;
  closeWizard: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  setField: (key: string, value: unknown) => void;
  addMilestone: () => void;
  updateMilestone: (index: number, data: Partial<ProjectMilestone>) => void;
  removeMilestone: (index: number) => void;
  addMedia: (url: string) => void;
  removeMedia: (index: number) => void;
  toggleDocumentType: (docType: string) => void;
  addAmenity: (amenity: string) => void;
  removeAmenity: (amenity: string) => void;
  submitProject: () => Promise<DeveloperProject | null>;
  resetForm: () => void;
  loadProjectForEdit: (project: DeveloperProject) => void;
  resetAndClose: () => void;
}

const DEFAULT_MILESTONES: ProjectMilestone[] = [
  { name: 'Initial Deposit', description: 'Available for payment', percentageOfTotal: 20 },
  { name: 'Foundation/Lock-Up', description: '', percentageOfTotal: 30 },
  { name: 'Roofing/Structure', description: '', percentageOfTotal: 30 },
  { name: 'Handover/Finishing', description: '', percentageOfTotal: 20 },
];

const initialFormState = {
  projectType: null as DeveloperProjectType | null,
  projectName: '',
  description: '',
  propertyTypeDropdown: '',
  totalUnits: '',
  bathrooms: '',
  bedrooms: '',
  toilets: '',
  plotSizeSqm: '',
  builtUpAreaSqm: '',
  expectedStartDate: '',
  expectedCompletionDate: '',
  stateGeo: '',
  city: '',
  fullAddress: '',
  documentTypes: ['Deed Of Transfer'] as string[],
  amenities: [] as string[],
  landmark: '',
  milestones: [...DEFAULT_MILESTONES],
  media: [] as string[],
  virtualTourUrl: '',
};

export const useCreateProjectStore = create<CreateProjectState>((set, get) => ({
  isOpen: false,
  currentStep: 1,
  isLoading: false,
  error: null,
  isEditMode: false,
  editingProjectId: null,
  ...initialFormState,

  openWizard: () => set({ isOpen: true, currentStep: 1 }),
  closeWizard: () => {
    set({ isOpen: false });
    get().resetForm();
  },
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 5) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),
  goToStep: (step) => set({ currentStep: step }),

  setField: (key, value) => set({ [key]: value } as Partial<CreateProjectState>),

  addMilestone: () =>
    set((s) => ({
      milestones: [...s.milestones, { name: '', description: '', percentageOfTotal: 0 }],
    })),

  updateMilestone: (index, data) =>
    set((s) => ({
      milestones: s.milestones.map((m, i) => (i === index ? { ...m, ...data } : m)),
    })),

  removeMilestone: (index) =>
    set((s) => ({
      milestones: s.milestones.filter((_, i) => i !== index),
    })),

  addMedia: (url) => set((s) => ({ media: [...s.media, url] })),
  removeMedia: (index) => set((s) => ({ media: s.media.filter((_, i) => i !== index) })),

  toggleDocumentType: (docType) =>
    set((s) => ({
      documentTypes: s.documentTypes.includes(docType)
        ? s.documentTypes.filter((d) => d !== docType)
        : [...s.documentTypes, docType],
    })),

  addAmenity: (amenity) => set((s) => ({ amenities: [...s.amenities, amenity] })),
  removeAmenity: (amenity) => set((s) => ({ amenities: s.amenities.filter((a) => a !== amenity) })),

  submitProject: async () => {
    set({ isLoading: true, error: null });
    await new Promise((r) => setTimeout(r, 1500));

    const s = get();
    if (!s.projectType || !s.projectName) {
      set({ isLoading: false, error: 'Missing required fields' });
      return null;
    }

    const project: DeveloperProject = {
      id: s.isEditMode && s.editingProjectId ? s.editingProjectId : `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
      projectType: s.projectType,
      projectName: s.projectName,
      description: s.description,
      propertyTypeDropdown: s.propertyTypeDropdown,
      totalUnits: s.totalUnits,
      bathrooms: s.bathrooms,
      bedrooms: s.bedrooms,
      toilets: s.toilets,
      plotSizeSqm: s.plotSizeSqm,
      builtUpAreaSqm: s.builtUpAreaSqm,
      expectedStartDate: s.expectedStartDate,
      expectedCompletionDate: s.expectedCompletionDate,
      stateGeo: s.stateGeo,
      city: s.city,
      fullAddress: s.fullAddress,
      documentTypes: s.documentTypes,
      amenities: s.amenities,
      landmark: s.landmark,
      milestones: s.milestones,
      media: s.media,
      virtualTourUrl: s.virtualTourUrl,
      price: 20000000,
      tag: 'For Sale',
      image: s.media[0] || '/images/property-placeholder.jpg',
    };

    set({ isLoading: false, isOpen: false });
    get().resetForm();
    return project;
  },

  resetForm: () => set({ currentStep: 1, error: null, isEditMode: false, editingProjectId: null, ...initialFormState, milestones: [...DEFAULT_MILESTONES] }),

  loadProjectForEdit: (project) => {
    set({
      isOpen: true,
      currentStep: 1,
      isEditMode: true,
      editingProjectId: project.id,
      projectType: project.projectType,
      projectName: project.projectName,
      description: project.description,
      propertyTypeDropdown: project.propertyTypeDropdown,
      totalUnits: project.totalUnits,
      bathrooms: project.bathrooms,
      bedrooms: project.bedrooms,
      toilets: project.toilets,
      plotSizeSqm: project.plotSizeSqm,
      builtUpAreaSqm: project.builtUpAreaSqm,
      expectedStartDate: project.expectedStartDate,
      expectedCompletionDate: project.expectedCompletionDate,
      stateGeo: project.stateGeo,
      city: project.city,
      fullAddress: project.fullAddress,
      documentTypes: project.documentTypes,
      amenities: project.amenities,
      landmark: project.landmark,
      milestones: project.milestones.length > 0 ? project.milestones : [...DEFAULT_MILESTONES],
      media: project.media,
      virtualTourUrl: project.virtualTourUrl,
    });
  },

  resetAndClose: () => {
    set({ isOpen: false, isEditMode: false, editingProjectId: null, currentStep: 1, error: null, ...initialFormState, milestones: [...DEFAULT_MILESTONES] });
  },
}));
