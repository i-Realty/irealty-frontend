# CLAUDE.md — i-Realty Frontend

> Project guide for AI assistants. Describes the codebase, conventions, known issues, and rules.
> **Last updated:** 2026-04-02

## Project Overview

**i-Realty** is a Nigerian real-estate web application (buy, rent, shortlet) built for both local users and the diaspora. The frontend is a **Next.js 15 App Router** project using **React 19**, **Tailwind CSS v4**, **Zustand** for state, **Mapbox GL JS** for maps, and **Framer Motion** for animations.

**Current state:** The UI is ~95% complete. All pages render and navigate correctly. **There is no backend** — every store uses mock functions with `setTimeout` delays. The project is API-ready: stores mirror expected API payloads and mock functions are isolated for easy swap.

### Architecture Goals

- **Role-Based Access**: Property Seeker, Property Owner, Real Estate Agent, Developers, Diaspora Investors.
- **Backend-Ready Structure**: Zustand stores mirror expected API payloads. Mock functions are isolated (`*Mock()` suffix) for easy replacement with real API calls.
- **Agent Dashboard First**: The agent dashboard is the most feature-complete section and the primary focus of ongoing work.

---

## Quick Start

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
| Charts        | Recharts                          | ^3.8.1    |
| Animation     | Framer Motion                     | ^12.23.24 |
| Icons         | Lucide React                      | ^1.7.0    |
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
│   ├── page.tsx                # Landing page (server component wrapper)
│   ├── globals.css             # Global styles + Mapbox overrides
│   ├── not-found.tsx           # Custom 404 page
│   ├── sitemap.ts              # Dynamic sitemap generator
│   ├── listings/
│   │   ├── page.tsx            # Listings page (Suspense → StandardListingsClient)
│   │   ├── layout.tsx          # Listings layout (Navbar + Footer)
│   │   ├── StandardListingsClient.tsx
│   │   ├── [id]/
│   │   │   ├── page.tsx        # Property detail (composed from sub-components)
│   │   │   ├── layout.tsx      # Detail layout with generateMetadata
│   │   │   ├── profile/        # Agent profile page
│   │   │   ├── virtual-tour/   # Image carousel viewer
│   │   │   └── book-tour/      # Tour booking route
│   │   └── developers/         # Developer listings (mirrors /listings structure)
│   │       ├── DeveloperListingsClient.tsx
│   │       └── [id]/           # Developer detail
│   ├── agents/[id]/            # Agent detail page
│   ├── auth/
│   │   ├── login/page.tsx      # Email/password login
│   │   ├── signup/             # Multi-step signup (role → details → verify → success)
│   │   └── reset/              # Password reset (email → verify → new pass → success)
│   └── dashboard/
│       └── agent/
│           ├── page.tsx        # KYC onboarding + stats dashboard
│           ├── layout.tsx      # Sidebar + TopNavBar layout
│           ├── properties/     # Agent's property listings + create wizard
│           ├── messages/       # Messaging system (3-pane)
│           ├── calendar/       # Inspection scheduling
│           ├── documents/      # Lease agreement generator
│           ├── wallet/         # Financial management + escrow
│           └── settings/       # Profile, payout, security, commissions
│
├── components/
│   ├── Navbar.tsx, Footer.tsx, Hero.tsx, SearchCard.tsx
│   ├── BookTourModal.tsx, PaymentOptionsModal.tsx, BookingConfirmationModal.tsx
│   ├── ReserveModal.tsx, ReservePaymentModal.tsx, ReserveConfirmationModal.tsx
│   ├── ChatModal.tsx, MapModal.tsx
│   ├── CategoryGrid.tsx, RecentProperties.tsx, AudienceSection.tsx
│   ├── AgentDiasporaPromo.tsx, TestimonialSection.tsx, FAQSection.tsx
│   ├── VerifiedFeatures.tsx, MainWithOptionalPadding.tsx
│   ├── auth/                   # AuthLayout, OtpInput, PasswordInput, ProgressPill
│   ├── listings/               # ClientListingsContent, FilterSidebar, PropertyGallery,
│   │                           # PropertyInfoBar, PropertyTabs, AgentSidebar,
│   │                           # DeveloperSidebar, SimilarProperties
│   ├── map/                    # MapMarkers, ClusterPanel, MapStyleSwitcher
│   ├── shared/                 # PropertyCard
│   └── dashboard/
│       ├── agent/              # AgentStats, RevenueCharts, RecentTransactions,
│       │                       # Sidebar, TopNavBar, InspectionSetupModal,
│       │                       # property-create/, wallet/, messages/, calendar/,
│       │                       # documents/, settings/
│       └── kyc/                # KYCModal + 5 step components
│
├── lib/
│   ├── constants.ts            # PRICE_MIN=0, PRICE_MAX=100_000_000
│   ├── types.ts                # Property, PropertyWithCoords
│   ├── data/                   # Mock data files (properties, amenities, details)
│   │   ├── properties.ts       # sampleProperties (6 items, legacy — may be unused)
│   │   ├── standardProperties.ts  # standardProperties (37 items, /listings)
│   │   ├── developerProperties.ts # developerProperties (~20 items, /developers)
│   │   ├── propertyDetails.ts  # Extended detail mock data
│   │   └── amenities.ts        # defaultAmenities, amenitiesByType
│   ├── store/                  # 15 Zustand stores (see State Management section)
│   ├── hooks/
│   │   └── usePropertyModals.ts  # URL-driven modal state (8 modals + anyOpen)
│   └── utils/
│       └── authValidation.ts   # Email, password, phone validation helpers
│
└── global.d.ts                 # Declares mapbox-gl module
```

---

## State Management — Zustand Stores

All stores are in `lib/store/`. Every store with API dependencies has `*Mock()` functions that simulate network delays. When integrating a real backend, replace the mock function body with actual `fetch()` calls — the state shape should remain the same.

### Store Inventory

| Store | File | Purpose | Mock Functions |
|-------|------|---------|----------------|
| `useAuthStore` | `useAuthStore.ts` | Login state, user profile (in-memory only) | `login()` — mock, no API |
| `useSignupStore` | `useSignupStore.ts` | Multi-step signup wizard state | None (local state only) |
| `useFavouritesStore` | `useFavouritesStore.ts` | Liked property IDs, optimistic toggle | `toggleLike()` → `PATCH /api/listings/{id}/favourite` |
| `useListingsStore` | `useListingsStore.ts` | Listings page filters, pagination, search | None (client-side filtering) |
| `useDeveloperListingsStore` | `useDeveloperListingsStore.ts` | Developer listings (near-clone of above) | None |
| `useMapStore` | `useMapStore.ts` | Cluster panel, "search this area" state | None |
| `useAgentDashboardStore` | `useAgentDashboardStore.ts` | Agent stats, KYC progress, revenue, transactions | `fetchDashboardData()`, `mockSubmitKycForVerification()` |
| `useAgentPropertiesStore` | `useAgentPropertiesStore.ts` | Agent's property list, filters, CRUD | `fetchProperties()`, `deleteProperty()` |
| `useCreatePropertyStore` | `useCreatePropertyStore.ts` | 5-step property creation wizard | `submitProperty()` |
| `useWalletStore` | `useWalletStore.ts` | Wallet/escrow balances, transactions, modals | `fetchLedgerMock()`, `processWithdrawalMock()`, `updateFiatDetailsMock()` |
| `useMessagesStore` | `useMessagesStore.ts` | Chat threads, messages, uploads | `fetchThreadsMock()`, `sendMessageMock()` |
| `useCalendarStore` | `useCalendarStore.ts` | Inspection calendar, events, availability | `fetchEventsMock()`, `saveAvailabilityMock()` |
| `useDocumentsStore` | `useDocumentsStore.ts` | Document list, 3-step wizard | `fetchDocumentsListMock()`, `createDocumentMock()` |
| `useSettingsStore` | `useSettingsStore.ts` | Profile, payout, security, commissions, help | `submitProfileMock()`, `submitPayoutMock()`, `submitSecurityMock()`, `submitHelpTicketMock()`, `submitCommissionMock()` |
| `useSidebarStore` | `useSidebarStore.ts` | Dashboard sidebar toggle | None |

### Key State Types

```typescript
// Auth
interface User { name: string; email: string }

