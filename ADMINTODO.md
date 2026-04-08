# ADMINTODO.md — Admin Dashboard: Incomplete & Stub Inventory

> Tracks every unimplemented interaction, logic gap, and placeholder in the admin dashboard.
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

## 1. Dashboard Overview (`/dashboard/admin`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 1.1 | **All data is mock** | 🔌 | `fetchDashboardDataMock()` uses 600 ms setTimeout. Stats, charts, and table data are hardcoded. |

---

## 2. Finance (`/dashboard/admin/finance`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 2.1 | **"This week" chart filter unwired** | 🔧 | Revenue chart filter button renders but has no `onClick` handler. Charts don't re-fetch on period change. |
| 2.2 | **Payout approve/reject — no toast** | 🔧 | `approvePayoutMock()` / `rejectPayoutMock()` succeed silently. No success/error notification shown to admin. |
| 2.3 | **All finance data is mock** | 🔌 | `fetchFinanceMock()` returns hardcoded payout and revenue data with 500 ms delay. |

---

## 3. Messages / Support Tickets (`/dashboard/admin/messages`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 3.1 | **Broadcast send is mocked** | 🔌 | `BroadcastModal` — send button waits 1200 ms then shows success. No actual broadcast delivered. Recipient role selection has no backend validation. |
| 3.2 | **Reply/resolve/escalate/reopen are mocked** | 🔌 | `AdminChatWindow` — all four thread actions use `setTimeout`. No backend persistence. |
| 3.3 | **Thread status auto-changes on first reply** | 🔧 | Status flips from "Open" → "In Progress" automatically on `sendReplyMock()`. Should be an explicit admin action, not automatic. |
| 3.4 | **Only 6 hardcoded tickets** | 🔌 | `MOCK_THREADS` in `useAdminMessagesStore.ts` — static support tickets, not fetched from a real queue. |
| 3.5 | **Search/filter is client-side only** | 🔌 | `AdminInboxList` — filtering runs on the 6 loaded mock threads. No server-side search pagination. |
| 3.6 | **`isMobileDetailOpen` unused** | 🔧 | `AdminContextPanel.tsx` line 23 — prop destructured but never read. Mobile context panel toggle is broken. |
| 3.7 | **`ChevronDown` unused import** | 🔧 | `BroadcastModal.tsx` line 4 — imported but never used. |

---

## 4. Properties (`/dashboard/admin/properties`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 4.1 | **Reject reason is collected but ignored** | 🔧 | `RejectReasonModal` collects a textarea reason (line 47–52) but `handleReject()` discards it — reason never passed to `rejectPropertyMock()`. Wire `reason` parameter through. |
| 4.2 | **Approve/reject/flag are mocked** | 🔌 | All three property actions use `setTimeout` (600 ms). No backend calls. |
| 4.3 | **Bulk actions have no per-item feedback** | 🔧 | Bulk loops execute silently. No individual success/failure indicators or rollback if one action fails. |
| 4.4 | **Pagination capped at 6 pages** | 🔧 | `Math.min(totalPages, 6)` hardcoded — even if 30 pages exist, only 6 buttons render. Remove the cap. |
| 4.5 | **Mobile card missing columns** | 🔧 | Mobile property cards don't show Type, Category, or Price — present in desktop table only. |

---

## 5. Transactions (`/dashboard/admin/transactions`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 5.1 | **Flag/refund are mocked** | 🔌 | Both actions use `setTimeout`. No backend calls. |
| 5.2 | **CSV export — no success feedback** | 🔧 | `AuditTrailExport` calls `exportToCsv()` with no confirmation dialog or toast. User has no indication it succeeded. |
| 5.3 | **Pagination capped at 6 pages** | 🔧 | Same `Math.min(totalPages, 6)` pattern as properties page. |
| 5.4 | **Bulk action loop — no rollback** | 🔧 | Bulk flag/refund loops have no error handling. A mid-loop failure leaves state partially updated. |

---

