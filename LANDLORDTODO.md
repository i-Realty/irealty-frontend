# LANDLORDTODO.md — Landlord Dashboard: Incomplete & Stub Inventory

> Tracks every unimplemented interaction, logic gap, and placeholder in the landlord dashboard.
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

## 1. Main Dashboard (`/dashboard/landlord`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 1.1 | **Dashboard and transactions data are mocked** | 🔌 | `fetchDashboardDataMock()` and `fetchTransactionsMock()` both use setTimeout on load. Hardcoded stats. |
| 1.2 | **Stats date filter buttons unwired** | 🔧 | `LandlordStats` — "All time" dropdown and date range button have no `onClick` handlers. Dates "12 Dec, 2023 – 14 Dec, 2023" are hardcoded. |

---

## 2. Properties (`/dashboard/landlord/properties`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 2.1 | **Pagination is display-only** | 🔧 | Pagination buttons (page numbers and prev/next) have no `onClick` handlers. `currentPage` is hardcoded to `1` and never changes. |
| 2.2 | **"View Details" button unwired** | 🔧 | `LandlordPropertyCard` — "View Details" button has no `onClick` handler. No property detail route for landlord. |
| 2.3 | **"Message Tenant" button unwired** | 🎨 | `LandlordPropertyCard` — button has no `onClick` handler. Should open messaging with current tenant. |
| 2.4 | **"List Property" button unwired** | 🎨 | `LandlordPropertyCard` — button has no `onClick` handler. Should open listing/publication flow. |
| 2.5 | **"Track Repairs" button unwired** | 🎨 | `LandlordPropertyCard` — button has no `onClick` handler. Maintenance tracking feature not built. |
| 2.6 | **Properties data is mocked** | 🔌 | `fetchPropertiesMock()` loads hardcoded `mockProperties` (lines 44–105 of store) after 600 ms. |

---

## 3. Documents (`/dashboard/landlord/documents`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 3.1 | **All 7 mock documents are identical** | 🔌 | `fetchDocumentsListMock()` returns 7 copies of the same rental agreement. |
| 3.2 | **"Preview" button unwired** | 🎨 | `DocumentsList` — Preview button has no `onClick` handler (both desktop and mobile views). |
| 3.3 | **"Edit" button unwired** | 🎨 | `DocumentsList` — Edit button has no `onClick` handler (both desktop and mobile views). |
| 3.4 | **Pagination is display-only** | 🔧 | "Page 1 of 30" hardcoded; page number and prev/next buttons have no `onClick` handlers. |
| 3.5 | **Document creation is a no-op** | 🎨 | `createDocumentMock()` collects 24 form fields then appends a fake entry locally after 1500 ms. No document generated. |
| 3.6 | **Manual upload drag-drop unwired** | 🎨 | Drop zone in wizard has no event listeners and no `<input type="file">`. |

---

## 4. Messages (`/dashboard/landlord/messages`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 4.1 | **Message send is mocked** | 🔌 | `sendMessageMock()` appends to local state after 600 ms. No API. |
| 4.2 | **Only 5 hardcoded threads** | 🔌 | `generateMockThreads()` creates `chat_1` – `chat_5` every session. |
| 4.3 | **Emoji button unwired** | 🔧 | `MessageInput` — Smile icon button has no `onClick` handler. No emoji picker. |
| 4.4 | **Mic (voice message) button unwired** | 🎨 | `MessageInput` — Mic button has no `onClick` handler when text input is empty. |
| 4.5 | **File upload modals UI-only** | 🎨 | Upload modals exist and open but no file is ever sent. |
| 4.6 | **No real-time updates** | 🎨 | No WebSocket/polling. New incoming messages never appear. |

---

## 5. Transactions (`/dashboard/landlord/transactions`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 5.1 | **All transaction data is mocked** | 🔌 | `fetchTransactionsMock()` returns hardcoded `mockTransactions` (lines 107–180 of store) after 600 ms. |
| 5.2 | **Pagination works** ✓ | — | Transactions page pagination has proper `onClick` handlers — no action needed. |

---

