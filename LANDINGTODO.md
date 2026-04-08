# LANDINGTODO.md — Landing Page & Auth Flows: Incomplete & Stub Inventory

> Tracks every unimplemented interaction, dead route, and placeholder on the public landing page
> and all authentication flows (login, signup, password reset).
> **Last updated:** 2026-04-08

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ⬜ | Not started |
| 🔌 | Needs backend only (UI is ready) |
| 🎨 | Needs UI + backend |
| 🔧 | Logic/wiring only (no backend needed) |
| 🚨 | Security / correctness concern |

---

## 1. Navbar (`src/components/Navbar.tsx`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 1.1 | **`/sell` is a dead route** | 🎨 | Navbar link navigates to `/sell` which has no page. Returns 404. |
| 1.2 | **`/rent-out` is a dead route** | 🎨 | Navbar link navigates to `/rent-out` which has no page. |
| 1.3 | **`/agent` is a dead route** | 🎨 | Navbar link navigates to `/agent` which has no page. |

---

## 2. Hero Section (`src/components/Hero.tsx`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 2.1 | **"Post Ads" button unwired** | 🎨 | Button has no `onClick` handler and no `href`. Renders but does nothing. |
| 2.2 | **"Become Agent" button unwired** | 🎨 | Button has no `onClick` handler and no `href`. Should navigate to agent onboarding or `/auth/signup`. |

---

## 3. Modals — Book Tour Flow

| # | Item | Type | Notes |
|---|------|------|-------|
| 3.1 | **Time slots are hardcoded to "Sun, Jul 2"** | 🔌 | `BookTourModal` — all 4 date slots show an old hardcoded date. No availability fetch from backend. |
| 3.2 | **Inspection fee is hardcoded at ₦200,000** | 🔌 | `BookTourModal` line 110 — flat fee not derived from property data. |
| 3.3 | **Payment is a query-param simulation** | 🔌 | `PaymentOptionsModal` — `router.push()` with `?bookTourSuccess=1` simulates success. No Paystack or wallet debit. |
| 3.4 | **Wallet balance is hardcoded at ₦200,000,000** | 🔌 | `PaymentOptionsModal` line 51 — not fetched from `useWalletStore` or any API. |
| 3.5 | **Both payment methods call the same handler** | 🔧 | `PaymentOptionsModal` — "Pay with Wallet" and "Pay with Card" both call the same `choose()` function, identical behaviour. No routing to different payment flows. |
| 3.6 | **"Chat Agent" in booking confirmation is navigation-only** | 🔧 | `BookingConfirmationModal` — "Chat Agent" button navigates to `/listings/{id}` instead of opening a chat session. |

---

## 4. Modals — Reserve Property Flow

| # | Item | Type | Notes |
|---|------|------|-------|
| 4.1 | **All prices in reserve modal are hardcoded** | 🔌 | `ReserveModal` — `PROPERTY_PRICE = 20,000,000`, `AGENT_FEE = 500,000`, `VAT = 100,000`, `VERIFY_PRICE = 250,000` — all constants, not from property data. |
| 4.2 | **Reserve payment is a query-param simulation** | 🔌 | `ReservePaymentModal` — navigates with `?reserveSuccess=1`. No actual payment processed. |
| 4.3 | **Wallet balance hardcoded at ₦200,000,000** | 🔌 | `ReservePaymentModal` line 44 — same issue as `PaymentOptionsModal`. |
| 4.4 | **Both payment methods are identical** | 🔧 | `ReservePaymentModal` — both buttons call `choose()` with different strings but do the same thing. |
| 4.5 | **"Chat Agent" in reserve confirmation is navigation-only** | 🔧 | `ReserveConfirmationModal` — same pattern as booking confirmation. |

---

## 5. Chat Modal (`src/components/ChatModal.tsx`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 5.1 | **Messages are hardcoded Lorem ipsum** | 🎨 | Chat history shows static placeholder text ("Hi Sir", Lorem ipsum…). Not connected to `useMessagesStore`. |
| 5.2 | **"Send" button unwired** | 🎨 | Send button has no `onClick` handler. Text can be typed but not sent. |
| 5.3 | **File attachment button unwired** | 🎨 | File icon button has no handler. |
| 5.4 | **Photo button unwired** | 🎨 | Photo icon button has no handler. |
| 5.5 | **Video/phone call button unwired** | 🎨 | Phone icon button at top of modal has no handler. |
| 5.6 | **Property context card is hardcoded** | 🔌 | Shows "3-Bed Duplex, Lekki, ₦25,000" — not tied to the listing being viewed. |

---

## 6. Push Notification Manager (`src/components/PushNotificationManager.tsx`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 6.1 | **No backend subscription** | 🔌 | `handleEnable()` calls `Notification.requestPermission()` and shows a test push, but never POSTs the subscription to a server. Notifications are browser-local only. |
| 6.2 | **Service worker may not exist** | 🔧 | Registers `/sw.js` — confirm this file exists in `/public` and is properly configured for push events. |
| 6.3 | **`isSubscribed` unused** | 🔧 | `PushNotificationManager.tsx` line 13 — `isSubscribed` is assigned but never read. UI doesn't reflect subscription state. |

