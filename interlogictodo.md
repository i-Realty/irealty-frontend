# Inter-Role Logic & Integration TODO

This document maps every fragmentation point between roles on the i-Realty platform and defines exactly what needs to be implemented to make it one cohesive functional unit.

---

## Platform Role Map

```
Admin ─────────────────────────────────────────── oversight of all
  │
  ├── approves/rejects → Agent, Developer, Landlord (KYC)
  ├── moderates → Properties (Pending → Verified/Rejected/Flagged)
  ├── oversees → Escrow releases
  ├── sets → Platform fees (inspection, sale, rental, developer, diaspora)
  └── broadcasts → All roles (system messages)

Agent ──────────────────────────────────────────── listing & facilitation
  ├── creates → Properties (must flow to Admin moderation → Seeker listings)
  ├── receives → Tour booking requests from Seeker/Diaspora
  ├── earns → Inspection fees, sale/rental commissions (→ Wallet)
  └── messages ↔ Seeker, Diaspora, Admin

Developer ──────────────────────────────────────── project sales
  ├── creates → Projects (must flow to Admin moderation → Seeker/Diaspora listings)
  ├── tracks → Milestone payments from Seeker/Diaspora
  ├── earns → Per-milestone payments (→ Wallet, after fee deduction)
  └── messages ↔ Seeker, Diaspora, Admin

Landlord ───────────────────────────────────────── rental properties
  ├── lists → Properties (via Agent or directly)
  ├── receives → Rent, deposit, service fee payments from Seeker
  ├── earns → Net rental income (→ Wallet, after fee deduction)
  └── messages ↔ Seeker, Admin

Seeker ─────────────────────────────────────────── property buyer/renter
  ├── discovers → Properties in listings (published by Agent/Developer/Landlord)
  ├── books → Tours with Agent/Landlord (→ Calendar + Notification)
  ├── pays → Inspection fee, rent, deposit, purchase price (→ Escrow → Wallet)
  └── messages ↔ Agent, Developer, Landlord, Admin

Diaspora ───────────────────────────────────────── remote-managed acquisition
  ├── subscribes → Service plan (Basic/Standard/Premium/Concierge)
  ├── follows → 7-step acquisition timeline (Escrow → Inspection → Legal → Purchase → Construction → Furnishing → Handover)
  ├── pays → Service invoices (→ Escrow → Agent/Developer Wallet)
  └── messages ↔ Agent, Developer, Admin (Care Rep)
```

---

## SECTION 1: PROPERTY LIFECYCLE (Create → Moderate → Publish → Search)

### 1.1 Unified Property Store
**Problem:** Agent creates properties in `useAgentPropertiesStore` (local), Admin sees separate mock properties in `useAdminDashboardStore`, and Seekers search hardcoded data in `/src/lib/data/properties.ts`. These three are completely disconnected.

**What to build:**
- [ ] Create `src/lib/store/usePropertyStore.ts` — a single unified store that holds ALL properties across roles
  - Each property has: `{ id, createdBy: { userId, role }, status: 'draft' | 'pending_review' | 'verified' | 'rejected' | 'flagged', type: 'standard' | 'developer_project', ...propertyFields }`
- [ ] In `useAgentPropertiesStore.ts`: replace `addPropertyLocally()` with a call to `usePropertyStore.submitForReview(property)` — sets status to `'pending_review'`
- [ ] In `useLandlordDashboardStore.ts`: add same submission flow for landlord-listed properties
- [ ] In `useAdminDashboardStore.ts`: replace `MOCK_PROPERTIES` with a selector from `usePropertyStore` filtered to `status === 'pending_review'`
- [ ] Admin `approvePropertyMock()` / `rejectPropertyMock()` → updates `usePropertyStore` property status to `'verified'` or `'rejected'`
- [ ] In `useListingsStore.ts` and `/src/lib/data/properties.ts`: replace hardcoded arrays with `usePropertyStore` selector that returns `status === 'verified'` properties
- [ ] Remove `/src/lib/data/properties.ts`, `standardProperties.ts`, `developerProperties.ts` once store is wired (or keep as seed data for initial state)

