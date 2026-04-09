# SEEKERTODO.md — Property Seeker Dashboard: Incomplete & Stub Inventory

> Tracks every unimplemented interaction, logic gap, and placeholder in the property seeker dashboard.
> **Last updated:** 2026-04-09

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ⬜ | Not started |
| ✅ | Implemented (frontend wiring complete) |
| 🔌 | Needs backend only (UI is ready) |
| 🎨 | Needs UI + backend |
| 🔧 | Logic/wiring only (no backend needed) |

---

## 1. Main Dashboard (`/dashboard/seeker`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 1.1 | **Dashboard and transaction data are mocked** | 🔌 | ⬜ | `fetchDashboardDataMock()` and `fetchTransactionsMock()` both use setTimeout on load. Hardcoded stats returned. |

---

## 2. Favorites (`/dashboard/seeker/favorites`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 2.1 | **Category filter tabs always return all properties** | 🔧 | ✅ | Fixed: `CATEGORY_KEYWORD_MAP` filters liked properties by title keyword (residential / commercial / plot / service / pg/hostel). |

---

## 3. My Properties (`/dashboard/seeker/my-properties`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 3.1 | **Pagination is display-only** | 🔧 | ✅ | Added `currentPage` state, `ITEMS_PER_PAGE=6`, slice-based pagination, working prev/next/number buttons. |
| 3.2 | **Properties data is mocked** | 🔌 | ⬜ | `fetchPropertiesMock()` returns 3 hardcoded `mockSeekerProperties` after 600 ms. |
| 3.3 | **"Lease Details" button unwired** | 🔧 | ✅ | `onLeaseDetails` prop added; opens modal with full lease period, rent, security deposit, months remaining. |
| 3.4 | **"Pay Rent" button unwired** | 🎨 | ✅ | `onPayRent` prop added; opens payment modal with amount/period review, confirm button, loading state, success screen. |
| 3.5 | **"View Details" button unwired** | 🔧 | ✅ | `onViewDetails` prop added; navigates to `/listings`. |
| 3.6 | **"Contact Agent/Seller" button unwired** | 🎨 | ✅ | `onContactAgent` prop added; navigates to `/dashboard/seeker/messages`. |

---

## 4. Search Properties (`/dashboard/seeker/search`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 4.1 | **Uses generic listings, not seeker-specific flow** | 🔧 | ⬜ | Renders `ClientListingsContent` with `hrefPrefix="/listings"`. Requires a new seeker transaction-initiation route that does not yet exist. |

---

## 5. Messages (`/dashboard/seeker/messages`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 5.1 | **Message send is mocked** | 🔌 | ⬜ | `sendMessageMock()` appends to local state after 600 ms. No API. |
| 5.2 | **Only 5 hardcoded threads** | 🔌 | ⬜ | `generateMockThreads()` creates `chat_1` – `chat_5` every session. No persistence. |
| 5.3 | **File upload modals UI-only** | 🎨 | ⬜ | Upload modals open but no file is ever sent. |
| 5.4 | **Emoji button unwired** | 🔧 | ✅ | Emoji picker added with 18 common emojis; closes on outside click; appends to input. |
| 5.5 | **No real-time updates** | 🎨 | ⬜ | No WebSocket/polling. Incoming messages never appear. |
| 5.6 | **Reuses agent messaging components** | 🔧 | ✅ | Seeker messages page correctly reuses shared components — no action needed. |

---

## 6. Transactions (`/dashboard/seeker/transactions`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 6.1 | **All 7 mock transactions are hardcoded** | 🔌 | ⬜ | `useSeekerTransactionsStore` — hardcoded transactions with fixed avatars, names, amounts, dates. |
| 6.2 | **Pagination works** ✓ | — | ✅ | Seeker transactions pagination has proper `onClick` handlers — no action needed. |

---

## 7. Transaction Detail (`/dashboard/seeker/transactions/[id]`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 7.1 | **All timeline actions are local-only** | 🔌 | ⬜ | `confirmInspectionMock`, `confirmHandoverMock`, `approveMilestoneMock`, `makePaymentMock`, `submitReviewMock` — all use setTimeout and update state locally only. |
| 7.2 | **"Download Receipt" button unwired** | 🎨 | ✅ | `downloadReceipt()` generates a formatted `.txt` file and triggers a browser download. |
| 7.3 | **"Report Transaction" button unwired** | 🎨 | ✅ | `ReportModal` added with radio reason selector (5 options), details textarea, loading state, success confirmation. |
| 7.4 | **Dispute link "Clicking here" is dead** | 🎨 | ✅ | `onOpenDispute` prop added to `SeekerTransactionTimeline`; "Clicking here" span now opens the report/dispute modal. |
| 7.5 | **Route param used for mock lookup only** | 🔌 | ⬜ | `fetchTransactionByIdMock(id)` searches local mock array. No real backend fetch. |

