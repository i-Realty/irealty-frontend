# i-Realty Frontend — Backend Integration Plan

**Backend:** `https://api.i-realty.app` (production)
**Docs:** `apidocs.md` (116 endpoints)
**Toggle:** `NEXT_PUBLIC_USE_API=true` in `.env.local` (already enabled)
**Proxy:** `/api/*` → `https://api.i-realty.app/api/v1/*` via `next.config.ts` rewrites

---

## Integration Status Legend

| Symbol | Meaning |
|---|---|
| ✅ | Integrated and working |
| 🔄 | Partially integrated / needs update |
| ❌ | Not yet integrated |
| 🚫 | Not applicable (webhook / server-only) |

---

## Table of Contents

1. [Phase 1 — Auth & Session](#1-phase-1--auth--session)
2. [Phase 2 — Core User Flows](#2-phase-2--core-user-flows)
3. [Phase 3 — Transactions & Payments](#3-phase-3--transactions--payments)
4. [Phase 4 — Admin Dashboard](#4-phase-4--admin-dashboard)
5. [Phase 5 — Supporting Features](#5-phase-5--supporting-features)
6. [Phase 6 — New Endpoints (Production API)](#6-phase-6--new-endpoints-production-api)
7. [Adapter Layer Reference](#7-adapter-layer-reference)
8. [Field Mapping Reference](#8-field-mapping-reference)
9. [Remaining Questions](#9-remaining-questions)

---

## 1. Phase 1 — Auth & Session

### 1.1 Firebase Google Auth — `src/app/auth/login/page.tsx`, `src/app/auth/signup/account/page.tsx`

| Endpoint | Status | Notes |
|---|---|---|
| `POST /api/v1/auth/firebase` | 🔄 | Service created (`src/lib/services/firebase.ts`), button on login/signup pages still uses old `<a>` tag — needs wiring |

**Remaining work:**
- Replace `<a href="/api/auth/google">` with a `<button>` that calls `signInWithGoogle()` from `firebase.ts`
- Handle the returned `BackendAuthResponse` the same way login does (setToken → /me → login → redirect)
- Add Firebase env vars to `.env.local`:
  ```
  NEXT_PUBLIC_FIREBASE_API_KEY=
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=
  NEXT_PUBLIC_FIREBASE_APP_ID=
  ```
- Remove `src/app/auth/google/callback/page.tsx` (not needed with Firebase popup flow)

### 1.2 Email/Password Auth

| Endpoint | Status | Notes |
|---|---|---|
| `POST /api/v1/auth/register` | ✅ | Integrated |
| `POST /api/v1/auth/verify-email` | ✅ | Integrated |
| `POST /api/v1/auth/resend-verification` | ✅ | Integrated |
| `POST /api/v1/auth/login` | ✅ | Integrated — calls `/me` after for user data |
| `POST /api/v1/auth/refresh` | ✅ | Auto-refresh on 401 in `src/lib/api/client.ts` |
| `POST /api/v1/auth/logout` | ✅ | Integrated — fire-and-forget on `useAuthStore.logout()` |
| `GET /api/v1/auth/me` | ✅ | Used after login, switch-account, Firebase auth |
| `PATCH /api/v1/auth/me` | ✅ | Used by `useSettingsStore.submitProfile()` |

### 1.3 Password Reset

| Endpoint | Status | Notes |
|---|---|---|
| `POST /api/v1/auth/forgot-password` | ✅ | Integrated in `src/app/auth/reset/page.tsx` |
| `POST /api/v1/auth/verify-reset-otp` | ✅ | Integrated in `src/app/auth/reset/verify/page.tsx` |
| `POST /api/v1/auth/reset-password` | ✅ | Integrated in `src/app/auth/reset/success/page.tsx` |

### 1.4 Multi-Account

| Endpoint | Status | Notes |
|---|---|---|
| `GET /api/v1/auth/linked-accounts` | ✅ | `useSettingsStore.fetchAccounts()` — called on login + dashboard mount |
| `POST /api/v1/auth/linked-accounts` | ✅ | `useSettingsStore.addLinkedAccount()` |
| `POST /api/v1/auth/switch-account` | ✅ | Uses stored `mainToken` to always authenticate as main account; calls `/me` after for role |

---

## 2. Phase 2 — Core User Flows

### 2.1 Marketplace & Listings

| Endpoint | Status | Notes |
|---|---|---|
| `GET /api/v1/marketplace/search` | ✅ | `useMarketplaceStore.fetchListings()` |
| `GET /api/v1/marketplace/{id}` | ✅ | `useMarketplaceStore.fetchListing()` |
| `GET /api/v1/marketplace/amenities/{propertyType}` | ✅ | `useMarketplaceStore.fetchAmenities()` — used by AmenitiesModal with local fallback |
| `POST /api/v1/listings` | ✅ | `useAgentPropertiesStore.addProperty()` |
| `GET /api/v1/listings/mine` | ✅ | `useAgentPropertiesStore.fetchProperties()` |
| `GET /api/v1/listings/{id}` | ✅ | `useAgentPropertiesStore.getPropertyById()` |
| `PUT /api/v1/listings/{id}` | ✅ | `useAgentPropertiesStore.updateProperty()` |
| `DELETE /api/v1/listings/{id}` | ✅ | `useAgentPropertiesStore.deleteProperty()` |
| `PATCH /api/v1/listings/{id}/publish` | ✅ | `useAgentPropertiesStore.publishProperty()` |
| `POST /api/v1/listings/{id}/images` | ❌ | Planned — requires multipart upload |
| `DELETE /api/v1/listings/images/{imageId}` | ✅ | `useAgentPropertiesStore.deleteImage()` |
| `GET /api/v1/listings/liked` | ✅ | `useFavouritesStore` |
| `POST /api/v1/listings/{id}/like` | ✅ | `useFavouritesStore.toggleFavourite()` |
| `GET /api/v1/listings/{id}/share-link` | ✅ | `useAgentPropertiesStore.getShareLink()` |
| `GET /api/v1/listings/{id}/inspection-fee` | ✅ | `useAgentPropertiesStore.getInspectionFee()` |
| `PATCH /api/v1/listings/{id}/inspection-fee` | ✅ | `useAgentPropertiesStore.updateInspectionFee()` |
| `POST /api/v1/listings/{id}/report` | ✅ | `useAgentPropertiesStore.reportListing()` |

### 2.2 Messages

| Endpoint | Status | Notes |
|---|---|---|
| `GET /api/v1/messages/conversations` | ✅ | `useMessagesStore.fetchThreads()` |
| `POST /api/v1/messages/conversations` | ✅ | `useMessagesStore.startThread()` |
| `GET /api/v1/messages/conversations/{id}` | ❌ | Not yet used — threads fetched in bulk |
| `GET /api/v1/messages/conversations/{id}/messages` | ✅ | Fetched during `fetchThreads()` |
| `POST /api/v1/messages/conversations/{id}/messages` | ✅ | `useMessagesStore.sendMessage()` |
| `POST /api/v1/messages/conversations/{id}/read` | ✅ | `useMessagesStore.markThreadRead()` |
| `POST /api/v1/messages/pusher/auth` | ✅ | `src/lib/services/pusher.ts` authorizer |

### 2.3 Documents

| Endpoint | Status | Notes |
|---|---|---|
| `POST /api/v1/documents/upload` | ❌ | Multipart upload — not yet implemented |
| `POST /api/v1/documents` | ✅ | `useDocumentsStore.createDocument()` (when fileUrl present) |
| `GET /api/v1/documents` | ✅ | `useDocumentsStore.fetchDocumentsList()` |
| `GET /api/v1/documents/{id}` | ✅ | `useDocumentsStore.fetchDocumentById()` |
| `DELETE /api/v1/documents/{id}` | ✅ | `useDocumentsStore.deleteDocument()` |

### 2.4 Calendar

| Endpoint | Status | Notes |
|---|---|---|
| `GET /api/v1/calendar/availability` | ✅ | `useCalendarStore` |
| `PUT /api/v1/calendar/availability` | ✅ | `useCalendarStore` |
| `GET /api/v1/calendar/events` | ✅ | `useCalendarStore` |
| `POST /api/v1/calendar/events` | ✅ | `useCalendarStore` |
| `GET /api/v1/calendar/events/{id}` | ❌ | Individual event fetch not wired |
| `PATCH /api/v1/calendar/events/{id}` | ✅ | `useCalendarStore` |
| `DELETE /api/v1/calendar/events/{id}` | ✅ | `useCalendarStore` |

### 2.5 KYC

| Endpoint | Status | Notes |
|---|---|---|
| `GET /api/v1/kyc/status` | ❌ | Status endpoint not yet called on dashboard load |
| `POST /api/v1/kyc/personal-info` | ✅ | KYC Step 1 |
| `POST /api/v1/kyc/phone/send-otp` | ✅ | KYC Step 2a |
| `POST /api/v1/kyc/phone/verify-otp` | ✅ | KYC Step 2b |
| `POST /api/v1/kyc/id-verification` | ✅ | KYC Step 3 |
| `POST /api/v1/kyc/liveness/register-session` | ✅ | KYC Step 4 |
| `POST /api/v1/kyc/payment` | ✅ | KYC Step 5 |
| `GET /api/v1/kyc/phone/events` | ✅ | `src/lib/services/kycEvents.ts` SSE client |

**Remaining:** Call `GET /api/v1/kyc/status` on KYC modal open to resume from the correct step.

### 2.6 Agent Profile

| Endpoint | Status | Notes |
|---|---|---|
| `GET /api/v1/agents/profile` | ❌ | Not yet wired to settings page |
| `PUT /api/v1/agents/profile` | ❌ | `submitProfile()` uses `PATCH /auth/me` — needs role-based routing to use this for agents |
| `GET /api/v1/agents/{id}/profile` | ❌ | Public profile view not implemented |

### 2.7 Wallet

| Endpoint | Status | Notes |
|---|---|---|
| `GET /api/v1/wallet/balance` | ✅ | `useWalletStore` — amounts in kobo, divide by 100 |
| `GET /api/v1/wallet/virtual-account` | ✅ | `useWalletStore` |

### 2.8 Verifications

| Endpoint | Status | Notes |
|---|---|---|
| `POST /api/v1/verifications/bvn` | ✅ | Integrated |
| `POST /api/v1/verifications/id` | ✅ | Integrated |

---

## 3. Phase 3 — Transactions & Payments

### 3.1 Property Transactions

| Endpoint | Status | Notes |
|---|---|---|
| `GET /api/v1/property-transactions` | ✅ | `usePropertyTransactionsStore` |
| `GET /api/v1/property-transactions/{id}` | ✅ | `usePropertyTransactionsStore` |
| `POST /api/v1/property-transactions/{id}/accept` | ✅ | |
| `POST /api/v1/property-transactions/{id}/decline` | ✅ | |
| `POST /api/v1/property-transactions/{id}/confirm-tour` | ✅ | |
| `POST /api/v1/property-transactions/{id}/confirm-handover` | ✅ | |
| `POST /api/v1/property-transactions/{id}/confirm-completion` | ✅ | |
| `GET /api/v1/transactions` | ✅ | General ledger — `useTransactionLedger` |

### 3.2 Paystack

| Endpoint | Status | Notes |
|---|---|---|
| `GET /api/v1/paystack/banks` | ✅ | `usePaystackStore` |
| `GET /api/v1/paystack/banks/resolve` | ✅ | `usePaystackStore` |
| `POST /api/v1/paystack/charge/card` | ✅ | `usePaystackStore` |
| `POST /api/v1/paystack/charge/bank` | ✅ | `usePaystackStore` |
| `POST /api/v1/paystack/transfer/recipient` | ✅ | `usePaystackStore` + payout settings |
| `POST /api/v1/paystack/withdraw` | ✅ | `useWalletStore` |
| `POST /api/v1/webhooks/paystack` | 🚫 | Server-to-server only |
| `POST /api/v1/webhooks/qoreid` | 🚫 | Server-to-server only |

---

## 4. Phase 4 — Admin Dashboard

### 4.1 User Management

| Endpoint | Status | Notes |
|---|---|---|
| `GET /api/v1/admin/users` | ✅ | `useAdminDashboardStore.fetchUsers()` |
| `GET /api/v1/admin/users/{id}` | ✅ | `useAdminDashboardStore.fetchUserById()` |
| `PATCH /api/v1/admin/users/{id}/suspend` | ✅ | `suspendUser()` |
| `PATCH /api/v1/admin/users/{id}/revoke` | ✅ | `revokeUser()` |
| `PATCH /api/v1/admin/users/{id}/reactivate` | ✅ | `reactivateUser()` |

### 4.2 Admin Management

| Endpoint | Status | Notes |
|---|---|---|
| `GET /api/v1/admin/admins` | ❌ | Planned — admin management page |
| `POST /api/v1/admin/admins` | ❌ | Planned — create new admin |
| `GET /api/v1/admin/admins/pending` | ❌ | Planned |
| `PATCH /api/v1/admin/admins/{id}/approve` | ❌ | Planned |
| `PATCH /api/v1/admin/admins/{id}/suspend` | ✅ | `useAdminDashboardStore.suspendAdmin()` |
| `PATCH /api/v1/admin/admins/{id}/revoke` | ✅ | `useAdminDashboardStore.revokeAdmin()` |
| `GET /api/v1/admin/audit-logs` | ❌ | Audit log viewer page not yet built |

### 4.3 Admin Dashboard Stats *(new production endpoints)*

| Endpoint | Status | Notes |
|---|---|---|
| `GET /api/v1/admin/dashboard/stats` | ❌ | `fetchDashboardData()` currently calls `/api/admin/dashboard` — **wrong path** |
| `GET /api/v1/admin/dashboard/recent-transactions` | ❌ | Not integrated — fetched via property-transactions fallback |
| `GET /api/v1/admin/dashboard/pending-kyc` | ❌ | Not integrated |

**Fix needed:** Update `useAdminDashboardStore.fetchDashboardData()`:
```typescript
// Replace:
apiGet(`/api/admin/dashboard?period=${period}`)
// With three separate calls:
const stats   = await apiGet('/api/admin/dashboard/stats');
const recentTx = await apiGet('/api/admin/dashboard/recent-transactions');
const pendingKyc = await apiGet('/api/admin/dashboard/pending-kyc');
```

### 4.4 Admin Properties *(new production endpoints)*

| Endpoint | Status | Notes |
|---|---|---|
| `GET /api/v1/admin/properties` | ❌ | `fetchProperties()` calls `/api/admin/properties` — **wrong path** |
| `GET /api/v1/admin/properties/{id}` | ❌ | Not integrated |
| `PATCH /api/v1/admin/properties/{id}/approve` | ❌ | Only mock currently |
| `PATCH /api/v1/admin/properties/{id}/reject` | ❌ | Only mock currently |
| `PATCH /api/v1/admin/properties/{id}/flag` | ❌ | Only mock currently |

### 4.5 Admin Transactions *(new production endpoints)*

| Endpoint | Status | Notes |
|---|---|---|
| `GET /api/v1/admin/transactions` | ❌ | `fetchTransactions()` delegates to `usePropertyTransactionsStore` — add dedicated admin call |
| `GET /api/v1/admin/transactions/{id}` | ❌ | `fetchTransactionById()` calls property-transactions — add dedicated admin call |

### 4.6 Admin Finance *(new production endpoints)*

| Endpoint | Status | Notes |
|---|---|---|
| `GET /api/v1/admin/finance/revenue` | ❌ | `fetchFinance()` is mock only |
| `GET /api/v1/admin/finance/revenue/by-category` | ❌ | Not integrated |
| `GET /api/v1/admin/finance/escrow` | ❌ | Uses `useTransactionLedger` fallback |
| `GET /api/v1/admin/finance/payouts` | ❌ | Uses `useWalletStore.payoutRequests` fallback |

**Fix needed:** Update `useAdminDashboardStore.fetchFinance()`:
```typescript
const [revenue, byCategory, escrow, payouts] = await Promise.all([
  apiGet('/api/admin/finance/revenue'),
  apiGet('/api/admin/finance/revenue/by-category'),
  apiGet('/api/admin/finance/escrow'),
  apiGet('/api/admin/finance/payouts'),
]);
```

### 4.7 Admin Settings *(new production endpoints)*

| Endpoint | Status | Notes |
|---|---|---|
| `GET /api/v1/admin/settings/profile` | ❌ | Not integrated |
| `PATCH /api/v1/admin/settings/profile` | ❌ | Not integrated |
| `GET /api/v1/admin/settings/platform-fees` | ❌ | `submitPlatformFees()` calls `/api/admin/platform-fees` — **wrong path** |
| `PATCH /api/v1/admin/settings/platform-fees` | ❌ | Same issue |

**Fix:** Change `/api/admin/platform-fees` → `GET /api/admin/settings/platform-fees` (fetch on load) and `PATCH /api/admin/settings/platform-fees` (on save).

### 4.8 Admin Messages

| Endpoint | Status | Notes |
|---|---|---|
| `POST /api/v1/admin/messages/broadcast` | ❌ | Not integrated |

### 4.9 Admin Support Tickets *(new production endpoints)*

The `useAdminMessagesStore` currently calls `/api/admin/support-tickets` (undocumented). The real endpoints are:

| Endpoint | Status | Notes |
|---|---|---|
| `GET /api/v1/admin/tickets` | ❌ | Replace mock support-tickets call |
| `GET /api/v1/admin/tickets/{id}` | ❌ | |
| `POST /api/v1/admin/tickets/{id}/claim` | ❌ | Claim ticket for handling |
| `POST /api/v1/admin/tickets/{id}/release` | ❌ | Release claimed ticket |
| `POST /api/v1/admin/tickets/{id}/transfer` | ❌ | Transfer to another admin |
| `POST /api/v1/admin/tickets/{id}/messages` | ❌ | Reply to ticket |
| `PATCH /api/v1/admin/tickets/{id}/priority` | ❌ | Change priority |
| `POST /api/v1/admin/tickets/{id}/resolve` | ❌ | Resolve ticket |
| `POST /api/v1/admin/tickets/{id}/reopen` | ❌ | Reopen resolved ticket |

---

## 5. Phase 5 — Supporting Features

### 5.1 File Upload

`POST /api/v1/documents/upload` accepts `multipart/form-data`. Needed for:
- Listing images (`POST /api/v1/listings/{id}/images`)
- Document creation (`POST /api/v1/documents`)
- Profile avatar updates

**Pattern to use:**
```typescript
const formData = new FormData();
formData.append('file', file);
const { url } = await fetch('/api/documents/upload', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: formData,
}).then(r => r.json());
```

### 5.2 Notifications

No notification endpoint documented. `useNotificationStore` remains client-only. Add when backend exposes:
- `GET /api/v1/notifications`
- `PATCH /api/v1/notifications/{id}/read`

### 5.3 Pusher Real-Time Messaging

`src/lib/services/pusher.ts` is built and integrates `POST /api/v1/messages/pusher/auth`.

**Remaining setup:**
1. Install `pusher-js`: `bun add pusher-js`
2. Add env vars to `.env.local`:
   ```
   NEXT_PUBLIC_PUSHER_KEY=
   NEXT_PUBLIC_PUSHER_CLUSTER=
   ```
3. Call `initPusher()` in the messages dashboard layout
4. Call `subscribeToConversation(chatId, onMessage)` when a chat is opened

---

## 6. Phase 6 — New Endpoints (Production API)

### 6.1 Direct Debit / Mandates *(new)*

Full mandate management system for recurring payments.

| Endpoint | Status | Notes |
|---|---|---|
| `POST /api/v1/direct-debit/mandates/initialize` | ❌ | Initialize a debit mandate |
| `GET /api/v1/direct-debit/mandates/verify/{reference}` | ❌ | Verify mandate by reference |
| `GET /api/v1/direct-debit/mandates` | ❌ | List user's mandates |
| `POST /api/v1/direct-debit/mandates/{id}/retry-activation` | ❌ | Retry failed mandate |
| `DELETE /api/v1/direct-debit/mandates/{id}` | ❌ | Deactivate mandate |

**Action:** Create `useDirectDebitStore.ts` with these five operations. Integrate in wallet/payment settings where recurring payments are configured.

### 6.2 User Support Tickets *(new)*

Users can create and track support tickets.

| Endpoint | Status | Notes |
|---|---|---|
| `POST /api/v1/support/tickets` | ❌ | Create ticket — replace the Help Center mock in settings |
| `GET /api/v1/support/tickets` | ❌ | List user's tickets |
| `GET /api/v1/support/tickets/{id}` | ❌ | Single ticket detail |
| `POST /api/v1/support/tickets/{id}/messages` | ❌ | Reply to ticket thread |
| `POST /api/v1/support/tickets/{id}/close` | ❌ | Close ticket |

**Action:** Update `useSettingsStore.submitHelpTicket()` to call `POST /api/v1/support/tickets`. Add a ticket list/thread view in the Help Center settings tab.

### 6.3 Health Endpoints

| Endpoint | Status | Notes |
|---|---|---|
| `GET /api/v1/health` | 🚫 | Server health check — not needed on frontend |
| `GET /api/v1/health/live` | 🚫 | Liveness probe — not needed on frontend |

---

## 7. Adapter Layer Reference

All field mapping is in `src/lib/api/adapters.ts`. Already implemented:

| Function | Purpose |
|---|---|
| `mapRole(backendRole)` | `'REAL_ESTATE_AGENT'` → `'Agent'` etc. |
| `mapKycStatus(v)` | `'VERIFIED'` → `'verified'` etc. |
| `mapAccountStatus(isActive, v)` | Derives `'active'`/`'suspended'`/`'deactivated'` |
| `mapUser(raw)` | Full `BackendUser` → `AuthUser` |
| `mapAuthResponse(res)` | Extracts user from any auth response shape |
| `extractToken(res)` | Handles `token`/`accessToken`/`access_token` |
| `extractRefreshToken(res)` | Handles `refreshToken`/`refresh_token` |
| `fromKobo(n)` | Kobo integer → Naira float (÷ 100) |
| `toKobo(n)` | Naira float → Kobo integer (× 100) |
| `formatDate(iso)` | ISO string → `"28 Aug 2025"` |

---

## 8. Field Mapping Reference

### Backend `User` → Frontend `AuthUser`

| Backend | Frontend | Transform |
|---|---|---|
| `id` | `id` | direct |
| `firstName + ' ' + lastName` | `name` | concatenate |
| `displayName` | `displayName` | direct |
| `email` | `email` | direct |
| `roles[0]` | `role` | `mapRole()` |
| `avatarUrl` | `avatarUrl` | direct |
| `verificationStatus` | `kycStatus` | `mapKycStatus()` |
| `isActive` + `verificationStatus` | `accountStatus` | `mapAccountStatus()` |
| `onboardingStep` | KYC step indicator | used by KYC components |

### Backend `Document` → Frontend `DocumentItem`

| Backend | Frontend | Transform |
|---|---|---|
| `id` | `id` | direct |
| `title` | `title` | direct |
| `documentType` or `type` | `type` | direct |
| `updatedAt` or `createdAt` | `dateUpdated` | `formatDate()` |
| `fileSizeBytes` | `size` | `(n / 1048576).toFixed(1) + ' MB'` |
| `listing.title` | `propertyReference` | from nested object |

### Wallet amounts (kobo ↔ naira)

All amounts from `/api/v1/wallet/balance`, `/api/v1/admin/finance/*`, and transaction stores are in **kobo** (integer). Always `fromKobo()` before display and `toKobo()` before sending.

### Property type enums

| Backend | Frontend |
|---|---|
| `RESIDENTIAL` | `'Residential'` |
| `COMMERCIAL` | `'Commercial'` |
| `LAND` | `'Plots/Lands'` |
| `SHORT_LET` | `'Service Apartments & Short Lets'` |
| `PG_HOSTEL` | `'PG/Hostel'` |

---

## 9. Remaining Questions

Previously-open questions now answered by production API docs:

| Question | Answer |
|---|---|
| Support tickets endpoint? | ✅ `POST/GET /api/v1/support/tickets` + admin at `/api/v1/admin/tickets/*` |
| Admin finance/payouts? | ✅ `/api/v1/admin/finance/revenue`, `/escrow`, `/payouts` |
| Admin platform fees? | ✅ `GET/PATCH /api/v1/admin/settings/platform-fees` |
| Google OAuth flow? | ✅ Replaced by Firebase — `POST /api/v1/auth/firebase` |
| Password reset? | ✅ `forgot-password` → `verify-reset-otp` → `reset-password` |

**Still open:**

1. **Wallet transactions** — Is there a `GET /api/v1/wallet/transactions` endpoint for ledger history, or does it come from `/api/v1/transactions`?

2. **KYC admin approval** — No explicit `/admin/users/{id}/approve-kyc` endpoint found. Is KYC approved via the verifications endpoints, or does it happen automatically after all KYC steps complete?

3. **Notifications** — Still no notification endpoint. Is there a WebSocket or SSE endpoint for real-time notifications?

4. **Agent profile vs auth/me** — For non-agent roles (Landlord, Seeker, etc.), is `PATCH /api/v1/auth/me` the correct endpoint for profile updates, or are there role-specific profile endpoints like `PUT /api/v1/agents/profile`?

5. **Firebase config** — What are the Firebase project credentials (`apiKey`, `authDomain`, `projectId`, `appId`) for the production app?

6. **Pusher config** — What is the Pusher key and cluster for the production app?

7. **Direct debit** — What payment scenarios trigger mandate creation? Is it for recurring rent payments?

8. **Message attachments** — Does `POST /api/v1/messages/conversations/{id}/messages` support file attachments? If so, does the file URL come from `POST /api/v1/documents/upload` first?
