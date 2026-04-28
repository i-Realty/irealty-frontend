# i-Realty Frontend — Remaining Implementation Tasks
> Generated: 2026-04-28 | Covers: src/app/, src/lib/store/, src/components/
> Priority: P0 = blocking/critical · P1 = high · P2 = medium · P3 = low/polish

---

## 1. Remaining API Wiring

### 1.1 Deprecated `*Mock` alias call-sites in page components
All aliases delegate to clean methods and are functionally correct, but should be updated when the API goes live.

- [ ] [P2] `src/app/dashboard/agent/page.tsx` — calls `fetchTransactionsMock` (→ `fetchTransactions`)
- [ ] [P2] `src/app/dashboard/agent/transactions/page.tsx` — calls `fetchTransactionsMock`
- [ ] [P2] `src/app/dashboard/agent/wallet/page.tsx` — calls `fetchLedgerMock` (→ `fetchLedger`)
- [ ] [P2] `src/app/dashboard/agent/calendar/page.tsx` — calls `fetchEventsMock` (→ `fetchEvents`)
- [ ] [P2] `src/app/dashboard/agent/documents/page.tsx` — calls `fetchDocumentsListMock` (→ `fetchDocumentsList`)
- [ ] [P2] `src/app/dashboard/agent/messages/page.tsx` — calls `fetchThreadsMock` (→ `fetchThreads`)
- [ ] [P2] `src/app/dashboard/developer/page.tsx` — calls `fetchDashboardDataMock`
- [ ] [P2] `src/app/dashboard/developer/calendar/page.tsx` — calls `fetchEventsMock`
- [ ] [P2] `src/app/dashboard/developer/documents/page.tsx` — calls `fetchDocumentsListMock`
- [ ] [P2] `src/app/dashboard/developer/messages/page.tsx` — calls `fetchThreadsMock`
- [ ] [P2] `src/app/dashboard/developer/transactions/page.tsx` — calls `fetchTransactionsMock`
- [ ] [P2] `src/app/dashboard/developer/wallet/page.tsx` — calls `fetchLedgerMock`
- [ ] [P2] `src/app/dashboard/diaspora/page.tsx` — calls `fetchDashboardDataMock`
- [ ] [P2] `src/app/dashboard/diaspora/messages/page.tsx` — calls `fetchThreadsMock`
- [ ] [P2] `src/app/dashboard/diaspora/my-properties/page.tsx` — calls `fetchPropertiesMock`
- [ ] [P2] `src/app/dashboard/diaspora/transactions/page.tsx` + `[id]/page.tsx` — calls `fetchDashboardDataMock`
- [ ] [P2] `src/app/dashboard/diaspora/wallet/page.tsx` — calls `fetchLedgerMock`
- [ ] [P2] `src/app/dashboard/landlord/page.tsx` — calls `fetchDashboardDataMock`, `fetchTransactionsMock`
- [ ] [P2] `src/app/dashboard/landlord/documents/page.tsx` — calls `fetchDocumentsListMock`
- [ ] [P2] `src/app/dashboard/landlord/messages/page.tsx` — calls `fetchThreadsMock`
- [ ] [P2] `src/app/dashboard/landlord/properties/page.tsx` — calls `fetchPropertiesMock`
- [ ] [P2] `src/app/dashboard/landlord/transactions/page.tsx` — calls `fetchTransactionsMock`
- [ ] [P2] `src/app/dashboard/landlord/wallet/page.tsx` — calls `fetchLedgerMock`
- [ ] [P2] `src/app/dashboard/seeker/my-properties/page.tsx` — calls `fetchPropertiesMock`
- [ ] [P2] `src/app/dashboard/seeker/messages/page.tsx` — calls `fetchThreadsMock`
- [ ] [P2] `src/app/dashboard/seeker/transactions/page.tsx` — calls `fetchTransactionsMock`
- [ ] [P2] `src/app/dashboard/seeker/wallet/page.tsx` — calls `fetchLedgerMock`
- [ ] [P2] `src/app/dashboard/admin/page.tsx` — calls `fetchDashboardDataMock`
- [ ] [P2] `src/app/dashboard/admin/finance/page.tsx` — calls `fetchFinanceMock`, `fetchDashboardDataMock`
- [ ] [P2] `src/app/dashboard/admin/messages/page.tsx` — calls `fetchThreadsMock`
- [ ] [P2] `src/app/dashboard/admin/properties/page.tsx` — calls `fetchPropertiesMock`, `approvePropertyMock`, `rejectPropertyMock`, `flagPropertyMock`
- [ ] [P2] `src/app/dashboard/admin/transactions/page.tsx` — calls `fetchTransactionsMock`, `flagTransactionMock`, `refundTransactionMock`

