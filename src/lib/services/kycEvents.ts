/**
 * KYC Phone Verification Events (SSE)
 *
 * Subscribes to the Server-Sent Events stream at GET /api/kyc/phone/events
 * to receive real-time updates on phone verification status.
 *
 * Usage:
 *   const unsub = subscribeToKycPhoneEvents((event) => {
 *     if (event.status === 'VERIFIED') { ... }
 *   });
 *   // Later: unsub();
 */

type KycPhoneEvent = {
  status: string;
  phoneNumber?: string;
  message?: string;
};

/**
 * Open an SSE connection to the KYC phone events endpoint.
 * Returns a cleanup function that closes the connection.
 */
export function subscribeToKycPhoneEvents(
  onEvent: (event: KycPhoneEvent) => void,
  onError?: (error: Event) => void,
): () => void {
  if (typeof window === 'undefined') return () => {};

  // Build the URL — the Next.js rewrite will proxy /api/* to the backend
  const token = (() => {
    try {
      const raw = localStorage.getItem('irealty-auth');
      if (!raw) return null;
      return JSON.parse(raw)?.state?.token ?? null;
    } catch {
      return null;
    }
  })();

  // EventSource doesn't support custom headers, so pass token via query param
  const url = token
    ? `/api/kyc/phone/events?token=${encodeURIComponent(token)}`
    : '/api/kyc/phone/events';

  const eventSource = new EventSource(url);

  eventSource.onmessage = (e) => {
    try {
      const data: KycPhoneEvent = JSON.parse(e.data);
      onEvent(data);
    } catch {
      // Non-JSON message — ignore
    }
  };

  eventSource.onerror = (e) => {
    onError?.(e);
  };

  return () => {
    eventSource.close();
  };
}
