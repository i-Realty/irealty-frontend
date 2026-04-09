# LANDLORDTODO.md — Landlord Dashboard: Incomplete & Stub Inventory

> Tracks every unimplemented interaction, logic gap, and placeholder in the landlord dashboard.
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

## 1. Main Dashboard (`/dashboard/landlord`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 1.1 | **Dashboard and transactions data are mocked** | 🔌 | ⬜ | `fetchDashboardDataMock()` and `fetchTransactionsMock()` use setTimeout. Hardcoded stats. |
| 1.2 | **Stats date filter buttons unwired** | 🔧 | ✅ | `LandlordStats` — "All time" dropdown (4 options) and date range picker with from/to inputs. |

---

## 2. Properties (`/dashboard/landlord/properties`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 2.1 | **Pagination is display-only** | 🔧 | ✅ | Real `currentPage` state, slice-based pagination, working prev/next/number buttons. |
| 2.2 | **"View Details" button unwired** | 🔧 | ✅ | `onViewDetails` prop added; navigates to `/listings`. |
| 2.3 | **"Message Tenant" button unwired** | 🎨 | ✅ | `onMessageTenant` prop added; navigates to `/dashboard/landlord/messages`. |
| 2.4 | **"List Property" button unwired** | 🎨 | ✅ | `onListProperty` prop added; opens `ListPropertyModal` with confirm flow and success screen. |
| 2.5 | **"Track Repairs" button unwired** | 🎨 | ✅ | `onTrackRepairs` prop added; opens `TrackRepairsModal` with category selector and description. |
| 2.6 | **Properties data is mocked** | 🔌 | ⬜ | `fetchPropertiesMock()` loads hardcoded `mockProperties` after 600 ms. |

---

## 3. Documents (`/dashboard/landlord/documents`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 3.1 | **All 7 mock documents are identical** | 🔌 | ⬜ | `fetchDocumentsListMock()` returns 7 copies of the same rental agreement. |
| 3.2 | **"Preview" button unwired** | 🎨 | ✅ | Eye button opens `DocumentPreviewModal` showing metadata and download option (shared with agent Documents). |
| 3.3 | **"Edit" button unwired** | 🎨 | ✅ | Shows "Edit requires backend integration" alert. |
| 3.4 | **Pagination is display-only** | 🔧 | ✅ | Real `currentPage` state + slice-based pagination in shared `DocumentsList.tsx`. |
| 3.5 | **Document creation is a no-op** | 🎨 | ⬜ | `createDocumentMock()` appends a fake entry locally. No real document generated. |
| 3.6 | **Manual upload drag-drop unwired** | 🎨 | ✅ | `Step1_ChooseType.tsx` — `<input type="file">` added; drag-and-drop handlers wired; staged file preview shown. |

---

## 4. Messages (`/dashboard/landlord/messages`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 4.1 | **Message send is mocked** | 🔌 | ⬜ | `sendMessageMock()` appends to local state. No API. |
| 4.2 | **Only 5 hardcoded threads** | 🔌 | ⬜ | `generateMockThreads()` creates `chat_1`–`chat_5`. |
| 4.3 | **Emoji button unwired** | 🔧 | ✅ | Fixed in shared `MessageInput.tsx` (emoji picker with 18 common emojis). |
| 4.4 | **Mic (voice message) button unwired** | 🎨 | ⬜ | No MediaRecorder API integration. |
| 4.5 | **File upload modals UI-only** | 🎨 | ⬜ | No file is ever sent. |
| 4.6 | **No real-time updates** | 🎨 | ⬜ | No WebSocket/polling. |

---

## 5. Transactions (`/dashboard/landlord/transactions`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 5.1 | **All transaction data is mocked** | 🔌 | ⬜ | `fetchTransactionsMock()` returns hardcoded `mockTransactions` after 600 ms. |
| 5.2 | **Pagination works** ✓ | — | ✅ | Transactions page pagination has proper `onClick` handlers. |

---

