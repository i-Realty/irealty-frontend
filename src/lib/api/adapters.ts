/**
 * API Adapters
 *
 * Single source of truth for translating backend response shapes into
 * frontend types. Nothing outside this file should reference backend
 * field names directly.
 *
 * Used only when NEXT_PUBLIC_USE_API=true — mock mode bypasses all of this.
 */

import type { UserRole, AuthUser } from '@/lib/store/useAuthStore';

// ---------------------------------------------------------------------------
// Role mapping
// ---------------------------------------------------------------------------

const BACKEND_TO_ROLE: Record<string, UserRole> = {
  REAL_ESTATE_AGENT: 'Agent',
  PROPERTY_SEEKER:   'Property Seeker',
  DIASPORA_INVESTOR: 'Diaspora',
  DEVELOPER:         'Developer',
  LANDLORD:          'Landlord',
  ADMIN:             'Admin',
};

/** Backend role enum → frontend UserRole */
export const mapRole = (backendRole: string): UserRole =>
  BACKEND_TO_ROLE[backendRole] ?? 'Property Seeker';

/** Frontend UserRole → backend role enum */
export const ROLE_TO_BACKEND: Record<UserRole, string> = {
  Agent:             'REAL_ESTATE_AGENT',
  'Property Seeker': 'PROPERTY_SEEKER',
  Diaspora:          'DIASPORA_INVESTOR',
  Developer:         'DEVELOPER',
  Landlord:          'LANDLORD',
  Admin:             'ADMIN',
};

/**
 * Signup role slug (from the role-selection page) → backend role enum.
 * These slugs come from the frontend UI, not the backend.
 */
export const SIGNUP_ROLE_TO_BACKEND: Record<string, string> = {
  'real-estate-agent':  'REAL_ESTATE_AGENT',
  'property-seeker':    'PROPERTY_SEEKER',
  'developers':         'DEVELOPER',
  'property-owner':     'LANDLORD',
  'diaspora-investors': 'DIASPORA_INVESTOR',
};

// ---------------------------------------------------------------------------
// KYC / account status mapping
// ---------------------------------------------------------------------------

/** Backend verificationStatus → frontend kycStatus */
export const mapKycStatus = (
  v: string
): 'unverified' | 'in-progress' | 'verified' => {
  if (v === 'VERIFIED') return 'verified';
  if (v === 'PENDING')  return 'in-progress';
  return 'unverified';
};

/** Backend isActive + verificationStatus → frontend accountStatus */
export const mapAccountStatus = (
  isActive: boolean,
  verificationStatus: string
): 'active' | 'suspended' | 'deactivated' => {
  if (!isActive || verificationStatus === 'SUSPENDED') return 'suspended';
  if (verificationStatus === 'REVOKED')                return 'deactivated';
  return 'active';
};

// ---------------------------------------------------------------------------
// User model
// ---------------------------------------------------------------------------

/** Raw backend User object (fields we care about) */
export interface BackendUser {
  id: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  username?: string;
  email: string;
  avatarUrl?: string;
  roles?: string[];
  isActive?: boolean;
  verificationStatus?: string;
  onboardingStep?: string;
}

/** Backend auth response — login, register, refresh, switch-account */
export interface BackendAuthResponse {
  // Token field names vary across frameworks — handle all common variants
  token?:         string;
  accessToken?:   string;
  access_token?:  string;  // NestJS @nestjs/jwt default
  refreshToken?:  string;
  refresh_token?: string;
  user?:          BackendUser;
  // NestJS interceptors often wrap the payload in `data`
  data?:          BackendAuthResponse;
  // Sometimes the user fields are at the top level
  id?:            string;
  email?:         string;
  roles?:         string[];
}

/**
 * Unwrap a potential NestJS `{ statusCode, message, data: { … } }` envelope.
 * If the response has a `data` key that looks like the real payload, use it.
 */
function unwrap(res: BackendAuthResponse): BackendAuthResponse {
  if (res.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
    return res.data;
  }
  return res;
}

/** Extract the access token from a backend auth response */
export const extractToken = (res: BackendAuthResponse): string | null => {
  const r = unwrap(res);
  return r.token ?? r.accessToken ?? r.access_token ?? null;
};

/** Extract the refresh token from a backend auth response */
export const extractRefreshToken = (res: BackendAuthResponse): string | null => {
  const r = unwrap(res);
  return r.refreshToken ?? r.refresh_token ?? null;
};

/** Map a BackendUser (or top-level auth response) to frontend AuthUser */
export const mapUser = (raw: BackendUser): AuthUser => {
  const firstName = raw.firstName ?? '';
  const lastName  = raw.lastName  ?? '';
  const fullName  = `${firstName} ${lastName}`.trim() || raw.displayName || raw.username || 'User';

  return {
    id:            raw.id,
    name:          fullName,
    email:         raw.email,
    role:          mapRole(raw.roles?.[0] ?? ''),
    displayName:   raw.displayName || fullName,
    avatarUrl:     raw.avatarUrl ?? '/images/demo-avatar.jpg',
    kycStatus:     mapKycStatus(raw.verificationStatus ?? ''),
    accountStatus: mapAccountStatus(raw.isActive ?? true, raw.verificationStatus ?? ''),
  };
};

/**
 * Pull the AuthUser out of a BackendAuthResponse.
 * Handles { data: { user } }, { user }, and flat responses.
 */
export const mapAuthResponse = (res: BackendAuthResponse): AuthUser => {
  const r = unwrap(res);
  const raw: BackendUser = r.user ?? (r as unknown as BackendUser);
  return mapUser(raw);
};

// ---------------------------------------------------------------------------
// Currency helpers
// ---------------------------------------------------------------------------

/** Kobo (backend integer) → Naira (frontend float) */
export const fromKobo = (kobo: number): number => kobo / 100;

/** Naira → Kobo */
export const toKobo = (naira: number): number => Math.round(naira * 100);

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-NG', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
