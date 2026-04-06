# API_SPEC.md — i-Realty Backend API Specification

> Derived from Zustand store mock functions. This is the API contract the frontend expects.
> Use this as the spec when building the backend or connecting to an existing one.

## Authentication

All protected endpoints require a Bearer token in the `Authorization` header:
```
Authorization: Bearer <jwt_token>
```

Public endpoints (listings, property details) require no auth.
Agent endpoints require an authenticated agent session.

---

## Auth Endpoints

### POST /api/auth/login

Login with email and password. Returns JWT token and user profile.

**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "token": "string (JWT)",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "Property Seeker | Property Owner | Real Estate Agent | Diaspora Investors | Developers"
  }
}
```

**Errors:** `401 Invalid credentials`, `422 Validation error`

**Store:** `useAuthStore.login()`

---

### POST /api/auth/signup

Register a new account. Multi-step on frontend, single API call.

**Request:**
```json
{
  "role": "Property Seeker | Property Owner | Real Estate Agent | Diaspora Investors | Developers",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "password": "string"
}
```

**Response (201):**
```json
{
  "message": "Verification email sent",
  "userId": "string"
}
```

**Store:** `useSignupStore` (collects data across steps)

---

### POST /api/auth/verify-email

Verify email with OTP code.

**Request:**
```json
{
  "userId": "string",
  "code": "string (6 digits)"
}
```

**Response (200):**
```json
{
  "token": "string (JWT)",
  "user": { ... }
}
```

---

### POST /api/auth/reset-password

Request password reset email.

**Request:**
```json
{
  "email": "string"
}
```

**Response (200):**
```json
{
  "message": "Reset code sent"
}
```

---

### POST /api/auth/reset-password/confirm

Set new password after verification.

**Request:**
```json
{
  "email": "string",
  "code": "string",
  "newPassword": "string"
}
```

**Response (200):**
```json
{
  "message": "Password updated"
}
```

---

## Listings Endpoints (Public)

### GET /api/listings

Fetch property listings with optional filters.

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `type` | `sale \| rent \| shortlet` | Listing category |
| `propertyType` | `string` | Residential, Commercial, etc. |
| `minPrice` | `number` | Minimum price (NGN) |
| `maxPrice` | `number` | Maximum price (NGN) |
| `beds` | `number` | Minimum bedrooms |
| `baths` | `number` | Minimum bathrooms |
| `amenities` | `string` (comma-separated) | Required amenities |
| `search` | `string` | Text search (title, location) |
| `page` | `number` | Page number (default: 1) |
| `limit` | `number` | Items per page (default: 12) |
| `sort` | `newest \| price_asc \| price_desc` | Sort order |
| `bounds` | `string` | Map bounds `sw_lng,sw_lat,ne_lng,ne_lat` |

**Response (200):**
```json
{
  "properties": [
    {
      "id": "number",
      "title": "string",
      "location": "string",
      "price": "number (raw NGN)",
      "priceFormatted": "string (₦ 20,000,000)",
      "beds": "number | null",
      "baths": "number | null",
      "area": "string | null",
      "tag": "For Rent | For Sale",
      "image": "string (URL)",
      "images": ["string (URL)"],
      "agent": "string (agent name)",
      "agentId": "number",
      "lat": "number",
      "lng": "number",
      "category": "sale | rent | shortlet",
      "neighbourhood": "string",
      "isVerified": "boolean",
      "hasVirtualTour": "boolean",
      "listedAt": "string (ISO date)",
      "priceReduced": "boolean",
      "originalPrice": "string | null",
      "sizeSqm": "number | null"
    }
  ],
  "total": "number",
  "page": "number",
  "totalPages": "number"
}
```

**Stores:** `useListingsStore`, `useDeveloperListingsStore`

---

### GET /api/listings/:id

Fetch single property with full details.

**Response (200):**
```json
{
  "id": "number",
  "title": "string",
  "location": "string",
  "price": "number",
  "priceFormatted": "string",
  "description": "string",
  "beds": "number",
  "baths": "number",
  "area": "string",
  "tag": "For Rent | For Sale",
  "images": ["string (URL)"],
  "agent": {
    "id": "number",
    "name": "string",
    "avatar": "string (URL)",
    "phone": "string",
    "isVerified": "boolean",
    "listings": "number",
    "reviews": "number"
  },
  "amenities": ["string"],
  "documents": [
    { "name": "string", "type": "string", "url": "string" }
  ],
  "landmarks": [
    { "name": "string", "type": "string", "distance": "string" }
  ],
  "lat": "number",
  "lng": "number",
  "isVerified": "boolean",
  "hasVirtualTour": "boolean",
  "listedAt": "string (ISO date)",
  "similarProperties": [ ... ]
}
```

---

### PATCH /api/listings/:id/favourite

Toggle favourite status on a property. Requires auth.

**Request:**
```json
{
  "favourited": "boolean"
}
```

**Response (200):**
```json
{
  "favourited": "boolean"
}
```

**Store:** `useFavouritesStore.toggleLike()` (optimistic update)

---

### GET /api/listings/favourites

Get user's favourited property IDs. Requires auth.

**Response (200):**
```json
{
  "ids": [1, 2, 3]
}
```

**Store:** `useFavouritesStore.hydrate()`

---

## Agent Dashboard Endpoints (Protected)

### GET /api/dashboard

Fetch agent dashboard data. Returns stats, revenue, transactions.

**Response (200):**
```json
{
  "profile": {
    "id": "string",
    "name": "string",
    "avatarUrl": "string",
    "kycStatus": "unverified | in-progress | verified",
    "kycProgress": "number (0-100)"
  },
  "stats": {
    "totalListings": "number",
    "activeDeals": "number",
    "closedDeals": "number",
    "upcomingTours": "number"
  },
  "revenueData": [
    {
      "day": "string (Mon, Tue...)",
      "inspectionFee": "number",
      "sales": "number",
      "rentals": "number"
    }
  ],
  "escrowData": {
    "fundsInEscrow": "number",
    "availableForWithdrawal": "number"
  },
  "transactions": [
    {
      "id": "string",
      "date": "string",
      "propertyName": "string",
      "propertyType": "string",
      "clientName": "string",
      "transactionType": "string",
      "amount": "number",
      "status": "Pending | Completed | Failed | In-progress"
    }
  ]
}
```

**Store:** `useAgentDashboardStore.fetchDashboardData()`

---

## KYC Endpoints (Protected)

### POST /api/kyc/submit

Submit KYC verification. Called after all 5 steps completed.

**Request:**
```json
{
  "step1": {
    "bvn": "string",
    "firstName": "string",
    "lastName": "string",
    "dob": "string (YYYY-MM-DD)",
    "address": "string",
    "postalCode": "string",
    "city": "string"
  },
  "step2": {
    "phone": "string",
    "verificationCode": "string"
  },
  "step3": {
    "idType": "string",
    "idNumber": "string",
    "idImage": "string (URL or base64)"
  },
  "step4": {
    "selfieImage": "string (URL or base64)"
  },
  "step5": {
    "bankName": "string",
    "accountNumber": "string",
    "accountName": "string"
  }
}
```

**Response (200):**
```json
{
  "kycStatus": "verified | in-progress",
  "kycProgress": 100,
  "message": "Verification complete"
}
```

**Store:** `useAgentDashboardStore.mockSubmitKycForVerification()`

---

## Agent Properties Endpoints (Protected)

### GET /api/agent/properties

Fetch agent's own property listings.

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `tab` | `For Sale \| For Rent` | Listing type filter |
| `category` | `string` | Property category filter |
| `search` | `string` | Title search |
| `page` | `number` | Page number |
| `limit` | `number` | Items per page |

**Response (200):**
```json
{
  "properties": [
    {
      "id": "string",
      "createdAt": "string (ISO date)",
      "propertyCategory": "Residential | Commercial | Plots/Lands | Service Apartments & Short Lets | PG/Hostel",
      "listingType": "For Sale | For Rent",
      "propertyStatus": "Under Construction | Ready",
      "title": "string",
      "description": "string",
      "state": "string",
      "city": "string",
      "address": "string",
      "landmarks": ["string"],
      "price": "number",
      "bedrooms": "number | null",
      "bathrooms": "number | null",
      "sizeSqm": "number | null",
      "amenities": ["string"],
      "media": ["string (URL)"],
      "virtualTourUrl": "string | null",
      "priceType": "Per Month | Every 6 Months | Per Year | null",
      "securityDeposit": "number | null",
      "agencyFee": "number | null",
      "legalFee": "number | null",
      "cautionFee": "number | null"
    }
  ],
  "total": "number",
  "page": "number",
  "totalPages": "number"
}
```

**Store:** `useAgentPropertiesStore.fetchProperties()`

---

### POST /api/agent/properties

Create a new property listing.

**Request:** (matches `useCreatePropertyStore` form data)
```json
{
  "propertyCategory": "Residential | Commercial | Plots/Lands | Service Apartments & Short Lets | PG/Hostel",
  "listingType": "For Sale | For Rent",
  "propertyStatus": "Under Construction | Ready",
  "title": "string",
  "description": "string",
  "state": "string",
  "city": "string",
  "address": "string",
  "landmarks": ["string"],
  "bedrooms": "number | null",
  "bathrooms": "number | null",
  "sizeSqm": "number | null",
  "amenities": ["string"],
  "media": ["string (URL)"],
  "virtualTourUrl": "string | null",
  "salePrice": "number | null",
  "rentPrice": "number | null",
  "rentPriceType": "Per Month | Every 6 Months | Per Year | null",
  "securityDeposit": "number | null",
  "agencyFee": "number | null",
  "legalFee": "number | null",
  "cautionFee": "number | null",
  "documentTypes": ["string"],
  "zoningType": "string | null",
  "unitsFloors": "number | null",
  "parkingCapacity": "number | null",
  "floorAreaSqm": "number | null",
  "roomType": "string | null",
  "utilitiesIncluded": "string | null"
}
```

**Response (201):**
```json
{
  "id": "string",
  "message": "Property created",
  "property": { ... }
}
```

**Store:** `useCreatePropertyStore.submitProperty()`

---

### DELETE /api/agent/properties/:id

Delete a property listing.

**Response (200):**
```json
{
  "message": "Property deleted"
}
```

**Store:** `useAgentPropertiesStore.deleteProperty()`

---

## Wallet Endpoints (Protected)

### GET /api/wallet/ledger

Fetch wallet transactions and balances.

**Response (200):**
```json
{
  "walletBalance": "number",
  "escrowBalance": "number",
  "transactions": [
    {
      "id": "string",
      "type": "Deposit | Withdrawal",
      "amount": "number",
      "status": "Completed | Pending",
      "date": "string"
    }
  ]
}
```

**Store:** `useWalletStore.fetchLedgerMock()`

---

### POST /api/wallet/withdraw

Process a withdrawal.

**Request:**
```json
{
  "amount": "number",
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

**Response (200):**
```json
{
  "transactionId": "string",
  "status": "Pending",
  "message": "Withdrawal processing"
}
```

**Store:** `useWalletStore.processWithdrawalMock()`

---

### PATCH /api/wallet/bank-details

Update bank/payout details.

**Request:**
```json
{
  "bankName": "string",
  "accountName": "string",
  "accountNumber": "string"
}
```

**Response (200):**
```json
{
  "message": "Bank details updated"
}
```

**Store:** `useWalletStore.updateFiatDetailsMock()`

---

## Messages Endpoints (Protected)

### GET /api/messages/threads

Fetch chat threads for the authenticated agent.

**Response (200):**
```json
{
  "threads": [
    {
      "id": "string",
      "participant": {
        "id": "string",
        "name": "string",
        "avatar": "string (URL)",
        "isVerified": "boolean"
      },
      "lastMessage": "string",
      "lastMessageTime": "string (relative, e.g. '2h')",
      "unreadCount": "number",
      "propertyContext": {
        "id": "string",
        "title": "string",
        "priceRaw": "number",
        "priceFormatted": "string",
        "image": "string (URL)"
      },
      "messages": [
        {
          "id": "string",
          "chatId": "string",
          "senderId": "string",
          "content": "string",
          "contentType": "text | document | image_grid | video",
          "files": [
            {
              "name": "string",
              "url": "string",
              "sizeMb": "number",
              "pages": "number | null",
              "format": "pdf | mp4 | png | jpg"
            }
          ],
          "createdAt": "string (ISO date)",
          "timestamp": "string (1:12PM)"
        }
      ]
    }
  ]
}
```

**Store:** `useMessagesStore.fetchThreadsMock()`

---

### POST /api/messages

Send a message in a chat thread.

**Request:**
```json
{
  "chatId": "string",
  "content": "string",
  "contentType": "text | document | image_grid | video",
  "files": [
    {
      "name": "string",
      "url": "string",
      "sizeMb": "number",
      "format": "string"
    }
  ]
}
```

**Response (201):**
```json
{
  "id": "string",
  "chatId": "string",
  "createdAt": "string",
  "timestamp": "string"
}
```

**Store:** `useMessagesStore.sendMessageMock()` (optimistic)

---

## Calendar Endpoints (Protected)

### GET /api/calendar/events

Fetch inspection events for a given month.

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `month` | `number` | Month (0-11) |
| `year` | `number` | Year |

**Response (200):**
```json
{
  "events": [
    {
      "id": "string",
      "type": "Inspection",
      "clientName": "string",
      "dateISO": "string (YYYY-MM-DD)",
      "startTime": "string (1am)",
      "endTime": "string (4 pm)"
    }
  ]
}
```

**Store:** `useCalendarStore.fetchEventsMock()`

---

### POST /api/calendar/availability

Save agent availability slots.

**Request:**
```json
{
  "availabilities": [
    {
      "date": "string (YYYY-MM-DD)",
      "time": "string"
    }
  ]
}
```

**Response (200):**
```json
{
  "message": "Availability saved"
}
```

**Store:** `useCalendarStore.saveAvailabilityMock()`

---

## Documents Endpoints (Protected)

### GET /api/agent/documents

Fetch agent's document library.

**Response (200):**
```json
{
  "documents": [
    {
      "id": "string",
      "title": "string",
      "dateUpdated": "string",
      "type": "Standard Rental | Property Sale | Broker Commission | Property Management | Custom",
      "propertyReference": "string",
      "size": "string (e.g. 4MB)"
    }
  ]
}
```

**Store:** `useDocumentsStore.fetchDocumentsListMock()`

---

### POST /api/documents

Generate a lease agreement document.

**Request:**
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
  "propertyAddress": "string",
  "propertyType": "string",
  "numberOfOccupants": "number",
  "monthlyRent": "number",
  "securityDeposit": "number",
  "agencyFee": "number",
  "legalFee": "number",
  "leaseDuration": "string",
  "startDate": "string",
  "paymentDueDate": "string",
  "includeUtilities": "boolean",
  "includePetPolicy": "boolean",
  "addMaintenance": "boolean",
  "includeEarlyTermination": "boolean",
  "addAutoRenewal": "boolean"
}
```

**Response (201):**
```json
{
  "id": "string",
  "title": "string",
  "type": "string",
  "dateUpdated": "string",
  "propertyReference": "string",
  "size": "string",
  "downloadUrl": "string"
}
```

**Store:** `useDocumentsStore.createDocumentMock()`

---

## Settings Endpoints (Protected)

### PATCH /api/agent/profile

Update agent profile information.

**Request:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "displayName": "string",
  "phone": "string",
  "phoneCode": "string",
  "about": "string",
  "socials": {
    "linkedin": "string",
    "facebook": "string",
    "instagram": "string",
    "twitter": "string"
  }
}
```

