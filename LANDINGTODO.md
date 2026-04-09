# LANDINGTODO.md — Landing Page & Auth Flows: Incomplete & Stub Inventory

> Tracks every unimplemented interaction, dead route, and placeholder on the public landing page
> and all authentication flows (login, signup, password reset).
> **Last updated:** 2026-04-08

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Done |
| ⬜ | Not started |
| 🔌 | Needs backend only (UI is ready) |
| 🎨 | Needs UI + backend |
| 🔧 | Logic/wiring only (no backend needed) |
| 🚨 | Security / correctness concern |

---

## 1. Navbar (`src/components/Navbar.tsx`)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1.1 | **`/sell` page created** | ✅ | Page with "List your property for sale" CTA linking to `/auth/signup?role=property-owner`. |
| 1.2 | **`/rent-out` page created** | ✅ | Page with "List your property for rent" CTA linking to `/auth/signup?role=property-owner`. |
| 1.3 | **`/agent` page created** | ✅ | Page with "Find an Agent" and "Become an Agent" cards. |

---

## 2. Hero Section (`src/components/Hero.tsx`)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 2.1 | **"Post Ads" button wired** | ✅ | Now a `<Link>` to `/auth/signup?role=property-owner`. |
| 2.2 | **"Become Agent" button wired** | ✅ | Now a `<Link>` to `/auth/signup?role=real-estate-agent`. |

---

## 3. Modals — Book Tour Flow

| # | Item | Status | Notes |
|---|------|--------|-------|
| 3.1 | **Time slots now dynamic** | ✅ | `BookTourModal` generates 4 slots from the next Sunday — no more hardcoded "Sun, Jul 2". |
| 3.2 | **Inspection fee hardcoded at ₦200,000** | 🔌 | Flat constant, not from property or pricing API. |
| 3.3 | **Payment is a query-param simulation** | 🔌 | No Paystack or wallet debit. Needs payment gateway integration. |
| 3.4 | **Wallet balance now reads from store** | ✅ | `PaymentOptionsModal` reads `useWalletStore().walletBalance` instead of hardcoded ₦200M. |
| 3.5 | **Payment methods differentiated** | ✅ | Wallet triggers success flow; Paystack shows "coming soon" inline message. |
| 3.6 | **"Chat Agent" in booking confirmation opens chat** | ✅ | Navigates to `?chat=1` instead of `/listings/{id}`. |

---

## 4. Modals — Reserve Property Flow

| # | Item | Status | Notes |
|---|------|--------|-------|
| 4.1 | **All prices in reserve modal are hardcoded** | 🔌 | `PROPERTY_PRICE`, `AGENT_FEE`, `VAT`, `VERIFY_PRICE` are fixed constants. Needs property API. |
| 4.2 | **Reserve payment is a query-param simulation** | 🔌 | No actual payment processed. |
| 4.3 | **Wallet balance now reads from store** | ✅ | `ReservePaymentModal` reads `useWalletStore().walletBalance`. |
| 4.4 | **Payment methods differentiated** | ✅ | Wallet and Paystack now call separate handlers. |
| 4.5 | **"Chat Agent" in reserve confirmation opens chat** | ✅ | Navigates to `?chat=1`. |

---

## 5. Chat Modal (`src/components/ChatModal.tsx`)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 5.1 | **Messages now use local state** | ✅ | Initial messages are seed data; new messages are appended to local state on send. Not connected to `useMessagesStore` (no thread context on public listing). |
| 5.2 | **"Send" button wired** | ✅ | Sends on click and on Enter key. Disabled when input is empty. |
| 5.3 | **File attachment button** | 🎨 | Shows "File uploads are coming soon." toast. Full upload needs backend. |
| 5.4 | **Photo button** | 🎨 | Same as file attachment. |
| 5.5 | **Call button** | 🎨 | Shows "Voice/video calls are coming soon." toast. Needs WebRTC/third-party integration. |
| 5.6 | **Property context now dynamic** | ✅ | Looks up property from `standardProperties` via `useParams().id`. Shows real title, price, and image. |

---

## 6. Push Notification Manager (`src/components/PushNotificationManager.tsx`)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 6.1 | **No backend subscription** | 🔌 | `handleEnable()` requests browser permission and shows a local test push, but never POSTs the subscription object to a server. |
| 6.2 | **Service worker exists** | ✅ | `/public/sw.js` is present and registered correctly. |
| 6.3 | **`isSubscribed` now used** | ✅ | Banner is hidden when `isSubscribed` is true — prevents prompt from reappearing after the user already enabled notifications. |

---

