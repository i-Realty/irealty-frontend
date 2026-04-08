# DEVELOPERTODO.md — Developer Dashboard: Incomplete & Stub Inventory

> Tracks every unimplemented interaction, logic gap, and placeholder in the developer dashboard.
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

## 1. Main Dashboard (`/dashboard/developer`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 1.1 | **Dev-only controls in production** | 🔧 | "Skip KYC (Verify)" and "Reset Dashboard" buttons render in all environments. Guard with `NODE_ENV === 'development'` or remove entirely. |
| 1.2 | **KYC always succeeds** | 🔌 | `mockSubmitKycForVerification()` always resolves verified after 1500 ms. No real verification. |
| 1.3 | **Dashboard data is static** | 🔌 | `fetchDashboardData()` uses 800 ms setTimeout and returns hardcoded stats. |
| 1.4 | **Profile is hardcoded** | 🔌 | Store initial state has name "Waden Warren" and a fixed avatar. Not tied to logged-in user. |
| 1.5 | **"All time" filter button unwired** | 🔧 | `DeveloperStats` — date range and "All time" dropdown buttons have no `onClick` handlers. |
| 1.6 | **Revenue chart filter unwired** | 🔧 | `DeveloperRevenueCharts` — "All time" dropdown has no `onClick`. `totalRevenue` hardcoded to ₦200,000,000. |
| 1.7 | **Recent transactions search/filter unwired** | 🔧 | `DeveloperRecentTransactions` — search `onChange` not connected; "Filter" button has no handler. |
| 1.8 | **Recent transactions pagination display-only** | 🔧 | "Page 1 of 30" hardcoded; pagination buttons have no `onClick` handlers. |

---

## 2. Projects (`/dashboard/developer/projects`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 2.1 | **Pagination is display-only** | 🔧 | "Page 1 of 30" hardcoded; page number buttons and prev/next chevrons have no handlers. |
| 2.2 | **Date filter buttons unwired** | 🔧 | "All time" and date range buttons have no `onClick` handlers. Date "12 Dec, 2023 – 14 Dec, 2023" is hardcoded. |
| 2.3 | **All 8 projects have identical data** | 🔌 | `mockDeveloperProjects` — all projects cloned with same name and description. |
| 2.4 | **"View Details" button unwired** | 🔧 | `DeveloperProjectCard` — "View Details" button has no `onClick` handler. |
| 2.5 | **Empty state copy error** | 🔧 | `ProjectEmptyState.tsx` — text says "All recent transactions will be displayed here" (should say "projects"). |

---

## 3. Project Creation Wizard (5-Step)

| # | Item | Type | Notes |
|---|------|------|-------|
| 3.1 | **Media upload simulates with placeholders** | 🎨 | `Step4MediaUpload` — `handleUploadClick()` cycles through placeholder image URLs instead of accepting real file uploads. No `<input type="file">`. |
| 3.2 | **"Add Virtual Tour" sets fake URL** | 🎨 | Step 4 — sets `'https://example.com/tour'` as the virtual tour URL. No real 360° tour integration. |
| 3.3 | **"Add Another" landmark button unwired** | 🔧 | `Step2ProjectDetails` line 237 — "Add Another" landmark button has no `onClick` handler. |
| 3.4 | **Submit is a no-op** | 🔌 | `Step5Review` calls `store.submitProject()` which inserts a fake object into local state after 1500 ms. No API call. |
| 3.5 | **`virtualTourUrl` unused in Step 4** | 🔧 | `Step4MediaUpload.tsx` line 16 — destructured from store but never read. |

---

## 4. Project Detail (`/dashboard/developer/projects/[id]`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 4.1 | **Ignores route param — always shows same project** | 🔌 | `MOCK_PROJECT` is hardcoded inline. Route param `id` is never used to fetch project-specific data. |
| 4.2 | **"Virtual Tour" button unwired** | 🎨 | Play icon button has no `onClick` handler. No tour route exists for developer projects. |
| 4.3 | **"Download" button unwired** | 🔧 | Document download button in the Documents tab has no `onClick` handler. |

---

## 5. Calendar (`/dashboard/developer/calendar`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 5.1 | **Events are hardcoded** | 🔌 | `fetchEventsMock()` always returns events on the 14th, 16th, and 21st of the current month, regardless of navigation. |
| 5.2 | **Availability save is a no-op** | 🔌 | `saveAvailabilityMock()` discards the payload after 800 ms. |
| 5.3 | **Availability modal dates/times are hardcoded** | 🔧 | Date options are static strings ("August 14, 16, 21"). Should be dynamic from the current month. |
| 5.4 | **No create/edit event flow** | 🎨 | Clicking a day cell or existing event does nothing. No event creation modal. |
| 5.5 | **Reuses agent calendar components** | 🔧 | Developer calendar page imports agent-specific components unchanged. No developer-specific UI. |

---

## 6. Documents (`/dashboard/developer/documents`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 6.1 | **All 7 mock documents are identical** | 🔌 | `fetchDocumentsListMock()` returns 7 copies of "Victoria Island Apartment Rental Agreement". |
| 6.2 | **Document creation is a no-op** | 🎨 | `createDocumentMock()` collects 24 fields then appends a fake object locally after 1500 ms. No PDF generated. |
| 6.3 | **Manual upload drag-drop unwired** | 🎨 | Drop zone in the wizard has no `onDrop`/`onDragOver` listeners and no `<input type="file">`. |
| 6.4 | **View/Edit actions non-functional** | 🎨 | View and Edit buttons on document list items have no handlers. |
| 6.5 | **Delete is local-only** | 🔌 | `deleteDocumentMock()` removes from local state after 400 ms. No backend call. |
| 6.6 | **Reuses agent document components** | 🔧 | Developer documents page imports agent-specific components unchanged. |