## 6. Transaction Detail (`/dashboard/landlord/transactions/[id]`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 6.1 | **"Message Tenant" button unwired** | 🎨 | `TenantCard` — button has no `onClick` handler. Should open messaging. |
| 6.2 | **"Download Receipt" button unwired** | 🎨 | Button has no `onClick` handler. Should generate and download a receipt PDF. |
| 6.3 | **"Report Transaction" button unwired** | 🎨 | Button has no `onClick` handler. Should open a dispute/report form. |
| 6.4 | **Transaction fetched by mock lookup** | 🔌 | `fetchTransactionByIdMock(id)` searches local mock array rather than calling a backend endpoint. |

---

## 7. Wallet (`/dashboard/landlord/wallet`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 7.1 | **Ledger data is mocked** | 🔌 | `fetchLedgerMock()` returns 5 identical mock transactions (same date, same amount) after 800 ms. |
| 7.2 | **"Fund with Flutterwave" button unwired** | 🎨 | `FundDepositModal` — button has no `onClick` handler. No Flutterwave SDK integration. |
| 7.3 | **"Fund with Paystack" button unwired** | 🎨 | `FundDepositModal` — button has no `onClick` handler. No Paystack SDK integration. |
| 7.4 | **Copy-to-clipboard button unwired** | 🔧 | `FundDepositModal` — copy icon has no `onClick` handler. Should copy account/reference number. |
| 7.5 | **Withdrawal always succeeds** | 🔌 | `processWithdrawalMock()` never validates balance or calls a payment processor. |
| 7.6 | **Bank details update is a no-op** | 🔌 | `updateFiatDetailsMock()` updates local state only. |
| 7.7 | **Wallet history pagination display-only** | 🔧 | `TransactionHistory` — page numbers and prev/next buttons have no `onClick` handlers. "Page 1 of 30" hardcoded. |
| 7.8 | **Settings gear is `console.log`** | 🔧 | `WalletOverviewCard` settings button calls `console.log('Settings triggered')`. |
| 7.9 | **Balance is hardcoded** | 🔌 | `walletBalance: 25,000,000` and `escrowBalance: 0` are Zustand initial state. |

---

## 8. Settings (`/dashboard/landlord/settings`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 8.1 | **All form submissions are no-ops** | 🔌 | All `submit*Mock()` in `useSettingsStore.ts` wait 1200 ms and update local state only. |
| 8.2 | **Avatar upload is preview-only** | 🎨 | `URL.createObjectURL()` for local preview. Comment says "When backend is integrated: upload file". |
| 8.3 | **Phone country-code selector unwired** | 🔧 | `ProfileSettings` — ChevronDown dropdown has no `onClick` handler. |
| 8.4 | **Settings reuse agent components** | 🔧 | Landlord settings page imports all forms from agent settings. No landlord-specific fields (e.g., lease management, tenant settings). |

---

## 9. Cross-Cutting

| # | Item | Type | Notes |
|---|------|------|-------|
| 9.1 | **No auth guard on `/dashboard/landlord`** | 🔧 | Any visitor can access all landlord routes. |
| 9.2 | **Auth state lost on refresh** | 🔧 | `useAuthStore` is in-memory. |
| 9.3 | **Mock functions never reject** | 🔧 | No failure paths. Error states untestable. |
| 9.4 | **`console.log` in production handler** | 🔧 | `WalletOverviewCard` settings button. Remove or implement. |

---

## Summary Counts

| Section | Total | 🔌 Backend | 🎨 UI+Backend | 🔧 Wiring |
|---------|-------|-----------|--------------|----------|
| Main Dashboard | 2 | 1 | 0 | 1 |
| Properties | 6 | 1 | 3 | 2 |
| Documents | 6 | 1 | 4 | 1 |
| Messages | 6 | 2 | 3 | 1 |
| Transactions | 1 | 1 | 0 | 0 |
| Transaction Detail | 4 | 1 | 3 | 0 |
| Wallet | 9 | 4 | 2 | 3 |
| Settings | 4 | 1 | 1 | 2 |
| Cross-cutting | 4 | 0 | 0 | 4 |
| **Total** | **42** | **12** | **16** | **14** |
