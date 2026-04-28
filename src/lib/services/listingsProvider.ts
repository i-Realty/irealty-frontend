/**
 * Listings data provider — backend-ready with mock fallback.
 *
 * When NEXT_PUBLIC_USE_API=true  → calls backend REST endpoints
 * When NEXT_PUBLIC_USE_API=false → filters hardcoded static data client-side
 */

import type { PropertyWithCoords, BBox } from '@/lib/types';
import { standardProperties, developerProperties } from '@/lib/data/properties';

export interface ListingsQuery {
  bbox?: BBox;
  filters?: {
    category?: 'sale' | 'rent' | 'shortlet';
    propertyTypes?: string[];
    bedrooms?: string[];
    amenities?: string[];
    state?: string;
    lga?: string;
    priceMin?: number;
    priceMax?: number;
    query?: string;
  };
  page?: number;
  limit?: number;
  zoom?: number;
}

export interface ListingsResponse {
  properties: PropertyWithCoords[];
  total: number;
}

// ── Mock implementation ─────────────────────────────────────────────────────

const ALL_MOCK_PROPERTIES: PropertyWithCoords[] = [
  ...standardProperties,
  ...developerProperties,
];

function pointInBBox(lat: number, lng: number, bbox: BBox): boolean {
  const [west, south, east, north] = bbox;
  return lng >= west && lng <= east && lat >= south && lat <= north;
}

async function fetchListingsMock(query: ListingsQuery): Promise<ListingsResponse> {
  let results = ALL_MOCK_PROPERTIES;

  // Bounding box filter
  if (query.bbox) {
    results = results.filter(
      (p) =>
        typeof p.lat === 'number' &&
        typeof p.lng === 'number' &&
        pointInBBox(p.lat, p.lng, query.bbox!),
    );
  }

  const f = query.filters;
  if (f) {
    if (f.category) {
      results = results.filter((p) => p.category === f.category);
    }
    if (f.query) {
      const q = f.query.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          (p.neighbourhood?.toLowerCase().includes(q) ?? false),
      );
    }
    if (f.state) {
      results = results.filter((p) => p.state === f.state);
    }
    if (f.lga) {
      results = results.filter((p) => p.lga === f.lga);
    }
    if (f.priceMin !== undefined) {
      results = results.filter((p) => p.priceValue >= f.priceMin!);
    }
    if (f.priceMax !== undefined) {
      results = results.filter((p) => p.priceValue <= f.priceMax!);
    }
    if (f.propertyTypes?.length) {
      results = results.filter((p) => {
        const title = p.title.toLowerCase();
        return f.propertyTypes!.some((t) => title.includes(t.split(' ')[0].toLowerCase()));
      });
    }
    if (f.bedrooms?.length) {
      results = results.filter((p) => {
        if (!p.beds) return false;
        return f.bedrooms!.some((b) => {
          if (b === '6+ Bedrooms') return p.beds! >= 6;
          return p.beds === parseInt(b, 10);
        });
      });
    }
    if (f.amenities?.length) {
      results = results.filter(
        (p) =>
          p.amenities?.length &&
          f.amenities!.some((a) => p.amenities!.includes(a)),
      );
    }
  }

  const total = results.length;
  const page = query.page ?? 1;
  const limit = query.limit ?? total;
  const start = (page - 1) * limit;

  return {
    properties: results.slice(start, start + limit),
    total,
  };
}

// ── API implementation ──────────────────────────────────────────────────────

async function fetchListingsAPI(query: ListingsQuery): Promise<ListingsResponse> {
  const params = new URLSearchParams();
  if (query.bbox) params.set('bbox', query.bbox.join(','));
  if (query.zoom !== undefined) params.set('zoom', String(query.zoom));
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));

  const f = query.filters;
  if (f) {
    if (f.category) params.set('category', f.category);
    if (f.query) params.set('query', f.query);
    if (f.state) params.set('state', f.state);
    if (f.lga) params.set('lga', f.lga);
    if (f.priceMin !== undefined) params.set('priceMin', String(f.priceMin));
    if (f.priceMax !== undefined) params.set('priceMax', String(f.priceMax));
    if (f.propertyTypes?.length) params.set('propertyTypes', f.propertyTypes.join(','));
    if (f.bedrooms?.length) params.set('bedrooms', f.bedrooms.join(','));
    if (f.amenities?.length) params.set('amenities', f.amenities.join(','));
  }

  const res = await fetch(`/api/listings?${params}`);
  if (!res.ok) throw new Error(`Listings API error: ${res.status}`);
  return res.json();
}

// ── Exported provider ───────────────────────────────────────────────────────

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

export const fetchListings: (query: ListingsQuery) => Promise<ListingsResponse> =
  USE_API ? fetchListingsAPI : fetchListingsMock;
