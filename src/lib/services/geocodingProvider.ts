/**
 * Geocoding provider — backend-ready with Google Geocoding fallback.
 *
 * Forward geocoding: address string → coordinates
 * Reverse geocoding: coordinates → address string
 */

import { getGoogleMaps } from './google';

export interface GeocodingResult {
  lat: number;
  lng: number;
  formattedAddress: string;
  placeId?: string;
  state?: string;
  lga?: string;
  neighbourhood?: string;
  confidence: number; // 0-1
}

// ── Google Geocoding ────────────────────────────────────────────────────────

async function geocodeGoogle(address: string, state?: string): Promise<GeocodingResult[]> {
  const google = await getGoogleMaps();
  if (!google) return geocodeMapbox(address, state);

  const geocoder = new google.maps.Geocoder();
  const query = state ? `${address}, ${state}, Nigeria` : `${address}, Nigeria`;

  return new Promise((resolve) => {
    geocoder.geocode(
      { address: query, region: 'ng' },
      (results, status) => {
        if (status !== google.maps.GeocoderStatus.OK || !results?.length) {
          resolve([]);
          return;
        }
        resolve(
          results.slice(0, 5).map((r) => {
            const loc = r.geometry.location;
            const comps = r.address_components;
            const findComp = (type: string) =>
              comps.find((c) => c.types.includes(type))?.long_name;

            return {
              lat: loc.lat(),
              lng: loc.lng(),
              formattedAddress: r.formatted_address,
              placeId: r.place_id,
              state: findComp('administrative_area_level_1'),
              lga: findComp('administrative_area_level_2'),
              neighbourhood:
                findComp('neighborhood') ??
                findComp('sublocality_level_1') ??
                findComp('sublocality'),
              confidence:
                r.geometry.location_type === 'ROOFTOP'
                  ? 1
                  : r.geometry.location_type === 'RANGE_INTERPOLATED'
                    ? 0.8
                    : r.geometry.location_type === 'GEOMETRIC_CENTER'
                      ? 0.6
                      : 0.4,
            };
          }),
        );
      },
    );
  });
}

// ── Mapbox Geocoding fallback ───────────────────────────────────────────────

async function geocodeMapbox(address: string, state?: string): Promise<GeocodingResult[]> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';
  const query = state ? `${address}, ${state}, Nigeria` : `${address}, Nigeria`;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?country=ng&limit=5&access_token=${token}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const features = data.features ?? [];
    return features.map((f: { center: [number, number]; place_name: string; relevance: number; context?: Array<{ id: string; text: string }> }) => {
      const stateCtx = f.context?.find((c: { id: string }) => c.id.startsWith('region'));
      return {
        lat: f.center[1],
        lng: f.center[0],
        formattedAddress: f.place_name,
        state: stateCtx?.text,
        confidence: f.relevance ?? 0.5,
      };
    });
  } catch {
    return [];
  }
}

// ── Backend implementation ──────────────────────────────────────────────────

async function geocodeAPI(address: string, state?: string): Promise<GeocodingResult[]> {
  const res = await fetch('/api/geocode', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, state }),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.results ?? [];
}

// ── Reverse geocoding ───────────────────────────────────────────────────────

async function reverseGeocodeGoogle(lat: number, lng: number): Promise<GeocodingResult | null> {
  const google = await getGoogleMaps();
  if (!google) return reverseGeocodeMapbox(lat, lng);

  const geocoder = new google.maps.Geocoder();

  return new Promise((resolve) => {
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status !== google.maps.GeocoderStatus.OK || !results?.[0]) {
        resolve(null);
        return;
      }
      const r = results[0];
      const comps = r.address_components;
      const findComp = (type: string) =>
        comps.find((c) => c.types.includes(type))?.long_name;

      resolve({
        lat,
        lng,
        formattedAddress: r.formatted_address,
        placeId: r.place_id,
        state: findComp('administrative_area_level_1'),
        lga: findComp('administrative_area_level_2'),
        neighbourhood:
          findComp('neighborhood') ??
          findComp('sublocality_level_1') ??
          findComp('sublocality'),
        confidence: 0.8,
      });
    });
  });
}

async function reverseGeocodeMapbox(lat: number, lng: number): Promise<GeocodingResult | null> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?country=ng&limit=1&access_token=${token}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const f = data.features?.[0];
    if (!f) return null;
    const stateCtx = f.context?.find((c: { id: string }) => c.id.startsWith('region'));
    return {
      lat,
      lng,
      formattedAddress: f.place_name,
      state: stateCtx?.text,
      confidence: f.relevance ?? 0.5,
    };
  } catch {
    return null;
  }
}

// ── Exported providers ──────────────────────────────────────────────────────

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';
const HAS_GOOGLE_KEY = !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function geocodeAddress(
  address: string,
  state?: string,
): Promise<GeocodingResult[]> {
  if (USE_API) return geocodeAPI(address, state);
  if (HAS_GOOGLE_KEY) return geocodeGoogle(address, state);
  return geocodeMapbox(address, state);
}

export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<GeocodingResult | null> {
  if (HAS_GOOGLE_KEY) return reverseGeocodeGoogle(lat, lng);
  return reverseGeocodeMapbox(lat, lng);
}
