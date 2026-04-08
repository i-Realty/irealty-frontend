# DIASPORATODO.md — Diaspora Investor Dashboard: Incomplete & Stub Inventory

> Tracks every unimplemented interaction, logic gap, and placeholder in the diaspora investor dashboard.
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

## 1. Main Dashboard (`/dashboard/diaspora`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 1.1 | **Dashboard data is mocked** | 🔌 | `fetchDashboardDataMock()` uses 600 ms setTimeout. `MOCK_INVOICES` and `MOCK_PAYMENTS` are hardcoded in store. |
| 1.2 | **"Proceed To Payment" button unwired** | 🎨 | `InvoiceDetailModal` — button has no `onClick` handler. Should trigger payment gateway. |
| 1.3 | **"View Escrow Timeline" button unwired (modal)** | 🔧 | `InvoiceDetailModal` — button has no `onClick` handler. Should navigate to or open timeline view. |
| 1.4 | **"View Escrow Timeline" button unwired (plan overview)** | 🔧 | Plan overview section — styled as a link-button but has no `onClick` handler. |
| 1.5 | **"Chat Client" button unwired** | 🎨 | Contact Care Manager card — "Chat Client" button has no `onClick` handler. Should open messaging. |
| 1.6 | **"WhatsApp" button unwired** | 🎨 | Contact Care Manager card — "WhatsApp" button has no `onClick` handler. Should open WhatsApp with pre-filled message. |
| 1.7 | **Recent Invoices "Filter" button unwired** | 🔧 | Filter icon button has no `onClick` handler. Search input works but dedicated filter is not. |

---

## 2. Service Catalog (`/dashboard/diaspora/service-catalog`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 2.1 | **"Book A Free Consultation" buttons unwired** | 🎨 | Each plan card has a CTA button with no `onClick` handler. 4 buttons total. Should open a booking form or calendar. |

---

## 3. Transactions (`/dashboard/diaspora/transactions`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 3.1 | **"Filter" button unwired** | 🔧 | Filter button in the search section has no `onClick` handler. Filter pills (tabs) work; only the icon-button is broken. |
| 3.2 | **All transaction data is mocked** | 🔌 | `fetchDashboardDataMock()` returns hardcoded invoice/payment records after 600 ms. |

---

## 4. Transaction Detail (`/dashboard/diaspora/transactions/[id]`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 4.1 | **"Chat Client" button unwired** | 🎨 | Service rep contact card — "Chat Client" button has no `onClick` handler. |
| 4.2 | **"WhatsApp" button unwired** | 🎨 | Service rep contact card — "WhatsApp" button has no `onClick` handler. |
| 4.3 | **Timeline advance is local-only** | 🔌 | `advanceTimelineStepMock()` updates timeline steps locally after 600 ms. No backend persistence. Steps reset on refresh. |
| 4.4 | **Route param used for mock lookup only** | 🔌 | `fetchTransactionByIdMock(id)` searches the local mock array rather than calling a backend endpoint. |

---

## 5. Favorites (`/dashboard/diaspora/favorites`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 5.1 | **Category filter tabs always return all results** | 🔧 | `favorites/page.tsx` — filter logic comment says "`PropertyWithCoords` has no category field matching tabs directly, so filter by tag as proxy" and still returns all `likedProperties`. Tabs are display-only. |

---

## 6. My Properties (`/dashboard/diaspora/my-properties`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 6.1 | **Properties data is mocked** | 🔌 | `fetchPropertiesMock()` from `useSeekerPropertiesStore` returns 3 hardcoded properties after 600 ms. |

---

## 7. Messages (`/dashboard/diaspora/messages`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 7.1 | **Message send is mocked** | 🔌 | `sendMessageMock()` appends to local state after 600 ms. No API. |
| 7.2 | **Only 5 hardcoded threads** | 🔌 | `generateMockThreads()` creates `chat_1` – `chat_5` every session. No persistence. |
| 7.3 | **File upload modals UI-only** | 🎨 | Upload modals exist but no file is ever sent anywhere. |
| 7.4 | **No real-time updates** | 🎨 | No WebSocket/polling. New messages from other participants never appear. |

---

## 8. Wallet (`/dashboard/diaspora/wallet`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 8.1 | **Ledger data is mocked** | 🔌 | `fetchLedgerMock()` returns 5 identical mock transactions (same date, same amount) after 800 ms. |
| 8.2 | **Withdrawal always succeeds** | 🔌 | `processWithdrawalMock()` never validates balance or calls a payment processor. |
| 8.3 | **Bank details update is a no-op** | 🔌 | `updateFiatDetailsMock()` updates local state only after 600 ms. |
| 8.4 | **Deposit modal collects nothing** | 🔌 | No submission handler wired to a payment gateway. |
| 8.5 | **Balance is hardcoded** | 🔌 | `walletBalance: 25,000,000` and `escrowBalance: 0` are Zustand initial state, not fetched from API. |

---

## 9. Settings (`/dashboard/diaspora/settings`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 9.1 | **All form submissions are no-ops** | 🔌 | All `submit*Mock()` functions in `useSettingsStore.ts` wait 1200 ms and update local state only. |
| 9.2 | **Avatar upload is preview-only** | 🎨 | `URL.createObjectURL()` for local preview only. No upload endpoint. |
| 9.3 | **Settings forms are agent-focused** | 🔧 | Diaspora settings page imports all forms from agent settings. No diaspora-specific fields (e.g., diaspora payment methods, FX preferences). |

---

## 10. Cross-Cutting

| # | Item | Type | Notes |
|---|------|------|-------|
| 10.1 | **No auth guard on `/dashboard/diaspora`** | 🔧 | Any visitor can access all diaspora routes. |
| 10.2 | **Auth state lost on refresh** | 🔧 | `useAuthStore` is in-memory. |
| 10.3 | **Mock functions never reject** | 🔧 | No simulated failure paths. Error-state UI untestable. |
| 10.4 | **My-Properties and Messages reuse seeker/agent stores** | 🔧 | Diaspora-specific workflows (escrow, currency conversion) not reflected in shared stores. |

---

## Summary Counts

| Section | Total | 🔌 Backend | 🎨 UI+Backend | 🔧 Wiring |
|---------|-------|-----------|--------------|----------|
| Main Dashboard | 7 | 1 | 3 | 3 |
| Service Catalog | 1 | 0 | 1 | 0 |
| Transactions | 2 | 1 | 0 | 1 |
| Transaction Detail | 4 | 2 | 2 | 0 |
| Favorites | 1 | 0 | 0 | 1 |
| My Properties | 1 | 1 | 0 | 0 |
| Messages | 4 | 2 | 2 | 0 |
| Wallet | 5 | 5 | 0 | 0 |
| Settings | 3 | 1 | 1 | 1 |
| Cross-cutting | 4 | 0 | 0 | 4 |
| **Total** | **32** | **13** | **9** | **10** |
