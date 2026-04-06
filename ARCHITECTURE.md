# ARCHITECTURE.md — i-Realty Frontend

> Detailed architecture reference for developers and AI assistants.

## System Overview

i-Realty is a **client-rendered Next.js 15 App Router** application. Despite using the App Router, nearly all pages are `"use client"` components — the server-side layer is used primarily for layout wrappers, metadata generation, and Suspense boundaries.

```
┌─────────────────────────────────────────────────────────┐
│                     Next.js App Router                   │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────────┐  │
│  │  Public   │  │   Auth   │  │   Agent Dashboard     │  │
│  │  Pages    │  │  Pages   │  │   (Protected)         │  │
│  │          │  │          │  │                       │  │
│  │ Landing  │  │ Login    │  │ Stats  Properties    │  │
│  │ Listings │  │ Signup   │  │ Messages Calendar    │  │
│  │ Details  │  │ Reset    │  │ Documents Wallet     │  │
│  │ Agents   │  │          │  │ Settings             │  │
│  └────┬─────┘  └────┬─────┘  └───────────┬───────────┘  │
│       │              │                    │              │
│  ┌────┴──────────────┴────────────────────┴───────────┐  │
│  │              Zustand State Layer (15 stores)        │  │
│  └────────────────────────┬───────────────────────────┘  │
│                           │                              │
│  ┌────────────────────────┴───────────────────────────┐  │
│  │         Mock API Layer (*Mock() functions)          │  │
│  │         → Replace with real fetch() calls           │  │
│  └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Routing Map

### Public Routes

| Route | Page File | Description |
|-------|-----------|-------------|
| `/` | `app/page.tsx` | Landing page — Hero, features, testimonials, FAQ |
| `/listings` | `app/listings/page.tsx` | Standard property listings with map + filters |
| `/listings/[id]` | `app/listings/[id]/page.tsx` | Property detail — gallery, tabs, agent card |
| `/listings/[id]/book-tour` | `app/listings/[id]/book-tour/` | Tour booking flow |
| `/listings/[id]/virtual-tour` | `app/listings/[id]/virtual-tour/` | Image carousel viewer |
| `/listings/[id]/profile` | `app/listings/[id]/profile/` | Agent profile from listing |
| `/listings/developers` | `app/listings/developers/page.tsx` | Developer project listings |
| `/listings/developers/[id]` | `app/listings/developers/[id]/page.tsx` | Developer property detail |
| `/agents/[id]` | `app/agents/[id]/page.tsx` | Agent profile page |

### Auth Routes

| Route | Page File | Description |
|-------|-----------|-------------|
| `/auth/login` | `app/auth/login/page.tsx` | Email/password login + Google OAuth (placeholder) |
| `/auth/signup` | `app/auth/signup/page.tsx` | Step 1: Role selection |
| `/auth/signup/account` | `app/auth/signup/account/` | Step 2: Account details |
| `/auth/signup/verify` | `app/auth/signup/verify/` | Step 3: Email/OTP verification |
| `/auth/signup/success` | `app/auth/signup/success/` | Step 4: Success |
| `/auth/reset` | `app/auth/reset/page.tsx` | Password reset entry |
| `/auth/reset/verify` | `app/auth/reset/verify/` | Reset OTP verification |
| `/auth/reset/new-password` | `app/auth/reset/new-password/` | Set new password |
| `/auth/reset/success` | `app/auth/reset/success/` | Reset success |

### Dashboard Routes (Protected — needs auth middleware)

| Route | Page File | Description |
|-------|-----------|-------------|
| `/dashboard/agent` | `app/dashboard/agent/page.tsx` | KYC onboarding + stats |
| `/dashboard/agent/properties` | `app/dashboard/agent/properties/page.tsx` | Property management |
| `/dashboard/agent/messages` | `app/dashboard/agent/messages/page.tsx` | 3-pane messaging |
| `/dashboard/agent/calendar` | `app/dashboard/agent/calendar/page.tsx` | Inspection calendar |
| `/dashboard/agent/documents` | `app/dashboard/agent/documents/page.tsx` | Lease agreement generator |
| `/dashboard/agent/wallet` | `app/dashboard/agent/wallet/page.tsx` | Balance + transactions |
| `/dashboard/agent/settings` | `app/dashboard/agent/settings/page.tsx` | Profile + account settings |

---

## Component Architecture

### Layout Hierarchy

```
RootLayout (app/layout.tsx)
  ├── fonts: Lato via next/font/google
  ├── globals.css
  │
  ├── Public Pages
  │   └── ListingsLayout (app/listings/layout.tsx)
  │       ├── Navbar
  │       ├── {children}
  │       └── Footer
  │
  ├── Auth Pages
  │   └── AuthLayout (components/auth/AuthLayout.tsx)
  │       ├── Logo
  │       └── Centered card
  │
  └── Dashboard Pages
      └── DashboardLayout (app/dashboard/agent/layout.tsx)
          ├── Sidebar (fixed left, hidden on mobile)
          ├── TopNavBar (sticky top)
          └── {children} (scrollable main)
