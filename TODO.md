# TODO.md — i-Realty Frontend Implementation Roadmap

> Prioritized list of work needed to take the frontend from demo to production.
> Items are grouped by priority and category.

---

## P0 — Critical (Must fix before any production use)

### Auth & Security

- [ ] **Add Next.js middleware for route protection**
  - Create `src/middleware.ts` to redirect unauthenticated users from `/dashboard/*` to `/auth/login`
  - Check for auth token in cookies or headers
  - Files: new `src/middleware.ts`

- [ ] **Persist auth state across page refreshes**
  - Add Zustand `persist` middleware to `useAuthStore` (use `localStorage` or `cookie`)
  - On app load, check for stored token and hydrate user state
  - Files: `lib/store/useAuthStore.ts`

- [ ] **Add error boundaries**
  - Create `error.tsx` for each major route segment (`/listings`, `/dashboard/agent`)
  - Wrap dashboard pages with error boundary that shows retry UI
  - Files: new `app/listings/error.tsx`, `app/dashboard/agent/error.tsx`

### Data Integrity

- [ ] **Add numeric price field to Property type**
  - Add `priceValue: number` to `Property` and `PropertyWithCoords` types
  - Update all data files to include numeric prices
  - Replace `parseInt(price.replace(...))` parsing with direct `priceValue` access
  - Files: `lib/types.ts`, `lib/data/*.ts`, `lib/store/useListingsStore.ts`, `components/listings/FilterSidebar.tsx`

---

## P1 — High Priority (Backend integration)

### API Connection Layer

- [ ] **Create API client utility**
  - Build `lib/api/client.ts` with base fetch wrapper (auth headers, error handling, base URL)
  - Support for GET, POST, PATCH, DELETE with typed responses
  - Handle 401 → redirect to login, 500 → error state
  - Files: new `lib/api/client.ts`

- [ ] **Replace mock functions in all stores with real API calls**
  - Follow the pattern in `CLAUDE.md` → "Backend Integration Guide"
  - Priority order:
    1. `useAuthStore` — login/logout (gates everything else)
    2. `useAgentDashboardStore` — dashboard data fetch + KYC submit
    3. `useAgentPropertiesStore` — property CRUD
    4. `useWalletStore` — ledger + withdrawal
    5. `useMessagesStore` — threads + send
    6. `useCalendarStore` — events + availability
    7. `useDocumentsStore` — list + create
    8. `useSettingsStore` — all settings endpoints
    9. `useFavouritesStore` — already has fetch structure, just needs real URL
    10. `useListingsStore` / `useDeveloperListingsStore` — server-side search + pagination

### Authentication

- [ ] **Implement Google OAuth flow**
  - Replace `alert("Coming Soon")` with actual redirect to Google OAuth
  - Handle callback, exchange code for token, update auth store
  - Files: `app/auth/login/page.tsx`, possibly new `app/api/auth/google/route.ts`

- [ ] **Implement email verification flow**
  - Connect OTP input to real verification API
  - Handle resend, expiry, error states
  - Files: `app/auth/signup/verify/page.tsx`

- [ ] **Implement password reset flow**
  - Connect reset pages to real API endpoints
  - Handle OTP send, verify, and new password submission
  - Files: `app/auth/reset/*/page.tsx`

---

## P2 — High Priority (Feature completion)

### Dashboard Features

- [ ] **Implement property edit flow**
  - Currently only create and delete exist. Edit button has comment: `/* Wait for edit flow implementation */`
  - Reuse `CreatePropertyModal` with pre-populated data, or build dedicated edit modal
  - Files: `app/dashboard/agent/properties/page.tsx`, `lib/store/useAgentPropertiesStore.ts`

- [ ] **Wire up file upload in messages**
  - Upload modals (`UploadMediaModal`, `UploadDocumentModal`) are commented out in ChatWindow
  - Connect to file upload API, update message with file payload
  - Files: `components/dashboard/agent/messages/ChatWindow.tsx`, `lib/store/useMessagesStore.ts`

- [ ] **Implement real-time messaging (WebSocket)**
  - Currently polling/mock only. Add WebSocket connection for live messages
  - Handle typing indicators, online status, message delivery receipts
  - Files: `lib/store/useMessagesStore.ts`, new `lib/ws/messageSocket.ts`

- [ ] **Implement document view/edit/delete actions**
  - All three action buttons in DocumentsList are non-functional
  - View: open PDF preview or download
  - Edit: re-open wizard with existing data
  - Delete: confirm and remove
  - Files: `components/dashboard/agent/documents/DocumentsList.tsx`, `lib/store/useDocumentsStore.ts`

- [ ] **Implement avatar upload in settings**
  - Upload button UI exists but does nothing
  - Connect to image upload API, update profile avatar URL
  - Files: `components/dashboard/agent/settings/forms/ProfileSettings.tsx`

- [ ] **Implement real pagination**
  - All pagination controls are static mockups ("Page 1 of 30")
  - Connect to API pagination params (page, limit, total)
  - Affected pages: Properties, Documents, Wallet transactions, Listings

### Wallet & Payments

- [ ] **Connect deposit flow to payment gateway**
  - `FundDepositModal` exists but no payment integration
  - Integrate Paystack (Nigeria) or Stripe for card payments
  - Files: `components/dashboard/agent/wallet/FundDepositModal.tsx`