### 1.2 Stores with no `USE_API` gate (pure local state only)

- [ ] [P1] `useComparisonStore` — local Set only; needs `GET /api/seeker/compare`
- [ ] [P1] `useFavouritesStore` — `hydrate()` defined but never called; needs `GET /api/seeker/favourites` on mount
- [ ] [P1] `useSavedSearchesStore` — reads/writes localStorage directly; needs `GET /POST /DELETE /api/seeker/saved-searches`
- [ ] [P1] `useNotificationStore` — all-local; needs `GET /api/notifications`, `PATCH /api/notifications/:id/read`, server push
- [ ] [P1] `usePropertyStore` — `submitProperty` has no API gate; needs `POST /api/properties`, `PATCH /api/properties/:id`
- [ ] [P2] `useSignupStore` — no API call; signup form has `// TODO: Replace with real API call` — needs `POST /api/auth/register`
- [ ] [P2] `useMapStore` — property loading from static data file; needs `GET /api/listings?bbox=...` when API is live
- [ ] [P2] `useTransactionLedger` — local persist only; needs `GET /api/ledger` to hydrate on session start

### 1.3 Components with `setTimeout` no-ops that need real API wiring

- [ ] [P0] `src/app/auth/login/page.tsx:74` — mock credential check `setTimeout`; needs `POST /api/auth/login`
- [ ] [P0] `src/app/auth/signup/account/page.tsx` — no API call; needs `POST /api/auth/register`
- [ ] [P0] `src/app/auth/signup/verify/page.tsx:48` — OTP verification no-op; needs `POST /api/auth/verify-otp`
- [ ] [P0] `src/app/auth/signup/verify/page.tsx:31` — resend OTP `// TODO`; needs `POST /api/auth/resend-otp`
- [ ] [P0] `src/app/auth/reset/page.tsx:32` — password-reset request no-op; needs `POST /api/auth/reset-password`
- [ ] [P0] `src/app/auth/reset/verify/page.tsx:40` — OTP verify for reset no-op; needs `POST /api/auth/verify-reset-otp`
- [ ] [P0] `src/app/auth/reset/verify/page.tsx:30` — resend reset OTP `// TODO`; needs `POST /api/auth/resend-reset-otp`
- [ ] [P0] `src/app/auth/reset/new-password/page.tsx:38` — new password set no-op; needs `POST /api/auth/set-new-password`
- [ ] [P1] `src/app/dashboard/seeker/my-properties/page.tsx:82` — `PayRentModal.handlePay` is a no-op; needs `POST /api/seeker/pay-rent`
- [ ] [P1] `src/app/dashboard/diaspora/my-properties/page.tsx:81` — same pattern; needs `POST /api/diaspora/pay-rent`
- [ ] [P1] `src/app/dashboard/diaspora/service-catalog/page.tsx:91` — consultation booking no-op; needs `POST /api/diaspora/consultation`
- [ ] [P1] `src/app/dashboard/landlord/properties/page.tsx:24,80` — maintenance request no-op; needs `POST /api/landlord/maintenance`
- [ ] [P1] `src/app/dashboard/landlord/transactions/[id]/page.tsx:99` — dispute no-op; needs `POST /api/transactions/:id/dispute`
- [ ] [P1] `src/app/dashboard/agent/transactions/[id]/page.tsx:153` — dispute no-op; needs `POST /api/transactions/:id/dispute`
- [ ] [P1] `src/app/dashboard/developer/transactions/[id]/page.tsx:30` — dispute no-op; needs `POST /api/transactions/:id/dispute`
- [ ] [P1] `src/app/dashboard/seeker/transactions/[id]/page.tsx:117` — report no-op; needs `POST /api/transactions/:id/dispute`
- [ ] [P1] `src/components/dashboard/admin/messages/BroadcastModal.tsx:48` — broadcast send no-op; needs `POST /api/admin/broadcast`
- [ ] [P2] `src/components/dashboard/agent/settings/forms/SubscriptionSettings.tsx:12` — subscription plan change no-op; needs `POST /api/settings/subscription`
- [ ] [P2] `src/components/dashboard/diaspora/InvoiceDetailModal.tsx:31` — invoice payment no-op; needs `POST /api/diaspora/invoices/:id/pay`