**Files to change:** `useAgentPropertiesStore.ts`, `useDeveloperDashboardStore.ts`, `useAdminDashboardStore.ts`, `useListingsStore.ts`, `/app/listings/page.tsx`, `/app/listings/developers/page.tsx`

---

### 1.2 Property Submission Notification
**Problem:** When Agent submits a property, Admin has no notification. When Admin approves/rejects, Agent has no notification.

**What to build:**
- [ ] On `submitForReview()`: call `useNotificationStore.emit('property', agentId, 'Property submitted for review')` for the submitting agent; call `useNotificationStore.emit('property', adminId, 'New property awaiting moderation')` for admin
- [ ] On Admin `approveProperty()`: call `useNotificationStore.emit('property', ownerId, 'Your listing [title] has been approved')` to property owner
- [ ] On Admin `rejectProperty()`: call `useNotificationStore.emit('property', ownerId, 'Your listing [title] was rejected: [reason]')` with rejection reason field

**Files to change:** `usePropertyStore.ts` (new), `useAdminDashboardStore.ts`, `useNotificationStore.ts`

---

## SECTION 2: TOUR BOOKING (Seeker → Agent/Landlord → Calendar)

### 2.1 Tour Booking Persistence
**Problem:** `BookTourModal.tsx` shows a UI but saves nothing. `usePropertyModals.ts` only manages open/close state. Bookings vanish on submit.

**What to build:**
- [ ] Create `src/lib/store/useTourBookingStore.ts` with:
  ```ts
  interface TourBooking {
    id: string
    propertyId: string
    propertyTitle: string
    seekerId: string
    agentId: string  // or landlordId
    date: string
    time: string
    type: 'in-person' | 'video'
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
    inspectionFee: number
    escrowStatus: 'held' | 'released' | 'refunded'
    createdAt: string
  }
  ```
- [ ] In `BookTourModal.tsx`: on submit, call `useTourBookingStore.createBooking(...)` — this saves the booking and triggers downstream effects
- [ ] Wire `createBooking()` to:
  1. Add entry to `useTourBookingStore`
  2. Create a pending transaction in `useSeekerTransactionsStore` (inspection fee)
  3. Create the reverse transaction entry in agent's transaction store
  4. Emit notification to agent: "New tour request for [property]"
  5. Emit notification to seeker: "Tour request submitted"

**Files to change:** `BookTourModal.tsx`, `usePropertyModals.ts`, create `useTourBookingStore.ts`, `useSeekerTransactionsStore.ts`, `useAgentDashboardStore.ts`

---

### 2.2 Calendar Sync
**Problem:** `useCalendarStore.ts` has agent/developer availability and events but tour bookings from Seekers are never added to it.

**What to build:**
- [ ] In `useTourBookingStore.createBooking()`: after saving, call `useCalendarStore.addEvent({ title: 'Tour: [property]', date, time, type: 'tour', seekerName, seekerId, bookingId })`
- [ ] In Agent's messages page: clicking a tour booking notification should deep-link to the calendar event
- [ ] Seeker needs a `/dashboard/seeker/calendar` page (currently missing) — create it showing their upcoming tours using `useTourBookingStore` filtered by `seekerId`

**Files to change:** `useTourBookingStore.ts` (new), `useCalendarStore.ts`, create `/app/dashboard/seeker/calendar/page.tsx`

---

### 2.3 Tour Confirmation by Agent
**Problem:** Agent receives a booking but has no UI to confirm or cancel it.

**What to build:**
- [ ] In Agent's calendar or messages page: add "Confirm" / "Decline" actions on pending tour events
- [ ] `useTourBookingStore.confirmBooking(bookingId)`: sets status to `'confirmed'`, emits notification to seeker: "Your tour on [date] has been confirmed"
- [ ] `useTourBookingStore.cancelBooking(bookingId, reason)`: sets status to `'cancelled'`, triggers inspection fee refund from escrow, emits notification to seeker

**Files to change:** Agent calendar page, `useTourBookingStore.ts`, `useNotificationStore.ts`

---

## SECTION 3: TRANSACTION & PAYMENT FLOW

### 3.1 Unified Transaction Model
**Problem:** Each role has its own transaction store with isolated mock data. There is no shared transaction ledger. A single real-world payment involves: Seeker pays → Escrow holds → Fee deducted → Net to Agent/Landlord/Developer wallet. None of these steps are connected.

