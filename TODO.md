# TODO.md — i-Realty Frontend

> Comprehensive audit-based roadmap. Each item reflects the **actual current state** of the codebase as of 2026-04-07.
> Items are grouped by priority, then by area. Checked items (- [x]) are done.

---

## Current State Summary

| Area | Completion | Notes |
|------|-----------|-------|
| **Public pages** (landing, listings, detail, profiles) | 95% | Production-ready with mock data |
| **Agent dashboard** | 92% | Edit property flow missing |
| **Admin dashboard** | 92% | Full UI, bulk actions, broadcast done |
| **Developer dashboard** | 88% | Projects wizard complete; edit flow missing |
| **Seeker dashboard** | 88% | All pages implemented |
| **Diaspora dashboard** | 88% | All pages including service catalog |
| **Landlord dashboard** | 85% | All pages built, needs polish |
| **Auth system** | 92% | Login/signup/reset work; middleware + session persist done; Google OAuth stub |
| **Dark mode** | 60% | Toggle + ThemeProvider done; ~70% of components lack `dark:` variants |
| **i18n** | 30% | 4 languages, 125+ keys, store ready; only Sidebar/TopNav/Notifications wired |
| **Notifications** | 90% | Full UI + store; mock data only |
| **Offline / PWA** | 90% | Service worker + indicator implemented |
| **Testing** | 10% | Vitest configured; 3 test files exist |
| **Backend integration** | 5% | API client exists; all stores use mock functions |

---

## Completed Since Last Audit

- [x] ~~Dark mode support~~ — ThemeProvider, useThemeStore, light/dark/system toggle in settings
- [x] ~~Notification system~~ — useNotificationStore + NotificationDropdown with 6 notification types
- [x] ~~Admin bulk actions~~ — BulkActionBar + checkbox selection on admin properties page
- [x] ~~Admin broadcast messaging~~ — BroadcastModal with target audience selection
- [x] ~~Push notifications~~ — PushNotificationManager with permission flow + SW
- [x] ~~Offline support~~ — Service worker caching + OfflineIndicator component
- [x] ~~Landlord dashboard~~ — All 8 pages (overview, properties, messages, documents, wallet, transactions, settings)
- [x] ~~Auth middleware~~ — `middleware.ts` protects `/dashboard/*` with `irealty-session` cookie
- [x] ~~Session persistence~~ — useAuthStore with Zustand `persist` + localStorage
- [x] ~~Form validation schemas~~ — Zod schemas in `lib/validations/` for KYC, settings, wizards
- [x] ~~Test infrastructure~~ — vitest.config.ts + 3 initial test files
- [x] ~~i18n infrastructure~~ — 4 languages (en/yo/ig/ha), 125+ keys, Zustand store, LanguageSwitcher
- [x] ~~Seeker/Diaspora/Developer dashboards~~ — All nav pages implemented
- [x] ~~Settings pages~~ — All 6 roles have settings pages with profile/payout/security
- [x] ~~ESC key on modals~~ — All 12 missing modals now have `useEscapeKey` support
- [x] ~~KYC ID verification validation~~ — Step 3 now shows inline errors on attempt
- [x] ~~Password condition checklist~~ — Live-updating checklist on signup page
- [x] ~~Required field asterisks~~ — Added to signup form and KYC Step 1/3
- [x] ~~Admin checkbox design~~ — Improved size, accent color, hover states
- [x] ~~Notification dark mode highlight~~ — Fixed unread item background color
- [x] ~~Sidebar double-highlight~~ — Fixed `startsWith` matching to use trailing slash
- [x] ~~Admin messages dark mode~~ — AdminChatWindow + AdminContextPanel fully dark-mode ready
- [x] ~~Translation wiring~~ — Sidebar nav, TopNavBar page titles, NotificationDropdown use `t()`

---

## P0 — Critical (Must fix before any production use)

### Backend Integration

