# AGENTTODO.md — Agent Dashboard: Incomplete & Stub Inventory

> Tracks every unimplemented interaction, logic gap, and placeholder in the agent dashboard.
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

## 1. Main Dashboard (`/dashboard/agent`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 1.1 | **Dev-only controls in production** | 🔧 | ✅ | `process.env.NODE_ENV === 'development'` guard already wraps the Demo Controls block. |
| 1.2 | **KYC always succeeds** | 🔌 | ⬜ | `mockSubmitKycForVerification()` always resolves verified. Real BVN/ID checks need backend. |
| 1.3 | **KYC progress is cosmetic** | 🔧 | ⬜ | Progress jumps 20% per step regardless of data entered. Needs backend validation status. |
| 1.4 | **Stats cards only appear post-KYC** | 🔌 | ⬜ | `fetchDashboardData()` loads mock stats. Needs real API payload. |
| 1.5 | **Revenue chart data is static** | 🔌 | ⬜ | `useAgentDashboardStore.revenueData` is hardcoded. |
| 1.6 | **Recent-transactions table is static** | 🔌 | ⬜ | Same 3 mock rows every session. |

---

## 2. Properties (`/dashboard/agent/properties`)

### List Page

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 2.1 | **Pagination is display-only** | 🔧 | ✅ | Real `currentPage` state, `ITEMS_PER_PAGE=12`, slice-based pagination, working buttons. |
| 2.2 | **Search is client-side only** | 🔌 | ⬜ | 300 ms debounce filters 3 mock properties. Backend search needed for scale. |
| 2.3 | **Only 3 mock properties** | 🔌 | ⬜ | `fetchProperties()` loads 3 mock items. |
| 2.4 | **Edit flow not implemented** | 🎨 | ⬜ | Edit button exists; `loadPropertyForEdit()` wired, but no pre-filled wizard logic. |

### Property Detail Page

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 2.5 | **Virtual Tour button unwired** | 🎨 | ⬜ | No tour route for agent-owned properties. |
| 2.6 | **Documents tab is hardcoded** | 🔌 | ⬜ | `MOCK_DOCUMENTS` defined inline. |
| 2.7 | **Landmarks tab is hardcoded** | 🔌 | ⬜ | `MOCK_LANDMARKS` not tied to property location. |
| 2.8 | **Document download buttons unwired** | 🔧 | ⬜ | Download buttons in Documents tab have no `onClick`. |

---

## 3. Property Creation Wizard (5-Step)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 3.1 | **Media upload stores URLs, not files** | 🎨 | ⬜ | `Step3MediaUpload.tsx` — no `<input type="file">` uploads actual files. |
| 3.2 | **Submit is a no-op** | 🔌 | ⬜ | `submitProperty()` injects a fake property locally. No API call. |
| 3.3 | **Floor plan upload missing** | 🎨 | ⬜ | Step 3 UI shows floor plan slot but no file-input handler. |
| 3.4 | **Video upload missing** | 🎨 | ⬜ | Video slot shown but not wired to upload handler. |
| 3.5 | **`editingPropertyId` unused** | 🔧 | ⬜ | `Step5Review.tsx` — destructured but not consumed. Edit flow is prerequisite. |

---

## 4. Messages (`/dashboard/agent/messages`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 4.1 | **Message send is mocked** | 🔌 | ⬜ | `sendMessageMock()` appends to local state. No API. |
| 4.2 | **Only 5 hardcoded threads** | 🔌 | ⬜ | `generateMockThreads()` creates `chat_1`–`chat_5`. |
| 4.3 | **Phone/video call button unwired** | 🎨 | ✅ | `ChatWindow.tsx` — call buttons now show "coming soon" alert with participant name. |
| 4.4 | **File upload modal — UI only** | 🎨 | ⬜ | `setStagedFiles()` manages display state only. No file is uploaded. |
| 4.5 | **Inbox search is display-only** | 🔧 | ✅ | `InboxList.tsx` already filters threads by `searchQuery` from store — wired and working. |
| 4.6 | **No real-time updates** | 🎨 | ⬜ | No WebSocket/polling. |
| 4.7 | **Context panel `isMobileDetailOpen` unused** | 🔧 | ✅ | `ContextPanel.tsx` uses `isMobileContextOpen` from store correctly. No action needed. |

