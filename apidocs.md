# IRealty Backend API Documentation

> IRealty Backend API Documentation 

**Base URL:** `https://staging-api.i-realty.app`  
**Version:** `0.1.0`  
**Prefix:** All endpoints are prefixed with `/api/v1`

## Authentication

**JWT-auth:** bearer (JWT)  
Enter JWT token

Include in request headers:
```
Authorization: Bearer <token>
```

---

## Table of Contents

- [Admin](#admin)
- [AgentProfile](#agentprofile)
- [Auth](#auth)
- [Calendar](#calendar)
- [Documents](#documents)
- [Kyc](#kyc)
- [KycEvents](#kycevents)
- [Marketplace](#marketplace)
- [Messages](#messages)
- [Paystack](#paystack)
- [PaystackWebhook](#paystackwebhook)
- [PropertyTransaction](#propertytransaction)
- [QoreIdWebhook](#qoreidwebhook)
- [Transactions](#transactions)
- [Verification](#verification)
- [Wallet](#wallet)

---

## Admin

### `GET /api/v1/admin/users`

**AdminController_listUsers_v1**

**Query Parameters:**
- `page` *(optional)*: `number`
- `limit` *(optional)*: `number`
- `status` *(optional)*: `string`
- `role` *(optional)*: `string`
- `search` *(optional)*: `string`

**Response:** `200`

---

### `GET /api/v1/admin/users/{id}`

**AdminController_getUserDetail_v1**

**Path Parameters:**
- `id`: `string`

**Response:**
```typescript
{
  username: string
  firstName: string
  lastName: string
  displayName: string
  email: string
  phoneNumber: string
  password: string
  googleId: string
  avatarUrl: string
  authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
  roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
  isEmailVerified: boolean
  isPhoneVerified: boolean
  isActive: boolean
  verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
  transactionPin: string
  refreshToken: string
  tosAcceptedAt: string(date-time)
  paystackCustomerId: string
  virtualAccountNumber: string
  virtualAccountBank: string
  onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
  linkedinUrl: string // Profile social links (display only; no social auth)
  facebookUrl: string
  instagramUrl: string
  twitterUrl: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `PATCH /api/v1/admin/users/{id}/suspend`

**AdminController_suspendUser_v1**

**Path Parameters:**
- `id`: `string`

**Request Body:**
```typescript
{
  reason: string
}
```

**Response:**
```typescript
{
  username: string
  firstName: string
  lastName: string
  displayName: string
  email: string
  phoneNumber: string
  password: string
  googleId: string
  avatarUrl: string
  authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
  roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
  isEmailVerified: boolean
  isPhoneVerified: boolean
  isActive: boolean
  verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
  transactionPin: string
  refreshToken: string
  tosAcceptedAt: string(date-time)
  paystackCustomerId: string
  virtualAccountNumber: string
  virtualAccountBank: string
  onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
  linkedinUrl: string // Profile social links (display only; no social auth)
  facebookUrl: string
  instagramUrl: string
  twitterUrl: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `PATCH /api/v1/admin/users/{id}/revoke`

**AdminController_revokeUser_v1**

**Path Parameters:**
- `id`: `string`

**Request Body:**
```typescript
{
  reason: string
}
```

**Response:**
```typescript
{
  username: string
  firstName: string
  lastName: string
  displayName: string
  email: string
  phoneNumber: string
  password: string
  googleId: string
  avatarUrl: string
  authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
  roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
  isEmailVerified: boolean
  isPhoneVerified: boolean
  isActive: boolean
  verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
  transactionPin: string
  refreshToken: string
  tosAcceptedAt: string(date-time)
  paystackCustomerId: string
  virtualAccountNumber: string
  virtualAccountBank: string
  onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
  linkedinUrl: string // Profile social links (display only; no social auth)
  facebookUrl: string
  instagramUrl: string
  twitterUrl: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `PATCH /api/v1/admin/users/{id}/reactivate`

**AdminController_reactivateUser_v1**

**Path Parameters:**
- `id`: `string`

**Response:**
```typescript
{
  username: string
  firstName: string
  lastName: string
  displayName: string
  email: string
  phoneNumber: string
  password: string
  googleId: string
  avatarUrl: string
  authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
  roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
  isEmailVerified: boolean
  isPhoneVerified: boolean
  isActive: boolean
  verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
  transactionPin: string
  refreshToken: string
  tosAcceptedAt: string(date-time)
  paystackCustomerId: string
  virtualAccountNumber: string
  virtualAccountBank: string
  onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
  linkedinUrl: string // Profile social links (display only; no social auth)
  facebookUrl: string
  instagramUrl: string
  twitterUrl: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `GET /api/v1/admin/admins`

**AdminController_listAdmins_v1**

**Query Parameters:**
- `page` *(optional)*: `number`
- `limit` *(optional)*: `number`
- `status` *(optional)*: `string`
- `role` *(optional)*: `string`
- `search` *(optional)*: `string`

**Response:** `200`

---

### `POST /api/v1/admin/admins`

**AdminController_createAdmin_v1**

**Request Body:**
```typescript
{
  firstName: string
  lastName: string
  email: string
  password: string
  username?: string
}
```

**Response:**
```typescript
{
  username: string
  firstName: string
  lastName: string
  displayName: string
  email: string
  phoneNumber: string
  password: string
  googleId: string
  avatarUrl: string
  authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
  roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
  isEmailVerified: boolean
  isPhoneVerified: boolean
  isActive: boolean
  verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
  transactionPin: string
  refreshToken: string
  tosAcceptedAt: string(date-time)
  paystackCustomerId: string
  virtualAccountNumber: string
  virtualAccountBank: string
  onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
  linkedinUrl: string // Profile social links (display only; no social auth)
  facebookUrl: string
  instagramUrl: string
  twitterUrl: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `GET /api/v1/admin/admins/pending`

**AdminController_listPendingAdmins_v1**

**Response:**
```typescript
Array<{
  username: string
  firstName: string
  lastName: string
  displayName: string
  email: string
  phoneNumber: string
  password: string
  googleId: string
  avatarUrl: string
  authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
  roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
  isEmailVerified: boolean
  isPhoneVerified: boolean
  isActive: boolean
  verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
  transactionPin: string
  refreshToken: string
  tosAcceptedAt: string(date-time)
  paystackCustomerId: string
  virtualAccountNumber: string
  virtualAccountBank: string
  onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
  linkedinUrl: string // Profile social links (display only; no social auth)
  facebookUrl: string
  instagramUrl: string
  twitterUrl: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}>
```

---

### `PATCH /api/v1/admin/admins/{id}/approve`

**AdminController_approveAdmin_v1**

**Path Parameters:**
- `id`: `string`

**Response:**
```typescript
{
  username: string
  firstName: string
  lastName: string
  displayName: string
  email: string
  phoneNumber: string
  password: string
  googleId: string
  avatarUrl: string
  authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
  roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
  isEmailVerified: boolean
  isPhoneVerified: boolean
  isActive: boolean
  verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
  transactionPin: string
  refreshToken: string
  tosAcceptedAt: string(date-time)
  paystackCustomerId: string
  virtualAccountNumber: string
  virtualAccountBank: string
  onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
  linkedinUrl: string // Profile social links (display only; no social auth)
  facebookUrl: string
  instagramUrl: string
  twitterUrl: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `PATCH /api/v1/admin/admins/{id}/suspend`

**AdminController_suspendAdmin_v1**

**Path Parameters:**
- `id`: `string`

**Request Body:**
```typescript
{
  reason: string
}
```

**Response:**
```typescript
{
  username: string
  firstName: string
  lastName: string
  displayName: string
  email: string
  phoneNumber: string
  password: string
  googleId: string
  avatarUrl: string
  authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
  roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
  isEmailVerified: boolean
  isPhoneVerified: boolean
  isActive: boolean
  verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
  transactionPin: string
  refreshToken: string
  tosAcceptedAt: string(date-time)
  paystackCustomerId: string
  virtualAccountNumber: string
  virtualAccountBank: string
  onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
  linkedinUrl: string // Profile social links (display only; no social auth)
  facebookUrl: string
  instagramUrl: string
  twitterUrl: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `PATCH /api/v1/admin/admins/{id}/revoke`

**AdminController_revokeAdmin_v1**

**Path Parameters:**
- `id`: `string`

**Request Body:**
```typescript
{
  reason: string
}
```

**Response:**
```typescript
{
  username: string
  firstName: string
  lastName: string
  displayName: string
  email: string
  phoneNumber: string
  password: string
  googleId: string
  avatarUrl: string
  authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
  roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
  isEmailVerified: boolean
  isPhoneVerified: boolean
  isActive: boolean
  verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
  transactionPin: string
  refreshToken: string
  tosAcceptedAt: string(date-time)
  paystackCustomerId: string
  virtualAccountNumber: string
  virtualAccountBank: string
  onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
  linkedinUrl: string // Profile social links (display only; no social auth)
  facebookUrl: string
  instagramUrl: string
  twitterUrl: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `GET /api/v1/admin/audit-logs`

**AdminController_listAuditLogs_v1**

**Query Parameters:**
- `page` *(optional)*: `number`
- `limit` *(optional)*: `number`
- `status` *(optional)*: `string`
- `role` *(optional)*: `string`
- `search` *(optional)*: `string`

**Response:** `200`

---

## AgentProfile

### `GET /api/v1/agents/profile`

**AgentProfileController_getMyProfile_v1**

🔒 **Requires Bearer token**

**Response:**
```typescript
{
  user: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  userId: string
  bvn: string
  isBvnVerified: boolean
  dateOfBirth: string(date-time)
  address: string
  postCode: string
  city: string
  idType: "INTERNATIONAL_PASSPORT" | "DRIVERS_LICENSE" | "VOTERS_CARD" | "NIN" | "BVN" // INTERNATIONAL_PASSPORT | DRIVERS_LICENSE | VOTERS_CARD | NIN | BVN
  idNumber: string
  idDocumentUrl: string
  isIdVerified: boolean
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `PUT /api/v1/agents/profile`

**AgentProfileController_updateProfile_v1**

🔒 **Requires Bearer token**

**Request Body:**
```typescript
{
  address?: string
  postCode?: string
  city?: string
  idDocumentUrl?: string
}
```

**Response:**
```typescript
{
  user: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  userId: string
  bvn: string
  isBvnVerified: boolean
  dateOfBirth: string(date-time)
  address: string
  postCode: string
  city: string
  idType: "INTERNATIONAL_PASSPORT" | "DRIVERS_LICENSE" | "VOTERS_CARD" | "NIN" | "BVN" // INTERNATIONAL_PASSPORT | DRIVERS_LICENSE | VOTERS_CARD | NIN | BVN
  idNumber: string
  idDocumentUrl: string
  isIdVerified: boolean
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `GET /api/v1/agents/{id}/profile`

**AgentProfileController_getPublicProfile_v1**

**Path Parameters:**
- `id`: `string`

**Response:** `200`

---

## Auth

### `GET /api/v1/auth/google`

**AuthController_googleAuth_v1**

**Response:** `200`

---

### `GET /api/v1/auth/google/callback`

**AuthController_googleCallback_v1**

**Response:** `200`

---

### `POST /api/v1/auth/register`

**AuthController_register_v1**

**Request Body:**
```typescript
{
  username?: string
  firstName: string
  lastName: string
  email: string(email)
  phoneNumber: string
  password: string
  roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
}
```

**Response:** `201`

---

### `POST /api/v1/auth/verify-email`

**AuthController_verifyEmail_v1**

**Request Body:**
```typescript
{
  email: string(email)
  code: string
}
```

**Response:** `200`

---

### `POST /api/v1/auth/resend-verification`

**AuthController_resendVerification_v1**

**Request Body:**
```typescript
{
  email: string(email)
}
```

**Response:** `200`

---

### `POST /api/v1/auth/login`

**AuthController_login_v1**

**Request Body:**
```typescript
{
  email: string(email)
  password: string
}
```

**Response:** `200`

---

### `POST /api/v1/auth/refresh`

**AuthController_refreshToken_v1**

**Request Body:**
```typescript
{
  refreshToken: string
}
```

**Response:** `200`

---

### `POST /api/v1/auth/logout`

**AuthController_logout_v1**

🔒 **Requires Bearer token**

**Response:** `200`

---

### `GET /api/v1/auth/me`

**AuthController_getMe_v1**

🔒 **Requires Bearer token**

**Response:**
```typescript
{
  username: string
  firstName: string
  lastName: string
  displayName: string
  email: string
  phoneNumber: string
  password: string
  googleId: string
  avatarUrl: string
  authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
  roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
  isEmailVerified: boolean
  isPhoneVerified: boolean
  isActive: boolean
  verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
  transactionPin: string
  refreshToken: string
  tosAcceptedAt: string(date-time)
  paystackCustomerId: string
  virtualAccountNumber: string
  virtualAccountBank: string
  onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
  linkedinUrl: string // Profile social links (display only; no social auth)
  facebookUrl: string
  instagramUrl: string
  twitterUrl: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `PATCH /api/v1/auth/me`

**AuthController_updateProfile_v1**

🔒 **Requires Bearer token**

**Request Body:**
```typescript
{
  firstName?: string
  lastName?: string
  displayName?: string
  phoneNumber?: string
  linkedinUrl?: string(uri)
  facebookUrl?: string(uri)
  instagramUrl?: string(uri)
  twitterUrl?: string(uri)
}
```

**Response:**
```typescript
{
  username: string
  firstName: string
  lastName: string
  displayName: string
  email: string
  phoneNumber: string
  password: string
  googleId: string
  avatarUrl: string
  authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
  roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
  isEmailVerified: boolean
  isPhoneVerified: boolean
  isActive: boolean
  verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
  transactionPin: string
  refreshToken: string
  tosAcceptedAt: string(date-time)
  paystackCustomerId: string
  virtualAccountNumber: string
  virtualAccountBank: string
  onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
  linkedinUrl: string // Profile social links (display only; no social auth)
  facebookUrl: string
  instagramUrl: string
  twitterUrl: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `GET /api/v1/auth/linked-accounts`

**AuthController_getLinkedAccounts_v1**

🔒 **Requires Bearer token**

**Response:** `200`

---

### `POST /api/v1/auth/linked-accounts`

**AuthController_addLinkedAccount_v1**

🔒 **Requires Bearer token**

**Request Body:**
```typescript
{
  role: "PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN" // PROPERTY_SEEKER | LANDLORD | REAL_ESTATE_AGENT | DIASPORA_INVESTOR | DEVELOPER | ADMIN
  displayName?: string
}
```

**Response:** `201`

---

### `POST /api/v1/auth/switch-account`

**AuthController_switchToAccount_v1**

🔒 **Requires Bearer token**

**Request Body:**
```typescript
{
  linkedUserId: string(uuid)
}
```

**Response:** `201`

---

## Calendar

### `GET /api/v1/calendar/availability`

**CalendarController_getAvailability_v1**

🔒 **Requires Bearer token**

**Response:**
```typescript
Array<{
  userId: string
  user: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7 // 1 | 2 | 3 | 4 | 5 | 6 | 7
  startTime: string // Time of day, e.g. "09:00" (24h)
  endTime: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}>
```

---

### `PUT /api/v1/calendar/availability`

**CalendarController_setAvailability_v1**

🔒 **Requires Bearer token**

**Request Body:**
```typescript
{
  slots: Array<{
    dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7 // 1 | 2 | 3 | 4 | 5 | 6 | 7
    startTime: string
    endTime: string
  }>
}
```

**Response:**
```typescript
Array<{
  userId: string
  user: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7 // 1 | 2 | 3 | 4 | 5 | 6 | 7
  startTime: string // Time of day, e.g. "09:00" (24h)
  endTime: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}>
```

---

### `GET /api/v1/calendar/events`

**CalendarController_listEvents_v1**

🔒 **Requires Bearer token**

**Query Parameters:**
- `start` *(optional)*: `string` — Start of range (inclusive), ISO date or datetime
- `end` *(optional)*: `string` — End of range (inclusive), ISO date or datetime
- `month` *(optional)*: `number`
- `year` *(optional)*: `number`

**Response:**
```typescript
Array<{
  userId: string
  user: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  title: string
  startAt: string(date-time)
  endAt: string(date-time)
  listingId: string
  listing: {
    user: User
    userId: string
    propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL" // RESIDENTIAL | COMMERCIAL | LAND | SHORT_LET | PG_HOSTEL
    listingType: "FOR_SALE" | "FOR_RENT" // FOR_SALE | FOR_RENT
    propertyStatus: "UNDER_CONSTRUCTION" | "READY" // UNDER_CONSTRUCTION | READY
    status: "DRAFT" | "ACTIVE" | "UNDER_OFFER" | "SOLD" | "RENTED" | "EXPIRED" // DRAFT | ACTIVE | UNDER_OFFER | SOLD | RENTED | EXPIRED
    title: string
    description: string
    state: string
    city: string
    fullAddress: string
    landmarks: Array<string>
    amenities: Array<string>
    bedrooms: number
    bathrooms: number
    sizeSqm: number
    unitsFloors: number
    parkingCapacity: number
    floorAreaSqm: number
    documentTypes: Array<"DEED_OF_TRANSFER" | "C_OF_O" | "SURVEY_PLAN" | "PURCHASE_RECEIPT" | "POWER_OF_ATTORNEY" | "DEED_OF_CONVEYANCE" | "DEED_OF_LEASE">
    zoningType: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "INSTITUTIONAL" | "RECREATIONAL" // RESIDENTIAL | COMMERCIAL | INDUSTRIAL | AGRICULTURAL | INSTITUTIONAL | RECREATIONAL
    landSizeSqm: number
    bedroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    bathroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" | "PRIVATE" // SINGLE | SHARED | SELF_CONTAINED | PRIVATE
    rentalRate: "NIGHTLY" | "WEEKLY" | "MONTHLY" // NIGHTLY | WEEKLY | MONTHLY
    roomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    utilitiesIncluded: Array<"WIFI" | "LIGHT">
    images: Array<ListingImage>
    virtualTourUrl: string
    price: number
    priceType: "PER_MONTH" | "EVERY_6_MONTHS" | "PER_YEAR" // PER_MONTH | EVERY_6_MONTHS | PER_YEAR
    securityDeposit: number
    agencyFee: number
    legalFee: number
    cautionFee: number
    inspectionFeeType: "percentage" | "amount" // percentage | amount
    inspectionFeeValue: number
    publishedAt: string(date-time)
    likesCount: number
    searchVector?: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  eventType: "INSPECTION" | "TOUR" | "MEETING" | "OTHER" // INSPECTION | TOUR | MEETING | OTHER
  description: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}>
```

---

### `POST /api/v1/calendar/events`

**CalendarController_createEvent_v1**

🔒 **Requires Bearer token**

**Request Body:**
```typescript
{
  title: string
  startAt: string
  endAt: string
  listingId?: string(uuid)
  eventType?: "INSPECTION" | "TOUR" | "MEETING" | "OTHER" // INSPECTION | TOUR | MEETING | OTHER
  description?: string
}
```

**Response:**
```typescript
{
  userId: string
  user: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  title: string
  startAt: string(date-time)
  endAt: string(date-time)
  listingId: string
  listing: {
    user: User
    userId: string
    propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL" // RESIDENTIAL | COMMERCIAL | LAND | SHORT_LET | PG_HOSTEL
    listingType: "FOR_SALE" | "FOR_RENT" // FOR_SALE | FOR_RENT
    propertyStatus: "UNDER_CONSTRUCTION" | "READY" // UNDER_CONSTRUCTION | READY
    status: "DRAFT" | "ACTIVE" | "UNDER_OFFER" | "SOLD" | "RENTED" | "EXPIRED" // DRAFT | ACTIVE | UNDER_OFFER | SOLD | RENTED | EXPIRED
    title: string
    description: string
    state: string
    city: string
    fullAddress: string
    landmarks: Array<string>
    amenities: Array<string>
    bedrooms: number
    bathrooms: number
    sizeSqm: number
    unitsFloors: number
    parkingCapacity: number
    floorAreaSqm: number
    documentTypes: Array<"DEED_OF_TRANSFER" | "C_OF_O" | "SURVEY_PLAN" | "PURCHASE_RECEIPT" | "POWER_OF_ATTORNEY" | "DEED_OF_CONVEYANCE" | "DEED_OF_LEASE">
    zoningType: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "INSTITUTIONAL" | "RECREATIONAL" // RESIDENTIAL | COMMERCIAL | INDUSTRIAL | AGRICULTURAL | INSTITUTIONAL | RECREATIONAL
    landSizeSqm: number
    bedroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    bathroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" | "PRIVATE" // SINGLE | SHARED | SELF_CONTAINED | PRIVATE
    rentalRate: "NIGHTLY" | "WEEKLY" | "MONTHLY" // NIGHTLY | WEEKLY | MONTHLY
    roomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    utilitiesIncluded: Array<"WIFI" | "LIGHT">
    images: Array<ListingImage>
    virtualTourUrl: string
    price: number
    priceType: "PER_MONTH" | "EVERY_6_MONTHS" | "PER_YEAR" // PER_MONTH | EVERY_6_MONTHS | PER_YEAR
    securityDeposit: number
    agencyFee: number
    legalFee: number
    cautionFee: number
    inspectionFeeType: "percentage" | "amount" // percentage | amount
    inspectionFeeValue: number
    publishedAt: string(date-time)
    likesCount: number
    searchVector?: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  eventType: "INSPECTION" | "TOUR" | "MEETING" | "OTHER" // INSPECTION | TOUR | MEETING | OTHER
  description: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `GET /api/v1/calendar/events/{id}`

**CalendarController_getEvent_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id`: `string`

**Response:**
```typescript
{
  userId: string
  user: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  title: string
  startAt: string(date-time)
  endAt: string(date-time)
  listingId: string
  listing: {
    user: User
    userId: string
    propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL" // RESIDENTIAL | COMMERCIAL | LAND | SHORT_LET | PG_HOSTEL
    listingType: "FOR_SALE" | "FOR_RENT" // FOR_SALE | FOR_RENT
    propertyStatus: "UNDER_CONSTRUCTION" | "READY" // UNDER_CONSTRUCTION | READY
    status: "DRAFT" | "ACTIVE" | "UNDER_OFFER" | "SOLD" | "RENTED" | "EXPIRED" // DRAFT | ACTIVE | UNDER_OFFER | SOLD | RENTED | EXPIRED
    title: string
    description: string
    state: string
    city: string
    fullAddress: string
    landmarks: Array<string>
    amenities: Array<string>
    bedrooms: number
    bathrooms: number
    sizeSqm: number
    unitsFloors: number
    parkingCapacity: number
    floorAreaSqm: number
    documentTypes: Array<"DEED_OF_TRANSFER" | "C_OF_O" | "SURVEY_PLAN" | "PURCHASE_RECEIPT" | "POWER_OF_ATTORNEY" | "DEED_OF_CONVEYANCE" | "DEED_OF_LEASE">
    zoningType: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "INSTITUTIONAL" | "RECREATIONAL" // RESIDENTIAL | COMMERCIAL | INDUSTRIAL | AGRICULTURAL | INSTITUTIONAL | RECREATIONAL
    landSizeSqm: number
    bedroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    bathroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" | "PRIVATE" // SINGLE | SHARED | SELF_CONTAINED | PRIVATE
    rentalRate: "NIGHTLY" | "WEEKLY" | "MONTHLY" // NIGHTLY | WEEKLY | MONTHLY
    roomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    utilitiesIncluded: Array<"WIFI" | "LIGHT">
    images: Array<ListingImage>
    virtualTourUrl: string
    price: number
    priceType: "PER_MONTH" | "EVERY_6_MONTHS" | "PER_YEAR" // PER_MONTH | EVERY_6_MONTHS | PER_YEAR
    securityDeposit: number
    agencyFee: number
    legalFee: number
    cautionFee: number
    inspectionFeeType: "percentage" | "amount" // percentage | amount
    inspectionFeeValue: number
    publishedAt: string(date-time)
    likesCount: number
    searchVector?: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  eventType: "INSPECTION" | "TOUR" | "MEETING" | "OTHER" // INSPECTION | TOUR | MEETING | OTHER
  description: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `PATCH /api/v1/calendar/events/{id}`

**CalendarController_updateEvent_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id`: `string`

**Request Body:**
```typescript
{
  title?: string
  startAt?: string
  endAt?: string
  listingId?: string(uuid)
  eventType?: "INSPECTION" | "TOUR" | "MEETING" | "OTHER" // INSPECTION | TOUR | MEETING | OTHER
  description?: string
}
```

**Response:**
```typescript
{
  userId: string
  user: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  title: string
  startAt: string(date-time)
  endAt: string(date-time)
  listingId: string
  listing: {
    user: User
    userId: string
    propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL" // RESIDENTIAL | COMMERCIAL | LAND | SHORT_LET | PG_HOSTEL
    listingType: "FOR_SALE" | "FOR_RENT" // FOR_SALE | FOR_RENT
    propertyStatus: "UNDER_CONSTRUCTION" | "READY" // UNDER_CONSTRUCTION | READY
    status: "DRAFT" | "ACTIVE" | "UNDER_OFFER" | "SOLD" | "RENTED" | "EXPIRED" // DRAFT | ACTIVE | UNDER_OFFER | SOLD | RENTED | EXPIRED
    title: string
    description: string
    state: string
    city: string
    fullAddress: string
    landmarks: Array<string>
    amenities: Array<string>
    bedrooms: number
    bathrooms: number
    sizeSqm: number
    unitsFloors: number
    parkingCapacity: number
    floorAreaSqm: number
    documentTypes: Array<"DEED_OF_TRANSFER" | "C_OF_O" | "SURVEY_PLAN" | "PURCHASE_RECEIPT" | "POWER_OF_ATTORNEY" | "DEED_OF_CONVEYANCE" | "DEED_OF_LEASE">
    zoningType: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "INSTITUTIONAL" | "RECREATIONAL" // RESIDENTIAL | COMMERCIAL | INDUSTRIAL | AGRICULTURAL | INSTITUTIONAL | RECREATIONAL
    landSizeSqm: number
    bedroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    bathroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" | "PRIVATE" // SINGLE | SHARED | SELF_CONTAINED | PRIVATE
    rentalRate: "NIGHTLY" | "WEEKLY" | "MONTHLY" // NIGHTLY | WEEKLY | MONTHLY
    roomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    utilitiesIncluded: Array<"WIFI" | "LIGHT">
    images: Array<ListingImage>
    virtualTourUrl: string
    price: number
    priceType: "PER_MONTH" | "EVERY_6_MONTHS" | "PER_YEAR" // PER_MONTH | EVERY_6_MONTHS | PER_YEAR
    securityDeposit: number
    agencyFee: number
    legalFee: number
    cautionFee: number
    inspectionFeeType: "percentage" | "amount" // percentage | amount
    inspectionFeeValue: number
    publishedAt: string(date-time)
    likesCount: number
    searchVector?: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  eventType: "INSPECTION" | "TOUR" | "MEETING" | "OTHER" // INSPECTION | TOUR | MEETING | OTHER
  description: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `DELETE /api/v1/calendar/events/{id}`

**CalendarController_deleteEvent_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id`: `string`

**Response:** `204`

---

## Documents

### `POST /api/v1/documents/upload`

**DocumentsController_upload_v1**

🔒 **Requires Bearer token**

**Request Body:**
```typescript
{
  title: string
  listingId?: string(uuid)
  conversationId?: string(uuid)
  messageId?: string(uuid)
  file: string(binary)
}
```

**Response:**
```typescript
{
  title: string
  documentType: "STANDARD_RENTAL_AGREEMENT" | "PROPERTY_SALE_AGREEMENT" | "BROKER_COMMISSION_AGREEMENT" | "PROPERTY_MANAGEMENT_AGREEMENT" | "CUSTOM" // STANDARD_RENTAL_AGREEMENT | PROPERTY_SALE_AGREEMENT | BROKER_COMMISSION_AGREEMENT | PROPERTY_MANAGEMENT_AGREEMENT | CUSTOM
  userId: string
  user: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  listingId: string
  listing: {
    user: User
    userId: string
    propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL" // RESIDENTIAL | COMMERCIAL | LAND | SHORT_LET | PG_HOSTEL
    listingType: "FOR_SALE" | "FOR_RENT" // FOR_SALE | FOR_RENT
    propertyStatus: "UNDER_CONSTRUCTION" | "READY" // UNDER_CONSTRUCTION | READY
    status: "DRAFT" | "ACTIVE" | "UNDER_OFFER" | "SOLD" | "RENTED" | "EXPIRED" // DRAFT | ACTIVE | UNDER_OFFER | SOLD | RENTED | EXPIRED
    title: string
    description: string
    state: string
    city: string
    fullAddress: string
    landmarks: Array<string>
    amenities: Array<string>
    bedrooms: number
    bathrooms: number
    sizeSqm: number
    unitsFloors: number
    parkingCapacity: number
    floorAreaSqm: number
    documentTypes: Array<"DEED_OF_TRANSFER" | "C_OF_O" | "SURVEY_PLAN" | "PURCHASE_RECEIPT" | "POWER_OF_ATTORNEY" | "DEED_OF_CONVEYANCE" | "DEED_OF_LEASE">
    zoningType: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "INSTITUTIONAL" | "RECREATIONAL" // RESIDENTIAL | COMMERCIAL | INDUSTRIAL | AGRICULTURAL | INSTITUTIONAL | RECREATIONAL
    landSizeSqm: number
    bedroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    bathroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" | "PRIVATE" // SINGLE | SHARED | SELF_CONTAINED | PRIVATE
    rentalRate: "NIGHTLY" | "WEEKLY" | "MONTHLY" // NIGHTLY | WEEKLY | MONTHLY
    roomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    utilitiesIncluded: Array<"WIFI" | "LIGHT">
    images: Array<ListingImage>
    virtualTourUrl: string
    price: number
    priceType: "PER_MONTH" | "EVERY_6_MONTHS" | "PER_YEAR" // PER_MONTH | EVERY_6_MONTHS | PER_YEAR
    securityDeposit: number
    agencyFee: number
    legalFee: number
    cautionFee: number
    inspectionFeeType: "percentage" | "amount" // percentage | amount
    inspectionFeeValue: number
    publishedAt: string(date-time)
    likesCount: number
    searchVector?: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  fileUrl: string // Null for template docs until PDF is generated
  fileSizeBytes: number
  mimeType: string
  filename: string
  contentHash: string // SHA-256 of file content; used to dedupe uploads (reuse existing file if hash exists)
  conversationId: string // For CUSTOM documents: conversation this was sent from
  messageId: string // For CUSTOM documents: source message attachment
  metadata: {

  } // Template form data (parties, financial terms, lease duration, options, etc.)
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `GET /api/v1/documents`

**DocumentsController_list_v1**

🔒 **Requires Bearer token**

**Query Parameters:**
- `documentType` *(optional)*: `string`
- `listingId` *(optional)*: `string`
- `search` *(optional)*: `string`
- `page` *(optional)*: `number`
- `limit` *(optional)*: `number`

**Response:** `200`

---

### `POST /api/v1/documents`

**DocumentsController_createCustom_v1**

🔒 **Requires Bearer token**

**Request Body:**
```typescript
{
  title: string
  fileUrl: string(uri)
  fileSizeBytes: number
  mimeType: string
  filename?: string
  listingId?: string(uuid)
  contentHash?: string // Precomputed SHA-256 (hex). If omitted, server will download from fileUrl to compute hash for dedupe.
  conversationId?: string(uuid)
  messageId?: string(uuid)
}
```

**Response:**
```typescript
{
  title: string
  documentType: "STANDARD_RENTAL_AGREEMENT" | "PROPERTY_SALE_AGREEMENT" | "BROKER_COMMISSION_AGREEMENT" | "PROPERTY_MANAGEMENT_AGREEMENT" | "CUSTOM" // STANDARD_RENTAL_AGREEMENT | PROPERTY_SALE_AGREEMENT | BROKER_COMMISSION_AGREEMENT | PROPERTY_MANAGEMENT_AGREEMENT | CUSTOM
  userId: string
  user: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  listingId: string
  listing: {
    user: User
    userId: string
    propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL" // RESIDENTIAL | COMMERCIAL | LAND | SHORT_LET | PG_HOSTEL
    listingType: "FOR_SALE" | "FOR_RENT" // FOR_SALE | FOR_RENT
    propertyStatus: "UNDER_CONSTRUCTION" | "READY" // UNDER_CONSTRUCTION | READY
    status: "DRAFT" | "ACTIVE" | "UNDER_OFFER" | "SOLD" | "RENTED" | "EXPIRED" // DRAFT | ACTIVE | UNDER_OFFER | SOLD | RENTED | EXPIRED
    title: string
    description: string
    state: string
    city: string
    fullAddress: string
    landmarks: Array<string>
    amenities: Array<string>
    bedrooms: number
    bathrooms: number
    sizeSqm: number
    unitsFloors: number
    parkingCapacity: number
    floorAreaSqm: number
    documentTypes: Array<"DEED_OF_TRANSFER" | "C_OF_O" | "SURVEY_PLAN" | "PURCHASE_RECEIPT" | "POWER_OF_ATTORNEY" | "DEED_OF_CONVEYANCE" | "DEED_OF_LEASE">
    zoningType: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "INSTITUTIONAL" | "RECREATIONAL" // RESIDENTIAL | COMMERCIAL | INDUSTRIAL | AGRICULTURAL | INSTITUTIONAL | RECREATIONAL
    landSizeSqm: number
    bedroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    bathroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" | "PRIVATE" // SINGLE | SHARED | SELF_CONTAINED | PRIVATE
    rentalRate: "NIGHTLY" | "WEEKLY" | "MONTHLY" // NIGHTLY | WEEKLY | MONTHLY
    roomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    utilitiesIncluded: Array<"WIFI" | "LIGHT">
    images: Array<ListingImage>
    virtualTourUrl: string
    price: number
    priceType: "PER_MONTH" | "EVERY_6_MONTHS" | "PER_YEAR" // PER_MONTH | EVERY_6_MONTHS | PER_YEAR
    securityDeposit: number
    agencyFee: number
    legalFee: number
    cautionFee: number
    inspectionFeeType: "percentage" | "amount" // percentage | amount
    inspectionFeeValue: number
    publishedAt: string(date-time)
    likesCount: number
    searchVector?: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  fileUrl: string // Null for template docs until PDF is generated
  fileSizeBytes: number
  mimeType: string
  filename: string
  contentHash: string // SHA-256 of file content; used to dedupe uploads (reuse existing file if hash exists)
  conversationId: string // For CUSTOM documents: conversation this was sent from
  messageId: string // For CUSTOM documents: source message attachment
  metadata: {

  } // Template form data (parties, financial terms, lease duration, options, etc.)
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `GET /api/v1/documents/{id}`

**DocumentsController_findOne_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id`: `string`

**Response:**
```typescript
{
  title: string
  documentType: "STANDARD_RENTAL_AGREEMENT" | "PROPERTY_SALE_AGREEMENT" | "BROKER_COMMISSION_AGREEMENT" | "PROPERTY_MANAGEMENT_AGREEMENT" | "CUSTOM" // STANDARD_RENTAL_AGREEMENT | PROPERTY_SALE_AGREEMENT | BROKER_COMMISSION_AGREEMENT | PROPERTY_MANAGEMENT_AGREEMENT | CUSTOM
  userId: string
  user: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  listingId: string
  listing: {
    user: User
    userId: string
    propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL" // RESIDENTIAL | COMMERCIAL | LAND | SHORT_LET | PG_HOSTEL
    listingType: "FOR_SALE" | "FOR_RENT" // FOR_SALE | FOR_RENT
    propertyStatus: "UNDER_CONSTRUCTION" | "READY" // UNDER_CONSTRUCTION | READY
    status: "DRAFT" | "ACTIVE" | "UNDER_OFFER" | "SOLD" | "RENTED" | "EXPIRED" // DRAFT | ACTIVE | UNDER_OFFER | SOLD | RENTED | EXPIRED
    title: string
    description: string
    state: string
    city: string
    fullAddress: string
    landmarks: Array<string>
    amenities: Array<string>
    bedrooms: number
    bathrooms: number
    sizeSqm: number
    unitsFloors: number
    parkingCapacity: number
    floorAreaSqm: number
    documentTypes: Array<"DEED_OF_TRANSFER" | "C_OF_O" | "SURVEY_PLAN" | "PURCHASE_RECEIPT" | "POWER_OF_ATTORNEY" | "DEED_OF_CONVEYANCE" | "DEED_OF_LEASE">
    zoningType: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "INSTITUTIONAL" | "RECREATIONAL" // RESIDENTIAL | COMMERCIAL | INDUSTRIAL | AGRICULTURAL | INSTITUTIONAL | RECREATIONAL
    landSizeSqm: number
    bedroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    bathroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" | "PRIVATE" // SINGLE | SHARED | SELF_CONTAINED | PRIVATE
    rentalRate: "NIGHTLY" | "WEEKLY" | "MONTHLY" // NIGHTLY | WEEKLY | MONTHLY
    roomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    utilitiesIncluded: Array<"WIFI" | "LIGHT">
    images: Array<ListingImage>
    virtualTourUrl: string
    price: number
    priceType: "PER_MONTH" | "EVERY_6_MONTHS" | "PER_YEAR" // PER_MONTH | EVERY_6_MONTHS | PER_YEAR
    securityDeposit: number
    agencyFee: number
    legalFee: number
    cautionFee: number
    inspectionFeeType: "percentage" | "amount" // percentage | amount
    inspectionFeeValue: number
    publishedAt: string(date-time)
    likesCount: number
    searchVector?: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  fileUrl: string // Null for template docs until PDF is generated
  fileSizeBytes: number
  mimeType: string
  filename: string
  contentHash: string // SHA-256 of file content; used to dedupe uploads (reuse existing file if hash exists)
  conversationId: string // For CUSTOM documents: conversation this was sent from
  messageId: string // For CUSTOM documents: source message attachment
  metadata: {

  } // Template form data (parties, financial terms, lease duration, options, etc.)
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `DELETE /api/v1/documents/{id}`

**DocumentsController_delete_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id`: `string`

**Response:** `204`

---

## Kyc

### `GET /api/v1/kyc/status`

**KycController_getStatus_v1**

🔒 **Requires Bearer token**

**Response:** `200`

---

### `POST /api/v1/kyc/personal-info`

**KycController_personalInfo_v1**

🔒 **Requires Bearer token**

**Request Body:**
```typescript
{
  bvn: string
  firstName: string
  lastName: string
  dateOfBirth: string
  address: string
  postCode: string
  city: string
}
```

**Response:** `201`

---

### `POST /api/v1/kyc/phone/send-otp`

**KycController_sendOtp_v1**

🔒 **Requires Bearer token**

**Request Body:**
```typescript
{
  phoneNumber: string
}
```

**Response:** `201`

---

### `POST /api/v1/kyc/phone/verify-otp`

**KycController_verifyOtp_v1**

🔒 **Requires Bearer token**

**Request Body:**
```typescript
{
  phoneNumber: string
  idToken: string
}
```

**Response:** `201`

---

### `POST /api/v1/kyc/id-verification`

**KycController_idVerification_v1**

🔒 **Requires Bearer token**

**Request Body:**
```typescript
{
  idType: string
  idNumber: string
  gender?: string
  file: string(binary)
}
```

**Response:** `201`

---

### `POST /api/v1/kyc/liveness/register-session`

**KycController_registerLivenessSession_v1**

🔒 **Requires Bearer token**

**Response:** `201`

---

### `POST /api/v1/kyc/payment`

**KycController_payment_v1**

🔒 **Requires Bearer token**

**Request Body:**
```typescript
{
  bankAccount: {
    bankCode: string
    accountNumber: string
  }
  cryptoWallet?: {
    walletType: "USDT" | "BTC" | "ETH" // USDT | BTC | ETH
    walletAddress: string
  }
}
```

**Response:** `201`

---

## KycEvents

### `GET /api/v1/kyc/phone/events`

**KycEventsController_phoneVerificationEvents_v1**

**Response:**
```typescript
{

}
```

---

## Marketplace

### `GET /api/v1/marketplace/search`

**MarketplaceController_search_v1**

**Query Parameters:**
- `search` *(optional)*: `string`
- `propertyType` *(optional)*: `string`
- `listingType` *(optional)*: `string`
- `propertyStatus` *(optional)*: `string`
- `status` *(optional)*: `string`
- `state` *(optional)*: `string`
- `city` *(optional)*: `string`
- `minPrice` *(optional)*: `number`
- `maxPrice` *(optional)*: `number`
- `minBedrooms` *(optional)*: `number`
- `maxBedrooms` *(optional)*: `number`
- `minBathrooms` *(optional)*: `number`
- `page` *(optional)*: `number`
- `limit` *(optional)*: `number`
- `sortBy` *(optional)*: `string`
- `sortOrder` *(optional)*: `string`

**Response:** `200`

---

### `GET /api/v1/marketplace/{id}`

**MarketplaceController_findOnePublic_v1**

**Path Parameters:**
- `id`: `string`

**Response:**
```typescript
{
  user: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  userId: string
  propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL" // RESIDENTIAL | COMMERCIAL | LAND | SHORT_LET | PG_HOSTEL
  listingType: "FOR_SALE" | "FOR_RENT" // FOR_SALE | FOR_RENT
  propertyStatus: "UNDER_CONSTRUCTION" | "READY" // UNDER_CONSTRUCTION | READY
  status: "DRAFT" | "ACTIVE" | "UNDER_OFFER" | "SOLD" | "RENTED" | "EXPIRED" // DRAFT | ACTIVE | UNDER_OFFER | SOLD | RENTED | EXPIRED
  title: string
  description: string
  state: string
  city: string
  fullAddress: string
  landmarks: Array<string>
  amenities: Array<string>
  bedrooms: number
  bathrooms: number
  sizeSqm: number
  unitsFloors: number
  parkingCapacity: number
  floorAreaSqm: number
  documentTypes: Array<"DEED_OF_TRANSFER" | "C_OF_O" | "SURVEY_PLAN" | "PURCHASE_RECEIPT" | "POWER_OF_ATTORNEY" | "DEED_OF_CONVEYANCE" | "DEED_OF_LEASE">
  zoningType: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "INSTITUTIONAL" | "RECREATIONAL" // RESIDENTIAL | COMMERCIAL | INDUSTRIAL | AGRICULTURAL | INSTITUTIONAL | RECREATIONAL
  landSizeSqm: number
  bedroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
  bathroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" | "PRIVATE" // SINGLE | SHARED | SELF_CONTAINED | PRIVATE
  rentalRate: "NIGHTLY" | "WEEKLY" | "MONTHLY" // NIGHTLY | WEEKLY | MONTHLY
  roomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
  utilitiesIncluded: Array<"WIFI" | "LIGHT">
  images: Array<{
    listing: Listing
    listingId: string
    url: string
    sortOrder: number
    isCover: boolean
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }>
  virtualTourUrl: string
  price: number
  priceType: "PER_MONTH" | "EVERY_6_MONTHS" | "PER_YEAR" // PER_MONTH | EVERY_6_MONTHS | PER_YEAR
  securityDeposit: number
  agencyFee: number
  legalFee: number
  cautionFee: number
  inspectionFeeType: "percentage" | "amount" // percentage | amount
  inspectionFeeValue: number
  publishedAt: string(date-time)
  likesCount: number
  searchVector?: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `GET /api/v1/marketplace/amenities/{propertyType}`

**MarketplaceController_getAmenities_v1**

**Path Parameters:**
- `propertyType`: `string`

**Response:**
```typescript
Array<string>
```

---

### `POST /api/v1/listings`

**MarketplaceController_create_v1**

🔒 **Requires Bearer token**

**Request Body:**
```typescript
{
  amenities?: Array<"KITCHEN_FITTED" | "KITCHEN_OPEN" | "KITCHEN_CLOSED" | "PARKING_GARAGE" | "WARDROBES_WALK_IN_CLOSET" | "AIR_CONDITIONING" | "WATER_HEATER" | "LAUNDRY_AREA" | "SECURITY_DOORS" | "POWER_BACKUP_GENERATOR" | "WATER_SUPPLY_BOREHOLE" | "INTERNET_READY_FIBER_OPTICS" | "FURNISHED" | "SEMI_FURNISHED" | "UNFURNISHED" | "SERVANT_QUARTERS_BQ" | "STUDY_HOME_OFFICE" | "OFFICE_ROOMS_WORKSPACES" | "CONFERENCE_ROOM" | "RECEPTION_AREA" | "STORAGE_WAREHOUSE_SPACE" | "PARKING_SPACE_STAFF_VISITORS" | "SECURITY_ACCESS_CCTV" | "ELEVATOR_ESCALATOR" | "POWER_BACKUP_INVERTER_GENERATOR" | "INTERNET_NETWORKING_INFRASTRUCTURE" | "FIRE_SAFETY" | "AIR_CONDITIONING_VENTILATION" | "LOADING_BAY_DELIVERY_ACCESS" | "RESTROOMS" | "ROAD_ACCESS" | "FENCED_GATED" | "DRAINAGE_SYSTEM" | "ELECTRICITY_SUPPLY_ACCESS" | "WATER_SUPPLY_ACCESS" | "DRY_SOIL" | "SWAMPY_SOIL" | "ROCKY_SOIL" | "SLOPED_TOPOGRAPHY" | "FLAT_TOPOGRAPHY" | "SECURE_NEIGHBORHOOD" | "FURNISHED_LIVING_ROOM" | "EQUIPPED_KITCHEN" | "WIFI" | "SMART_TV_CABLE_TV" | "HOUSEKEEPING_CLEANING_SERVICE" | "TOWELS_LINENS" | "AIR_CONDITIONING" | "SWIMMING_POOL" | "GYM_FITNESS_CENTER" | "PARKING_SPACE" | "SECURITY_24_7_CCTV" | "ELEVATOR_ACCESS" | "BALCONY_WITH_VIEW" | "SHARED_ROOMS_PRIVATE_ROOMS" | "SHARED_BATHROOMS_ENSUITE_OPTIONS" | "STUDY_READING_AREA" | "SHARED_KITCHEN" | "COMMON_LOUNGE_TV_ROOM" | "LAUNDRY_FACILITIES" | "WIFI_ACCESS" | "POWER_BACKUP" | "SECURITY_GATE_CCTV" | "PARKING_FOR_RESIDENTS" | "MESS_CAFETERIA" | "ELEVATOR_ACCESS" | "BALCONY_WITH_VIEW"> // KITCHEN_FITTED | KITCHEN_OPEN | KITCHEN_CLOSED | PARKING_GARAGE | WARDROBES_WALK_IN_CLOSET | AIR_CONDITIONING | WATER_HEATER | LAUNDRY_AREA | SECURITY_DOORS | POWER_BACKUP_GENERATOR | WATER_SUPPLY_BOREHOLE | INTERNET_READY_FIBER_OPTICS | FURNISHED | SEMI_FURNISHED | UNFURNISHED | SERVANT_QUARTERS_BQ | STUDY_HOME_OFFICE | OFFICE_ROOMS_WORKSPACES | CONFERENCE_ROOM | RECEPTION_AREA | STORAGE_WAREHOUSE_SPACE | PARKING_SPACE_STAFF_VISITORS | SECURITY_ACCESS_CCTV | ELEVATOR_ESCALATOR | POWER_BACKUP_INVERTER_GENERATOR | INTERNET_NETWORKING_INFRASTRUCTURE | FIRE_SAFETY | AIR_CONDITIONING_VENTILATION | LOADING_BAY_DELIVERY_ACCESS | RESTROOMS | ROAD_ACCESS | FENCED_GATED | DRAINAGE_SYSTEM | ELECTRICITY_SUPPLY_ACCESS | WATER_SUPPLY_ACCESS | DRY_SOIL | SWAMPY_SOIL | ROCKY_SOIL | SLOPED_TOPOGRAPHY | FLAT_TOPOGRAPHY | SECURE_NEIGHBORHOOD | FURNISHED_LIVING_ROOM | EQUIPPED_KITCHEN | WIFI | SMART_TV_CABLE_TV | HOUSEKEEPING_CLEANING_SERVICE | TOWELS_LINENS | AIR_CONDITIONING | SWIMMING_POOL | GYM_FITNESS_CENTER | PARKING_SPACE | SECURITY_24_7_CCTV | ELEVATOR_ACCESS | BALCONY_WITH_VIEW | SHARED_ROOMS_PRIVATE_ROOMS | SHARED_BATHROOMS_ENSUITE_OPTIONS | STUDY_READING_AREA | SHARED_KITCHEN | COMMON_LOUNGE_TV_ROOM | LAUNDRY_FACILITIES | WIFI_ACCESS | POWER_BACKUP | SECURITY_GATE_CCTV | PARKING_FOR_RESIDENTS | MESS_CAFETERIA | ELEVATOR_ACCESS | BALCONY_WITH_VIEW
  propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL" // RESIDENTIAL | COMMERCIAL | LAND | SHORT_LET | PG_HOSTEL
  listingType: "FOR_SALE" | "FOR_RENT" // FOR_SALE | FOR_RENT
  propertyStatus: "UNDER_CONSTRUCTION" | "READY" // UNDER_CONSTRUCTION | READY
  title: string
  description: string
  state: string
  city: string
  fullAddress: string
  landmarks?: Array<string>
  bedrooms?: number
  bathrooms?: number
  sizeSqm?: number
  unitsFloors?: number
  parkingCapacity?: number
  floorAreaSqm?: number
  documentTypes?: Array<"DEED_OF_TRANSFER" | "C_OF_O" | "SURVEY_PLAN" | "PURCHASE_RECEIPT" | "POWER_OF_ATTORNEY" | "DEED_OF_CONVEYANCE" | "DEED_OF_LEASE">
  zoningType?: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "INSTITUTIONAL" | "RECREATIONAL" // RESIDENTIAL | COMMERCIAL | INDUSTRIAL | AGRICULTURAL | INSTITUTIONAL | RECREATIONAL
  landSizeSqm?: number
  bedroomType?: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
  bathroomType?: "SINGLE" | "SHARED" | "SELF_CONTAINED" | "PRIVATE" // SINGLE | SHARED | SELF_CONTAINED | PRIVATE
  rentalRate?: "NIGHTLY" | "WEEKLY" | "MONTHLY" // NIGHTLY | WEEKLY | MONTHLY
  roomType?: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
  utilitiesIncluded?: Array<"WIFI" | "LIGHT">
  virtualTourUrl?: string
  price: number
  priceType?: "PER_MONTH" | "EVERY_6_MONTHS" | "PER_YEAR" // PER_MONTH | EVERY_6_MONTHS | PER_YEAR
  securityDeposit?: number
  agencyFee?: number
  legalFee?: number
  cautionFee?: number
}
```

**Response:**
```typescript
{
  user: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  userId: string
  propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL" // RESIDENTIAL | COMMERCIAL | LAND | SHORT_LET | PG_HOSTEL
  listingType: "FOR_SALE" | "FOR_RENT" // FOR_SALE | FOR_RENT
  propertyStatus: "UNDER_CONSTRUCTION" | "READY" // UNDER_CONSTRUCTION | READY
  status: "DRAFT" | "ACTIVE" | "UNDER_OFFER" | "SOLD" | "RENTED" | "EXPIRED" // DRAFT | ACTIVE | UNDER_OFFER | SOLD | RENTED | EXPIRED
  title: string
  description: string
  state: string
  city: string
  fullAddress: string
  landmarks: Array<string>
  amenities: Array<string>
  bedrooms: number
  bathrooms: number
  sizeSqm: number
  unitsFloors: number
  parkingCapacity: number
  floorAreaSqm: number
  documentTypes: Array<"DEED_OF_TRANSFER" | "C_OF_O" | "SURVEY_PLAN" | "PURCHASE_RECEIPT" | "POWER_OF_ATTORNEY" | "DEED_OF_CONVEYANCE" | "DEED_OF_LEASE">
  zoningType: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "INSTITUTIONAL" | "RECREATIONAL" // RESIDENTIAL | COMMERCIAL | INDUSTRIAL | AGRICULTURAL | INSTITUTIONAL | RECREATIONAL
  landSizeSqm: number
  bedroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
  bathroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" | "PRIVATE" // SINGLE | SHARED | SELF_CONTAINED | PRIVATE
  rentalRate: "NIGHTLY" | "WEEKLY" | "MONTHLY" // NIGHTLY | WEEKLY | MONTHLY
  roomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
  utilitiesIncluded: Array<"WIFI" | "LIGHT">
  images: Array<{
    listing: Listing
    listingId: string
    url: string
    sortOrder: number
    isCover: boolean
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }>
  virtualTourUrl: string
  price: number
  priceType: "PER_MONTH" | "EVERY_6_MONTHS" | "PER_YEAR" // PER_MONTH | EVERY_6_MONTHS | PER_YEAR
  securityDeposit: number
  agencyFee: number
  legalFee: number
  cautionFee: number
  inspectionFeeType: "percentage" | "amount" // percentage | amount
  inspectionFeeValue: number
  publishedAt: string(date-time)
  likesCount: number
  searchVector?: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `GET /api/v1/listings/mine`

**MarketplaceController_findMine_v1**

🔒 **Requires Bearer token**

**Response:**
```typescript
Array<{
  user: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  userId: string
  propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL" // RESIDENTIAL | COMMERCIAL | LAND | SHORT_LET | PG_HOSTEL
  listingType: "FOR_SALE" | "FOR_RENT" // FOR_SALE | FOR_RENT
  propertyStatus: "UNDER_CONSTRUCTION" | "READY" // UNDER_CONSTRUCTION | READY
  status: "DRAFT" | "ACTIVE" | "UNDER_OFFER" | "SOLD" | "RENTED" | "EXPIRED" // DRAFT | ACTIVE | UNDER_OFFER | SOLD | RENTED | EXPIRED
  title: string
  description: string
  state: string
  city: string
  fullAddress: string
  landmarks: Array<string>
  amenities: Array<string>
  bedrooms: number
  bathrooms: number
  sizeSqm: number
  unitsFloors: number
  parkingCapacity: number
  floorAreaSqm: number
  documentTypes: Array<"DEED_OF_TRANSFER" | "C_OF_O" | "SURVEY_PLAN" | "PURCHASE_RECEIPT" | "POWER_OF_ATTORNEY" | "DEED_OF_CONVEYANCE" | "DEED_OF_LEASE">
  zoningType: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "INSTITUTIONAL" | "RECREATIONAL" // RESIDENTIAL | COMMERCIAL | INDUSTRIAL | AGRICULTURAL | INSTITUTIONAL | RECREATIONAL
  landSizeSqm: number
  bedroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
  bathroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" | "PRIVATE" // SINGLE | SHARED | SELF_CONTAINED | PRIVATE
  rentalRate: "NIGHTLY" | "WEEKLY" | "MONTHLY" // NIGHTLY | WEEKLY | MONTHLY
  roomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
  utilitiesIncluded: Array<"WIFI" | "LIGHT">
  images: Array<{
    listing: Listing
    listingId: string
    url: string
    sortOrder: number
    isCover: boolean
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }>
  virtualTourUrl: string
  price: number
  priceType: "PER_MONTH" | "EVERY_6_MONTHS" | "PER_YEAR" // PER_MONTH | EVERY_6_MONTHS | PER_YEAR
  securityDeposit: number
  agencyFee: number
  legalFee: number
  cautionFee: number
  inspectionFeeType: "percentage" | "amount" // percentage | amount
  inspectionFeeValue: number
  publishedAt: string(date-time)
  likesCount: number
  searchVector?: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}>
```

---

### `GET /api/v1/listings/{id}`

**MarketplaceController_findOne_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id`: `string`

**Response:**
```typescript
{
  user: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  userId: string
  propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL" // RESIDENTIAL | COMMERCIAL | LAND | SHORT_LET | PG_HOSTEL
  listingType: "FOR_SALE" | "FOR_RENT" // FOR_SALE | FOR_RENT
  propertyStatus: "UNDER_CONSTRUCTION" | "READY" // UNDER_CONSTRUCTION | READY
  status: "DRAFT" | "ACTIVE" | "UNDER_OFFER" | "SOLD" | "RENTED" | "EXPIRED" // DRAFT | ACTIVE | UNDER_OFFER | SOLD | RENTED | EXPIRED
  title: string
  description: string
  state: string
  city: string
  fullAddress: string
  landmarks: Array<string>
  amenities: Array<string>
  bedrooms: number
  bathrooms: number
  sizeSqm: number
  unitsFloors: number
  parkingCapacity: number
  floorAreaSqm: number
  documentTypes: Array<"DEED_OF_TRANSFER" | "C_OF_O" | "SURVEY_PLAN" | "PURCHASE_RECEIPT" | "POWER_OF_ATTORNEY" | "DEED_OF_CONVEYANCE" | "DEED_OF_LEASE">
  zoningType: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "INSTITUTIONAL" | "RECREATIONAL" // RESIDENTIAL | COMMERCIAL | INDUSTRIAL | AGRICULTURAL | INSTITUTIONAL | RECREATIONAL
  landSizeSqm: number
  bedroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
  bathroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" | "PRIVATE" // SINGLE | SHARED | SELF_CONTAINED | PRIVATE
  rentalRate: "NIGHTLY" | "WEEKLY" | "MONTHLY" // NIGHTLY | WEEKLY | MONTHLY
  roomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
  utilitiesIncluded: Array<"WIFI" | "LIGHT">
  images: Array<{
    listing: Listing
    listingId: string
    url: string
    sortOrder: number
    isCover: boolean
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }>
  virtualTourUrl: string
  price: number
  priceType: "PER_MONTH" | "EVERY_6_MONTHS" | "PER_YEAR" // PER_MONTH | EVERY_6_MONTHS | PER_YEAR
  securityDeposit: number
  agencyFee: number
  legalFee: number
  cautionFee: number
  inspectionFeeType: "percentage" | "amount" // percentage | amount
  inspectionFeeValue: number
  publishedAt: string(date-time)
  likesCount: number
  searchVector?: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `PUT /api/v1/listings/{id}`

**MarketplaceController_update_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id`: `string`

**Request Body:**
```typescript
{
  amenities?: Array<"KITCHEN_FITTED" | "KITCHEN_OPEN" | "KITCHEN_CLOSED" | "PARKING_GARAGE" | "WARDROBES_WALK_IN_CLOSET" | "AIR_CONDITIONING" | "WATER_HEATER" | "LAUNDRY_AREA" | "SECURITY_DOORS" | "POWER_BACKUP_GENERATOR" | "WATER_SUPPLY_BOREHOLE" | "INTERNET_READY_FIBER_OPTICS" | "FURNISHED" | "SEMI_FURNISHED" | "UNFURNISHED" | "SERVANT_QUARTERS_BQ" | "STUDY_HOME_OFFICE" | "OFFICE_ROOMS_WORKSPACES" | "CONFERENCE_ROOM" | "RECEPTION_AREA" | "STORAGE_WAREHOUSE_SPACE" | "PARKING_SPACE_STAFF_VISITORS" | "SECURITY_ACCESS_CCTV" | "ELEVATOR_ESCALATOR" | "POWER_BACKUP_INVERTER_GENERATOR" | "INTERNET_NETWORKING_INFRASTRUCTURE" | "FIRE_SAFETY" | "AIR_CONDITIONING_VENTILATION" | "LOADING_BAY_DELIVERY_ACCESS" | "RESTROOMS" | "ROAD_ACCESS" | "FENCED_GATED" | "DRAINAGE_SYSTEM" | "ELECTRICITY_SUPPLY_ACCESS" | "WATER_SUPPLY_ACCESS" | "DRY_SOIL" | "SWAMPY_SOIL" | "ROCKY_SOIL" | "SLOPED_TOPOGRAPHY" | "FLAT_TOPOGRAPHY" | "SECURE_NEIGHBORHOOD" | "FURNISHED_LIVING_ROOM" | "EQUIPPED_KITCHEN" | "WIFI" | "SMART_TV_CABLE_TV" | "HOUSEKEEPING_CLEANING_SERVICE" | "TOWELS_LINENS" | "AIR_CONDITIONING" | "SWIMMING_POOL" | "GYM_FITNESS_CENTER" | "PARKING_SPACE" | "SECURITY_24_7_CCTV" | "ELEVATOR_ACCESS" | "BALCONY_WITH_VIEW" | "SHARED_ROOMS_PRIVATE_ROOMS" | "SHARED_BATHROOMS_ENSUITE_OPTIONS" | "STUDY_READING_AREA" | "SHARED_KITCHEN" | "COMMON_LOUNGE_TV_ROOM" | "LAUNDRY_FACILITIES" | "WIFI_ACCESS" | "POWER_BACKUP" | "SECURITY_GATE_CCTV" | "PARKING_FOR_RESIDENTS" | "MESS_CAFETERIA" | "ELEVATOR_ACCESS" | "BALCONY_WITH_VIEW"> // KITCHEN_FITTED | KITCHEN_OPEN | KITCHEN_CLOSED | PARKING_GARAGE | WARDROBES_WALK_IN_CLOSET | AIR_CONDITIONING | WATER_HEATER | LAUNDRY_AREA | SECURITY_DOORS | POWER_BACKUP_GENERATOR | WATER_SUPPLY_BOREHOLE | INTERNET_READY_FIBER_OPTICS | FURNISHED | SEMI_FURNISHED | UNFURNISHED | SERVANT_QUARTERS_BQ | STUDY_HOME_OFFICE | OFFICE_ROOMS_WORKSPACES | CONFERENCE_ROOM | RECEPTION_AREA | STORAGE_WAREHOUSE_SPACE | PARKING_SPACE_STAFF_VISITORS | SECURITY_ACCESS_CCTV | ELEVATOR_ESCALATOR | POWER_BACKUP_INVERTER_GENERATOR | INTERNET_NETWORKING_INFRASTRUCTURE | FIRE_SAFETY | AIR_CONDITIONING_VENTILATION | LOADING_BAY_DELIVERY_ACCESS | RESTROOMS | ROAD_ACCESS | FENCED_GATED | DRAINAGE_SYSTEM | ELECTRICITY_SUPPLY_ACCESS | WATER_SUPPLY_ACCESS | DRY_SOIL | SWAMPY_SOIL | ROCKY_SOIL | SLOPED_TOPOGRAPHY | FLAT_TOPOGRAPHY | SECURE_NEIGHBORHOOD | FURNISHED_LIVING_ROOM | EQUIPPED_KITCHEN | WIFI | SMART_TV_CABLE_TV | HOUSEKEEPING_CLEANING_SERVICE | TOWELS_LINENS | AIR_CONDITIONING | SWIMMING_POOL | GYM_FITNESS_CENTER | PARKING_SPACE | SECURITY_24_7_CCTV | ELEVATOR_ACCESS | BALCONY_WITH_VIEW | SHARED_ROOMS_PRIVATE_ROOMS | SHARED_BATHROOMS_ENSUITE_OPTIONS | STUDY_READING_AREA | SHARED_KITCHEN | COMMON_LOUNGE_TV_ROOM | LAUNDRY_FACILITIES | WIFI_ACCESS | POWER_BACKUP | SECURITY_GATE_CCTV | PARKING_FOR_RESIDENTS | MESS_CAFETERIA | ELEVATOR_ACCESS | BALCONY_WITH_VIEW
  status?: "DRAFT" | "ACTIVE" | "UNDER_OFFER" | "SOLD" | "RENTED" | "EXPIRED" // DRAFT | ACTIVE | UNDER_OFFER | SOLD | RENTED | EXPIRED
  propertyType?: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL" // RESIDENTIAL | COMMERCIAL | LAND | SHORT_LET | PG_HOSTEL
  listingType?: "FOR_SALE" | "FOR_RENT" // FOR_SALE | FOR_RENT
  propertyStatus?: "UNDER_CONSTRUCTION" | "READY" // UNDER_CONSTRUCTION | READY
  title?: string
  description?: string
  state?: string
  city?: string
  fullAddress?: string
  landmarks?: Array<string>
  bedrooms?: number
  bathrooms?: number
  sizeSqm?: number
  unitsFloors?: number
  parkingCapacity?: number
  floorAreaSqm?: number
  documentTypes?: Array<"DEED_OF_TRANSFER" | "C_OF_O" | "SURVEY_PLAN" | "PURCHASE_RECEIPT" | "POWER_OF_ATTORNEY" | "DEED_OF_CONVEYANCE" | "DEED_OF_LEASE">
  zoningType?: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "INSTITUTIONAL" | "RECREATIONAL" // RESIDENTIAL | COMMERCIAL | INDUSTRIAL | AGRICULTURAL | INSTITUTIONAL | RECREATIONAL
  landSizeSqm?: number
  bedroomType?: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
  bathroomType?: "SINGLE" | "SHARED" | "SELF_CONTAINED" | "PRIVATE" // SINGLE | SHARED | SELF_CONTAINED | PRIVATE
  rentalRate?: "NIGHTLY" | "WEEKLY" | "MONTHLY" // NIGHTLY | WEEKLY | MONTHLY
  roomType?: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
  utilitiesIncluded?: Array<"WIFI" | "LIGHT">
  virtualTourUrl?: string
  price?: number
  priceType?: "PER_MONTH" | "EVERY_6_MONTHS" | "PER_YEAR" // PER_MONTH | EVERY_6_MONTHS | PER_YEAR
  securityDeposit?: number
  agencyFee?: number
  legalFee?: number
  cautionFee?: number
}
```

**Response:**
```typescript
{
  user: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  userId: string
  propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL" // RESIDENTIAL | COMMERCIAL | LAND | SHORT_LET | PG_HOSTEL
  listingType: "FOR_SALE" | "FOR_RENT" // FOR_SALE | FOR_RENT
  propertyStatus: "UNDER_CONSTRUCTION" | "READY" // UNDER_CONSTRUCTION | READY
  status: "DRAFT" | "ACTIVE" | "UNDER_OFFER" | "SOLD" | "RENTED" | "EXPIRED" // DRAFT | ACTIVE | UNDER_OFFER | SOLD | RENTED | EXPIRED
  title: string
  description: string
  state: string
  city: string
  fullAddress: string
  landmarks: Array<string>
  amenities: Array<string>
  bedrooms: number
  bathrooms: number
  sizeSqm: number
  unitsFloors: number
  parkingCapacity: number
  floorAreaSqm: number
  documentTypes: Array<"DEED_OF_TRANSFER" | "C_OF_O" | "SURVEY_PLAN" | "PURCHASE_RECEIPT" | "POWER_OF_ATTORNEY" | "DEED_OF_CONVEYANCE" | "DEED_OF_LEASE">
  zoningType: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "INSTITUTIONAL" | "RECREATIONAL" // RESIDENTIAL | COMMERCIAL | INDUSTRIAL | AGRICULTURAL | INSTITUTIONAL | RECREATIONAL
  landSizeSqm: number
  bedroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
  bathroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" | "PRIVATE" // SINGLE | SHARED | SELF_CONTAINED | PRIVATE
  rentalRate: "NIGHTLY" | "WEEKLY" | "MONTHLY" // NIGHTLY | WEEKLY | MONTHLY
  roomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
  utilitiesIncluded: Array<"WIFI" | "LIGHT">
  images: Array<{
    listing: Listing
    listingId: string
    url: string
    sortOrder: number
    isCover: boolean
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }>
  virtualTourUrl: string
  price: number
  priceType: "PER_MONTH" | "EVERY_6_MONTHS" | "PER_YEAR" // PER_MONTH | EVERY_6_MONTHS | PER_YEAR
  securityDeposit: number
  agencyFee: number
  legalFee: number
  cautionFee: number
  inspectionFeeType: "percentage" | "amount" // percentage | amount
  inspectionFeeValue: number
  publishedAt: string(date-time)
  likesCount: number
  searchVector?: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `DELETE /api/v1/listings/{id}`

**MarketplaceController_remove_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id`: `string`

**Response:** `204`

---

### `PATCH /api/v1/listings/{id}/publish`

**MarketplaceController_publish_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id`: `string`

**Response:**
```typescript
{
  user: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  userId: string
  propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL" // RESIDENTIAL | COMMERCIAL | LAND | SHORT_LET | PG_HOSTEL
  listingType: "FOR_SALE" | "FOR_RENT" // FOR_SALE | FOR_RENT
  propertyStatus: "UNDER_CONSTRUCTION" | "READY" // UNDER_CONSTRUCTION | READY
  status: "DRAFT" | "ACTIVE" | "UNDER_OFFER" | "SOLD" | "RENTED" | "EXPIRED" // DRAFT | ACTIVE | UNDER_OFFER | SOLD | RENTED | EXPIRED
  title: string
  description: string
  state: string
  city: string
  fullAddress: string
  landmarks: Array<string>
  amenities: Array<string>
  bedrooms: number
  bathrooms: number
  sizeSqm: number
  unitsFloors: number
  parkingCapacity: number
  floorAreaSqm: number
  documentTypes: Array<"DEED_OF_TRANSFER" | "C_OF_O" | "SURVEY_PLAN" | "PURCHASE_RECEIPT" | "POWER_OF_ATTORNEY" | "DEED_OF_CONVEYANCE" | "DEED_OF_LEASE">
  zoningType: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "INSTITUTIONAL" | "RECREATIONAL" // RESIDENTIAL | COMMERCIAL | INDUSTRIAL | AGRICULTURAL | INSTITUTIONAL | RECREATIONAL
  landSizeSqm: number
  bedroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
  bathroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" | "PRIVATE" // SINGLE | SHARED | SELF_CONTAINED | PRIVATE
  rentalRate: "NIGHTLY" | "WEEKLY" | "MONTHLY" // NIGHTLY | WEEKLY | MONTHLY
  roomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
  utilitiesIncluded: Array<"WIFI" | "LIGHT">
  images: Array<{
    listing: Listing
    listingId: string
    url: string
    sortOrder: number
    isCover: boolean
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }>
  virtualTourUrl: string
  price: number
  priceType: "PER_MONTH" | "EVERY_6_MONTHS" | "PER_YEAR" // PER_MONTH | EVERY_6_MONTHS | PER_YEAR
  securityDeposit: number
  agencyFee: number
  legalFee: number
  cautionFee: number
  inspectionFeeType: "percentage" | "amount" // percentage | amount
  inspectionFeeValue: number
  publishedAt: string(date-time)
  likesCount: number
  searchVector?: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `POST /api/v1/listings/{id}/images`

**MarketplaceController_addImages_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id`: `string`

**Request Body:**
```typescript
{
  files: Array<string(binary)>
  metadata?: string // JSON array of { sortOrder: number, isCover: boolean } per file
}
```

**Response:**
```typescript
Array<{
  listing: {
    user: User
    userId: string
    propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL" // RESIDENTIAL | COMMERCIAL | LAND | SHORT_LET | PG_HOSTEL
    listingType: "FOR_SALE" | "FOR_RENT" // FOR_SALE | FOR_RENT
    propertyStatus: "UNDER_CONSTRUCTION" | "READY" // UNDER_CONSTRUCTION | READY
    status: "DRAFT" | "ACTIVE" | "UNDER_OFFER" | "SOLD" | "RENTED" | "EXPIRED" // DRAFT | ACTIVE | UNDER_OFFER | SOLD | RENTED | EXPIRED
    title: string
    description: string
    state: string
    city: string
    fullAddress: string
    landmarks: Array<string>
    amenities: Array<string>
    bedrooms: number
    bathrooms: number
    sizeSqm: number
    unitsFloors: number
    parkingCapacity: number
    floorAreaSqm: number
    documentTypes: Array<"DEED_OF_TRANSFER" | "C_OF_O" | "SURVEY_PLAN" | "PURCHASE_RECEIPT" | "POWER_OF_ATTORNEY" | "DEED_OF_CONVEYANCE" | "DEED_OF_LEASE">
    zoningType: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "INSTITUTIONAL" | "RECREATIONAL" // RESIDENTIAL | COMMERCIAL | INDUSTRIAL | AGRICULTURAL | INSTITUTIONAL | RECREATIONAL
    landSizeSqm: number
    bedroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    bathroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" | "PRIVATE" // SINGLE | SHARED | SELF_CONTAINED | PRIVATE
    rentalRate: "NIGHTLY" | "WEEKLY" | "MONTHLY" // NIGHTLY | WEEKLY | MONTHLY
    roomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    utilitiesIncluded: Array<"WIFI" | "LIGHT">
    images: Array<ListingImage>
    virtualTourUrl: string
    price: number
    priceType: "PER_MONTH" | "EVERY_6_MONTHS" | "PER_YEAR" // PER_MONTH | EVERY_6_MONTHS | PER_YEAR
    securityDeposit: number
    agencyFee: number
    legalFee: number
    cautionFee: number
    inspectionFeeType: "percentage" | "amount" // percentage | amount
    inspectionFeeValue: number
    publishedAt: string(date-time)
    likesCount: number
    searchVector?: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  listingId: string
  url: string
  sortOrder: number
  isCover: boolean
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}>
```

---

### `DELETE /api/v1/listings/images/{imageId}`

**MarketplaceController_removeImage_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `imageId`: `string`

**Response:** `204`

---

### `GET /api/v1/listings/liked`

**MarketplaceController_getLiked_v1**

🔒 **Requires Bearer token**

**Response:**
```typescript
Array<{
  user: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  userId: string
  propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL" // RESIDENTIAL | COMMERCIAL | LAND | SHORT_LET | PG_HOSTEL
  listingType: "FOR_SALE" | "FOR_RENT" // FOR_SALE | FOR_RENT
  propertyStatus: "UNDER_CONSTRUCTION" | "READY" // UNDER_CONSTRUCTION | READY
  status: "DRAFT" | "ACTIVE" | "UNDER_OFFER" | "SOLD" | "RENTED" | "EXPIRED" // DRAFT | ACTIVE | UNDER_OFFER | SOLD | RENTED | EXPIRED
  title: string
  description: string
  state: string
  city: string
  fullAddress: string
  landmarks: Array<string>
  amenities: Array<string>
  bedrooms: number
  bathrooms: number
  sizeSqm: number
  unitsFloors: number
  parkingCapacity: number
  floorAreaSqm: number
  documentTypes: Array<"DEED_OF_TRANSFER" | "C_OF_O" | "SURVEY_PLAN" | "PURCHASE_RECEIPT" | "POWER_OF_ATTORNEY" | "DEED_OF_CONVEYANCE" | "DEED_OF_LEASE">
  zoningType: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "INSTITUTIONAL" | "RECREATIONAL" // RESIDENTIAL | COMMERCIAL | INDUSTRIAL | AGRICULTURAL | INSTITUTIONAL | RECREATIONAL
  landSizeSqm: number
  bedroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
  bathroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" | "PRIVATE" // SINGLE | SHARED | SELF_CONTAINED | PRIVATE
  rentalRate: "NIGHTLY" | "WEEKLY" | "MONTHLY" // NIGHTLY | WEEKLY | MONTHLY
  roomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
  utilitiesIncluded: Array<"WIFI" | "LIGHT">
  images: Array<{
    listing: Listing
    listingId: string
    url: string
    sortOrder: number
    isCover: boolean
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }>
  virtualTourUrl: string
  price: number
  priceType: "PER_MONTH" | "EVERY_6_MONTHS" | "PER_YEAR" // PER_MONTH | EVERY_6_MONTHS | PER_YEAR
  securityDeposit: number
  agencyFee: number
  legalFee: number
  cautionFee: number
  inspectionFeeType: "percentage" | "amount" // percentage | amount
  inspectionFeeValue: number
  publishedAt: string(date-time)
  likesCount: number
  searchVector?: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}>
```

---

### `GET /api/v1/listings/{id}/share-link`

**MarketplaceController_shareLink_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id`: `string`

**Response:** `200`

---

### `POST /api/v1/listings/{id}/like`

**MarketplaceController_toggleLike_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id`: `string`

**Response:** `200`

---

### `GET /api/v1/listings/{id}/inspection-fee`

**MarketplaceController_getInspectionFee_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id`: `string`

**Response:** `200`

---

### `PATCH /api/v1/listings/{id}/inspection-fee`

**MarketplaceController_setupInspectionFee_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id`: `string`

**Request Body:**
```typescript
{
  feeType: "percentage" | "amount" // percentage | amount
  value: number
}
```

**Response:**
```typescript
{
  user: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  userId: string
  propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL" // RESIDENTIAL | COMMERCIAL | LAND | SHORT_LET | PG_HOSTEL
  listingType: "FOR_SALE" | "FOR_RENT" // FOR_SALE | FOR_RENT
  propertyStatus: "UNDER_CONSTRUCTION" | "READY" // UNDER_CONSTRUCTION | READY
  status: "DRAFT" | "ACTIVE" | "UNDER_OFFER" | "SOLD" | "RENTED" | "EXPIRED" // DRAFT | ACTIVE | UNDER_OFFER | SOLD | RENTED | EXPIRED
  title: string
  description: string
  state: string
  city: string
  fullAddress: string
  landmarks: Array<string>
  amenities: Array<string>
  bedrooms: number
  bathrooms: number
  sizeSqm: number
  unitsFloors: number
  parkingCapacity: number
  floorAreaSqm: number
  documentTypes: Array<"DEED_OF_TRANSFER" | "C_OF_O" | "SURVEY_PLAN" | "PURCHASE_RECEIPT" | "POWER_OF_ATTORNEY" | "DEED_OF_CONVEYANCE" | "DEED_OF_LEASE">
  zoningType: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "INSTITUTIONAL" | "RECREATIONAL" // RESIDENTIAL | COMMERCIAL | INDUSTRIAL | AGRICULTURAL | INSTITUTIONAL | RECREATIONAL
  landSizeSqm: number
  bedroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
  bathroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" | "PRIVATE" // SINGLE | SHARED | SELF_CONTAINED | PRIVATE
  rentalRate: "NIGHTLY" | "WEEKLY" | "MONTHLY" // NIGHTLY | WEEKLY | MONTHLY
  roomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
  utilitiesIncluded: Array<"WIFI" | "LIGHT">
  images: Array<{
    listing: Listing
    listingId: string
    url: string
    sortOrder: number
    isCover: boolean
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }>
  virtualTourUrl: string
  price: number
  priceType: "PER_MONTH" | "EVERY_6_MONTHS" | "PER_YEAR" // PER_MONTH | EVERY_6_MONTHS | PER_YEAR
  securityDeposit: number
  agencyFee: number
  legalFee: number
  cautionFee: number
  inspectionFeeType: "percentage" | "amount" // percentage | amount
  inspectionFeeValue: number
  publishedAt: string(date-time)
  likesCount: number
  searchVector?: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `POST /api/v1/listings/{id}/report`

**MarketplaceController_reportListing_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id`: `string`

**Request Body:**
```typescript
{
  reason: "fraudulent" | "incorrect_info" | "duplicate" | "inappropriate" | "already_sold" | "other" // fraudulent | incorrect_info | duplicate | inappropriate | already_sold | other
  description?: string
}
```

**Response:** `201`

---

## Messages

### `GET /api/v1/messages/conversations`

**MessagesController_listConversations_v1**

🔒 **Requires Bearer token**

**Response:**
```typescript
Array<{

}>
```

---

### `POST /api/v1/messages/conversations`

**MessagesController_createConversation_v1**

🔒 **Requires Bearer token**

**Request Body:**
```typescript
{
  type: "DIRECT" | "LISTING" // DIRECT | LISTING
  listingId?: string(uuid)
  participantUserId?: string(uuid) // For DIRECT: other user id. For LISTING: ignored (use listingId).
}
```

**Response:**
```typescript
{
  type: "DIRECT" | "LISTING" // DIRECT | LISTING
  listingId: string // For LISTING conversations, links to the listing.
  participants: Array<{
    conversationId: string
    conversation: Conversation
    userId: string
    user: User
    lastReadAt: string(date-time)
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }>
  messages: Array<{
    conversationId: string
    conversation: Conversation
    senderId: string
    sender: User
    type: "TEXT" | "SYSTEM" // TEXT | SYSTEM
    content: string
    attachments: Array<MessageAttachment>
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }>
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `GET /api/v1/messages/conversations/{id}`

**MessagesController_getConversation_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id`: `string`

**Response:**
```typescript
{
  type: "DIRECT" | "LISTING" // DIRECT | LISTING
  listingId: string // For LISTING conversations, links to the listing.
  participants: Array<{
    conversationId: string
    conversation: Conversation
    userId: string
    user: User
    lastReadAt: string(date-time)
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }>
  messages: Array<{
    conversationId: string
    conversation: Conversation
    senderId: string
    sender: User
    type: "TEXT" | "SYSTEM" // TEXT | SYSTEM
    content: string
    attachments: Array<MessageAttachment>
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }>
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `GET /api/v1/messages/conversations/{id}/messages`

**MessagesController_getMessages_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id`: `string`

**Query Parameters:**
- `limit`: `number`
- `before`: `string`

**Response:**
```typescript
Array<{

}>
```

---

### `POST /api/v1/messages/conversations/{id}/messages`

**MessagesController_sendMessage_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id`: `string`

**Request Body:**
```typescript
{
  content?: string
  attachments?: Array<{
    url: string(uri)
    mimeType: string
    filename?: string
  }>
}
```

**Response:**
```typescript
{
  conversationId: string
  conversation: {
    type: "DIRECT" | "LISTING" // DIRECT | LISTING
    listingId: string // For LISTING conversations, links to the listing.
    participants: Array<ConversationParticipant>
    messages: Array<Message>
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  senderId: string
  sender: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  type: "TEXT" | "SYSTEM" // TEXT | SYSTEM
  content: string
  attachments: Array<{
    messageId: string
    message: Message
    url: string
    mimeType: string
    filename: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }>
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `POST /api/v1/messages/conversations/{id}/read`

**MessagesController_markAsRead_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id`: `string`

**Response:** `204`

---

### `POST /api/v1/messages/pusher/auth`

**Pusher private channel auth. Client sends channel_name and socket_id (e.g. from Pusher JS).
We verify JWT (via @Auth()) and that the user is a participant of the conversation for private-conversation-* channels.**

🔒 **Requires Bearer token**

**Response:** `200`

---

## Paystack

### `GET /api/v1/paystack/banks`

**PaystackController_listBanks_v1**

🔒 **Requires Bearer token**

**Query Parameters:**
- `country` *(optional)*: `string`
- `per_page` *(optional)*: `number`
- `next` *(optional)*: `string`

**Response:**
```typescript
{

}
```

---

### `GET /api/v1/paystack/banks/resolve`

**PaystackController_resolveBankAccount_v1**

🔒 **Requires Bearer token**

**Query Parameters:**
- `account_number`: `string`
- `bank_code`: `string`

**Response:**
```typescript
{

}
```

---

### `POST /api/v1/paystack/charge/card`

**PaystackController_initiateCardCharge_v1**

🔒 **Requires Bearer token**

**Response:** `201`

---

### `POST /api/v1/paystack/charge/bank`

**PaystackController_chargeBank_v1**

🔒 **Requires Bearer token**

**Response:**
```typescript
{

}
```

---

### `POST /api/v1/paystack/transfer/recipient`

**PaystackController_createTransferRecipient_v1**

🔒 **Requires Bearer token**

**Response:**
```typescript
{

}
```

---

### `POST /api/v1/paystack/withdraw`

**PaystackController_initiateWithdrawal_v1**

🔒 **Requires Bearer token**

**Response:**
```typescript
{

}
```

---

## PaystackWebhook

### `POST /api/v1/webhooks/paystack`

**PaystackWebhookController_handleWebhook_v1**

**Response:** `200`

---

## PropertyTransaction

### `GET /api/v1/property-transactions`

**PropertyTransactionController_findAll_v1**

🔒 **Requires Bearer token**

**Query Parameters:**
- `type` *(optional)*: `string`
- `status` *(optional)*: `string`

**Response:**
```typescript
Array<{
  referenceNumber: string
  type: "INSPECTION" | "SALES" | "RENTAL" // INSPECTION | SALES | RENTAL
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DECLINED" | "CANCELLED" // PENDING | IN_PROGRESS | COMPLETED | DECLINED | CANCELLED
  step: number
  listingId: string
  listing: {
    user: User
    userId: string
    propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL" // RESIDENTIAL | COMMERCIAL | LAND | SHORT_LET | PG_HOSTEL
    listingType: "FOR_SALE" | "FOR_RENT" // FOR_SALE | FOR_RENT
    propertyStatus: "UNDER_CONSTRUCTION" | "READY" // UNDER_CONSTRUCTION | READY
    status: "DRAFT" | "ACTIVE" | "UNDER_OFFER" | "SOLD" | "RENTED" | "EXPIRED" // DRAFT | ACTIVE | UNDER_OFFER | SOLD | RENTED | EXPIRED
    title: string
    description: string
    state: string
    city: string
    fullAddress: string
    landmarks: Array<string>
    amenities: Array<string>
    bedrooms: number
    bathrooms: number
    sizeSqm: number
    unitsFloors: number
    parkingCapacity: number
    floorAreaSqm: number
    documentTypes: Array<"DEED_OF_TRANSFER" | "C_OF_O" | "SURVEY_PLAN" | "PURCHASE_RECEIPT" | "POWER_OF_ATTORNEY" | "DEED_OF_CONVEYANCE" | "DEED_OF_LEASE">
    zoningType: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "INSTITUTIONAL" | "RECREATIONAL" // RESIDENTIAL | COMMERCIAL | INDUSTRIAL | AGRICULTURAL | INSTITUTIONAL | RECREATIONAL
    landSizeSqm: number
    bedroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    bathroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" | "PRIVATE" // SINGLE | SHARED | SELF_CONTAINED | PRIVATE
    rentalRate: "NIGHTLY" | "WEEKLY" | "MONTHLY" // NIGHTLY | WEEKLY | MONTHLY
    roomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    utilitiesIncluded: Array<"WIFI" | "LIGHT">
    images: Array<ListingImage>
    virtualTourUrl: string
    price: number
    priceType: "PER_MONTH" | "EVERY_6_MONTHS" | "PER_YEAR" // PER_MONTH | EVERY_6_MONTHS | PER_YEAR
    securityDeposit: number
    agencyFee: number
    legalFee: number
    cautionFee: number
    inspectionFeeType: "percentage" | "amount" // percentage | amount
    inspectionFeeValue: number
    publishedAt: string(date-time)
    likesCount: number
    searchVector?: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  buyerId: string
  buyer: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  sellerId: string
  seller: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  fundedAmountKobo: string
  propertyPriceKobo: string
  paymentRef: string
  acceptDeadlineAt: string(date-time)
  scheduledAt: string(date-time)
  scheduledEndAt: string(date-time)
  acceptedAt: string(date-time)
  declinedAt: string(date-time)
  handoverConfirmedAt: string(date-time)
  completedAt: string(date-time)
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}>
```

---

### `GET /api/v1/property-transactions/{id}`

**PropertyTransactionController_findOne_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id`: `string`

**Response:**
```typescript
{

}
```

---

### `POST /api/v1/property-transactions/{id}/accept`

**PropertyTransactionController_accept_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id`: `string`

**Response:**
```typescript
{
  referenceNumber: string
  type: "INSPECTION" | "SALES" | "RENTAL" // INSPECTION | SALES | RENTAL
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DECLINED" | "CANCELLED" // PENDING | IN_PROGRESS | COMPLETED | DECLINED | CANCELLED
  step: number
  listingId: string
  listing: {
    user: User
    userId: string
    propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL" // RESIDENTIAL | COMMERCIAL | LAND | SHORT_LET | PG_HOSTEL
    listingType: "FOR_SALE" | "FOR_RENT" // FOR_SALE | FOR_RENT
    propertyStatus: "UNDER_CONSTRUCTION" | "READY" // UNDER_CONSTRUCTION | READY
    status: "DRAFT" | "ACTIVE" | "UNDER_OFFER" | "SOLD" | "RENTED" | "EXPIRED" // DRAFT | ACTIVE | UNDER_OFFER | SOLD | RENTED | EXPIRED
    title: string
    description: string
    state: string
    city: string
    fullAddress: string
    landmarks: Array<string>
    amenities: Array<string>
    bedrooms: number
    bathrooms: number
    sizeSqm: number
    unitsFloors: number
    parkingCapacity: number
    floorAreaSqm: number
    documentTypes: Array<"DEED_OF_TRANSFER" | "C_OF_O" | "SURVEY_PLAN" | "PURCHASE_RECEIPT" | "POWER_OF_ATTORNEY" | "DEED_OF_CONVEYANCE" | "DEED_OF_LEASE">
    zoningType: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "INSTITUTIONAL" | "RECREATIONAL" // RESIDENTIAL | COMMERCIAL | INDUSTRIAL | AGRICULTURAL | INSTITUTIONAL | RECREATIONAL
    landSizeSqm: number
    bedroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    bathroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" | "PRIVATE" // SINGLE | SHARED | SELF_CONTAINED | PRIVATE
    rentalRate: "NIGHTLY" | "WEEKLY" | "MONTHLY" // NIGHTLY | WEEKLY | MONTHLY
    roomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    utilitiesIncluded: Array<"WIFI" | "LIGHT">
    images: Array<ListingImage>
    virtualTourUrl: string
    price: number
    priceType: "PER_MONTH" | "EVERY_6_MONTHS" | "PER_YEAR" // PER_MONTH | EVERY_6_MONTHS | PER_YEAR
    securityDeposit: number
    agencyFee: number
    legalFee: number
    cautionFee: number
    inspectionFeeType: "percentage" | "amount" // percentage | amount
    inspectionFeeValue: number
    publishedAt: string(date-time)
    likesCount: number
    searchVector?: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  buyerId: string
  buyer: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  sellerId: string
  seller: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  fundedAmountKobo: string
  propertyPriceKobo: string
  paymentRef: string
  acceptDeadlineAt: string(date-time)
  scheduledAt: string(date-time)
  scheduledEndAt: string(date-time)
  acceptedAt: string(date-time)
  declinedAt: string(date-time)
  handoverConfirmedAt: string(date-time)
  completedAt: string(date-time)
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `POST /api/v1/property-transactions/{id}/decline`

**PropertyTransactionController_decline_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id`: `string`

**Response:**
```typescript
{
  referenceNumber: string
  type: "INSPECTION" | "SALES" | "RENTAL" // INSPECTION | SALES | RENTAL
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DECLINED" | "CANCELLED" // PENDING | IN_PROGRESS | COMPLETED | DECLINED | CANCELLED
  step: number
  listingId: string
  listing: {
    user: User
    userId: string
    propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL" // RESIDENTIAL | COMMERCIAL | LAND | SHORT_LET | PG_HOSTEL
    listingType: "FOR_SALE" | "FOR_RENT" // FOR_SALE | FOR_RENT
    propertyStatus: "UNDER_CONSTRUCTION" | "READY" // UNDER_CONSTRUCTION | READY
    status: "DRAFT" | "ACTIVE" | "UNDER_OFFER" | "SOLD" | "RENTED" | "EXPIRED" // DRAFT | ACTIVE | UNDER_OFFER | SOLD | RENTED | EXPIRED
    title: string
    description: string
    state: string
    city: string
    fullAddress: string
    landmarks: Array<string>
    amenities: Array<string>
    bedrooms: number
    bathrooms: number
    sizeSqm: number
    unitsFloors: number
    parkingCapacity: number
    floorAreaSqm: number
    documentTypes: Array<"DEED_OF_TRANSFER" | "C_OF_O" | "SURVEY_PLAN" | "PURCHASE_RECEIPT" | "POWER_OF_ATTORNEY" | "DEED_OF_CONVEYANCE" | "DEED_OF_LEASE">
    zoningType: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "INSTITUTIONAL" | "RECREATIONAL" // RESIDENTIAL | COMMERCIAL | INDUSTRIAL | AGRICULTURAL | INSTITUTIONAL | RECREATIONAL
    landSizeSqm: number
    bedroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    bathroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" | "PRIVATE" // SINGLE | SHARED | SELF_CONTAINED | PRIVATE
    rentalRate: "NIGHTLY" | "WEEKLY" | "MONTHLY" // NIGHTLY | WEEKLY | MONTHLY
    roomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    utilitiesIncluded: Array<"WIFI" | "LIGHT">
    images: Array<ListingImage>
    virtualTourUrl: string
    price: number
    priceType: "PER_MONTH" | "EVERY_6_MONTHS" | "PER_YEAR" // PER_MONTH | EVERY_6_MONTHS | PER_YEAR
    securityDeposit: number
    agencyFee: number
    legalFee: number
    cautionFee: number
    inspectionFeeType: "percentage" | "amount" // percentage | amount
    inspectionFeeValue: number
    publishedAt: string(date-time)
    likesCount: number
    searchVector?: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  buyerId: string
  buyer: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  sellerId: string
  seller: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  fundedAmountKobo: string
  propertyPriceKobo: string
  paymentRef: string
  acceptDeadlineAt: string(date-time)
  scheduledAt: string(date-time)
  scheduledEndAt: string(date-time)
  acceptedAt: string(date-time)
  declinedAt: string(date-time)
  handoverConfirmedAt: string(date-time)
  completedAt: string(date-time)
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `POST /api/v1/property-transactions/{id}/confirm-tour`

**PropertyTransactionController_confirmTour_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id`: `string`

**Response:**
```typescript
{
  referenceNumber: string
  type: "INSPECTION" | "SALES" | "RENTAL" // INSPECTION | SALES | RENTAL
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DECLINED" | "CANCELLED" // PENDING | IN_PROGRESS | COMPLETED | DECLINED | CANCELLED
  step: number
  listingId: string
  listing: {
    user: User
    userId: string
    propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL" // RESIDENTIAL | COMMERCIAL | LAND | SHORT_LET | PG_HOSTEL
    listingType: "FOR_SALE" | "FOR_RENT" // FOR_SALE | FOR_RENT
    propertyStatus: "UNDER_CONSTRUCTION" | "READY" // UNDER_CONSTRUCTION | READY
    status: "DRAFT" | "ACTIVE" | "UNDER_OFFER" | "SOLD" | "RENTED" | "EXPIRED" // DRAFT | ACTIVE | UNDER_OFFER | SOLD | RENTED | EXPIRED
    title: string
    description: string
    state: string
    city: string
    fullAddress: string
    landmarks: Array<string>
    amenities: Array<string>
    bedrooms: number
    bathrooms: number
    sizeSqm: number
    unitsFloors: number
    parkingCapacity: number
    floorAreaSqm: number
    documentTypes: Array<"DEED_OF_TRANSFER" | "C_OF_O" | "SURVEY_PLAN" | "PURCHASE_RECEIPT" | "POWER_OF_ATTORNEY" | "DEED_OF_CONVEYANCE" | "DEED_OF_LEASE">
    zoningType: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "INSTITUTIONAL" | "RECREATIONAL" // RESIDENTIAL | COMMERCIAL | INDUSTRIAL | AGRICULTURAL | INSTITUTIONAL | RECREATIONAL
    landSizeSqm: number
    bedroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    bathroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" | "PRIVATE" // SINGLE | SHARED | SELF_CONTAINED | PRIVATE
    rentalRate: "NIGHTLY" | "WEEKLY" | "MONTHLY" // NIGHTLY | WEEKLY | MONTHLY
    roomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    utilitiesIncluded: Array<"WIFI" | "LIGHT">
    images: Array<ListingImage>
    virtualTourUrl: string
    price: number
    priceType: "PER_MONTH" | "EVERY_6_MONTHS" | "PER_YEAR" // PER_MONTH | EVERY_6_MONTHS | PER_YEAR
    securityDeposit: number
    agencyFee: number
    legalFee: number
    cautionFee: number
    inspectionFeeType: "percentage" | "amount" // percentage | amount
    inspectionFeeValue: number
    publishedAt: string(date-time)
    likesCount: number
    searchVector?: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  buyerId: string
  buyer: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  sellerId: string
  seller: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  fundedAmountKobo: string
  propertyPriceKobo: string
  paymentRef: string
  acceptDeadlineAt: string(date-time)
  scheduledAt: string(date-time)
  scheduledEndAt: string(date-time)
  acceptedAt: string(date-time)
  declinedAt: string(date-time)
  handoverConfirmedAt: string(date-time)
  completedAt: string(date-time)
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `POST /api/v1/property-transactions/{id}/confirm-handover`

**PropertyTransactionController_confirmHandover_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id`: `string`

**Response:**
```typescript
{
  referenceNumber: string
  type: "INSPECTION" | "SALES" | "RENTAL" // INSPECTION | SALES | RENTAL
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DECLINED" | "CANCELLED" // PENDING | IN_PROGRESS | COMPLETED | DECLINED | CANCELLED
  step: number
  listingId: string
  listing: {
    user: User
    userId: string
    propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL" // RESIDENTIAL | COMMERCIAL | LAND | SHORT_LET | PG_HOSTEL
    listingType: "FOR_SALE" | "FOR_RENT" // FOR_SALE | FOR_RENT
    propertyStatus: "UNDER_CONSTRUCTION" | "READY" // UNDER_CONSTRUCTION | READY
    status: "DRAFT" | "ACTIVE" | "UNDER_OFFER" | "SOLD" | "RENTED" | "EXPIRED" // DRAFT | ACTIVE | UNDER_OFFER | SOLD | RENTED | EXPIRED
    title: string
    description: string
    state: string
    city: string
    fullAddress: string
    landmarks: Array<string>
    amenities: Array<string>
    bedrooms: number
    bathrooms: number
    sizeSqm: number
    unitsFloors: number
    parkingCapacity: number
    floorAreaSqm: number
    documentTypes: Array<"DEED_OF_TRANSFER" | "C_OF_O" | "SURVEY_PLAN" | "PURCHASE_RECEIPT" | "POWER_OF_ATTORNEY" | "DEED_OF_CONVEYANCE" | "DEED_OF_LEASE">
    zoningType: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "INSTITUTIONAL" | "RECREATIONAL" // RESIDENTIAL | COMMERCIAL | INDUSTRIAL | AGRICULTURAL | INSTITUTIONAL | RECREATIONAL
    landSizeSqm: number
    bedroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    bathroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" | "PRIVATE" // SINGLE | SHARED | SELF_CONTAINED | PRIVATE
    rentalRate: "NIGHTLY" | "WEEKLY" | "MONTHLY" // NIGHTLY | WEEKLY | MONTHLY
    roomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    utilitiesIncluded: Array<"WIFI" | "LIGHT">
    images: Array<ListingImage>
    virtualTourUrl: string
    price: number
    priceType: "PER_MONTH" | "EVERY_6_MONTHS" | "PER_YEAR" // PER_MONTH | EVERY_6_MONTHS | PER_YEAR
    securityDeposit: number
    agencyFee: number
    legalFee: number
    cautionFee: number
    inspectionFeeType: "percentage" | "amount" // percentage | amount
    inspectionFeeValue: number
    publishedAt: string(date-time)
    likesCount: number
    searchVector?: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  buyerId: string
  buyer: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  sellerId: string
  seller: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  fundedAmountKobo: string
  propertyPriceKobo: string
  paymentRef: string
  acceptDeadlineAt: string(date-time)
  scheduledAt: string(date-time)
  scheduledEndAt: string(date-time)
  acceptedAt: string(date-time)
  declinedAt: string(date-time)
  handoverConfirmedAt: string(date-time)
  completedAt: string(date-time)
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `POST /api/v1/property-transactions/{id}/confirm-completion`

**PropertyTransactionController_confirmCompletion_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id`: `string`

**Response:**
```typescript
{
  referenceNumber: string
  type: "INSPECTION" | "SALES" | "RENTAL" // INSPECTION | SALES | RENTAL
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DECLINED" | "CANCELLED" // PENDING | IN_PROGRESS | COMPLETED | DECLINED | CANCELLED
  step: number
  listingId: string
  listing: {
    user: User
    userId: string
    propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL" // RESIDENTIAL | COMMERCIAL | LAND | SHORT_LET | PG_HOSTEL
    listingType: "FOR_SALE" | "FOR_RENT" // FOR_SALE | FOR_RENT
    propertyStatus: "UNDER_CONSTRUCTION" | "READY" // UNDER_CONSTRUCTION | READY
    status: "DRAFT" | "ACTIVE" | "UNDER_OFFER" | "SOLD" | "RENTED" | "EXPIRED" // DRAFT | ACTIVE | UNDER_OFFER | SOLD | RENTED | EXPIRED
    title: string
    description: string
    state: string
    city: string
    fullAddress: string
    landmarks: Array<string>
    amenities: Array<string>
    bedrooms: number
    bathrooms: number
    sizeSqm: number
    unitsFloors: number
    parkingCapacity: number
    floorAreaSqm: number
    documentTypes: Array<"DEED_OF_TRANSFER" | "C_OF_O" | "SURVEY_PLAN" | "PURCHASE_RECEIPT" | "POWER_OF_ATTORNEY" | "DEED_OF_CONVEYANCE" | "DEED_OF_LEASE">
    zoningType: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "INSTITUTIONAL" | "RECREATIONAL" // RESIDENTIAL | COMMERCIAL | INDUSTRIAL | AGRICULTURAL | INSTITUTIONAL | RECREATIONAL
    landSizeSqm: number
    bedroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    bathroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" | "PRIVATE" // SINGLE | SHARED | SELF_CONTAINED | PRIVATE
    rentalRate: "NIGHTLY" | "WEEKLY" | "MONTHLY" // NIGHTLY | WEEKLY | MONTHLY
    roomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    utilitiesIncluded: Array<"WIFI" | "LIGHT">
    images: Array<ListingImage>
    virtualTourUrl: string
    price: number
    priceType: "PER_MONTH" | "EVERY_6_MONTHS" | "PER_YEAR" // PER_MONTH | EVERY_6_MONTHS | PER_YEAR
    securityDeposit: number
    agencyFee: number
    legalFee: number
    cautionFee: number
    inspectionFeeType: "percentage" | "amount" // percentage | amount
    inspectionFeeValue: number
    publishedAt: string(date-time)
    likesCount: number
    searchVector?: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  buyerId: string
  buyer: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  sellerId: string
  seller: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  fundedAmountKobo: string
  propertyPriceKobo: string
  paymentRef: string
  acceptDeadlineAt: string(date-time)
  scheduledAt: string(date-time)
  scheduledEndAt: string(date-time)
  acceptedAt: string(date-time)
  declinedAt: string(date-time)
  handoverConfirmedAt: string(date-time)
  completedAt: string(date-time)
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

## QoreIdWebhook

### `POST /api/v1/webhooks/qoreid`

**QoreIdWebhookController_handleCallback_v1**

**Response:** `200`

---

## Transactions

### `GET /api/v1/transactions`

**Returns the current user's transaction records with optional type filter and pagination.**

🔒 **Requires Bearer token**

**Query Parameters:**
- `limit`: `number`
- `page`: `number`
- `type`: `string`

**Response:** `200`

---

## Verification

### `POST /api/v1/verifications/bvn`

**VerificationController_verifyBvn_v1**

**Request Body:**
```typescript
{
  bvn: string
  firstName: string
  lastName: string
  dateOfBirth: string
}
```

**Response:**
```typescript
{

}
```

---

### `POST /api/v1/verifications/id`

**VerificationController_verifyId_v1**

**Request Body:**
```typescript
{
  idType: "INTERNATIONAL_PASSPORT" | "DRIVERS_LICENSE" | "VOTERS_CARD" | "NIN" | "BVN" // INTERNATIONAL_PASSPORT | DRIVERS_LICENSE | VOTERS_CARD | NIN | BVN
  idNumber: string
  firstName: string
  lastName: string
  dateOfBirth?: string
  gender?: string
}
```

**Response:**
```typescript
{

}
```

---

## Wallet

### `GET /api/v1/wallet/balance`

**Returns the current user's wallet balance (withdrawable) and escrow balance (non-withdrawable).
Amounts are in kobo (integer). Divide by 100 for Naira.**

🔒 **Requires Bearer token**

**Response:** `200`

---

### `GET /api/v1/wallet/virtual-account`

**Returns the current user's dedicated virtual account (for receiving Naira).
If the user does not have one yet (e.g. legacy account), creation is attempted.**

🔒 **Requires Bearer token**

**Response:**
```typescript
{

}
```

---

## Data Models

### ActionWithReasonDto

```typescript
{
  reason: string
}
```

### AddBankAccountDto

```typescript
{
  bankCode: string
  accountNumber: string
}
```

### AddCryptoWalletDto

```typescript
{
  walletType: "USDT" | "BTC" | "ETH" // USDT | BTC | ETH
  walletAddress: string
}
```

### AddLinkedAccountDto

```typescript
{
  role: "PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN" // PROPERTY_SEEKER | LANDLORD | REAL_ESTATE_AGENT | DIASPORA_INVESTOR | DEVELOPER | ADMIN
  displayName?: string
}
```

### AgentAvailability

```typescript
{
  userId: string
  user: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7 // 1 | 2 | 3 | 4 | 5 | 6 | 7
  startTime: string // Time of day, e.g. "09:00" (24h)
  endTime: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

### AgentProfile

```typescript
{
  user: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  userId: string
  bvn: string
  isBvnVerified: boolean
  dateOfBirth: string(date-time)
  address: string
  postCode: string
  city: string
  idType: "INTERNATIONAL_PASSPORT" | "DRIVERS_LICENSE" | "VOTERS_CARD" | "NIN" | "BVN" // INTERNATIONAL_PASSPORT | DRIVERS_LICENSE | VOTERS_CARD | NIN | BVN
  idNumber: string
  idDocumentUrl: string
  isIdVerified: boolean
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

### AvailabilitySlotDto

```typescript
{
  dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7 // 1 | 2 | 3 | 4 | 5 | 6 | 7
  startTime: string
  endTime: string
}
```

### CalendarEvent

```typescript
{
  userId: string
  user: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  title: string
  startAt: string(date-time)
  endAt: string(date-time)
  listingId: string
  listing: {
    user: User
    userId: string
    propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL" // RESIDENTIAL | COMMERCIAL | LAND | SHORT_LET | PG_HOSTEL
    listingType: "FOR_SALE" | "FOR_RENT" // FOR_SALE | FOR_RENT
    propertyStatus: "UNDER_CONSTRUCTION" | "READY" // UNDER_CONSTRUCTION | READY
    status: "DRAFT" | "ACTIVE" | "UNDER_OFFER" | "SOLD" | "RENTED" | "EXPIRED" // DRAFT | ACTIVE | UNDER_OFFER | SOLD | RENTED | EXPIRED
    title: string
    description: string
    state: string
    city: string
    fullAddress: string
    landmarks: Array<string>
    amenities: Array<string>
    bedrooms: number
    bathrooms: number
    sizeSqm: number
    unitsFloors: number
    parkingCapacity: number
    floorAreaSqm: number
    documentTypes: Array<"DEED_OF_TRANSFER" | "C_OF_O" | "SURVEY_PLAN" | "PURCHASE_RECEIPT" | "POWER_OF_ATTORNEY" | "DEED_OF_CONVEYANCE" | "DEED_OF_LEASE">
    zoningType: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "INSTITUTIONAL" | "RECREATIONAL" // RESIDENTIAL | COMMERCIAL | INDUSTRIAL | AGRICULTURAL | INSTITUTIONAL | RECREATIONAL
    landSizeSqm: number
    bedroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    bathroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" | "PRIVATE" // SINGLE | SHARED | SELF_CONTAINED | PRIVATE
    rentalRate: "NIGHTLY" | "WEEKLY" | "MONTHLY" // NIGHTLY | WEEKLY | MONTHLY
    roomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    utilitiesIncluded: Array<"WIFI" | "LIGHT">
    images: Array<ListingImage>
    virtualTourUrl: string
    price: number
    priceType: "PER_MONTH" | "EVERY_6_MONTHS" | "PER_YEAR" // PER_MONTH | EVERY_6_MONTHS | PER_YEAR
    securityDeposit: number
    agencyFee: number
    legalFee: number
    cautionFee: number
    inspectionFeeType: "percentage" | "amount" // percentage | amount
    inspectionFeeValue: number
    publishedAt: string(date-time)
    likesCount: number
    searchVector?: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  eventType: "INSPECTION" | "TOUR" | "MEETING" | "OTHER" // INSPECTION | TOUR | MEETING | OTHER
  description: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

### CompletePaymentStepDto

```typescript
{
  bankAccount: {
    bankCode: string
    accountNumber: string
  }
  cryptoWallet?: {
    walletType: "USDT" | "BTC" | "ETH" // USDT | BTC | ETH
    walletAddress: string
  }
}
```

### Conversation

```typescript
{
  type: "DIRECT" | "LISTING" // DIRECT | LISTING
  listingId: string // For LISTING conversations, links to the listing.
  participants: Array<{
    conversationId: string
    conversation: Conversation
    userId: string
    user: User
    lastReadAt: string(date-time)
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }>
  messages: Array<{
    conversationId: string
    conversation: Conversation
    senderId: string
    sender: User
    type: "TEXT" | "SYSTEM" // TEXT | SYSTEM
    content: string
    attachments: Array<MessageAttachment>
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }>
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

### ConversationParticipant

```typescript
{
  conversationId: string
  conversation: {
    type: "DIRECT" | "LISTING" // DIRECT | LISTING
    listingId: string // For LISTING conversations, links to the listing.
    participants: Array<ConversationParticipant>
    messages: Array<Message>
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  userId: string
  user: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  lastReadAt: string(date-time)
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

### CreateAdminDto

```typescript
{
  firstName: string
  lastName: string
  email: string
  password: string
  username?: string
}
```

### CreateCalendarEventDto

```typescript
{
  title: string
  startAt: string
  endAt: string
  listingId?: string(uuid)
  eventType?: "INSPECTION" | "TOUR" | "MEETING" | "OTHER" // INSPECTION | TOUR | MEETING | OTHER
  description?: string
}
```

### CreateConversationDto

```typescript
{
  type: "DIRECT" | "LISTING" // DIRECT | LISTING
  listingId?: string(uuid)
  participantUserId?: string(uuid) // For DIRECT: other user id. For LISTING: ignored (use listingId).
}
```

### CreateCustomDocumentDto

```typescript
{
  title: string
  fileUrl: string(uri)
  fileSizeBytes: number
  mimeType: string
  filename?: string
  listingId?: string(uuid)
  contentHash?: string // Precomputed SHA-256 (hex). If omitted, server will download from fileUrl to compute hash for dedupe.
  conversationId?: string(uuid)
  messageId?: string(uuid)
}
```

### CreateListingDto

```typescript
{
  amenities?: Array<"KITCHEN_FITTED" | "KITCHEN_OPEN" | "KITCHEN_CLOSED" | "PARKING_GARAGE" | "WARDROBES_WALK_IN_CLOSET" | "AIR_CONDITIONING" | "WATER_HEATER" | "LAUNDRY_AREA" | "SECURITY_DOORS" | "POWER_BACKUP_GENERATOR" | "WATER_SUPPLY_BOREHOLE" | "INTERNET_READY_FIBER_OPTICS" | "FURNISHED" | "SEMI_FURNISHED" | "UNFURNISHED" | "SERVANT_QUARTERS_BQ" | "STUDY_HOME_OFFICE" | "OFFICE_ROOMS_WORKSPACES" | "CONFERENCE_ROOM" | "RECEPTION_AREA" | "STORAGE_WAREHOUSE_SPACE" | "PARKING_SPACE_STAFF_VISITORS" | "SECURITY_ACCESS_CCTV" | "ELEVATOR_ESCALATOR" | "POWER_BACKUP_INVERTER_GENERATOR" | "INTERNET_NETWORKING_INFRASTRUCTURE" | "FIRE_SAFETY" | "AIR_CONDITIONING_VENTILATION" | "LOADING_BAY_DELIVERY_ACCESS" | "RESTROOMS" | "ROAD_ACCESS" | "FENCED_GATED" | "DRAINAGE_SYSTEM" | "ELECTRICITY_SUPPLY_ACCESS" | "WATER_SUPPLY_ACCESS" | "DRY_SOIL" | "SWAMPY_SOIL" | "ROCKY_SOIL" | "SLOPED_TOPOGRAPHY" | "FLAT_TOPOGRAPHY" | "SECURE_NEIGHBORHOOD" | "FURNISHED_LIVING_ROOM" | "EQUIPPED_KITCHEN" | "WIFI" | "SMART_TV_CABLE_TV" | "HOUSEKEEPING_CLEANING_SERVICE" | "TOWELS_LINENS" | "AIR_CONDITIONING" | "SWIMMING_POOL" | "GYM_FITNESS_CENTER" | "PARKING_SPACE" | "SECURITY_24_7_CCTV" | "ELEVATOR_ACCESS" | "BALCONY_WITH_VIEW" | "SHARED_ROOMS_PRIVATE_ROOMS" | "SHARED_BATHROOMS_ENSUITE_OPTIONS" | "STUDY_READING_AREA" | "SHARED_KITCHEN" | "COMMON_LOUNGE_TV_ROOM" | "LAUNDRY_FACILITIES" | "WIFI_ACCESS" | "POWER_BACKUP" | "SECURITY_GATE_CCTV" | "PARKING_FOR_RESIDENTS" | "MESS_CAFETERIA" | "ELEVATOR_ACCESS" | "BALCONY_WITH_VIEW"> // KITCHEN_FITTED | KITCHEN_OPEN | KITCHEN_CLOSED | PARKING_GARAGE | WARDROBES_WALK_IN_CLOSET | AIR_CONDITIONING | WATER_HEATER | LAUNDRY_AREA | SECURITY_DOORS | POWER_BACKUP_GENERATOR | WATER_SUPPLY_BOREHOLE | INTERNET_READY_FIBER_OPTICS | FURNISHED | SEMI_FURNISHED | UNFURNISHED | SERVANT_QUARTERS_BQ | STUDY_HOME_OFFICE | OFFICE_ROOMS_WORKSPACES | CONFERENCE_ROOM | RECEPTION_AREA | STORAGE_WAREHOUSE_SPACE | PARKING_SPACE_STAFF_VISITORS | SECURITY_ACCESS_CCTV | ELEVATOR_ESCALATOR | POWER_BACKUP_INVERTER_GENERATOR | INTERNET_NETWORKING_INFRASTRUCTURE | FIRE_SAFETY | AIR_CONDITIONING_VENTILATION | LOADING_BAY_DELIVERY_ACCESS | RESTROOMS | ROAD_ACCESS | FENCED_GATED | DRAINAGE_SYSTEM | ELECTRICITY_SUPPLY_ACCESS | WATER_SUPPLY_ACCESS | DRY_SOIL | SWAMPY_SOIL | ROCKY_SOIL | SLOPED_TOPOGRAPHY | FLAT_TOPOGRAPHY | SECURE_NEIGHBORHOOD | FURNISHED_LIVING_ROOM | EQUIPPED_KITCHEN | WIFI | SMART_TV_CABLE_TV | HOUSEKEEPING_CLEANING_SERVICE | TOWELS_LINENS | AIR_CONDITIONING | SWIMMING_POOL | GYM_FITNESS_CENTER | PARKING_SPACE | SECURITY_24_7_CCTV | ELEVATOR_ACCESS | BALCONY_WITH_VIEW | SHARED_ROOMS_PRIVATE_ROOMS | SHARED_BATHROOMS_ENSUITE_OPTIONS | STUDY_READING_AREA | SHARED_KITCHEN | COMMON_LOUNGE_TV_ROOM | LAUNDRY_FACILITIES | WIFI_ACCESS | POWER_BACKUP | SECURITY_GATE_CCTV | PARKING_FOR_RESIDENTS | MESS_CAFETERIA | ELEVATOR_ACCESS | BALCONY_WITH_VIEW
  propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL" // RESIDENTIAL | COMMERCIAL | LAND | SHORT_LET | PG_HOSTEL
  listingType: "FOR_SALE" | "FOR_RENT" // FOR_SALE | FOR_RENT
  propertyStatus: "UNDER_CONSTRUCTION" | "READY" // UNDER_CONSTRUCTION | READY
  title: string
  description: string
  state: string
  city: string
  fullAddress: string
  landmarks?: Array<string>
  bedrooms?: number
  bathrooms?: number
  sizeSqm?: number
  unitsFloors?: number
  parkingCapacity?: number
  floorAreaSqm?: number
  documentTypes?: Array<"DEED_OF_TRANSFER" | "C_OF_O" | "SURVEY_PLAN" | "PURCHASE_RECEIPT" | "POWER_OF_ATTORNEY" | "DEED_OF_CONVEYANCE" | "DEED_OF_LEASE">
  zoningType?: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "INSTITUTIONAL" | "RECREATIONAL" // RESIDENTIAL | COMMERCIAL | INDUSTRIAL | AGRICULTURAL | INSTITUTIONAL | RECREATIONAL
  landSizeSqm?: number
  bedroomType?: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
  bathroomType?: "SINGLE" | "SHARED" | "SELF_CONTAINED" | "PRIVATE" // SINGLE | SHARED | SELF_CONTAINED | PRIVATE
  rentalRate?: "NIGHTLY" | "WEEKLY" | "MONTHLY" // NIGHTLY | WEEKLY | MONTHLY
  roomType?: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
  utilitiesIncluded?: Array<"WIFI" | "LIGHT">
  virtualTourUrl?: string
  price: number
  priceType?: "PER_MONTH" | "EVERY_6_MONTHS" | "PER_YEAR" // PER_MONTH | EVERY_6_MONTHS | PER_YEAR
  securityDeposit?: number
  agencyFee?: number
  legalFee?: number
  cautionFee?: number
}
```

### Document

```typescript
{
  title: string
  documentType: "STANDARD_RENTAL_AGREEMENT" | "PROPERTY_SALE_AGREEMENT" | "BROKER_COMMISSION_AGREEMENT" | "PROPERTY_MANAGEMENT_AGREEMENT" | "CUSTOM" // STANDARD_RENTAL_AGREEMENT | PROPERTY_SALE_AGREEMENT | BROKER_COMMISSION_AGREEMENT | PROPERTY_MANAGEMENT_AGREEMENT | CUSTOM
  userId: string
  user: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  listingId: string
  listing: {
    user: User
    userId: string
    propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL" // RESIDENTIAL | COMMERCIAL | LAND | SHORT_LET | PG_HOSTEL
    listingType: "FOR_SALE" | "FOR_RENT" // FOR_SALE | FOR_RENT
    propertyStatus: "UNDER_CONSTRUCTION" | "READY" // UNDER_CONSTRUCTION | READY
    status: "DRAFT" | "ACTIVE" | "UNDER_OFFER" | "SOLD" | "RENTED" | "EXPIRED" // DRAFT | ACTIVE | UNDER_OFFER | SOLD | RENTED | EXPIRED
    title: string
    description: string
    state: string
    city: string
    fullAddress: string
    landmarks: Array<string>
    amenities: Array<string>
    bedrooms: number
    bathrooms: number
    sizeSqm: number
    unitsFloors: number
    parkingCapacity: number
    floorAreaSqm: number
    documentTypes: Array<"DEED_OF_TRANSFER" | "C_OF_O" | "SURVEY_PLAN" | "PURCHASE_RECEIPT" | "POWER_OF_ATTORNEY" | "DEED_OF_CONVEYANCE" | "DEED_OF_LEASE">
    zoningType: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "INSTITUTIONAL" | "RECREATIONAL" // RESIDENTIAL | COMMERCIAL | INDUSTRIAL | AGRICULTURAL | INSTITUTIONAL | RECREATIONAL
    landSizeSqm: number
    bedroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    bathroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" | "PRIVATE" // SINGLE | SHARED | SELF_CONTAINED | PRIVATE
    rentalRate: "NIGHTLY" | "WEEKLY" | "MONTHLY" // NIGHTLY | WEEKLY | MONTHLY
    roomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    utilitiesIncluded: Array<"WIFI" | "LIGHT">
    images: Array<ListingImage>
    virtualTourUrl: string
    price: number
    priceType: "PER_MONTH" | "EVERY_6_MONTHS" | "PER_YEAR" // PER_MONTH | EVERY_6_MONTHS | PER_YEAR
    securityDeposit: number
    agencyFee: number
    legalFee: number
    cautionFee: number
    inspectionFeeType: "percentage" | "amount" // percentage | amount
    inspectionFeeValue: number
    publishedAt: string(date-time)
    likesCount: number
    searchVector?: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  fileUrl: string // Null for template docs until PDF is generated
  fileSizeBytes: number
  mimeType: string
  filename: string
  contentHash: string // SHA-256 of file content; used to dedupe uploads (reuse existing file if hash exists)
  conversationId: string // For CUSTOM documents: conversation this was sent from
  messageId: string // For CUSTOM documents: source message attachment
  metadata: {

  } // Template form data (parties, financial terms, lease duration, options, etc.)
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

### Listing

```typescript
{
  user: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  userId: string
  propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL" // RESIDENTIAL | COMMERCIAL | LAND | SHORT_LET | PG_HOSTEL
  listingType: "FOR_SALE" | "FOR_RENT" // FOR_SALE | FOR_RENT
  propertyStatus: "UNDER_CONSTRUCTION" | "READY" // UNDER_CONSTRUCTION | READY
  status: "DRAFT" | "ACTIVE" | "UNDER_OFFER" | "SOLD" | "RENTED" | "EXPIRED" // DRAFT | ACTIVE | UNDER_OFFER | SOLD | RENTED | EXPIRED
  title: string
  description: string
  state: string
  city: string
  fullAddress: string
  landmarks: Array<string>
  amenities: Array<string>
  bedrooms: number
  bathrooms: number
  sizeSqm: number
  unitsFloors: number
  parkingCapacity: number
  floorAreaSqm: number
  documentTypes: Array<"DEED_OF_TRANSFER" | "C_OF_O" | "SURVEY_PLAN" | "PURCHASE_RECEIPT" | "POWER_OF_ATTORNEY" | "DEED_OF_CONVEYANCE" | "DEED_OF_LEASE">
  zoningType: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "INSTITUTIONAL" | "RECREATIONAL" // RESIDENTIAL | COMMERCIAL | INDUSTRIAL | AGRICULTURAL | INSTITUTIONAL | RECREATIONAL
  landSizeSqm: number
  bedroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
  bathroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" | "PRIVATE" // SINGLE | SHARED | SELF_CONTAINED | PRIVATE
  rentalRate: "NIGHTLY" | "WEEKLY" | "MONTHLY" // NIGHTLY | WEEKLY | MONTHLY
  roomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
  utilitiesIncluded: Array<"WIFI" | "LIGHT">
  images: Array<{
    listing: Listing
    listingId: string
    url: string
    sortOrder: number
    isCover: boolean
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }>
  virtualTourUrl: string
  price: number
  priceType: "PER_MONTH" | "EVERY_6_MONTHS" | "PER_YEAR" // PER_MONTH | EVERY_6_MONTHS | PER_YEAR
  securityDeposit: number
  agencyFee: number
  legalFee: number
  cautionFee: number
  inspectionFeeType: "percentage" | "amount" // percentage | amount
  inspectionFeeValue: number
  publishedAt: string(date-time)
  likesCount: number
  searchVector?: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

### ListingImage

```typescript
{
  listing: {
    user: User
    userId: string
    propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL" // RESIDENTIAL | COMMERCIAL | LAND | SHORT_LET | PG_HOSTEL
    listingType: "FOR_SALE" | "FOR_RENT" // FOR_SALE | FOR_RENT
    propertyStatus: "UNDER_CONSTRUCTION" | "READY" // UNDER_CONSTRUCTION | READY
    status: "DRAFT" | "ACTIVE" | "UNDER_OFFER" | "SOLD" | "RENTED" | "EXPIRED" // DRAFT | ACTIVE | UNDER_OFFER | SOLD | RENTED | EXPIRED
    title: string
    description: string
    state: string
    city: string
    fullAddress: string
    landmarks: Array<string>
    amenities: Array<string>
    bedrooms: number
    bathrooms: number
    sizeSqm: number
    unitsFloors: number
    parkingCapacity: number
    floorAreaSqm: number
    documentTypes: Array<"DEED_OF_TRANSFER" | "C_OF_O" | "SURVEY_PLAN" | "PURCHASE_RECEIPT" | "POWER_OF_ATTORNEY" | "DEED_OF_CONVEYANCE" | "DEED_OF_LEASE">
    zoningType: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "INSTITUTIONAL" | "RECREATIONAL" // RESIDENTIAL | COMMERCIAL | INDUSTRIAL | AGRICULTURAL | INSTITUTIONAL | RECREATIONAL
    landSizeSqm: number
    bedroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    bathroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" | "PRIVATE" // SINGLE | SHARED | SELF_CONTAINED | PRIVATE
    rentalRate: "NIGHTLY" | "WEEKLY" | "MONTHLY" // NIGHTLY | WEEKLY | MONTHLY
    roomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    utilitiesIncluded: Array<"WIFI" | "LIGHT">
    images: Array<ListingImage>
    virtualTourUrl: string
    price: number
    priceType: "PER_MONTH" | "EVERY_6_MONTHS" | "PER_YEAR" // PER_MONTH | EVERY_6_MONTHS | PER_YEAR
    securityDeposit: number
    agencyFee: number
    legalFee: number
    cautionFee: number
    inspectionFeeType: "percentage" | "amount" // percentage | amount
    inspectionFeeValue: number
    publishedAt: string(date-time)
    likesCount: number
    searchVector?: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  listingId: string
  url: string
  sortOrder: number
  isCover: boolean
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

### LoginDto

```typescript
{
  email: string(email)
  password: string
}
```

### Message

```typescript
{
  conversationId: string
  conversation: {
    type: "DIRECT" | "LISTING" // DIRECT | LISTING
    listingId: string // For LISTING conversations, links to the listing.
    participants: Array<ConversationParticipant>
    messages: Array<Message>
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  senderId: string
  sender: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  type: "TEXT" | "SYSTEM" // TEXT | SYSTEM
  content: string
  attachments: Array<{
    messageId: string
    message: Message
    url: string
    mimeType: string
    filename: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }>
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

### MessageAttachment

```typescript
{
  messageId: string
  message: {
    conversationId: string
    conversation: Conversation
    senderId: string
    sender: User
    type: "TEXT" | "SYSTEM" // TEXT | SYSTEM
    content: string
    attachments: Array<MessageAttachment>
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  url: string
  mimeType: string
  filename: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

### MessageAttachmentItemDto

```typescript
{
  url: string(uri)
  mimeType: string
  filename?: string
}
```

### Object

```typescript
{

}
```

### PersonalInfoDto

```typescript
{
  bvn: string
  firstName: string
  lastName: string
  dateOfBirth: string
  address: string
  postCode: string
  city: string
}
```

### PropertyTransaction

```typescript
{
  referenceNumber: string
  type: "INSPECTION" | "SALES" | "RENTAL" // INSPECTION | SALES | RENTAL
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DECLINED" | "CANCELLED" // PENDING | IN_PROGRESS | COMPLETED | DECLINED | CANCELLED
  step: number
  listingId: string
  listing: {
    user: User
    userId: string
    propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL" // RESIDENTIAL | COMMERCIAL | LAND | SHORT_LET | PG_HOSTEL
    listingType: "FOR_SALE" | "FOR_RENT" // FOR_SALE | FOR_RENT
    propertyStatus: "UNDER_CONSTRUCTION" | "READY" // UNDER_CONSTRUCTION | READY
    status: "DRAFT" | "ACTIVE" | "UNDER_OFFER" | "SOLD" | "RENTED" | "EXPIRED" // DRAFT | ACTIVE | UNDER_OFFER | SOLD | RENTED | EXPIRED
    title: string
    description: string
    state: string
    city: string
    fullAddress: string
    landmarks: Array<string>
    amenities: Array<string>
    bedrooms: number
    bathrooms: number
    sizeSqm: number
    unitsFloors: number
    parkingCapacity: number
    floorAreaSqm: number
    documentTypes: Array<"DEED_OF_TRANSFER" | "C_OF_O" | "SURVEY_PLAN" | "PURCHASE_RECEIPT" | "POWER_OF_ATTORNEY" | "DEED_OF_CONVEYANCE" | "DEED_OF_LEASE">
    zoningType: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "INSTITUTIONAL" | "RECREATIONAL" // RESIDENTIAL | COMMERCIAL | INDUSTRIAL | AGRICULTURAL | INSTITUTIONAL | RECREATIONAL
    landSizeSqm: number
    bedroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    bathroomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" | "PRIVATE" // SINGLE | SHARED | SELF_CONTAINED | PRIVATE
    rentalRate: "NIGHTLY" | "WEEKLY" | "MONTHLY" // NIGHTLY | WEEKLY | MONTHLY
    roomType: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
    utilitiesIncluded: Array<"WIFI" | "LIGHT">
    images: Array<ListingImage>
    virtualTourUrl: string
    price: number
    priceType: "PER_MONTH" | "EVERY_6_MONTHS" | "PER_YEAR" // PER_MONTH | EVERY_6_MONTHS | PER_YEAR
    securityDeposit: number
    agencyFee: number
    legalFee: number
    cautionFee: number
    inspectionFeeType: "percentage" | "amount" // percentage | amount
    inspectionFeeValue: number
    publishedAt: string(date-time)
    likesCount: number
    searchVector?: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  buyerId: string
  buyer: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  sellerId: string
  seller: {
    username: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phoneNumber: string
    password: string
    googleId: string
    avatarUrl: string
    authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
    roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isActive: boolean
    verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
    transactionPin: string
    refreshToken: string
    tosAcceptedAt: string(date-time)
    paystackCustomerId: string
    virtualAccountNumber: string
    virtualAccountBank: string
    onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  fundedAmountKobo: string
  propertyPriceKobo: string
  paymentRef: string
  acceptDeadlineAt: string(date-time)
  scheduledAt: string(date-time)
  scheduledEndAt: string(date-time)
  acceptedAt: string(date-time)
  declinedAt: string(date-time)
  handoverConfirmedAt: string(date-time)
  completedAt: string(date-time)
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

### RefreshTokenDto

```typescript
{
  refreshToken: string
}
```

### RegisterDto

```typescript
{
  username?: string
  firstName: string
  lastName: string
  email: string(email)
  phoneNumber: string
  password: string
  roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
}
```

### ReportListingDto

```typescript
{
  reason: "fraudulent" | "incorrect_info" | "duplicate" | "inappropriate" | "already_sold" | "other" // fraudulent | incorrect_info | duplicate | inappropriate | already_sold | other
  description?: string
}
```

### ResendVerificationDto

```typescript
{
  email: string(email)
}
```

### SendMessageDto

```typescript
{
  content?: string
  attachments?: Array<{
    url: string(uri)
    mimeType: string
    filename?: string
  }>
}
```

### SendOtpDto

```typescript
{
  phoneNumber: string
}
```

### SetAvailabilityDto

```typescript
{
  slots: Array<{
    dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7 // 1 | 2 | 3 | 4 | 5 | 6 | 7
    startTime: string
    endTime: string
  }>
}
```

### SetupInspectionFeeDto

```typescript
{
  feeType: "percentage" | "amount" // percentage | amount
  value: number
}
```

### SwitchAccountDto

```typescript
{
  linkedUserId: string(uuid)
}
```

### UpdateAgentProfileDto

```typescript
{
  address?: string
  postCode?: string
  city?: string
  idDocumentUrl?: string
}
```

### UpdateCalendarEventDto

```typescript
{
  title?: string
  startAt?: string
  endAt?: string
  listingId?: string(uuid)
  eventType?: "INSPECTION" | "TOUR" | "MEETING" | "OTHER" // INSPECTION | TOUR | MEETING | OTHER
  description?: string
}
```

### UpdateListingDto

```typescript
{
  amenities?: Array<"KITCHEN_FITTED" | "KITCHEN_OPEN" | "KITCHEN_CLOSED" | "PARKING_GARAGE" | "WARDROBES_WALK_IN_CLOSET" | "AIR_CONDITIONING" | "WATER_HEATER" | "LAUNDRY_AREA" | "SECURITY_DOORS" | "POWER_BACKUP_GENERATOR" | "WATER_SUPPLY_BOREHOLE" | "INTERNET_READY_FIBER_OPTICS" | "FURNISHED" | "SEMI_FURNISHED" | "UNFURNISHED" | "SERVANT_QUARTERS_BQ" | "STUDY_HOME_OFFICE" | "OFFICE_ROOMS_WORKSPACES" | "CONFERENCE_ROOM" | "RECEPTION_AREA" | "STORAGE_WAREHOUSE_SPACE" | "PARKING_SPACE_STAFF_VISITORS" | "SECURITY_ACCESS_CCTV" | "ELEVATOR_ESCALATOR" | "POWER_BACKUP_INVERTER_GENERATOR" | "INTERNET_NETWORKING_INFRASTRUCTURE" | "FIRE_SAFETY" | "AIR_CONDITIONING_VENTILATION" | "LOADING_BAY_DELIVERY_ACCESS" | "RESTROOMS" | "ROAD_ACCESS" | "FENCED_GATED" | "DRAINAGE_SYSTEM" | "ELECTRICITY_SUPPLY_ACCESS" | "WATER_SUPPLY_ACCESS" | "DRY_SOIL" | "SWAMPY_SOIL" | "ROCKY_SOIL" | "SLOPED_TOPOGRAPHY" | "FLAT_TOPOGRAPHY" | "SECURE_NEIGHBORHOOD" | "FURNISHED_LIVING_ROOM" | "EQUIPPED_KITCHEN" | "WIFI" | "SMART_TV_CABLE_TV" | "HOUSEKEEPING_CLEANING_SERVICE" | "TOWELS_LINENS" | "AIR_CONDITIONING" | "SWIMMING_POOL" | "GYM_FITNESS_CENTER" | "PARKING_SPACE" | "SECURITY_24_7_CCTV" | "ELEVATOR_ACCESS" | "BALCONY_WITH_VIEW" | "SHARED_ROOMS_PRIVATE_ROOMS" | "SHARED_BATHROOMS_ENSUITE_OPTIONS" | "STUDY_READING_AREA" | "SHARED_KITCHEN" | "COMMON_LOUNGE_TV_ROOM" | "LAUNDRY_FACILITIES" | "WIFI_ACCESS" | "POWER_BACKUP" | "SECURITY_GATE_CCTV" | "PARKING_FOR_RESIDENTS" | "MESS_CAFETERIA" | "ELEVATOR_ACCESS" | "BALCONY_WITH_VIEW"> // KITCHEN_FITTED | KITCHEN_OPEN | KITCHEN_CLOSED | PARKING_GARAGE | WARDROBES_WALK_IN_CLOSET | AIR_CONDITIONING | WATER_HEATER | LAUNDRY_AREA | SECURITY_DOORS | POWER_BACKUP_GENERATOR | WATER_SUPPLY_BOREHOLE | INTERNET_READY_FIBER_OPTICS | FURNISHED | SEMI_FURNISHED | UNFURNISHED | SERVANT_QUARTERS_BQ | STUDY_HOME_OFFICE | OFFICE_ROOMS_WORKSPACES | CONFERENCE_ROOM | RECEPTION_AREA | STORAGE_WAREHOUSE_SPACE | PARKING_SPACE_STAFF_VISITORS | SECURITY_ACCESS_CCTV | ELEVATOR_ESCALATOR | POWER_BACKUP_INVERTER_GENERATOR | INTERNET_NETWORKING_INFRASTRUCTURE | FIRE_SAFETY | AIR_CONDITIONING_VENTILATION | LOADING_BAY_DELIVERY_ACCESS | RESTROOMS | ROAD_ACCESS | FENCED_GATED | DRAINAGE_SYSTEM | ELECTRICITY_SUPPLY_ACCESS | WATER_SUPPLY_ACCESS | DRY_SOIL | SWAMPY_SOIL | ROCKY_SOIL | SLOPED_TOPOGRAPHY | FLAT_TOPOGRAPHY | SECURE_NEIGHBORHOOD | FURNISHED_LIVING_ROOM | EQUIPPED_KITCHEN | WIFI | SMART_TV_CABLE_TV | HOUSEKEEPING_CLEANING_SERVICE | TOWELS_LINENS | AIR_CONDITIONING | SWIMMING_POOL | GYM_FITNESS_CENTER | PARKING_SPACE | SECURITY_24_7_CCTV | ELEVATOR_ACCESS | BALCONY_WITH_VIEW | SHARED_ROOMS_PRIVATE_ROOMS | SHARED_BATHROOMS_ENSUITE_OPTIONS | STUDY_READING_AREA | SHARED_KITCHEN | COMMON_LOUNGE_TV_ROOM | LAUNDRY_FACILITIES | WIFI_ACCESS | POWER_BACKUP | SECURITY_GATE_CCTV | PARKING_FOR_RESIDENTS | MESS_CAFETERIA | ELEVATOR_ACCESS | BALCONY_WITH_VIEW
  status?: "DRAFT" | "ACTIVE" | "UNDER_OFFER" | "SOLD" | "RENTED" | "EXPIRED" // DRAFT | ACTIVE | UNDER_OFFER | SOLD | RENTED | EXPIRED
  propertyType?: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL" // RESIDENTIAL | COMMERCIAL | LAND | SHORT_LET | PG_HOSTEL
  listingType?: "FOR_SALE" | "FOR_RENT" // FOR_SALE | FOR_RENT
  propertyStatus?: "UNDER_CONSTRUCTION" | "READY" // UNDER_CONSTRUCTION | READY
  title?: string
  description?: string
  state?: string
  city?: string
  fullAddress?: string
  landmarks?: Array<string>
  bedrooms?: number
  bathrooms?: number
  sizeSqm?: number
  unitsFloors?: number
  parkingCapacity?: number
  floorAreaSqm?: number
  documentTypes?: Array<"DEED_OF_TRANSFER" | "C_OF_O" | "SURVEY_PLAN" | "PURCHASE_RECEIPT" | "POWER_OF_ATTORNEY" | "DEED_OF_CONVEYANCE" | "DEED_OF_LEASE">
  zoningType?: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "INSTITUTIONAL" | "RECREATIONAL" // RESIDENTIAL | COMMERCIAL | INDUSTRIAL | AGRICULTURAL | INSTITUTIONAL | RECREATIONAL
  landSizeSqm?: number
  bedroomType?: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
  bathroomType?: "SINGLE" | "SHARED" | "SELF_CONTAINED" | "PRIVATE" // SINGLE | SHARED | SELF_CONTAINED | PRIVATE
  rentalRate?: "NIGHTLY" | "WEEKLY" | "MONTHLY" // NIGHTLY | WEEKLY | MONTHLY
  roomType?: "SINGLE" | "SHARED" | "SELF_CONTAINED" // SINGLE | SHARED | SELF_CONTAINED
  utilitiesIncluded?: Array<"WIFI" | "LIGHT">
  virtualTourUrl?: string
  price?: number
  priceType?: "PER_MONTH" | "EVERY_6_MONTHS" | "PER_YEAR" // PER_MONTH | EVERY_6_MONTHS | PER_YEAR
  securityDeposit?: number
  agencyFee?: number
  legalFee?: number
  cautionFee?: number
}
```

### UpdateProfileDto

```typescript
{
  firstName?: string
  lastName?: string
  displayName?: string
  phoneNumber?: string
  linkedinUrl?: string(uri)
  facebookUrl?: string(uri)
  instagramUrl?: string(uri)
  twitterUrl?: string(uri)
}
```

### User

```typescript
{
  username: string
  firstName: string
  lastName: string
  displayName: string
  email: string
  phoneNumber: string
  password: string
  googleId: string
  avatarUrl: string
  authProvider: "LOCAL" | "GOOGLE" // LOCAL | GOOGLE
  roles: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
  isEmailVerified: boolean
  isPhoneVerified: boolean
  isActive: boolean
  verificationStatus: "PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED" // PENDING | VERIFIED | SUSPENDED | REVOKED
  transactionPin: string
  refreshToken: string
  tosAcceptedAt: string(date-time)
  paystackCustomerId: string
  virtualAccountNumber: string
  virtualAccountBank: string
  onboardingStep: "PERSONAL_INFO" | "PHONE_VERIFICATION" | "ID_VERIFICATION" | "LIVENESS" | "PAYMENT" | "COMPLETE" // PERSONAL_INFO | PHONE_VERIFICATION | ID_VERIFICATION | LIVENESS | PAYMENT | COMPLETE
  linkedinUrl: string // Profile social links (display only; no social auth)
  facebookUrl: string
  instagramUrl: string
  twitterUrl: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

### VerifyBvnDto

```typescript
{
  bvn: string
  firstName: string
  lastName: string
  dateOfBirth: string
}
```

### VerifyEmailDto

```typescript
{
  email: string(email)
  code: string
}
```

### VerifyIdDto

```typescript
{
  idType: "INTERNATIONAL_PASSPORT" | "DRIVERS_LICENSE" | "VOTERS_CARD" | "NIN" | "BVN" // INTERNATIONAL_PASSPORT | DRIVERS_LICENSE | VOTERS_CARD | NIN | BVN
  idNumber: string
  firstName: string
  lastName: string
  dateOfBirth?: string
  gender?: string
}
```

### VerifyOtpDto

```typescript
{
  phoneNumber: string
  idToken: string
}
```