## 6. Transaction Detail (`/dashboard/landlord/transactions/[id]`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 6.1 | **"Message Tenant" button unwired** | 🎨 | ✅ | `TenantCard` — navigates to `/dashboard/landlord/messages`. |
| 6.2 | **"Download Receipt" button unwired** | 🎨 | ✅ | Generates a formatted `.txt` receipt and triggers browser download. |
| 6.3 | **"Report Transaction" button unwired** | 🎨 | ✅ | `ReportModal` with radio reason selector, details textarea, and success confirmation. |
| 6.4 | **Transaction fetched by mock lookup** | 🔌 | ⬜ | `fetchTransactionByIdMock(id)` searches local mock array. |

---

## 7. Wallet (`/dashboard/landlord/wallet`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 7.1 | **Ledger data is mocked** | 🔌 | ⬜ | `fetchLedgerMock()` returns 5 identical mock transactions after 800 ms. |
| 7.2 | **"Fund with Flutterwave" button unwired** | 🎨 | ✅ | Shows "Flutterwave integration coming soon" alert. |
| 7.3 | **"Fund with Paystack" button unwired** | 🎨 | ✅ | Shows "Paystack integration coming soon" alert. |
| 7.4 | **Copy-to-clipboard button unwired** | 🔧 | ✅ | `FundDepositModal` — uses `navigator.clipboard.writeText()` with fallback; shows "Copied!" feedback for 2s. |
| 7.5 | **Withdrawal always succeeds** | 🔌 | ⬜ | `processWithdrawalMock()` never validates balance. |
| 7.6 | **Bank details update is a no-op** | 🔌 | ⬜ | `updateFiatDetailsMock()` updates local state only. |
| 7.7 | **Wallet history pagination display-only** | 🔧 | ✅ | Fixed in shared `TransactionHistory.tsx` — real `currentPage` state. |
| 7.8 | **Settings gear is `console.log`** | 🔧 | ✅ | Fixed in shared `WalletOverviewCard.tsx` — navigates to settings. |
| 7.9 | **Balance is hardcoded** | 🔌 | ⬜ | Zustand initial state. |

---

## 8. Settings (`/dashboard/landlord/settings`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 8.1 | **All form submissions are no-ops** | 🔌 | ⬜ | All `submit*Mock()` update local state only. |
| 8.2 | **Avatar upload is preview-only** | 🎨 | ⬜ | `URL.createObjectURL()` for local preview. No upload endpoint. |
| 8.3 | **Phone country-code selector unwired** | 🔧 | ⬜ | `ProfileSettings` — ChevronDown has no onClick. Shared component, affects all roles. |
| 8.4 | **Settings reuse agent components** | 🔧 | ✅ | Added landlord-specific **Lease Management** tab with renewal policy, rent increase, late payment, and alert toggles. |

---

## 9. Cross-Cutting

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 9.1 | **No auth guard on `/dashboard/landlord`** | 🔧 | ✅ | `src/middleware.ts` guards all `/dashboard/*` routes via `irealty-session` cookie. |
| 9.2 | **Auth state lost on refresh** | 🔧 | ✅ | `useAuthStore` uses Zustand `persist` with `localStorage`. |
| 9.3 | **Mock functions never reject** | 🔧 | ✅ | `try/catch` added to `fetchDashboardDataMock`, `fetchPropertiesMock`, `fetchTransactionsMock`, `fetchTransactionByIdMock` in `useLandlordDashboardStore`. |
| 9.4 | **`console.log` in production handler** | 🔧 | ✅ | Fixed in shared `WalletOverviewCard.tsx`. |

---

## Summary Counts

| Section | Total | 🔌 Backend | 🎨 UI+Backend | 🔧 Wiring | ✅ Done |
|---------|-------|-----------|--------------|----------|--------|
| Main Dashboard | 2 | 1 | 0 | 1 | 1 |
| Properties | 6 | 1 | 3 | 2 | 5 |
| Documents | 6 | 1 | 4 | 1 | 4 |
| Messages | 6 | 2 | 3 | 1 | 1 |
| Transactions | 1 | 1 | 0 | 0 | 0 |
| Transaction Detail | 4 | 1 | 3 | 0 | 3 |
| Wallet | 9 | 4 | 2 | 3 | 5 |
| Settings | 4 | 1 | 1 | 2 | 1 |
| Cross-cutting | 4 | 0 | 0 | 4 | 4 |
| **Total** | **42** | **12** | **16** | **14** | **24** |
