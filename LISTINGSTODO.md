# LISTINGSTODO.md — Listings Pages: Incomplete & Stub Inventory

> Tracks every unimplemented interaction, hardcoded value, and placeholder across
> the listings page, property detail pages, virtual tours, book-tour flow, reserve flow,
> agent/developer profile pages, and all related components and stores.
> **Last updated:** 2026-04-08

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ⬜ | Not started |
| 🔌 | Needs backend only (UI is ready) |
| 🎨 | Needs UI + backend |
| 🔧 | Logic/wiring only (no backend needed) |

---

## 1. Listings Page (`/listings` & `/listings/developers`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 1.1 | **All listings data is hardcoded** | 🔌 | `standardProperties` (37 items) and `developerProperties` (~20 items) are static data files. No API fetch. |
| 1.2 | **"Lagos" location is hardcoded in results text** | 🔧 | `ClientListingsContent` line 254 — "Showing X results in **Lagos**" — city is a hardcoded string, not dynamic. |
| 1.3 | **Amenities filter is UI-only** | 🔧 | `ClientListingsContent` line 125 — comment says `// Amenities filter omitted since sample data lacks amenities`. Checkboxes toggle store state but filtering code is absent. |
| 1.4 | **Status filter uses artificial logic** | 🔧 | `ClientListingsContent` lines 116–120 — "Ready" / "Under Construction" status derived as `p.id % 2 === 0 ? 'Ready' : 'Under Construction'`. Not real property data. |
| 1.5 | **`selectedAmenities`, `toggleAmenity`, `setPriceMin/Max`, `toggleBedroom`, `toggleStatus` all unused** | 🔧 | `ClientListingsContent` lines 47–51 — all destructured from store but never applied to filtering. Remove or implement. |
| 1.6 | **Pagination works on client-side mock data only** | 🔌 | Pagination is functional but pages through hardcoded arrays. Needs API integration with server-side pagination for scale. |

---

## 2. Filter Sidebar (`src/components/listings/FilterSidebar.tsx`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 2.1 | **Amenities checkboxes have no effect** | 🔧 | Toggles `useListingsStore.selectedAmenities` correctly but the filter predicate in `ClientListingsContent` is commented out. |
| 2.2 | **Status filter uses mock modulo logic** | 🔧 | See item 1.4 above — status not a real property field. |

---

## 3. Property Detail Page (`/listings/[id]` & `/listings/developers/[id]`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 3.1 | **"Share" button unwired** | 🔧 | Standard and developer detail pages — Share button renders (with tooltip) but has no `onClick` handler. Implement `navigator.share()` or a copy-link fallback. |
| 3.2 | **Property data is hardcoded per ID** | 🔌 | Detail pages look up the property in local data arrays. No API fetch by ID. |

---

## 4. Property Gallery (`src/components/listings/PropertyGallery.tsx`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 4.1 | **"+9" photo count overlay is hardcoded** | 🔧 | Gallery grid shows "+9" regardless of how many additional images exist. Calculate from actual image array length. |
| 4.2 | **Virtual Tour link uses hardcoded `start=0`** | 🔧 | "Virtual Tour" button always navigates with `?start=0`. Should be dynamic if hotspot entry points are supported. |

---