**What to build:**
- [ ] Create `src/lib/store/useTransactionLedger.ts` — a central ledger visible by all roles (filtered by their participation):
  ```ts
  interface LedgerEntry {
    id: string
    type: 'inspection' | 'rent' | 'deposit' | 'sale' | 'milestone' | 'service' | 'fee' | 'refund'
    status: 'pending' | 'in_escrow' | 'released' | 'refunded' | 'failed'
    amount: number
    platformFee: number    // calculated from useAdminDashboardStore.platformFees
    netAmount: number      // amount - platformFee
    payerId: string        // Seeker/Diaspora userId
    payeeId: string        // Agent/Landlord/Developer userId
    propertyId: string
    bookingId?: string
    milestoneId?: string
    createdAt: string
    settledAt?: string
  }
  ```
- [ ] Role-specific transaction stores (useSeeker, useAgent, useLandlord, useDeveloper) become **views** on this ledger filtered by `payerId` or `payeeId`
- [ ] Replace all `MOCK_TRANSACTIONS` arrays with computed selectors from `useTransactionLedger`

**Files to change:** Create `useTransactionLedger.ts`, refactor `useSeekerTransactionsStore.ts`, `useAgentDashboardStore.ts`, `useLandlordDashboardStore.ts`, `useDeveloperTransactionsStore.ts`, `useAdminDashboardStore.ts`

---

### 3.2 Platform Fee Application
**Problem:** Admin sets platform fees in `useAdminDashboardStore.platformFees` (lines 316–318) but they are never referenced anywhere in payment calculations. Agents and landlords receive full amounts, fees are never deducted.

**What to build:**
- [ ] Create `src/lib/utils/calculateFees.ts`:
  ```ts
  export function calculateFees(amount: number, transactionType: TransactionType): FeeBreakdown {
    const fees = useAdminDashboardStore.getState().platformFees
    const rateMap = {
      inspection: fees.inspection / 100,
      sale: fees.sale / 100,
      'agent-rental': fees.rental / 100,
      'developer-purchase': fees.developer / 100,
      service: fees.diaspora / 100,
    }
    const fee = amount * rateMap[transactionType]
    return { gross: amount, fee, net: amount - fee }
  }
  ```
- [ ] Call `calculateFees()` inside `useTourBookingStore.createBooking()` and any payment modal before finalizing amounts
- [ ] `useTransactionLedger` entries must store `platformFee` and `netAmount` separately

**Files to change:** Create `src/lib/utils/calculateFees.ts`, `useTourBookingStore.ts`, any payment confirmation modals

---

### 3.3 Escrow Visibility for All Parties
**Problem:** Escrow is only visible in Admin dashboard (`useAdminDashboardStore.MOCK_ESCROW`). Seeker can't see their escrow balance. Agent can't see when escrow is released. Wallet balance is never updated.

**What to build:**
- [ ] Move escrow tracking into `useTransactionLedger` — each transaction has `status: 'in_escrow'` when payment is held
- [ ] In Seeker's wallet page: show breakdown — `walletBalance`, `escrowHeld` (sum of in-escrow transactions where `payerId === currentUser.id`)
- [ ] In Agent/Landlord/Developer wallet page: show `pendingRelease` (sum of in-escrow transactions where `payeeId === currentUser.id`)
- [ ] Admin escrow view (`/admin/finance`) reads from `useTransactionLedger` filtered to `status === 'in_escrow'`
- [ ] Admin `releaseEscrow(transactionId)`:
  1. Sets transaction `status → 'released'`, `settledAt → now`
  2. Calls `useWalletStore.credit(payeeId, netAmount)` — adds net amount to payee wallet
  3. Calls `useWalletStore.debit(adminWallet, platformFee)` — logs platform revenue
  4. Emits notification to payee: "Payment of ₦X released to your wallet"
  5. Emits notification to payer: "Your escrow payment has been released"

**Files to change:** `useWalletStore.ts`, `useAdminDashboardStore.ts`, Seeker wallet page, Agent/Landlord/Developer wallet pages

---

