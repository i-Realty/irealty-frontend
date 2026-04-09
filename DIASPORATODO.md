# DIASPORATODO.md — Diaspora Investor Dashboard: Incomplete & Stub Inventory

> Tracks every unimplemented interaction, logic gap, and placeholder in the diaspora investor dashboard.
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

## 1. Main Dashboard (`/dashboard/diaspora`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 1.1 | **Dashboard data is mocked** | 🔌 | ⬜ | `fetchDashboardDataMock()` uses 600 ms setTimeout. `MOCK_INVOICES` and `MOCK_PAYMENTS` are hardcoded in store. |
| 1.2 | **"Proceed To Payment" button unwired** | 🎨 | ✅ | `InvoiceDetailModal` — opens `PaymentModal` with Bank Transfer / Card / Crypto selection, confirm flow, and success screen. |
| 1.3 | **"View Escrow Timeline" button unwired (modal)** | 🔧 | ✅ | Navigates to `/dashboard/diaspora/transactions`. |
| 1.4 | **"View Escrow Timeline" button unwired (plan overview)** | 🔧 | ✅ | `router.push('/dashboard/diaspora/transactions')`. |
| 1.5 | **"Chat Client" button unwired** | 🎨 | ✅ | Navigates to `/dashboard/diaspora/messages`. |
| 1.6 | **"WhatsApp" button unwired** | 🎨 | ✅ | Opens `https://wa.me/` with a pre-filled message in a new tab. |
| 1.7 | **Recent Invoices "Filter" button unwired** | 🔧 | ✅ | Filter dropdown with status options (All / Pending / Paid / Overdue / Failed). Search input also wired. |

---

## 2. Service Catalog (`/dashboard/diaspora/service-catalog`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 2.1 | **"Book A Free Consultation" buttons unwired** | 🎨 | ✅ | Each of the 4 plan cards opens `ConsultationModal` — form with name, email, preferred date, notes; submit shows success confirmation. |

---

## 3. Transactions (`/dashboard/diaspora/transactions`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 3.1 | **"Filter" button unwired** | 🔧 | ✅ | Filter popover with min/max amount range inputs; active indicator when filter applied. |
| 3.2 | **All transaction data is mocked** | 🔌 | ⬜ | `fetchDashboardDataMock()` returns hardcoded invoice/payment records after 600 ms. |

---

## 4. Transaction Detail (`/dashboard/diaspora/transactions/[id]`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 4.1 | **"Chat Client" button unwired** | 🎨 | ✅ | Navigates to `/dashboard/diaspora/messages`. |
| 4.2 | **"WhatsApp" button unwired** | 🎨 | ✅ | Opens `https://wa.me/` with pre-filled message including transaction ID and rep name. |
| 4.3 | **Timeline advance is local-only** | 🔌 | ⬜ | `advanceTimelineStepMock()` updates timeline steps locally. Steps reset on refresh. |
| 4.4 | **Route param used for mock lookup only** | 🔌 | ⬜ | `fetchTransactionByIdMock(id)` searches local mock array. |

---

## 5. Favorites (`/dashboard/diaspora/favorites`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 5.1 | **Category filter tabs always return all results** | 🔧 | ✅ | Fixed: `CATEGORY_KEYWORD_MAP` filters liked properties by title keyword (same fix as seeker 2.1). |

---

## 6. My Properties (`/dashboard/diaspora/my-properties`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 6.1 | **Properties data is mocked** | 🔌 | ⬜ | `fetchPropertiesMock()` from `useSeekerPropertiesStore` returns 3 hardcoded properties after 600 ms. |

---

## 7. Messages (`/dashboard/diaspora/messages`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 7.1 | **Message send is mocked** | 🔌 | ⬜ | `sendMessageMock()` appends to local state after 600 ms. No API. |
| 7.2 | **Only 5 hardcoded threads** | 🔌 | ⬜ | `generateMockThreads()` creates `chat_1` – `chat_5`. No persistence. |
| 7.3 | **File upload modals UI-only** | 🎨 | ⬜ | Upload modals exist but no file is ever sent. |
| 7.4 | **No real-time updates** | 🎨 | ⬜ | No WebSocket/polling. |

---

## 8. Wallet (`/dashboard/diaspora/wallet`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 8.1 | **Ledger data is mocked** | 🔌 | ⬜ | `fetchLedgerMock()` returns 5 identical mock transactions after 800 ms. |
| 8.2 | **Withdrawal always succeeds** | 🔌 | ⬜ | `processWithdrawalMock()` never validates balance. |
| 8.3 | **Bank details update is a no-op** | 🔌 | ⬜ | `updateFiatDetailsMock()` updates local state only. |
| 8.4 | **Deposit modal collects nothing** | 🔌 | ⬜ | No submission handler wired to a payment gateway. |
| 8.5 | **Balance is hardcoded** | 🔌 | ⬜ | `walletBalance: 25,000,000` and `escrowBalance: 0` are Zustand initial state. |

---

## 9. Settings (`/dashboard/diaspora/settings`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 9.1 | **All form submissions are no-ops** | 🔌 | ⬜ | All `submit*Mock()` functions wait 1200 ms and update local state only. |
| 9.2 | **Avatar upload is preview-only** | 🎨 | ⬜ | `URL.createObjectURL()` for local preview only. |
| 9.3 | **Settings forms are agent-focused** | 🔧 | ✅ | Added diaspora-specific **FX & Currency** tab (`DiasporaFXSettings.tsx`) — home currency, display currency, FX rate provider, auto-conversion toggle, rate-change alerts with configurable threshold. |

---

## 10. Cross-Cutting

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 10.1 | **No auth guard on `/dashboard/diaspora`** | 🔧 | ✅ | `src/middleware.ts` guards all `/dashboard/*` routes via `irealty-session` cookie. |
| 10.2 | **Auth state lost on refresh** | 🔧 | ✅ | `useAuthStore` uses Zustand `persist` with `localStorage`. |
| 10.3 | **Mock functions never reject** | 🔧 | ✅ | Added `try/catch` to `fetchDashboardDataMock`, `fetchTransactionByIdMock`, and `advanceTimelineStepMock` in `useDiasporaDashboardStore`. |
| 10.4 | **My-Properties and Messages reuse seeker/agent stores** | 🔧 | ⬜ | Diaspora-specific workflows (escrow, currency conversion) not reflected in shared stores. Requires new diaspora-specific store variants. |

---

## Summary Counts

| Section | Total | 🔌 Backend | 🎨 UI+Backend | 🔧 Wiring | ✅ Done |
|---------|-------|-----------|--------------|----------|--------|
| Main Dashboard | 7 | 1 | 3 | 3 | 6 |
| Service Catalog | 1 | 0 | 1 | 0 | 1 |
| Transactions | 2 | 1 | 0 | 1 | 1 |
| Transaction Detail | 4 | 2 | 2 | 0 | 2 |
| Favorites | 1 | 0 | 0 | 1 | 1 |
| My Properties | 1 | 1 | 0 | 0 | 0 |
| Messages | 4 | 2 | 2 | 0 | 0 |
| Wallet | 5 | 5 | 0 | 0 | 0 |
| Settings | 3 | 1 | 1 | 1 | 1 |
| Cross-cutting | 4 | 0 | 0 | 4 | 3 |
| **Total** | **32** | **13** | **9** | **10** | **15** |
