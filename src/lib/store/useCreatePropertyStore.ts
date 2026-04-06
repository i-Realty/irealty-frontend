import { create } from 'zustand';
import { PropertyCategory, ListingType, PropertyStatus, AgentProperty } from './useAgentPropertiesStore';

// Deep Partial helper for nested updates
type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;

interface CreatePropertyState {
  isOpen: boolean;
  currentStep: number;
  isLoading: boolean;
  error: string | null;

  // Step 1
  propertyType: PropertyCategory | null;
  listingType: ListingType | null;
  propertyStatus: PropertyStatus | null;

  // Step 2
  title: string;
  description: string;
  stateGeo: string;
  city: string;
  address: string;
  
  // Polymorphic Details
  bedrooms: string;
  bathrooms: string;
  sizeSqm: string;
  landmarks: string[];
  
  // Specifics
  unitsFloors: string;
  parkingCapacity: string;
  floorAreaSqm: string;
  documentTypes: string[];
  zoningType: string;
  landSizeSqm: string;
  shortLetRateType: string;
  pgRoomType: string;
  pgUtilitiesIncluded: string;

  // Selected Amenities
  amenities: string[];

  // Step 3
  media: string[]; // URLs or local blob urls
  virtualTourUrl: string;

  // Step 4
  salePrice: string;
  rentPrice: string;
  rentPriceType: 'Per Month' | 'Every 6 Months' | 'Per Year' | '';
  securityDeposit: string;
  agencyFee: string;
  legalFee: string;
  cautionFee: string;

  // Actions
  openWizard: () => void;
  closeWizard: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  setField: <K extends keyof CreatePropertyState>(key: K, value: CreatePropertyState[K]) => void;
  addAmenity: (amenity: string) => void;
  removeAmenity: (amenity: string) => void;
  addLandmark: (landmark: string) => void;
  removeLandmark: (index: number) => void;
  addMedia: (url: string) => void;
  removeMedia: (index: number) => void;
  toggleDocumentType: (docType: string) => void;
  submitProperty: () => Promise<AgentProperty | null>;
  resetForm: () => void;
}

const initialState = {
  isOpen: false,
  currentStep: 1,
  isLoading: false,
  error: null,

  propertyType: null,
  listingType: null,
  propertyStatus: null,

  title: '',
  description: '',
  stateGeo: '',
  city: '',
  address: '',
  
  bedrooms: '',
  bathrooms: '',
  sizeSqm: '',
  landmarks: [],
  
  unitsFloors: '',
  parkingCapacity: '',
  floorAreaSqm: '',
  documentTypes: [],
  zoningType: '',
  landSizeSqm: '',
  shortLetRateType: '',
  pgRoomType: '',
  pgUtilitiesIncluded: '',

  amenities: [],

  media: [],
  virtualTourUrl: '',

  salePrice: '',
  rentPrice: '',
  rentPriceType: '' as const,
  securityDeposit: '',
  agencyFee: '',
  legalFee: '',
  cautionFee: '',
};

export const useCreatePropertyStore = create<CreatePropertyState>((set, get) => ({
  ...initialState,

  openWizard: () => {
    // Also reset form automatically on open if it was half done? 
    // Usually better to keep state if user accidentally closed.
    set({ isOpen: true, currentStep: 1 });
  },
  
  closeWizard: () => set({ isOpen: false }),
  
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 5) })),
  
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
  
  goToStep: (step) => set({ currentStep: step }),
  
  setField: (key, value) => set({ [key]: value }),

  addAmenity: (amenity) => set((state) => {
    if (!state.amenities.includes(amenity)) {
      return { amenities: [...state.amenities, amenity] };
    }
    return state;
  }),

  removeAmenity: (amenity) => set((state) => ({
    amenities: state.amenities.filter(a => a !== amenity)
  })),

  addLandmark: (landmark) => set((state) => {
    if (landmark.trim()) {
       return { landmarks: [...state.landmarks, landmark.trim()] };
    }
    return state;
  }),

  removeLandmark: (index) => set((state) => ({
    landmarks: state.landmarks.filter((_, i) => i !== index)
  })),

  addMedia: (url) => set((state) => ({
    media: [...state.media, url]
  })),

  removeMedia: (index) => set((state) => ({
    media: state.media.filter((_, i) => i !== index)
  })),

  toggleDocumentType: (docType) => set((state) => {
    if (state.documentTypes.includes(docType)) {
      return { documentTypes: state.documentTypes.filter(d => d !== docType) };
    } else {
      return { documentTypes: [...state.documentTypes, docType] };
    }
  }),

  submitProperty: async () => {
    set({ isLoading: true, error: null });
    
    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const state = get();
    
    // Validation Checks (Simple)
    if (!state.propertyType || !state.listingType || !state.title) {
       set({ isLoading: false, error: 'Please fill out all required fields.' });
       return null;
    }

    // Build the payload mapping to AgentProperty
    const newProperty: AgentProperty = {
      id: `prop-new-${Date.now()}`,
      createdAt: new Date().toISOString(),
      propertyCategory: state.propertyType as PropertyCategory,
      listingType: state.listingType as ListingType,
      propertyStatus: state.propertyStatus as PropertyStatus,
      
      title: state.title,
      description: state.description,
      state: state.stateGeo,
      city: state.city,
      address: state.address,
      landmarks: state.landmarks,
      
      price: state.listingType === 'For Sale' ? Number(state.salePrice) : Number(state.rentPrice),
      priceType: state.listingType === 'For Rent' ? (state.rentPriceType as any) : undefined,
      securityDeposit: state.securityDeposit ? Number(state.securityDeposit) : undefined,
      agencyFee: state.agencyFee ? Number(state.agencyFee) : undefined,
      legalFee: state.legalFee ? Number(state.legalFee) : undefined,
      cautionFee: state.cautionFee ? Number(state.cautionFee) : undefined,

      bedrooms: state.propertyType === 'Plots/Lands' ? undefined : state.bedrooms,
      bathrooms: state.propertyType === 'Plots/Lands' ? undefined : state.bathrooms,
      sizeSqm: state.propertyType === 'Plots/Lands' ? state.landSizeSqm : state.sizeSqm,
      
      amenities: state.amenities,
      media: state.media.length > 0 ? state.media : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
      virtualTourUrl: state.virtualTourUrl,

      documentTypes: state.propertyType === 'Plots/Lands' ? state.documentTypes : undefined,
      zoningType: state.propertyType === 'Plots/Lands' ? state.zoningType : undefined,
      unitsFloors: state.propertyType === 'Commercial' ? state.unitsFloors : undefined,
      parkingCapacity: state.propertyType === 'Commercial' ? state.parkingCapacity : undefined,
      floorAreaSqm: state.propertyType === 'Commercial' ? state.floorAreaSqm : undefined,
      roomType: state.propertyType === 'PG/Hostel' ? state.pgRoomType : undefined,
      utilitiesIncluded: state.propertyType === 'PG/Hostel' ? state.pgUtilitiesIncluded : undefined,
    };

    set({ isLoading: false });
    get().resetForm();
    // Return the new property — the calling page injects it into useAgentPropertiesStore
    return newProperty;
  },

  resetForm: () => {
    set({ ...initialState, isOpen: false });
  }
}));