- [ ] **Connect withdrawal flow to real API**
  - Replace `processWithdrawalMock()` with real endpoint
  - Handle processing states, failure, and success
  - Files: `lib/store/useWalletStore.ts`

---

## P3 — Medium Priority (Polish & UX)

### Store Cleanup

- [ ] **Merge duplicate listing stores**
  - `useListingsStore` and `useDeveloperListingsStore` are near-clones
  - Create a parameterized factory or single store with a `source` discriminator
  - Files: `lib/store/useListingsStore.ts`, `lib/store/useDeveloperListingsStore.ts`

### SEO & Metadata

- [ ] **Add generateMetadata to all pages**
  - Currently only root layout and detail pages have metadata
  - Add to: `/listings`, `/agents/[id]`, `/auth/*`, `/dashboard/*`
  - Files: all `page.tsx` and `layout.tsx` files missing metadata

- [ ] **Add robots.txt**
  - Create `public/robots.txt` with appropriate crawl rules
  - Block `/dashboard/*`, `/auth/*` from crawling
  - Files: new `public/robots.txt`

- [ ] **Add Open Graph images**
  - Property detail pages should have OG images for social sharing
  - Files: `app/listings/[id]/layout.tsx`

### Accessibility

- [ ] **Add ARIA labels to interactive elements**
  - Buttons, modals, form inputs need proper ARIA attributes
  - Modals should use `role="dialog"` and `aria-modal="true"`
  - Focus trap in modals

- [ ] **Add keyboard navigation**
  - Escape key to close modals (some modals missing this)
  - Tab order through form elements
  - Enter key to submit forms

- [ ] **Add alt text to all images**
  - Some `next/image` components have generic or missing alt text
  - Property images should use property title as alt

### Performance

- [ ] **Lazy load heavy components**
  - Use `dynamic(() => import(...), { ssr: false })` for:
    - MapMarkers (~475 lines, Mapbox GL ~200KB)
    - RevenueCharts (Recharts ~100KB)
  - Files: wherever these components are imported

- [ ] **Add loading skeletons to dashboard pages**
  - Some pages show blank during data fetch
  - Add skeleton loaders matching component shapes
  - Priority: Properties grid, Transaction table, Chat threads

### Form Validation

- [ ] **Add comprehensive form validation to all settings forms**
  - Currently minimal validation (some forms have none)
  - Use Zod schemas for consistent validation
  - Show inline field errors
  - Files: all `components/dashboard/agent/settings/forms/*.tsx`

- [ ] **Add validation to Create Property wizard**
  - Step transitions should validate required fields
  - Show clear error messages per field
  - Files: `components/dashboard/agent/property-create/*.tsx`

---

## P4 — Low Priority (Nice to have)

### Features

- [ ] **Add notification system**
  - Notification bell in TopNavBar is non-functional
  - Add notification dropdown with real-time updates
  - Types: new message, tour booking, KYC update, payment received
  - Files: `components/dashboard/agent/TopNavBar.tsx`, new notification store

- [ ] **Add dark mode support**
  - Tailwind v4 supports dark mode
  - Add toggle in settings or follow system preference
  - Audit all color classes for dark variants

- [ ] **Add property comparison feature**
  - Allow users to select and compare 2-3 properties side by side
  - New page or modal with comparison table

- [ ] **Add saved searches**
  - Save filter configurations on listings page
  - Notify when new properties match saved search

### Code Quality

- [ ] **Set up test infrastructure**
  - Add Vitest + React Testing Library
  - Priority test targets: Zustand stores, validation utils, form components
  - Files: new `vitest.config.ts`, `__tests__/` directories

- [ ] **Clean up build artifacts**
  - Delete `.txt` log/debug files from project root
  - Add them to `.gitignore` if not already
  - Files to delete: `build_check.txt`, `build_error_log.txt`, `build_error_utf8.txt`, `build_full.txt`, `build_output.txt`, `diff_src.txt`, `diff_stat.txt`, `figma_dashboard.txt`, `figma_texts.txt`, `figma_tree.txt`, `git_*.txt`, `import_check.txt`, `lint_report.txt`, `lint_results.*`, `parsed_lint*.txt`, `reflog.txt`, `status.txt`, `src_changes.txt`

- [ ] **Delete unused data file**
  - `lib/data/properties.ts` (6 legacy items) appears unused
  - Verify no imports, then delete
  - Files: `lib/data/properties.ts`

- [ ] **Add TypeScript strict checks**
  - Audit and remove all `any` types (currently warned, not errored)
  - Replace with proper types or `unknown`
  - Priority: `useMessagesStore.ts` (`files: any[]`)

---

## Implementation Order (Recommended)

If building the backend and connecting it, this is the recommended sequence:

```
1. Auth middleware + persist       (gates everything)
2. Auth API (login/signup/reset)   (enables real sessions)
3. API client utility              (shared by all stores)
4. Dashboard data fetch            (most-used page)
5. Property CRUD                   (core agent feature)
6. Listings API + pagination       (public-facing)
7. Messages + WebSocket            (communication)
8. Wallet + payments               (monetization)
9. Calendar + availability         (scheduling)
10. Documents + PDF generation     (agreements)
11. Settings APIs                  (account management)
12. KYC verification               (compliance)
13. File uploads                   (media management)
14. Notifications                  (engagement)
```
