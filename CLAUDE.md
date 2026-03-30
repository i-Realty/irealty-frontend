# CLAUDE.md — i-Realty Frontend

> Project guide for AI assistants. Describes the codebase, conventions, known issues, and rules.
> **Last updated:** 2026-03-30

## Project Overview

**i-Realty** is a Nigerian real-estate web application (buy, rent, shortlet) built for both local users and the diaspora. The frontend is a **Next.js 15 App Router** project using **React 19**, **Tailwind CSS v4**, **Zustand** for state, **Mapbox GL JS** for maps, and **Framer Motion** for animations.

### Architecture Goals (API-Ready Frontend)

- **Role-Based Access**: The application features role-based access to various dashboards (e.g., Property Seeker, Property Owner, Real Estate Agent, Developers, Diaspora Investors).
- **Backend-Ready Structure**: All frontend code must be structurally prepared for easy backend API integration. State (e.g., Zustand stores) should mirror expected API payloads, authentication and form submissions must have loading/error states, and data mocks should be isolated to easily swap with real endpoints later.

### Quick Start

```bash
npm install          # canonical package manager (npm / package-lock.json)
npm run dev          # starts Next.js dev server on localhost:3000
npm run build        # production build (outputs to ./dist)
npm run lint         # ESLint check
```

**Package Manager:** `npm` with `package-lock.json` is canonical. Do not use `bun`, `yarn`, or `pnpm`.

**Environment:** Requires `.env.local` with `NEXT_PUBLIC_MAPBOX_TOKEN` for map functionality.

---

## Tech Stack

| Layer         | Tool                              | Version   |
|---------------|-----------------------------------|---------  |
| Framework     | Next.js (App Router, `"use client"` pages) | 15.5.6  |
| UI            | React                             | 19.1.0    |
| Styling       | Tailwind CSS v4 via `@tailwindcss/postcss` | ^4       |
| State Mgmt    | Zustand                           | ^5.0.3    |
| Maps          | Mapbox GL JS                      | ^3.9.4    |
| Animation     | Framer Motion                     | ^12.23.24 |
| Language      | TypeScript (strict mode)          | ^5        |
| Font          | Lato (via `next/font/google`)     | —         |
| Linter        | ESLint + `eslint-config-next`     | ^9        |
| Build output  | `./dist` (custom `distDir`)       | —         |

---

