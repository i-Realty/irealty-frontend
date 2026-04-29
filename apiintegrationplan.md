# i-Realty Frontend — Backend Integration Plan

**Backend:** `https://staging-api.i-realty.app/v1`  
**Docs:** `apidocs.md` (77 endpoints, 44 models)  
**Toggle:** Set `NEXT_PUBLIC_USE_API=true` in `.env.local` to go live  
**Status:** All stores currently run in mock mode (`USE_API=false`)

---

## Table of Contents

1. [Critical Mismatches to Fix First](#1-critical-mismatches-to-fix-first)
2. [Phase 1 — Auth & Session](#2-phase-1--auth--session)
3. [Phase 2 — Core User Flows](#3-phase-2--core-user-flows)
4. [Phase 3 — Transactions & Payments](#4-phase-3--transactions--payments)
5. [Phase 4 — Admin Dashboard](#5-phase-4--admin-dashboard)
6. [Phase 5 — Supporting Features](#6-phase-5--supporting-features)
7. [Global Adapter Layer](#7-global-adapter-layer)
8. [Endpoint Path Changes Summary](#8-endpoint-path-changes-summary)
9. [Field Mapping Reference](#9-field-mapping-reference)
10. [Files to Touch Per Phase](#10-files-to-touch-per-phase)

---

## 1. Critical Mismatches to Fix First

These must be resolved **before** flipping `USE_API=true` — everything breaks without them.

### 1.1 Role Enum Mismatch

Backend returns uppercase snake_case. Frontend expects title-case with spaces.

| Backend value | Frontend `UserRole` | Used in |
|---|---|---|
| `REAL_ESTATE_AGENT` | `'Agent'` | `useAuthStore`, nav, permissions |
| `PROPERTY_SEEKER` | `'Property Seeker'` | all dashboards |
| `DIASPORA_INVESTOR` | `'Diaspora'` | diaspora dashboard |
| `DEVELOPER` | `'Developer'` | developer dashboard |
| `LANDLORD` | `'Landlord'` | landlord dashboard |
| `ADMIN` | `'Admin'` | admin dashboard |

**Fix:** Create `src/lib/api/adapters.ts` with a `mapRole()` function called on every API response that contains a role. Never change the frontend `UserRole` type — adapt at the boundary.

```typescript
// src/lib/api/adapters.ts
export function mapRole(backendRole: string): UserRole {
  const map: Record<string, UserRole> = {
    REAL_ESTATE_AGENT: 'Agent',
    PROPERTY_SEEKER:   'Property Seeker',
    DIASPORA_INVESTOR: 'Diaspora',
    DEVELOPER:         'Developer',
    LANDLORD:          'Landlord',
    ADMIN:             'Admin',
  };
  return map[backendRole] ?? 'Property Seeker';
}
```

### 1.2 KYC / Verification Status Mismatch

| Backend `verificationStatus` | Backend `accountStatus` | Frontend `kycStatus` | Frontend `accountStatus` |
|---|---|---|---|
| `PENDING` | `active` | `'in-progress'` | `'active'` |
| `VERIFIED` | `active` | `'verified'` | `'active'` |
| `SUSPENDED` | — | `'unverified'` | `'suspended'` |
| `REVOKED` | — | `'unverified'` | `'deactivated'` |

**Fix:** Add `mapKycStatus()` and `mapAccountStatus()` to `adapters.ts`.

```typescript
export function mapKycStatus(v: string): 'unverified' | 'in-progress' | 'verified' {
  if (v === 'VERIFIED') return 'verified';
  if (v === 'PENDING')  return 'in-progress';
  return 'unverified';
}

export function mapAccountStatus(v: string): 'active' | 'suspended' | 'deactivated' {
  if (v === 'SUSPENDED') return 'suspended';
  if (v === 'REVOKED')   return 'deactivated';
  return 'active';
}
```

### 1.3 User Object Shape Mismatch

Backend `User` model vs frontend `AuthUser` interface:

| Frontend field | Backend field | Notes |
|---|---|---|
| `id` | `id` | ✅ matches |
| `name` | `firstName + ' ' + lastName` | must concatenate |
| `email` | `email` | ✅ matches |
| `role` | `roles[0]` | backend is array, take first + `mapRole()` |
| `displayName` | `displayName` | ✅ matches |
| `avatarUrl` | `avatarUrl` | ✅ matches |
| `kycStatus` | `verificationStatus` | use `mapKycStatus()` |
| `accountStatus` | `isActive` + `verificationStatus` | derive from both |

**Fix:** Add `mapUser()` to `adapters.ts`:

```typescript
export function mapUser(u: BackendUser): AuthUser {
  return {
    id:            u.id,
    name:          `${u.firstName} ${u.lastName}`.trim() || u.displayName,
    email:         u.email,
    role:          mapRole(u.roles?.[0] ?? ''),
    displayName:   u.displayName || `${u.firstName} ${u.lastName}`.trim(),
    avatarUrl:     u.avatarUrl ?? '',
    kycStatus:     mapKycStatus(u.verificationStatus),
    accountStatus: !u.isActive ? 'suspended' : mapAccountStatus(u.verificationStatus),
  };
}
```

### 1.4 Token Storage

The API client reads the token from:
```
localStorage['irealty-auth'] → state.token
```

The backend JWT must be stored under the key `token` inside the Zustand auth state. Confirm the backend login response returns a `token` (or `accessToken`) field and store it correctly in `useAuthStore.login()`. If the field is named differently (e.g. `accessToken`), update the `getToken()` function in `src/lib/api/client.ts`.

---

## 2. Phase 1 — Auth & Session

**Goal:** Real login, signup, logout, token refresh, and account switching working end-to-end.

### 2.1 Login — `src/app/auth/login/page.tsx`

| | Current (mock) | Backend |
|---|---|---|
| Endpoint | none (local credential check) | `POST /api/v1/auth/login` |
| Request | `{ email, password }` | `{ email, password }` ✅ |
| Response | hardcoded `AuthUser` | `{ token, user }` (confirm with backend dev) |

**Changes:**
- When `USE_API=true`: replace mock credential check with `apiPost('/auth/login', { email, password })`
- Map response using `mapUser()` from `adapters.ts`
- Store `token` in auth store (add `token` field to `AuthUser` or store separately)
- Call `useSettingsStore.getState().setActiveAccount(user.id)` after login (already done)

### 2.2 Signup — `src/app/auth/signup/`

| | Current | Backend |
|---|---|---|
| Endpoint | none | `POST /api/v1/auth/register` |
| Request | — | `{ email, password, firstName, lastName, role, ... }` |
| Response | — | `{ token, user }` |

**Changes:**
- Wire signup form submission to `apiPost('/auth/register', payload)`
- Role must be sent as backend enum (e.g. `REAL_ESTATE_AGENT`), not frontend label

### 2.3 Email Verification

Backend has `POST /api/v1/auth/verify-email` and `POST /api/v1/auth/resend-verification`. Frontend has no screens for this yet.

**Action needed:** Create `/auth/verify-email` page or add verification banner to dashboard.

### 2.4 Token Refresh

Backend has `POST /api/v1/auth/refresh`. Frontend has no refresh logic — on 401 it logs out.

**Changes to `src/lib/api/client.ts`:**
- On 401, attempt one refresh before logging out
- Store refresh token in auth store (or `httpOnly` cookie — confirm with backend dev)
- If refresh fails, then clear session and redirect

### 2.5 Google OAuth

Backend has `GET /api/v1/auth/google` and `GET /api/v1/auth/google/callback`.
The Google sign-in button is already in the login page (currently disabled with "coming soon").

**Action needed:** Enable the button and redirect to `${API_URL}/auth/google`.

### 2.6 Account Switching — `src/lib/store/useSettingsStore.ts`

| | Current | Backend |
|---|---|---|
| Endpoint | `POST /api/auth/switch-account` | `POST /api/v1/auth/switch-account` |
| Request | `{ accountId }` | `{ accountId }` ✅ |
| Response | `AuthUser` | confirm response shape |

Backend also has `GET /api/v1/auth/linked-accounts` and `POST /api/v1/auth/linked-accounts` for managing multiple accounts. The "Add Account" modal should call `POST /api/v1/auth/linked-accounts`.

---

## 3. Phase 2 — Core User Flows

### 3.1 Messages — `src/lib/store/useMessagesStore.ts`

This requires the most work. The frontend's "thread" model and backend's "conversation" model are different.

**Endpoint mapping:**

| Frontend calls | Backend endpoint | Change needed |
|---|---|---|
| `GET /api/messages/threads` | `GET /api/v1/messages/conversations` | Path + response adapter |
| `POST /api/messages/{id}/send` | `POST /api/v1/messages/conversations/{id}/messages` | Path change |
| _(missing)_ | `POST /api/v1/messages/conversations` | Create new conversation |
| _(missing)_ | `GET /api/v1/messages/conversations/{id}/messages` | Paginated messages |

**Response shape adapter — backend Conversation → frontend ChatThread:**

| Frontend `ChatThread` field | Backend `Conversation` field | Notes |
|---|---|---|
| `id` | `id` | ✅ |
| `participant` | `participants[0]` (the other user) | filter out self |
| `lastMessage` | `messages[messages.length-1].content` | derive from last message |
| `lastMessageTime` | `messages[messages.length-1].createdAt` | format as relative time |
| `unreadCount` | not in backend response | track client-side or ask backend to add |
| `propertyContext` | `listingId` → fetch listing | requires separate fetch or backend to include |
| `messages` | `messages` array | map each message |

**Action:** Create `mapConversation(conv, currentUserId)` adapter. Ask backend dev if `GET /api/v1/messages/conversations` can include the last message and listing context to avoid N+1 fetches.

**Message send:** Backend `POST /api/v1/messages/conversations/{id}/messages` expects `{ content, type?, fileUrl? }` — align with frontend's `{ content, type, files[] }`.

### 3.2 Wallet — `src/lib/store/useWalletStore.ts`

Several wallet endpoints don't exist in the backend docs yet:

| Frontend calls | Backend endpoint | Status |
|---|---|---|
| `GET /api/wallet/ledger` | `GET /api/v1/wallet/balance` | Partial — balance only, no transactions |
| `POST /api/wallet/withdraw` | `POST /api/v1/paystack/withdraw` | Different path — use Paystack |
| `PUT /api/wallet/fiat-details` | `POST /api/v1/paystack/transfer/recipient` | Different concept |

**Action needed with backend dev:**
- Confirm if a transaction history endpoint exists (e.g. `GET /api/v1/wallet/transactions`)
- Confirm withdrawal flow — Paystack charges or direct transfer?
- `GET /api/v1/wallet/balance` returns amounts in **kobo** (smallest NGN unit) — frontend displays in naira, so divide by 100
- `GET /api/v1/wallet/virtual-account` returns the virtual bank account for deposits

**Balance response adapter:**
```typescript
// Backend returns amounts in kobo (integer)
walletBalance: data.availableBalance / 100,
escrowBalance: data.escrowBalance / 100,
```

### 3.3 Documents — `src/lib/store/useDocumentsStore.ts`

Endpoints mostly align but field names differ:

| Frontend `DocumentItem` | Backend field | Adapter |
|---|---|---|
| `id` | `id` | ✅ |
| `title` | `title` | ✅ |
| `type` | `documentType` | rename |
| `dateUpdated` | `updatedAt` | rename |
| `size` | `fileSizeBytes` | convert bytes → `"2.4 MB"` string |
| `propertyReference` | `listing.title` | derive from nested `listing` |

Upload uses `POST /api/v1/documents/upload` with `multipart/form-data` — frontend currently doesn't have a real upload, only mock. Requires adding a file upload call before `POST /api/v1/documents`.

### 3.4 Listings / Properties — `src/lib/store/` (multiple stores)

Frontend uses mock data from `src/lib/data/standardProperties.ts`. Backend has a full marketplace API.

**Endpoints to integrate:**

| Action | Backend endpoint |
|---|---|
| Search/browse listings | `GET /api/v1/marketplace/search` |
| View single listing | `GET /api/v1/marketplace/{id}` |
| Agent: create listing | `POST /api/v1/listings` |
| Agent: my listings | `GET /api/v1/listings/mine` |
| Agent: edit listing | `PUT /api/v1/listings/{id}` |
| Agent: delete listing | `DELETE /api/v1/listings/{id}` |
| Agent: publish listing | `PATCH /api/v1/listings/{id}/publish` |
| Agent: upload images | `POST /api/v1/listings/{id}/images` |
| Seeker: favourites | `GET /api/v1/listings/liked` |
| Toggle favourite | `POST /api/v1/listings/{id}/like` (NOT `PATCH /api/listings/{id}/favourite`) |

**Key path fix:** Frontend `useFavouritesStore` calls `PATCH /api/listings/{id}/favourite` — change to `POST /api/v1/listings/{id}/like`.

### 3.5 KYC Flow — `src/components/dashboard/kyc/`

KYC uses **QoreId** for identity verification. Backend endpoints:

| Step | Backend endpoint |
|---|---|
| Get current status | `GET /api/v1/kyc/status` |
| Submit personal info | `POST /api/v1/kyc/personal-info` |
| Send phone OTP | `POST /api/v1/kyc/phone/send-otp` |
| Verify phone OTP | `POST /api/v1/kyc/phone/verify-otp` |
| Submit ID document | `POST /api/v1/kyc/id-verification` |
| Register liveness session | `POST /api/v1/kyc/liveness/register-session` |
| Pay KYC fee | `POST /api/v1/kyc/payment` |

**Action:** Replace the mock KYC flow in `StepPersonalInformation.tsx`, `StepFaceMatch.tsx`, etc. with real calls to these endpoints. The `onboardingStep` field from the backend user object tells you which step to show.

### 3.6 Settings — `src/lib/store/useSettingsStore.ts`

Most settings endpoints don't have exact backend equivalents. Some map to agent profile endpoints.

| Frontend endpoint | Backend equivalent |
|---|---|
| `PUT /api/settings/profile` | `PUT /api/v1/agents/profile` (agents) or TBC for other roles |
| `POST /api/settings/security` | Not documented — ask backend dev |
| `POST /api/settings/help-ticket` | Not documented — ask backend dev |
| `PUT /api/settings/commission` | Not documented — ask backend dev |
| `PUT /api/settings/payout` | `POST /api/v1/paystack/transfer/recipient` |
| `PUT /api/settings/diaspora-fx` | Not documented |
| `PUT /api/settings/landlord-lease` | Not documented |
| `PUT /api/settings/developer-project` | Not documented |

**Action needed with backend dev:** Confirm which settings endpoints exist and their paths. Many role-specific settings may not be implemented yet.

**Agent profile endpoints exist:**
- `GET /api/v1/agents/profile` — fetch own profile
- `PUT /api/v1/agents/profile` — update own profile
- `GET /api/v1/agents/{id}/profile` — view another agent's public profile

---

## 4. Phase 3 — Transactions & Payments

### 4.1 Property Transactions — all role dashboard stores

All role-specific transaction stores (agent, seeker, developer, landlord, diaspora) use fabricated mock data. The backend has a unified transactions API.

**Unified backend endpoint:**
```
GET /api/v1/property-transactions       — all transactions for current user
GET /api/v1/property-transactions/{id}  — single transaction detail
GET /api/v1/transactions                — general ledger (separate domain)
```

**Action:** Create a shared `usePropertyTransactionsStore.ts` that all role dashboards pull from, replacing the individual mock stores.

**Action endpoints per transaction state:**

| Action | Backend endpoint |
|---|---|
| Accept transaction | `POST /api/v1/property-transactions/{id}/accept` |
| Decline transaction | `POST /api/v1/property-transactions/{id}/decline` |
| Confirm tour | `POST /api/v1/property-transactions/{id}/confirm-tour` |
| Confirm handover | `POST /api/v1/property-transactions/{id}/confirm-handover` |
| Confirm completion | `POST /api/v1/property-transactions/{id}/confirm-completion` |

**Transaction type mismatch:**

| Frontend type | Backend type |
|---|---|
| `'inspection'` | `"INSPECTION"` |
| `'rent'` | `"RENTAL"` |
| `'sale'` | `"SALES"` |
| `'milestone'` | _(not in backend — part of SALES flow)_ |
| `'service'` | _(not in backend)_ |

### 4.2 Paystack Payment Integration

Payments go through **Paystack**. Backend provides endpoints to charge and manage payouts.

| Action | Backend endpoint |
|---|---|
| List banks (for payout setup) | `GET /api/v1/paystack/banks` |
| Resolve bank account | `GET /api/v1/paystack/banks/resolve?accountNumber=&bankCode=` |
| Charge card | `POST /api/v1/paystack/charge/card` |
| Charge bank account | `POST /api/v1/paystack/charge/bank` |
| Create transfer recipient | `POST /api/v1/paystack/transfer/recipient` |
| Withdraw (transfer to bank) | `POST /api/v1/paystack/withdraw` |

**Action:** Wire the wallet `Withdraw` modal to `POST /api/v1/paystack/withdraw`. Wire the payout settings form to `POST /api/v1/paystack/transfer/recipient` for saving bank details. Use `GET /api/v1/paystack/banks` to populate the bank name dropdown instead of hardcoding.

### 4.3 BVN/ID Verification

Backend has `POST /api/v1/verifications/bvn` and `POST /api/v1/verifications/id`. These feed into the KYC flow. Integrate after Phase 2 KYC work is done.

---

## 5. Phase 4 — Admin Dashboard

### 5.1 Admin User Management — `src/lib/store/useAdminDashboardStore.ts`

| Frontend calls | Backend endpoint | Change needed |
|---|---|---|
| `GET /api/admin/users` | `GET /api/v1/admin/users` | Path fix |
| `GET /api/admin/users/{id}` | `GET /api/v1/admin/users/{id}` | Path fix |
| `POST /api/admin/users/{id}/suspend` | `PATCH /api/v1/admin/users/{id}/suspend` | Method: POST→PATCH, add `{ reason }` body |
| `POST /api/admin/users/{id}/reactivate` | `PATCH /api/v1/admin/users/{id}/reactivate` | Method: POST→PATCH |
| `POST /api/admin/users/{id}/approve-kyc` | Not documented | Ask backend dev |
| `POST /api/admin/users/{id}/reject-kyc` | Not documented | Ask backend dev |

**New admin endpoints not yet wired in frontend:**
- `GET /api/v1/admin/admins` — manage admin users
- `POST /api/v1/admin/admins` — create new admin
- `GET /api/v1/admin/admins/pending` — pending admin approvals
- `PATCH /api/v1/admin/admins/{id}/approve` — approve admin
- `GET /api/v1/admin/audit-logs` — audit log viewer (add page)

### 5.2 Admin Support Tickets — `src/lib/store/useAdminMessagesStore.ts`

| Frontend calls | Backend endpoint | Change needed |
|---|---|---|
| `GET /api/admin/support-tickets` | Not documented | Ask backend dev |
| Send reply | Not documented | Ask backend dev |
| Resolve/Escalate/Reopen | Not documented | Ask backend dev |

**Action:** Confirm whether backend has a support ticket system or if messages cover this.

### 5.3 Admin Finance/Payouts

| Frontend calls | Backend endpoint | Change needed |
|---|---|---|
| `POST /api/admin/payouts/{id}/approve` | Not documented | Ask backend dev |
| `POST /api/admin/payouts/{id}/reject` | Not documented | Ask backend dev |
| `POST /api/admin/platform-fees` | Not documented | Ask backend dev |

---

## 6. Phase 5 — Supporting Features

### 6.1 Calendar — `src/lib/store/useCalendarStore.ts`

Backend has full calendar API. Frontend likely uses mock data.

| Action | Backend endpoint |
|---|---|
| Get availability | `GET /api/v1/calendar/availability` |
| Set availability | `PUT /api/v1/calendar/availability` |
| List events | `GET /api/v1/calendar/events` |
| Create event | `POST /api/v1/calendar/events` |
| Get event | `GET /api/v1/calendar/events/{id}` |
| Update event | `PATCH /api/v1/calendar/events/{id}` |
| Delete event | `DELETE /api/v1/calendar/events/{id}` |

### 6.2 File Uploads (Media, Documents, Audio)

Backend does not yet document a generic file upload endpoint. Currently frontend generates blob URLs locally.

**Ask backend dev for:**
- `POST /api/v1/uploads` accepting `multipart/form-data` with a `file` field
- Response: `{ url: string }` — permanent CDN URL
- Used by: message attachments, listing images, document uploads, KYC documents, profile avatar

Until this endpoint exists, the chat file upload and document upload features must stay in mock mode even when `USE_API=true`.

### 6.3 Notifications

No notification endpoint was found in the backend docs. The frontend has a `useNotificationStore` with mock data.

**Ask backend dev for:**
- `GET /api/v1/notifications` — list notifications
- `PATCH /api/v1/notifications/{id}/read` — mark as read
- WebSocket or SSE endpoint for real-time notifications

---

## 7. Global Adapter Layer

Create `src/lib/api/adapters.ts` as the single file that handles all backend↔frontend translation. Nothing outside this file should know about backend field names.

```typescript
// src/lib/api/adapters.ts

import type { UserRole, AuthUser } from '@/lib/store/useAuthStore';

// ── Role mapping ──────────────────────────────────────────────────────
const ROLE_MAP: Record<string, UserRole> = {
  REAL_ESTATE_AGENT: 'Agent',
  PROPERTY_SEEKER:   'Property Seeker',
  DIASPORA_INVESTOR: 'Diaspora',
  DEVELOPER:         'Developer',
  LANDLORD:          'Landlord',
  ADMIN:             'Admin',
};
export const ROLE_TO_BACKEND: Record<UserRole, string> = {
  'Agent':           'REAL_ESTATE_AGENT',
  'Property Seeker': 'PROPERTY_SEEKER',
  'Diaspora':        'DIASPORA_INVESTOR',
  'Developer':       'DEVELOPER',
  'Landlord':        'LANDLORD',
  'Admin':           'ADMIN',
};
export const mapRole = (r: string): UserRole => ROLE_MAP[r] ?? 'Property Seeker';

// ── KYC / status mapping ──────────────────────────────────────────────
export const mapKycStatus = (v: string) => {
  if (v === 'VERIFIED') return 'verified' as const;
  if (v === 'PENDING')  return 'in-progress' as const;
  return 'unverified' as const;
};
export const mapAccountStatus = (isActive: boolean, v: string) => {
  if (!isActive || v === 'SUSPENDED') return 'suspended' as const;
  if (v === 'REVOKED')                return 'deactivated' as const;
  return 'active' as const;
};

// ── User model ────────────────────────────────────────────────────────
export const mapUser = (u: Record<string, any>): AuthUser => ({
  id:            u.id,
  name:          `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.displayName,
  email:         u.email,
  role:          mapRole(u.roles?.[0] ?? ''),
  displayName:   u.displayName || `${u.firstName} ${u.lastName}`.trim(),
  avatarUrl:     u.avatarUrl ?? '',
  kycStatus:     mapKycStatus(u.verificationStatus ?? ''),
  accountStatus: mapAccountStatus(u.isActive ?? true, u.verificationStatus ?? ''),
});

// ── Currency: kobo → naira ────────────────────────────────────────────
export const fromKobo = (kobo: number) => kobo / 100;
export const toKobo   = (naira: number) => Math.round(naira * 100);

// ── Date formatting ───────────────────────────────────────────────────
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
```

---

## 8. Endpoint Path Changes Summary

Every path in the stores currently includes `/api/` which the `client.ts` strips before prepending the base URL. The paths below are what stores call — they are already correct after the path-stripping fix in `client.ts`.

| Store | Current path called | Backend actual path | Status |
|---|---|---|---|
| `useAuthStore` login | _(none — in login page)_ | `/api/v1/auth/login` | Add to login page |
| `useSettingsStore` switchAccount | `/api/auth/switch-account` | `/api/v1/auth/switch-account` | ✅ will resolve |
| `useWalletStore` ledger | `/api/wallet/ledger` | `/api/v1/wallet/balance` + _(transactions TBC)_ | Path change needed |
| `useWalletStore` withdraw | `/api/wallet/withdraw` | `/api/v1/paystack/withdraw` | Path change needed |
| `useWalletStore` fiat-details | `/api/wallet/fiat-details` | `/api/v1/paystack/transfer/recipient` | Path change needed |
| `useMessagesStore` threads | `/api/messages/threads` | `/api/v1/messages/conversations` | Path + adapter needed |
| `useMessagesStore` send | `/api/messages/{id}/send` | `/api/v1/messages/conversations/{id}/messages` | Path change needed |
| `useDocumentsStore` | `/api/documents` | `/api/v1/documents` | ✅ will resolve |
| `useFavouritesStore` toggle | `PATCH /api/listings/{id}/favourite` | `POST /api/v1/listings/{id}/like` | Method + path change |
| `useAdminDashboardStore` users | `/api/admin/users` | `/api/v1/admin/users` | ✅ will resolve |
| `useAdminDashboardStore` suspend | `POST /api/admin/users/{id}/suspend` | `PATCH /api/v1/admin/users/{id}/suspend` | Method change needed |
| `useAdminDashboardStore` reactivate | `POST /api/admin/users/{id}/reactivate` | `PATCH /api/v1/admin/users/{id}/reactivate` | Method change needed |
| `useCalendarStore` | `/api/calendar/*` | `/api/v1/calendar/*` | ✅ will resolve |

---

## 9. Field Mapping Reference

### Backend `User` → Frontend `AuthUser`

| Backend | Frontend | Transform |
|---|---|---|
| `id` | `id` | direct |
| `firstName + lastName` | `name` | concatenate |
| `displayName` | `displayName` | direct |
| `email` | `email` | direct |
| `roles[0]` | `role` | `mapRole()` |
| `avatarUrl` | `avatarUrl` | direct |
| `verificationStatus` | `kycStatus` | `mapKycStatus()` |
| `isActive` + `verificationStatus` | `accountStatus` | `mapAccountStatus()` |

### Backend `Document` → Frontend `DocumentItem`

| Backend | Frontend | Transform |
|---|---|---|
| `id` | `id` | direct |
| `title` | `title` | direct |
| `documentType` | `type` | direct (enum value) |
| `updatedAt` | `dateUpdated` | `formatDate()` |
| `fileSizeBytes` | `size` | `(n/1048576).toFixed(1) + ' MB'` |
| `listing.title` | `propertyReference` | from nested object |

### Backend wallet amounts → Frontend display

All amounts from `/api/v1/wallet/balance` are in **kobo** (integer). Divide by 100 before displaying. Multiply by 100 before sending withdrawal amounts.

---

## 10. Files to Touch Per Phase

### Phase 1 — Auth
- `src/app/auth/login/page.tsx` — replace mock with `apiPost('/auth/login')`
- `src/app/auth/signup/` pages — wire to `POST /api/v1/auth/register`
- `src/lib/api/client.ts` — add token refresh on 401
- `src/lib/api/adapters.ts` — **create this file** (role/status/user mappers)
- `src/lib/store/useAuthStore.ts` — add `token` field to state
- `src/lib/store/useSettingsStore.ts` — update `switchAccount` with real response mapping

### Phase 2 — Core flows
- `src/lib/store/useMessagesStore.ts` — update paths + add conversation adapter
- `src/lib/store/useWalletStore.ts` — update paths + kobo conversion
- `src/lib/store/useDocumentsStore.ts` — update field mapping in `fetchDocuments`
- `src/lib/store/useFavouritesStore.ts` — fix method (POST) + path (`/like`)
- `src/lib/store/useSettingsStore.ts` — update profile endpoint to `/agents/profile`

### Phase 3 — Transactions
- `src/lib/store/useAgentDashboardStore.ts` — replace mock with real transactions
- `src/lib/store/useSeekerDashboardStore.ts` — same
- `src/lib/store/useDeveloperDashboardStore.ts` — same
- `src/lib/store/useLandlordDashboardStore.ts` — same
- `src/lib/store/useDiasporaDashboardStore.ts` — same

### Phase 4 — Admin
- `src/lib/store/useAdminDashboardStore.ts` — fix PATCH method for suspend/reactivate
- `src/lib/store/useAdminMessagesStore.ts` — confirm endpoints with backend dev

### Phase 5 — Supporting
- `src/lib/store/useCalendarStore.ts` — wire to `/calendar/*` endpoints
- `src/components/dashboard/kyc/` — wire to `/kyc/*` endpoints
- `src/lib/store/useNotificationStore.ts` — wire once backend exposes endpoint

---

## Questions for Backend Dev

Before starting integration, get answers to these:

1. **Login response shape** — What exact JSON does `POST /api/v1/auth/login` return? Specifically: what is the token field called (`token` or `accessToken`)? Is the user object nested under a `user` key?

2. **Refresh token** — Is the refresh token in the JSON response body or set as an `httpOnly` cookie?

3. **Wallet transactions** — Is there an endpoint for transaction history? (`GET /api/v1/wallet/transactions`)

4. **Support tickets** — Do support tickets go through the Messages system or a separate endpoint?

5. **KYC approval** — Is there an admin endpoint to approve/reject a user's KYC? (`/admin/users/{id}/approve-kyc`)

6. **Settings endpoints** — Do endpoints exist for: security/password change, help ticket, commission settings, diaspora FX settings, landlord lease settings, developer project settings?

7. **File uploads** — Is there a generic upload endpoint that returns a CDN URL?

8. **Admin finance** — Are there endpoints for platform fee configuration and payout approval?

9. **Notifications** — Is there a notifications endpoint or WebSocket connection?

10. **Message file attachments** — Does `POST /api/v1/messages/conversations/{id}/messages` support file attachments? What is the expected format?
