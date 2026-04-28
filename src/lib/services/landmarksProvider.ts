/**
 * Landmarks data provider — backend-ready with Google Places / Mapbox fallback.
 *
 * Uses Google Places Nearby when a Google key is available, falls back to
 * Mapbox Geocoding otherwise. Caches results per property ID.
 */

import type { Landmark } from '@/lib/types';
import { getGoogleMaps } from './google';

// ── In-memory cache ─────────────────────────────────────────────────────────
const cache = new Map<number, Landmark[]>();

export function getCachedLandmarks(propertyId: number): Landmark[] | undefined {
  return cache.get(propertyId);
}

// ── Icon mapping ────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, string> = {
  school: '🏫',
  university: '🎓',
  hospital: '🏥',
  doctor: '🏥',
  health: '🏥',
  supermarket: '🛒',
  market: '🛒',
  grocery: '🛒',
  store: '🛒',
  bank: '🏦',
  atm: '🏦',
  gas_station: '⛽',
  fuel: '⛽',
  church: '⛪',
  mosque: '🕌',
  pharmacy: '💊',
  restaurant: '🍽️',
};

function iconForType(type: string): string {
  const lower = type.toLowerCase();
  for (const [key, icon] of Object.entries(ICON_MAP)) {
    if (lower.includes(key)) return icon;
  }
  return '📍';
}

// ── Haversine distance (metres) ─────────────────────────────────────────────
function haversineMetres(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dx = (lng2 - lng1) * 111320 * Math.cos((lat1 * Math.PI) / 180);
  const dy = (lat2 - lat1) * 110540;
  return Math.sqrt(dx * dx + dy * dy);
}

// ── Google Places Nearby implementation ─────────────────────────────────────
// Place types used for Google Places Nearby searches
// const GOOGLE_PLACE_TYPES = ['school', 'hospital', 'supermarket', 'bank', 'gas_station', 'church', 'mosque', 'pharmacy', 'restaurant'];

async function fetchLandmarksGoogle(lng: number, lat: number): Promise<Landmark[]> {
  const google = await getGoogleMaps();
  if (!google) return fetchLandmarksMapbox(lng, lat);

  const service = new google.maps.places.PlacesService(
    document.createElement('div'),
  );

  const allResults: Landmark[] = [];
  // Search a few key types to get diverse results
  const typesToSearch = ['school', 'hospital', 'supermarket', 'bank', 'gas_station'];

  const searchPromises = typesToSearch.map(
    (type) =>
      new Promise<google.maps.places.PlaceResult[]>((resolve) => {
        service.nearbySearch(
          {
            location: { lat, lng },
            radius: 2000,
            type: type as string,
          },
          (results, status) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              results
            ) {
              resolve(results.slice(0, 2));
            } else {
              resolve([]);
            }
          },
        );
      }),
  );

  const resultSets = await Promise.all(searchPromises);

  for (const results of resultSets) {
    for (const place of results) {
      if (!place.geometry?.location) continue;
      const pLat = place.geometry.location.lat();
      const pLng = place.geometry.location.lng();
      const dist = haversineMetres(lat, lng, pLat, pLng);
      const primaryType = place.types?.[0] ?? '';
      allResults.push({
        name: place.name ?? 'Unknown',
        type: primaryType,
        category: primaryType,
        distance: Math.round(dist),
        icon: iconForType(primaryType),
        lat: pLat,
        lng: pLng,
      });
    }
  }

  // Sort by distance, return top 5
  allResults.sort((a, b) => a.distance - b.distance);
  return allResults.slice(0, 5);
}

// ── Mapbox Geocoding fallback ───────────────────────────────────────────────
const MAPBOX_POI_CATEGORIES = 'school,hospital,marketplace,bank,gas_station';

async function fetchLandmarksMapbox(lng: number, lat: number): Promise<Landmark[]> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';
  const url =
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${MAPBOX_POI_CATEGORIES}.json` +
    `?proximity=${lng},${lat}&limit=5&types=poi&access_token=${token}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const features: Array<{
      place_name: string;
      geometry: { coordinates: [number, number] };
      properties: { category?: string };
    }> = data.features ?? [];
    return features.slice(0, 5).map((f) => {
      const [fLng, fLat] = f.geometry.coordinates;
      const dist = haversineMetres(lat, lng, fLat, fLng);
      const rawCat = (f.properties?.category ?? '').toLowerCase();
      return {
        name: f.place_name.split(',')[0],
        type: rawCat,
        category: rawCat,
        distance: Math.round(dist),
        icon: iconForType(rawCat),
        lat: fLat,
        lng: fLng,
      };
    });
  } catch {
    return [];
  }
}

// ── Backend implementation ──────────────────────────────────────────────────
async function fetchLandmarksAPI(propertyId: number): Promise<Landmark[]> {
  const res = await fetch(`/api/listings/${propertyId}/landmarks`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.landmarks ?? [];
}

// ── Exported provider with caching ──────────────────────────────────────────
const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';
const HAS_GOOGLE_KEY = !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function fetchLandmarks(
  propertyId: number,
  lng: number,
  lat: number,
): Promise<Landmark[]> {
  // Return cached if available
  const cached = cache.get(propertyId);
  if (cached) return cached;

  let landmarks: Landmark[];

  if (USE_API) {
    landmarks = await fetchLandmarksAPI(propertyId);
  } else if (HAS_GOOGLE_KEY) {
    landmarks = await fetchLandmarksGoogle(lng, lat);
  } else {
    landmarks = await fetchLandmarksMapbox(lng, lat);
  }

  cache.set(propertyId, landmarks);
  return landmarks;
}

export function clearLandmarkCache() {
  cache.clear();
}