---

## 7. Footer (`src/components/Footer.tsx`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 7.1 | **10+ dead route links** | 🎨 | The following footer links navigate to pages that don't exist: `/escrow`, `/agent-onboarding`, `/diaspora-services`, `/legal-support`, `/inspection`, `/faqs`, `/help`, `/contact`, `/privacy`, `/terms`. All return 404. |
| 7.2 | **Social media links are `#` stubs** | 🔧 | All social icon links use `href="#"`. Replace with real profile URLs or remove. |

---

## 8. Login Page (`src/app/auth/login/page.tsx`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 8.1 | **Login accepts any credentials** | 🚨🔌 | `login()` action uses setTimeout and creates a mock user (`id='agent-123'`, name=`'Waden Warren'`) for any email/password combo that passes client-side validation. No backend check. Comment explicitly says "replace setTimeout body with real API call". |
| 8.2 | **Google OAuth shows `alert("Google OAuth Coming Soon")`** | 🎨 | Social login button calls `alert()`. Implement OAuth or remove the button. |

---

## 9. Signup Flow (`src/app/auth/signup/`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 9.1 | **Google OAuth shows `alert()` on account page** | 🎨 | Same as login — `alert("Google OAuth Coming Soon")` on Step 2. |
| 9.2 | **OTP accepts any 6-digit code** | 🚨🔌 | `signup/verify/page.tsx` — `validateOtp()` checks only format (length=6, digits only). Any code like `000000` or `123456` is accepted. No backend validation. |
| 9.3 | **Resend code shows `alert()`** | 🔌 | `signup/verify/page.tsx` line 69 — "Resend" button calls `alert(t('auth.codeResent'))`. No email is actually re-sent. |
| 9.4 | **Selected role is lost on success** | 🚨🔧 | `signup/success/page.tsx` line 31 — created user is always assigned role `'Agent'` regardless of the role selected in Step 1. The `useSignupStore` role is never read here. |
| 9.5 | **User created locally, never persisted** | 🔌 | `signup/success/page.tsx` — generates user with `id: user-${Date.now()}` and avatar from Unsplash. No backend registration call. |

---

## 10. Password Reset Flow (`src/app/auth/reset/`)

| # | Item | Type | Notes |
|---|------|------|-------|
| 10.1 | **Reset email not actually sent** | 🔌 | `reset/page.tsx` — setTimeout then navigates to verify page. No email sent to the user. |
| 10.2 | **OTP accepts any 6-digit code** | 🚨🔌 | `reset/verify/page.tsx` — same as signup OTP: format-only validation. Any 6-digit code passes. |
| 10.3 | **Resend code shows `alert()`** | 🔌 | `reset/verify/page.tsx` line 57 — same stub as signup resend. |
| 10.4 | **New password never persisted** | 🔌 | `reset/new-password/page.tsx` — setTimeout shows success but password is held in component state and never sent to a server. |

---

## 11. Auth Store Issues

| # | Item | Type | Notes |
|---|------|------|-------|
| 11.1 | **`useAuthStore` is in-memory only** | 🔌 | Login state lost on page refresh. Add Zustand `persist` middleware or cookie-based session. |
| 11.2 | **Favourites API endpoint may not exist** | 🔌 | `useFavouritesStore` calls `PATCH /api/listings/{id}/favourite` — fire-and-forget with catch-and-rollback. Confirm endpoint exists before shipping. |

---

## 12. Validation Issues

| # | Item | Type | Notes |
|---|------|------|-------|
| 12.1 | **`validateOtp()` is format-only** | 🚨🔧 | `src/lib/utils/authValidation.ts` — function validates length and digit-only format but never checks correctness. This is used in both signup and password reset. When backend is integrated, OTP must be validated server-side before advancing. |

---

## Summary Counts

| Section | Total | 🔌 Backend | 🎨 UI+Backend | 🔧 Wiring | 🚨 Security |
|---------|-------|-----------|--------------|----------|------------|
| Navbar | 3 | 0 | 3 | 0 | 0 |
| Hero | 2 | 0 | 2 | 0 | 0 |
| Book Tour Modals | 6 | 3 | 0 | 3 | 0 |
| Reserve Modals | 5 | 3 | 0 | 2 | 0 |
| Chat Modal | 6 | 1 | 5 | 0 | 0 |
| Push Notifications | 3 | 1 | 0 | 2 | 0 |
| Footer | 2 | 0 | 1 | 1 | 0 |
| Login | 2 | 1 | 1 | 0 | 1 |
| Signup | 5 | 3 | 1 | 1 | 2 |
| Password Reset | 4 | 3 | 0 | 0 | 1 |
| Auth Stores | 2 | 2 | 0 | 0 | 0 |
| Validation | 1 | 0 | 0 | 1 | 1 |
| **Total** | **41** | **17** | **13** | **10** | **5** |

> 🚨 **5 security-relevant gaps**: any-code OTP (×2), any-credential login, role ignored on signup, OTP format-only validation.