## Directory Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout: Lato font, globals.css
│   ├── page.tsx                # Landing page (SSR-safe, server component wrapper)
│   ├── globals.css             # Global styles + Mapbox overrides + signup responsive
│   ├── not-found.tsx           # Custom 404 page
│   ├── sitemap.ts              # Dynamic sitemap generator
│   ├── listings/
│   │   ├── page.tsx            # Listings page (Suspense → StandardListingsClient)
│   │   ├── layout.tsx          # Listings layout (Navbar + Footer)
│   │   ├── loading.tsx         # Loading skeleton
│   │   ├── StandardListingsClient.tsx # Binds standard config to unified component
│   │   ├── [id]/
│   │   │   ├── page.tsx        # Property detail (~140 lines, uses extracted components)
│   │   │   ├── layout.tsx      # Detail layout with generateMetadata
│   │   │   ├── profile/        # Agent profile page
│   │   │   ├── virtual-tour/   # Image carousel viewer
│   │   │   └── book-tour/      # Tour booking route
│   │   └── developers/         # Developer listings (mirrors /listings structure)
│   │       ├── page.tsx        # Developer listings (Suspense → DeveloperListingsClient)
│   │       ├── DeveloperListingsClient.tsx # Binds developer config to unified component
│   │       ├── layout.tsx
│   │       ├── loading.tsx
│   │       └── [id]/           # Developer detail (~150 lines, uses extracted components)
│   ├── agents/[id]/            # Agent detail page
│   └── auth/{login,signup,reset}/  # Auth pages (UI only, no auth logic)
│
├── components/
│   ├── Navbar.tsx              # Fixed top navbar with mobile hamburger
│   ├── Footer.tsx              # Blue footer with link columns
│   ├── Hero.tsx                # Landing hero with SearchCard
│   ├── SearchCard.tsx          # Buy/Rent/Shortlet search widget
│   ├── MapModal.tsx            # Mapbox map in modal overlay
│   ├── BookTourModal.tsx       # Tour booking step 1
│   ├── PaymentOptionsModal.tsx # Tour booking step 2
│   ├── BookingConfirmationModal.tsx  # Tour booking success
│   ├── ReserveModal.tsx        # Property reservation step 1
│   ├── ReservePaymentModal.tsx # Property reservation step 2
│   ├── ReserveConfirmationModal.tsx  # Reservation success
│   ├── ChatModal.tsx           # Agent chat UI (placeholder)
│   ├── CategoryGrid.tsx        # Property category cards
│   ├── RecentProperties.tsx    # Recent listings section
│   ├── AudienceSection.tsx     # "Who is i-Realty for?" section
│   ├── AgentDiasporaPromo.tsx  # Promo section for agents/diaspora
│   ├── TestimonialSection.tsx  # Auto-scrolling testimonial carousel
│   ├── FAQSection.tsx          # Accordion FAQ
│   ├── VerifiedFeatures.tsx    # Trust badges section
│   ├── MainWithOptionalPadding.tsx  # Layout helper
│   ├── ProfileListingsGrid.tsx # Grid wrapper
│   ├── RenderOnLanding.tsx     # Conditional render helper
│   ├── auth/
│   │   ├── AuthLayout.tsx      # Shared auth page layout
│   │   ├── OtpInput.tsx        # OTP code input component
│   │   ├── PasswordInput.tsx   # Password with toggle visibility
│   │   └── ProgressPill.tsx    # Signup step indicator
│   ├── listings/
│   │   ├── ClientListingsContent.tsx  # Unified listings component (config-driven)
│   │   ├── FilterSidebar.tsx          # Extracted filter sidebar
│   │   ├── AgentProfileContent.tsx    # Agent profile content
│   │   ├── AgentSidebar.tsx           # Standard agent card + action buttons
│   │   ├── DeveloperSidebar.tsx       # Developer profile + payment milestones
│   │   ├── PropertyGallery.tsx        # Gallery grid with overlay buttons
│   │   ├── PropertyInfoBar.tsx        # Type / area / beds / date strip
│   │   ├── PropertyTabs.tsx           # 4-tab panel (desc/amenities/docs/landmarks)
│   │   └── SimilarProperties.tsx      # 3-card similar properties grid
│   ├── map/
│   │   ├── MapMarkers.tsx      # Mapbox markers + popups + clustering (475 lines)
│   │   ├── ClusterPanel.tsx    # Side panel for clustered properties
│   │   └── MapStyleSwitcher.tsx # Light/satellite toggle
│   └── shared/
│       └── PropertyCard.tsx    # Reusable property card with favourite toggle
│
├── lib/
│   ├── constants.ts            # PRICE_MIN, PRICE_MAX
│   ├── types.ts                # Property, PropertyWithCoords types
│   ├── data/
│   │   ├── properties.ts       # sampleProperties (6 items, OLD — used by detail pages)
│   │   ├── standardProperties.ts  # standardProperties (37 items, for /listings)
│   │   ├── developerProperties.ts # developerProperties (~20 items, for /developers)
│   │   ├── propertyDetails.ts  # Extended property detail mock data
│   │   └── amenities.ts        # defaultAmenities, amenitiesByType
│   ├── store/
│   │   ├── useListingsStore.ts       # Listings page state (filters, map, pagination)
│   │   ├── useDeveloperListingsStore.ts  # ⚠ Near-clone of useListingsStore
│   │   ├── useAuthStore.ts           # Auth state (demo-only, in-memory)
│   │   ├── useSignupStore.ts         # Signup wizard state (in-memory)
│   │   ├── useFavouritesStore.ts     # Favourites with optimistic toggle
│   │   └── useMapStore.ts            # Map cluster panel + "search this area" state
│   ├── hooks/
│   │   └── usePropertyModals.ts      # URL-driven modal state (8 modals + anyOpen)
│   └── utils/
│       └── authValidation.ts   # Email, password, phone validation helpers
│
└── global.d.ts                 # Declares mapbox-gl module
```

---

## Completed Refactoring

### Listings Unification ✅

The `/listings` and `/listings/developers` routes now share a unified component at `components/listings/ClientListingsContent.tsx` via a config-injection pattern (`ListingsPageConfig`). Thin wrappers (`StandardListingsClient.tsx`, `DeveloperListingsClient.tsx`) bind the appropriate store and data source. The old duplicate `ClientListingsContent` files have been deleted.

### Detail Page Decomposition ✅

Both `listings/[id]/page.tsx` (497 → ~140 lines) and `listings/developers/[id]/page.tsx` (588 → ~150 lines) now compose from extracted sub-components:

- `PropertyGallery` — image grid with virtual-tour / view-on-map overlays
- `PropertyInfoBar` — property type / area / beds / date strip
- `PropertyTabs` — description / amenities / documents / landmarks (data from `propertyDetails.ts`)
- `AgentSidebar` — standard agent card + chat / book tour / reserve buttons
- `DeveloperSidebar` — developer profile + payment milestone plan
- `SimilarProperties` — 3-card grid using `PropertyCard`
- `usePropertyModals()` — URL-driven modal state hook (8 modals)

### Image Optimization Migration ✅

All raw `<img>` tags across the application (components, modals, pages, and specific routes like `agents/[id]`) were replaced with Next.js `<Image>` components to utilize built-in image optimization, lazy loading, and sizing bounds. 
- *Exception:* `MapMarkers.tsx` retains `<img>` tags because Mapbox popups render from raw HTML strings (`.setHTML`).

---

## Coding Conventions

### Component Patterns

- **All page components use `"use client"`** — currently no server components beyond wrappers.
- **Modals use URL query params** for state (e.g., `?bookTour=1`, `?reserve=1`). This allows browser Back to close modals.
- **Zustand stores** are in `lib/store/`. State is split by feature (listings, map, favourites, auth).
- **Data files** live in `lib/data/`. Three property datasets exist (see Directory Structure).
- **`@/*` path alias** maps to `./src/*` (configured in `tsconfig.json`).

### Naming Conventions

- **Components:** PascalCase filenames (e.g., `PropertyCard.tsx`)
- **Stores:** camelCase with `use` prefix (e.g., `useListingsStore.ts`)
- **Data files:** camelCase (e.g., `properties.ts`, `amenities.ts`)
- **Routes:** Next.js App Router conventions (`page.tsx`, `[id]`, `layout.tsx`)

### CSS / Styling

- **Tailwind CSS v4** — utility classes in JSX. No CSS modules.
- **`globals.css`** — contains Mapbox GL overrides, signup form responsive styles, and font setup.
- **Lato font** is loaded via `next/font/google` in `layout.tsx` and exposed as `--font-lato` CSS variable.
- **Color palette:** Primary blue `#2563EB`, gray shades from Tailwind defaults, tag colors (blue for sale, green for rent).
- **⚠ `tailwind.config.ts` exists** but is ignored by Tailwind v4 (which uses CSS-based config). Pending deletion.

### ESLint Rules

- `@next/next/no-img-element`: **warn** (migration to `next/image` is pending — 101 instances)
- `@typescript-eslint/no-unused-vars`: **warn**
- `@typescript-eslint/no-explicit-any`: **warn**

---

## Known Issues & Technical Debt

> These are documented findings from code audits. Do not introduce more instances of these patterns.

### High Priority

1. **Store Duplication:** `useListingsStore` and `useDeveloperListingsStore` share the same `ListingsState` interface but are separate stores. Should be merged into a single parameterized factory.

### Medium Priority

5. **Auth Store Mocking:** `useAuthStore` and `useSignupStore` lack real backend hookups. `useFavouritesStore` fires API calls to a non-existent backend.

6. **Price as String:** `Property.price` is a formatted string (e.g., `'₦ 20,000,000'`). Filtering requires fragile `parseInt(p.price.replace(...))`. A numeric `priceValue` field should be added.

7. **`dangerouslySetInnerHTML` removed** from listing files (moved to globals.css). No remaining instances.

8. **Window Globals:** `window.__irealty_toggleLike` is used for Mapbox popup interaction (unavoidable with Mapbox's HTML string popups).

9. **Old `sampleProperties` data file** (`lib/data/properties.ts`) still exists with 6 legacy items. No longer imported by any active page, but not yet deleted. Can be removed once confirmed no other consumer exists.

10. **Per-page SEO metadata** — only root layout and detail page layouts have metadata. Listings, auth pages don't export `generateMetadata`.

### Low Priority

11. **No Test Infrastructure:** No test framework or test files exist.

12. **Missing `robots.txt`:** No `robots.txt` in `/public`.

13. **Build artifacts in working directory:** Despite `.gitignore`, log files and one-off scripts exist on disk.

---

## Rules for AI Assistants

### DO

- Use `"use client"` directive for any component that uses hooks, event handlers, or browser APIs.
- Use Zustand stores for cross-component state; keep stores in `lib/store/`.
- Use the `@/*` import alias for all project imports.
- Use `next/image` for new images (not raw `<img>`).
- Use `next/link` for internal navigation (not `<a href>`).
- Keep property data in `lib/data/` — treat data files as the mock API.
- Use Tailwind utility classes for styling (no inline styles except for dynamic values like `style={{ left: '50%' }}`).
- Test that any listing page changes work on **both** `/listings` and `/listings/developers` paths (until the duplication is resolved).
- Use `PropertyWithCoords` type for any property data that includes map coordinates.
- When adding modals, follow the URL query param pattern (e.g., `?modalName=1`) so browser Back works.
- Use the `usePropertyModals()` hook for detail page modal state.
- Compose detail pages from extracted components (`PropertyGallery`, `PropertyInfoBar`, `PropertyTabs`, `AgentSidebar`/`DeveloperSidebar`, `SimilarProperties`).
- **Export types from store files** when they are consumed by other modules.
- **Verify imports compile** (`npm run build`) after any structural changes.

### DON'T

- Don't add more code to detail pages — compose from existing sub-components.
- Don't create new `dangerouslySetInnerHTML` style blocks — put CSS in `globals.css` instead.
- Don't add `font-family` inline styles — Lato is globally applied via CSS variable.
- Don't add new `eslint-disable` comments without documenting the reason.
- Don't use `any` types — use proper TypeScript types or `unknown` if the type is genuinely unstructured.
- Don't duplicate stores — if a new listing variant is needed, parameterize the existing `useListingsStore`.
- Don't store build artifacts or log files in the repository.
- Don't create new property data files — add to existing ones and re-export from `lib/data/properties.ts`.

### Currency / Locale

- Nigerian market: prices in Naira (₦ / NGN).
- Use `Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" })` for formatting.
- `PRICE_MIN = 0`, `PRICE_MAX = 100_000_000` (100M NGN) defined in `lib/constants.ts`.

### Map Integration

- Mapbox GL JS v3 — access token from `NEXT_PUBLIC_MAPBOX_TOKEN` env var.
- Default center: Lagos, Nigeria `[3.42, 6.45]`.
- Maps use 3D mode (`pitch: 60`, `minPitch: 45`).
- `MapMarkers.tsx` handles marker rendering, popup HTML generation, clustering, and landmark fetching — all imperatively (returns `null`).
- Map popup interactions (favourite toggle) use `window.__irealty_toggleLike` global.
