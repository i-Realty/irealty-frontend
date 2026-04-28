import { create } from 'zustand';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client';
import { usePropertyStore } from './usePropertyStore';
import { useAuthStore } from './useAuthStore';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

// --- Types ---
export type PropertyCategory = 'Residential' | 'Commercial' | 'Plots/Lands' | 'Service Apartments & Short Lets' | 'PG/Hostel';
export type ListingType = 'For Sale' | 'For Rent';
export type PropertyStatus = 'Under Construction' | 'Ready';

export interface AgentProperty {
  id: string;
  createdAt: string;
  propertyCategory: PropertyCategory;
  listingType: ListingType;
  propertyStatus: PropertyStatus;

  title: string;
  description: string;
  state: string;
  lga?: string;
  city: string;
  address: string;
  landmarks: string[];

  price: number;
  bedrooms?: number | string;
  bathrooms?: number | string;
  sizeSqm?: number | string;

  amenities: string[];
  media: string[];
  virtualTourUrl?: string;

  priceType?: 'Per Month' | 'Every 6 Months' | 'Per Year';
  securityDeposit?: number;
  agencyFee?: number;
  legalFee?: number;
  cautionFee?: number;

  documentTypes?: string[];
  zoningType?: string;

  unitsFloors?: number | string;
  parkingCapacity?: number | string;
  floorAreaSqm?: number | string;

  roomType?: string;
  utilitiesIncluded?: string;
}

