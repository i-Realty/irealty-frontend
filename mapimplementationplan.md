# i-Realty Map Implementation Plan

**Date:** 2026-04-27
**Stack:** Next.js 15 / React 19 / Mapbox GL JS 3.9.4 / Zustand 5 / TypeScript
**Strategy:** Mapbox as map renderer + Google APIs as service layer
**Principle:** Backend-ready interfaces with mock/static data fallback

---

## Table of Contents

1. [Current State Summary](#1-current-state-summary)
2. [Phase 1 — Bug Fixes & Stability](#2-phase-1--bug-fixes--stability)
3. [Phase 2 — Data Provider Abstraction](#3-phase-2--data-provider-abstraction)
4. [Phase 3 — Google APIs Integration](#4-phase-3--google-apis-integration)
5. [Phase 4 — New Map Features](#5-phase-4--new-map-features)
6. [Phase 5 — Mobile & UX Polish](#6-phase-5--mobile--ux-polish)
7. [Phase 6 — Backend API Contracts](#7-phase-6--backend-api-contracts)
8. [New Dependencies](#8-new-dependencies)
9. [Environment Variables](#9-environment-variables)
10. [File Map — What Changes Where](#10-file-map--what-changes-where)
11. [Testing Strategy](#11-testing-strategy)
12. [Rollout Order & Dependencies](#12-rollout-order--dependencies)

---

## 1. Current State Summary

### What Exists

| Component | File | Lines | Status |
|---|---|---|---|
| Map init + controls | `ClientListingsContent.tsx` | 359 | Working |
| Custom markers + clustering + popups | `map/MapMarkers.tsx` | 501 | Working with bugs |
| Light/satellite toggle | `map/MapStyleSwitcher.tsx` | 58 | Working |
| Cluster side panel | `map/ClusterPanel.tsx` | 76 | Working |
| Property detail map modal | `MapModal.tsx` | 95 | Working |
| Map UI state | `store/useMapStore.ts` | 29 | Incomplete |
| Listings filter state | `store/useListingsStore.ts` | 130 | Working |
| Favourites with API rollback | `store/useFavouritesStore.ts` | 43 | Working |
| Mapbox CSS overrides | `globals.css` lines 10-91 | 82 | Working |

### Data Sources (all static)

| File | Records | IDs |
|---|---|---|
| `standardProperties.ts` | 37 listings | 1–37 |
| `developerProperties.ts` | 24 listings | 101–124 |
| `usePropertyStore.ts` seed | 5 listings | prop_seed_001–005 |
| `nigeriaLocations.ts` | 37 states, all LGAs + cities | — |

### Known Bugs

1. **"Search This Area" button is a dead button** — `showSearchArea()` sets state but no handler re-queries
2. **Cluster circles and individual markers overlap** — both render simultaneously for the same properties
3. **Style switch destroys cluster layers** — `setStyle()` removes all sources/layers; re-init timing is fragile
4. **Popup actions use `window.__irealty_*` globals** — fragile, bypasses React lifecycle
5. **Mapbox attribution hidden via CSS** — violates Mapbox ToS
6. **Landmark fetch has no loading state or cache** — 500ms–2s delay, re-fetches on every click
7. **Popup image uses hardcoded placeholder on error** — no actual fallback handling

---

## 2. Phase 1 — Bug Fixes & Stability

> Fix everything that's broken or fragile before building new features.

### 2.1 Fix Cluster/Marker Overlap

**Problem:** `MapMarkers.tsx` renders both HTML `mapboxgl.Marker` elements AND a GeoJSON cluster layer from the same source. At low zoom, cluster circles show behind individual markers.

**Solution:** Use ONLY the GeoJSON source for all rendering. Replace individual `mapboxgl.Marker` instances with a single unclustered-point layer that renders custom markers via `mapboxgl.Marker` only for points NOT absorbed by a cluster.

**Implementation:**
- In `MapMarkers.tsx`, after `addClusterLayer()` adds the GeoJSON source, listen to the `render` event
- Query which features are in clusters vs unclustered using `map.querySourceFeatures('irealty-listings', { filter: ['!', ['has', 'point_count']] })`
- Only render `mapboxgl.Marker` for unclustered point features
- Remove markers whose property ID is no longer in the unclustered set
- Hide/show markers based on zoom level relative to `clusterMaxZoom`

**Files:** `src/components/map/MapMarkers.tsx`

### 2.2 Fix Style Switch Cluster Reinitialisation

**Problem:** `mapRef.current.setStyle()` strips all sources and layers. The cluster source is only re-added if `map.getSource(SOURCE_ID)` returns falsy, but timing between `style.load` and marker re-render creates race conditions.

**Solution:**
- Listen to the `style.load` event after `setStyle()`
- On `style.load`, call `addClusterLayer(map)` to re-add the source and layers
- Then call `renderMarkers(map)` to re-add the HTML markers
- Guard with a `styleLoading` ref to prevent double-init

**Files:** `src/components/map/MapMarkers.tsx`

### 2.3 Wire "Search This Area" Button

**Problem:** `showSearchArea()` sets `searchAreaVisible: true` in `useMapStore`, but no handler uses the map's current bounding box to re-filter properties.

**Solution:**
- Add `viewportBounds: LngLatBoundsLike | null` to `useMapStore`
- On `moveend`, store the current bounds: `map.getBounds()`
- When the user clicks "Search This Area", call a new `filterByBounds(bounds)` function in the data provider (Phase 2) that filters properties whose `lat`/`lng` fall within the viewport
- Update the rendered property list + markers
- When backend exists, this becomes a `GET /api/listings?bbox=...` call

**Files:** `src/lib/store/useMapStore.ts`, `src/components/map/MapMarkers.tsx`, `src/components/listings/ClientListingsContent.tsx`

### 2.4 Replace Global Window Handlers in Popups

**Problem:** Popup "Book Tour", "View Details", and heart toggle use `window.__irealty_toggleLike(id)` and `window.__irealty_bookTour(id)` injected into the global scope. These break on unmount and can't be garbage collected.

**Solution:**
- Use Mapbox's `popup.on('open')` event to attach click listeners to the popup DOM after it renders
- Scope handlers to the popup's DOM node using `popup.getElement().querySelector(...)` 
- Use Next.js `router.push()` for navigation instead of `window.location`
- For the like toggle, call `useFavouritesStore.getState().toggleLike(id)` directly

**Files:** `src/components/map/MapMarkers.tsx`

### 2.5 Restore Mapbox Attribution

**Problem:** `globals.css` sets `display: none !important` on `.mapboxgl-ctrl-attrib`, violating Mapbox ToS.

**Solution:**
- Remove the `display: none` rules for attribution
- Style attribution to be compact and unobtrusive (small font, semi-transparent background)
- Use Mapbox's `compact: true` attribution option on map init

**Files:** `src/app/globals.css`, `src/components/listings/ClientListingsContent.tsx`

### 2.6 Add Landmark Cache + Loading Skeleton

**Problem:** `fetchLandmarks(lng, lat)` makes a fresh Mapbox Geocoding API call on every marker click. No loading indicator while waiting.

**Solution:**
- Create an in-memory `Map<string, Landmark[]>` cache keyed by `${propertyId}` 
- On popup open, check cache first; if miss, show a CSS skeleton (pulsing grey bars) in the landmarks section
- Store result in cache after fetch
- Cache persists for the component lifecycle (cleared on unmount)

**Files:** `src/components/map/MapMarkers.tsx`

---

## 3. Phase 2 — Data Provider Abstraction

> Create a service layer that decouples map components from data sources. Currently returns mock data; swaps to API calls when backend is ready.

### 3.1 Listings Data Provider

**New file:** `src/lib/services/listingsProvider.ts`

```typescript
export interface ListingsQuery {
  bbox?: [number, number, number, number]; // [west, south, east, north]
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
  zoom?: number; // hint for backend clustering
}

export interface ListingsResponse {
  properties: PropertyWithCoords[];
  total: number;
  clusters?: GeoJSON.FeatureCollection; // backend can return pre-computed clusters
}

// MOCK implementation — reads from static data files
async function fetchListingsMock(query: ListingsQuery): Promise<ListingsResponse> {
  // Import static data, apply client-side filtering by bbox + filters
  // Return filtered results
}

// BACKEND implementation — calls API
async function fetchListingsAPI(query: ListingsQuery): Promise<ListingsResponse> {
  const params = new URLSearchParams();
  if (query.bbox) params.set('bbox', query.bbox.join(','));
  // ... serialize all filters
  const res = await fetch(`/api/listings?${params}`);
  return res.json();
}

// Exported provider — swaps based on env flag
const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';
export const fetchListings = USE_API ? fetchListingsAPI : fetchListingsMock;
```

### 3.2 Landmarks Data Provider

**New file:** `src/lib/services/landmarksProvider.ts`

```typescript
export interface Landmark {
  name: string;
  type: string;
  category: string;
  distance: number; // metres
  icon: string;
  lat: number;
  lng: number;
}

// MOCK — uses Google Places Nearby (Phase 3) with client-side cache
// BACKEND — pre-computed landmarks per property, stored in DB
async function fetchLandmarksMock(propertyId: number, lng: number, lat: number): Promise<Landmark[]>
async function fetchLandmarksAPI(propertyId: number): Promise<Landmark[]>

export const fetchLandmarks = USE_API ? fetchLandmarksAPI : fetchLandmarksMock;
```

### 3.3 Geocoding Provider

**New file:** `src/lib/services/geocodingProvider.ts`

```typescript
export interface GeocodingResult {
  lat: number;
  lng: number;
  formattedAddress: string;
  placeId?: string;
  confidence: number; // 0-1
}

// Forward geocode: address string → coordinates
export async function geocodeAddress(address: string, state?: string): Promise<GeocodingResult[]>

// Reverse geocode: coordinates → address string
export async function reverseGeocode(lat: number, lng: number): Promise<GeocodingResult>
```

### 3.4 Map Store Expansion

**Expand:** `src/lib/store/useMapStore.ts`

Add the following state:
```typescript
interface MapState {
  // Existing
  clusterPanelOpen: boolean;
  clusterProperties: PropertyWithCoords[];
  searchAreaVisible: boolean;

  // New — viewport tracking
  viewportBounds: [number, number, number, number] | null; // [w, s, e, n]
  viewportZoom: number;
  viewportCenter: [number, number]; // [lng, lat]

  // New — loading states
  isLoadingProperties: boolean;
  isLoadingLandmarks: boolean;

  // New — active layers
  showHeatmap: boolean;
  showBoundaries: boolean;
  showIsochrone: boolean;
  isochroneCenter: [number, number] | null;
  isochroneMinutes: number;

  // New — Street View
  streetViewOpen: boolean;
  streetViewCoords: { lat: number; lng: number } | null;
}
```

### 3.5 Property Types Update

**Expand:** `src/lib/types.ts`

Add the following to `PropertyWithCoords`:
```typescript
export type PropertyWithCoords = Property & {
  // ... existing fields ...

  // New — backend-ready fields
  placeId?: string;           // Google Place ID for the address
  formattedAddress?: string;  // Geocoded full address
  landmarks?: CachedLandmark[]; // Pre-computed nearby POIs (backend)
  neighbourhoodSlug?: string; // For boundary polygon lookup
  streetViewAvailable?: boolean; // Google Street View coverage flag
};
```

---

## 4. Phase 3 — Google APIs Integration

> Add Google services alongside Mapbox for geocoding, places, and Street View.

### 4.1 Google Maps JavaScript API Setup

**New file:** `src/lib/services/google.ts`

- Load Google Maps JS API via `@googlemaps/js-api-loader` (tree-shakeable, SSR-safe)
- Initialise only the libraries needed: `places`, `geocoding`, `streetView`
- Singleton loader pattern — only loads once, returns cached instance
- API key from `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` env var

### 4.2 Google Places Autocomplete — Listing Creation

**Purpose:** When an agent/developer/landlord creates a listing, they type an address and get Nigerian address suggestions with structured data (street, neighbourhood, LGA, state, coordinates).

**New component:** `src/components/map/AddressAutocomplete.tsx`

**Behaviour:**
- Text input that triggers Google Places Autocomplete
- Restricted to Nigeria (`componentRestrictions: { country: 'ng' }`)
- Returns: formatted address, lat/lng, state, LGA, neighbourhood
- Auto-fills the listing form's location fields
- Shows a small Mapbox map preview below the input with a draggable pin for coordinate fine-tuning
- Pin-drop coordinates override autocomplete coordinates (agent can adjust)

**Integration points:**
- Agent dashboard: `src/app/dashboard/agent/` property creation form
- Developer dashboard: `src/app/dashboard/developer/` project creation form
- Landlord dashboard: `src/app/dashboard/landlord/` property creation form

### 4.3 Google Places Nearby — Landmark Replacement

**Purpose:** Replace the current Mapbox Geocoding landmark fetch with Google Places Nearby Search for better Nigerian POI coverage.

**Implementation in:** `src/lib/services/landmarksProvider.ts`

**Changes:**
- Replace `fetchLandmarks()` Mapbox call with Google Places `nearbySearch()`
- Search categories: `school`, `hospital`, `supermarket`, `bank`, `gas_station`, `church`, `mosque`, `pharmacy`, `restaurant`
- Radius: 2km from property coordinates
- Sort by distance, return top 5
- Map Google place types to emoji icons
- Cache results in `Map<number, Landmark[]>` (keyed by property ID)
- When backend exists: landmarks are pre-computed and stored per property — skip Google API call entirely

**Cost control:**
- Cache aggressively per property ID (same property never re-fetches)
- Debounce rapid popup open/close (300ms)
- Limit to 5 results per request

### 4.4 Google Geocoding — Address Resolution

**Purpose:** Convert Nigerian addresses to coordinates for property creation and search.

**Implementation in:** `src/lib/services/geocodingProvider.ts`

**Forward geocoding flow (listing creation):**
1. User selects address from autocomplete → Google returns placeId + coords
2. Store `lat`, `lng`, `placeId`, `formattedAddress` on the property
3. When backend exists: backend geocodes on property submission (server-side API key, no browser exposure)

**Reverse geocoding flow (pin drop):**
1. User drops pin on map → get lat/lng from click event
2. Call Google Reverse Geocoding → get formatted address, state, LGA
3. Auto-fill address fields in the form

### 4.5 Google Street View

**Purpose:** Let users see the street-level view of a property's surroundings before visiting.

**New component:** `src/components/map/StreetViewEmbed.tsx`

**Behaviour:**
- Renders a Google Street View panorama at the property's coordinates
- Check coverage first: `new google.maps.StreetViewService().getPanorama({ location, radius: 100 })`
- If coverage exists: render interactive panorama (heading toward property, pitch 10°)
- If no coverage: show a styled fallback message ("Street View not available for this location") with a satellite map thumbnail instead
- Controls: compass, zoom, fullscreen
- Size: fills parent container (responsive)

**Integration points:**

1. **Property detail page** (`src/app/listings/[id]/page.tsx`):
   - Add a "Street View" tab in `PropertyTabs.tsx` alongside "Overview", "Features", "Location"
   - When tab is active, render `StreetViewEmbed` with property coordinates

2. **Map popup** (`MapMarkers.tsx`):
   - Add a small "Street View" icon button in the popup (only if `streetViewAvailable` is true)
   - On click, open a fullscreen Street View modal overlay

3. **Map modal** (`MapModal.tsx`):
   - Add a toggle button to switch between Mapbox map view and Google Street View
   - Smooth transition between the two views

**New component:** `src/components/map/StreetViewModal.tsx`
- Fullscreen modal (same pattern as `MapModal.tsx`)
- Renders `StreetViewEmbed` inside
- Close button + escape key
- Receives `lat`, `lng` props

### 4.6 Street View Availability Pre-check

**New utility:** `src/lib/services/streetViewService.ts`

```typescript
// Check if Google Street View has coverage near given coordinates
// Returns true if a panorama exists within 100m radius
export async function checkStreetViewCoverage(lat: number, lng: number): Promise<boolean>

// Batch-check coverage for multiple properties (for map markers)
// Returns Set of property IDs that have coverage
export async function batchCheckStreetView(
  properties: Array<{ id: number; lat: number; lng: number }>
): Promise<Set<number>>
```

- Cache results in `Map<number, boolean>` per property ID
- Batch checks on initial map load for visible properties
- Updates `streetViewAvailable` flag on property markers
- Markers with Street View coverage show a small camera icon badge

---

## 5. Phase 4 — New Map Features

### 5.1 Viewport-Based Property Loading

**Purpose:** Load properties dynamically as the user pans and zooms, instead of rendering all 61 at once. Backend-ready with mock fallback.

**Implementation:**

1. On `moveend` event (debounced 500ms):
   ```
   const bounds = map.getBounds()
   const bbox = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()]
   const zoom = map.getZoom()
   const response = await fetchListings({ bbox, zoom, filters: currentFilters })
   ```

2. Mock implementation: filter `standardProperties` + `developerProperties` by checking if `lat`/`lng` falls within bbox

3. Update markers and cluster source with the new property set

4. Show loading indicator on map while fetching

5. The "Search This Area" button triggers a manual re-fetch with the current viewport

**Files:** `src/components/map/MapMarkers.tsx`, `src/lib/services/listingsProvider.ts`, `src/lib/store/useMapStore.ts`

### 5.2 Isochrone (Travel Time) Search

**Purpose:** "Show me properties within 30 minutes' drive of Victoria Island"

**New component:** `src/components/map/IsochroneControl.tsx`

**Behaviour:**
- User clicks "Commute Time" button on the map toolbar
- A panel appears with: origin input (address autocomplete), travel mode (driving/walking), time slider (10/15/20/30/45/60 min)
- On submit, call Mapbox Isochrone API:
  ```
  GET https://api.mapbox.com/isochrone/v1/mapbox/{profile}/{lng},{lat}
      ?contours_minutes={minutes}
      &polygons=true
      &access_token={token}
  ```
- Render the returned polygon as a filled semi-transparent layer on the map
- Filter displayed properties to only those within the isochrone polygon
- Uses Turf.js `booleanPointInPolygon()` for client-side containment check

**Dependencies:** `@turf/boolean-point-in-polygon`, `@turf/helpers`

**Files:** New `src/components/map/IsochroneControl.tsx`, modify `MapMarkers.tsx`

### 5.3 Neighbourhood Boundary Polygons

**Purpose:** Show estate/neighbourhood outlines on the map (Lekki Phase 1, Victoria Island, Ikoyi, Banana Island, etc.)

**Data source:**
- **Immediate (mock):** Create a GeoJSON file with manually drawn polygons for the top 20 Lagos neighbourhoods where most properties are listed
- **Future (backend):** `GET /api/neighbourhoods/boundaries?state=Lagos` returns GeoJSON

**New file:** `src/lib/data/neighbourhoodBoundaries.ts` (mock GeoJSON)

**New component:** `src/components/map/NeighbourhoodLayer.tsx`

**Behaviour:**
- Add a `fill` + `line` layer to the map from the GeoJSON source
- Semi-transparent fill with border (#2563EB at 10% opacity)
- Show neighbourhood name as a `symbol` layer (centered in polygon)
- Toggle visibility from the map toolbar ("Show Boundaries" button)
- On click, show a tooltip with: neighbourhood name, average property price (computed from mock data), number of listings
- On hover, highlight the boundary polygon

**Files:** New `src/components/map/NeighbourhoodLayer.tsx`, new `src/lib/data/neighbourhoodBoundaries.ts`

### 5.4 Price Heatmap Layer

**Purpose:** Visualise property price density across the map.

**New component:** `src/components/map/HeatmapLayer.tsx`

**Behaviour:**
- Add a Mapbox `heatmap` layer using the same GeoJSON source as clusters
- Weight each point by `priceValue` (normalized to 0-1 range)
- Colour ramp: green (low) → yellow (mid) → red (high)
- Toggle from map toolbar ("Price Heatmap" button)
- When active, hide individual markers and show only the heatmap
- Zoom-adaptive: at high zoom, heatmap fades and individual markers reappear

**Data:**
- Mock: uses existing `priceValue` field from property data
- Backend: `GET /api/analytics/price-heatmap?bbox=...` returns pre-aggregated point grid

**Files:** New `src/components/map/HeatmapLayer.tsx`

### 5.5 Map Toolbar

**Purpose:** Centralised control panel for all map features.

**New component:** `src/components/map/MapToolbar.tsx`

**Replaces:** Current `MapStyleSwitcher.tsx` (absorbed into toolbar)

**Layout:** Vertical floating toolbar on the left side of the map

**Buttons (top to bottom):**
1. **Map / Satellite** toggle (existing)
2. **Boundaries** toggle (neighbourhood polygons)
3. **Heatmap** toggle (price heatmap)
4. **Commute** (isochrone search panel)
5. **Street View** (click-on-map to open Street View)
6. **Draw** (future: draw boundary to search within)

Each button shows a tooltip on hover. Active buttons are highlighted. Only one overlay active at a time (heatmap OR boundaries OR isochrone, not all).

**Files:** New `src/components/map/MapToolbar.tsx`, retire `src/components/map/MapStyleSwitcher.tsx`

### 5.6 Directions / Commute Preview in Popup

**Purpose:** From a property popup, let the user see travel time to a saved location (e.g., their office).

**Implementation:**
- Add a "Directions" link in each popup (next to "View Details" / "Book Tour")
- On click: deep-link to Google Maps directions (`https://www.google.com/maps/dir/?api=1&destination={lat},{lng}`)
- This opens in a new tab — no API cost, no backend needed
- Future enhancement: in-map route rendering using Mapbox Directions API

**Files:** `src/components/map/MapMarkers.tsx` (popup HTML builder)

### 5.7 Property Comparison on Map

**Purpose:** Select multiple markers to compare properties side-by-side.

**Implementation:**
- Existing `ComparisonBar.tsx` and `ComparisonModal.tsx` already exist in the listings components
- Wire these into the map view:
  - Long-press (mobile) or Ctrl+click (desktop) on a marker adds it to the comparison tray
  - Comparison tray slides up from bottom with selected property thumbnails
  - "Compare" button opens the existing `ComparisonModal`
- Limit: max 4 properties in comparison

**Files:** `src/components/map/MapMarkers.tsx`, `src/components/listings/ComparisonBar.tsx`

### 5.8 Recently Viewed Trail

**Purpose:** Show the user's browsing path on the map.

**Implementation:**
- Track property IDs the user has clicked on in `useMapStore` (`recentlyViewed: number[]`)
- Render viewed markers with a subtle checkmark badge or dimmed opacity
- Optional: draw a `line` layer connecting viewed properties in order (breadcrumb trail)
- Persist to `sessionStorage` (not localStorage — only relevant per session)

**Files:** `src/lib/store/useMapStore.ts`, `src/components/map/MapMarkers.tsx`

---

## 6. Phase 5 — Mobile & UX Polish

### 6.1 Responsive Map Layout

**Problem:** Map is a fixed 600px height, hidden by default on mobile with "View On Map" toggle.

**Solution:**
- **Mobile (< 768px):** Full-screen map overlay triggered by "Map" floating action button. Slides up from bottom. Close button returns to list. Map height: `100dvh - 64px` (minus nav)
- **Tablet (768px–1024px):** Side-by-side layout with 50/50 split. Map takes right half
- **Desktop (> 1024px):** Current layout but map height: `calc(100vh - 200px)` instead of fixed 600px

**Files:** `src/components/listings/ClientListingsContent.tsx`

### 6.2 Mobile-Optimised Popups

**Problem:** Current 310px popups are too wide for small screens and hard to dismiss.

**Solution:**
- On mobile: popups render as a bottom sheet (sliding panel from bottom, 100% width, max 50% height)
- Swipe down to dismiss
- Larger touch targets for buttons (min 44px)
- Image takes full width with a carousel if multiple images exist
- "Directions" button is more prominent on mobile (users are likely on-the-go)

**New component:** `src/components/map/MobilePropertySheet.tsx`

### 6.3 Mobile Cluster Panel

**Problem:** `ClusterPanel` is a 288px right-side panel that overlaps the map on mobile.

**Solution:**
- On mobile: render as a bottom sheet (same as popup) with scrollable property list
- Swipe down to dismiss
- Tap a property to show its popup (not navigate away)

### 6.4 Touch Gestures

- Two-finger rotate/pitch (already supported by Mapbox)
- Single tap on marker = open popup
- Long press on marker = add to comparison
- Double tap on map = zoom in (already supported)
- Tap outside popup = dismiss popup (add explicit handler)

### 6.5 Loading States & Skeletons

| Element | Current | Improved |
|---|---|---|
| Map initialising | Empty grey box | Skeleton with pulsing map placeholder |
| Landmark fetch in popup | Nothing shown | 3 grey skeleton bars |
| Viewport property loading | No indicator | Subtle top-bar progress indicator |
| Street View loading | Nothing | Skeleton panorama placeholder |
| Style switching | Flash of blank map | Fade transition with brief overlay |

---

## 7. Phase 6 — Backend API Contracts

> These are the API endpoints the frontend will call when `NEXT_PUBLIC_USE_API=true`. Until the backend implements them, the mock providers return static data.

### 7.1 Listings by Viewport

```
GET /api/listings?bbox={west},{south},{east},{north}
    &zoom={number}
    &category={sale|rent|shortlet}
    &propertyTypes={comma-separated}
    &bedrooms={comma-separated}
    &amenities={comma-separated}
    &state={string}
    &lga={string}
    &priceMin={number}
    &priceMax={number}
    &query={string}
    &page={number}
    &limit={number}

Response: {
  properties: PropertyWithCoords[],
  total: number,
  clusters?: GeoJSON.FeatureCollection  // optional server-side clustering
}
```

**Backend requirements:**
- PostGIS or MongoDB geospatial index on property coordinates
- `ST_Within` or `$geoWithin` for bbox filtering
- Optional: server-side clustering at low zoom levels (return GeoJSON clusters instead of individual points) for performance at scale

### 7.2 Property Landmarks (Pre-computed)

```
GET /api/listings/{id}/landmarks

Response: {
  landmarks: Landmark[]
}
```

**Backend requirements:**
- On property creation, call Google Places Nearby API server-side
- Store top 5-8 landmarks per property in DB
- Refresh periodically (weekly cron) to keep POI data current
- Saves per-request Google API costs at scale

### 7.3 Geocode Address (Server-side)

```
POST /api/geocode
Body: { address: string, state?: string }

Response: {
  results: GeocodingResult[]
}
```

**Backend requirements:**
- Server-side Google Geocoding API call (server key, no browser exposure)
- Cache results by address hash (same address doesn't re-geocode)
- Rate limiting to prevent abuse

### 7.4 Neighbourhood Boundaries

```
GET /api/neighbourhoods/boundaries?state={string}&lga={string}

Response: GeoJSON.FeatureCollection
```

**Backend requirements:**
- Store neighbourhood polygon geometries in PostGIS
- Return as GeoJSON FeatureCollection
- Include properties: name, slug, avgPrice, listingCount

### 7.5 Price Heatmap Aggregation

```
GET /api/analytics/price-heatmap?bbox={west},{south},{east},{north}&zoom={number}

Response: {
  type: "FeatureCollection",
  features: [
    { type: "Feature", geometry: { type: "Point", coordinates: [lng, lat] }, properties: { weight: 0.85 } }
  ]
}
```

**Backend requirements:**
- Grid-based aggregation: divide bbox into cells based on zoom
- Each cell returns average `priceValue` normalized to 0-1
- Reduces data transfer vs sending all individual property prices

### 7.6 Area Alert Subscription

```
POST /api/alerts/area
Body: {
  userId: string,
  polygon: GeoJSON.Polygon,  // user-drawn area on map
  filters: { category?, priceMin?, priceMax?, bedrooms? },
  notifyVia: ['email', 'push']
}

Response: { alertId: string }
```

**Backend requirements:**
- Store user polygon + filter criteria
- On new property creation, check if it falls within any user's alert polygon
- Send notification via configured channels
- Manage subscriptions (list, edit, delete)

### 7.7 Street View Coverage Cache

```
GET /api/listings/{id}/street-view-available

Response: { available: boolean }
```

**Backend requirements:**
- On property creation, check Google Street View coverage server-side
- Store boolean flag on property record
- Avoids per-user Google API calls for coverage checks

---

## 8. New Dependencies

```json
{
  "dependencies": {
    "@googlemaps/js-api-loader": "^1.16.6",
    "@turf/boolean-point-in-polygon": "^7.1.0",
    "@turf/helpers": "^7.1.0"
  },
  "devDependencies": {
    "@types/google.maps": "^3.58.0"
  }
}
```

**Why each:**
- `@googlemaps/js-api-loader` — Official Google Maps JS API loader. Tree-shakeable, handles deduplication, SSR-safe. Replaces manual `<script>` tag injection.
- `@turf/boolean-point-in-polygon` + `@turf/helpers` — Lightweight geometry helpers for isochrone containment checks. Only these two modules, not the full Turf.js bundle.
- `@types/google.maps` — TypeScript types for Google Maps/Places/Street View APIs.

**No changes to existing deps.** Mapbox GL JS 3.9.4 stays as-is.

---

## 9. Environment Variables

```env
# Existing
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ...          # Mapbox GL JS + Isochrone + Geocoding

# New
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...     # Google Places, Geocoding, Street View
NEXT_PUBLIC_USE_API=false                    # false = mock data, true = backend API

# Future (backend only, not exposed to browser)
# GOOGLE_MAPS_SERVER_KEY=AIza...            # Server-side geocoding + Places
# DATABASE_URL=postgres://...               # PostGIS for spatial queries
```

---

## 10. File Map — What Changes Where

### New Files

| File | Purpose | Phase |
|---|---|---|
| `src/lib/services/listingsProvider.ts` | Listings data provider (mock/API) | 2 |
| `src/lib/services/landmarksProvider.ts` | Landmarks data provider (mock/API) | 2 |
| `src/lib/services/geocodingProvider.ts` | Geocoding provider (Google) | 2 |
| `src/lib/services/google.ts` | Google Maps API loader singleton | 3 |
| `src/lib/services/streetViewService.ts` | Street View coverage checker | 3 |
| `src/components/map/AddressAutocomplete.tsx` | Google Places autocomplete input | 3 |
| `src/components/map/StreetViewEmbed.tsx` | Street View panorama component | 3 |
| `src/components/map/StreetViewModal.tsx` | Fullscreen Street View modal | 3 |
| `src/components/map/IsochroneControl.tsx` | Travel time search panel | 4 |
| `src/components/map/NeighbourhoodLayer.tsx` | Boundary polygon renderer | 4 |
| `src/components/map/HeatmapLayer.tsx` | Price heatmap layer | 4 |
| `src/components/map/MapToolbar.tsx` | Unified map controls toolbar | 4 |
| `src/components/map/MobilePropertySheet.tsx` | Mobile-optimised popup | 5 |
| `src/lib/data/neighbourhoodBoundaries.ts` | Mock GeoJSON boundaries for Lagos | 4 |

### Modified Files

| File | Changes | Phase |
|---|---|---|
| `src/components/map/MapMarkers.tsx` | Fix cluster/marker overlap, fix style switch, replace globals, add landmark cache, add comparison hooks, add recently viewed, integrate viewport loading | 1, 2, 4 |
| `src/components/listings/ClientListingsContent.tsx` | Wire "Search This Area", responsive layout, integrate data provider, add toolbar | 1, 2, 4, 5 |
| `src/components/MapModal.tsx` | Add Street View toggle | 3 |
| `src/components/listings/PropertyTabs.tsx` | Add "Street View" tab | 3 |
| `src/app/listings/[id]/page.tsx` | Add Street View in property detail | 3 |
| `src/lib/store/useMapStore.ts` | Add viewport bounds, loading states, layer toggles, recently viewed | 1, 2, 4 |
| `src/lib/types.ts` | Add placeId, formattedAddress, landmarks, streetViewAvailable | 2 |
| `src/app/globals.css` | Fix attribution, add mobile map styles, add bottom sheet styles | 1, 5 |
| `package.json` | Add Google Maps loader, Turf.js, types | 3, 4 |
| `.env.local` | Add Google API key, USE_API flag | 3 |

### Retired Files

| File | Replaced By | Phase |
|---|---|---|
| `src/components/map/MapStyleSwitcher.tsx` | `MapToolbar.tsx` (absorbed) | 4 |

---

## 11. Testing Strategy

### Unit Tests

| Test | What It Validates |
|---|---|
| `listingsProvider.test.ts` | Mock provider filters by bbox correctly, respects all filter params |
| `landmarksProvider.test.ts` | Cache hits avoid re-fetch, returns correct structure |
| `geocodingProvider.test.ts` | Returns structured result, handles empty responses |
| `streetViewService.test.ts` | Coverage check caching, batch check deduplication |

### Integration Tests

| Test | What It Validates |
|---|---|
| Map renders with mock data | Markers appear at correct coordinates |
| Cluster click at max zoom | Opens ClusterPanel with correct properties |
| Style switch preserves markers | All markers reappear after light ↔ satellite |
| "Search This Area" filters | Button click re-renders markers within viewport |
| Street View fallback | Shows fallback message when no coverage |
| Isochrone filter | Only properties within polygon remain visible |

### Manual QA Checklist

- [ ] Open /listings, toggle to map view — markers render without overlap
- [ ] Zoom out — clusters form; zoom in — clusters dissolve
- [ ] Click marker — popup opens with landmarks (loading skeleton first)
- [ ] Switch light/satellite — markers and clusters persist
- [ ] Pan map — "Search This Area" appears and re-filters on click
- [ ] Click "Street View" in popup — Street View modal opens (or fallback)
- [ ] Open /listings/[id] — "Street View" tab shows panorama
- [ ] Mobile: tap "Map" FAB — fullscreen map overlay appears
- [ ] Mobile: tap marker — bottom sheet popup slides up
- [ ] Isochrone: set 30min drive from VI — polygon renders, markers filter
- [ ] Toggle "Boundaries" — neighbourhood outlines appear with names
- [ ] Toggle "Heatmap" — price heat overlay renders, markers hide
- [ ] Address autocomplete: type "Lekki" — Nigerian suggestions appear
- [ ] Pin drop: click map — reverse geocode fills address fields
- [ ] Comparison: Ctrl+click 3 markers — comparison tray shows, modal works

---

## 12. Rollout Order & Dependencies

```
Phase 1 (Bug Fixes)                    ← No dependencies, start immediately
  ├── 2.1 Fix cluster/marker overlap
  ├── 2.2 Fix style switch reinit
  ├── 2.3 Wire "Search This Area"
  ├── 2.4 Replace global window handlers
  ├── 2.5 Restore Mapbox attribution
  └── 2.6 Add landmark cache + skeleton
            │
Phase 2 (Data Provider)                ← Depends on Phase 1 completion
  ├── 3.1 Listings provider
  ├── 3.2 Landmarks provider
  ├── 3.3 Geocoding provider
  ├── 3.4 Map store expansion
  └── 3.5 Property types update
            │
            ├──────────────────────────────────┐
            │                                  │
Phase 3 (Google APIs)                  Phase 4 (Map Features)
  ├── 4.1 Google API setup               ├── 5.1 Viewport loading ← needs 3.1
  ├── 4.2 Address autocomplete           ├── 5.2 Isochrone        ← independent
  ├── 4.3 Places Nearby                  ├── 5.3 Boundaries       ← independent
  ├── 4.4 Geocoding                      ├── 5.4 Heatmap          ← independent
  ├── 4.5 Street View embed              ├── 5.5 Toolbar          ← needs 5.2-5.4
  └── 4.6 Coverage pre-check             ├── 5.6 Directions link  ← independent
            │                             ├── 5.7 Comparison       ← independent
            │                             └── 5.8 Recently viewed  ← independent
            │                                  │
            └──────────────────────────────────┘
                          │
                  Phase 5 (Mobile & UX)          ← Depends on Phases 3 + 4
                    ├── 6.1 Responsive layout
                    ├── 6.2 Mobile popups
                    ├── 6.3 Mobile cluster panel
                    ├── 6.4 Touch gestures
                    └── 6.5 Loading states
                          │
                  Phase 6 (Backend Contracts)    ← Document-only, no frontend code
                    └── API specs for backend team
```

**Phases 3 and 4 can run in parallel** once Phase 2 is complete. Phase 5 should follow both. Phase 6 is documentation and can be written alongside any phase.

---

## Notes

- **Google API key restrictions:** Restrict the browser key to `*.irealty.com` (and localhost for dev). Enable only: Maps JavaScript API, Places API, Geocoding API. Set a monthly budget cap ($300 recommended for early stage).
- **Mapbox token restrictions:** Restrict to allowed URLs. Enable: Map Loads, Geocoding, Isochrone, Directions.
- **Data migration path:** When the backend is ready, set `NEXT_PUBLIC_USE_API=true`. The data providers switch from mock to API. No UI component changes needed. The mock providers remain as a fallback and for development/testing.
- **Performance budget:** Map initial load should be under 3 seconds on 4G. Lazy-load Google APIs only when needed (Street View on tab click, autocomplete on form focus). Mapbox GL JS is already loaded eagerly for the map view.