---

## 5. Calendar (`/dashboard/agent/calendar`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 5.1 | **Events are hardcoded** | 🔌 | ⬜ | `fetchEventsMock()` always returns 3 events on fixed dates. |
| 5.2 | **Availability save is a no-op** | 🔌 | ⬜ | `saveAvailabilityMock()` closes the modal. Payload discarded. |
| 5.3 | **Availability modal has hardcoded dates/times** | 🔧 | ⬜ | Dates "August 14, 16, 21" and times are hardcoded strings. |
| 5.4 | **Month navigation doesn't fetch new data** | 🔌 | ⬜ | `fetchEventsMock()` always returns the same 3 events. |
| 5.5 | **Create/edit event flow missing** | 🎨 | ⬜ | Clicking a day cell or event does nothing. |

---

## 6. Documents (`/dashboard/agent/documents`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 6.1 | **All 7 mock documents are identical** | 🔌 | ⬜ | `fetchDocumentsListMock()` returns 7 copies of the same agreement. |
| 6.2 | **Document creation generates nothing** | 🎨 | ⬜ | `createDocumentMock()` appends a fake document to local state. No PDF generated. |
| 6.3 | **Manual upload drag-drop unwired** | 🎨 | ✅ | `Step1_ChooseType.tsx` — `<input type="file">` added; drag-and-drop handlers (onDrop, onDragOver, onDragLeave) wired; staged file name/size preview. |
| 6.4 | **View action non-functional** | 🎨 | ✅ | Eye button opens `DocumentPreviewModal` with metadata and download option (generates `.txt`). |
| 6.5 | **Edit action non-functional** | 🎨 | ✅ | Shows "Edit requires backend integration" alert. |
| 6.6 | **Delete is local-only** | 🔌 | ⬜ | `deleteDocumentMock()` removes from local state. |
| 6.7 | **`DocumentItem` type imported but unused** | 🔧 | ✅ | Removed unused import from `DocumentsList.tsx`. |

---

## 7. Wallet (`/dashboard/agent/wallet`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 7.1 | **All transactions are identical** | 🔌 | ⬜ | `fetchLedgerMock()` returns 5 identical entries. |
| 7.2 | **Withdrawal always succeeds** | 🔌 | ⬜ | `processWithdrawalMock()` shows success regardless of balance. |
| 7.3 | **Bank details update is a no-op** | 🔌 | ⬜ | `updateFiatDetailsMock()` validates locally. Nothing saved. |
| 7.4 | **Deposit modal collects nothing** | 🔌 | ✅ | `FundDepositModal` — copy button wired (clipboard API + fallback); Flutterwave/Paystack show "coming soon" alerts. |
| 7.5 | **Transaction history pagination display-only** | 🔧 | ✅ | Fixed in `TransactionHistory.tsx` — real `currentPage` state, working buttons. |
| 7.6 | **Wallet overview settings button `console.log`** | 🔧 | ✅ | `WalletOverviewCard.tsx` — navigates to settings based on pathname. |
| 7.7 | **Crypto withdrawal not implemented** | 🎨 | ⬜ | UI for USDT/BTC/ETH exists but no crypto-specific routing. |

---

## 8. Settings (`/dashboard/agent/settings`)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 8.1 | **All form submissions are no-ops** | 🔌 | ⬜ | All `submit*Mock()` update local state only. |
| 8.2 | **Avatar upload preview-only** | 🎨 | ⬜ | `URL.createObjectURL()` for local preview. No backend upload. |
| 8.3 | **Password/PIN change is cosmetic** | 🔌 | ⬜ | `submitSecurityMock()` clears the form but sets no actual credential. |
| 8.4 | **Help ticket never submitted** | 🔌 | ⬜ | `submitHelpTicketMock()` resets form. No ticket created. |
| 8.5 | **Subscription plan selection is UI-only** | 🎨 | ✅ | `SubscriptionSettings.tsx` — "Subscribe" buttons now open `ConfirmModal` with plan name/price, loading state, and success confirmation. `activePlan` state tracks selected plan. |
| 8.6 | **Commission settings save locally only** | 🔌 | ⬜ | Updates `useSettingsStore` state. Not persisted. |
| 8.7 | **`firstName`, `lastName`, `displayName`, `phone` unused** | 🔧 | ⬜ | `ProfileSettings.tsx` — destructured from store but form uses local state. Store sync is incomplete. |
| 8.8 | **AddAccountModal — limited functionality** | 🎨 | ⬜ | No real multi-account support. |

