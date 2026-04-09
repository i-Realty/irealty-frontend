# LISTINGSTODO.md — Listings Pages: Incomplete & Stub Inventory

> Tracks every unimplemented interaction, hardcoded value, and placeholder across
> the listings page, property detail pages, virtual tours, book-tour flow, reserve flow,
> agent/developer profile pages, and all related components and stores.
> **Last updated:** 2026-04-08

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Done |
| ⬜ | Not started |
| 🔌 | Needs backend only (UI is ready) |
| 🎨 | Needs UI + backend |
| 🔧 | Logic/wiring only (no backend needed) |

---

## 1. Listings Page (`/listings` & `/listings/developers`)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1.1 | **All listings data is hardcoded** | 🔌 | `standardProperties` (37 items) and `developerProperties` (~20 items) are static data files. No API fetch. |
| 1.2 | **"Lagos" location is hardcoded in results text** | 🔧 | `ClientListingsContent` line 254 — city is a hardcoded string, not dynamic. |
| 1.3 | **Amenities filter is UI-only** | 🔧 | Filter predicate is absent — sample data has no amenities field. Unblocked once backend provides per-property amenities. |
| 1.4 | **Status filter uses artificial logic** | 🔧 | "Ready"/"Under Construction" derived from `p.id % 2`. Needs a real `status` field on the data. |
| 1.5 | **`selectedAmenities`, `toggleAmenity` and filter setters unused in component** | ✅ | Removed unused destructuring from `ClientListingsContent`. Setters still used by `FilterSidebar` via `config.useStore()` directly. |
| 1.6 | **Pagination works on client-side mock data only** | 🔌 | Pagination is functional but pages through hardcoded arrays. Needs server-side pagination API. |

---

## 2. Filter Sidebar (`src/components/listings/FilterSidebar.tsx`)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 2.1 | **Amenities checkboxes have no effect** | 🔧 | See 1.3 — predicate missing, blocked by data. |
| 2.2 | **Status filter uses mock modulo logic** | 🔧 | See 1.4. |

---

## 3. Property Detail Page (`/listings/[id]` & `/listings/developers/[id]`)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 3.1 | **"Share" button unwired** | 🔧 | Standard and developer detail pages — Share button renders with tooltip but has no `onClick`. Implement `navigator.share()` or copy-link fallback. |
| 3.2 | **Property data is hardcoded per ID** | 🔌 | Detail pages look up properties in local arrays. No API fetch by ID. |

---

## 4. Property Gallery (`src/components/listings/PropertyGallery.tsx`)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 4.1 | **"+9" photo count overlay was hardcoded** | ✅ | Removed the hardcoded overlay. Thumbnail renders cleanly. Actual multi-image support blocked by data (no `images[]` field on `PropertyWithCoords`). |
| 4.2 | **Virtual Tour link uses hardcoded `start=0`** | 🔧 | Link always navigates with `?start=0`. Should be dynamic if hotspot entry points are supported. |

---

## 5. Property Tabs (`src/components/listings/PropertyTabs.tsx`)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 5.1 | **Amenities data is hardcoded** | 🔌 | Same amenities for every property. Needs per-property data from API. |
| 5.2 | **Documents data is hardcoded** | 🔌 | Same PDF filenames for every property. |
| 5.3 | **Document download links may 404** | 🔧 | Links use `/documents/{filename}` — files may not exist in `/public`. Verify or replace with real storage URLs. |
| 5.4 | **Landmarks data is hardcoded** | 🔌 | Same landmarks shown for every property. Needs location-aware data. |

---

## 6. Agent Sidebar (`src/components/listings/AgentSidebar.tsx`)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 6.1 | **"Chat Agent" button wired** | ✅ | `onClick` now navigates to `?chat=1` to open `ChatModal`. |
| 6.2 | **"Report Listing" wired** | ✅ | Clicking sets local `reported` state and shows a "Report submitted" confirmation in place of the button. |

---

## 7. Developer Sidebar (`src/components/listings/DeveloperSidebar.tsx`)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 7.1 | **Payment Milestone Plan is hardcoded** | 🔌 | Milestone data comes from `propertyDetails.ts` — not property-specific. Needs API. |
| 7.2 | **"Report Listing" wired** | ✅ | Same confirmation state pattern as `AgentSidebar`. |

---

## 8. Virtual Tour (`/listings/[id]/virtual-tour` & `/listings/developers/[id]/virtual-tour`)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 8.1 | **All scenes use stock placeholder images** | 🎨 | `MOCK_SCENES` uses `/images/property1.png` etc. `VirtualTourViewer` component itself is complete — data is the blocker. |
| 8.2 | **Developer VT uses `window.location.pathname` unsafely** | 🔧 | Should use Next.js `params` instead of `window.location.pathname.split('/')[3]`. |
| 8.3 | **"Chat Agent" button unwired in both VT pages** | 🎨 | Play tour pages — Chat buttons have no `onClick`. Should navigate to `?chat=1`. |

---

