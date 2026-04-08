# SEEKERTODO.md — Property Seeker Dashboard: Incomplete & Stub Inventory

> Tracks every unimplemented interaction, logic gap, and placeholder in the property seeker dashboard.
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

## 1. Main Dashboard (`/dashboard/seeker`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 1.1 | **Dashboard and transaction data are mocked** | 🔌 | `fetchDashboardDataMock()` and `fetchTransactionsMock()` both use setTimeout on load. Hardcoded stats returned. |

---

## 2. Favorites (`/dashboard/seeker/favorites`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 2.1 | **Category filter tabs always return all properties** | 🔧 | Filter logic is commented as a stub: uses `tag` as a proxy for `category`, but still returns all liked properties in all cases. Tab buttons call `setActiveTab()` but the filtered list is not segmented correctly. Fix the filter predicate to match tab labels. |

---

## 3. My Properties (`/dashboard/seeker/my-properties`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 3.1 | **Pagination is display-only** | 🔧 | "Page 1 of 30" hardcoded text; all page number and prev/next buttons have no `onClick` handlers. |
| 3.2 | **Properties data is mocked** | 🔌 | `fetchPropertiesMock()` returns 3 hardcoded `mockSeekerProperties` after 600 ms. |
| 3.3 | **"Lease Details" button unwired** | 🔧 | `SeekerPropertyCard` — "Lease Details" button on rented properties has no `onClick` handler. Should open lease document or detail modal. |
| 3.4 | **"Pay Rent" button unwired** | 🎨 | `SeekerPropertyCard` — "Pay Rent" button on rented properties has no `onClick` handler. Should open payment modal. |
| 3.5 | **"View Details" button unwired** | 🔧 | `SeekerPropertyCard` — "View Details" button on owned properties has no `onClick` handler. |
| 3.6 | **"Contact Agent/Seller" button unwired** | 🎨 | `SeekerPropertyCard` — button on owned properties has no `onClick` handler. Should open messaging. |

---

## 4. Search Properties (`/dashboard/seeker/search`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 4.1 | **Uses generic listings, not seeker-specific flow** | 🔧 | Renders `ClientListingsContent` with `hrefPrefix="/listings"`. Navigates to public listing detail rather than a seeker-specific transaction initiation flow. |

---

## 5. Messages (`/dashboard/seeker/messages`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 5.1 | **Message send is mocked** | 🔌 | `sendMessageMock()` appends to local state after 600 ms. No API. |
| 5.2 | **Only 5 hardcoded threads** | 🔌 | `generateMockThreads()` creates `chat_1` – `chat_5` every session. No persistence. |
| 5.3 | **File upload modals UI-only** | 🎨 | Upload modals open but no file is ever sent. |
| 5.4 | **Emoji button unwired** | 🔧 | `MessageInput` — Smile icon button has no `onClick` handler. |
| 5.5 | **No real-time updates** | 🎨 | No WebSocket/polling. Incoming messages never appear. |
| 5.6 | **Reuses agent messaging components** | 🔧 | Seeker messages page imports agent-specific InboxList, ChatWindow, ContextPanel unchanged. |

---

## 6. Transactions (`/dashboard/seeker/transactions`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 6.1 | **All 7 mock transactions are hardcoded** | 🔌 | `useSeekerTransactionsStore` — hardcoded transactions with fixed avatars, names, amounts, dates. |
| 6.2 | **Pagination works** ✓ | — | Seeker transactions pagination has proper `onClick` handlers — no action needed. |

---

## 7. Transaction Detail (`/dashboard/seeker/transactions/[id]`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 7.1 | **All timeline actions are local-only** | 🔌 | `confirmInspectionMock`, `confirmHandoverMock`, `approveMilestoneMock`, `makePaymentMock`, `submitReviewMock` — all use setTimeout (600–1000 ms) and update state locally only. No backend calls. |
| 7.2 | **"Download Receipt" button unwired** | 🎨 | Button has no `onClick` handler and no `href`. Should generate and download a receipt. |
| 7.3 | **"Report Transaction" button unwired** | 🎨 | Button has no `onClick` handler. Should open a dispute/report form. |
| 7.4 | **Dispute link "Clicking here" is dead** | 🎨 | `SeekerTransactionTimeline` — text styled with `cursor-pointer underline` but has no `onClick` handler. Should open dispute creation flow. |
| 7.5 | **Route param used for mock lookup only** | 🔌 | `fetchTransactionByIdMock(id)` searches local mock array. No real backend fetch. |

