# AGENTTODO.md — Agent Dashboard: Incomplete & Stub Inventory

> Tracks every unimplemented interaction, logic gap, and placeholder in the agent dashboard.
> Items are organized by section, then severity. "Stubbed" means there is a mock with `setTimeout`;
> "Wired" means the UI element exists but no handler is attached at all.
>
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

## 1. Main Dashboard (`/dashboard/agent`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 1.1 | **Dev-only controls in production** | 🔧 | "Skip KYC", "Reset Dashboard", "Setup Inspection Config" buttons render in all environments. Guard with `process.env.NODE_ENV === 'development'` or remove. |
| 1.2 | **KYC always succeeds** | 🔌 | `mockSubmitKycForVerification()` in `useAgentDashboardStore.ts` resolves after 1500 ms and always marks KYC as verified. Real BVN/ID/face checks need a backend. |
| 1.3 | **KYC progress is cosmetic** | 🔧 | Progress jumps 20% per step regardless of what data was entered. Should reflect actual step completion and backend validation status. |
| 1.4 | **Stats cards only appear post-KYC** | 🔌 | `fetchDashboardData()` loads mock stats (listings, deals, tours). Needs real API payload. |
| 1.5 | **Revenue chart data is static** | 🔌 | `useAgentDashboardStore.revenueData` contains hardcoded bars. Should be fetched per period. |
| 1.6 | **Recent-transactions table is static** | 🔌 | Same 3 mock rows every session. |

---

## 2. Properties (`/dashboard/agent/properties`)

### List Page

| # | Item | Type | Notes |
|---|------|------|-------|
| 2.1 | **Pagination is display-only** | 🔧 | Buttons "1 2 3 … next/prev" render but have no `onClick` handlers. `Page 1 of 10` is hardcoded. Wire to `useAgentPropertiesStore` page state. |
| 2.2 | **Search is client-side only** | 🔌 | 300 ms debounce filters the 3 loaded mock properties. Backend search needed for scale. |
| 2.3 | **Only 3 mock properties** | 🔌 | `mockAgentProperties` in `useAgentPropertiesStore.ts` has 3 items. `fetchProperties()` loads them with an 800 ms delay. |
| 2.4 | **Edit flow not implemented** | 🎨 | Delete exists (mock). Edit button exists but no edit route or pre-filled wizard. |

### Property Detail Page (`/properties/[id]`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 2.5 | **Virtual Tour button unwired** | 🎨 | Button renders with a red play icon but has no `onClick` handler. No tour route exists for agent-owned properties. |
| 2.6 | **Documents tab is hardcoded** | 🔌 | `MOCK_DOCUMENTS` (4 items, all the same title) is defined inline. "Download" buttons have no handlers. |
| 2.7 | **Landmarks tab is hardcoded** | 🔌 | `MOCK_LANDMARKS` (4 items) defined inline, not tied to the property's real location. |
| 2.8 | **Document download buttons unwired** | 🔧 | All download `<button>` elements inside the Documents tab have no `onClick`. |

---

## 3. Property Creation Wizard (5-Step)

| # | Item | Type | Notes |
|---|------|------|-------|
| 3.1 | **Media upload stores URLs, not files** | 🎨 | `Step3MediaUpload.tsx` — `addMedia()` expects a URL string. No `<input type="file">` or drag-drop handler uploads an actual file to storage. |
| 3.2 | **Submit is a no-op** | 🔌 | `submitProperty()` in `useCreatePropertyStore.ts` waits 1500 ms then injects a fake property into `useAgentPropertiesStore`. No API call. |
| 3.3 | **Floor plan upload missing** | 🎨 | Step 3 UI shows a floor plan slot but no file-input handler. |
| 3.4 | **Video upload missing** | 🎨 | Video slot shown in Step 3 but not wired to any upload handler. |
| 3.5 | **`editingPropertyId` unused** | 🔧 | `Step5Review.tsx` line 18 — `editingPropertyId` and `closeWizard` are destructured but never used. Edit flow is prerequisite. |

---

