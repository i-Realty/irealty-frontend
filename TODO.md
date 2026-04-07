# TODO.md — i-Realty Frontend

> Comprehensive audit-based roadmap. Each item reflects the **actual current state** of the codebase as of 2026-04-06.
> Items are grouped by priority, then by area.

---

## Current State Summary

| Area | Completion | Notes |
|------|-----------|-------|
| **Public pages** (landing, listings, detail, profiles) | 95% | Production-ready with mock data |
| **Agent dashboard** | 90% | Most complete role; edit property flow missing |
| **Admin dashboard** | 90% | All pages implemented with full UI |
| **Developer dashboard** | 85% | Projects wizard complete; some pages reuse agent components |
| **Seeker dashboard** | 85% | All pages implemented; reuses some agent components |
| **Diaspora dashboard** | 85% | All pages implemented including service catalog |
| **Landlord dashboard** | 0% | Nav config exists but no pages or components yet |
| **Auth system** | 90% | Login/signup/reset flows work; Google OAuth is stub |
| **Backend integration** | 5% | API client exists; all stores use mock functions |

---

## P0 — Critical (Must fix before any production use)

### Backend Integration

- [ ] **Replace all mock store functions with real API calls**
  - API client utility already exists at `lib/api/client.ts` with GET/POST/PATCH/PUT/DELETE helpers, 401 redirect, and error handling
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

### Auth & Security

- [ ] **Implement Google OAuth flow**
  - Login page: `alert("Google OAuth Coming Soon")` at `src/app/auth/login/page.tsx:119`
  - Signup page: `alert("Google OAuth Coming Soon")` at `src/app/auth/signup/account/page.tsx:181`
  - Replace with real OAuth redirect (Firebase Auth, Auth0, or direct Google OAuth)
  - Handle callback, exchange code for token, update auth store

- [ ] **Wire up email/OTP verification to real backend**
  - Signup verify: `src/app/auth/signup/verify/page.tsx` — mock OTP always succeeds
  - Reset verify: `src/app/auth/reset/verify/page.tsx` — mock resend is `alert("Code resent!")`
  - Connect to real OTP send/verify API

- [ ] **Add error handling to all data-fetching pages**
  - Mock functions never fail — no error UI is ever shown
  - Add `.catch()` handlers to all store actions
  - Show inline error states with retry buttons
  - Error boundaries exist for listings/detail pages but not for dashboard pages

### Data Integrity

- [ ] **Add numeric price field to Property type**
  - `Property.price` is a formatted string (e.g., `'₦ 20,000,000'`)
  - Filtering requires fragile `parseInt(price.replace(...))` parsing
  - Add `priceValue: number` to `Property` and `PropertyWithCoords` types
  - Update all data files (`lib/data/*.ts`) and filter logic
  - Files: `lib/types.ts`, `lib/data/standardProperties.ts`, `lib/data/developerProperties.ts`, `lib/store/useListingsStore.ts`, `components/listings/FilterSidebar.tsx`

---

## P1 — High Priority (Feature gaps in existing pages)

### Agent Dashboard

- [ ] **Implement property edit flow**
  - Comment at `src/app/dashboard/agent/properties/page.tsx:129`: `onEdit={() => { /* Wait for edit flow implementation */ }}`
  - Reuse `CreatePropertyModal` with pre-populated data, or build a dedicated edit variant
  - Need `updateProperty()` store action in `useAgentPropertiesStore`
  - Files: `app/dashboard/agent/properties/page.tsx`, `lib/store/useAgentPropertiesStore.ts`, `components/dashboard/agent/property-create/`

- [ ] **Wire up file uploads in messages**
  - `UploadMediaModal` and `UploadDocumentModal` exist in `components/dashboard/agent/messages/modals/`
  - They render but do not actually upload files — `stagedFiles` is `any[]` in `useMessagesStore`
  - Connect to file upload API, update message with file payload

- [ ] **Implement "Add to Calendar" in booking confirmation**
  - TODO comment at `components/BookingConfirmationModal.tsx:47`: `/* TODO: add to calendar logic */`
  - TODO comment at `components/ReserveConfirmationModal.tsx:43`: `/* TODO: add calendar logic */`
  - Generate `.ics` file or integrate with Google Calendar API

- [ ] **Complete property detail tabs (Amenities, Documents, Landmarks)**
  - Agent property detail page (`/dashboard/agent/properties/[id]`) only shows Description tab
  - Amenities, Documents, and Landmarks tabs are present but empty/non-functional
  - Same issue on developer project detail page

### Developer Dashboard