---

## 2. Missing or Placeholder Page Implementations

- [ ] [P0] `src/app/auth/login/page.tsx` — Google SSO button is `disabled` ("Google sign-in is coming soon"); implement OAuth or remove
- [ ] [P0] `src/app/auth/signup/account/page.tsx` — Google SSO button same as above
- [ ] [P1] `src/app/contact/page.tsx` — form has hardcoded "coming soon" note; `onSubmit` is `e.preventDefault()` only; needs `POST /api/contact`
- [ ] [P1] `src/app/listings/[id]/book-tour/page.tsx` — no RSC id resolution; works as modal-wrapper but needs proper data fetch once API is live
- [ ] [P1] `src/app/listings/[id]/book-tour/payment/page.tsx` — Paystack path is a no-op
- [ ] [P1] `src/app/listings/[id]/virtual-tour/page.tsx` — uses hard-coded `MOCK_SCENES`; needs `GET /api/listings/:id/virtual-tour`
- [ ] [P1] `src/app/listings/developers/[id]/book-tour/page.tsx` — same issues as standard book-tour
- [ ] [P1] `src/app/listings/developers/[id]/book-tour/payment/page.tsx` — Paystack no-op
- [ ] [P2] `src/app/dashboard/developer/projects/[id]/page.tsx` — uses `MOCK_PROJECT`, `MOCK_DOCUMENTS`, `MOCK_LANDMARKS` hard-coded constants instead of real project fetch
- [ ] [P2] `src/app/agents/[id]/page.tsx` — uses `sampleAgents` hard-coded array; needs `GET /api/agents/:id`

---

## 3. Incomplete Features by Dashboard

### Seeker Dashboard
- [ ] [P0] `src/app/dashboard/seeker/my-properties/page.tsx` — `PayRentModal.handlePay` is a `setTimeout` no-op; no actual payment flow
- [ ] [P1] `src/app/dashboard/seeker/favorites/page.tsx` — `useFavouritesStore.hydrate()` never called; needs `GET /api/seeker/favourites` on mount
- [ ] [P1] `src/app/dashboard/seeker/calendar/page.tsx` — reads only from `useTourBookingStore` (localStorage); needs `GET /api/seeker/bookings` to hydrate
- [ ] [P1] `src/app/dashboard/seeker/search/page.tsx` — uses static `standardProperties` data file; needs `GET /api/listings` with filter params
- [ ] [P2] `src/app/dashboard/seeker/transactions/[id]/page.tsx` — Report button is a `setTimeout` no-op
- [ ] [P2] `src/app/dashboard/seeker/my-properties/page.tsx` — "View Details" calls `router.push('/listings')` (generic); should be `router.push('/listings/${p.propertyId}')`

### Diaspora Dashboard
- [ ] [P0] `src/app/dashboard/diaspora/service-catalog/page.tsx` — consultation booking is a `setTimeout` no-op
- [ ] [P1] `src/components/dashboard/diaspora/InvoiceDetailModal.tsx` — "Pay Invoice" button is a no-op; no payment flow implemented
- [ ] [P1] `src/app/dashboard/diaspora/my-properties/page.tsx` — uses `useSeekerPropertiesStore` (shared with Seeker); diaspora should have own endpoint `GET /api/diaspora/properties`
- [ ] [P1] `src/app/dashboard/diaspora/wallet/page.tsx` — no FX conversion; diaspora needs live FX rate fetch and multi-currency display
- [ ] [P2] `src/components/dashboard/diaspora/settings/DiasporaFXSettings.tsx` — FX provider options are hard-coded; needs `GET /api/fx/rates`

