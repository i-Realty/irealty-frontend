/**
 * Pusher Real-Time Service
 *
 * Provides real-time messaging via Pusher.
 * Auth endpoint: POST /api/messages/pusher/auth
 *
 * Usage:
 *   1. Install pusher-js: `npm install pusher-js`
 *   2. Set NEXT_PUBLIC_PUSHER_KEY and NEXT_PUBLIC_PUSHER_CLUSTER in .env.local
 *   3. Call initPusher() once at app startup
 *   4. Use subscribeToConversation() to listen for new messages
 *
 * Until pusher-js is installed, all functions are safe no-ops.
 */

import { apiPost } from '@/lib/api/client';

const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY ?? '';
const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? 'mt1';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pusherInstance: any = null;

/**
 * Pusher channel authorizer that calls our backend.
 * The backend verifies the JWT and returns the Pusher auth signature.
 */
async function authorize(socketId: string, channelName: string): Promise<{ auth: string; channel_data?: string }> {
  return apiPost<{ auth: string; channel_data?: string }>(
    '/api/messages/pusher/auth',
    { socket_id: socketId, channel_name: channelName },
  );
}

/**
 * Initialize the Pusher client. Safe to call even if pusher-js is not installed.
 */
export async function initPusher(): Promise<void> {
  if (pusherInstance || !PUSHER_KEY) return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const PusherModule = await (Function('return import("pusher-js")')() as Promise<{ default?: unknown }>);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Pusher = (PusherModule.default ?? PusherModule) as any;
    pusherInstance = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
      authorizer: (channel: { name: string }) => ({
        authorize: (socketId: string, callback: (error: boolean, data: unknown) => void) => {
          authorize(socketId, channel.name)
            .then((data) => callback(false, data))
            .catch((err) => callback(true, err));
        },
      }),
    });
  } catch {
    // pusher-js not installed — real-time disabled
  }
}

/**
 * Subscribe to a private conversation channel for incoming messages.
 * Returns an unsubscribe function.
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
    pusherInstance.unsubscribe(channelName);
  };
}

/**
 * Disconnect Pusher entirely (e.g. on logout).
 */
export function disconnectPusher(): void {
  if (!pusherInstance) return;
  pusherInstance.disconnect();
  pusherInstance = null;
}
