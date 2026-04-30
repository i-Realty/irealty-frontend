/**
 * useMarketplaceStore
 *
 * Fetches and caches public listings from the backend marketplace API.
 * Used by the listings browse page, seeker search, and property detail pages.
 * When USE_API=false the store returns empty — pages fall back to standardProperties.
 */
import { create } from 'zustand';
import { apiGet } from '@/lib/api/client';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

// ---------------------------------------------------------------------------
// Shared frontend listing shape (compatible with standardProperties format)
// ---------------------------------------------------------------------------
export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  price: number;
  priceFormatted: string;
  priceType?: string;
  propertyType: string;   // 'Residential' | 'Commercial' | etc.
  listingType: string;    // 'For Sale' | 'For Rent'
  propertyStatus: string; // 'Ready' | 'Under Construction'
  state: string;
  city: string;
  address: string;
  bedrooms?: number;
  bathrooms?: number;
  sizeSqm?: number;
  amenities: string[];
  images: string[];       // array of image URLs
  coverImage: string;
  virtualTourUrl?: string;
  agentName?: string;
  agentAvatar?: string;
  agentId?: string;
  isVerified?: boolean;
  likesCount?: number;
  createdAt: string;
}

export interface MarketplaceFilters {
  search?: string;
  propertyType?: string;
  listingType?: string;   // 'For Sale' | 'For Rent'
  state?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  page?: number;
  limit?: number;
}