---

## 9. KYC Modal (5 Steps)

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 9.1 | **Step 1 — Personal Info: no validation** | 🔌 | ⬜ | No server-side validation or duplication check. |
| 9.2 | **Step 2 — Phone Verify: OTP is fake** | 🎨 | ⬜ | No SMS sent. Any 6-digit code advances step. |
| 9.3 | **Step 3 — ID Verification: upload is UI-only** | 🎨 | ⬜ | No OCR or government ID check. |
| 9.4 | **Step 4 — Face Match: no biometrics** | 🎨 | ⬜ | No camera access or facial recognition API. Uses `<img>` (linter flag). |
| 9.5 | **Step 5 — Payment Details: not saved** | 🔌 | ⬜ | `mockSubmitKycForVerification()` ignores payment fields. |
| 9.6 | **KYC always resolves verified** | 🔌 | ⬜ | No failure path. `ValidationResult` always shows success. |

---

## 10. Cross-Cutting Issues

| # | Item | Type | Status | Notes |
|---|------|------|--------|-------|
| 10.1 | **No auth guard on dashboard routes** | 🔧 | ✅ | `src/middleware.ts` guards all `/dashboard/*` routes via `irealty-session` cookie. |
| 10.2 | **Auth state lost on refresh** | 🔧 | ✅ | `useAuthStore` uses Zustand `persist` with `localStorage` + cookie rehydration. |
| 10.3 | **No error boundaries** | 🔧 | ⬜ | No `<ErrorBoundary>` on dashboard pages. A render error crashes the full page. |
| 10.4 | **Mock functions never reject** | 🔧 | ✅ | `useAgentDashboardStore`, `useAgentPropertiesStore`, `useDocumentsStore`, `useMessagesStore` already have `try/catch`. |
| 10.5 | **Google OAuth shows `alert("Coming Soon")`** | 🎨 | ⬜ | Login and signup pages — Google button calls `alert()`. |
| 10.6 | **`console.log` in production handlers** | 🔧 | ✅ | `ChatWindow.tsx` call buttons now show "coming soon" alert. `WalletOverviewCard.tsx` navigates to settings. |
| 10.7 | **No loading skeletons on several pages** | 🎨 | ⬜ | Calendar, Documents, Wallet show content immediately from mock. |
| 10.8 | **Pagination boilerplate repeated** | 🔧 | ✅ | Wallet history, agent properties, and document list all now have working state-driven pagination. Shared `TransactionHistory` component reused. |

---

## Summary Counts

| Section | Total | 🔌 Backend | 🎨 UI+Backend | 🔧 Wiring | ✅ Done |
|---------|-------|-----------|--------------|----------|--------|
| Main Dashboard | 6 | 4 | 0 | 2 | 1 |
| Properties List | 4 | 2 | 1 | 1 | 1 |
| Property Detail | 4 | 2 | 1 | 1 | 0 |
| Creation Wizard | 5 | 1 | 3 | 1 | 0 |
| Messages | 7 | 2 | 3 | 2 | 3 |
| Calendar | 5 | 3 | 1 | 1 | 0 |
| Documents | 7 | 3 | 3 | 1 | 4 |
| Wallet | 7 | 4 | 1 | 2 | 3 |
| Settings | 8 | 5 | 2 | 1 | 1 |
| KYC | 6 | 3 | 3 | 0 | 0 |
| Cross-cutting | 8 | 0 | 2 | 6 | 5 |
| **Total** | **67** | **29** | **20** | **18** | **18** |
