/**
 * Google Maps JavaScript API singleton loader.
 *
 * Lazily loads the Google Maps JS API the first time any component needs it.
 * Returns null if no API key is configured, allowing callers to fall back
 * to Mapbox-only behaviour gracefully.
 */

import { importLibrary, setOptions } from '@googlemaps/js-api-loader';

let googleInstance: typeof google | null = null;
let loadPromise: Promise<typeof google | null> | null = null;
let optionsSet = false;

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

/**
 * Returns the global `google` namespace, loading the API if needed.
 * Returns `null` when no API key is configured.
 */
export async function getGoogleMaps(): Promise<typeof google | null> {
  if (!API_KEY) return null;
  if (googleInstance) return googleInstance;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      if (!optionsSet) {
        setOptions({ key: API_KEY, v: 'weekly' });
        optionsSet = true;
      }
      // Load the core Maps library + Places + Street View
      await importLibrary('maps');
      await importLibrary('places');
      await importLibrary('streetView');

      googleInstance = window.google;
      return googleInstance;
    } catch (err) {
      console.error('[i-Realty] Failed to load Google Maps API:', err);
      loadPromise = null;
      return null;
    }
  })();

  return loadPromise;
}

/**
 * Synchronously check if Google Maps is already loaded.
 */
export function isGoogleLoaded(): boolean {
  return googleInstance !== null;
}
