/**
 * Google Street View coverage checker with caching.
 */

import { getGoogleMaps } from './google';

const coverageCache = new Map<number, boolean>();

/**
 * Check if Google Street View has coverage near given coordinates.
 * Returns true if a panorama exists within 100m radius.
 */
export async function checkStreetViewCoverage(
  lat: number,
  lng: number,
): Promise<boolean> {
  const google = await getGoogleMaps();
  if (!google) return false;

  const sv = new google.maps.StreetViewService();

  return new Promise((resolve) => {
    sv.getPanorama(
      { location: { lat, lng }, radius: 100 },
      (_data, status) => {
        resolve(status === google.maps.StreetViewStatus.OK);
      },
    );
  });
}

/**
 * Check coverage for a single property and cache the result.
 */
export async function checkPropertyStreetView(
  propertyId: number,
  lat: number,
  lng: number,
): Promise<boolean> {
  const cached = coverageCache.get(propertyId);
  if (cached !== undefined) return cached;

  const available = await checkStreetViewCoverage(lat, lng);
  coverageCache.set(propertyId, available);
  return available;
}

/**
 * Batch-check coverage for multiple properties.
 * Returns Set of property IDs that have coverage.
 */
export async function batchCheckStreetView(
  properties: Array<{ id: number; lat: number; lng: number }>,
): Promise<Set<number>> {
  const results = new Set<number>();
  const unchecked = properties.filter((p) => {
    const cached = coverageCache.get(p.id);
    if (cached === true) results.add(p.id);
    return cached === undefined;
  });

  // Check in batches of 5 to avoid rate limiting
  for (let i = 0; i < unchecked.length; i += 5) {
    const batch = unchecked.slice(i, i + 5);
    await Promise.all(
      batch.map(async (p) => {
        const available = await checkStreetViewCoverage(p.lat, p.lng);
        coverageCache.set(p.id, available);
        if (available) results.add(p.id);
        return available;
      }),
    );
    // Small delay between batches
    if (i + 5 < unchecked.length) {
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  return results;
}

export function getCachedCoverage(propertyId: number): boolean | undefined {
  return coverageCache.get(propertyId);
}
