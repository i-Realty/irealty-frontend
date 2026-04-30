/**
 * Firebase Authentication Service
 *
 * Handles Google sign-in via Firebase, then exchanges the Firebase ID token
 * for an i-Realty JWT via POST /api/auth/firebase.
 *
 * Required env vars (add to .env.local):
 *   NEXT_PUBLIC_FIREBASE_API_KEY
 *   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *   NEXT_PUBLIC_FIREBASE_APP_ID
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  type Auth,
} from 'firebase/auth';
import { apiPost } from '@/lib/api/client';
import type { BackendAuthResponse } from '@/lib/api/adapters';

// ---------------------------------------------------------------------------
// Firebase init (singleton — safe to call multiple times)
// ---------------------------------------------------------------------------

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

function getFirebaseAuth(): Auth {
  if (auth) return auth;

  const config = {
    apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  if (!config.apiKey) {
    throw new Error('Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* vars to .env.local');
  }

  app   = getApps().length ? getApps()[0] : initializeApp(config);
  auth  = getAuth(app);
  return auth;
}

// ---------------------------------------------------------------------------
// Google sign-in
// ---------------------------------------------------------------------------

export interface FirebaseAuthResult {
  backendResponse: BackendAuthResponse;
}

/**
 * Opens the Google sign-in popup, gets a Firebase ID token, then exchanges
 * it for an i-Realty JWT via POST /api/auth/firebase.
 *
 * Throws on any failure (popup cancelled, network error, backend error).
 */
export async function signInWithGoogle(): Promise<FirebaseAuthResult> {
  const firebaseAuth = getFirebaseAuth();
  const provider     = new GoogleAuthProvider();

  // Force account selection every time so multi-account users can pick
  provider.setCustomParameters({ prompt: 'select_account' });

  const result  = await signInWithPopup(firebaseAuth, provider);
  const idToken = await result.user.getIdToken();

  // Exchange Firebase ID token for backend JWT
  const backendResponse = await apiPost<BackendAuthResponse>(
    '/api/auth/firebase',
    { idToken },
  );

  // Sign the Firebase user out locally — we use backend JWTs, not Firebase sessions
  await firebaseSignOut(firebaseAuth).catch(() => {});

  return { backendResponse };
}