## 6. Transaction Detail (`/dashboard/admin/transactions/[id]`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 6.1 | **"Message" buttons for both parties unwired** | 🎨 | Two "Message" buttons (Party A and Party B) have no `onClick` handlers. Should open AdminChatWindow or start a thread. |
| 6.2 | **Flag and refund — no toast** | 🔧 | Both actions complete silently after mock delay. No user feedback. |

---

## 7. Users (`/dashboard/admin/users`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 7.1 | **All user data is mock** | 🔌 | `fetchUsersMock()` returns hardcoded user list with 500 ms delay. |
| 7.2 | **Pagination capped at 6 pages** | 🔧 | Same pattern — `Math.min(totalPages, 6)`. |
| 7.3 | **Bulk actions — no per-item feedback** | 🔧 | Same issue as properties bulk actions. |

---

## 8. User Detail (`/dashboard/admin/users/[id]`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 8.1 | **KYC reject reason collected but ignored** | 🔧 | `KycRejectModal` textarea (line 37–42) — reason is never passed to `rejectKycMock()`. Same pattern as property reject. |
| 8.2 | **All user actions are mocked** | 🔌 | `approveKycMock`, `rejectKycMock`, `suspendUserMock`, `reactivateUserMock` — all use `setTimeout` (600 ms). |
| 8.3 | **No confirmation dialog after KYC rejection** | 🔧 | Rejection happens immediately on click. Should confirm before acting. |

---

## 9. Settings (`/dashboard/admin/settings`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 9.1 | **Avatar upload is preview-only** | 🎨 | `AdminProfileSettings` — `URL.createObjectURL()` used for local preview. No upload endpoint. |
| 9.2 | **Phone country-code selector unwired** | 🔧 | Dropdown trigger (ChevronDown) has no `onClick` handler — can't change country code. |
| 9.3 | **Profile save is a no-op** | 🔌 | `submitProfileMock()` waits 1200 ms, updates local state only. |
| 9.4 | **Platform fees save — no toast** | 🔧 | `AdminPlatformFees` form validates but provides no success notification after saving. |
| 9.5 | **Platform fees initial state not persisted** | 🔌 | Fees hardcoded as Zustand initial state (line 317 in store). Resets on refresh. |
| 9.6 | **Password/PIN change is cosmetic** | 🔌 | `submitSecurityMock('password')` / `submitSecurityMock('pin')` clear the form but set no real credential. |
| 9.7 | **Help ticket never submitted** | 🔌 | `AdminHelpCenter` — `submitHelpTicketMock()` resets form. No ticket created. |
| 9.8 | **Username field hardcoded** | 🔧 | `AdminHelpCenter` — username field is read-only with hardcoded value. Should pull from auth store. |

---

## 10. Cross-Cutting Store Issues

| # | Item | Type | Notes |
|---|------|------|-------|
| 10.1 | **32+ mock functions, zero real API calls** | 🔌 | Every action in `useAdminDashboardStore.ts` and `useAdminMessagesStore.ts` uses `setTimeout`. See store files for full list. |
| 10.2 | **`get` unused in two stores** | 🔧 | `useAdminDashboardStore.ts` line 283 and `useAdminMessagesStore.ts` line 332 — `get` is destructured but never called. |
| 10.3 | **No auth guard on `/dashboard/admin`** | 🔧 | Any visitor can access all admin routes. Add middleware or layout-level role check. |

---

## Summary Counts

| Section | Total | 🔌 Backend | 🎨 UI+Backend | 🔧 Wiring |
|---------|-------|-----------|--------------|----------|
| Overview | 1 | 1 | 0 | 0 |
| Finance | 3 | 1 | 0 | 2 |
| Messages | 7 | 3 | 0 | 4 |
| Properties | 5 | 1 | 0 | 4 |
| Transactions | 4 | 1 | 0 | 3 |
| Transaction Detail | 2 | 0 | 1 | 1 |
| Users | 3 | 1 | 0 | 2 |
| User Detail | 3 | 1 | 0 | 2 |
| Settings | 8 | 4 | 1 | 3 |
| Cross-cutting | 3 | 1 | 0 | 2 |
| **Total** | **39** | **14** | **2** | **23** |