```

### Component Categories

**Page Sections** (landing page):
```
Hero → SearchCard
VerifiedFeatures
AudienceSection
CategoryGrid
RecentProperties → PropertyCard
AgentDiasporaPromo
TestimonialSection
FAQSection
Footer
```

**Listings Components** (config-driven, shared by standard + developer):
```
ClientListingsContent
  ├── FilterSidebar (type, beds, amenities, price range)
  ├── PropertyCard[] (grid)
  ├── MapMarkers (Mapbox imperative)
  │   ├── ClusterPanel
  │   └── MapStyleSwitcher
  └── Pagination
```

**Detail Page Composition**:
```
PropertyDetail
  ├── PropertyGallery (images + overlays)
  ├── PropertyInfoBar (type, beds, area, date)
  ├── PropertyTabs (description, amenities, docs, landmarks)
  ├── AgentSidebar / DeveloperSidebar
  ├── SimilarProperties
  └── Modals (via usePropertyModals)
      ├── BookTourModal → PaymentOptionsModal → BookingConfirmationModal
      ├── ReserveModal → ReservePaymentModal → ReserveConfirmationModal
      ├── ChatModal
      └── MapModal
```

**Dashboard Components**:
```
DashboardLayout
  ├── Sidebar (nav links, collapsible)
  ├── TopNavBar (avatar, notifications bell, logout)
  │
  ├── Main Dashboard
  │   ├── KYCModal (5 steps)
  │   ├── AgentStats (4 KPI cards)
  │   ├── RevenueCharts (Recharts)
  │   └── RecentTransactions (table)
  │
  ├── Properties
  │   ├── Tab bar (For Sale / For Rent)
  │   ├── Category filter chips
  │   ├── AgentPropertyCard[] (grid)
  │   └── CreatePropertyModal (5-step wizard)
  │
  ├── Messages
  │   ├── InboxList (search + thread list)
  │   ├── ChatWindow (header + messages + input)
  │   │   ├── MessageBubble[]
  │   │   └── MessageInput (text + file button)
  │   └── ContextPanel (property info + participants)
  │
  ├── Calendar
  │   ├── DesktopCalendarGrid (7x5 CSS grid)
  │   ├── MobileCalendarView (daily feed)
  │   └── SetupAvailabilityModal
  │
  ├── Documents
  │   ├── DocumentsList (table/cards + search)
  │   └── DocumentWizardContext (3-step)
  │
  ├── Wallet
  │   ├── WalletOverviewCard (2 balance cards)
  │   ├── TransactionHistory (search + list)
  │   └── Modals (Deposit, Withdraw, ChangeMethod, EditBank, Success)
  │
  └── Settings
      ├── ProfileSettings (info + socials)
      ├── PayoutSettings (bank + crypto)
      ├── SubscriptionSettings
      ├── CommissionSettings
      ├── AccountSettings (security)
      └── HelpCenterSettings
```

---

## State Management Architecture

### Store Relationships

```
useAuthStore ──────────┐
                       │  Auth state feeds into
useSignupStore         │  dashboard access check
                       │  (NOT IMPLEMENTED YET)
                       ▼
useAgentDashboardStore ──→ KYC gates dashboard content
       │
       │  Property creation injects into:
       ▼
useAgentPropertiesStore ←── useCreatePropertyStore
       │
useWalletStore (independent)
useMessagesStore (independent)
useCalendarStore (independent)
useDocumentsStore (independent)
useSettingsStore (independent)
useSidebarStore (UI only)

useListingsStore (public listings)
useDeveloperListingsStore (public dev listings)
useMapStore (map UI state)
useFavouritesStore (cross-cutting, used in listings + map popups)
```

### Data Flow Patterns

**1. Page Mount → Mock Fetch → Render**
```
Component useEffect → store.fetchMock() → setTimeout → set(data) → re-render
```

**2. Optimistic Update (favourites)**
```
User clicks → toggle Set immediately → fire-and-forget API → rollback on failure
```

**3. URL-Driven Modals**
```
Button click → router.push(?modal=1) → useSearchParams reads → modal renders
Browser Back → param removed → modal unmounts
```

**4. Multi-Step Wizards (KYC, Create Property, Documents)**
```
Store tracks currentStep → Component renders step[currentStep]
Each step validates → calls store.nextStep() → last step calls submit()
```

---

## Design System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#2563EB` (blue-600) | Buttons, links, active states |
| Primary Hover | `#1D4ED8` (blue-700) | Button hover |
| Background | `#FFFFFF` | Page background |
| Dashboard BG | `#F8FAFC` (slate-50) | Dashboard background |
| Text Primary | `#111827` (gray-900) | Headings |
| Text Secondary | `#6B7280` (gray-500) | Body text, labels |
| Text Muted | `#9CA3AF` (gray-400) | Placeholders, hints |
| Border | `#E5E7EB` (gray-200) | Card borders, dividers |
| Sale Tag | Blue background | "For Sale" badges |
| Rent Tag | Green background | "For Rent" badges |
| Error | `#DC2626` (red-600) | Error text, destructive actions |
| Success | `#16A34A` (green-600) | Success states |

### Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Headings | Lato | 700 (Bold) | 24-32px |
| Subheadings | Lato | 600 (Semi) | 18-20px |
| Body | Lato | 400 (Regular) | 14-16px |
| Labels | Lato | 500 (Medium) | 12-14px |
| Buttons | Lato | 600 (Semi) | 14-16px |

### Spacing Scale

Uses Tailwind's default 4px base: `p-1` (4px), `p-2` (8px), `p-3` (12px), `p-4` (16px), `p-5` (20px), `p-6` (24px).

### Component Patterns

| Pattern | Implementation |
|---------|---------------|
| Cards | `bg-white rounded-xl shadow-sm border border-gray-200 p-4` |
| Modals | Fixed overlay + centered card, close via X or backdrop click |
| Buttons (primary) | `bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700` |
| Buttons (outline) | `border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50` |
| Form inputs | `border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500` |
| Tabs | Horizontal pill bar with active state highlight |
| Empty states | Centered icon + message + optional CTA button |

### Responsive Breakpoints

| Breakpoint | Tailwind | Usage |
|------------|----------|-------|
| Mobile | default | Single column, hamburger nav, stacked cards |
| Tablet | `md:` (768px) | 2-column grids, sidebar appears |
| Desktop | `lg:` (1024px) | 3-4 column grids, full sidebar |
| Wide | `xl:` (1280px) | Max-width containers |

---

## Map Architecture

### Mapbox Integration

The map system uses Mapbox GL JS v3 with imperative rendering (not React-Mapbox wrappers).

```
MapModal / Listings Page
  └── <div ref={mapContainer} />
      └── MapMarkers (imperative, returns null)
          ├── Marker creation via mapboxgl.Marker
          ├── Popup HTML via .setHTML() (raw strings)
          ├── Clustering via GeoJSON source + circle/symbol layers
          ├── Style switching (light/satellite) via MapStyleSwitcher
          └── Landmark fetching (nearby POIs)
```

**Key implementation details:**
- Map token: `NEXT_PUBLIC_MAPBOX_TOKEN` from `.env.local`
- Default center: Lagos `[3.42, 6.45]`, pitch: 60, minPitch: 45
- Clustering: GeoJSON point features, cluster radius 50
- Popups: Raw HTML strings — can't use React components inside
- Favourite toggle in popups: `window.__irealty_toggleLike` global callback
- `MapMarkers.tsx` is ~475 lines — the largest single component

---

## Authentication Architecture (Current State)

```
┌──────────┐     ┌──────────────┐     ┌─────────────┐
│  Login   │────→│ useAuthStore  │────→│  In-Memory   │
│  Page    │     │  .login()     │     │  { user }    │
└──────────┘     └──────────────┘     └─────────────┘
                       │                     │
                       │  NO persistence     │  Lost on refresh
                       │  NO middleware       │  NO route protection
                       │  NO tokens           │  NO session recovery
```

**What needs to happen:**
1. Add Next.js middleware (`middleware.ts`) to protect `/dashboard/*` routes
2. Add `persist` middleware to `useAuthStore` (localStorage or cookies)
3. Connect login/signup to real auth API (JWT or session cookies)
4. Add token refresh logic
5. Add Google OAuth redirect flow

---

## Performance Considerations

**Current strengths:**
- Next.js Image optimization on all images (except Mapbox popups)
- Suspense boundaries on listing pages
- Client-side filtering (no API round-trips for filter changes)

**Current weaknesses:**
- No code splitting beyond Next.js automatic route splitting
- No lazy loading of heavy components (Mapbox, Recharts)
- All property data loaded at once (no pagination API)
- No service worker or offline support
- Mapbox GL bundle: ~200KB gzipped
- Recharts bundle: ~100KB gzipped

**Recommended optimizations:**
- `dynamic(() => import(...), { ssr: false })` for MapMarkers and chart components
- Server-side pagination when backend exists
- Image CDN for property photos (currently Unsplash URLs)
- Prefetch dashboard data on auth
