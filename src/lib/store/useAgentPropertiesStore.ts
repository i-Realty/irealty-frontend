import { create } from 'zustand';
import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from '@/lib/api/client';
import { usePropertyStore } from './usePropertyStore';
import { useAuthStore } from './useAuthStore';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

// ---------------------------------------------------------------------------
// Backend ↔ frontend field mapping helpers
// ---------------------------------------------------------------------------
const PROPERTY_TYPE_MAP: Record<string, string> = {
  RESIDENTIAL: 'Residential', COMMERCIAL: 'Commercial',
  LAND: 'Plots/Lands', SHORT_LET: 'Service Apartments & Short Lets', PG_HOSTEL: 'PG/Hostel',
};
const PROPERTY_TYPE_TO_BACKEND: Record<string, string> = {
  Residential: 'RESIDENTIAL', Commercial: 'COMMERCIAL',
  'Plots/Lands': 'LAND', 'Service Apartments & Short Lets': 'SHORT_LET', 'PG/Hostel': 'PG_HOSTEL',
};
const LISTING_TYPE_MAP: Record<string, string> = { FOR_SALE: 'For Sale', FOR_RENT: 'For Rent' };
const LISTING_TYPE_TO_BACKEND: Record<string, string> = { 'For Sale': 'FOR_SALE', 'For Rent': 'FOR_RENT' };
const PROPERTY_STATUS_MAP: Record<string, string> = { UNDER_CONSTRUCTION: 'Under Construction', READY: 'Ready' };
const PROPERTY_STATUS_TO_BACKEND: Record<string, string> = { 'Under Construction': 'UNDER_CONSTRUCTION', Ready: 'READY' };
const PRICE_TYPE_MAP: Record<string, string> = { PER_MONTH: 'Per Month', EVERY_6_MONTHS: 'Every 6 Months', PER_YEAR: 'Per Year' };
const PRICE_TYPE_TO_BACKEND: Record<string, string> = { 'Per Month': 'PER_MONTH', 'Every 6 Months': 'EVERY_6_MONTHS', 'Per Year': 'PER_YEAR' };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBackendListing(l: Record<string, any>): AgentProperty {
  return {
    id:               String(l.id),
    createdAt:        l.createdAt ?? new Date().toISOString(),
    propertyCategory: (PROPERTY_TYPE_MAP[l.propertyType] ?? l.propertyType ?? 'Residential') as import('./useAgentPropertiesStore').PropertyCategory,
    listingType:      (LISTING_TYPE_MAP[l.listingType] ?? 'For Sale') as import('./useAgentPropertiesStore').ListingType,
    propertyStatus:   (PROPERTY_STATUS_MAP[l.propertyStatus] ?? 'Ready') as import('./useAgentPropertiesStore').PropertyStatus,
    title:            l.title ?? '',
    description:      l.description ?? '',
    state:            l.state ?? '',
    city:             l.city ?? '',
    address:          l.fullAddress ?? l.address ?? '',
    landmarks:        l.landmarks ?? [],
    price:            l.price ?? 0,
    priceType:        PRICE_TYPE_MAP[l.priceType] as AgentProperty['priceType'],
    bedrooms:         l.bedrooms,
    bathrooms:        l.bathrooms,
    sizeSqm:          l.sizeSqm,
    amenities:        l.amenities ?? [],
    media:            (l.images ?? []).map((img: Record<string, unknown>) => String(img.url)),
    virtualTourUrl:   l.virtualTourUrl,
    securityDeposit:  l.securityDeposit,
    agencyFee:        l.agencyFee,
    legalFee:         l.legalFee,
    cautionFee:       l.cautionFee,
    documentTypes:    l.documentTypes,
    zoningType:       l.zoningType,
    unitsFloors:      l.unitsFloors,
    parkingCapacity:  l.parkingCapacity,
    floorAreaSqm:     l.floorAreaSqm,
    roomType:         l.roomType,
    utilitiesIncluded: Array.isArray(l.utilitiesIncluded)
      ? l.utilitiesIncluded.join(', ')
      : l.utilitiesIncluded,
  };
}