### Agent Dashboard
- [ ] [P0] `src/components/dashboard/agent/property-create/Step3MediaUpload.tsx` — `handleMockUpload()` pushes hard-coded Unsplash URLs; no real file input or upload call; needs `POST /api/upload`
- [ ] [P1] `src/components/dashboard/agent/settings/forms/SubscriptionSettings.tsx` — subscription confirm shows "Payment processing integration coming soon"
- [ ] [P1] `src/app/dashboard/agent/calendar/page.tsx` — availability slots saved to localStorage only; needs `GET /api/agent/calendar` to hydrate real bookings
- [ ] [P1] `src/app/dashboard/agent/transactions/[id]/page.tsx` — "Dispute" button is a `setTimeout` no-op

### Landlord Dashboard
- [ ] [P0] `src/app/dashboard/landlord/properties/page.tsx` — maintenance modals are `setTimeout` no-ops; needs `POST /api/landlord/properties/:id/maintenance`
- [ ] [P1] No `/dashboard/landlord/calendar` route — tenant inspection scheduling is unimplemented
- [ ] [P1] `src/app/dashboard/landlord/transactions/[id]/page.tsx` — "Dispute" button is a `setTimeout` no-op
- [ ] [P2] No "Add Property" wizard for Landlord role (only Agent has the full property create wizard)

### Developer Dashboard
- [ ] [P0] `src/components/dashboard/developer/projects/Step4MediaUpload.tsx` — `handleUploadClick()` cycles through placeholder images; needs real file upload; needs `POST /api/upload`
- [ ] [P1] `src/app/dashboard/developer/projects/[id]/page.tsx` — uses `MOCK_PROJECT`, `MOCK_DOCUMENTS`, `MOCK_LANDMARKS` even when store has the project; needs `GET /api/developer/projects/:id`
- [ ] [P2] Milestone payment flow — no UI for developer to confirm receipt and trigger escrow release after buyer pays a milestone; only admin can release via finance page

### Admin Dashboard
- [ ] [P1] `src/app/dashboard/admin/users/[id]/page.tsx` — no "Delete user" action; admin can only suspend
- [ ] [P2] `src/lib/store/useAdminMessagesStore.ts` — `sendReply` has no `USE_API` branch; never posts reply to server even when `USE_API=true`; needs `if (USE_API) await apiPost('/api/admin/support-tickets/:threadId/reply', ...)`
- [ ] [P2] No dedicated `/dashboard/admin/reports` page for revenue and growth exports

---

## 4. Real-time / WebSocket Gaps

**All messaging and notification systems use localStorage + Zustand only. No WebSocket, SSE, or polling exists anywhere in the codebase.**

- [ ] [P0] `src/lib/store/useMessagesStore.ts` — messages are persisted to localStorage only; recipient in a real session never receives messages; needs WebSocket/SSE for all 6 dashboard inboxes
- [ ] [P0] `src/lib/store/useAdminMessagesStore.ts` — same; admin support ticket replies have no real-time delivery
- [ ] [P0] `src/lib/store/useNotificationStore.ts` — notifications emitted locally only; the other party never receives them in their session; needs `GET /api/notifications` on session start + WebSocket/SSE push
- [ ] [P1] `src/app/dashboard/agent/calendar/page.tsx` — new tour bookings from seekers never reach agent in real time; needs WebSocket event
- [ ] [P1] `src/app/dashboard/seeker/calendar/page.tsx` — tour status updates (confirmed/cancelled) never reach seeker in real time
- [ ] [P1] `src/components/dashboard/admin/messages/BroadcastModal.tsx` — admin broadcast is a no-op; needs `POST /api/admin/broadcast` + server push to all connected clients
- [ ] [P2] Transaction/escrow/milestone status changes — affect the other party's session only on refresh
- [ ] [P2] `src/components/ChatModal.tsx` — "Call" button fires no-op; needs WebRTC or a calling API

---

## 5. File Upload Gaps

Every file upload zone simulates uploading by pushing a placeholder URL or reading a local `File` object without sending it to any server.