## 9. Agent/Developer Profile Pages (`/listings/[id]/profile` & `/listings/developers/[id]/profile`)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 9.1 | **Agent rating shows hardcoded `(0)`** | 🔌 | Not fetched from any ratings API. |
| 9.2 | **Review carousel prev/next buttons unwired** | 🔧 | Carousel nav buttons have no `onClick` handlers. |
| 9.3 | **"Send a message" button unwired** | 🎨 | Should navigate to `?chat=1` or open `ChatModal`. |
| 9.4 | **"About" text is hardcoded for all agents** | 🔌 | Same boilerplate text shown for every agent. |
| 9.5 | **Profile listings are generated inline, not fetched** | 🔌 | Not tied to the agent's real listings. |
| 9.6 | **Code duplicated across standard and developer profile pages** | 🔧 | Both pages are near-identical. `AgentProfileContent.tsx` already exists for this — the page files should be refactored to use it. |

---

## 10. Book Tour Flow (`/listings/[id]/book-tour`)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 10.1 | **Time slots now dynamic** | ✅ | `BookTourModal` generates 4 slots from the next Sunday using current date — no more hardcoded "Sun, Jul 2". |
| 10.2 | **Inspection fee hardcoded at ₦200,000** | 🔌 | Flat constant, not from property or pricing API. |
| 10.3 | **Payment is a query-param simulation** | 🔌 | No Paystack or wallet integration. |
| 10.4 | **Wallet balance now reads from store** | ✅ | `PaymentOptionsModal` reads `useWalletStore().walletBalance` — no more hardcoded ₦200M. |
| 10.5 | **Payment methods now differentiated** | ✅ | Wallet triggers success flow; Paystack shows "coming soon" inline message instead of doing the same thing. |
| 10.6 | **Calendar event details in confirmation are generic** | 🔧 | Google Calendar / ICS event text is generic, not derived from actual tour booking data. |
| 10.7 | **"Chat Agent" in confirmation now opens chat** | ✅ | Navigates to `?chat=1` instead of `/listings/{id}`. |

---

## 11. Reserve Flow (`/listings/developers/[id]` — `?reserve=1`)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 11.1 | **All prices are hardcoded constants** | 🔌 | `ReserveModal` — `PROPERTY_PRICE`, `AGENT_FEE`, `VAT`, `VERIFY_PRICE` not tied to property. |
| 11.2 | **Reserve payment is a query-param simulation** | 🔌 | No real transaction. |
| 11.3 | **Wallet balance now reads from store** | ✅ | `ReservePaymentModal` reads `useWalletStore().walletBalance`. |
| 11.4 | **Payment methods now differentiated** | ✅ | Same fix as book-tour payment. |

---

## 12. Map Interactions

| # | Item | Status | Notes |
|---|------|--------|-------|
| 12.1 | **"Book Tour" button in map popup wired** | ✅ | `window.__irealty_bookTour(id)` is now defined in `MapMarkers.tsx`, navigating to `{hrefPrefix}/{id}?bookTour=1`. |
| 12.2 | **Map style switcher fully wired** | ✅ | `MapStyleSwitcher` is now rendered in the map container. `handleMapStyleChange` calls `map.setStyle()` and updates the store. Markers and cluster layers are re-added on `style.load` after every switch. Filters affect both grid and map — `MapMarkers` already receives `filteredProperties`. |

Properties are shown on the map and all property filters (tab, price, bedrooms, status, property type) affect which markers appear. Filter changes re-render markers automatically.

---

## 13. Favourites Store (`src/lib/store/useFavouritesStore.ts`)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 13.1 | **API endpoint may not exist** | 🔌 | `toggleLike` calls `PATCH /api/listings/{id}/favourite` fire-and-forget with optimistic rollback. UI works locally; will silently fail until endpoint is created. |

---

## 14. Similar Properties (`src/components/listings/SimilarProperties.tsx`)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 14.1 | **Now shows up to 6 with "View all" link** | ✅ | `slice(0, 3)` → `slice(0, 6)`. "View all listings" link added pointing to the listings prefix. |

---

## Summary Counts

| Section | Total | ✅ Done | ⬜/🔌/🎨/🔧 Remaining |
|---------|-------|--------|----------------------|
| Listings Page | 6 | 1 | 5 |
| Filter Sidebar | 2 | 0 | 2 |
| Property Detail | 2 | 0 | 2 |
| Property Gallery | 2 | 1 | 1 |
| Property Tabs | 4 | 0 | 4 |
| Agent Sidebar | 2 | 2 | 0 |
| Developer Sidebar | 2 | 1 | 1 |
| Virtual Tour | 3 | 0 | 3 |
| Profile Pages | 6 | 0 | 6 |
| Book Tour Flow | 7 | 4 | 3 |
| Reserve Flow | 4 | 2 | 2 |
| Map Interactions | 2 | 2 | 0 |
| Favourites Store | 1 | 0 | 1 |
| Similar Properties | 1 | 1 | 0 |
| **Total** | **44** | **14** | **30** |
