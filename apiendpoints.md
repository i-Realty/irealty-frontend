# i-Realty API Endpoints Reference

This document lists every backend endpoint the i-Realty frontend needs, the exact request/response shapes, and questions to align with the backend developer before integration.

> **Base URL**: configured via `NEXT_PUBLIC_API_URL` environment variable.  
> **Auth**: every protected endpoint expects `Authorization: Bearer <token>` (JWT).  
> **Token storage**: the frontend reads the token from `localStorage → irealty-auth → state.token`.

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [User Profile & Settings](#2-user-profile--settings)
3. [KYC (Know Your Customer)](#3-kyc)
4. [Properties — Public Listings](#4-properties--public-listings)
5. [Properties — Owner Management](#5-properties--owner-management)
6. [Media Upload](#6-media-upload)
7. [Tour Bookings](#7-tour-bookings)
8. [Transactions & Escrow](#8-transactions--escrow)
9. [Wallet & Payouts](#9-wallet--payouts)
10. [Messages / Chat](#10-messages--chat)
11. [Notifications](#11-notifications)
12. [Calendar & Availability](#12-calendar--availability)
13. [Documents (Rental / Sale Agreements)](#13-documents)
14. [Admin Panel](#14-admin-panel)
15. [Developer Projects (Off-Plan)](#15-developer-projects-off-plan)
16. [Diaspora Services](#16-diaspora-services)
17. [Dashboard Stats](#17-dashboard-stats)
18. [Questions for the Backend Developer](#18-questions-for-the-backend-developer)

---

## 1. Authentication

### `POST /auth/register`
Register a new user.

**Request body:**
```json
{
  "role": "Agent | Property Seeker | Developer | Landlord | Diaspora",
  "username": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "message": "Verification email sent",
  "userId": "string"
}
```

---

### `POST /auth/verify-email`
Submit the OTP sent to the user's email after registration.

**Request body:**
```json
{ "userId": "string", "otp": "string" }
```
**Response:** `{ "message": "Email verified" }`

---

### `POST /auth/login`
**Request body:**
```json
{ "email": "string", "password": "string" }
```
**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "Agent | Property Seeker | Developer | Landlord | Diaspora | Admin",
    "displayName": "string",
    "avatarUrl": "string",
    "kycStatus": "unverified | in-progress | verified",
    "accountStatus": "active | suspended | deactivated"
  }
}
```

---

### `POST /auth/logout`
Invalidates the token server-side.  
**Request:** authenticated, no body.  
**Response:** `204 No Content`

---

### `POST /auth/forgot-password`
**Request body:** `{ "email": "string" }`  
**Response:** `{ "message": "Reset link sent" }`

---

### `POST /auth/verify-reset-otp`
**Request body:** `{ "email": "string", "otp": "string" }`  
**Response:** `{ "resetToken": "string" }` (short-lived token for the next step)

---

### `POST /auth/reset-password`
**Request body:**
```json
{ "resetToken": "string", "newPassword": "string", "confirmPassword": "string" }
```
**Response:** `{ "message": "Password updated" }`

---

### `GET /auth/me`
Refresh the current user's profile (called on app load to sync session).  
**Response:** same `user` object as login.

---

## 2. User Profile & Settings

### `GET /users/me/profile`
Fetch the current user's full profile.

**Response:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "displayName": "string",
  "phone": "string",
  "phoneCode": "string",
  "about": "string",
  "avatarUrl": "string",
  "socials": {
    "linkedin": "string",
    "facebook": "string",
    "instagram": "string",
    "twitter": "string"
  }
}
```

---

### `PATCH /users/me/profile`
Update profile fields.  
**Request body:** any subset of the profile fields above (partial update).  
**Response:** updated profile object.

---

### `POST /users/me/avatar`
Upload a profile photo.  
**Request:** `multipart/form-data` with field `avatar` (image file).  
**Response:** `{ "avatarUrl": "string" }`

---

### `PATCH /users/me/password`
**Request body:**
```json
{ "currentPassword": "string", "newPassword": "string", "confirmPassword": "string" }
```
**Response:** `{ "message": "Password changed" }`

---

### `PATCH /users/me/pin`
Change the transaction PIN.  
**Request body:**
```json
{ "currentPin": "string", "newPin": "string", "confirmPin": "string" }
```
**Response:** `{ "message": "PIN updated" }`

---

### `PATCH /users/me/payout`
Save bank or crypto payout details.

**Request body:**
```json
{
  "activeMethod": "Bank | Crypto",
  "bank": {
    "bankName": "string",
    "accountName": "string",
    "accountNumber": "string"
  },
  "crypto": {
    "currency": "USDT | BTC | ETH",
    "address": "string"
  }
}
```
**Response:** `{ "message": "Payout details saved" }`

---

### `PATCH /users/me/commission`
Agent sets their commission structure.

**Request body:**
```json
{ "feeType": "Percentage | Amount", "value": 5.0 }
```
**Response:** `{ "message": "Commission updated" }`

---

### `POST /support/ticket`
Submit a help center ticket.

**Request body:**
```json
{
  "username": "string",
  "email": "string",
  "subject": "string",
  "description": "string"
}
```
**Response:** `{ "ticketId": "string", "message": "Ticket submitted" }`

---

### `DELETE /users/me`
Deactivate / delete the current user's account.  
**Response:** `204 No Content`

---

## 3. KYC

### `POST /kyc/start`
Initiate KYC for the current user.  
**Response:** `{ "kycId": "string" }`

---

### `POST /kyc/identity`
Submit BVN + personal identity details (Step 1).

**Request body:**
```json
{
  "bvn": "string (11 digits)",
  "firstName": "string",
  "lastName": "string",
  "dateOfBirth": "YYYY-MM-DD",
  "address": "string",
  "postalCode": "string",
  "city": "string"
}
```
**Response:** `{ "message": "Identity submitted" }`

---

### `POST /kyc/phone/send-otp`
Trigger SMS OTP to the user's registered phone for KYC step 2.  
**Response:** `{ "message": "OTP sent" }`

---

### `POST /kyc/phone/verify-otp`
**Request body:** `{ "otp": "string (6 digits)" }`  
**Response:** `{ "message": "Phone verified" }`

---

### `POST /kyc/document`
Upload a government-issued ID (Step 3).

**Request body:**
```json
{
  "idType": "National ID | Driver's License | Voter's Card | International Passport",
  "idNumber": "string"
}
```
Plus a `multipart/form-data` file field `idDocument` (image/PDF of the ID).  
**Response:** `{ "message": "Document submitted" }`

---

### `POST /kyc/document/developer`
Same as above but also includes CAC registration (Developers only).

**Request body:** same as above plus:
```json
{ "cacNumber": "string (optional)" }
```
Plus optional `multipart/form-data` field `cacDocument`.

---

### `POST /kyc/face-match`
Upload a selfie for face-matching against the submitted ID (Step 4).

**Request body:** `multipart/form-data` with field `selfie` (image).  
**Response:** `{ "message": "Face match submitted" }`

---

### `POST /kyc/payment-details`
Save bank details for payout during KYC (Step 5).

**Request body:**
```json
{
  "bankName": "string",
  "accountNumber": "string (10 digits)",
  "accountName": "string"
}
```
**Response:** `{ "message": "Payment details saved" }`

---

### `POST /kyc/submit`
Final KYC submission — puts the user into `in-progress` status pending admin review.  
**Response:** `{ "kycStatus": "in-progress" }`

---

### `GET /kyc/status`
Poll current KYC status.  
**Response:**
```json
{
  "kycStatus": "unverified | in-progress | verified",
  "kycProgress": 60,
  "rejectionReason": "string | null"
}
```

---

## 4. Properties — Public Listings

### `GET /listings`
Paginated, filterable list of all verified properties shown on `/listings`.

**Query params:**
| Param | Type | Description |
|---|---|---|
| `page` | number | Page number (default 1) |
| `limit` | number | Items per page (default 12) |
| `category` | string | `Residential \| Commercial \| Plots/Lands \| Service Apartments & Short Lets \| PG/Hostel \| Off-Plan` |
| `listingType` | string | `For Sale \| For Rent` |
| `state` | string | Nigerian state name |
| `lga` | string | Local Government Area |
| `city` | string | City / neighbourhood |
| `priceMin` | number | Min price (₦) |
| `priceMax` | number | Max price (₦) |
| `bedrooms` | number | Exact bedroom count |
| `amenities` | string | Comma-separated list |
| `source` | string | `agent \| developer \| landlord` |
| `q` | string | Free-text search |

**Response:**
```json
{
  "data": [ /* array of PropertyWithCoords */ ],
  "meta": { "total": 0, "page": 1, "limit": 12, "totalPages": 4 }
}
```

**Property object shape:**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "category": "string",
  "listingType": "For Sale | For Rent",
  "price": 15000000,
  "priceType": "Per Month | Per Year | One-Time | null",
  "state": "Lagos",
  "lga": "Eti-Osa",
  "city": "Lekki Phase 1",
  "address": "string",
  "lat": 6.4698,
  "lng": 3.5852,
  "bedrooms": 3,
  "bathrooms": 2,
  "sizeSqm": 120,
  "amenities": ["Parking Space", "Swimming Pool"],
  "media": ["https://..."],
  "virtualTourUrl": "string | null",
  "isVerified": true,
  "agent": "string",
  "agentId": "string",
  "listedAt": "ISO date",
  "priceReduced": false,
  "originalPrice": "string | null"
}
```

---

### `GET /listings/developers`
Same structure as above, filtered to `source=developer` and supports `Off-Plan` category.

---

### `GET /listings/:id`
Single property detail.  
**Response:** full property object (same shape as above) plus:
```json
{
  "landmarks": [{ "name": "string", "distance": "string" }],
  "documents": ["C of O", "Survey Plan"],
  "milestones": [{ "stage": "string", "percentage": 25, "amount": 5000000 }],
  "ownerName": "string",
  "ownerAvatar": "string",
  "ownerRole": "Agent | Developer | Landlord"
}
```

---

### `GET /listings/:id/similar`
Returns up to 6 similar properties (same category + state).  
**Response:** `{ "data": [ /* array of property objects */ ] }`

---

### `GET /agents/:id/profile`
Public agent/developer/landlord profile shown on listing detail pages.

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "avatarUrl": "string",
  "role": "Agent | Developer | Landlord",
  "isVerified": true,
  "totalListings": 12,
  "totalDeals": 30,
  "joinedAt": "ISO date",
  "about": "string",
  "socials": {}
}
```

---

## 5. Properties — Owner Management

### `GET /my/properties`
List all properties belonging to the logged-in owner (Agent / Developer / Landlord).

**Query params:** `page`, `limit`, `status` (`draft | pending_review | verified | rejected | flagged`)  
**Response:** paginated list of property objects with `status` and `moderationNotes`.

---

### `POST /my/properties`
Create and submit a new property for review.

**Request body:**
```json
{
  "category": "string",
  "listingType": "For Sale | For Rent",
  "propertyStatus": "Ready | Under Construction",
  "title": "string",
  "description": "string",
  "state": "string",
  "lga": "string",
  "city": "string",
  "address": "string",
  "landmarks": ["string"],
  "bedrooms": 3,
  "bathrooms": 2,
  "sizeSqm": 120,
  "amenities": ["string"],
  "media": ["url1", "url2"],
  "virtualTourUrl": "string | null",
  "price": 15000000,
  "priceType": "Per Month | Per Year | One-Time | null",
  "securityDeposit": 0,
  "agencyFee": 0,
  "legalFee": 0,
  "cautionFee": 0,
  "documentTypes": ["C of O"],
  "zoningType": "string | null",
  "unitsFloors": "string | null",
  "parkingCapacity": "string | null",
  "milestones": []
}
```
**Response:** created property object with `id` and `status: "pending_review"`.

---

### `PATCH /my/properties/:id`
Edit an existing property (only allowed if `status === "draft"` or `"rejected"`).  
**Request body:** any subset of the create body above.  
**Response:** updated property object.

---

### `DELETE /my/properties/:id`
Delete a draft property.  
**Response:** `204 No Content`

---

### `POST /my/properties/:id/submit`
Re-submit a rejected property for review.  
**Response:** `{ "status": "pending_review" }`

---

## 6. Media Upload

### `POST /media/upload`
Upload one or more property images or documents.

**Request:** `multipart/form-data`
| Field | Description |
|---|---|
| `files` | one or more image/PDF files |
| `context` | `"property" \| "kyc" \| "document" \| "avatar"` |

**Response:**
```json
{ "urls": ["https://cdn.example.com/file1.jpg", "..."] }
```

---

## 7. Tour Bookings

### `POST /bookings`
Seeker books a property tour.

**Request body:**
```json
{
  "propertyId": "string",
  "agentId": "string",
  "date": "YYYY-MM-DD",
  "timeSlot": "11:00 AM - 1:00 PM",
  "type": "in-person | video",
  "inspectionFee": 5000
}
```
**Response:**
```json
{
  "bookingId": "string",
  "status": "pending",
  "paymentReference": "string",
  "inspectionFee": 5000,
  "platformFee": 500,
  "totalAmount": 5500
}
```

---

### `POST /bookings/:id/pay`
Confirm payment for a booking (after Paystack/Flutterwave payment completes).

**Request body:**
```json
{ "paymentReference": "string", "paymentGateway": "Paystack | Flutterwave" }
```
**Response:** `{ "status": "confirmed" }`

---

### `POST /bookings/:id/confirm`
Agent/Landlord confirms the booking.  
**Response:** `{ "status": "confirmed" }`

---

### `POST /bookings/:id/cancel`
Cancel a booking.  
**Request body:** `{ "reason": "string" }`  
**Response:** `{ "status": "cancelled" }`

---

### `POST /bookings/:id/complete`
Mark a tour as completed.  
**Response:** `{ "status": "completed" }`

---

### `GET /my/bookings`
List all bookings for the current user (both as seeker and as agent).

**Query params:** `page`, `limit`, `status`, `role` (`seeker | agent`)  
**Response:** paginated list of booking objects.

---

### `GET /agents/:id/availability`
Get an agent's available time slots for a given date range.

**Query params:** `from` (date), `to` (date)  
**Response:**
```json
{
  "slots": [
    { "date": "2025-08-01", "times": ["9:00 AM - 11:00 AM", "2:00 PM - 4:00 PM"] }
  ]
}
```

---

### `POST /my/availability`
Agent saves their available inspection slots.

**Request body:**
```json
{
  "slots": [
    { "date": "YYYY-MM-DD", "time": "9:00 AM - 11:00 AM" }
  ]
}
```
**Response:** `{ "message": "Availability saved" }`

---

## 8. Transactions & Escrow

### `GET /my/transactions`
Paginated list of all transactions for the current user.

**Query params:** `page`, `limit`, `tab` (`all | inspection | sales | rentals`), `status`, `q`  
**Response:**
```json
{
  "data": [
    {
      "id": "TRN-0932",
      "date": "ISO date",
      "propertyName": "string",
      "propertyType": "string",
      "clientName": "string",
      "clientAvatar": "string",
      "transactionCategory": "Inspection Fee | Sale | Rental | Developer Milestone | Diaspora Service",
      "inspectionType": "In Person | Video Chat | null",
      "amount": 5000,
      "status": "Pending | In-progress | Completed | Declined",
      "currentStep": 2,
      "escrowAmount": 5000,
      "propertyPrice": 15000000,
      "irealtyFee": 500,
      "scheduledDate": "string | null",
      "scheduledTime": "string | null",
      "propertyImage": "string",
      "propertyTag": "For Sale | For Rent",
      "propertyLocation": "string",
      "propertyBeds": 3,
      "propertyBaths": 2,
      "propertySqm": 120
    }
  ],
  "meta": { "total": 0, "page": 1, "totalPages": 1 }
}
```

---

### `GET /my/transactions/:id`
Single transaction detail.  
**Response:** full transaction object as above.

---

### `POST /transactions/:id/accept`
Agent/Landlord accepts a pending transaction.  
**Response:** `{ "status": "In-progress" }`

---

### `POST /transactions/:id/decline`
**Request body:** `{ "reason": "string" }`  
**Response:** `{ "status": "Declined" }`

---

### `POST /transactions/:id/confirm-handover`
Agent confirms the property has been handed over to the buyer/tenant.  
**Response:** `{ "status": "Completed" }`

---

### `POST /transactions/:id/release-escrow`
Admin or automated trigger to release funds from escrow to the agent/landlord.  
**Response:** `{ "message": "Escrow released", "amount": 14500000 }`

---

### `POST /transactions/:id/review`
Seeker submits a review after a completed transaction.

**Request body:**
```json
{ "rating": 5, "comment": "Great agent!" }
```
**Response:** `{ "message": "Review submitted" }`

---

## 9. Wallet & Payouts

### `GET /my/wallet`
Fetch wallet balances and recent ledger entries.

**Response:**
```json
{
  "walletBalance": 25000000,
  "escrowBalance": 5000000,
  "transactions": [
    {
      "id": "string",
      "type": "Deposit | Withdrawal | Credit | Debit | Refund",
      "amount": 5000,
      "status": "Completed | Pending | Failed",
      "date": "ISO date",
      "description": "string"
    }
  ]
}
```

---

### `POST /my/wallet/deposit`
Initiate a wallet top-up (Paystack / Flutterwave).

**Request body:**
```json
{ "amount": 50000, "paymentGateway": "Paystack | Flutterwave" }
```
**Response:**
```json
{ "paymentReference": "string", "paymentUrl": "string" }
```

---

### `POST /my/wallet/deposit/verify`
Verify a deposit after the gateway callback.

**Request body:**
```json
{ "paymentReference": "string" }
```
**Response:** `{ "walletBalance": 75000, "message": "Deposit confirmed" }`

---

### `POST /my/wallet/withdraw`
Request a withdrawal.

**Request body:**
```json
{
  "amount": 20000,
  "method": "Fiat | Crypto",
  "bankDetails": {
    "bankName": "string",
    "accountName": "string",
    "accountNumber": "string"
  },
  "cryptoDetails": {
    "network": "string",
    "address": "string"
  }
}
```
**Response:**
```json
{ "payoutRequestId": "string", "status": "Pending" }
```

---

### `GET /my/wallet/payouts`
List all payout requests for the current user.  
**Response:** array of payout request objects with `id`, `amount`, `method`, `status`, `requestedAt`, `processedAt`.

---

## 10. Messages / Chat

### `GET /my/chats`
List all chat threads for the current user.

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "participant": { "id": "string", "name": "string", "avatar": "string", "role": "string", "isVerified": true },
      "lastMessage": "string",
      "lastMessageTime": "ISO date",
      "unreadCount": 3,
      "propertyContext": {
        "id": "string",
        "title": "string",
        "priceFormatted": "₦15,000,000",
        "image": "string"
      },
      "contextType": "property | transaction | general | service",
      "contextId": "string"
    }
  ]
}
```

---

### `POST /my/chats`
Start a new chat thread.

**Request body:**
```json
{
  "recipientId": "string",
  "propertyId": "string | null",
  "contextType": "property | transaction | general | service",
  "contextId": "string | null",
  "initialMessage": "string"
}
```
**Response:** created chat thread object.

---

### `GET /my/chats/:chatId/messages`
Fetch message history for a chat thread.

**Query params:** `page`, `limit`, `before` (cursor ISO date for pagination)  
**Response:** paginated array of message objects.

---

### `POST /my/chats/:chatId/messages`
Send a message.

**Request body:**
```json
{
  "content": "string",
  "contentType": "text | document | image_grid | video",
  "files": [
    { "name": "string", "url": "string", "sizeMb": 1.2, "format": "pdf", "pages": 3 }
  ]
}
```
**Response:** created message object with `id`, `createdAt`, `timestamp`.

---

### `POST /my/chats/:chatId/messages/media`
Upload a file attachment within a chat.  
**Request:** `multipart/form-data` with field `file`.  
**Response:** `{ "url": "string", "name": "string", "sizeMb": 1.2, "format": "pdf" }`

---

### `PATCH /my/chats/:chatId/read`
Mark all messages in a thread as read.  
**Response:** `204 No Content`

---

### WebSocket / Real-time
- **Connect:** `wss://<host>/ws?token=<jwt>`  
- **Events to receive:** `new_message`, `chat_created`, `user_typing`, `message_read`  
- **Events to send:** `typing_start`, `typing_stop`

---

## 11. Notifications

### `GET /my/notifications`
Fetch all notifications for the current user.

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "type": "message | tour | kyc | payment | property | system",
      "title": "string",
      "description": "string",
      "read": false,
      "href": "string | null",
      "createdAt": "ISO date"
    }
  ],
  "unreadCount": 4
}
```

---

### `PATCH /my/notifications/:id/read`
Mark a single notification as read.  
**Response:** `204 No Content`

---

### `PATCH /my/notifications/read-all`
Mark all notifications as read.  
**Response:** `204 No Content`

---

### `PATCH /my/notifications/preferences`
Save push/email notification preferences.

**Request body:**
```json
{
  "new_listing": true,
  "price_drop": true,
  "tour_reminder": true,
  "tx_update": true,
  "escrow_alert": true,
  "messages": true,
  "promo": false
}
```
**Response:** `{ "message": "Preferences saved" }`

---

### Push Notifications
The frontend registers a **Service Worker** at `/sw.js` and calls `Notification.requestPermission()`.  
**Backend needs to provide:**  
- A **VAPID public key** for Web Push  
- An endpoint to register push subscriptions: `POST /my/push-subscription` with the full `PushSubscription` object.

---

## 12. Calendar & Availability

### `GET /my/calendar`
Fetch calendar events for a given month.

**Query params:** `year` (number), `month` (1–12)  
**Response:**
```json
{
  "events": [
    {
      "id": "string",
      "type": "Inspection | Viewing | Meeting | Tour | Other",
      "clientName": "string",
      "dateISO": "YYYY-MM-DD",
      "startTime": "9:00 AM",
      "endTime": "11:00 AM",
      "bookingId": "string | null"
    }
  ]
}
```

---

### `POST /my/calendar/availability`
Agent saves available time slots.

**Request body:**
```json
{
  "slots": [ { "date": "YYYY-MM-DD", "time": "9:00 AM - 11:00 AM" } ]
}
```
**Response:** `{ "message": "Availability saved" }`

---

## 13. Documents

### `GET /my/documents`
List all generated documents for the current user.

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "title": "string",
      "type": "Standard Rental Agreement | Property Sale Agreement",
      "propertyReference": "string",
      "size": "245 KB",
      "dateUpdated": "ISO date"
    }
  ]
}
```

---

### `POST /my/documents/generate`
Generate a legal document (rental agreement or sale agreement) from a template.

**Request body:**
```json
{
  "templateType": "Standard Rental Agreement | Property Sale Agreement",
  "title": "string",
  "propertyReference": "string",
  "description": "string",
  "landlordName": "string",
  "landlordContact": "string",
  "landlordAddress": "string",
  "tenantName": "string",
  "tenantContact": "string",
  "tenantAddress": "string",
  "monthlyRent": 350000,
  "securityDeposit": 350000,
  "agencyFee": 175000,
  "legalFee": 100000,
  "leaseDuration": "12 months",
  "startDate": "YYYY-MM-DD",
  "propertyAddress": "string",
  "propertyType": "string",
  "numberOfOccupants": 2,
  "paymentDueDate": "1st of every month",
  "includeUtilities": true,
  "includePetPolicy": false,
  "addMaintenance": true,
  "includeEarlyTermination": true,
  "addAutoRenewal": false
}
```
**Response:**
```json
{ "documentId": "string", "downloadUrl": "string", "previewUrl": "string" }
```

---

### `GET /my/documents/:id/download`
Download a previously generated document as a PDF.  
**Response:** binary PDF stream, `Content-Type: application/pdf`.

---

### `DELETE /my/documents/:id`
Delete a document.  
**Response:** `204 No Content`

---

## 14. Admin Panel

### `GET /admin/stats`
Platform-wide dashboard statistics.

**Response:**
```json
{
  "totalUsers": 4200,
  "activeListings": 830,
  "pendingKyc": 14,
  "totalRevenue": 98000000,
  "escrowBalance": 32000000,
  "pendingPayouts": 7,
  "revenueData": [ { "period": "Jan", "amount": 8000000 } ],
  "userGrowth": [ { "period": "Jan", "agents": 40, "seekers": 120 } ],
  "transactionVolume": [ { "category": "Rental", "count": 300, "amount": 45000000 } ]
}
```

---

### `GET /admin/users`
List all registered users.

**Query params:** `page`, `limit`, `role`, `kycStatus`, `accountStatus`, `q`  
**Response:** paginated array of user summary objects.

---

### `GET /admin/users/:id`
Single user detail including KYC documents.

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "string",
  "kycStatus": "string",
  "joinDate": "ISO date",
  "accountStatus": "active | suspended",
  "totalListings": 5,
  "totalTransactions": 12,
  "kycDocuments": [
    { "step": "Identity", "status": "submitted | verified | pending | rejected" }
  ]
}
```

---

### `PATCH /admin/users/:id/kyc/approve`
Approve a user's KYC submission.  
**Response:** `{ "kycStatus": "verified" }`

---

### `PATCH /admin/users/:id/kyc/reject`
**Request body:** `{ "reason": "string" }`  
**Response:** `{ "kycStatus": "unverified" }`

---

### `PATCH /admin/users/:id/suspend`
Suspend a user account.  
**Request body:** `{ "reason": "string" }`  
**Response:** `{ "accountStatus": "suspended" }`

---

### `PATCH /admin/users/:id/unsuspend`
**Response:** `{ "accountStatus": "active" }`

---

### `GET /admin/properties`
List all properties pending moderation.

**Query params:** `status` (`pending_review | verified | rejected | flagged`), `page`, `limit`

---

### `PATCH /admin/properties/:id/approve`
Approve a property listing.  
**Response:** `{ "status": "verified" }`

---

### `PATCH /admin/properties/:id/reject`
**Request body:** `{ "reason": "string" }`  
**Response:** `{ "status": "rejected" }`

---

### `PATCH /admin/properties/:id/flag`
**Request body:** `{ "reason": "string" }`  
**Response:** `{ "status": "flagged" }`

---

### `GET /admin/transactions`
List all platform transactions with full detail.

**Query params:** `page`, `limit`, `status`, `type`, `q`

---

### `GET /admin/finance`
Financial overview — escrow summary, revenue breakdown, pending payouts.

**Response:**
```json
{
  "totalEscrow": 32000000,
  "pendingPayouts": [ { "id": "string", "userId": "string", "amount": 500000, "method": "Fiat", "requestedAt": "ISO date" } ],
  "revenueBreakdown": {}
}
```

---

### `PATCH /admin/payouts/:id/approve`
Approve a payout request and release funds.  
**Response:** `{ "status": "Approved" }`

---

### `PATCH /admin/payouts/:id/reject`
**Request body:** `{ "reason": "string" }`  
**Response:** `{ "status": "Rejected" }`

---

### `POST /admin/notifications/broadcast`
Send a system notification to all users or a specific role.

**Request body:**
```json
{
  "title": "string",
  "description": "string",
  "targetRole": "All | Agent | Developer | Property Seeker | Landlord | Diaspora",
  "href": "string | null"
}
```
**Response:** `{ "message": "Broadcast sent" }`

---

## 15. Developer Projects (Off-Plan)

### `GET /my/projects`
List all off-plan projects for the current developer.

**Response:** paginated array of project objects with milestones.

---

### `POST /my/projects`
Create a new developer project.

**Request body:** same as `POST /my/properties` plus:
```json
{
  "milestones": [
    { "stage": "Foundation", "percentage": 25, "amount": 5000000 }
  ]
}
```

---

### `PATCH /my/projects/:id`
Edit project details or milestones.

---

### `POST /my/projects/:id/milestones/:milestoneId/release`
Request escrow release for a completed milestone.  
**Response:** `{ "message": "Release request submitted" }`

---

## 16. Diaspora Services

### `GET /diaspora/plans`
List available diaspora service plans.

**Response:**
```json
{
  "plans": [
    {
      "tier": "Basic | Standard | Premium | Concierge",
      "scopeOfService": "string",
      "amount": 150000,
      "description": "string"
    }
  ]
}
```

---

### `POST /diaspora/subscribe`
Diaspora user subscribes to a service plan.

**Request body:**
```json
{ "tier": "Premium", "paymentReference": "string" }
```
**Response:** `{ "subscriptionId": "string", "careRepId": "string", "careRepName": "string" }`

---

### `GET /my/diaspora/invoices`
List invoices for the current diaspora user.

**Response:** array of invoice objects with `id`, `dateIssued`, `serviceType`, `amountDue`, `status`, `dueDate`, `escrowStatus`.

---

### `GET /my/diaspora/transactions`
Diaspora payment history.

---

### `GET /my/diaspora/transactions/:id`
Single diaspora transaction detail with timeline steps.

---

## 17. Dashboard Stats

Each dashboard role gets a summary endpoint:

### `GET /my/dashboard`
Returns stats tailored to the current user's role.

**Agent response:**
```json
{
  "totalListings": 12,
  "activeDeals": 3,
  "closedDeals": 20,
  "upcomingTours": 2,
  "escrowData": { "fundsInEscrow": 5000000, "availableForWithdrawal": 3000000 },
  "revenueData": [ { "day": "Mon", "inspectionFee": 5000, "sales": 200000, "rentals": 150000 } ],
  "recentTransactions": []
}
```

**Developer response:** same but with `sales` only (no `inspectionFee`, `rentals`).

**Landlord response:**
```json
{
  "totalProperties": 5,
  "occupiedUnits": 3,
  "vacantUnits": 2,
  "monthlyIncome": 1050000
}
```

**Seeker response:**
```json
{
  "savedProperties": 12,
  "activeDeals": 3,
  "closedDeals": 5,
  "upcomingTours": 2
}
```

**Diaspora response:**
```json
{
  "activePlan": { "tier": "Premium", "status": "Active", "careRepName": "string" },
  "recentInvoices": [],
  "recentPayments": []
}
```

---

## 18. Questions for the Backend Developer

### Authentication & Security
1. **JWT expiry** — What is the token TTL? Does the API issue a refresh token, and if so what is the refresh endpoint (`POST /auth/refresh`)?
2. **Session cookie** — The frontend also sets `irealty-session` cookie for middleware route protection. Should the backend set an HttpOnly cookie in addition to returning the JWT in the response body?
3. **OAuth / Social login** — Is Google or any other OAuth provider planned? If yes, what are the redirect URLs?

### API Structure
4. **Versioning** — Is the API versioned (e.g. `/v1/...`)? What should the base URL look like in `NEXT_PUBLIC_API_URL`?
5. **Error format** — What does an error response look like? The frontend expects `{ "message": "string" }`. Are there `code` or `errors` fields for field-level validation errors?
6. **Pagination** — Does the API use `page`/`limit` (offset) or cursor-based pagination? The frontend currently expects `{ data: [], meta: { total, page, limit, totalPages } }`.

### Media & File Upload
7. **CDN / Storage** — Where are uploaded files stored (AWS S3, Cloudinary, etc.)? Does the API return a direct CDN URL or a signed URL? Is there a separate upload endpoint or does the property creation endpoint accept multipart form data directly?
8. **Max file size** — What is the max allowed file size per upload?

### Real-time
9. **WebSocket vs SSE** — Is real-time messaging done via WebSocket or Server-Sent Events? What is the exact connection URL and authentication method?
10. **Push notifications** — What VAPID public key should the frontend use for Web Push? What is the endpoint to register a push subscription?

### Payments
11. **Payment gateway** — Is Paystack or Flutterwave (or both) being integrated? The frontend needs the **public key** for the SDK. What webhook URL does the backend expose for payment verification?
12. **Inspection fee** — Who decides the inspection fee amount — the backend or is it a fixed frontend constant? Currently hardcoded as ₦5,000.
13. **Platform fee** — What percentage or flat fee does i-Realty take on each transaction? The frontend needs to compute this for the payment breakdown screen.

### KYC
14. **BVN verification** — Is BVN verified against a third-party service (e.g. Mono, Paystack Identity)? Does the backend handle this or should the frontend integrate directly?
15. **Face match** — Is face-match done by the backend (e.g. Smile Identity, AWS Rekognition)? The frontend just uploads the selfie image.
16. **CAC lookup** — Is the developer's CAC number verified automatically or manually by admin?

### Properties
17. **Coordinates** — Does the backend geocode the property address to `lat/lng` automatically, or must the frontend send coordinates? Currently the frontend does not collect coordinates from the listing creation form.
18. **Property ID format** — The frontend uses both string IDs (from the store, e.g. `prop-001`) and numeric IDs (from static mock data, e.g. `1`, `101`). Confirm: all real IDs will be strings (UUID or similar)?

### Admin
19. **Role enforcement** — Is role-based access control (RBAC) enforced server-side on every endpoint? (It is handled client-side in the middleware currently.)
20. **Payout processing** — When an admin approves a payout, does the backend automatically initiate the bank transfer, or does it just update the status for manual processing?

### Misc
21. **CORS** — What origins will the backend whitelist? Needed for local dev (`localhost:3000`) and production domain.
22. **Rate limiting** — Are there rate limits per endpoint that the frontend should be aware of (e.g. for OTP endpoints)?
23. **Environment variables** — Confirm the full list of env vars the frontend needs from the backend team:
    - `NEXT_PUBLIC_API_URL` — backend base URL
    - `NEXT_PUBLIC_MAPBOX_TOKEN` — already set
    - `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` or `NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY`
    - `NEXT_PUBLIC_VAPID_PUBLIC_KEY` — for Web Push