### 3.4 Developer Milestone Flow
**Problem:** Developer milestones exist as mock data in `useDeveloperDashboardStore` but there's no actual flow: Seeker pays milestone → escrow holds → Developer completes milestone → Admin/Seeker approves → Released.

**What to build:**
- [ ] In Seeker's developer property transaction view: show milestone list with "Pay Milestone" button per milestone
- [ ] "Pay Milestone" → creates `LedgerEntry` with `type: 'milestone'`, `status: 'in_escrow'`, links to `milestoneId`
- [ ] Developer dashboard milestone card: show "Mark as Complete" button when corresponding escrow payment exists
- [ ] `useDeveloperDashboardStore.completeMilestone(milestoneId)`: sets milestone `status → 'completed'`, triggers notification to Seeker: "Milestone [name] completed — approve to release funds"
- [ ] Seeker gets "Approve Release" button in their transaction view — on approval, triggers Admin escrow release or auto-releases after X days
- [ ] Developer wallet is credited on release

**Files to change:** Seeker transaction detail page, Developer dashboard project detail, `useDeveloperDashboardStore.ts`, `useTransactionLedger.ts`

---

## SECTION 4: MESSAGING SYSTEM

### 4.1 Role-Aware Message Threads
**Problem:** `useMessagesStore.ts` has one set of mock threads with hardcoded participant names. All roles see the same threads. There's no concept of who can message whom, and threads aren't linked to properties or transactions.

**What to build:**
- [ ] Add `participantRole` to the `UserBase` type in `useMessagesStore.ts`:
  ```ts
  interface UserBase { id: string; name: string; avatarUrl: string; role: UserRole }
  ```
- [ ] Add a `contextType: 'property' | 'transaction' | 'general'` and `contextId` field to `Thread`
- [ ] Replace `fetchThreadsMock()` with a filtered selector: return only threads where `currentUser.id` is in `participants`
- [ ] Implement message permission matrix — restrict thread creation based on this table:

  | From \ To | Admin | Agent | Developer | Landlord | Seeker | Diaspora |
  |-----------|-------|-------|-----------|----------|--------|----------|
  | Admin     | —     | ✅    | ✅        | ✅       | ✅     | ✅       |
  | Agent     | ✅    | —     | —         | ✅       | ✅     | ✅       |
  | Developer | ✅    | —     | —         | —        | ✅     | ✅       |
  | Landlord  | ✅    | ✅    | —         | —        | ✅     | —        |
  | Seeker    | ✅    | ✅    | ✅        | ✅       | —      | —        |
  | Diaspora  | ✅    | ✅    | ✅        | —        | —      | —        |

- [ ] In `startNewThread(toUserId, contextType, contextId)`: validate using the matrix before creating thread — reject with error if not permitted

**Files to change:** `useMessagesStore.ts`, all dashboard `/messages/page.tsx` files

---

### 4.2 Message Initiation from Property/Transaction Context
**Problem:** Seeker can view a property but there's no "Message Agent" button that opens a thread pre-populated with property context.

**What to build:**
- [ ] In `/app/listings/[id]/page.tsx`: add "Message Agent" button in property detail panel
- [ ] On click: call `useMessagesStore.startNewThread(agentId, 'property', propertyId)` — creates thread with property context (title, image, price in header)
- [ ] In Seeker's transaction detail: add "Message [Agent/Landlord/Developer]" button that starts thread with `contextType: 'transaction', contextId: transactionId`
- [ ] In Diaspora's transaction timeline: the Care Rep name/avatar should be a clickable link that opens a message thread

**Files to change:** `/app/listings/[id]/page.tsx`, Seeker transaction detail, Diaspora transaction page, `useMessagesStore.ts`

---

### 4.3 Admin Broadcast & Moderation Messages
**Problem:** Admin has a `BroadcastModal.tsx` component but it isn't wired to actually create notifications or message threads for targeted roles.

**What to build:**
- [ ] `BroadcastModal` on submit: call `useNotificationStore.broadcastToRole(targetRoles[], message, type)` — creates a notification entry for every user of that role
- [ ] Admin message audit page: show all threads across roles (admin-only view) — use `useMessagesStore` with no filter, add read-only mode
- [ ] Dispute escalation: in any thread, add "Escalate to Admin" button that forwards the thread to Admin's messages queue and creates a system notification