- [ ] **Replace all mock store functions with real API calls**
  - API client utility exists at `lib/api/client.ts` with GET/POST/PATCH/PUT/DELETE helpers
  - Every store has isolated `*Mock()` functions — replace the `setTimeout` body with `fetch()` calls
  - Priority order:
    1. `useAuthStore` — login/signup/logout (gates everything)
    2. `useAgentDashboardStore` — KYC submit + dashboard data
    3. `useAgentPropertiesStore` — property CRUD
    4. `useTransactionsStore` — transaction list + detail + actions
    5. `useWalletStore` — ledger + deposit + withdrawal
    6. `useMessagesStore` — threads + send messages
    7. `useCalendarStore` — events + availability
    8. `useDocumentsStore` — list + create
    9. `useSettingsStore` — all settings endpoints
    10. `useAdminDashboardStore` — admin overview + user/property/transaction management
    11. `useAdminMessagesStore` — admin support tickets
    12. `useDeveloperDashboardStore` + `useCreateProjectStore` — developer flows
    13. `useSeekerDashboardStore` + `useSeekerPropertiesStore` + `useSeekerTransactionsStore`
    14. `useDiasporaDashboardStore` — invoices/payments/timeline
    15. `useFavouritesStore` — already has fetch structure, just needs real URL
    16. `useListingsStore` / `useDeveloperListingsStore` — server-side search + pagination
  - See `API_SPEC.md` for the full endpoint specification
  - See `CLAUDE.md` → "Backend Integration Guide" for the replacement pattern

### Auth

- [ ] **Implement Google OAuth flow**
  - Login: `alert("Google OAuth Coming Soon")` at `app/auth/login/page.tsx:119`
  - Signup: `alert("Google OAuth Coming Soon")` at `app/auth/signup/account/page.tsx:181`
  - Replace with real OAuth redirect (Firebase Auth, Auth0, or direct Google)

- [ ] **Wire up email/OTP verification to real backend**
  - Signup verify: `app/auth/signup/verify/page.tsx` — mock OTP always succeeds
  - Reset verify: `app/auth/reset/verify/page.tsx` — mock resend is `alert("Code resent!")`

### Error Handling

- [ ] **Add error handling to all data-fetching pages**
  - Mock functions never fail — no error UI is ever shown
  - Add `.catch()` handlers to all store actions
  - Show inline error states with retry buttons
  - Error boundaries exist for listings/detail but not dashboard pages

### Data Integrity

- [ ] **Add numeric price field to Property type**
  - `Property.price` is a formatted string (e.g., `'₦ 20,000,000'`)
  - Filtering requires fragile `parseInt(price.replace(...))` parsing
  - Add `priceValue: number` to `Property` and `PropertyWithCoords` types
  - Files: `lib/types.ts`, `lib/data/standardProperties.ts`, `lib/data/developerProperties.ts`

---

## P1 — High Priority (Feature gaps & dark mode)

### Dark Mode Gaps

- [ ] **Fix dark mode coverage across the app (~70% of components still light-only)**
  - ~503 instances of `bg-white` but only ~53 have corresponding `dark:bg-*` variants
  - **Critical areas** (visible in screenshots):
    - Admin Settings / Platform Fees: `components/dashboard/admin/settings/AdminPlatformFees.tsx` — all fee cards use `bg-white` without dark variants
    - Landing page VerifiedFeatures: `components/VerifiedFeatures.tsx:42` — cards use `bg-[#EEF8FB]`, `bg-[#EEF2FF]`, etc. with no dark equivalents
    - Admin Finance page: `app/dashboard/admin/finance/page.tsx` — 6+ `bg-white` cards
    - Admin User Detail: `app/dashboard/admin/users/[id]/page.tsx` — profile card, KYC section
    - Admin Transaction Detail: `app/dashboard/admin/transactions/[id]/page.tsx` — all cards
    - All wallet modals: `components/dashboard/agent/wallet/modals/` — all use `bg-white`
    - Auth pages: login/signup/reset forms all use `bg-white`
    - KYC Modal: `components/dashboard/kyc/KYCModal.tsx` — `bg-white` wrapper and steps
    - Agent properties table: `app/dashboard/admin/properties/page.tsx` — table container
  - Pattern to apply: every `bg-white` should get a `dark:bg-[#1e1e1e]` or `dark:bg-gray-800`; every `text-gray-900` should get `dark:text-gray-100`; every `border-gray-100` should get `dark:border-gray-700`

### Agent Dashboard

