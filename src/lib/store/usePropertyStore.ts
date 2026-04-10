/**
 * usePropertyStore — Unified property lifecycle store.
 *
 * Single source of truth for ALL properties on the platform regardless of
 * which role created them (Agent / Developer / Landlord).
 *
 * Lifecycle:
 *   draft → pending_review → verified | rejected | flagged
 *
 * Seeker listings read only `status === 'verified'` entries.
 * Admin moderation queue reads `status === 'pending_review'` entries.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserRole } from './useAuthStore';
import { useNotificationStore } from './useNotificationStore';

export type PropertyModerationStatus = 'draft' | 'pending_review' | 'verified' | 'rejected' | 'flagged';
export type PropertySource = 'agent' | 'developer' | 'landlord';
export type PropertyListingType = 'For Sale' | 'For Rent';
export type PropertyCategory =
  | 'Residential'
  | 'Commercial'
  | 'Plots/Lands'
  | 'Service Apartments & Short Lets'
  | 'PG/Hostel'
  | 'Off-Plan';

export interface UnifiedProperty {
  id: string;
  source: PropertySource;
  ownerId: string;
  ownerName: string;
  ownerRole: UserRole;
  ownerAvatar?: string;

  status: PropertyModerationStatus;
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;

  // Core details
  title: string;
  description: string;
  category: PropertyCategory;
  listingType: PropertyListingType;
  price: number;
  priceType?: 'Per Month' | 'Every 6 Months' | 'Per Year' | 'One-Time';

  // Location
  state: string;
  city: string;
  address: string;
  landmarks?: string[];

  // Specs
  bedrooms?: number;
  bathrooms?: number;
  sizeSqm?: number;
  amenities?: string[];
  media: string[];
  virtualTourUrl?: string;

  // Developer project extras
  milestones?: Array<{ stage: string; percentage: number; amount: number }>;

  createdAt: string;
  updatedAt: string;
}

interface PropertyStore {
  properties: UnifiedProperty[];
  isLoading: boolean;
  error: string | null;

  // Actions
  submitForReview: (property: Omit<UnifiedProperty, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'submittedAt'>) => UnifiedProperty;
  approveProperty: (id: string) => void;
  rejectProperty: (id: string, reason: string) => void;
  flagProperty: (id: string) => void;
  updateProperty: (id: string, updates: Partial<UnifiedProperty>) => void;
  removeProperty: (id: string) => void;

  // Selectors
  getVerifiedProperties: () => UnifiedProperty[];
  getPendingProperties: () => UnifiedProperty[];
  getPropertiesByOwner: (ownerId: string) => UnifiedProperty[];
  getPropertyById: (id: string) => UnifiedProperty | undefined;

  // Seed data (loads mock verified properties on first run)
  seedIfEmpty: () => void;
}

// Seed data so seekers always have listings to browse on fresh load
const SEED_PROPERTIES: UnifiedProperty[] = [
  {
    id: 'prop_seed_001',
    source: 'agent',
    ownerId: 'USR-001',
    ownerName: 'Sarah Homes',
    ownerRole: 'Agent',
    status: 'verified',
    title: '3-Bed Duplex, Lekki Phase 1',
    description: 'Luxurious fully detached duplex in the heart of Lekki Phase 1. Features POP ceiling, fitted kitchen, en-suite rooms, and 24/7 security.',
    category: 'Residential',
    listingType: 'For Sale',
    price: 45000000,
    state: 'Lagos',
    city: 'Lekki',
    address: 'Admiralty Way, Lekki Phase 1',
    landmarks: ['Shoprite Lekki', 'Admiralty Toll Gate'],
    bedrooms: 3,
    bathrooms: 3,
    sizeSqm: 220,
    amenities: ['POP Ceiling', 'Kitchen-Fitted', 'En-suite', 'Security Access / CCTV', 'Generator', 'Swimming Pool'],
    media: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
    ],
    submittedAt: '2025-07-01T10:00:00Z',
    reviewedAt: '2025-07-02T09:00:00Z',
    createdAt: '2025-07-01T10:00:00Z',
    updatedAt: '2025-07-02T09:00:00Z',
  },
  {
    id: 'prop_seed_002',
    source: 'agent',
    ownerId: 'USR-001',
    ownerName: 'Sarah Homes',
    ownerRole: 'Agent',
    status: 'verified',
    title: '5-Bed Mansion, Ikoyi',
    description: 'Grand 5-bedroom mansion on Banana Island Road, Ikoyi. Features private pool, home cinema, and imported marble finishes.',
    category: 'Residential',
    listingType: 'For Sale',
    price: 85000000,
    state: 'Lagos',
    city: 'Ikoyi',
    address: 'Banana Island Road, Ikoyi',
    landmarks: ['Civic Centre', 'Four Points Hotel'],
    bedrooms: 5,
    bathrooms: 6,
    sizeSqm: 650,
    amenities: ['Swimming Pool', 'Home Cinema', 'Generator', 'Borehole', 'Smart Home', 'Security Access / CCTV'],
    media: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    ],
    submittedAt: '2025-07-05T10:00:00Z',
    reviewedAt: '2025-07-06T09:00:00Z',
    createdAt: '2025-07-05T10:00:00Z',
    updatedAt: '2025-07-06T09:00:00Z',
  },
  {
    id: 'prop_seed_003',
    source: 'developer',
    ownerId: 'USR-003',
    ownerName: 'Amara Osei',
    ownerRole: 'Developer',
    status: 'verified',
    title: 'Asokoro Villas Phase 2',
    description: 'Off-plan residential project in Asokoro, Abuja. Premium gated estate with 24-hour security, paved roads, and underground drainage.',
    category: 'Off-Plan',
    listingType: 'For Sale',
    price: 90000000,
    state: 'Abuja',
    city: 'Asokoro',
    address: 'Plot 5B, Asokoro District, Abuja',
    landmarks: ['Transcorp Hilton', 'Presidential Villa'],
    bedrooms: 4,
    bathrooms: 4,
    sizeSqm: 400,
    amenities: ['Gated Estate', 'CCTV', 'Generator', 'Paved Roads', 'Underground Drainage'],
    media: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop',
    ],
    milestones: [
      { stage: 'Foundation / Lock-Up Stage', percentage: 33, amount: 30000000 },
      { stage: 'Roofing / Structure Completion', percentage: 34, amount: 30600000 },
      { stage: 'Handover / Finishing', percentage: 33, amount: 29400000 },
    ],
    submittedAt: '2025-06-10T10:00:00Z',
    reviewedAt: '2025-06-12T09:00:00Z',
    createdAt: '2025-06-10T10:00:00Z',
    updatedAt: '2025-06-12T09:00:00Z',
  },
  {
    id: 'prop_seed_004',
    source: 'landlord',
    ownerId: 'USR-012',
    ownerName: 'Kemi Afolabi',
    ownerRole: 'Landlord',
    status: 'verified',
    title: '2-Bedroom Apartment, Victoria Island',
    description: 'Modern 2-bedroom apartment with ocean view in the heart of Victoria Island. Fully serviced with DSTV, internet, and cleaning included.',
    category: 'Residential',
    listingType: 'For Rent',
    price: 500000,
    priceType: 'Per Month',
    state: 'Lagos',
    city: 'Victoria Island',
    address: '12 Adeola Odeku Street, Victoria Island',
    landmarks: ['Eko Hotel', 'Bar Beach'],
    bedrooms: 2,
    bathrooms: 2,
    sizeSqm: 110,
    amenities: ['Air Conditioning', 'DSTV', 'Internet', 'Cleaning Service', 'Generator', 'Security'],
    media: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
    ],
    submittedAt: '2025-08-01T10:00:00Z',
    reviewedAt: '2025-08-02T09:00:00Z',
    createdAt: '2025-08-01T10:00:00Z',
    updatedAt: '2025-08-02T09:00:00Z',
  },
  {
    id: 'prop_seed_005',
    source: 'agent',
    ownerId: 'USR-006',
    ownerName: 'Fatima Ibrahim',
    ownerRole: 'Agent',
    status: 'verified',
    title: 'Office Space, Ikeja GRA',
    description: 'Prime commercial office space in Ikeja GRA. Open plan layout, 3 meeting rooms, server room, and executive lounge.',
    category: 'Commercial',
    listingType: 'For Rent',
    price: 5000000,
    priceType: 'Per Year',
    state: 'Lagos',
    city: 'Ikeja GRA',
    address: '14 Joel Ogunnaike Street, Ikeja GRA',
    landmarks: ['GTBank HQ', 'Ikeja City Mall'],
    bedrooms: 0,
    bathrooms: 4,
    sizeSqm: 380,
    amenities: ['Air Conditioning', 'Parking Space', 'Generator', 'CCTV', 'Server Room', 'Elevator'],
    media: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
    ],
    submittedAt: '2025-08-05T10:00:00Z',
    reviewedAt: '2025-08-06T09:00:00Z',
    createdAt: '2025-08-05T10:00:00Z',
    updatedAt: '2025-08-06T09:00:00Z',
  },
];

export const usePropertyStore = create<PropertyStore>()(
  persist(
    (set, get) => ({
      properties: [],
      isLoading: false,
      error: null,

      submitForReview: (propertyData) => {
        const now = new Date().toISOString();
        const newProperty: UnifiedProperty = {
          ...propertyData,
          id: `prop_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          status: 'pending_review',
          submittedAt: now,
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ properties: [newProperty, ...s.properties] }));

        // Notify the submitting owner
        useNotificationStore.getState().emit(
          'property',
          'Listing submitted for review',
          `"${newProperty.title}" has been submitted and is awaiting admin moderation.`,
          '/dashboard/agent/properties'
        );

        // Emit to admin (in a real system this would be a server push)
        useNotificationStore.getState().emit(
          'property',
          'New property pending moderation',
          `${newProperty.ownerName} submitted "${newProperty.title}" for review.`,
          '/dashboard/admin/properties'
        );

        return newProperty;
      },

      approveProperty: (id) => {
        const now = new Date().toISOString();
        const property = get().properties.find((p) => p.id === id);
        set((s) => ({
          properties: s.properties.map((p) =>
            p.id === id ? { ...p, status: 'verified', reviewedAt: now, updatedAt: now } : p
          ),
        }));
        if (property) {
          useNotificationStore.getState().emit(
            'property',
            'Listing approved',
            `Your property "${property.title}" is now live on i-Realty.`,
            '/dashboard/agent/properties'
          );
        }
      },

      rejectProperty: (id, reason) => {
        const now = new Date().toISOString();
        const property = get().properties.find((p) => p.id === id);
        set((s) => ({
          properties: s.properties.map((p) =>
            p.id === id ? { ...p, status: 'rejected', rejectionReason: reason, reviewedAt: now, updatedAt: now } : p
          ),
        }));
        if (property) {
          useNotificationStore.getState().emit(
            'property',
            'Listing rejected',
            `"${property.title}" was rejected: ${reason}`,
            '/dashboard/agent/properties'
          );
        }
      },

      flagProperty: (id) => {
        const now = new Date().toISOString();
        const property = get().properties.find((p) => p.id === id);
        set((s) => ({
          properties: s.properties.map((p) =>
            p.id === id ? { ...p, status: 'flagged', updatedAt: now } : p
          ),
        }));
        if (property) {
          useNotificationStore.getState().emit(
            'property',
            'Listing flagged for review',
            `"${property.title}" has been flagged by admin and requires your attention.`,
            '/dashboard/agent/properties'
          );
        }
      },

      updateProperty: (id, updates) => {
        set((s) => ({
          properties: s.properties.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },

      removeProperty: (id) => {
        set((s) => ({ properties: s.properties.filter((p) => p.id !== id) }));
      },

      getVerifiedProperties: () =>
        get().properties.filter((p) => p.status === 'verified'),

      getPendingProperties: () =>
        get().properties.filter((p) => p.status === 'pending_review'),

      getPropertiesByOwner: (ownerId) =>
        get().properties.filter((p) => p.ownerId === ownerId),

      getPropertyById: (id) =>
        get().properties.find((p) => p.id === id),

      seedIfEmpty: () => {
        const { properties } = get();
        if (properties.length === 0) {
          set({ properties: SEED_PROPERTIES });
        }
      },
    }),
    {
      name: 'irealty-properties',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