**Files to change:** `BroadcastModal.tsx`, `useNotificationStore.ts`, `/app/dashboard/admin/messages/page.tsx`

---

## SECTION 5: KYC VERIFICATION FLOW

### 5.1 KYC for All Roles
**Problem:** KYC modal and progress tracking only exist in `useAgentDashboardStore.ts` and `useDeveloperDashboardStore.ts`. Seeker, Landlord, and Diaspora have no KYC in their stores, even though Admin can see and approve their KYC status in `useAdminDashboardStore.MOCK_USERS`.

**What to build:**
- [ ] Create `src/lib/store/useKYCStore.ts` — a shared KYC store usable by all roles:
  ```ts
  interface KYCStore {
    status: 'unverified' | 'in-progress' | 'verified' | 'rejected'
    progress: number  // 0–100
    currentStep: number
    documents: KYCDocument[]
    submittedAt?: string
    reviewedAt?: string
    reviewNote?: string
    submitForReview: () => void
    advanceStep: (step: number) => void
  }
  ```
- [ ] Remove KYC fields from `useAgentDashboardStore` and `useDeveloperDashboardStore` — import from `useKYCStore` instead
- [ ] Add KYC section to Seeker, Landlord, and Diaspora dashboards (settings page or dedicated `/kyc` route)
- [ ] `useKYCStore.submitForReview()`: sets status to `'in-progress'`, creates notification to Admin: "New KYC submission from [userName] ([role])"

**Files to change:** Create `useKYCStore.ts`, `useAgentDashboardStore.ts`, `useDeveloperDashboardStore.ts`, Seeker/Landlord/Diaspora settings pages

---

### 5.2 Admin KYC → Auth Sync
**Problem:** Admin `approveKycMock()` in `useAdminDashboardStore.ts` changes the mock user's KYC status in that store's local array, but `useAuthStore` (the global user session) is never updated. The user doesn't know their KYC was approved.

**What to build:**
- [ ] When Admin calls `approveKyc(userId)`:
  1. Update `useKYCStore` for that userId: `status → 'verified'`
  2. Update `useAuthStore.kycStatus → 'verified'` for that user's session (via cross-store call or global event)
  3. Emit notification to user: "Your identity has been verified"
- [ ] When Admin calls `rejectKyc(userId, reason)`:
  1. Update `useKYCStore.status → 'rejected'`, set `reviewNote = reason`
  2. Emit notification to user: "KYC rejected: [reason]"
  3. Allow user to re-submit (reset to step 1 with reviewNote shown)
- [ ] Gate certain actions behind KYC: e.g., booking a tour requires `kycStatus !== 'unverified'` — show KYC prompt modal if not verified

**Files to change:** `useAdminDashboardStore.ts`, `useKYCStore.ts`, `useAuthStore.ts`, `BookTourModal.tsx`

---

## SECTION 6: NOTIFICATION SYSTEM (Event-Driven)

### 6.1 Replace Static Mocks with Event Emitters
**Problem:** `useNotificationStore.ts` has 6 hardcoded notifications that never change. No action in the app creates a new notification. The whole system is decorative.

**What to build:**
- [ ] Add an `emit()` method to `useNotificationStore`:
  ```ts
  emit: (type: NotificationType, targetUserId: string, title: string, body?: string, link?: string) => void
  ```
  This creates a real notification entry and pushes it to `notifications[]`
- [ ] Replace all `MOCK_NOTIFICATIONS` with an empty initial array — notifications are generated by actions
- [ ] Add `localStorage` persistence: on `emit()`, save to `localStorage.setItem('notifications_${userId}', ...)` so they survive refresh
- [ ] Add `markAsRead(id)` button to `NotificationDropdown` component — currently the method exists but no UI calls it
- [ ] Notification `link` field: clicking a notification navigates to the relevant page (e.g., tour booking → `/dashboard/seeker/calendar`, KYC approved → `/dashboard/agent/settings`)

**Files to change:** `useNotificationStore.ts`, notification UI components, every store action that should trigger a notification

---