- [ ] **Build developer-specific messaging**
  - Currently reuses agent messaging components (`InboxList`, `ChatWindow`, etc.)
  - Should have developer-specific thread context (project milestones, buyer conversations)
  - Files: `app/dashboard/developer/messages/page.tsx`

- [ ] **Build developer-specific documents page**
  - Currently reuses agent document components
  - Should support developer-specific templates (milestone agreements, project handover docs)

- [ ] **Complete project detail page tabs**
  - `/dashboard/developer/projects/[id]` only populates Description tab
  - Amenities, Documents, and Landmarks tabs are empty stubs
  - Virtual Tour and View On Map buttons are non-functional

- [ ] **Wire up project edit flow**
  - Project cards have Edit in their dropdown menu but no edit handler
  - Should pre-populate CreateProjectModal with existing project data

### Seeker Dashboard

- [ ] **Build seeker-specific messaging**
  - Currently reuses agent messaging components
  - Context panel should show property context from seeker's perspective (inquiries, tour bookings)

### Diaspora Dashboard

- [ ] **Build diaspora-specific messaging**
  - Currently reuses agent messaging components
  - Should support communication with care managers and service providers

### Admin Dashboard

- [ ] **Add rejection reason input for property/KYC moderation**
  - Admin can approve/reject properties and KYC but cannot provide a reason
  - Add a text input or modal for rejection reasoning
  - Affects: `app/dashboard/admin/properties/page.tsx`, `app/dashboard/admin/users/[id]/page.tsx`

- [ ] **Wire up transaction detail action buttons**
  - "Flag for Review" and "Initiate Refund" buttons on admin transaction detail page are UI-only
  - "Message" buttons on party cards don't open chat
  - File: `app/dashboard/admin/transactions/[id]/page.tsx`

### Landlord Dashboard

- [ ] **Build landlord dashboard pages and components**
  - Nav config exists in `src/config/nav.ts` (landlordNav with 6 items)
  - Route segments exist: `/dashboard/landlord/` but **no pages or layout are created**
  - Need: layout.tsx, page.tsx (overview), properties, messages, documents, wallet, transactions, settings
  - Need: `useLandlordDashboardStore` Zustand store
  - Should support: property listing, tenant management, rental income tracking

---

## P2 — Medium Priority (Polish & UX)

### Real-time Features

- [ ] **Implement WebSocket messaging**
  - All messaging is currently mock/polling only
  - Add WebSocket connection for live messages across all role dashboards
  - Handle typing indicators, online status, delivery receipts
  - Files: `lib/store/useMessagesStore.ts`, `lib/store/useAdminMessagesStore.ts`

- [ ] **Implement notification system**
  - Notification bell in `TopNavBar.tsx` has a red dot but is non-functional
  - Add notification dropdown with real-time updates
  - Types: new message, tour booking, KYC update, payment received, admin alerts
  - Need: `useNotificationStore`, `NotificationDropdown` component

### Pagination

- [ ] **Implement real pagination across all list pages**
  - All pagination controls are UI mockups ("Page 1 of 30") with static totals
  - Connect to API pagination params (page, limit, total, hasMore)
  - Affected pages: Agent properties, Admin users/properties/transactions, Developer projects/transactions, Seeker transactions/favorites/properties, Diaspora transactions, Documents, Wallet transactions

### File Uploads

- [ ] **Implement avatar upload in settings**
  - Upload button UI exists in all profile settings forms
  - Currently uses `URL.createObjectURL()` for local preview only
  - Connect to image upload API, persist avatar URL
  - Files: `components/dashboard/admin/settings/AdminProfileSettings.tsx`, `components/dashboard/agent/settings/forms/ProfileSettings.tsx`

- [ ] **Implement media upload in property/project creation**
  - Step 3 (Media Upload) in both property and project wizards uses placeholder images
  - `alert("Max 5 images allowed for demo.")` at `components/dashboard/agent/property-create/Step3MediaUpload.tsx:25`
  - Connect to real file upload API with progress tracking

### Payments

- [ ] **Connect deposit flow to payment gateway**
  - `FundDepositModal` exists but has no payment integration
  - Integrate Paystack (Nigeria) or Stripe for card payments
  - Files: `components/dashboard/agent/wallet/FundDepositModal.tsx`

- [ ] **Connect withdrawal flow to real API**
  - Replace `processWithdrawalMock()` with real endpoint
  - Handle processing states, failure, and success

### Store Cleanup

- [ ] **Merge duplicate listing stores**
  - `useListingsStore` and `useDeveloperListingsStore` are near-clones
  - Create a parameterized factory or single store with a `source` discriminator
  - Files: `lib/store/useListingsStore.ts`, `lib/store/useDeveloperListingsStore.ts`