- [ ] [P0] `src/components/dashboard/agent/property-create/Step3MediaUpload.tsx` — pushes hard-coded Unsplash URLs; no `<input type="file">`, no FormData, no upload call; needs `POST /api/upload`
- [ ] [P0] `src/components/dashboard/developer/projects/Step4MediaUpload.tsx` — cycles through placeholder images; needs `POST /api/upload`
- [ ] [P0] `src/components/dashboard/kyc/StepIDVerification.tsx` — reads `file.name` only; file never sent to server; needs `POST /api/kyc/upload-id` with FormData
- [ ] [P0] `src/components/dashboard/kyc/StepIDVerificationDeveloper.tsx` — same as above
- [ ] [P0] `src/components/dashboard/kyc/StepFaceMatch.tsx` — canvas `dataUrl` captured but never POSTed; needs `POST /api/kyc/selfie`
- [ ] [P1] `src/components/dashboard/agent/messages/modals/UploadMediaModal.tsx` — stages local blob URLs; server cannot access these; needs `POST /api/upload` before `sendMessage`
- [ ] [P1] `src/components/dashboard/agent/messages/modals/UploadDocumentModal.tsx` — same as UploadMediaModal
- [ ] [P1] `src/components/dashboard/admin/settings/AdminProfileSettings.tsx` — avatar upload button present but no file input or upload call
- [ ] [P2] `src/components/dashboard/agent/settings/forms/ProfileSettings.tsx` — avatar upload is UI-only; no upload call

---

## 6. Navigation / Routing Gaps

- [ ] [P1] `src/app/dashboard/seeker/my-properties/page.tsx` — "View Details" calls `router.push('/listings')` (generic); should be specific property URL
- [ ] [P1] `src/app/auth/login/page.tsx` — `// TODO: Replace with real API call` comment; entire login block is a no-op; `setLoading(false)` without actual login when `USE_API=true`
- [ ] [P1] `src/app/listings/[id]/book-tour/page.tsx` and `payment/page.tsx` — standalone routes rendered as modals with no parent context; consider converting to intercepting routes `(.)book-tour`
- [ ] [P2] No `/dashboard/landlord/calendar` route
- [ ] [P2] No `/dashboard/seeker/documents` route — seekers cannot manage lease agreements
- [ ] [P2] No `/agents` index listing page (individual `/agents/[id]` exists but no index)
- [ ] [P2] `src/app/suspended/page.tsx` exists but no redirect check in dashboard layouts for suspended users whose session expired

---

## 7. Auth / Auth-Guard Gaps

- [ ] [P0] `src/middleware.ts` — session cookie is written by `document.cookie` client-side and is not HttpOnly; can be spoofed; must be replaced with server-issued HttpOnly cookie from `/api/auth/login` response
- [ ] [P0] The middleware does not guard: `/listings/[id]/book-tour`, `/listings/[id]/book-tour/payment`, `/listings/[id]/profile` — these should require auth
- [ ] [P1] No KYC status gate on `/dashboard/agent/properties` — unverified agents can access the property create wizard
- [ ] [P1] `src/app/auth/reset/success/page.tsx` — duplicate implementation of "set new password" form; consolidate with `new-password/page.tsx`
- [ ] [P1] `src/app/auth/signup/verify/page.tsx` — OTP resend has `// TODO: replace with real API call`; countdown timer works but resend does nothing
- [ ] [P2] No token refresh flow — `apiClient.ts` handles 401 by redirecting but no `refreshToken` logic exists; long sessions silently break
- [ ] [P2] `useAuthStore` stores full `AuthUser` in `localStorage` with no expiry or integrity check; tampered `kycStatus: 'verified'` could bypass client-side KYC checks

---

## 8. Missing Mobile Responsiveness

- [ ] [P1] `src/components/dashboard/RevenueCharts.tsx` — Recharts charts have fixed heights; overflow on screens < 360px
- [ ] [P1] `src/components/dashboard/developer/DeveloperRevenueCharts.tsx` — same
- [ ] [P1] `src/components/listings/ComparisonModal.tsx` — horizontal scrollable table on mobile is nearly unusable; needs vertical stacked layout for small screens
- [ ] [P1] `src/components/listings/FilterSidebar.tsx` — dual-thumb price slider may be difficult to use on mobile touch targets
- [ ] [P2] `src/app/dashboard/admin/finance/page.tsx` — escrow and payouts tables have no mobile card fallback
- [ ] [P2] `src/app/dashboard/agent/transactions/page.tsx` — filter bar on < 640px; some dropdowns overlap
- [ ] [P2] `src/components/map/MapToolbar.tsx` — toolbar buttons dense; cut off on 375px screens
- [ ] [P3] `src/app/dashboard/developer/projects/[id]/page.tsx` — milestone table is desktop-only; no mobile card view

