/**
 * API Client Utility
 *
 * Base fetch wrapper used by all stores when making real API calls.
 * Replace *Mock() functions in stores with calls to these helpers.
 *
 * Usage:
 *   import { apiGet, apiPost } from '@/lib/api/client';
 *
 *   const data = await apiGet<ListingsResponse>('/api/listings?page=1');
 *   const result = await apiPost<CreatePropertyResponse>('/api/properties', payload);
 *
 * All /api/* paths are proxied through Next.js rewrites to the backend
 * (next.config.ts: /api/:path* → https://staging-api.i-realty.app/api/v1/:path*)
 * so there is no CORS issue and no need for an explicit BASE_URL.
 */

// ── Token helpers ─────────────────────────────────────────────────────

/**
 * In-memory override so callers that just stored a token via setToken()
 * can use it immediately, without waiting for Zustand persist to flush
 * to localStorage (which happens asynchronously).
 */
let tokenOverride: string | null = null;

/** Call this right after setToken() so the very next request picks it up. */
export function setTokenImmediate(token: string | null) {
  tokenOverride = token;
}

function getAuthState(): { token: string | null; refreshToken: string | null } {
  if (typeof window === 'undefined') return { token: null, refreshToken: null };
  try {
    const raw = localStorage.getItem('irealty-auth');
    if (!raw) return { token: null, refreshToken: null };
    const parsed = JSON.parse(raw);
    return {
      token:        parsed?.state?.token        ?? null,
      refreshToken: parsed?.state?.refreshToken ?? null,
    };
  } catch {
    return { token: null, refreshToken: null };
  }
}

function getToken(): string | null {
  return tokenOverride ?? getAuthState().token;
}

// ── Token refresh ─────────────────────────────────────────────────────

let isRefreshing = false;

/**
 * Attempt a silent token refresh using the stored refreshToken.
 * Writes the new tokens directly to localStorage so the next request
 * picks them up without a circular store import.
 * Returns true if the refresh succeeded.
 */
async function tryRefreshToken(): Promise<boolean> {
  if (isRefreshing) return false;
  isRefreshing = true;
  try {
    const { refreshToken } = getAuthState();
    if (!refreshToken) return false;

    const resp = await fetch(`/api/auth/refresh`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ refreshToken }),
    });

    if (!resp.ok) return false;

    const data = await resp.json();
    const newToken        = data.token ?? data.accessToken ?? data.access_token;
    const newRefreshToken = data.refreshToken ?? data.refresh_token;
    if (!newToken) return false;

    // Patch localStorage directly to avoid a circular import of useAuthStore
    const raw = localStorage.getItem('irealty-auth');
    if (!raw) return false;
    const stored = JSON.parse(raw);
    stored.state.token = newToken;
    if (newRefreshToken) stored.state.refreshToken = newRefreshToken;
    localStorage.setItem('irealty-auth', JSON.stringify(stored));

    return true;
  } catch {
    return false;
  } finally {
    isRefreshing = false;
  }
}

// ── Error types ───────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ── Error message helpers ────────────────────────────────────────────

const FRIENDLY_STATUS: Record<number, string> = {
  400: 'The request was invalid. Please check your input and try again.',
  401: 'Invalid email or password.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  409: 'This account already exists. Please log in instead.',
  422: 'Some fields are invalid. Please check your input.',
  429: 'Too many attempts. Please wait a moment and try again.',
  500: 'Something went wrong on our end. Please try again later.',
};

/**
 * Extract a human-readable string from any error body shape.
 * Handles: string, string[], { message }, { error }, nested objects, etc.
 */