### 6.2 Notification Triggers (Complete List)
Wherever `useNotificationStore.emit()` must be called:

- [ ] Agent/Developer/Landlord **submits property** → Admin notified
- [ ] Admin **approves/rejects property** → Owner notified
- [ ] Seeker **books a tour** → Agent/Landlord notified
- [ ] Agent **confirms/cancels tour** → Seeker notified
- [ ] Seeker **pays inspection fee** → Agent notified, Seeker gets receipt notification
- [ ] Escrow **released by Admin** → Payee notified (wallet credited)
- [ ] Developer **completes milestone** → Seeker notified, prompted to approve
- [ ] Seeker **approves milestone** → Developer notified, funds released
- [ ] Admin **approves KYC** → User notified
- [ ] Admin **rejects KYC** → User notified with reason
- [ ] New **message received** → Recipient notified
- [ ] Admin **broadcasts** to a role → All users of that role notified
- [ ] Diaspora **timeline step advanced** → Diaspora user notified
- [ ] Agent/Developer/Landlord **payout approved** → Notified with amount

**Files to change:** Every store file listed in this document, `useNotificationStore.ts`

---

## SECTION 7: WALLET & PAYOUTS

### 7.1 Wallet Reflects Actual Transactions
**Problem:** `useWalletStore.ts` has a hardcoded `walletBalance: 25000000` and 5 hardcoded ledger entries. Nothing in the app actually changes this balance.

**What to build:**
- [ ] `useWalletStore.credit(userId, amount, sourceTransactionId)`: adds to balance, appends ledger entry of type `'credit'`
- [ ] `useWalletStore.debit(userId, amount, sourceTransactionId)`: subtracts from balance, appends ledger entry of type `'debit'`
- [ ] Wire `credit()` to: escrow release, milestone approval, rent payment received
- [ ] Wire `debit()` to: tour payment (seeker), milestone payment (seeker), service invoice payment (diaspora)
- [ ] Ledger entries must reference `sourceTransactionId` so users can trace "why did my balance change"
- [ ] Remove hardcoded `MOCK_WALLET_ENTRIES` — wallet history is computed from `useTransactionLedger` filtered by userId

**Files to change:** `useWalletStore.ts`, `useTransactionLedger.ts`

---

### 7.2 Payout Request Flow
**Problem:** Agent/Developer/Landlord wallet pages have withdrawal UI but there's no flow for requesting a payout, Admin seeing it, and approving it.

**What to build:**
- [ ] In wallet page: "Request Withdrawal" button → creates `PayoutRequest { id, userId, role, amount, method: 'fiat'|'crypto', bankDetails, status: 'pending' | 'approved' | 'rejected', requestedAt }`
- [ ] `useWalletStore.requestWithdrawal(amount, method)`: saves payout request, emits notification to Admin: "New payout request from [userName]: ₦X"
- [ ] Admin finance page payout queue: lists pending payout requests — currently has static rows, needs to read from `useWalletStore.pendingPayouts`
- [ ] Admin `approvePayout(requestId)`: deducts from payee wallet, marks request `'approved'`, emits notification to payee: "Your withdrawal of ₦X has been approved"
- [ ] Admin `rejectPayout(requestId, reason)`: marks `'rejected'`, emits notification with reason

**Files to change:** `useWalletStore.ts`, `useAdminDashboardStore.ts`, Admin finance page, Agent/Developer/Landlord wallet pages

---

## SECTION 8: DIASPORA-SPECIFIC INTEGRATION

### 8.1 Service Plan → Assigned Care Rep
**Problem:** `useDiasporaDashboardStore` has a `repName` and `repAvatar` field (lines 80–82) but it's hardcoded and there's no flow connecting Diaspora to an actual Agent who acts as their Care Rep.

**What to build:**
- [ ] When Diaspora subscribes to a plan: Admin (or auto-assign) links an `agentId` as Care Rep
- [ ] `useDiasporaDashboardStore.activePlan` should include `careRepId: string`
- [ ] Care Rep is shown in Diaspora dashboard with a "Message" button → `useMessagesStore.startNewThread(careRepId, 'service', planId)`
- [ ] Agent's dashboard: add "Diaspora Clients" view — lists all Diaspora users where `careRepId === currentAgent.id`
- [ ] Care Rep can advance diaspora timeline steps from their agent dashboard (currently Diaspora store has `advanceTimelineStepMock()` but no agent UI for it)