## 4. Messages (`/dashboard/agent/messages`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 4.1 | **Message send is mocked** | 🔌 | `sendMessageMock()` appends message to local state after 600 ms. No API. |
| 4.2 | **Only 5 hardcoded threads** | 🔌 | `generateMockThreads()` creates `chat_1` – `chat_5` every session. No persistence. |
| 4.3 | **Phone/video call button unwired** | 🎨 | `ChatWindow.tsx` — call buttons render but have no `onClick` handler (or only a `console.log`). |
| 4.4 | **File upload modal — UI only** | 🎨 | `UploadMediaModal` and `UploadDocumentModal` exist and can be opened, but no file is ever uploaded. `setStagedFiles()` manages display state only. |
| 4.5 | **Inbox search is display-only** | 🔧 | Search bar in `InboxList.tsx` renders but does not filter threads. |
| 4.6 | **No real-time updates** | 🎨 | No WebSocket / polling. New messages from other participants never appear. |
| 4.7 | **Context panel `isMobileDetailOpen` unused** | 🔧 | `ContextPanel.tsx` line 5 — prop destructured but never read. Mobile context panel toggle is broken. |

---

## 5. Calendar (`/dashboard/agent/calendar`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 5.1 | **Events are hardcoded** | 🔌 | `fetchEventsMock()` always returns 3 events on the 14th, 16th, and 21st of the current month regardless of navigation. |
| 5.2 | **Availability save is a no-op** | 🔌 | `saveAvailabilityMock()` waits 800 ms then closes the modal. Payload is discarded. |
| 5.3 | **Availability modal has hardcoded dates/times** | 🔧 | `SetupAvailabilityModal.tsx` — date options are "August 14, 16, 21" (hardcoded strings). Time slots include "1am – 4pm" (unrealistic). Should be dynamic. |
| 5.4 | **Month navigation doesn't fetch new data** | 🔌 | Clicking prev/next month calls `fetchEventsMock()` again, but events are always the same static 3. |
| 5.5 | **Create/edit event flow missing** | 🎨 | Clicking a day cell or existing event does nothing. No event creation or edit modal. |

---

## 6. Documents (`/dashboard/agent/documents`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 6.1 | **All 7 mock documents are identical** | 🔌 | `fetchDocumentsListMock()` returns 7 copies of "Victoria Island Apartment Rental Agreement". |
| 6.2 | **Document creation generates nothing** | 🎨 | `createDocumentMock()` collects 24 form fields then appends a fake document to local state after 1500 ms. No PDF or document is generated. |
| 6.3 | **Manual upload drag-drop unwired** | 🎨 | `Step1_ChooseType.tsx` — the drag-drop zone has no `onDrop` / `onDragOver` event listeners. No `<input type="file">` present. |
| 6.4 | **View action non-functional** | 🎨 | "View" button on document list items has no handler — no preview modal or route. |
| 6.5 | **Edit action non-functional** | 🎨 | "Edit" button on document list items has no handler. |
| 6.6 | **Delete is local-only** | 🔌 | `deleteDocumentMock()` removes from local state after 400 ms. No backend call. |
| 6.7 | **`DocumentItem` type imported but unused** | 🔧 | `DocumentsList.tsx` line 2 — unused import. |

---

## 7. Wallet (`/dashboard/agent/wallet`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 7.1 | **All transactions are identical** | 🔌 | `fetchLedgerMock()` returns 5 entries all dated "15 Dec, 2023", all ₦24,000.00. |
| 7.2 | **Withdrawal always succeeds** | 🔌 | `processWithdrawalMock()` waits 1500 ms and shows success regardless of balance. No balance check, no API. |
| 7.3 | **Bank details update is a no-op** | 🔌 | `updateFiatDetailsMock()` validates locally then returns to the withdraw modal. Nothing is saved. |
| 7.4 | **Deposit modal collects nothing** | 🔌 | `FundDepositModal` has no submit handler wired to a payment gateway. |
| 7.5 | **Transaction history pagination is display-only** | 🔧 | Numbers 1–6, prev/next chevrons render but have no `onClick` handlers. "Page 1 of 30" is hardcoded. |
| 7.6 | **Wallet overview settings button is a `console.log`** | 🔧 | `WalletOverviewCard.tsx` — settings gear `onClick` calls `console.log('Settings triggered')`. |
| 7.7 | **Crypto withdrawal not implemented** | 🎨 | UI for USDT/BTC/ETH wallet address exists in `ChangeWithdrawMethodModal` but no crypto-specific validation or routing. |

---