---

## 9. Forms Missing Client-Side Validation

- [ ] [P0] `src/app/contact/page.tsx` — no validation at all; email format, name min-length, message min-length all unchecked
- [ ] [P1] `src/app/dashboard/diaspora/service-catalog/page.tsx` — email format and phone not validated; no zod schema
- [ ] [P1] `src/app/dashboard/landlord/properties/page.tsx` — maintenance textarea has no minimum-length validation
- [ ] [P1] All dispute/report textareas (`agent`, `developer`, `landlord`, `seeker` transaction detail pages) — submit button enabled even with empty textarea
- [ ] [P2] `src/app/dashboard/admin/users/[id]/page.tsx` — KYC rejection reason has no minimum character count
- [ ] [P2] `src/app/dashboard/admin/properties/page.tsx` — rejection reason has only `!reason.trim()` check; no minimum length
- [ ] [P2] `src/components/dashboard/agent/wallet/modals/WithdrawModal.tsx` — amount should be validated ≤ wallet balance client-side before store call
- [ ] [P3] `src/components/dashboard/agent/settings/forms/PayoutSettings.tsx` — NUBAN bank account 10-digit validation exists but no API lookup for bank name verification

---

## 10. Payment Integration

- [ ] [P0] `src/components/PaymentOptionsModal.tsx` — Paystack button calls `payWithPaystack()` which shows "coming soon"; needs `POST /api/payments/paystack/initialize` → redirect to checkout URL
- [ ] [P0] `src/components/ReservePaymentModal.tsx` — identical Paystack no-op for property reservation
- [ ] [P0] `src/components/PaymentOptionsModal.tsx` — wallet payment navigates to success immediately without any API call or wallet debit; needs `POST /api/wallet/debit` or `useWalletStore.debit()`
- [ ] [P0] `src/components/ReservePaymentModal.tsx` — same wallet debit no-op
- [ ] [P1] `src/components/dashboard/agent/settings/forms/SubscriptionSettings.tsx` — subscription "Subscribe" modal shows "Payment processing integration coming soon"; needs Paystack/Flutterwave recurring billing
- [ ] [P1] `src/components/dashboard/agent/wallet/modals/FundDepositModal.tsx` — deposit modal shows static bank transfer reference; needs Paystack virtual account or bank transfer API
- [ ] [P1] `src/lib/store/useWalletStore.ts` — `processWithdrawal` has USE_API gate; but no webhook/polling to update transaction status from `Pending` to `Completed`
- [ ] [P2] `src/app/dashboard/diaspora/wallet/page.tsx` — no FX conversion panel; diaspora users need USD/GBP/EUR display with live exchange rates
- [ ] [P2] Tour booking payment — `createFromDraft` in `useTourBookingStore` creates a ledger entry but never calls `useWalletStore.debit()`; full payment loop incomplete
- [ ] [P2] Developer milestone payments — no real payment gateway integration; escrow credited locally only

---

## 11. Missing Error States

> Error boundary `error.tsx` files exist for all dashboard roots. However, individual page components almost never render the `error` state from stores — loading spinners stay forever on fetch failure.

- [ ] [P1] All 6 dashboard overview pages (`seeker`, `agent`, `landlord`, `developer`, `diaspora`, `admin`) — spinner has no `error` display branch; fetch failure = infinite spinner
- [ ] [P1] All transactions list pages across all dashboards — no error state rendered
- [ ] [P1] `src/app/dashboard/developer/projects/page.tsx` — no error state if `fetchProjects` fails
- [ ] [P1] `src/app/dashboard/agent/calendar/page.tsx` — no error state if `fetchEvents` fails
- [ ] [P1] `src/app/dashboard/agent/documents/page.tsx` — no error state if `fetchDocumentsList` fails
- [ ] [P1] All admin list pages (`users`, `properties`, `transactions`) — no error state
- [ ] [P2] `src/app/listings/[id]/page.tsx` — if property not found renders anonymous `<div>` with no styled message
- [ ] [P2] All message inbox pages — no error banner if `fetchThreads` fails; inbox appears empty with no explanation
- [ ] [P2] All wallet pages — if `fetchLedger` fails the transaction history stays blank with no error text