## 7. Footer (`src/components/Footer.tsx`)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 7.1 | **All dead footer routes now have pages** | ✅ | Created: `/escrow`, `/agent-onboarding`, `/diaspora-services`, `/legal-support`, `/inspection`, `/faqs`, `/help`, `/contact`, `/privacy`, `/terms`. |
| 7.2 | **Social media links are `#` stubs** | 🔧 | All social icon links use `href="#"`. Replace with real profile URLs when accounts are created. |

---

## 8. Login Page (`src/app/auth/login/page.tsx`)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 8.1 | **Login accepts any credentials** | 🚨🔌 | Mock `setTimeout` creates a fixed user for any valid email/password. Replace with real API call. |
| 8.2 | **Google OAuth replaced with disabled button** | ✅ | `alert()` replaced with `disabled` button + `title="Google sign-in is coming soon"` tooltip. |

---

## 9. Signup Flow (`src/app/auth/signup/`)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 9.1 | **Google OAuth replaced with disabled button** | ✅ | Same fix as login — `alert()` removed on account page. |
| 9.2 | **OTP accepts any 6-digit code** | 🚨🔌 | `validateOtp()` checks format only. Needs backend OTP validation. |
| 9.3 | **Resend code now has countdown** | ✅ | `alert()` replaced with a 30-second countdown timer. Re-enables after countdown. |
| 9.4 | **Selected role now preserved on success** | ✅ | `signup/success` reads `signupStore.role` and maps slug → `UserRole` (e.g. `'real-estate-agent'` → `'Agent'`). |
| 9.5 | **User created locally, never persisted** | 🔌 | Generated user lives in `useAuthStore` (persisted to `localStorage`). No backend registration call. |

---

## 10. Password Reset Flow (`src/app/auth/reset/`)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 10.1 | **Reset email not actually sent** | 🔌 | `setTimeout` then navigates. No email sent to user. |
| 10.2 | **OTP accepts any 6-digit code** | 🚨🔌 | Same as signup OTP — format-only validation. |
| 10.3 | **Resend code now has countdown** | ✅ | `alert()` replaced with 30-second countdown on reset verify page. |
| 10.4 | **New password never persisted** | 🔌 | Password held in component state, never sent to server. |

---

## 11. Auth Store Issues

| # | Item | Status | Notes |
|---|------|--------|-------|
| 11.1 | **`useAuthStore` is persisted** | ✅ | Already uses Zustand `persist` middleware with `localStorage`. Login survives refresh. |
| 11.2 | **Favourites API endpoint may not exist** | 🔌 | `toggleLike` calls `PATCH /api/listings/{id}/favourite` fire-and-forget with rollback. Confirm endpoint exists before shipping. |

---

## 12. Role Pre-selection on Signup

| # | Item | Status | Notes |
|---|------|--------|-------|
| 12.1 | **Signup role pre-selected from URL param** | ✅ | `/auth/signup?role=real-estate-agent` (and other slugs) pre-selects the matching card on step 1 via `useSearchParams`. |
| 12.2 | **All landing CTAs pass role param** | ✅ | Hero, AudienceSection, AgentDiasporaPromo, `/sell`, `/rent-out`, `/agent`, `/agent-onboarding`, `/diaspora-services` all pass correct `?role=` values. |

---

## 13. Validation Issues

| # | Item | Status | Notes |
|---|------|--------|-------|
| 13.1 | **`validateOtp()` is format-only** | 🚨🔧 | `src/lib/utils/authValidation.ts` — validates length/digit-only but not correctness. When backend is integrated, OTP must be validated server-side before advancing. |

---

## Summary Counts

| Section | Total | ✅ Done | ⬜/🔌/🎨/🔧 Remaining |
|---------|-------|--------|----------------------|
| Navbar | 3 | 3 | 0 |
| Hero | 2 | 2 | 0 |
| Book Tour Modals | 6 | 4 | 2 |
| Reserve Modals | 5 | 3 | 2 |
| Chat Modal | 6 | 3 | 3 |
| Push Notifications | 3 | 2 | 1 |
| Footer | 2 | 1 | 1 |
| Login | 2 | 1 | 1 |
| Signup | 5 | 4 | 1 |
| Password Reset | 4 | 1 | 3 |
| Auth Stores | 2 | 1 | 1 |
| Role Pre-selection | 2 | 2 | 0 |
| Validation | 1 | 0 | 1 |
| **Total** | **43** | **27** | **16** |

> 🚨 **3 security-relevant gaps remaining**: any-code OTP validation (signup + reset), any-credential login.
> All require a backend API to fix — frontend stubs are as good as they can be without one.