## 8. Settings (`/dashboard/agent/settings`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 8.1 | **All form submissions are no-ops** | 🔌 | `submitProfileMock`, `submitPayoutMock`, `submitSecurityMock`, `submitHelpTicketMock`, `submitCommissionMock` — all wait 1200 ms and update local state only. |
| 8.2 | **Avatar upload preview-only** | 🎨 | `ProfileSettings.tsx` — avatar `<input type="file">` uses `URL.createObjectURL()` for local preview. Comment: `// When backend is integrated: upload file`. Nothing is persisted. |
| 8.3 | **Password/PIN change is cosmetic** | 🔌 | `submitSecurityMock()` validates that new passwords match, clears the form, but sets no actual credential. |
| 8.4 | **Help ticket never submitted** | 🔌 | `submitHelpTicketMock()` resets form to defaults. No ticket is created or emailed. |
| 8.5 | **Subscription plan selection is UI-only** | 🎨 | Plan cards render but selecting one triggers no state change or payment flow. |
| 8.6 | **Commission settings save locally only** | 🔌 | Commission rate/type updates local `useSettingsStore` state. Not persisted. |
| 8.7 | **`firstName`, `lastName`, `displayName`, `phone` unused** | 🔧 | `ProfileSettings.tsx` lines 83–123 — four destructured store values are never read. Form uses local component state instead. Store sync is broken. |
| 8.8 | **AddAccountModal — limited functionality** | 🎨 | Account switching modal renders but has no real multi-account support. |

---

## 9. KYC Modal (5 Steps)

| # | Item | Type | Notes |
|---|------|------|-------|
| 9.1 | **Step 1 — Personal Info: no validation** | 🔌 | Form collects name/DOB/address but no server-side validation or duplication check. |
| 9.2 | **Step 2 — Phone Verify: OTP is fake** | 🎨 | OTP input renders but no SMS is sent. Any 6-digit code (or even empty) advances the step. |
| 9.3 | **Step 3 — ID Verification: upload is UI-only** | 🎨 | Document upload zone exists but no file actually leaves the browser. No OCR or government ID check. |
| 9.4 | **Step 4 — Face Match: no biometrics** | 🎨 | `StepFaceMatch.tsx` — shows a UI prompt (uses `<img>` instead of `next/image`, flagged by linter). No camera access, no facial recognition API. |
| 9.5 | **Step 5 — Payment Details: not saved** | 🔌 | Payment method fields collected but `mockSubmitKycForVerification()` ignores them. |
| 9.6 | **KYC always resolves verified** | 🔌 | `mockSubmitKycForVerification()` — no failure path; the `ValidationResult` component always shows success. |

---

## 10. Cross-Cutting Issues

| # | Item | Type | Notes |
|---|------|------|-------|
| 10.1 | **No auth guard on dashboard routes** | 🔧 | Any visitor can navigate to `/dashboard/agent/*`. No middleware or layout-level redirect. |
| 10.2 | **Auth state lost on refresh** | 🔧 | `useAuthStore` is in-memory only. Add `persist` middleware or cookie strategy. |
| 10.3 | **No error boundaries** | 🔧 | No `<ErrorBoundary>` on any dashboard page. A render error in one component crashes the full page. |
| 10.4 | **Mock functions never reject** | 🔧 | Every `*Mock()` function resolves unconditionally. Add simulated failure branches so error-state UI can be tested. |
| 10.5 | **Google OAuth shows `alert("Coming Soon")`** | 🎨 | Login and signup pages — Google button calls `alert()`. |
| 10.6 | **`console.log` in production handlers** | 🔧 | At least `ChatWindow.tsx` call button and `WalletOverviewCard.tsx` settings button. Remove or replace. |
| 10.7 | **No loading skeletons on several pages** | 🎨 | Calendar, Documents, Wallet show content immediately from mock; real API latency will cause flash of empty. |
| 10.8 | **Pagination boilerplate repeated** | 🔧 | Wallet history, properties list, and transactions page each have their own non-functional pagination markup. Should be a shared `<Pagination>` component wired to store. |

---

## Summary Counts

| Section | Total Items | Needs Backend (🔌) | Needs UI+Backend (🎨) | Logic/Wiring only (🔧) |
|---------|-------------|--------------------|-----------------------|------------------------|
| Main Dashboard | 6 | 4 | 0 | 2 |
| Properties List | 4 | 2 | 1 | 1 |
| Property Detail | 4 | 2 | 1 | 1 |
| Creation Wizard | 5 | 1 | 3 | 1 |
| Messages | 7 | 2 | 3 | 2 |
| Calendar | 5 | 3 | 1 | 1 |
| Documents | 7 | 3 | 3 | 1 |
| Wallet | 7 | 4 | 1 | 2 |
| Settings | 8 | 5 | 2 | 1 |
| KYC | 6 | 3 | 3 | 0 |
| Cross-cutting | 8 | 0 | 2 | 6 |
| **Total** | **67** | **29** | **20** | **18** |
