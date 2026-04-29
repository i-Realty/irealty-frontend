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

// ── Token helper ──────────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('irealty-auth');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.token ?? null;
  } catch {
    return null;
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
    // Token expired — clear session and redirect
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