---

## 8. Wallet (`/dashboard/seeker/wallet`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 8.1 | **Ledger data is mocked** | 🔌 | `fetchLedgerMock()` returns 5 identical mock transactions (same date, same amount) after 800 ms. |
| 8.2 | **Withdrawal always succeeds** | 🔌 | `processWithdrawalMock()` never validates balance or calls a payment processor. |
| 8.3 | **Bank details update is a no-op** | 🔌 | `updateFiatDetailsMock()` updates local state only. |
| 8.4 | **Deposit modal collects nothing** | 🔌 | No submission handler wired to a payment gateway. |
| 8.5 | **Wallet history pagination display-only** | 🔧 | `TransactionHistory` — page numbers and prev/next buttons have no `onClick` handlers. "Page 1 of 30" hardcoded. |
| 8.6 | **Settings gear is `console.log`** | 🔧 | `WalletOverviewCard` settings button calls `console.log('Settings triggered')`. |
| 8.7 | **Balance is hardcoded** | 🔌 | `walletBalance: 25,000,000` and `escrowBalance: 0` are Zustand initial state. |
| 8.8 | **Reuses agent wallet modals** | 🔧 | Seeker wallet page imports all modals from agent components unchanged. |

---

## 9. Settings (`/dashboard/seeker/settings`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 9.1 | **All form submissions are no-ops** | 🔌 | All `submit*Mock()` in `useSettingsStore.ts` wait 1200 ms and update local state only. |
| 9.2 | **Avatar upload is preview-only** | 🎨 | `URL.createObjectURL()` for local preview. No upload endpoint. |
| 9.3 | **Settings are agent-focused** | 🔧 | Seeker settings page imports all forms from agent settings (PayoutSettings, CommissionSettings, etc.). These fields are not relevant to seekers. Should be replaced with seeker-specific forms (saved searches, notification preferences, etc.). |
| 9.4 | **Hardcoded mock accounts** | 🔌 | `useSettingsStore` initial state has 3 hardcoded mock accounts with dummy roles. |

---

## 10. Stats Component

| # | Item | Type | Notes |
|---|------|------|-------|
| 10.1 | **"All time" filter button unwired** | 🔧 | `SeekerStats` — dropdown button has no `onClick` handler. |
| 10.2 | **Date range button unwired** | 🔧 | `SeekerStats` — date range button has no `onClick` handler. Date "12 Dec, 2023 – 14 Dec, 2023" is hardcoded. |
| 10.3 | **Stats values are hardcoded** | 🔌 | Stats are set from mock data in `useSeekerDashboardStore` initial state. Not derived from real transactions. |

---

## 11. Cross-Cutting

| # | Item | Type | Notes |
|---|------|------|-------|
| 11.1 | **No auth guard on `/dashboard/seeker`** | 🔧 | Any visitor can access all seeker routes. |
| 11.2 | **Auth state lost on refresh** | 🔧 | `useAuthStore` is in-memory. |
| 11.3 | **Mock functions never reject** | 🔧 | No failure paths — error states untestable. |
| 11.4 | **`console.log` in production handler** | 🔧 | `WalletOverviewCard` settings button. Remove or implement. |

---

## Summary Counts

| Section | Total | 🔌 Backend | 🎨 UI+Backend | 🔧 Wiring |
|---------|-------|-----------|--------------|----------|
| Main Dashboard | 1 | 1 | 0 | 0 |
| Favorites | 1 | 0 | 0 | 1 |
| My Properties | 6 | 1 | 2 | 3 |
| Search | 1 | 0 | 0 | 1 |
| Messages | 6 | 2 | 2 | 2 |
| Transactions | 1 | 1 | 0 | 0 |
| Transaction Detail | 5 | 2 | 2 | 1 |
| Wallet | 8 | 4 | 0 | 4 |
| Settings | 4 | 1 | 1 | 2 |
| Stats Component | 3 | 1 | 0 | 2 |
| Cross-cutting | 4 | 0 | 0 | 4 |
| **Total** | **40** | **13** | **7** | **20** |