- [ ] **Implement property edit flow**
  - Edit button exists at `app/dashboard/agent/properties/[id]/page.tsx:76` but has no `onClick` handler
  - Reuse `CreatePropertyModal` with pre-populated data or build a dedicated edit variant
  - Need `updateProperty()` store action in `useAgentPropertiesStore`

- [ ] **Uncomment and wire file uploads in messages**
  - Upload modals exist but are **commented out** at `app/dashboard/agent/messages/page.tsx:55-56`
  - `UploadMediaModal` and `UploadDocumentModal` components are built but unused
  - `stagedFiles` is typed as `any[]` in `useMessagesStore` — needs proper typing

- [ ] **Complete property detail tabs**
  - Amenities tab uses mock data at `app/dashboard/agent/properties/[id]/page.tsx:181-195`
  - Documents tab uses `MOCK_DOCUMENTS` hardcoded array
  - Landmarks tab uses `MOCK_LANDMARKS` hardcoded array
  - Should pull from property data or dedicated API

### Developer Dashboard

- [ ] **Wire up project edit flow**
  - Project cards have Edit in dropdown at `app/dashboard/developer/projects/page.tsx:115`
  - `loadProjectForEdit()` is called but wizard doesn't auto-populate
  - Store accepts project data but UI doesn't merge it into form

- [ ] **Complete project detail page tabs**
  - `app/dashboard/developer/projects/[id]/page.tsx:57-58` — Amenities, Documents, Landmarks tabs are empty stubs
  - Virtual Tour button (line 75) doesn't open viewer
  - View On Map button (line 78) doesn't work

### Admin Dashboard

- [ ] **Wire up transaction detail action buttons**
  - "Flag for Review" at `app/dashboard/admin/transactions/[id]/page.tsx:124` — calls `flagTransactionMock()`
  - "Initiate Refund" at line 128 — calls `refundTransactionMock()`
  - "Message" buttons on party cards (lines 106, 116) — no `onClick` handler, just static UI

### Wallet

- [ ] **Connect deposit flow to payment gateway**
  - `FundDepositModal` shows static bank details + Paystack/Flutterwave buttons (UI only)
  - No real payment integration
  - File: `components/dashboard/agent/wallet/modals/FundDepositModal.tsx`

- [ ] **Connect withdrawal flow to real API**
  - Replace `processWithdrawalMock()` with real endpoint
  - Bank details editing exists but isn't persisted to backend

### i18n — Expand Translation Coverage

- [ ] **Wire `t()` throughout remaining components**
  - Currently wired: Sidebar nav labels, TopNavBar page titles, NotificationDropdown
  - Still needed: All auth pages, dashboard stats, table headers, button labels, settings forms, listing pages, property detail sections
  - 125+ keys already exist in all 4 language files — just need `useI18n()` + `t()` calls
  - Highest-impact targets:
    1. Auth pages (login/signup/reset) — user-facing
    2. Public Navbar + Footer — user-facing
    3. Dashboard stat cards and section headers
    4. Common buttons (Save, Cancel, Delete, Edit, etc.) — use `common.*` keys

---

## P2 — Medium Priority (Polish & UX)

### Real-time Features

- [ ] **Implement WebSocket messaging**
  - All messaging is mock/polling only across all roles
  - Add WebSocket for live messages, typing indicators, online status
  - Files: `lib/store/useMessagesStore.ts`, `lib/store/useAdminMessagesStore.ts`

- [ ] **Connect notification system to real backend**
  - `useNotificationStore` + `NotificationDropdown` are fully built but use mock data
  - Need real-time notification delivery (WebSocket or SSE)
  - Types already defined: message, tour, kyc, payment, property, system

### Pagination

- [ ] **Implement real pagination across all list pages**
  - All pagination controls are UI mockups with static totals
  - Affected: Agent properties, Admin users/properties/transactions, Developer projects, Seeker transactions/favorites, Diaspora transactions, Documents, Wallet transactions

### File Uploads

- [ ] **Implement avatar upload in settings**
  - Upload button UI exists in all profile settings forms
  - Uses `URL.createObjectURL()` for local preview only — not persisted
  - Files: `components/dashboard/admin/settings/AdminProfileSettings.tsx`, `components/dashboard/agent/settings/forms/ProfileSettings.tsx`

