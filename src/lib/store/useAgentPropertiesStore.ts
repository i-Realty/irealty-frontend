import { create } from 'zustand';

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
  city: string;
  address: string;
  landmarks: string[];
  
  // High level stats for cards
  price: number;
  bedrooms?: number | string;
  bathrooms?: number | string;
  sizeSqm?: number | string;
  
  // Specifics
  amenities: string[];
  media: string[];
  virtualTourUrl?: string;

  // Rent Pricing specifics
  priceType?: 'Per Month' | 'Every 6 Months' | 'Per Year';
  securityDeposit?: number;
  agencyFee?: number;
  legalFee?: number;
  cautionFee?: number;
  
  // Land specifics
  documentTypes?: string[];
  zoningType?: string;
  
  // Commercial specifics
  unitsFloors?: number | string;
  parkingCapacity?: number | string;
  floorAreaSqm?: number | string;
  
  // PG specifics
  roomType?: string;
  utilitiesIncluded?: string;
}

// --- Mock Data ---
const mockImage1 = '/images/house1.jpg'; // We'll assume a placeholder exists or use an external URL

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
      'https://images.unsplash.com/photo-1600607687931-cebf0046d4e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
    media: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
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
    media: [
      'https://images.unsplash.com/photo-1600607687931-cebf0046d4e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
  }
];

interface AgentPropertiesState {
  properties: AgentProperty[];
  isLoading: boolean;
  error: string | null;
  
  // Filters
  activeTab: 'For Sale' | 'For Rent';
  activeFilter: 'All' | PropertyCategory;
  searchQuery: string;
  page: number;

  // Actions
  fetchProperties: () => Promise<void>;
  setActiveTab: (tab: 'For Sale' | 'For Rent') => void;
  setActiveFilter: (filter: 'All' | PropertyCategory) => void;
  setSearchQuery: (query: string) => void;
  setPage: (page: number) => void;
  deleteProperty: (id: string) => Promise<boolean>;
  addPropertyLocally: (prop: AgentProperty) => void;
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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({ properties: mockAgentProperties, isLoading: false });
  },

  setActiveTab: (tab) => set({ activeTab: tab, page: 1 }),
  setActiveFilter: (filter) => set({ activeFilter: filter, page: 1 }),
  setSearchQuery: (query) => set({ searchQuery: query, page: 1 }),
  setPage: (page) => set({ page }),

  deleteProperty: async (id) => {
    set({ isLoading: true });
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    set((state) => ({
      properties: state.properties.filter(p => p.id !== id),
      isLoading: false
    }));
    return true;
  },

  addPropertyLocally: (prop) => {
    set((state) => ({
      properties: [prop, ...state.properties],
      // Switch back to the newly created property's tab to show it
      activeTab: prop.listingType,
      activeFilter: 'All',
      page: 1
    }));
  }
}));