// --- Mock Data ---
export const mockAgentProperties: AgentProperty[] = [
  {
    id: 'prop-001',
    createdAt: new Date().toISOString(),
    propertyCategory: 'Plots/Lands',
    listingType: 'For Sale',
    propertyStatus: 'Ready',
    title: 'Residential Plot - GRA Enugu',
    description: 'The project aims to provide a luxurious, and comfortable lifestyle for its residents. The apartments are thoughtfully designed with stylish interiors and open spaces to let in fresh air and natural light. Located in a well-connected and pleasant area, DLF West Park offers a peaceful environment with a modern touch...',
    state: 'Enugu',
    city: 'Enugu',
    address: 'Independence Layout, Enugu',
    landmarks: ['Near SPAR Mall'],
    price: 20000000.00,
    bedrooms: 3,
    bathrooms: 2,
    sizeSqm: 120,
    amenities: ['Road Access', 'Fenced / Gated'],
    media: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687931-cebf0046d4e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    documentTypes: ['C of O'],
    zoningType: 'Residential',
  },
  {
    id: 'prop-002',
    createdAt: new Date().toISOString(),
    propertyCategory: 'Plots/Lands',
    listingType: 'For Rent',
    propertyStatus: 'Ready',
    title: 'Residential Plot - GRA Enugu',
    description: 'A beautiful plot ready for leasing.',
    state: 'Enugu',
    city: 'Enugu',
    address: 'Independence Layout, Enugu',
    landmarks: [],
    price: 2500000.00,
    priceType: 'Per Year',
    bedrooms: 3,
    bathrooms: 2,
    sizeSqm: 120,
    amenities: ['Swampy Soil'],
    media: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
  },
  {
    id: 'prop-003',
    createdAt: new Date().toISOString(),
    propertyCategory: 'Residential',
    listingType: 'For Sale',
    propertyStatus: 'Ready',
    title: 'Brand New 4 Bed Duplex',
    description: 'Fully detached 4 bedroom duplex with BQ.',
    state: 'Lagos',
    city: 'Lekki',
    address: 'Chevron Drive, Lekki',
    landmarks: ['Chevron Toll Gate'],
    price: 150000000.00,
    bedrooms: 4,
    bathrooms: 5,
    sizeSqm: 350,
    amenities: ['POP Ceiling', 'Kitchen-Fitted', 'En-suite', 'Security Access / CCTV'],
    media: ['https://images.unsplash.com/photo-1600607687931-cebf0046d4e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
  },
];

interface AgentPropertiesState {
  properties: AgentProperty[];
  isLoading: boolean;
  error: string | null;

  activeTab: 'For Sale' | 'For Rent';
  activeFilter: 'All' | PropertyCategory;
  searchQuery: string;
  page: number;

  fetchProperties: () => Promise<void>;
  setActiveTab: (tab: 'For Sale' | 'For Rent') => void;
  setActiveFilter: (filter: 'All' | PropertyCategory) => void;
  setSearchQuery: (query: string) => void;
  setPage: (page: number) => void;
  deleteProperty: (id: string) => Promise<boolean>;
  addProperty: (prop: AgentProperty) => Promise<void>;
  getPropertyById: (id: string) => AgentProperty | undefined;
  updateProperty: (prop: AgentProperty) => Promise<void>;

  /** @deprecated Use addProperty() */
  addPropertyLocally: (prop: AgentProperty) => void;
  /** @deprecated Use updateProperty() */
  updatePropertyLocally: (prop: AgentProperty) => void;
}

export const useAgentPropertiesStore = create<AgentPropertiesState>((set, get) => ({
  properties: [],
  isLoading: false,
  error: null,

  activeTab: 'For Sale',
  activeFilter: 'All',
  searchQuery: '',
  page: 1,

  fetchProperties: async () => {
    set({ isLoading: true, error: null });
    try {
      if (USE_API) {
        const data = await apiGet<{ properties: AgentProperty[] }>('/api/agent/properties');
        set({ properties: data.properties, isLoading: false });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
        set({ properties: mockAgentProperties, isLoading: false });
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'An error occurred', isLoading: false });
    }
  },

  setActiveTab: (tab) => set({ activeTab: tab, page: 1 }),
  setActiveFilter: (filter) => set({ activeFilter: filter, page: 1 }),
  setSearchQuery: (query) => set({ searchQuery: query, page: 1 }),
  setPage: (page) => set({ page }),

  deleteProperty: async (id) => {
    set({ isLoading: true, error: null });
    try {
      if (USE_API) {
        await apiDelete(`/api/agent/properties/${id}`);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
      set((state) => ({ properties: state.properties.filter(p => p.id !== id), isLoading: false }));
      return true;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'An error occurred', isLoading: false });
      return false;
    }
  },

  addProperty: async (prop) => {
    if (USE_API) {
      await apiPost('/api/agent/properties', prop);
    }
    set((state) => ({
      properties: [prop, ...state.properties],
      activeTab: prop.listingType,
      activeFilter: 'All',
      page: 1,
    }));
    // Submit to unified property store for admin moderation
    const user = useAuthStore.getState().user;
    usePropertyStore.getState().submitForReview({
      source: 'agent',
      ownerId: user?.id ?? prop.id,
      ownerName: user?.name ?? 'Agent',
      ownerRole: 'Agent',
      ownerAvatar: user?.avatarUrl,
      title: prop.title,
      description: prop.description,
      category: prop.propertyCategory as import('./usePropertyStore').PropertyCategory,
      listingType: prop.listingType,
      price: prop.price,
      priceType: prop.priceType,
      state: prop.state,
      city: prop.city,
      address: prop.address,
      landmarks: prop.landmarks,
      bedrooms: typeof prop.bedrooms === 'number' ? prop.bedrooms : undefined,
      bathrooms: typeof prop.bathrooms === 'number' ? prop.bathrooms : undefined,
      sizeSqm: typeof prop.sizeSqm === 'number' ? prop.sizeSqm : undefined,
      amenities: prop.amenities,
      media: prop.media,
      virtualTourUrl: prop.virtualTourUrl,
    });
  },

  getPropertyById: (id) => get().properties.find(p => p.id === id),

  updateProperty: async (prop) => {
    if (USE_API) {
      await apiPut(`/api/agent/properties/${prop.id}`, prop);
    }
    set((state) => ({
      properties: state.properties.map(p => p.id === prop.id ? prop : p),
      activeTab: prop.listingType,
      activeFilter: 'All',
      page: 1,
    }));
  },

  // Backward-compatible aliases
  addPropertyLocally: (prop) => { void get().addProperty(prop); },
  updatePropertyLocally: (prop) => { void get().updateProperty(prop); },
}));