- [ ] **Fix `any` types in stores**
  - `useMessagesStore.ts:83` — `stagedFiles: any[]` should be typed
  - `useCreatePropertyStore.ts:210` — `as any` cast on `rentPriceType`

---

## P3 — Low Priority (SEO, Accessibility, Performance)

### SEO & Metadata

- [ ] **Add `robots.txt`**
  - `public/robots.txt` does not exist
  - Block `/dashboard/*`, `/auth/*` from crawling
  - Allow `/listings`, `/agents`, landing page

- [ ] **Add `generateMetadata` to all pages**
  - Currently only root layout, listings layout, and detail pages have metadata
  - Add to: `/auth/*`, `/dashboard/*`, `/agents/[id]`

- [ ] **Add Open Graph images for property detail pages**
  - Property detail pages should have OG images for social sharing
  - Files: `app/listings/[id]/layout.tsx`, `app/listings/developers/[id]/layout.tsx`

### Accessibility

- [ ] **Add ARIA attributes to modals and interactive elements**
  - Modals should use `role="dialog"` and `aria-modal="true"`
  - Focus trap in modals (some modals lack this)
  - Escape key to close modals (some modals missing this)

- [ ] **Add keyboard navigation**
  - Tab order through form elements
  - Enter key to submit forms (some forms missing)
  - Arrow key navigation in dropdowns/selectors

### Performance

- [ ] **Lazy load heavy components**
  - Use `dynamic(() => import(...), { ssr: false })` for:
    - MapMarkers (~475 lines, Mapbox GL ~200KB)
    - RevenueCharts / DeveloperRevenueCharts (Recharts ~100KB)
    - Calendar grid component
  - Files: wherever these components are imported

- [ ] **Add loading skeletons to dashboard pages**
  - Some pages show spinner or blank during data fetch
  - Add skeleton loaders matching component shapes
  - Priority: Properties grid, Transaction table, Chat threads, Admin tables

### Form Validation

- [ ] **Add comprehensive validation to all settings forms**
  - Currently minimal validation (disabled buttons when empty)
  - Add inline field errors, email format checks, phone format checks
  - Consider Zod schemas for consistent validation
  - Files: all `components/dashboard/*/settings/` form components

- [ ] **Add step validation to Create Property/Project wizards**
  - Step transitions should validate required fields before proceeding
  - Show clear error messages per field

### Code Quality

- [ ] **Set up test infrastructure**
  - No test framework or test files exist
  - Add Vitest + React Testing Library
  - Priority targets: Zustand stores, validation utils, form components



- [ ] **Delete unused legacy data file**
  - `lib/data/properties.ts` (6 legacy items) appears unused
  - Verify no imports, then delete

---

## P4 — Nice to Have (Future features)

- [ ] **Dark mode support** — Tailwind v4 supports it; add toggle in settings
- [ ] **Property comparison** — Select and compare 2-3 properties side by side
- [ ] **Saved searches** — Save filter configurations, notify on new matches
- [ ] **Admin bulk actions** — Select multiple users/properties/transactions for batch operations
- [ ] **Admin audit trail export** — Download CSV of audit logs
- [ ] **Admin broadcast messaging** — Send announcements to user groups
- [ ] **Virtual tour integration** — Replace image carousel with real 3D/VR experience
- [ ] **Push notifications** — Service worker for browser push notifications
- [ ] **Offline support** — Service worker caching for listings/detail pages
- [ ] **i18n** — Add language support (English primary, Yoruba/Igbo/Hausa secondary)

---

## Implementation Order (Recommended)

For building the backend and connecting it to the frontend:

```
Phase 1 — Auth & Core
  1. Auth API (login/signup/reset/OAuth)        → gates everything
  2. API client wiring                           → shared by all stores
  3. Agent dashboard data fetch + KYC submit     → most-used role

Phase 2 — Agent Features
  4. Property CRUD + edit flow                   → core agent feature
  5. Transactions + wallet + payments            → monetization
  6. Messages + WebSocket                        → communication
  7. Calendar + availability                     → scheduling
  8. Documents + PDF generation                  → agreements
  9. Settings APIs                               → account management

Phase 3 — Other Roles
  10. Admin dashboard APIs                       → platform management
  11. Developer dashboard APIs                   → project management
  12. Seeker + Diaspora APIs                     → buyer/investor flows
  13. Landlord dashboard (build from scratch)    → new role

Phase 4 — Polish
  14. File uploads (avatar, property media)      → media management
  15. Real pagination                            → all list pages
  16. Notifications                              → engagement
  17. SEO + accessibility                        → production readiness
  18. Tests                                      → quality assurance
```