function extractErrorMessage(body: unknown, status: number): string {
  if (!body || typeof body !== 'object') {
    return FRIENDLY_STATUS[status] ?? `Something went wrong (${status}).`;
  }

  const obj = body as Record<string, unknown>;

  // Try common fields: message, error, detail, errors
  for (const key of ['message', 'error', 'detail', 'errors']) {
    const val = obj[key];
    if (typeof val === 'string' && val.trim()) return val;
    if (Array.isArray(val)) {
      const strs: string[] = val
        .map(v => typeof v === 'string' ? v : String((v as Record<string, unknown>)?.message ?? ''))
        .filter(s => s.length > 0);
      if (strs.length) return strs[0];
    }
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      const nested = Object.values(val as Record<string, unknown>)
        .filter(v => typeof v === 'string');
      if (nested.length) return nested[0] as string;
    }
  }

  return FRIENDLY_STATUS[status] ?? `Something went wrong (${status}).`;
}

// ── Core fetch wrapper ────────────────────────────────────────────────

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  extraHeaders?: Record<string, string>,
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };

  // Paths must start with /api/ — Next.js rewrites forward them to the backend.
  const response = await fetch(path, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (response.status === 401) {
    // Auth endpoints (login, register, verify, etc.) should never trigger
    // a session-clear + redirect — a 401 there just means bad credentials.
    const isAuthEndpoint = /^\/api\/auth\/(login|register|verify|resend|refresh)/.test(path)
      || !!extraHeaders?.['X-Skip-Auth-Redirect'];

    if (!isAuthEndpoint) {
      // Only attempt refresh once — the X-Retry header flags the retry
      const isRetry = !!extraHeaders?.['X-Retry'];
      if (!isRetry) {
        const refreshed = await tryRefreshToken();
        if (refreshed) {
          return request<T>(method, path, body, { ...extraHeaders, 'X-Retry': '1' });
        }
      }
      // Refresh failed (or already retried) — clear session and redirect
      if (typeof window !== 'undefined') {
        document.cookie = 'irealty-session=; path=/; max-age=0';
        localStorage.removeItem('irealty-auth');
        tokenOverride = null;
        window.location.href = '/auth/login';
      }
    }

    let errorBody: unknown;
    try { errorBody = await response.json(); } catch { errorBody = null; }
    throw new ApiError(401, extractErrorMessage(errorBody, 401), errorBody);
  }

  if (!response.ok) {
    let errorBody: unknown;
    try { errorBody = await response.json(); } catch { errorBody = null; }
    throw new ApiError(response.status, extractErrorMessage(errorBody, response.status), errorBody);
  }

  // 204 No Content — return empty object
  if (response.status === 204) return {} as T;

  const json = await response.json();

  // Many NestJS backends wrap responses in { statusCode, message, data }.
  // Unwrap automatically so callers always get the actual payload.
  if (json && typeof json === 'object' && 'data' in json && json.data !== undefined
      && ('statusCode' in json || 'message' in json)) {
    return json.data as T;
  }

  return json as T;
}

// ── Public helpers ────────────────────────────────────────────────────

export const apiGet = <T>(path: string, headers?: Record<string, string>) =>
  request<T>('GET', path, undefined, headers);

export const apiPost = <T>(path: string, body?: unknown) =>
  request<T>('POST', path, body);

export const apiPatch = <T>(path: string, body?: unknown) =>
  request<T>('PATCH', path, body);

export const apiPut = <T>(path: string, body?: unknown) =>
  request<T>('PUT', path, body);

export const apiDelete = <T>(path: string) =>
  request<T>('DELETE', path);

/**
 * Multipart file upload helper.
 * Do NOT set Content-Type — the browser fills in the boundary automatically.
 */
export async function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await fetch(path, { method: 'POST', headers, body: formData });

  if (!response.ok) {
    let errorBody: unknown;
    try { errorBody = await response.json(); } catch { errorBody = null; }
    throw new ApiError(response.status, extractErrorMessage(errorBody, response.status), errorBody);
  }

  if (response.status === 204) return {} as T;

  const json = await response.json();
  if (json && typeof json === 'object' && 'data' in json && json.data !== undefined
      && ('statusCode' in json || 'message' in json)) {
    return json.data as T;
  }
  return json as T;
}