- [ ] **Implement media upload in property/project creation**
  - Step 3 (Media Upload) in both wizards uses placeholder images
  - `alert("Max 5 images allowed for demo.")` at `components/dashboard/agent/property-create/Step3MediaUpload.tsx:25`

### Booking

- [ ] **Fix "Add to Calendar" dates in booking confirmation**
  - `components/BookingConfirmationModal.tsx:51` — hardcodes a 3-day future date instead of actual booking date
  - Only supports Google Calendar, no Outlook/Apple Calendar

### Store Cleanup

- [ ] **Merge duplicate listing stores**
  - `useListingsStore` and `useDeveloperListingsStore` are near-clones
  - Create parameterized factory or single store with `source` discriminator

- [ ] **Fix `any` types in stores**
  - `useMessagesStore.ts:83` — `stagedFiles: any[]` should be typed
  - `useCreatePropertyStore.ts:210` — `as any` cast on `rentPriceType`

### Map

- [ ] **Wire "View On Map" buttons**
  - Agent property detail: `app/dashboard/agent/properties/[id]/page.tsx:100` — non-functional
  - Developer project detail: `app/dashboard/developer/projects/[id]/page.tsx:78` — non-functional

---

## P3 — Low Priority (SEO, Accessibility, Performance)

### SEO & Metadata

- [ ] **Add `robots.txt`**
  - `public/robots.txt` does not exist
  - Block `/dashboard/*`, `/auth/*`; allow `/listings`, `/agents`, landing

- [ ] **Add `generateMetadata` to all pages**
  - Currently only root layout, listings layout, and detail pages have metadata
  - Add to: `/auth/*`, `/dashboard/*`, `/agents/[id]`

- [ ] **Add Open Graph images for property detail pages**

### Accessibility

- [ ] **Add ARIA attributes to modals and interactive elements**
  - Modals should use `role="dialog"` and `aria-modal="true"`
  - Focus traps needed in modals

- [ ] **Add keyboard navigation**
  - Tab order through form elements
  - Enter key to submit forms (some missing)
  - Arrow key navigation in dropdowns

### Performance

- [ ] **Lazy load heavy components**
  - Use `dynamic(() => import(...), { ssr: false })` for:
    - MapMarkers (~475 lines, Mapbox GL ~200KB)
    - RevenueCharts / DeveloperRevenueCharts (Recharts ~100KB)
    - Calendar grid component
  - Note: Calendar already uses dynamic import ✓

- [ ] **Add loading skeletons to dashboard pages**
  - Some pages show spinner or blank during data fetch
  - Priority: Properties grid, Transaction table, Chat threads

### Testing

- [ ] **Expand test coverage**
  - Current: 3 test files (useAuthStore, useNotificationStore, authValidation)
  - Priority targets: remaining Zustand stores, Zod validation schemas, form components, utility functions
  - Framework: Vitest + React Testing Library (already configured)

### Code Quality

- [ ] **Delete unused legacy data file**
  - `lib/data/properties.ts` (6 legacy items) — verify no imports, then delete

---

## Implementation Order (Recommended)

```
Phase 1 — Auth & Core
  1. Auth API (login/signup/reset/OAuth)          → gates everything
  2. API client wiring                             → shared by all stores
  3. Agent dashboard data fetch + KYC submit       → most-used role

Phase 2 — Agent Features
  4. Property CRUD + edit flow                     → core agent feature
  5. Transactions + wallet + payments              → monetization
  6. Messages + file uploads + WebSocket           → communication
  7. Calendar + availability                       → scheduling
  8. Documents + PDF generation                    → agreements
  9. Settings APIs                                 → account management

Phase 3 — Dark Mode & i18n
  10. Dark mode sweep (~70% of components)         → apply dark: variants systematically
  11. i18n expansion to remaining components       → wire t() throughout app

Phase 4 — Other Roles
  12. Admin dashboard APIs                         → platform management
  13. Developer dashboard APIs + edit flow         → project management
  14. Seeker + Diaspora APIs                       → buyer/investor flows
  15. Landlord dashboard polish                    → newest role

Phase 5 — Polish
  16. Real pagination for all list pages           → all roles
  17. File uploads (avatar, property media)        → media management
  18. Notification backend + WebSocket             → engagement
  19. SEO + accessibility                          → production readiness
  20. Expand test coverage                         → quality assurance
```