**Files to change:** `useDiasporaDashboardStore.ts`, `useAgentDashboardStore.ts`, Diaspora dashboard page, Agent dashboard page

---

### 8.2 Diaspora Timeline Step Advancement
**Problem:** `advanceTimelineStepMock()` exists in `useDiasporaDashboardStore.ts` (lines 174–198) but is only callable internally. No agent or admin UI triggers it. Timeline steps are static.

**What to build:**
- [ ] Agent's diaspora client detail page: show client's current timeline step, "Mark Step Complete" button
- [ ] `advanceTimelineStep(clientId, stepIndex, documents[])`: validates documents uploaded, sets step `status → 'completed'`, moves next step to `'active'`, emits notification to Diaspora user
- [ ] Each timeline step should have required documents (e.g., Step 3 "Legal Verification" requires title deed upload)
- [ ] Diaspora user can upload documents for their timeline steps — these are reviewed by the Care Rep
- [ ] Admin can also advance timeline steps and override Care Rep (for dispute resolution)

**Files to change:** `useDiasporaDashboardStore.ts`, Agent dashboard, create Diaspora client detail page for agents, `useNotificationStore.ts`

---

### 8.3 Diaspora Invoice → Escrow → Wallet
**Problem:** Diaspora invoices exist as mock data (`useDiasporaDashboardStore.invoices`) but paying an invoice doesn't trigger any escrow entry or wallet credit for the agent.

**What to build:**
- [ ] "Pay Invoice" button in Diaspora transactions: calls `useTransactionLedger.createEntry({ type: 'service', payerId: diasporaUserId, payeeId: careRepId, amount, status: 'in_escrow' })`
- [ ] On payment: advance timeline step 1 ("Funds Held In Escrow") to `'completed'`
- [ ] Emit notification to Care Rep: "Diaspora client [name] paid service invoice ₦X — funds in escrow"
- [ ] On timeline completion (all steps done): Admin releases escrow → Care Rep wallet credited

**Files to change:** Diaspora transactions page, `useDiasporaDashboardStore.ts`, `useTransactionLedger.ts`, `useWalletStore.ts`

---

## SECTION 9: AUTH & ACCESS CONTROL

### 9.1 Role-Based Route Protection
**Problem:** `src/middleware.ts` only checks for a session cookie. Any authenticated user can access `/dashboard/admin` or any other role's dashboard by navigating directly.

**What to build:**
- [ ] In `middleware.ts`: check `useAuthStore.role` (from session) against the route's required role
  - `/dashboard/admin/*` → role must be `'Admin'`
  - `/dashboard/agent/*` → role must be `'Agent'`
  - `/dashboard/developer/*` → role must be `'Developer'`
  - etc.
- [ ] Redirect unauthorized access to `/dashboard/{actualRole}` or a `/403` page
- [ ] Add `requiredKyc` flag to certain routes (e.g., `/listings/[id]/book-tour` requires KYC) — redirect to KYC page if `kycStatus === 'unverified'`

**Files to change:** `src/middleware.ts`, `useAuthStore.ts`

---

### 9.2 Suspended Account Handling
**Problem:** Admin can `suspendUserMock(userId)` in `useAdminDashboardStore.ts` but the suspended user can still log in and use the platform.

**What to build:**
- [ ] Add `accountStatus: 'active' | 'suspended' | 'deactivated'` to `useAuthStore` user object
- [ ] Admin `suspendUser(userId)`: updates the user's `accountStatus → 'suspended'`
- [ ] In `middleware.ts` (or login flow): check `accountStatus` — if `'suspended'`, redirect to a `/suspended` page explaining why
- [ ] Emit notification to suspended user before redirect: "Your account has been suspended. Contact support."

**Files to change:** `useAuthStore.ts`, `useAdminDashboardStore.ts`, `middleware.ts`, create `/app/suspended/page.tsx`

---

## SECTION 10: MISSING PAGES & DEAD LINKS

### 10.1 Create Missing Pages
These routes are referenced in navigation or logic but the pages do not exist:

- [ ] `/dashboard/seeker/calendar` — Seeker needs to see their booked tours (referenced implicitly by tour booking flow)
- [ ] `/dashboard/admin/messages` — Admin message monitoring page (`/admin/messages/page.tsx` needs content)
- [ ] `/suspended` — Shown when account is suspended
- [ ] `/403` — Unauthorized role access
- [ ] `/dashboard/diaspora/[clientId]` — Agent view of a specific diaspora client's timeline

### 10.2 Incomplete Pages to Finish
- [ ] `/listings/[id]/book-tour/payment/page.tsx` — Renders UI but no payment logic connected
- [ ] `/listings/[id]/virtual-tour/page.tsx` — Likely empty or stub
- [ ] `/dashboard/admin/finance/page.tsx` — Payout approval rows are static, need to read from `useWalletStore.pendingPayouts`
- [ ] `/dashboard/seeker/my-properties/page.tsx` — Unclear if this shows purchased properties or favorites; needs disambiguation and connection to `useTourBookingStore` / `useTransactionLedger`

---

## IMPLEMENTATION ORDER (Suggested Priority)

### Phase 1 — Foundation (enables everything else)
1. `usePropertyStore.ts` — unified property lifecycle (Section 1.1)
2. `useTransactionLedger.ts` — central transaction log (Section 3.1)
3. `useKYCStore.ts` — shared KYC (Section 5.1)
4. `useTourBookingStore.ts` — tour persistence (Section 2.1)
5. `useNotificationStore` emit system + localStorage (Section 6.1)

### Phase 2 — Core Flows
6. Wire `BookTourModal` → tour booking → calendar → notifications (Section 2.1, 2.2, 6.2)
7. Wire property submission → admin moderation → seeker listings (Section 1.1, 1.2)
8. Apply platform fees in transactions (Section 3.2)
9. Connect escrow visibility to all parties (Section 3.3)
10. Wire wallet credits/debits to transaction events (Section 7.1)

### Phase 3 — Role Connections
11. Role-aware message threading + permission matrix (Section 4.1)
12. Message initiation from property/transaction context (Section 4.2)
13. KYC sync: Admin approval → useAuthStore (Section 5.2)
14. KYC gating on booking/transactions (Section 5.2)
15. Payout request → Admin approval → wallet debit (Section 7.2)

### Phase 4 — Diaspora & Admin
16. Diaspora service plan → Care Rep assignment (Section 8.1)
17. Timeline step advancement by agent (Section 8.2)
18. Diaspora invoice → escrow → wallet (Section 8.3)
19. Admin broadcast to roles (Section 4.3)
20. Role-based route protection + suspended account handling (Section 9.1, 9.2)

### Phase 5 — Missing Pages
21. Seeker calendar page (Section 10.1)
22. Admin messages monitoring (Section 10.1)
23. Payment page logic (Section 10.2)
24. Suspended/403 pages (Section 10.1)

---

## Quick Reference: Store Responsibility After Refactor

| Store | Owns | Used By |
|-------|------|---------|
| `useAuthStore` | User session, role, kycStatus, accountStatus | All |
| `useKYCStore` | KYC progress, documents, status | All roles + Admin |
| `usePropertyStore` | All properties, lifecycle status | Agent, Developer, Landlord, Admin, Seeker, Diaspora |
| `useTourBookingStore` | Tour requests, status, calendar links | Seeker, Agent, Landlord, Admin |
| `useTransactionLedger` | All financial transactions, escrow status | All roles |
| `useWalletStore` | Per-user balance, ledger, payout requests | Agent, Developer, Landlord, Seeker, Diaspora, Admin |
| `useMessagesStore` | Threads, messages, role-filtered | All roles |
| `useNotificationStore` | Event-driven notifications, persistence | All roles |
| `useCalendarStore` | Availability, tour events | Agent, Developer, Seeker |
| `useDiasporaDashboardStore` | Service plan, timeline, invoices | Diaspora, Agent (Care Rep), Admin |
| `useAdminDashboardStore` | Platform config, fee settings, overrides | Admin only |
| `useListingsStore` | Search filters, results (reads from usePropertyStore) | Seeker, Diaspora |