**Store:** `useSettingsStore.submitProfileMock()`

---

### PATCH /api/agent/payout

Update payout configuration.

**Request:**
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

**Store:** `useSettingsStore.submitPayoutMock()`

---

### PATCH /api/agent/security/password

Change account password.

**Request:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Store:** `useSettingsStore.submitSecurityMock('password')`

---

### PATCH /api/agent/security/pin

Change account PIN.

**Request:**
```json
{
  "currentPin": "string",
  "newPin": "string"
}
```

**Store:** `useSettingsStore.submitSecurityMock('pin')`

---

### POST /api/support/ticket

Submit a help/support ticket.

**Request:**
```json
{
  "username": "string",
  "email": "string",
  "subject": "string",
  "description": "string"
}
```

**Store:** `useSettingsStore.submitHelpTicketMock()`

---

### PATCH /api/agent/commission

Update commission settings.

**Request:**
```json
{
  "feeType": "Percentage | Amount",
  "value": "number"
}
```

**Store:** `useSettingsStore.submitCommissionMock()`

---

## File Upload Endpoints (Protected)

### POST /api/upload/image

Upload property images or avatars. (Not yet implemented in frontend.)

**Request:** `multipart/form-data`
| Field | Type | Description |
|-------|------|-------------|
| `file` | File | Image file (jpg, png, webp) |
| `context` | string | `property \| avatar \| kyc` |

