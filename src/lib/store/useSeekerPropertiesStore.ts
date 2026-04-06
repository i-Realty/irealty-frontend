import { create } from 'zustand';

export type SeekerPropertyStatus = 'Active' | 'Expired' | 'Completed';
export type SeekerPropertyType = 'Rented' | 'Owned';
export type SeekerPropertyTab = 'All' | 'Owned' | 'Rented';

export interface SeekerProperty {
  id: string;
  propertyType: SeekerPropertyType;
  status: SeekerPropertyStatus;
  title: string;
  location: string;
  image: string;
  beds: number;
  baths: number;
  sqm: number;
  // Rented-specific
  leaseStart?: string;
  leaseEnd?: string;
  monthsLeft?: number;
  yearlyRent?: number;
  securityDeposit?: number;
  totalPaid?: number;
  // Owned-specific
  purchasePrice?: number;
  purchaseDate?: string;
  documents?: string[];
}

interface SeekerPropertiesState {
  properties: SeekerProperty[];
  isLoading: boolean;
  error: string | null;
  activeTab: SeekerPropertyTab;
  setActiveTab: (tab: SeekerPropertyTab) => void;
  fetchPropertiesMock: () => Promise<void>;
}

const mockSeekerProperties: SeekerProperty[] = [
  {
    id: 'sp-001',
    propertyType: 'Rented',
    status: 'Active',
    title: 'Residential Plot – GRA Enugu',
    location: 'Independence Layout, Enugu',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600&auto=format&fit=crop',
    beds: 3, baths: 2, sqm: 120,
    leaseStart: 'Jan 2024', leaseEnd: 'Dec 2024', monthsLeft: 5,
    yearlyRent: 2500000, securityDeposit: 2500000, totalPaid: 2500000,
  },
  {
    id: 'sp-002',
    propertyType: 'Owned',
    status: 'Completed',
    title: 'Residential Plot – GRA Enugu',
    location: 'Independence Layout, Enugu',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop',
    beds: 3, baths: 2, sqm: 120,
    purchasePrice: 2500000, purchaseDate: '12 Dec, 2023',
    documents: ['Certificate of Occupancy', 'Survey', 'Deed of assignment'],
  },
  {
    id: 'sp-003',
    propertyType: 'Rented',
    status: 'Expired',
    title: 'Residential Plot – GRA Enugu',
    location: 'Independence Layout, Enugu',
    image: 'https://images.unsplash.com/photo-1600607687931-cebf0046d4e7?q=80&w=600&auto=format&fit=crop',
    beds: 3, baths: 2, sqm: 120,
    leaseStart: 'Jan 2024', leaseEnd: 'Dec 2024', monthsLeft: 0,
    yearlyRent: 2500000, totalPaid: 2500000,
  },
];

export const useSeekerPropertiesStore = create<SeekerPropertiesState>((set) => ({
  properties: [],
  isLoading: false,
  error: null,
  activeTab: 'All',

  setActiveTab: (tab) => set({ activeTab: tab }),

  fetchPropertiesMock: async () => {
    set({ isLoading: true, error: null });
    await new Promise((r) => setTimeout(r, 600));
    set({ properties: mockSeekerProperties, isLoading: false });
  },
}));
