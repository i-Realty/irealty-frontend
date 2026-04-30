"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import PasswordInput from '@/components/auth/PasswordInput';
import { useAuthStore, AuthUser, UserRole } from '@/lib/store/useAuthStore';
import { useSettingsStore } from '@/lib/store/useSettingsStore';
import { validateEmail, validateRequired, validatePassword } from '@/lib/utils/authValidation';
import { useI18n } from '@/lib/i18n';
import { apiPost, apiGet, ApiError, setTokenImmediate } from '@/lib/api/client';
import { mapUser, extractToken, extractRefreshToken, type BackendAuthResponse, type BackendUser } from '@/lib/api/adapters';
import { useFavouritesStore } from '@/lib/store/useFavouritesStore';

// ── Mock credentials (until backend is integrated) ──────────────────────────
// When NEXT_PUBLIC_USE_API=true, this block is bypassed and a real API call is
// made instead. These credentials only work while the app is in mock mode.

const MOCK_CREDENTIALS: Record<string, { password: string; role: UserRole; name: string; id: string }> = {
  'admin@i-realty.app':     { password: 'admin2323RR',     role: 'Admin',           name: 'Waden Warren',   id: 'demo-admin'     },
  'agent@i-realty.app':     { password: 'agent2323RR',     role: 'Agent',           name: 'Marcus Bell',    id: 'demo-agent'     },
  'seeker@i-realty.app':    { password: 'seeker2323RR',    role: 'Property Seeker', name: 'Sarah Homes',    id: 'demo-seeker'    },
  'developer@i-realty.app': { password: 'developer2323RR', role: 'Developer',       name: 'Chidi Okeke',    id: 'demo-developer' },
  'diaspora@i-realty.app':  { password: 'diaspora2323RR',  role: 'Diaspora',        name: 'Ngozi Adeyemi',  id: 'demo-diaspora'  },
  'landlord@i-realty.app':  { password: 'landlord2323RR',  role: 'Landlord',        name: 'Tunde Bakare',   id: 'demo-landlord'  },
};

const ROLE_DASHBOARD_MAP: Record<UserRole, string> = {
  'Admin':           '/dashboard/admin',
  'Agent':           '/dashboard/agent',
  'Developer':       '/dashboard/developer',
  'Property Seeker': '/dashboard/seeker',
  'Landlord':        '/dashboard/landlord',
  'Diaspora':        '/dashboard/diaspora',
};