**Response (200):**
```json
{
  "url": "string (CDN URL)",
  "filename": "string",
  "size": "number"
}
```

---

### POST /api/upload/document

Upload chat documents. (Not yet implemented in frontend.)

**Request:** `multipart/form-data`
| Field | Type | Description |
|-------|------|-------------|
| `file` | File | Document file (pdf, docx) |
| `chatId` | string | Associated chat thread |

**Response (200):**
```json
{
  "url": "string",
  "name": "string",
  "sizeMb": "number",
  "format": "string"
}
```

---

## Booking Endpoints (Public, auth optional)

### POST /api/bookings/tour

Book a property inspection tour.

**Request:**
```json
{
  "propertyId": "number",
  "name": "string",
  "email": "string",
  "phone": "string",
  "preferredDate": "string (YYYY-MM-DD)",
  "preferredTime": "string",
  "message": "string | null"
}
```

**Response (201):**
```json
{
  "bookingId": "string",
  "status": "confirmed",
  "message": "Tour booked successfully"
}
```

---

### POST /api/bookings/reserve

Reserve a property (with payment intent).

**Request:**
```json
{
  "propertyId": "number",
  "paymentMethod": "string",
  "amount": "number"
}
```

**Response (201):**
```json
{
  "reservationId": "string",
  "status": "pending_payment",
  "paymentUrl": "string | null"
}
```