---

## 7. Messages (`/dashboard/developer/messages`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 7.1 | **Message send is mocked** | 🔌 | `sendMessageMock()` appends to local state after 600 ms. No API. |
| 7.2 | **Only 5 hardcoded threads** | 🔌 | `generateMockThreads()` creates `chat_1` – `chat_5` every session. No persistence. |
| 7.3 | **File upload modals UI-only** | 🎨 | `UploadMediaModal` and `UploadDocumentModal` — no actual upload. `setStagedFiles()` manages display state only. |
| 7.4 | **Inbox search display-only** | 🔧 | Search bar renders but does not filter threads. |
| 7.5 | **No real-time updates** | 🎨 | No WebSocket/polling. Messages from other participants never appear. |
| 7.6 | **Reuses agent messaging components** | 🔧 | Developer messages page imports agent-specific components unchanged. |

---

## 8. Transactions (`/dashboard/developer/transactions`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 8.1 | **All 12 mock transactions have cloned data** | 🔌 | `useDeveloperTransactionsStore.ts` — 12 hardcoded transactions. |
| 8.2 | **Accept/Decline/Upload actions are mocked** | 🔌 | All use 800 ms setTimeout. State updates are local only. |
| 8.3 | **Upload milestone docs — no actual upload** | 🎨 | `uploadMilestoneDocsMock()` waits 800 ms and updates status locally. No file is uploaded. |
| 8.4 | **Pagination capped at 6 pages** | 🔧 | `Math.min(totalPages, 6)` limits page buttons. "Page X of Y" calculated but truncated. |
| 8.5 | **`buildMilestones()` helper is artificial** | 🔌 | Constructs milestone states from mock data rather than real transaction history. |

---

## 9. Transaction Detail (`/dashboard/developer/transactions/[id]`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 9.1 | **"Chat Client" button unwired** | 🎨 | Button renders but has no `onClick` handler. Should open messaging with client. |
| 9.2 | **"Report Transaction" button unwired** | 🎨 | Button renders but has no `onClick` handler. Should open dispute form. |
| 9.3 | **Ignores route param** | 🔌 | `fetchTransactionByIdMock(id)` searches the local mock array rather than fetching from backend. |

---

## 10. Wallet (`/dashboard/developer/wallet`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 10.1 | **Balance is hardcoded** | 🔌 | `walletBalance: 25,000,000` and `escrowBalance: 0` are Zustand initial state. Not fetched from API. |
| 10.2 | **All wallet operations are mocked** | 🔌 | `fetchLedgerMock()`, `processWithdrawalMock()`, `updateFiatDetailsMock()` all use setTimeout. |
| 10.3 | **Ledger has 5 identical transactions** | 🔌 | All dated "15 Dec, 2023", all ₦24,000.00. |
| 10.4 | **Withdrawal always succeeds** | 🔌 | `processWithdrawalMock()` never validates balance or rejects. |
| 10.5 | **Deposit modal collects nothing** | 🔌 | `FundDepositModal` has no submission handler wired to a payment gateway. |
| 10.6 | **Wallet history pagination display-only** | 🔧 | Numbers 1–6, prev/next chevrons — no `onClick` handlers. "Page 1 of 30" hardcoded. |
| 10.7 | **Settings gear is `console.log`** | 🔧 | `WalletOverviewCard` settings button calls `console.log('Settings triggered')`. |

---

## 11. Settings (`/dashboard/developer/settings`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 11.1 | **Reuses agent settings components** | 🔧 | Developer settings page imports all forms from `components/dashboard/agent/settings/forms/`. No developer-specific settings. |
| 11.2 | **All form submissions are no-ops** | 🔌 | All `submit*Mock()` functions in `useSettingsStore.ts` wait 1200 ms and update local state only. |
| 11.3 | **Avatar upload is preview-only** | 🎨 | `URL.createObjectURL()` for local preview; comment says "When backend is integrated: upload file". |

---

## 12. Cross-Cutting

| # | Item | Type | Notes |
|---|------|------|-------|
| 12.1 | **No auth guard on `/dashboard/developer`** | 🔧 | Any visitor can access all developer routes. |
| 12.2 | **Auth state lost on refresh** | 🔧 | `useAuthStore` is in-memory. Add `persist` middleware or cookies. |
| 12.3 | **Mock functions never reject** | 🔧 | No simulated failures. Error-state UI can't be tested or previewed. |
| 12.4 | **Calendar/Documents/Messages/Settings all reuse agent components** | 🔧 | Four entire sections share agent dashboard components with no developer-specific customisation. |

---

## Summary Counts

| Section | Total | 🔌 Backend | 🎨 UI+Backend | 🔧 Wiring |
|---------|-------|-----------|--------------|----------|
| Main Dashboard | 8 | 3 | 0 | 5 |
| Projects List | 5 | 1 | 0 | 4 |
| Creation Wizard | 5 | 1 | 3 | 1 |
| Project Detail | 3 | 1 | 1 | 1 |
| Calendar | 5 | 2 | 1 | 2 |
| Documents | 6 | 2 | 2 | 2 |
| Messages | 6 | 2 | 2 | 2 |
| Transactions | 5 | 3 | 1 | 1 |
| Transaction Detail | 3 | 1 | 2 | 0 |
| Wallet | 7 | 4 | 0 | 3 |
| Settings | 3 | 1 | 1 | 1 |
| Cross-cutting | 4 | 0 | 0 | 4 |
| **Total** | **60** | **21** | **13** | **26** |