export default function LoginPage() {
  const router = useRouter();
  const { login: doLogin, logout, isLoggedIn, setToken } = useAuthStore();
  const login = doLogin;
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Clear any stale session when the user *intentionally* navigates to login.
  // Only fires on initial mount — does NOT react to isLoggedIn changing later
  // (which would clobber a login that just succeeded and is about to redirect).
  const staleOnMount = React.useRef(isLoggedIn);
  React.useEffect(() => {
    if (staleOnMount.current) {
      logout();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Errors state
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const canSubmit = email.trim() !== '' && password.trim() !== '' && !loading;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    // Validate format
    const emailErr = validateEmail(email) || validateRequired(email, 'Email');
    const pwdErr = validateRequired(password, 'Password');

    if (emailErr || pwdErr) {
      setErrors({ email: emailErr, password: pwdErr });
      return;
    }

    setLoading(true);

    const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

    if (USE_API) {
      // ── Live API mode ──────────────────────────────────────────────
      try {
        const data = await apiPost<BackendAuthResponse>('/api/auth/login', {
          email: email.trim().toLowerCase(),
          password,
        });

        // Store token so subsequent requests are authenticated.
        const token        = extractToken(data);
        const refreshToken = extractRefreshToken(data);
        if (!token) {
          // Login succeeded (200) but no token found — log full shape for debugging
          console.error('[i-Realty] Login 200 but no token found. Response keys:', Object.keys(data));
          throw new Error('Login succeeded but no access token was returned. Please contact support.');
        }
        setToken(token, refreshToken);
        setTokenImmediate(token);

        // Fetch the authoritative user object from /me (documented shape).
        // X-Skip-Auth-Redirect prevents the 401 handler from hard-redirecting
        // back to /auth/login if the /me call fails — we want the catch block
        // below to handle it instead.
        const meData   = await apiGet<BackendUser>('/api/auth/me', { 'X-Skip-Auth-Redirect': '1' });
        const authUser = mapUser(meData);

        login(authUser);
        useSettingsStore.getState().setActiveAccount(authUser.id);
        useSettingsStore.getState().fetchAccounts(); // non-blocking
        useFavouritesStore.getState().hydrate();     // non-blocking
        const params     = new URLSearchParams(window.location.search);
        const redirectTo = params.get('redirect') || ROLE_DASHBOARD_MAP[authUser.role];
        router.push(redirectTo);
      } catch (err: unknown) {
        if (err instanceof ApiError && err.status === 409) {
          // Account exists but email not yet verified — go to verification step
          router.push(`/auth/signup/verify?email=${encodeURIComponent(email.trim().toLowerCase())}`);
          return;
        }
        const msg = err instanceof Error ? err.message : 'Login failed. Please try again.';
        setErrors({ general: msg });
      } finally {
        setLoading(false);
      }
      return;
    }

    // ── Mock mode ──────────────────────────────────────────────────
    setTimeout(() => {
      const normalizedEmail = email.trim().toLowerCase();
      const cred = MOCK_CREDENTIALS[normalizedEmail];

      if (!cred || cred.password !== password) {
        setErrors({ general: 'Invalid email or password. Use a demo account.' });
        setLoading(false);
        return;
      }

      const mockUser: AuthUser = {
        id: cred.id,
        name: cred.name,
        email: normalizedEmail,
        role: cred.role,
        displayName: cred.name,
        avatarUrl: '/images/demo-avatar.jpg',
        kycStatus: cred.role === 'Admin' ? 'verified' : 'unverified',
        accountStatus: 'active',
      };

      login(mockUser);
      // Sync the settings store so the account switcher and profile reflect this account
      useSettingsStore.getState().setActiveAccount(mockUser.id);

      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get('redirect') || ROLE_DASHBOARD_MAP[cred.role];
      router.push(redirectTo);
    }, 500);
  }

  return (
    <AuthLayout maxWidth={500}>
      <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-8 sm:p-10 shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-2 dark:text-gray-100">{t('auth.welcomeBackTitle')}</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {t('auth.noAccount')}{' '}
          <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
            {t('auth.signup')}
          </Link>
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {errors.general && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg text-sm mb-2">{errors.general}</div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('auth.emailAddress')}</label>
            <input
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({...errors, email: ''}); }}
              placeholder={t('auth.enterEmail')}
              className={`px-3 py-2.5 rounded-lg border ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-700 focus:ring-blue-200 focus:border-blue-500'} focus:outline-none focus:ring-2 transition-all dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500`}
            />
            {errors.email && <span className="text-xs text-red-500 mt-1">{errors.email}</span>}
          </div>

          <div className="flex flex-col gap-1" style={{ marginTop: '-4px' }}>
            <PasswordInput
              label={t('auth.password')}
              value={password}
              onChange={(v) => { setPassword(v); if (errors.password) setErrors({...errors, password: ''}); }}
              placeholder={t('auth.enterPassword')}
              error={errors.password}
            />
          </div>

          <div className="flex justify-start">
            <Link href="/auth/reset" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              {t('auth.forgotPasswordReset')}
            </Link>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full py-3 mt-4 rounded-lg font-bold text-white transition-all
              ${canSubmit ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'}
              ${loading ? 'opacity-80' : ''}`}
          >
            {loading ? t('auth.loggingIn') : t('auth.loginButton')}
          </button>

          <div className="flex items-center gap-4 my-2">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <div className="text-gray-400 text-sm">{t('auth.orContinueWith')}</div>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          {process.env.NEXT_PUBLIC_USE_API === 'true' ? (
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '')}/api/v1/auth/google`}
              className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
              {t('auth.continueWithGoogle')}
            </a>
          ) : (
            <button
              type="button"
              disabled
              title="Google sign-in is coming soon"
              className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 font-medium text-gray-400 dark:text-gray-500 dark:bg-gray-800 cursor-not-allowed opacity-60"
            >
              <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
              {t('auth.continueWithGoogle')}
            </button>
          )}
        </form>
      </div>
    </AuthLayout>
  );
}