## 5. Property Tabs (`src/components/listings/PropertyTabs.tsx`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 5.1 | **Amenities data is hardcoded** | 🔌 | Pulled from `defaultAmenities` / `amenitiesByType` in `lib/data/amenities.ts`. Not fetched per property. All properties show the same amenities. |
| 5.2 | **Documents data is hardcoded** | 🔌 | Same PDF filenames (certOfOccupancy.pdf, surveyPlan.pdf, etc.) for every property. |
| 5.3 | **Document download links may 404** | 🔧 | Document links use `/documents/{filename}` — these files may not exist in `/public`. Verify or replace with real storage URLs. |
| 5.4 | **Landmarks data is hardcoded** | 🔌 | Same landmarks (St. Mary's Primary School, City General Hospital, etc.) shown for every property. Not location-aware. |

---

## 6. Agent Sidebar (`src/components/listings/AgentSidebar.tsx`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 6.1 | **"Chat Agent" button unwired** | 🎨 | Button has no `onClick` handler. Should open `ChatModal` or navigate to messaging. |
| 6.2 | **"Report Listing" button unwired** | 🎨 | Button has no `onClick` handler. Should open a report/flag form. |

---

## 7. Developer Sidebar (`src/components/listings/DeveloperSidebar.tsx`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 7.1 | **Payment Milestone Plan is hardcoded** | 🔌 | Milestone data comes from `propertyDetails.ts` — not property-specific. All developer listings show the same 4 milestones. |
| 7.2 | **"Report Listing" button unwired** | 🎨 | Button has no `onClick` handler. |

---

## 8. Virtual Tour (`/listings/[id]/virtual-tour` & `/listings/developers/[id]/virtual-tour`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 8.1 | **All scenes use stock placeholder images** | 🎨 | Both virtual tour pages define `MOCK_SCENES` with `/images/property1.png` and `/images/property2.png`. No real 360° imagery. The `VirtualTourViewer` component itself is complete; the data is the blocker. |
| 8.2 | **Developer VT uses `window.location.pathname` unsafely** | 🔧 | `/listings/developers/[id]/virtual-tour/page.tsx` line 48 — parses property ID from `window.location.pathname.split('/')[3]`. Should use Next.js `params` instead. |
| 8.3 | **"Chat Agent" button unwired in both VT pages** | 🎨 | Tour pages each have a "Chat Agent" button with no `onClick` handler. |

---

## 9. Agent/Developer Profile Pages (`/listings/[id]/profile` & `/listings/developers/[id]/profile`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 9.1 | **Agent rating shows hardcoded `(0)`** | 🔌 | Both profile pages show `(0)` stars and `(0)` reviews. Not fetched from any ratings API. |
| 9.2 | **Review carousel prev/next buttons unwired** | 🔧 | Both pages — carousel navigation buttons (◀ ▶) have no `onClick` handlers. |
| 9.3 | **"Send a message" button unwired** | 🎨 | Both pages — button has no `onClick` handler. Should open `ChatModal` or navigate to messaging. |
| 9.4 | **"About" text is hardcoded for all agents** | 🔌 | Same boilerplate about text shown for every agent. Not fetched per agent. |
| 9.5 | **Profile listings are generated inline, not fetched** | 🔌 | Both profile pages build `sampleProperties` arrays inline. Not tied to the agent's real listings. |
| 9.6 | **Code is duplicated across standard and developer profile pages** | 🔧 | `/listings/[id]/profile/page.tsx` and `/listings/developers/[id]/profile/page.tsx` are near-identical. Should be unified into a single parameterized component (like `AgentProfileContent.tsx` already exists for this). |

---

## 10. Book Tour Flow (`/listings/[id]/book-tour`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 10.1 | **Time slots hardcoded to "Sun, Jul 2"** | 🔌 | `BookTourModal` — 4 slots all show an old date. No real availability check. |
| 10.2 | **Inspection fee hardcoded at ₦200,000** | 🔌 | `BookTourModal` line 110 — flat constant, not fetched from property or pricing API. |
| 10.3 | **Payment is a query-param simulation** | 🔌 | `PaymentOptionsModal` — `router.push()` with `?bookTourSuccess=1`. No Paystack or wallet integration. |
| 10.4 | **Wallet balance hardcoded at ₦200,000,000** | 🔌 | `PaymentOptionsModal` line 51 — not fetched from user wallet. |
| 10.5 | **Both payment methods call the same handler** | 🔧 | No differentiation between wallet and card payment paths. |
| 10.6 | **Calendar event details in confirmation are generic** | 🔧 | `BookingConfirmationModal` — Google Calendar and ICS event details are generic strings, not derived from the actual tour booking. |
| 10.7 | **"Chat Agent" in confirmation is navigation-only** | 🔧 | `BookingConfirmationModal` — navigates to `/listings/{id}` rather than opening a chat session. |

---

## 11. Reserve Flow (`/listings/developers/[id]` — `?reserve=1`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 11.1 | **All prices are hardcoded constants** | 🔌 | `ReserveModal` — `PROPERTY_PRICE`, `AGENT_FEE`, `VAT`, `VERIFY_PRICE` are fixed values not tied to the property. |
| 11.2 | **Reserve payment is a query-param simulation** | 🔌 | `ReservePaymentModal` — navigates with `?reserveSuccess=1`. No real transaction. |
| 11.3 | **Wallet balance hardcoded at ₦200,000,000** | 🔌 | `ReservePaymentModal` line 44. |
| 11.4 | **Both payment methods are identical** | 🔧 | Same issue as book-tour payment. |

---

## 12. Map Interactions

| # | Item | Type | Notes |
|---|------|------|-------|
| 12.1 | **"Book Tour" button in map popup is unwired** | 🔧 | `MapMarkers.tsx` line 164 — popup HTML calls `window.__irealty_bookTour?.(id)`. This global function is never defined anywhere. Button does nothing. |
| 12.2 | **Map style switcher is UI-only** | 🔧 | `MapStyleSwitcher.tsx` — Light/Satellite toggle buttons render but have no handlers to actually change the map style. Component accepts an `onStyleChange` prop but it's never passed from the parent. Wire `onStyleChange` callback from `ClientListingsContent`. |

properties should be seen on maps, and all property filters also have effect on property displayed on map.
---

## 13. Favourites Store (`src/lib/store/useFavouritesStore.ts`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 13.1 | **API endpoint may not exist** | 🔌 | `toggleLike` calls `PATCH /api/listings/{id}/favourite` fire-and-forget with optimistic rollback on failure. Endpoint not yet built. UI works locally; will silently fail in production until endpoint is created. |

---

## 14. Similar Properties (`src/components/listings/SimilarProperties.tsx`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 14.1 | **Capped at 3 items with no "See More"** | 🔧 | `.slice(0, 3)` hardcoded. No pagination or "Show more similar properties" link. |

---

## Summary Counts

| Section | Total | 🔌 Backend | 🎨 UI+Backend | 🔧 Wiring |
|---------|-------|-----------|--------------|----------|
| Listings Page | 6 | 1 | 0 | 5 |
| Filter Sidebar | 2 | 0 | 0 | 2 |
| Property Detail | 2 | 1 | 0 | 1 |
| Property Gallery | 2 | 0 | 0 | 2 |
| Property Tabs | 4 | 3 | 0 | 1 |
| Agent Sidebar | 2 | 0 | 2 | 0 |
| Developer Sidebar | 2 | 1 | 1 | 0 |
| Virtual Tour | 3 | 0 | 2 | 1 |
| Profile Pages | 6 | 3 | 1 | 2 |
| Book Tour Flow | 7 | 4 | 0 | 3 |
| Reserve Flow | 4 | 3 | 0 | 1 |
| Map Interactions | 2 | 0 | 0 | 2 |
| Favourites Store | 1 | 1 | 0 | 0 |
| Similar Properties | 1 | 0 | 0 | 1 |
| **Total** | **44** | **17** | **6** | **21** |