---

## 12. SEO / Metadata Gaps

- [ ] [P1] `src/app/page.tsx` (homepage) — only generic title/description; missing Open Graph images, Twitter cards, structured data (`application/ld+json` for `RealEstateAgent`, `WebSite`)
- [ ] [P1] `src/app/listings/[id]/layout.tsx` — `generateMetadata` uses placeholder, not actual property title/description/image; needs SSR fetch
- [ ] [P1] `src/app/listings/developers/[id]/layout.tsx` — same; developer project metadata is a placeholder
- [ ] [P2] `src/app/agents/[id]/page.tsx` — `generateMetadata` only handles IDs "1", "2", "3"; any other ID falls back to "Agent"
- [ ] [P2] `src/app/layout.tsx` — missing `manifest`, `themeColor`, `viewport` metadata for PWA support
- [ ] [P2] `src/app/sitemap.ts` — verify it covers all dynamic property and agent routes once real data is available
- [ ] [P3] `src/app/403/page.tsx`, `src/app/suspended/page.tsx` — no metadata exports; will appear in search results without titles
- [ ] [P3] `src/app/privacy/page.tsx`, `src/app/terms/page.tsx` — no `noindex` directive; legal pages should typically be noindex

---

## 13. Additional Gaps

### Auth Flow
- [ ] [P0] `src/app/auth/reset/success/page.tsx` — duplicate implementation of "set new password" form; consolidate with `new-password/page.tsx`
- [ ] [P1] `src/app/auth/signup/verify/page.tsx` — OTP resend countdown works but the resend call is `// TODO`

### Notifications
- [ ] [P1] `useNotificationStore` — never hydrated from server; notifications from previous sessions / other devices are never loaded; needs `GET /api/notifications` on session start

### Saved Searches
- [ ] [P1] `useSavedSearchesStore` — device-local, not synced to account; needs `GET/POST/DELETE /api/seeker/saved-searches`

### Document Generation
- [ ] [P1] `src/components/dashboard/agent/documents/wizard/Step3_ReviewCreate.tsx` — after `createDocument()` there is no PDF preview or download link; needs `GET /api/documents/:id/download` returning a PDF CDN URL

### Push Notifications
- [ ] [P2] `src/components/PushNotificationManager.tsx` — requests browser push permission but never POSTs subscription to server; needs `POST /api/notifications/subscribe`

### Dark Mode
- [ ] [P3] Several components in `src/components/dashboard/agent/property-create/` and `src/components/dashboard/kyc/` missing `dark:` Tailwind variants

### i18n
- [ ] [P3] `src/lib/i18n/translations/fr.ts` — French translations may have gaps; audit for completeness before enabling locale switcher

---

## Summary

| Priority | Count |
|----------|-------|
| P0 — Blocking / Critical | 21 |
| P1 — High | 65 |
| P2 — Medium | 52 |
| P3 — Low / Polish | 8 |
| **Total** | **146** |

---

## Key Architectural Observations

1. **The entire real-time layer is missing.** Every message inbox, notification, and status update is local-only. A WebSocket/SSE layer is the single largest gap separating the current UI from a shippable product.

2. **File uploads are universally simulated.** No actual bytes are sent to any server from any upload zone (KYC ID, selfie, property photos, project media, message attachments). A single shared `POST /api/upload` endpoint returning a CDN URL would fix ~9 places simultaneously.

3. **Payment gateway wiring is absent.** Both Paystack flows (tour inspection fee and property reservation) show "coming soon". The wallet-debit path works locally but is never confirmed server-side.

4. **Auth is client-controlled.** The session cookie is written by `document.cookie` on the frontend. Until login is replaced with a server-issued HttpOnly cookie, any security review will fail.

5. **Deprecated `*Mock` aliases are widespread but functionally correct.** They all delegate to clean methods, so they work today and will continue to work after the API is connected. They are cleanup items, not blockers.
