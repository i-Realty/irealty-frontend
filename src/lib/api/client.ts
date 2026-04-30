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
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

// ── Token helpers ─────────────────────────────────────────────────────

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
  return getAuthState().token;
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

    const resp = await fetch(`${BASE_URL}/auth/refresh`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ refreshToken }),
    });

    if (!resp.ok) return false;

    const data = await resp.json();
    const newToken        = data.token ?? data.accessToken;
    const newRefreshToken = data.refreshToken;
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

  // Strip the /api prefix so paths like /api/wallet/ledger become
  // https://staging-api.i-realty.app/v1/wallet/ledger
  const versionedPath = path.replace(/^\/api\//, '/');
  const response = await fetch(`${BASE_URL}${versionedPath}`, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (response.status === 401) {
    // Only attempt refresh once — the X-Retry header flags the retry
    const isRetry = !!extraHeaders?.['X-Retry'];
    if (!isRetry) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        // Retry original request with the new token
        return request<T>(method, path, body, { ...extraHeaders, 'X-Retry': '1' });
      }
    }
    // Refresh failed (or already retried) — clear session and redirect
    if (typeof window !== 'undefined') {
      document.cookie = 'irealty-session=; path=/; max-age=0';
      localStorage.removeItem('irealty-auth');
      window.location.href = '/auth/login';
    }
    throw new ApiError(401, 'Unauthorized');
  }

  if (!response.ok) {
    let errorBody: unknown;
    try { errorBody = await response.json(); } catch { errorBody = null; }
    const message =
      (errorBody as { message?: string })?.message ??
      `API error ${response.status}`;
    throw new ApiError(response.status, message, errorBody);
  }

  // 204 No Content — return empty object
  if (response.status === 204) return {} as T;

  return response.json() as Promise<T>;
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
