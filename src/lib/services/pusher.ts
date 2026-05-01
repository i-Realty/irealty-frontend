/**
 * Pusher Real-Time Service
 *
 * Provides real-time messaging via Pusher.
 * Auth endpoint: POST /api/messages/pusher/auth
 *
 * Env vars required (.env.local):
 *   NEXT_PUBLIC_PUSHER_KEY=<app key>
 *   NEXT_PUBLIC_PUSHER_CLUSTER=<cluster>   e.g. us3
 *
 * initPusher() is called lazily on first chat open — no manual setup needed.
 */

import { apiPost } from '@/lib/api/client';

const PUSHER_KEY     = process.env.NEXT_PUBLIC_PUSHER_KEY     ?? '';
const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? 'us3';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pusherInstance: any = null;
let initPromise: Promise<void> | null = null;

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

export async function initPusher(): Promise<void> {
  if (typeof window === 'undefined' || pusherInstance || !PUSHER_KEY) return;

  // Deduplicate concurrent init calls
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const PusherJS = (await import('pusher-js')).default;

      pusherInstance = new PusherJS(PUSHER_KEY, {
        cluster: PUSHER_CLUSTER,
        // v8 channel auth API — calls our backend to sign the socket
        channelAuthorization: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          customHandler: (params: any, callback: any) => {
            apiPost<{ auth: string; channel_data?: string }>(
              '/api/messages/pusher/auth',
              { socket_id: params.socketId, channel_name: params.channelName },
            )
              .then(data => callback(null, data))
              .catch((err: unknown) => callback(new Error(String(err)), null));
          },
        },
      });
    } catch (err) {
      console.warn('[Pusher] init failed:', err);
    } finally {
      initPromise = null;
    }
  })();

  return initPromise;
}

// ---------------------------------------------------------------------------
// Subscribe / unsubscribe
// ---------------------------------------------------------------------------

/**
 * Subscribe to a private conversation channel for incoming messages.
 * Lazily initialises Pusher if not already done.
 * Returns an unsubscribe cleanup function.
 */
export function subscribeToConversation(
  conversationId: string,
  onMessage: (message: unknown) => void,
): () => void {
  if (!pusherInstance) return () => {};

  const channelName = `private-conversation-${conversationId}`;
  const channel = pusherInstance.subscribe(channelName);
  channel.bind('new-message', onMessage);

  return () => {
    channel.unbind('new-message', onMessage);
    pusherInstance?.unsubscribe(channelName);
  };
}

// ---------------------------------------------------------------------------
// Disconnect (called on logout)
// ---------------------------------------------------------------------------

export function disconnectPusher(): void {
  if (!pusherInstance) return;
  pusherInstance.disconnect();
  pusherInstance = null;
}
