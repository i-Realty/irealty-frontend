# IRealty Backend API Documentation

> IRealty Backend API Documentation 

**Base URL:** `https://api.i-realty.app`  
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

- [Auth](#auth)
- [Marketplace](#marketplace)
- [Messages](#messages)
- [Wallet](#wallet)
- [Transactions](#transactions)
- [Paystack](#paystack)
- [Documents](#documents)
- [Calendar](#calendar)
- [PaystackWebhook](#paystackwebhook)
- [QoreIdWebhook](#qoreidwebhook)
- [Kyc](#kyc)
- [KycEvents](#kycevents)
- [AgentProfile](#agentprofile)
- [PropertyTransaction](#propertytransaction)
- [DirectDebit](#directdebit)
- [Verification](#verification)
- [Admin](#admin)
- [DashboardAdmin](#dashboardadmin)
- [PropertiesAdmin](#propertiesadmin)
- [TransactionsAdmin](#transactionsadmin)
- [FinanceAdmin](#financeadmin)
- [MessagesAdmin](#messagesadmin)
- [SettingsAdmin](#settingsadmin)
- [TicketsAdmin](#ticketsadmin)
- [TicketsUser](#ticketsuser)
- [Health](#health)

---

## Auth

### `POST /api/v1/auth/firebase`

**AuthController_firebaseAuth_v1**

**Request Body:**
```typescript
{
  idToken: string
}
```

**Response:**
`200`

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

**Response:**
`201`

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

**Response:**
`200`

---

### `POST /api/v1/auth/resend-verification`

**AuthController_resendVerification_v1**

**Request Body:**
```typescript
{
  email: string(email)
}
```

**Response:**
`200`

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

**Response:**
`200`

---

### `POST /api/v1/auth/refresh`

**AuthController_refreshToken_v1**

**Request Body:**
```typescript
{
  refreshToken: string
}
```

**Response:**
`200`

---

### `POST /api/v1/auth/forgot-password`

**AuthController_forgotPassword_v1**

**Request Body:**
```typescript
{
  email: string(email)
}
```

**Response:**
`200`

---

### `POST /api/v1/auth/verify-reset-otp`

**AuthController_verifyResetOtp_v1**

**Request Body:**
```typescript
{
  email: string(email)
  code: string
}
```

**Response:**
`200`

---

### `POST /api/v1/auth/reset-password`

**AuthController_resetPassword_v1**

**Request Body:**
```typescript
{
  email: string(email)
  resetToken: string
  newPassword: string
}
```

**Response:**
`200`

---

### `POST /api/v1/auth/logout`

**AuthController_logout_v1**

🔒 **Requires Bearer token**

**Response:**
`200`

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
  bio: string
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
  bio: string
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

**Response:**
`200`

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

**Response:**
`201`

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

**Response:**
`201`

---

## Marketplace

### `GET /api/v1/marketplace/search`

**MarketplaceController_search_v1**

**Query Parameters:**
- `search' *(optional)*: `string`
- `propertyType' *(optional)*: `"RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL"`
- `listingType' *(optional)*: `"FOR_SALE" | "FOR_RENT"`
- `propertyStatus' *(optional)*: `"UNDER_CONSTRUCTION" | "READY"`
- `status' *(optional)*: `"DRAFT" | "ACTIVE" | "UNDER_OFFER" | "SOLD" | "RENTED" | "EXPIRED"`
- `state' *(optional)*: `string`
- `city' *(optional)*: `string`
- `minPrice' *(optional)*: `number`
- `maxPrice' *(optional)*: `number`
- `minBedrooms' *(optional)*: `number`
- `maxBedrooms' *(optional)*: `number`
- `minBathrooms' *(optional)*: `number`
- `page' *(optional)*: `number`
- `limit' *(optional)*: `number`
- `minLat' *(optional)*: `number`
- `maxLat' *(optional)*: `number`
- `minLng' *(optional)*: `number`
- `maxLng' *(optional)*: `number`
- `centerLat' *(optional)*: `number`
- `centerLng' *(optional)*: `number`
- `radiusKm' *(optional)*: `number`
- `sortBy' *(optional)*: `string`
- `sortOrder' *(optional)*: `Record<string, unknown>`

**Response:**
`200`

---

### `GET /api/v1/marketplace/{id}`

**MarketplaceController_findOnePublic_v1**

**Path Parameters:**
- `id': `string`

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
    bio: string
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
    listing: Listing (circular)
    listingId: string
    url: string
    sortOrder: number
    isCover: boolean
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }>
  latitude: number
  longitude: number
  placeId: string
  formattedAddress: string
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
  adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
  adminReviewReason: string
  adminReviewedAt: string(date-time)
  adminReviewedBy: string
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
- `propertyType': `string`

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
  latitude?: number
  longitude?: number
  placeId?: string
  formattedAddress?: string
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
    bio: string
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
    listing: Listing (circular)
    listingId: string
    url: string
    sortOrder: number
    isCover: boolean
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }>
  latitude: number
  longitude: number
  placeId: string
  formattedAddress: string
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
  adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
  adminReviewReason: string
  adminReviewedAt: string(date-time)
  adminReviewedBy: string
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
    bio: string
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
    listing: Listing (circular)
    listingId: string
    url: string
    sortOrder: number
    isCover: boolean
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }>
  latitude: number
  longitude: number
  placeId: string
  formattedAddress: string
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
  adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
  adminReviewReason: string
  adminReviewedAt: string(date-time)
  adminReviewedBy: string
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
- `id': `string`

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
    bio: string
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
    listing: Listing (circular)
    listingId: string
    url: string
    sortOrder: number
    isCover: boolean
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }>
  latitude: number
  longitude: number
  placeId: string
  formattedAddress: string
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
  adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
  adminReviewReason: string
  adminReviewedAt: string(date-time)
  adminReviewedBy: string
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
- `id': `string`

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
  latitude?: number
  longitude?: number
  placeId?: string
  formattedAddress?: string
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
    bio: string
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
    listing: Listing (circular)
    listingId: string
    url: string
    sortOrder: number
    isCover: boolean
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }>
  latitude: number
  longitude: number
  placeId: string
  formattedAddress: string
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
  adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
  adminReviewReason: string
  adminReviewedAt: string(date-time)
  adminReviewedBy: string
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
- `id': `string`

**Response:**
`204`

---

### `PATCH /api/v1/listings/{id}/publish`

**MarketplaceController_publish_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id': `string`

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
    bio: string
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
    listing: Listing (circular)
    listingId: string
    url: string
    sortOrder: number
    isCover: boolean
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }>
  latitude: number
  longitude: number
  placeId: string
  formattedAddress: string
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
  adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
  adminReviewReason: string
  adminReviewedAt: string(date-time)
  adminReviewedBy: string
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
- `id': `string`

**Request Body:**
```typescript
{
  files: Array<string(binary)>
  metadata?: string // JSON array of { sortOrder: number, isCover: boolean } per fi
}
```

**Response:**
```typescript
Array<{
  listing: {
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
      bio: string
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
    images: Array<ListingImage (circular)>
    latitude: number
    longitude: number
    placeId: string
    formattedAddress: string
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
    adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
    adminReviewReason: string
    adminReviewedAt: string(date-time)
    adminReviewedBy: string
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
- `imageId': `string`

**Response:**
`204`

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
    bio: string
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
    listing: Listing (circular)
    listingId: string
    url: string
    sortOrder: number
    isCover: boolean
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }>
  latitude: number
  longitude: number
  placeId: string
  formattedAddress: string
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
  adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
  adminReviewReason: string
  adminReviewedAt: string(date-time)
  adminReviewedBy: string
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
- `id': `string`

**Response:**
`200`

---

### `POST /api/v1/listings/{id}/like`

**MarketplaceController_toggleLike_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id': `string`

**Response:**
`200`

---

### `GET /api/v1/listings/{id}/inspection-fee`

**MarketplaceController_getInspectionFee_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id': `string`

**Response:**
`200`

---

### `PATCH /api/v1/listings/{id}/inspection-fee`

**MarketplaceController_setupInspectionFee_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id': `string`

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
    bio: string
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
    listing: Listing (circular)
    listingId: string
    url: string
    sortOrder: number
    isCover: boolean
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }>
  latitude: number
  longitude: number
  placeId: string
  formattedAddress: string
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
  adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
  adminReviewReason: string
  adminReviewedAt: string(date-time)
  adminReviewedBy: string
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
- `id': `string`

**Request Body:**
```typescript
{
  reason: "fraudulent" | "incorrect_info" | "duplicate" | "inappropriate" | "already_sold" | "other" // fraudulent | incorrect_info | duplicate | inappropriate | already_sold | other
  description?: string
}
```

**Response:**
`201`

---

## Messages

### `POST /api/v1/messages/conversations`

**MessagesController_createConversation_v1**

🔒 **Requires Bearer token**

**Request Body:**
```typescript
{
  type: "DIRECT" | "LISTING" // DIRECT | LISTING
  listingId?: string(uuid)
  participantUserId?: string(uuid) // For DIRECT: other user id. For LISTING: ignored (use listing
}
```

**Response:**
```typescript
{
  type: "DIRECT" | "LISTING" // DIRECT | LISTING
  listingId: string // For LISTING conversations, links to the listing.
  participants: Array<{
    conversationId: string
    conversation: Conversation (circular)
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
      bio: string
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
  }>
  messages: Array<{
    conversationId: string
    conversation: Conversation (circular)
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
      bio: string
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
      message: Message (circular)
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
  }>
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `GET /api/v1/messages/conversations`

**MessagesController_listConversations_v1**

🔒 **Requires Bearer token**

**Response:**
```typescript
Array<Record<string, unknown>>
```

---

### `GET /api/v1/messages/conversations/{id}`

**MessagesController_getConversation_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id': `string`

**Response:**
```typescript
{
  type: "DIRECT" | "LISTING" // DIRECT | LISTING
  listingId: string // For LISTING conversations, links to the listing.
  participants: Array<{
    conversationId: string
    conversation: Conversation (circular)
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
      bio: string
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
  }>
  messages: Array<{
    conversationId: string
    conversation: Conversation (circular)
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
      bio: string
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
      message: Message (circular)
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
- `id': `string`

**Query Parameters:**
- `limit': `number`
- `before': `string`

**Response:**
```typescript
Array<Record<string, unknown>>
```

---

### `POST /api/v1/messages/conversations/{id}/messages`

**MessagesController_sendMessage_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id': `string`

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
    participants: Array<{
      conversationId: string
      conversation: Conversation (circular)
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
        bio: string
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
    }>
    messages: Array<Message (circular)>
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
    bio: string
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
    message: Message (circular)
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
- `id': `string`

**Response:**
`204`

---

### `POST /api/v1/messages/pusher/auth`

**MessagesController_pusherAuth_v1**

Pusher private channel auth. Client sends channel_name and socket_id (e.g. from Pusher JS).
We verify JWT (via @Auth()) and that the user is a participant of the conversation for private-conversation-* channels.

🔒 **Requires Bearer token**

**Response:**
`200`

---

## Wallet

### `GET /api/v1/wallet/balance`

**WalletController_getBalance_v1**

Returns the current user's wallet balance (withdrawable) and escrow balance (non-withdrawable).
Amounts are in kobo (integer). Divide by 100 for Naira.

🔒 **Requires Bearer token**

**Response:**
`200`

---

### `GET /api/v1/wallet/virtual-account`

**WalletController_getVirtualAccount_v1**

Returns the current user's dedicated virtual account (for receiving Naira).
If the user does not have one yet (e.g. legacy account), creation is attempted.

🔒 **Requires Bearer token**

**Response:**
```typescript
Record<string, unknown>
```

---

## Transactions

### `GET /api/v1/transactions`

**TransactionsController_list_v1**

Returns the current user's transaction records with optional type filter and pagination.

🔒 **Requires Bearer token**

**Query Parameters:**
- `limit': `number`
- `page': `number`
- `type': `string`

**Response:**
`200`

---

## Paystack

### `GET /api/v1/paystack/banks`

**PaystackController_listBanks_v1**

🔒 **Requires Bearer token**

**Query Parameters:**
- `country' *(optional)*: `"nigeria" | "ghana" | "south africa" | "kenya"`
- `per_page' *(optional)*: `number`
- `next' *(optional)*: `string`

**Response:**
```typescript
Record<string, unknown>
```

---

### `GET /api/v1/paystack/banks/resolve`

**PaystackController_resolveBankAccount_v1**

🔒 **Requires Bearer token**

**Query Parameters:**
- `account_number': `string`
- `bank_code': `string`

**Response:**
```typescript
Record<string, unknown>
```

---

### `POST /api/v1/paystack/charge/card`

**PaystackController_initiateCardCharge_v1**

🔒 **Requires Bearer token**

**Response:**
`201`

---

### `POST /api/v1/paystack/charge/bank`

**PaystackController_chargeBank_v1**

🔒 **Requires Bearer token**

**Response:**
```typescript
Record<string, unknown>
```

---

### `POST /api/v1/paystack/transfer/recipient`

**PaystackController_createTransferRecipient_v1**

🔒 **Requires Bearer token**

**Response:**
```typescript
Record<string, unknown>
```

---

### `POST /api/v1/paystack/withdraw`

**PaystackController_initiateWithdrawal_v1**

🔒 **Requires Bearer token**

**Response:**
```typescript
Record<string, unknown>
```

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
    bio: string
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
      bio: string
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
      listing: {
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
          bio: string
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
        images: Array<ListingImage (circular)>
        latitude: number
        longitude: number
        placeId: string
        formattedAddress: string
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
        adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
        adminReviewReason: string
        adminReviewedAt: string(date-time)
        adminReviewedBy: string
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
    latitude: number
    longitude: number
    placeId: string
    formattedAddress: string
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
    adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
    adminReviewReason: string
    adminReviewedAt: string(date-time)
    adminReviewedBy: string
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
  contentHash: string // SHA-256 of file content; used to dedupe uploads (reuse exist
  conversationId: string // For CUSTOM documents: conversation this was sent from
  messageId: string // For CUSTOM documents: source message attachment
  metadata: Record<string, unknown> // Template form data (parties, financial terms, lease duration
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

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
  contentHash?: string // Precomputed SHA-256 (hex). If omitted, server will download 
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
    bio: string
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
      bio: string
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
      listing: {
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
          bio: string
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
        images: Array<ListingImage (circular)>
        latitude: number
        longitude: number
        placeId: string
        formattedAddress: string
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
        adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
        adminReviewReason: string
        adminReviewedAt: string(date-time)
        adminReviewedBy: string
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
    latitude: number
    longitude: number
    placeId: string
    formattedAddress: string
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
    adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
    adminReviewReason: string
    adminReviewedAt: string(date-time)
    adminReviewedBy: string
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
  contentHash: string // SHA-256 of file content; used to dedupe uploads (reuse exist
  conversationId: string // For CUSTOM documents: conversation this was sent from
  messageId: string // For CUSTOM documents: source message attachment
  metadata: Record<string, unknown> // Template form data (parties, financial terms, lease duration
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
- `documentType' *(optional)*: `"STANDARD_RENTAL_AGREEMENT" | "PROPERTY_SALE_AGREEMENT" | "BROKER_COMMISSION_AGREEMENT" | "PROPERTY_MANAGEMENT_AGREEMENT" | "CUSTOM"`
- `listingId' *(optional)*: `string(uuid)`
- `search' *(optional)*: `string`
- `page' *(optional)*: `number`
- `limit' *(optional)*: `number`

**Response:**
`200`

---

### `GET /api/v1/documents/{id}`

**DocumentsController_findOne_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id': `string`

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
    bio: string
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
      bio: string
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
      listing: {
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
          bio: string
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
        images: Array<ListingImage (circular)>
        latitude: number
        longitude: number
        placeId: string
        formattedAddress: string
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
        adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
        adminReviewReason: string
        adminReviewedAt: string(date-time)
        adminReviewedBy: string
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
    latitude: number
    longitude: number
    placeId: string
    formattedAddress: string
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
    adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
    adminReviewReason: string
    adminReviewedAt: string(date-time)
    adminReviewedBy: string
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
  contentHash: string // SHA-256 of file content; used to dedupe uploads (reuse exist
  conversationId: string // For CUSTOM documents: conversation this was sent from
  messageId: string // For CUSTOM documents: source message attachment
  metadata: Record<string, unknown> // Template form data (parties, financial terms, lease duration
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
- `id': `string`

**Response:**
`204`

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
    bio: string
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
    bio: string
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
- `start' *(optional)*: `string`
- `end' *(optional)*: `string`
- `month' *(optional)*: `number`
- `year' *(optional)*: `number`

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
    bio: string
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
      bio: string
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
      listing: {
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
          bio: string
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
        images: Array<ListingImage (circular)>
        latitude: number
        longitude: number
        placeId: string
        formattedAddress: string
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
        adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
        adminReviewReason: string
        adminReviewedAt: string(date-time)
        adminReviewedBy: string
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
    latitude: number
    longitude: number
    placeId: string
    formattedAddress: string
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
    adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
    adminReviewReason: string
    adminReviewedAt: string(date-time)
    adminReviewedBy: string
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
    bio: string
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
      bio: string
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
      listing: {
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
          bio: string
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
        images: Array<ListingImage (circular)>
        latitude: number
        longitude: number
        placeId: string
        formattedAddress: string
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
        adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
        adminReviewReason: string
        adminReviewedAt: string(date-time)
        adminReviewedBy: string
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
    latitude: number
    longitude: number
    placeId: string
    formattedAddress: string
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
    adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
    adminReviewReason: string
    adminReviewedAt: string(date-time)
    adminReviewedBy: string
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
- `id': `string`

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
    bio: string
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
      bio: string
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
      listing: {
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
          bio: string
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
        images: Array<ListingImage (circular)>
        latitude: number
        longitude: number
        placeId: string
        formattedAddress: string
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
        adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
        adminReviewReason: string
        adminReviewedAt: string(date-time)
        adminReviewedBy: string
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
    latitude: number
    longitude: number
    placeId: string
    formattedAddress: string
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
    adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
    adminReviewReason: string
    adminReviewedAt: string(date-time)
    adminReviewedBy: string
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
- `id': `string`

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
    bio: string
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
      bio: string
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
      listing: {
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
          bio: string
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
        images: Array<ListingImage (circular)>
        latitude: number
        longitude: number
        placeId: string
        formattedAddress: string
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
        adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
        adminReviewReason: string
        adminReviewedAt: string(date-time)
        adminReviewedBy: string
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
    latitude: number
    longitude: number
    placeId: string
    formattedAddress: string
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
    adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
    adminReviewReason: string
    adminReviewedAt: string(date-time)
    adminReviewedBy: string
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
- `id': `string`

**Response:**
`204`

---

## PaystackWebhook

### `POST /api/v1/webhooks/paystack`

**PaystackWebhookController_handleWebhook_v1**

**Response:**
`200`

---

## QoreIdWebhook

### `POST /api/v1/webhooks/qoreid`

**QoreIdWebhookController_handleCallback_v1**

**Response:**
`200`

---

## Kyc

### `GET /api/v1/kyc/status`

**KycController_getStatus_v1**

🔒 **Requires Bearer token**

**Response:**
`200`

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

**Response:**
`201`

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

**Response:**
`201`

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

**Response:**
`201`

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

**Response:**
`201`

---

### `POST /api/v1/kyc/liveness/register-session`

**KycController_registerLivenessSession_v1**

🔒 **Requires Bearer token**

**Response:**
`201`

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

**Response:**
`201`

---

## KycEvents

### `GET /api/v1/kyc/phone/events`

**KycEventsController_phoneVerificationEvents_v1**

**Response:**
```typescript
Record<string, unknown>
```

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
    bio: string
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
    bio: string
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
- `id': `string`

**Response:**
`200`

---

## PropertyTransaction

### `GET /api/v1/property-transactions`

**PropertyTransactionController_findAll_v1**

🔒 **Requires Bearer token**

**Query Parameters:**
- `type' *(optional)*: `"INSPECTION" | "SALES" | "RENTAL"`
- `status' *(optional)*: `"PENDING" | "IN_PROGRESS" | "COMPLETED" | "DECLINED" | "CANCELLED"`

**Response:**
```typescript
Array<{
  referenceNumber: string
  type: "INSPECTION" | "SALES" | "RENTAL" // INSPECTION | SALES | RENTAL
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DECLINED" | "CANCELLED" // PENDING | IN_PROGRESS | COMPLETED | DECLINED | CANCELLED
  step: number
  listingId: string
  listing: {
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
      bio: string
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
      listing: Listing (circular)
      listingId: string
      url: string
      sortOrder: number
      isCover: boolean
      id: string
      createdAt: string(date-time)
      updatedAt: string(date-time)
      deletedAt: string(date-time)
    }>
    latitude: number
    longitude: number
    placeId: string
    formattedAddress: string
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
    adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
    adminReviewReason: string
    adminReviewedAt: string(date-time)
    adminReviewedBy: string
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
    bio: string
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
    bio: string
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
- `id': `string`

**Response:**
```typescript
Record<string, unknown>
```

---

### `POST /api/v1/property-transactions/{id}/accept`

**PropertyTransactionController_accept_v1**

🔒 **Requires Bearer token**

**Path Parameters:**
- `id': `string`

**Response:**
```typescript
{
  referenceNumber: string
  type: "INSPECTION" | "SALES" | "RENTAL" // INSPECTION | SALES | RENTAL
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DECLINED" | "CANCELLED" // PENDING | IN_PROGRESS | COMPLETED | DECLINED | CANCELLED
  step: number
  listingId: string
  listing: {
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
      bio: string
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
      listing: Listing (circular)
      listingId: string
      url: string
      sortOrder: number
      isCover: boolean
      id: string
      createdAt: string(date-time)
      updatedAt: string(date-time)
      deletedAt: string(date-time)
    }>
    latitude: number
    longitude: number
    placeId: string
    formattedAddress: string
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
    adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
    adminReviewReason: string
    adminReviewedAt: string(date-time)
    adminReviewedBy: string
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
    bio: string
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
    bio: string
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
- `id': `string`

**Response:**
```typescript
{
  referenceNumber: string
  type: "INSPECTION" | "SALES" | "RENTAL" // INSPECTION | SALES | RENTAL
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DECLINED" | "CANCELLED" // PENDING | IN_PROGRESS | COMPLETED | DECLINED | CANCELLED
  step: number
  listingId: string
  listing: {
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
      bio: string
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
      listing: Listing (circular)
      listingId: string
      url: string
      sortOrder: number
      isCover: boolean
      id: string
      createdAt: string(date-time)
      updatedAt: string(date-time)
      deletedAt: string(date-time)
    }>
    latitude: number
    longitude: number
    placeId: string
    formattedAddress: string
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
    adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
    adminReviewReason: string
    adminReviewedAt: string(date-time)
    adminReviewedBy: string
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
    bio: string
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
    bio: string
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
- `id': `string`

**Response:**
```typescript
{
  referenceNumber: string
  type: "INSPECTION" | "SALES" | "RENTAL" // INSPECTION | SALES | RENTAL
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DECLINED" | "CANCELLED" // PENDING | IN_PROGRESS | COMPLETED | DECLINED | CANCELLED
  step: number
  listingId: string
  listing: {
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
      bio: string
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
      listing: Listing (circular)
      listingId: string
      url: string
      sortOrder: number
      isCover: boolean
      id: string
      createdAt: string(date-time)
      updatedAt: string(date-time)
      deletedAt: string(date-time)
    }>
    latitude: number
    longitude: number
    placeId: string
    formattedAddress: string
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
    adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
    adminReviewReason: string
    adminReviewedAt: string(date-time)
    adminReviewedBy: string
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
    bio: string
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
    bio: string
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
- `id': `string`

**Response:**
```typescript
{
  referenceNumber: string
  type: "INSPECTION" | "SALES" | "RENTAL" // INSPECTION | SALES | RENTAL
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DECLINED" | "CANCELLED" // PENDING | IN_PROGRESS | COMPLETED | DECLINED | CANCELLED
  step: number
  listingId: string
  listing: {
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
      bio: string
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
      listing: Listing (circular)
      listingId: string
      url: string
      sortOrder: number
      isCover: boolean
      id: string
      createdAt: string(date-time)
      updatedAt: string(date-time)
      deletedAt: string(date-time)
    }>
    latitude: number
    longitude: number
    placeId: string
    formattedAddress: string
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
    adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
    adminReviewReason: string
    adminReviewedAt: string(date-time)
    adminReviewedBy: string
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
    bio: string
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
    bio: string
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
- `id': `string`

**Response:**
```typescript
{
  referenceNumber: string
  type: "INSPECTION" | "SALES" | "RENTAL" // INSPECTION | SALES | RENTAL
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DECLINED" | "CANCELLED" // PENDING | IN_PROGRESS | COMPLETED | DECLINED | CANCELLED
  step: number
  listingId: string
  listing: {
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
      bio: string
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
      listing: Listing (circular)
      listingId: string
      url: string
      sortOrder: number
      isCover: boolean
      id: string
      createdAt: string(date-time)
      updatedAt: string(date-time)
      deletedAt: string(date-time)
    }>
    latitude: number
    longitude: number
    placeId: string
    formattedAddress: string
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
    adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
    adminReviewReason: string
    adminReviewedAt: string(date-time)
    adminReviewedBy: string
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
    bio: string
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
    bio: string
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

## DirectDebit

### `POST /api/v1/direct-debit/mandates/initialize`

**DirectDebitController_initialize_v1**

**Request Body:**
```typescript
{
  callbackUrl?: string(uri)
  account?: {
    number: string
    bankCode: string
  }
  address?: {
    state: string
    city: string
    street: string
  }
}
```

**Response:**
`201`

---

### `GET /api/v1/direct-debit/mandates/verify/{reference}`

**DirectDebitController_verify_v1**

**Path Parameters:**
- `reference': `string`

**Response:**
```typescript
{
  id: string
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
    bio: string
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  reference: string
  authorizationCode: string
  customerCode: string
  status: "PENDING" | "CREATED" | "ACTIVE" | "DEACTIVATED" | "FAILED" // PENDING | CREATED | ACTIVE | DEACTIVATED | FAILED
  bank: string
  last4: string
  accountName: string
  redirectUrl: string
  activatedAt: string(date-time)
  deactivatedAt: string(date-time)
  createdAt: string(date-time)
  updatedAt: string(date-time)
}
```

---

### `GET /api/v1/direct-debit/mandates`

**DirectDebitController_listMine_v1**

**Response:**
```typescript
Array<{
  id: string
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
    bio: string
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  reference: string
  authorizationCode: string
  customerCode: string
  status: "PENDING" | "CREATED" | "ACTIVE" | "DEACTIVATED" | "FAILED" // PENDING | CREATED | ACTIVE | DEACTIVATED | FAILED
  bank: string
  last4: string
  accountName: string
  redirectUrl: string
  activatedAt: string(date-time)
  deactivatedAt: string(date-time)
  createdAt: string(date-time)
  updatedAt: string(date-time)
}>
```

---

### `POST /api/v1/direct-debit/mandates/{id}/retry-activation`

**DirectDebitController_retry_v1**

**Path Parameters:**
- `id': `string`

**Response:**
`201`

---

### `DELETE /api/v1/direct-debit/mandates/{id}`

**DirectDebitController_deactivate_v1**

**Path Parameters:**
- `id': `string`

**Response:**
```typescript
{
  id: string
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
    bio: string
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  reference: string
  authorizationCode: string
  customerCode: string
  status: "PENDING" | "CREATED" | "ACTIVE" | "DEACTIVATED" | "FAILED" // PENDING | CREATED | ACTIVE | DEACTIVATED | FAILED
  bank: string
  last4: string
  accountName: string
  redirectUrl: string
  activatedAt: string(date-time)
  deactivatedAt: string(date-time)
  createdAt: string(date-time)
  updatedAt: string(date-time)
}
```

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
Record<string, unknown>
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
Record<string, unknown>
```

---

## Admin

### `GET /api/v1/admin/users`

**AdminController_listUsers_v1**

**Query Parameters:**
- `page' *(optional)*: `number`
- `limit' *(optional)*: `number`
- `status' *(optional)*: `"PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED"`
- `role' *(optional)*: `"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN"`
- `search' *(optional)*: `string`

**Response:**
`200`

---

### `GET /api/v1/admin/users/{id}`

**AdminController_getUserDetail_v1**

**Path Parameters:**
- `id': `string`

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
  bio: string
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
- `id': `string`

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
  bio: string
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
- `id': `string`

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
  bio: string
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
- `id': `string`

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
  bio: string
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
- `page' *(optional)*: `number`
- `limit' *(optional)*: `number`
- `status' *(optional)*: `"PENDING" | "VERIFIED" | "SUSPENDED" | "REVOKED"`
- `role' *(optional)*: `"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN"`
- `search' *(optional)*: `string`

**Response:**
`200`

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
  bio: string
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
  bio: string
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
- `id': `string`

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
  bio: string
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
- `id': `string`

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
  bio: string
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
- `id': `string`

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
  bio: string
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
- `page' *(optional)*: `number`
- `limit' *(optional)*: `number`
- `actorId' *(optional)*: `string(uuid)`
- `entityType' *(optional)*: `string`
- `entityId' *(optional)*: `string(uuid)`
- `action' *(optional)*: `string`
- `from' *(optional)*: `string`
- `to' *(optional)*: `string`

**Response:**
`200`

---

## DashboardAdmin

### `GET /api/v1/admin/dashboard/stats`

**DashboardAdminController_stats_v1**

**Query Parameters:**
- `period' *(optional)*: `"week" | "month" | "year"`

**Response:**
`200`

---

### `GET /api/v1/admin/dashboard/recent-transactions`

**DashboardAdminController_recentTransactions_v1**

**Query Parameters:**
- `limit' *(optional)*: `number`

**Response:**
```typescript
Array<{
  referenceNumber: string
  type: "INSPECTION" | "SALES" | "RENTAL" // INSPECTION | SALES | RENTAL
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DECLINED" | "CANCELLED" // PENDING | IN_PROGRESS | COMPLETED | DECLINED | CANCELLED
  step: number
  listingId: string
  listing: {
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
      bio: string
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
      listing: Listing (circular)
      listingId: string
      url: string
      sortOrder: number
      isCover: boolean
      id: string
      createdAt: string(date-time)
      updatedAt: string(date-time)
      deletedAt: string(date-time)
    }>
    latitude: number
    longitude: number
    placeId: string
    formattedAddress: string
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
    adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
    adminReviewReason: string
    adminReviewedAt: string(date-time)
    adminReviewedBy: string
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
    bio: string
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
    bio: string
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

### `GET /api/v1/admin/dashboard/pending-kyc`

**DashboardAdminController_pendingKyc_v1**

**Query Parameters:**
- `limit' *(optional)*: `number`

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
  bio: string
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

## PropertiesAdmin

### `GET /api/v1/admin/properties`

**PropertiesAdminController_list_v1**

**Query Parameters:**
- `page' *(optional)*: `number`
- `limit' *(optional)*: `number`
- `status' *(optional)*: `"PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED"`
- `propertyType' *(optional)*: `"RESIDENTIAL" | "COMMERCIAL" | "LAND" | "SHORT_LET" | "PG_HOSTEL"`
- `search' *(optional)*: `string`

**Response:**
`200`

---

### `GET /api/v1/admin/properties/{id}`

**PropertiesAdminController_get_v1**

**Path Parameters:**
- `id': `string`

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
    bio: string
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
    listing: Listing (circular)
    listingId: string
    url: string
    sortOrder: number
    isCover: boolean
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }>
  latitude: number
  longitude: number
  placeId: string
  formattedAddress: string
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
  adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
  adminReviewReason: string
  adminReviewedAt: string(date-time)
  adminReviewedBy: string
  searchVector?: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `PATCH /api/v1/admin/properties/{id}/approve`

**PropertiesAdminController_approve_v1**

**Path Parameters:**
- `id': `string`

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
    bio: string
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
    listing: Listing (circular)
    listingId: string
    url: string
    sortOrder: number
    isCover: boolean
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }>
  latitude: number
  longitude: number
  placeId: string
  formattedAddress: string
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
  adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
  adminReviewReason: string
  adminReviewedAt: string(date-time)
  adminReviewedBy: string
  searchVector?: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `PATCH /api/v1/admin/properties/{id}/reject`

**PropertiesAdminController_reject_v1**

**Path Parameters:**
- `id': `string`

**Request Body:**
```typescript
{
  reason: string
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
    bio: string
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
    listing: Listing (circular)
    listingId: string
    url: string
    sortOrder: number
    isCover: boolean
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }>
  latitude: number
  longitude: number
  placeId: string
  formattedAddress: string
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
  adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
  adminReviewReason: string
  adminReviewedAt: string(date-time)
  adminReviewedBy: string
  searchVector?: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `PATCH /api/v1/admin/properties/{id}/flag`

**PropertiesAdminController_flag_v1**

**Path Parameters:**
- `id': `string`

**Request Body:**
```typescript
{
  reason: string
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
    bio: string
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
    listing: Listing (circular)
    listingId: string
    url: string
    sortOrder: number
    isCover: boolean
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }>
  latitude: number
  longitude: number
  placeId: string
  formattedAddress: string
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
  adminStatus: "PENDING_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED" // PENDING_REVIEW | VERIFIED | FLAGGED | REJECTED
  adminReviewReason: string
  adminReviewedAt: string(date-time)
  adminReviewedBy: string
  searchVector?: string
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

## TransactionsAdmin

### `GET /api/v1/admin/transactions`

**TransactionsAdminController_list_v1**

**Query Parameters:**
- `page' *(optional)*: `number`
- `limit' *(optional)*: `number`
- `type' *(optional)*: `"INSPECTION" | "SALES" | "RENTAL"`
- `status' *(optional)*: `"PENDING" | "IN_PROGRESS" | "COMPLETED" | "DECLINED" | "CANCELLED"`
- `search' *(optional)*: `string`

**Response:**
`200`

---

### `GET /api/v1/admin/transactions/{id}`

**TransactionsAdminController_get_v1**

**Path Parameters:**
- `id': `string`

**Response:**
`200`

---

## FinanceAdmin

### `GET /api/v1/admin/finance/revenue`

**FinanceAdminController_revenue_v1**

**Query Parameters:**
- `period' *(optional)*: `"week" | "month" | "year"`

**Response:**
`200`

---

### `GET /api/v1/admin/finance/revenue/by-category`

**FinanceAdminController_revenueByCategory_v1**

**Response:**
`200`

---

### `GET /api/v1/admin/finance/escrow`

**FinanceAdminController_escrow_v1**

**Response:**
`200`

---

### `GET /api/v1/admin/finance/payouts`

**FinanceAdminController_payouts_v1**

**Query Parameters:**
- `page' *(optional)*: `number`
- `limit' *(optional)*: `number`

**Response:**
`200`

---

## MessagesAdmin

### `POST /api/v1/admin/messages/broadcast`

**MessagesAdminController_broadcast_v1**

**Request Body:**
```typescript
{
  subject: string
  content: string
  recipientRoles?: Array<"PROPERTY_SEEKER" | "LANDLORD" | "REAL_ESTATE_AGENT" | "DIASPORA_INVESTOR" | "DEVELOPER" | "ADMIN">
}
```

**Response:**
`201`

---

## SettingsAdmin

### `GET /api/v1/admin/settings/profile`

**SettingsAdminController_getProfile_v1**

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
  bio: string
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

### `PATCH /api/v1/admin/settings/profile`

**SettingsAdminController_updateProfile_v1**

**Request Body:**
```typescript
{
  displayName?: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  bio?: string
  avatarUrl?: string(uri)
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
  bio: string
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

### `GET /api/v1/admin/settings/platform-fees`

**SettingsAdminController_getFees_v1**

**Response:**
```typescript
{
  inspectionFeePercent: number
  salesFeePercent: number
  rentalFeePercent: number
  escrowFeePercent: number
  payoutFeePercent: number
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `PATCH /api/v1/admin/settings/platform-fees`

**SettingsAdminController_updateFees_v1**

**Request Body:**
```typescript
{
  inspectionFeePercent?: number
  salesFeePercent?: number
  rentalFeePercent?: number
  escrowFeePercent?: number
  payoutFeePercent?: number
}
```

**Response:**
```typescript
{
  inspectionFeePercent: number
  salesFeePercent: number
  rentalFeePercent: number
  escrowFeePercent: number
  payoutFeePercent: number
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

## TicketsAdmin

### `GET /api/v1/admin/tickets`

**TicketsAdminController_list_v1**

**Query Parameters:**
- `page' *(optional)*: `number`
- `limit' *(optional)*: `number`
- `status' *(optional)*: `"OPEN" | "ASSIGNED" | "PENDING_USER" | "RESOLVED" | "CLOSED_INACTIVE"`
- `priority' *(optional)*: `"LOW" | "NORMAL" | "HIGH" | "URGENT"`
- `category' *(optional)*: `"GENERAL" | "BILLING" | "KYC" | "LISTING" | "TRANSACTION" | "OTHER"`
- `assignedToMe' *(optional)*: `boolean`
- `search' *(optional)*: `string`

**Response:**
`200`

---

### `GET /api/v1/admin/tickets/{id}`

**TicketsAdminController_get_v1**

**Path Parameters:**
- `id': `string`

**Response:**
`200`

---

### `POST /api/v1/admin/tickets/{id}/claim`

**TicketsAdminController_claim_v1**

**Path Parameters:**
- `id': `string`

**Response:**
```typescript
{
  reference: string
  subject: string
  status: "OPEN" | "ASSIGNED" | "PENDING_USER" | "RESOLVED" | "CLOSED_INACTIVE" // OPEN | ASSIGNED | PENDING_USER | RESOLVED | CLOSED_INACTIVE
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT" // LOW | NORMAL | HIGH | URGENT
  category: "GENERAL" | "BILLING" | "KYC" | "LISTING" | "TRANSACTION" | "OTHER" // GENERAL | BILLING | KYC | LISTING | TRANSACTION | OTHER
  requesterId: string
  requester: {
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
    bio: string
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  assignedAdminId: string
  assignedAdmin: {
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
    bio: string
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  conversationId: string
  conversation: {
    type: "DIRECT" | "LISTING" // DIRECT | LISTING
    listingId: string // For LISTING conversations, links to the listing.
    participants: Array<{
      conversationId: string
      conversation: Conversation (circular)
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
        bio: string
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
    }>
    messages: Array<{
      conversationId: string
      conversation: Conversation (circular)
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
        bio: string
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
        message: Message (circular)
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
    }>
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  assignedAt: string(date-time)
  firstResponseAt: string(date-time)
  resolvedAt: string(date-time)
  closedAt: string(date-time)
  lastUserActivityAt: string(date-time)
  lastAdminActivityAt: string(date-time)
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `POST /api/v1/admin/tickets/{id}/release`

**TicketsAdminController_release_v1**

**Path Parameters:**
- `id': `string`

**Response:**
```typescript
{
  reference: string
  subject: string
  status: "OPEN" | "ASSIGNED" | "PENDING_USER" | "RESOLVED" | "CLOSED_INACTIVE" // OPEN | ASSIGNED | PENDING_USER | RESOLVED | CLOSED_INACTIVE
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT" // LOW | NORMAL | HIGH | URGENT
  category: "GENERAL" | "BILLING" | "KYC" | "LISTING" | "TRANSACTION" | "OTHER" // GENERAL | BILLING | KYC | LISTING | TRANSACTION | OTHER
  requesterId: string
  requester: {
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
    bio: string
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  assignedAdminId: string
  assignedAdmin: {
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
    bio: string
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  conversationId: string
  conversation: {
    type: "DIRECT" | "LISTING" // DIRECT | LISTING
    listingId: string // For LISTING conversations, links to the listing.
    participants: Array<{
      conversationId: string
      conversation: Conversation (circular)
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
        bio: string
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
    }>
    messages: Array<{
      conversationId: string
      conversation: Conversation (circular)
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
        bio: string
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
        message: Message (circular)
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
    }>
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  assignedAt: string(date-time)
  firstResponseAt: string(date-time)
  resolvedAt: string(date-time)
  closedAt: string(date-time)
  lastUserActivityAt: string(date-time)
  lastAdminActivityAt: string(date-time)
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `POST /api/v1/admin/tickets/{id}/transfer`

**TicketsAdminController_transfer_v1**

**Path Parameters:**
- `id': `string`

**Request Body:**
```typescript
{
  toAdminId: string(uuid)
  reason?: string
}
```

**Response:**
```typescript
{
  reference: string
  subject: string
  status: "OPEN" | "ASSIGNED" | "PENDING_USER" | "RESOLVED" | "CLOSED_INACTIVE" // OPEN | ASSIGNED | PENDING_USER | RESOLVED | CLOSED_INACTIVE
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT" // LOW | NORMAL | HIGH | URGENT
  category: "GENERAL" | "BILLING" | "KYC" | "LISTING" | "TRANSACTION" | "OTHER" // GENERAL | BILLING | KYC | LISTING | TRANSACTION | OTHER
  requesterId: string
  requester: {
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
    bio: string
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  assignedAdminId: string
  assignedAdmin: {
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
    bio: string
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  conversationId: string
  conversation: {
    type: "DIRECT" | "LISTING" // DIRECT | LISTING
    listingId: string // For LISTING conversations, links to the listing.
    participants: Array<{
      conversationId: string
      conversation: Conversation (circular)
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
        bio: string
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
    }>
    messages: Array<{
      conversationId: string
      conversation: Conversation (circular)
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
        bio: string
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
        message: Message (circular)
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
    }>
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  assignedAt: string(date-time)
  firstResponseAt: string(date-time)
  resolvedAt: string(date-time)
  closedAt: string(date-time)
  lastUserActivityAt: string(date-time)
  lastAdminActivityAt: string(date-time)
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `POST /api/v1/admin/tickets/{id}/messages`

**TicketsAdminController_reply_v1**

**Path Parameters:**
- `id': `string`

**Request Body:**
```typescript
{
  content: string
}
```

**Response:**
```typescript
{
  conversationId: string
  conversation: {
    type: "DIRECT" | "LISTING" // DIRECT | LISTING
    listingId: string // For LISTING conversations, links to the listing.
    participants: Array<{
      conversationId: string
      conversation: Conversation (circular)
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
        bio: string
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
    }>
    messages: Array<Message (circular)>
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
    bio: string
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
    message: Message (circular)
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

### `PATCH /api/v1/admin/tickets/{id}/priority`

**TicketsAdminController_updatePriority_v1**

**Path Parameters:**
- `id': `string`

**Request Body:**
```typescript
{
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT" // LOW | NORMAL | HIGH | URGENT
}
```

**Response:**
```typescript
{
  reference: string
  subject: string
  status: "OPEN" | "ASSIGNED" | "PENDING_USER" | "RESOLVED" | "CLOSED_INACTIVE" // OPEN | ASSIGNED | PENDING_USER | RESOLVED | CLOSED_INACTIVE
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT" // LOW | NORMAL | HIGH | URGENT
  category: "GENERAL" | "BILLING" | "KYC" | "LISTING" | "TRANSACTION" | "OTHER" // GENERAL | BILLING | KYC | LISTING | TRANSACTION | OTHER
  requesterId: string
  requester: {
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
    bio: string
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  assignedAdminId: string
  assignedAdmin: {
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
    bio: string
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  conversationId: string
  conversation: {
    type: "DIRECT" | "LISTING" // DIRECT | LISTING
    listingId: string // For LISTING conversations, links to the listing.
    participants: Array<{
      conversationId: string
      conversation: Conversation (circular)
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
        bio: string
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
    }>
    messages: Array<{
      conversationId: string
      conversation: Conversation (circular)
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
        bio: string
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
        message: Message (circular)
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
    }>
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  assignedAt: string(date-time)
  firstResponseAt: string(date-time)
  resolvedAt: string(date-time)
  closedAt: string(date-time)
  lastUserActivityAt: string(date-time)
  lastAdminActivityAt: string(date-time)
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `POST /api/v1/admin/tickets/{id}/resolve`

**TicketsAdminController_resolve_v1**

**Path Parameters:**
- `id': `string`

**Response:**
```typescript
{
  reference: string
  subject: string
  status: "OPEN" | "ASSIGNED" | "PENDING_USER" | "RESOLVED" | "CLOSED_INACTIVE" // OPEN | ASSIGNED | PENDING_USER | RESOLVED | CLOSED_INACTIVE
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT" // LOW | NORMAL | HIGH | URGENT
  category: "GENERAL" | "BILLING" | "KYC" | "LISTING" | "TRANSACTION" | "OTHER" // GENERAL | BILLING | KYC | LISTING | TRANSACTION | OTHER
  requesterId: string
  requester: {
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
    bio: string
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  assignedAdminId: string
  assignedAdmin: {
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
    bio: string
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  conversationId: string
  conversation: {
    type: "DIRECT" | "LISTING" // DIRECT | LISTING
    listingId: string // For LISTING conversations, links to the listing.
    participants: Array<{
      conversationId: string
      conversation: Conversation (circular)
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
        bio: string
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
    }>
    messages: Array<{
      conversationId: string
      conversation: Conversation (circular)
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
        bio: string
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
        message: Message (circular)
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
    }>
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  assignedAt: string(date-time)
  firstResponseAt: string(date-time)
  resolvedAt: string(date-time)
  closedAt: string(date-time)
  lastUserActivityAt: string(date-time)
  lastAdminActivityAt: string(date-time)
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `POST /api/v1/admin/tickets/{id}/reopen`

**TicketsAdminController_reopen_v1**

**Path Parameters:**
- `id': `string`

**Response:**
```typescript
{
  reference: string
  subject: string
  status: "OPEN" | "ASSIGNED" | "PENDING_USER" | "RESOLVED" | "CLOSED_INACTIVE" // OPEN | ASSIGNED | PENDING_USER | RESOLVED | CLOSED_INACTIVE
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT" // LOW | NORMAL | HIGH | URGENT
  category: "GENERAL" | "BILLING" | "KYC" | "LISTING" | "TRANSACTION" | "OTHER" // GENERAL | BILLING | KYC | LISTING | TRANSACTION | OTHER
  requesterId: string
  requester: {
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
    bio: string
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  assignedAdminId: string
  assignedAdmin: {
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
    bio: string
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  conversationId: string
  conversation: {
    type: "DIRECT" | "LISTING" // DIRECT | LISTING
    listingId: string // For LISTING conversations, links to the listing.
    participants: Array<{
      conversationId: string
      conversation: Conversation (circular)
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
        bio: string
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
    }>
    messages: Array<{
      conversationId: string
      conversation: Conversation (circular)
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
        bio: string
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
        message: Message (circular)
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
    }>
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  assignedAt: string(date-time)
  firstResponseAt: string(date-time)
  resolvedAt: string(date-time)
  closedAt: string(date-time)
  lastUserActivityAt: string(date-time)
  lastAdminActivityAt: string(date-time)
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

## TicketsUser

### `POST /api/v1/support/tickets`

**TicketsUserController_create_v1**

**Request Body:**
```typescript
{
  subject: string
  content: string
  category?: "GENERAL" | "BILLING" | "KYC" | "LISTING" | "TRANSACTION" | "OTHER" // GENERAL | BILLING | KYC | LISTING | TRANSACTION | OTHER
  priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT" // LOW | NORMAL | HIGH | URGENT
}
```

**Response:**
```typescript
{
  reference: string
  subject: string
  status: "OPEN" | "ASSIGNED" | "PENDING_USER" | "RESOLVED" | "CLOSED_INACTIVE" // OPEN | ASSIGNED | PENDING_USER | RESOLVED | CLOSED_INACTIVE
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT" // LOW | NORMAL | HIGH | URGENT
  category: "GENERAL" | "BILLING" | "KYC" | "LISTING" | "TRANSACTION" | "OTHER" // GENERAL | BILLING | KYC | LISTING | TRANSACTION | OTHER
  requesterId: string
  requester: {
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
    bio: string
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  assignedAdminId: string
  assignedAdmin: {
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
    bio: string
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  conversationId: string
  conversation: {
    type: "DIRECT" | "LISTING" // DIRECT | LISTING
    listingId: string // For LISTING conversations, links to the listing.
    participants: Array<{
      conversationId: string
      conversation: Conversation (circular)
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
        bio: string
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
    }>
    messages: Array<{
      conversationId: string
      conversation: Conversation (circular)
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
        bio: string
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
        message: Message (circular)
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
    }>
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  assignedAt: string(date-time)
  firstResponseAt: string(date-time)
  resolvedAt: string(date-time)
  closedAt: string(date-time)
  lastUserActivityAt: string(date-time)
  lastAdminActivityAt: string(date-time)
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

### `GET /api/v1/support/tickets`

**TicketsUserController_list_v1**

**Query Parameters:**
- `page' *(optional)*: `number`
- `limit' *(optional)*: `number`
- `status' *(optional)*: `"OPEN" | "ASSIGNED" | "PENDING_USER" | "RESOLVED" | "CLOSED_INACTIVE"`
- `priority' *(optional)*: `"LOW" | "NORMAL" | "HIGH" | "URGENT"`
- `category' *(optional)*: `"GENERAL" | "BILLING" | "KYC" | "LISTING" | "TRANSACTION" | "OTHER"`
- `assignedToMe' *(optional)*: `boolean`
- `search' *(optional)*: `string`

**Response:**
`200`

---

### `GET /api/v1/support/tickets/{id}`

**TicketsUserController_get_v1**

**Path Parameters:**
- `id': `string`

**Response:**
`200`

---

### `POST /api/v1/support/tickets/{id}/messages`

**TicketsUserController_reply_v1**

**Path Parameters:**
- `id': `string`

**Request Body:**
```typescript
{
  content: string
}
```

**Response:**
```typescript
{
  conversationId: string
  conversation: {
    type: "DIRECT" | "LISTING" // DIRECT | LISTING
    listingId: string // For LISTING conversations, links to the listing.
    participants: Array<{
      conversationId: string
      conversation: Conversation (circular)
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
        bio: string
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
    }>
    messages: Array<Message (circular)>
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
    bio: string
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
    message: Message (circular)
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

### `POST /api/v1/support/tickets/{id}/close`

**TicketsUserController_close_v1**

**Path Parameters:**
- `id': `string`

**Response:**
```typescript
{
  reference: string
  subject: string
  status: "OPEN" | "ASSIGNED" | "PENDING_USER" | "RESOLVED" | "CLOSED_INACTIVE" // OPEN | ASSIGNED | PENDING_USER | RESOLVED | CLOSED_INACTIVE
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT" // LOW | NORMAL | HIGH | URGENT
  category: "GENERAL" | "BILLING" | "KYC" | "LISTING" | "TRANSACTION" | "OTHER" // GENERAL | BILLING | KYC | LISTING | TRANSACTION | OTHER
  requesterId: string
  requester: {
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
    bio: string
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  assignedAdminId: string
  assignedAdmin: {
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
    bio: string
    linkedinUrl: string // Profile social links (display only; no social auth)
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  conversationId: string
  conversation: {
    type: "DIRECT" | "LISTING" // DIRECT | LISTING
    listingId: string // For LISTING conversations, links to the listing.
    participants: Array<{
      conversationId: string
      conversation: Conversation (circular)
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
        bio: string
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
    }>
    messages: Array<{
      conversationId: string
      conversation: Conversation (circular)
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
        bio: string
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
        message: Message (circular)
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
    }>
    id: string
    createdAt: string(date-time)
    updatedAt: string(date-time)
    deletedAt: string(date-time)
  }
  assignedAt: string(date-time)
  firstResponseAt: string(date-time)
  resolvedAt: string(date-time)
  closedAt: string(date-time)
  lastUserActivityAt: string(date-time)
  lastAdminActivityAt: string(date-time)
  id: string
  createdAt: string(date-time)
  updatedAt: string(date-time)
  deletedAt: string(date-time)
}
```

---

## Health

### `GET /api/v1/health/live`

**HealthController_live_v1**

**Response:**
`200`

---

### `GET /api/v1/health`

**HealthController_ready_v1**

**Response:**
```typescript
{
  status?: string
  info?: Record<string, unknown>
  error?: Record<string, unknown>
  details?: Record<string, unknown>
}
```

---