// Properties
type Property = { id: number; title: string; location: string; price: string; beds?: number; baths?: number; area?: string; tag?: 'For Rent' | 'For Sale'; image?: string; agent?: string; agentId?: number }
type PropertyWithCoords = Property & { lat?: number; lng?: number; category?: 'sale' | 'rent' | 'shortlet'; neighbourhood?: string; isVerified?: boolean; hasVirtualTour?: boolean; isFavourited?: boolean; listedAt?: string; priceReduced?: boolean; originalPrice?: string; priceLabel?: string; sizeSqm?: number }

// Agent Properties
type PropertyCategory = 'Residential' | 'Commercial' | 'Plots/Lands' | 'Service Apartments & Short Lets' | 'PG/Hostel'
type ListingType = 'For Sale' | 'For Rent'
type PropertyStatus = 'Under Construction' | 'Ready'

// Dashboard
interface AgentProfile { id: string; name: string; avatarUrl: string; kycStatus: 'unverified' | 'in-progress' | 'verified'; kycProgress: number }
interface Transaction { id: string; date: string; propertyName: string; propertyType: string; clientName: string; transactionType: string; amount: number; status: 'Pending' | 'Completed' | 'Failed' | 'In-progress' }

// Messages
interface ChatThread { id: string; participant: UserBase; lastMessage: string; lastMessageTime: string; unreadCount: number; propertyContext: PropertyContext; messages: Message[] }
interface Message { id: string; chatId: string; senderId: string; content: string; contentType: 'text' | 'document' | 'image_grid' | 'video'; files?: FilePayload[]; createdAt: string; timestamp: string }
```

---

## Completed Refactoring

### Listings Unification ✅
`/listings` and `/listings/developers` share `ClientListingsContent.tsx` via config-injection (`ListingsPageConfig`). Thin wrappers bind the appropriate store and data source.

### Detail Page Decomposition ✅
Detail pages compose from: `PropertyGallery`, `PropertyInfoBar`, `PropertyTabs`, `AgentSidebar`/`DeveloperSidebar`, `SimilarProperties`, `usePropertyModals()`.

### Image Optimization ✅
All `<img>` tags replaced with `next/image`. Exception: `MapMarkers.tsx` (Mapbox popup HTML strings).

---

## Coding Conventions

### Component Patterns

- **All page components use `"use client"`** — no server components beyond layout wrappers.
- **Modals use URL query params** for state (e.g., `?bookTour=1`). Browser Back closes modals.
- **Zustand stores** are in `lib/store/`. State split by feature.
- **Data files** live in `lib/data/`. Three property datasets exist.
- **`@/*` path alias** maps to `./src/*`.

### Naming Conventions

- **Components:** PascalCase filenames (e.g., `PropertyCard.tsx`)
- **Stores:** `use[Feature]Store.ts` (e.g., `useListingsStore.ts`)
- **Data files:** camelCase (e.g., `properties.ts`, `amenities.ts`)
- **Hooks:** `use[Feature].ts` (e.g., `usePropertyModals.ts`)
- **Routes:** Next.js App Router conventions (`page.tsx`, `[id]`, `layout.tsx`)

### CSS / Styling

- **Tailwind CSS v4** — utility classes in JSX. No CSS modules.
- **`globals.css`** — Mapbox GL overrides, signup responsive styles, font setup.
- **Lato font** via `next/font/google`, exposed as `--font-lato` CSS variable.
- **Color palette:** Primary blue `#2563EB`, gray scale from Tailwind defaults.
- **Tag colors:** Blue for sale, green for rent.
- **Responsive:** Mobile-first Tailwind breakpoints. Sidebar hidden on mobile, visible on `md:`.

### ESLint Rules

- `@next/next/no-img-element`: **warn**
- `@typescript-eslint/no-unused-vars`: **warn**
- `@typescript-eslint/no-explicit-any`: **warn**

---

## Dashboard Features Reference

The agent dashboard (`/dashboard/agent/*`) is the most complex section. Here's what each page does:

### Main Dashboard (`/dashboard/agent`)
- Shows KYC progress with circular indicator
- KYC modal (5 steps: Personal Info → Phone Verify → ID Verify → Face Match → Payment Details)
- Stats cards (listings, deals, tours) — only shown when KYC verified
- Revenue charts (Recharts bar/line) — inspection fees, sales, rentals
- Recent transactions table
- Demo controls for fast KYC verification (dev only)

### Properties (`/dashboard/agent/properties`)
- Grid of agent's listings with tabs (For Sale / For Rent)
- Category filter (Residential, Commercial, Plots/Lands, etc.)
- Search with 300ms debounce
- 5-step create property wizard (Type → Details → Media → Pricing → Review)
- Delete with confirmation. **Edit flow not yet implemented.**

### Messages (`/dashboard/agent/messages`)
- 3-pane layout: InboxList | ChatWindow | ContextPanel
- Thread search, active chat selection
- Message bubbles with timestamps
- File upload modals exist but are **not wired up**
- Responsive: panes collapse on mobile

### Calendar (`/dashboard/agent/calendar`)
- Desktop: 7×5 CSS grid calendar with event chips
- Mobile: condensed daily feed view
- Month navigation triggers mock data refetch
- Setup availability modal

### Documents (`/dashboard/agent/documents`)
- Document list with search/filter
- 3-step wizard: Template Selection → Form → Review
- Templates: Standard Rental Agreement, Property Sale Agreement
- **View/Edit/Delete actions are non-functional placeholders**

### Wallet (`/dashboard/agent/wallet`)
- Wallet balance + escrow balance cards
- Transaction history with search
- Modals: Deposit, Withdraw, Change Method, Edit Bank, Success
- Fiat (bank) and Crypto (USDT/BTC/ETH) withdrawal methods

### Settings (`/dashboard/agent/settings`)
- 6 tabs: Profile, Payout, Subscription Plans, Commissions, Account, Help Center
- Profile: name, phone, about, social links, avatar (upload UI only)
- Payout: bank details or crypto wallet
- Security: password change, PIN change
- Commissions: fee type (percentage or fixed amount)

---

## Known Issues & Technical Debt

### Critical

1. **No Auth Middleware:** Dashboard routes are not protected. Any visitor can access `/dashboard/*` by navigating directly. Need Next.js middleware or layout-level auth guard.

2. **Session Not Persisted:** `useAuthStore` is in-memory only. Login state lost on page refresh. Need `localStorage`, cookies, or Zustand `persist` middleware.

3. **No Error Handling:** Mock functions never fail. No error boundaries on pages. No `.catch()` handlers except in `useFavouritesStore`.

### High

4. **Store Duplication:** `useListingsStore` and `useDeveloperListingsStore` share the same interface but are separate stores. Should be merged into a parameterized factory.

5. **Price as String:** `Property.price` is formatted (e.g., `'₦ 20,000,000'`). Filtering requires fragile `parseInt(p.price.replace(...))`. Add numeric `priceValue` field.

6. **PropertyWithCoords has 11 optional fields:** Poor type coverage. Many fields should be required when used in specific contexts.

### Medium

7. **Google OAuth:** Button present but shows `alert("Coming Soon")`.
8. **Virtual Tours:** Routes exist, links present, but not a real VR/3D experience.
9. **KYC Verification:** Always succeeds. No real BVN/ID/face verification.
10. **Pagination is UI-only:** All pagination controls are mockups (e.g., "Page 1 of 30").
11. **File uploads:** Upload modals and staging exist but nothing is actually uploaded.
12. **No test infrastructure:** No test framework or test files exist.
13. **Missing SEO metadata:** Only root layout and detail pages export `generateMetadata`.
14. **No `robots.txt`** in `/public`.

### Low

15. **`window.__irealty_toggleLike` global** for Mapbox popup interaction (unavoidable).
16. **Old `sampleProperties` data** (`lib/data/properties.ts`, 6 items) — possibly unused, can delete.
17. **Build artifacts** (`.txt` log files) in working directory should be gitignored.

---

## Rules for AI Assistants

### DO

- Use `"use client"` for any component using hooks, event handlers, or browser APIs.
- Use Zustand stores for cross-component state; keep stores in `lib/store/`.
- Use `@/*` import alias for all project imports.
- Use `next/image` for images (not raw `<img>`).
- Use `next/link` for internal navigation (not `<a href>`).
- Keep property data in `lib/data/` — treat data files as the mock API layer.
- Use Tailwind utility classes (no inline styles except dynamic values).
- Test changes work on **both** `/listings` and `/listings/developers`.
- Use `PropertyWithCoords` for any property data with map coordinates.
- Follow URL query param pattern for modals (e.g., `?modalName=1`).
- Use `usePropertyModals()` hook for detail page modal state.
- Compose detail pages from extracted components.
- Export types from store files when consumed by other modules.
- Verify imports compile (`npm run build`) after structural changes.
- When replacing mock functions with real API calls, keep the same state shape.
- Handle loading, error, and empty states in every data-fetching component.
- Format currency with `Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" })`.

### DON'T

- Don't add more code to detail pages — compose from existing sub-components.
- Don't create `dangerouslySetInnerHTML` blocks — put CSS in `globals.css`.
- Don't add `font-family` inline styles — Lato is globally applied via CSS variable.
- Don't add `eslint-disable` comments without documenting the reason.
- Don't use `any` types — use proper TypeScript types or `unknown`.
- Don't duplicate stores — parameterize existing ones if a new variant is needed.
- Don't store build artifacts or log files in the repository.
- Don't create new property data files — extend existing ones in `lib/data/`.
- Don't add new dependencies without justification. The stack is intentionally lean.
- Don't implement real payment processing without proper security review.

### Currency / Locale

- Nigerian market: prices in Naira (₦ / NGN).
- Use `Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" })`.
- `PRICE_MIN = 0`, `PRICE_MAX = 100_000_000` (100M NGN) in `lib/constants.ts`.

### Map Integration

- Mapbox GL JS v3 — token from `NEXT_PUBLIC_MAPBOX_TOKEN`.
- Default center: Lagos, Nigeria `[3.42, 6.45]`.
- Maps use 3D mode (`pitch: 60`, `minPitch: 45`).
- `MapMarkers.tsx` handles markers, popups, clustering, landmarks imperatively (returns `null`).
- Popup favourite toggle uses `window.__irealty_toggleLike` global.

---

## Backend Integration Guide

When connecting a real backend, follow this pattern for each store:

```typescript
// BEFORE (mock)
fetchDashboardData: async () => {
  set({ isLoading: true });
  await new Promise(r => setTimeout(r, 800));
  set({ stats: mockStats, isLoading: false });
}

// AFTER (real API)
fetchDashboardData: async () => {
  set({ isLoading: true, error: null });
  try {
    const res = await fetch('/api/dashboard', {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    set({ stats: data.stats, revenueData: data.revenue, isLoading: false });
  } catch (err) {
    set({ error: err.message, isLoading: false });
  }
}
```

Key principles:
1. Replace `setTimeout` mock bodies — keep the same action signatures.
2. Add `error` state handling (most stores already have `error: string | null`).
3. Add auth headers from a token provider (cookie, localStorage, or auth store).
4. Keep optimistic updates for UX-critical actions (favourites, message send).
5. See `API_SPEC.md` for the full endpoint specification.