interface MarketplaceStore {
  listings: MarketplaceListing[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;

  // Amenities cache (keyed by backend property type)
  amenitiesCache: Record<string, string[]>;
  isLoadingAmenities: boolean;

  fetchListings: (filters?: MarketplaceFilters) => Promise<void>;
  fetchListing: (id: string) => Promise<MarketplaceListing | null>;
  getListing: (id: string) => MarketplaceListing | undefined;
  fetchAmenities: (propertyType: string) => Promise<string[]>;
}

// ---------------------------------------------------------------------------
// Field mapping helpers
// ---------------------------------------------------------------------------
const PROPERTY_TYPE_MAP: Record<string, string> = {
  RESIDENTIAL: 'Residential', COMMERCIAL: 'Commercial',
  LAND: 'Plots/Lands', SHORT_LET: 'Service Apartments & Short Lets', PG_HOSTEL: 'PG/Hostel',
};
const LISTING_TYPE_MAP: Record<string, string> = { FOR_SALE: 'For Sale', FOR_RENT: 'For Rent' };
const PRICE_TYPE_MAP: Record<string, string> = {
  PER_MONTH: 'Per Month', EVERY_6_MONTHS: 'Every 6 Months', PER_YEAR: 'Per Year',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapListing(l: Record<string, any>): MarketplaceListing {
  const price = l.price ?? 0;
  const images: string[] = (l.images ?? [])
    .sort((a: Record<string, unknown>, b: Record<string, unknown>) =>
      Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0))
    .map((img: Record<string, unknown>) => String(img.url ?? ''))
    .filter(Boolean);
  const coverImage = images.find((_, i) =>
    (l.images?.[i] as Record<string, unknown>)?.isCover
  ) ?? images[0] ?? '';

  const agentUser = l.user as Record<string, unknown> | undefined;
  const agentName = agentUser
    ? (String(agentUser.displayName || '') || `${agentUser.firstName ?? ''} ${agentUser.lastName ?? ''}`.trim() || 'Agent')
    : 'Agent';

  return {
    id:             String(l.id),
    title:          l.title ?? '',
    description:    l.description ?? '',
    price,
    priceFormatted: `₦${Number(price).toLocaleString('en-NG')}`,
    priceType:      PRICE_TYPE_MAP[l.priceType] ?? l.priceType,
    propertyType:   PROPERTY_TYPE_MAP[l.propertyType] ?? l.propertyType ?? 'Residential',
    listingType:    LISTING_TYPE_MAP[l.listingType] ?? 'For Sale',
    propertyStatus: l.propertyStatus === 'UNDER_CONSTRUCTION' ? 'Under Construction' : 'Ready',
    state:          l.state ?? '',
    city:           l.city ?? '',
    address:        l.fullAddress ?? l.address ?? '',
    bedrooms:       l.bedrooms,
    bathrooms:      l.bathrooms,
    sizeSqm:        l.sizeSqm,
    amenities:      l.amenities ?? [],
    images,
    coverImage,
    virtualTourUrl: l.virtualTourUrl,
    agentName,
    agentAvatar:    String(agentUser?.avatarUrl ?? ''),
    agentId:        String(l.userId ?? ''),
    isVerified:     agentUser?.verificationStatus === 'VERIFIED',
    likesCount:     l.likesCount ?? 0,
    createdAt:      l.createdAt ?? new Date().toISOString(),
  };
}

function buildQueryString(filters: MarketplaceFilters): string {
  const params: Record<string, string> = {};
  if (filters.search)      params.search       = filters.search;
  if (filters.propertyType) {
    // Map frontend label to backend enum
    const backendMap: Record<string, string> = {
      Residential: 'RESIDENTIAL', Commercial: 'COMMERCIAL',
      'Plots/Lands': 'LAND', 'Service Apartments & Short Lets': 'SHORT_LET', 'PG/Hostel': 'PG_HOSTEL',
    };
    params.propertyType = backendMap[filters.propertyType] ?? filters.propertyType;
  }
  if (filters.listingType) {
    params.listingType = filters.listingType === 'For Sale' ? 'FOR_SALE' : 'FOR_RENT';
  }
  if (filters.state)        params.state        = filters.state;
  if (filters.city)         params.city         = filters.city;
  if (filters.minPrice)     params.minPrice     = String(filters.minPrice);
  if (filters.maxPrice)     params.maxPrice     = String(filters.maxPrice);
  if (filters.minBedrooms)  params.minBedrooms  = String(filters.minBedrooms);
  if (filters.maxBedrooms)  params.maxBedrooms  = String(filters.maxBedrooms);
  if (filters.page)         params.page         = String(filters.page);
  if (filters.limit)        params.limit        = String(filters.limit ?? 20);
  const qs = new URLSearchParams(params).toString();
  return qs ? `?${qs}` : '';
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
// Map frontend property type labels → backend enum for amenities endpoint
const AMENITY_TYPE_TO_BACKEND: Record<string, string> = {
  Residential: 'RESIDENTIAL',
  Commercial: 'COMMERCIAL',
  'Plots/Lands': 'LAND',
  'Service Apartments & Short Lets': 'SHORT_LET',
  'PG/Hostel': 'PG_HOSTEL',
};

export const useMarketplaceStore = create<MarketplaceStore>((set, get) => ({
  listings:    [],
  isLoading:   false,
  error:       null,
  totalCount:  0,
  currentPage: 1,

  amenitiesCache: {},
  isLoadingAmenities: false,

  fetchListings: async (filters = {}) => {
    if (!USE_API) return; // mock mode — pages use standardProperties directly
    set({ isLoading: true, error: null });
    try {
      const qs  = buildQueryString(filters);
      const raw = await apiGet<unknown>(`/api/marketplace/search${qs}`);
      const list = Array.isArray(raw)
        ? raw
        : Array.isArray((raw as Record<string, unknown>)?.items)
          ? (raw as Record<string, unknown[]>).items
          : Array.isArray((raw as Record<string, unknown>)?.data)
            ? (raw as Record<string, unknown[]>).data
            : [];
      const total = (raw as Record<string, number>)?.total ?? list.length;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const listings = (list as any[]).map(mapListing);
      set({ listings, totalCount: total, currentPage: filters.page ?? 1, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load listings', isLoading: false });
    }
  },

  fetchListing: async (id) => {
    if (!USE_API) return null;
    try {
      const raw = await apiGet<Record<string, unknown>>(`/api/marketplace/${id}`);
      const listing = mapListing(raw);
      // Cache in the store
      set((s) => {
        const exists = s.listings.some(l => l.id === listing.id);
        return exists
          ? { listings: s.listings.map(l => l.id === listing.id ? listing : l) }
          : { listings: [...s.listings, listing] };
      });
      return listing;
    } catch {
      return null;
    }
  },

  getListing: (id) => get().listings.find(l => l.id === id),

  fetchAmenities: async (propertyType) => {
    const backendType = AMENITY_TYPE_TO_BACKEND[propertyType] ?? propertyType;
    // Return cached result if available
    const cached = get().amenitiesCache[backendType];
    if (cached) return cached;

    if (!USE_API) return [];

    set({ isLoadingAmenities: true });
    try {
      const raw = await apiGet<unknown>(`/api/marketplace/amenities/${backendType}`);
      const amenities: string[] = Array.isArray(raw)
        ? raw.map(String)
        : Array.isArray((raw as Record<string, unknown>)?.amenities)
          ? ((raw as Record<string, unknown[]>).amenities as string[])
          : [];
      set((s) => ({
        amenitiesCache: { ...s.amenitiesCache, [backendType]: amenities },
        isLoadingAmenities: false,
      }));
      return amenities;
    } catch {
      set({ isLoadingAmenities: false });
      return [];
    }
  },
}));