---

## 8. Wallet (`/dashboard/seeker/wallet`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 8.1 | **Ledger data is mocked** | 🔌 | ⬜ | `fetchLedgerMock()` returns 5 identical mock transactions after 800 ms. |
| 8.2 | **Withdrawal always succeeds** | 🔌 | ⬜ | `processWithdrawalMock()` never validates balance or calls a payment processor. |
| 8.3 | **Bank details update is a no-op** | 🔌 | ⬜ | `updateFiatDetailsMock()` updates local state only. |
| 8.4 | **Deposit modal collects nothing** | 🔌 | ⬜ | No submission handler wired to a payment gateway. |
| 8.5 | **Wallet history pagination display-only** | 🔧 | ✅ | Replaced hardcoded "Page 1 of 30" with real `currentPage` state, working page number buttons and prev/next arrows. |
| 8.6 | **Settings gear is `console.log`** | 🔧 | ✅ | Replaced with `router.push(settingsPath)` — detects agent vs seeker from pathname. |
| 8.7 | **Balance is hardcoded** | 🔌 | ⬜ | `walletBalance: 25,000,000` and `escrowBalance: 0` are Zustand initial state. |
| 8.8 | **Reuses agent wallet modals** | 🔧 | ✅ | Wallet modals are role-agnostic; reuse is appropriate. No change needed. |

---

## 9. Settings (`/dashboard/seeker/settings`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 9.1 | **All form submissions are no-ops** | 🔌 | ⬜ | All `submit*Mock()` in `useSettingsStore.ts` wait 1200 ms and update local state only. |
| 9.2 | **Avatar upload is preview-only** | 🎨 | ⬜ | `URL.createObjectURL()` for local preview. No upload endpoint. |
| 9.3 | **Settings are agent-focused** | 🔧 | ✅ | Added seeker-specific **Notifications** tab (`SeekerNotificationSettings.tsx`) with toggles for 7 notification types. CommissionSettings and SubscriptionSettings already excluded. |
| 9.4 | **Hardcoded mock accounts** | 🔌 | ⬜ | `useSettingsStore` initial state has 3 hardcoded mock accounts with dummy roles. |

---

## 10. Stats Component

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 10.1 | **"All time" filter button unwired** | 🔧 | ✅ | Dropdown added with All time / This week / This month / This year options. |
| 10.2 | **Date range button unwired** | 🔧 | ✅ | Date range picker added with from/to date inputs and Apply button. |
| 10.3 | **Stats values are hardcoded** | 🔌 | ⬜ | Stats are set from mock data in `useSeekerDashboardStore` initial state. Not derived from real transactions. |

---

## 11. Cross-Cutting

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 11.1 | **No auth guard on `/dashboard/seeker`** | 🔧 | ✅ | `src/middleware.ts` guards all `/dashboard/*` routes via `irealty-session` cookie. |
| 11.2 | **Auth state lost on refresh** | 🔧 | ✅ | `useAuthStore` uses Zustand `persist` middleware with `localStorage`. Cookie re-set on rehydration. |
| 11.3 | **Mock functions never reject** | 🔧 | ✅ | Added `try/catch` to all mock functions in `useSeekerDashboardStore`, `useSeekerPropertiesStore`, `useSeekerTransactionsStore`, `useWalletStore`. Error state now populates on failure. |
| 11.4 | **`console.log` in production handler** | 🔧 | ✅ | `WalletOverviewCard` settings button — same fix as 8.6. |

---

## Summary Counts

| Section | Total | 🔌 Backend | 🎨 UI+Backend | 🔧 Wiring | ✅ Done |
|---------|-------|-----------|--------------|----------|--------|
| Main Dashboard | 1 | 1 | 0 | 0 | 0 |
| Favorites | 1 | 0 | 0 | 1 | 1 |
| My Properties | 6 | 1 | 2 | 3 | 5 |
| Search | 1 | 0 | 0 | 1 | 0 |
| Messages | 6 | 2 | 2 | 2 | 2 |
| Transactions | 1 | 1 | 0 | 0 | 0 |
| Transaction Detail | 5 | 2 | 2 | 1 | 3 |
| Wallet | 8 | 4 | 0 | 4 | 3 |
| Settings | 4 | 1 | 1 | 2 | 1 |
| Stats Component | 3 | 1 | 0 | 2 | 2 |
| Cross-cutting | 4 | 0 | 0 | 4 | 4 |
| **Total** | **40** | **13** | **7** | **20** | **21** |