function toBackendListing(prop: AgentProperty): Record<string, unknown> {
  return {
    propertyType:   PROPERTY_TYPE_TO_BACKEND[prop.propertyCategory] ?? 'RESIDENTIAL',
    listingType:    LISTING_TYPE_TO_BACKEND[prop.listingType] ?? 'FOR_SALE',
    propertyStatus: PROPERTY_STATUS_TO_BACKEND[prop.propertyStatus] ?? 'READY',
    title:          prop.title,
    description:    prop.description,
    state:          prop.state,
    city:           prop.city,
    fullAddress:    prop.address,
    landmarks:      prop.landmarks,
    amenities:      prop.amenities,
    bedrooms:       prop.bedrooms,
    bathrooms:      prop.bathrooms,
    sizeSqm:        prop.sizeSqm,
    price:          prop.price,
    priceType:      prop.priceType ? PRICE_TYPE_TO_BACKEND[prop.priceType] : undefined,
    securityDeposit: prop.securityDeposit,
    agencyFee:      prop.agencyFee,
    legalFee:       prop.legalFee,
    cautionFee:     prop.cautionFee,
    virtualTourUrl: prop.virtualTourUrl,
    documentTypes:  prop.documentTypes,
    zoningType:     prop.zoningType,
    unitsFloors:    prop.unitsFloors,
    parkingCapacity: prop.parkingCapacity,
    floorAreaSqm:   prop.floorAreaSqm,
    roomType:       prop.roomType,
  };
}

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
  addProperty: (prop: AgentProperty) => Promise<AgentProperty>;
  publishProperty: (id: string) => Promise<void>;
  getPropertyById: (id: string) => AgentProperty | undefined;
  updateProperty: (prop: AgentProperty) => Promise<void>;

  // Image management
  uploadImages: (listingId: string, files: File[]) => Promise<string[]>;
  deleteImage: (listingId: string, imageId: string) => Promise<void>;

  // Inspection fee
  getInspectionFee: (listingId: string) => Promise<{ amount: number; currency: string } | null>;
  updateInspectionFee: (listingId: string, amount: number) => Promise<void>;

  // Sharing & reporting
  getShareLink: (listingId: string) => Promise<string | null>;
  reportListing: (listingId: string, reason: string) => Promise<void>;

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
        const raw = await apiGet<unknown>('/api/listings/mine');
        const list = Array.isArray(raw) ? raw : [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const properties = list.map((l: any) => mapBackendListing(l));
        set({ properties, isLoading: false });
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
        await apiDelete(`/api/listings/${id}`);
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
    let finalProp = prop;
    if (USE_API) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw = await apiPost<any>('/api/listings', toBackendListing(prop));
      finalProp = mapBackendListing(raw);
    }
    set((state) => ({
      properties: [finalProp, ...state.properties],
      activeTab: finalProp.listingType,
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
      title: finalProp.title,
      description: finalProp.description,
      category: finalProp.propertyCategory as import('./usePropertyStore').PropertyCategory,
      listingType: finalProp.listingType,
      price: finalProp.price,
      priceType: finalProp.priceType,
      state: finalProp.state,
      city: finalProp.city,
      address: finalProp.address,
      landmarks: finalProp.landmarks,
      bedrooms: typeof finalProp.bedrooms === 'number' ? finalProp.bedrooms : undefined,
      bathrooms: typeof finalProp.bathrooms === 'number' ? finalProp.bathrooms : undefined,
      sizeSqm: typeof finalProp.sizeSqm === 'number' ? finalProp.sizeSqm : undefined,
      amenities: finalProp.amenities,
      media: finalProp.media,
      virtualTourUrl: finalProp.virtualTourUrl,
    });
    return finalProp;
  },

  publishProperty: async (id) => {
    if (USE_API) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw = await apiPatch<any>(`/api/listings/${id}/publish`);
      const updated = mapBackendListing(raw);
      set((s) => ({ properties: s.properties.map(p => p.id === id ? updated : p) }));
    }
  },

  getPropertyById: (id) => get().properties.find(p => p.id === id),

  updateProperty: async (prop) => {
    if (USE_API) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw = await apiPut<any>(`/api/listings/${prop.id}`, toBackendListing(prop));
      const updated = mapBackendListing(raw);
      set((state) => ({
        properties: state.properties.map(p => p.id === prop.id ? updated : p),
        activeTab: updated.listingType,
        activeFilter: 'All',
        page: 1,
      }));
      return;
    }
    set((state) => ({
      properties: state.properties.map(p => p.id === prop.id ? prop : p),
      activeTab: prop.listingType,
      activeFilter: 'All',
      page: 1,
    }));
  },

  uploadImages: async (listingId, files) => {
    if (!USE_API || files.length === 0) return [];
    const { apiUpload } = await import('@/lib/api/client');
    const formData = new FormData();
    files.forEach(f => formData.append('images', f));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await apiUpload<any>(`/api/listings/${listingId}/images`, formData);
    const urls: string[] = Array.isArray(data)
      ? data.map((img: Record<string, unknown>) => String(img.url ?? ''))
      : Array.isArray(data?.images)
        ? data.images.map((img: Record<string, unknown>) => String(img.url ?? ''))
        : [];
    // Update the listing's media in local state
    set((s) => ({
      properties: s.properties.map((p) =>
        p.id === listingId ? { ...p, media: [...p.media, ...urls] } : p
      ),
    }));
    return urls;
  },

  deleteImage: async (listingId, imageId) => {
    if (USE_API) {
      await apiDelete(`/api/listings/images/${imageId}`);
    }
    // Remove the image URL from the local property's media array
    set((s) => ({
      properties: s.properties.map((p) => {
        if (p.id !== listingId) return p;
        return { ...p, media: p.media.filter((_, i) => `img_${i}` !== imageId && _ !== imageId) };
      }),
    }));
  },

  getInspectionFee: async (listingId) => {
    if (!USE_API) return null;
    try {
      return await apiGet<{ amount: number; currency: string }>(`/api/listings/${listingId}/inspection-fee`);
    } catch {
      return null;
    }
  },

  updateInspectionFee: async (listingId, amount) => {
    if (USE_API) {
      await apiPatch(`/api/listings/${listingId}/inspection-fee`, { amount });
    }
  },

  getShareLink: async (listingId) => {
    if (!USE_API) return null;
    try {
      const data = await apiGet<{ url?: string; link?: string }>(`/api/listings/${listingId}/share-link`);
      return data.url ?? data.link ?? null;
    } catch {
      return null;
    }
  },

  reportListing: async (listingId, reason) => {
    if (USE_API) {
      await apiPost(`/api/listings/${listingId}/report`, { reason });
    }
  },

  // Backward-compatible aliases
  addPropertyLocally: (prop) => { void get().addProperty(prop); },
  updatePropertyLocally: (prop) => { void get().updateProperty(prop); },
}));
