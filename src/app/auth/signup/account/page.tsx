"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ProgressPill from '@/components/auth/ProgressPill';
import AuthLayout from '@/components/auth/AuthLayout';
import PasswordInput from '@/components/auth/PasswordInput';
import { useSignupStore } from '@/lib/store/useSignupStore';
import { validateEmail, validatePassword, validatePhone, validateRequired, validateUsername } from '@/lib/utils/authValidation';
import { useI18n } from '@/lib/i18n';
import { apiPost, apiGet, ApiError, setTokenImmediate } from '@/lib/api/client';
import { SIGNUP_ROLE_TO_BACKEND, mapUser, extractToken, extractRefreshToken, type BackendUser } from '@/lib/api/adapters';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useSettingsStore } from '@/lib/store/useSettingsStore';
import { useFavouritesStore } from '@/lib/store/useFavouritesStore';
import { signInWithGoogle } from '@/lib/services/firebase';

const ROLE_DASHBOARD_MAP: Record<string, string> = {
  'Admin':           '/dashboard/admin',
  'Agent':           '/dashboard/agent',
  'Developer':       '/dashboard/developer',
  'Property Seeker': '/dashboard/seeker',
  'Landlord':        '/dashboard/landlord',
  'Diaspora':        '/dashboard/diaspora',
};

export default function SignupAccount() {
  const router = useRouter();

  // Extract all state and the setter
  const {
    role,
    username: storeUser,
    firstName: storeFirst,
    lastName: storeLast,
    email: storeEmail,
    phone: storePhone,
    password: storePassword,
    setAccountInfo
  } = useSignupStore();
  const { t } = useI18n();

  // Guard: if no role selected, go back to step 1
  useEffect(() => {
    if (!role) {
      router.replace('/auth/signup');
    }
  }, [role, router]);

  // Local state initialized carefully from store (which persists across steps in memory)
  const [username, setUsername] = useState(storeUser || '');
  const [firstName, setFirstName] = useState(storeFirst || '');
  const [lastName, setLastName] = useState(storeLast || '');
  const [email, setEmail] = useState(storeEmail || '');
  const [phone, setPhone] = useState(storePhone || '');
  const [password, setPassword] = useState(storePassword || '');
  const [agree, setAgree] = useState(false);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, setToken } = useAuthStore();

  async function saveAndNext() {
    setErrors({});

    // Validate fields
    const newErrors: Record<string, string> = {};
    if (validateUsername(username)) newErrors.username = validateUsername(username)!;
    if (validateRequired(firstName, 'First Name')) newErrors.firstName = validateRequired(firstName, 'First Name')!;
    if (validateRequired(lastName, 'Last Name')) newErrors.lastName = validateRequired(lastName, 'Last Name')!;
    if (validateEmail(email) || validateRequired(email, 'Email')) newErrors.email = (validateEmail(email) || validateRequired(email, 'Email'))!;
    if (validatePhone(phone) || validateRequired(phone, 'Phone')) newErrors.phone = (validatePhone(phone) || validateRequired(phone, 'Phone'))!;
    if (validatePassword(password)) newErrors.password = validatePassword(password)!;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Persist to Memory Store (NO PLAINTEXT LOCAL STORAGE)
    setAccountInfo({ username, firstName, lastName, email, phone, password });

    const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

    if (USE_API) {
      // ── Live API mode: call register endpoint ───────────────────
      setLoading(true);
      try {
        await apiPost('/api/auth/register', {
          username:    username || undefined,
          firstName,
          lastName,
          email:       email.trim().toLowerCase(),
          phoneNumber: `+234${phone.replace(/^0/, '')}`,
          password,
          roles:       [SIGNUP_ROLE_TO_BACKEND[role] ?? 'PROPERTY_SEEKER'],
        });
        // Backend sends OTP to email — proceed to verify step
        router.push('/auth/signup/verify');
      } catch (err: unknown) {
        let msg = err instanceof Error ? err.message : 'Registration failed. Please try again.';
        if (err instanceof ApiError && err.status === 409) {
          msg = 'An account with this email already exists. Please log in instead.';
        }
        setErrors({ general: msg });
      } finally {
        setLoading(false);
      }
      return;
    }

    // ── Mock mode: skip API, go straight to verify ──────────────
    router.push('/auth/signup/verify');
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    setErrors({});
    try {
      const { backendResponse } = await signInWithGoogle();
      const token        = extractToken(backendResponse);
      const refreshToken = extractRefreshToken(backendResponse);
      if (!token) throw new Error('No access token returned from Google sign-in.');
      setToken(token, refreshToken);
      setTokenImmediate(token);
      const meData   = await apiGet<BackendUser>('/api/auth/me', { 'X-Skip-Auth-Redirect': '1' });
      const authUser = mapUser(meData);
      login(authUser);
      useSettingsStore.getState().setActiveAccount(authUser.id);
      useSettingsStore.getState().fetchAccounts();
      useFavouritesStore.getState().hydrate();
      router.push(ROLE_DASHBOARD_MAP[authUser.role] ?? '/dashboard/seeker');
    } catch (err: unknown) {
      if (err instanceof Error && (
        err.message.includes('popup_closed_by_user') ||
        err.message.includes('cancelled-popup-request')
      )) {
        setGoogleLoading(false);
        return;
      }
      const msg = err instanceof Error ? err.message : 'Google sign-in failed. Please try again.';
      setErrors({ general: msg });
    } finally {
      setGoogleLoading(false);
    }
  }

  // Hide the page if redirecting
  if (!role) return null;

  return (
    <AuthLayout maxWidth={640}>
      <ProgressPill step={2} />

      <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-8 sm:p-10 shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-700 mt-4">
        <h3 className="text-xl font-bold mb-2 dark:text-gray-100">{t('auth.createYourAccount')}</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {t('auth.alreadyHaveAccount')} <Link href="/auth/login" className="text-blue-600 font-medium hover:text-blue-700">{t('auth.loginButton')}</Link>
        </p>

        <div className="flex flex-col gap-4">
          {(errors as Record<string, string>).general && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg text-sm">
              {(errors as Record<string, string>).general}
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('auth.userNameCompany')} <span className="text-red-500">*</span></label>
            <input
              value={username} onChange={e => { setUsername(e.target.value); if (errors.username) setErrors({ ...errors, username: '' }); }}
              placeholder={t('auth.enterUserName')}
              className={`px-3 py-2.5 rounded-lg border ${errors.username ? 'border-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'} outline-none transition-all dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500`}
            />
            {errors.username && <span className="text-xs text-red-500">{errors.username}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('auth.firstName')} <span className="text-red-500">*</span></label>
              <input
                value={firstName} onChange={e => { setFirstName(e.target.value); if (errors.firstName) setErrors({ ...errors, firstName: '' }); }}
                placeholder={t('auth.enterFirstName')}
                className={`px-3 py-2.5 rounded-lg border ${errors.firstName ? 'border-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'} outline-none transition-all dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500`}
              />
              {errors.firstName && <span className="text-xs text-red-500">{errors.firstName}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('auth.lastName')} <span className="text-red-500">*</span></label>
              <input
                value={lastName} onChange={e => { setLastName(e.target.value); if (errors.lastName) setErrors({ ...errors, lastName: '' }); }}
                placeholder={t('auth.enterLastName')}
                className={`px-3 py-2.5 rounded-lg border ${errors.lastName ? 'border-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'} outline-none transition-all dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500`}
              />
              {errors.lastName && <span className="text-xs text-red-500">{errors.lastName}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('auth.emailAddress')} <span className="text-red-500">*</span></label>
            <input
              value={email} onChange={e => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: '' }); }}
              placeholder={t('auth.enterEmail')}
              className={`px-3 py-2.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'} outline-none transition-all dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500`}
            />
            {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('auth.phoneNumber')} <span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm font-medium leading-none">+234</span>
              <input
                value={phone} onChange={e => { setPhone(e.target.value); if (errors.phone) setErrors({ ...errors, phone: '' }); }}
                placeholder={t('auth.enterPhone')}
                className={`w-full pl-12 pr-3 py-2.5 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'} outline-none transition-all dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500`}
              />
            </div>
            {errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
          </div>

          <div className="flex flex-col gap-1 mt--1" style={{ marginTop: '-4px' }}>
            <PasswordInput
              label={t('auth.createPassword')}
              value={password}
              onChange={(v) => { setPassword(v); if (errors.password) setErrors({ ...errors, password: '' }); }}
              placeholder={t('auth.passwordMinChars')}
              error={errors.password}
              showConditions
              required
            />
          </div>

          <div className="flex items-start gap-3 mt-2">
            <input
              id="agree"
              type="checkbox"
              checked={agree}
              onChange={e => setAgree(e.target.checked)}
              className="mt-1 flex-shrink-0"
            />
            <label htmlFor="agree" className="text-sm text-gray-500 dark:text-gray-400 leading-tight">
              {t('auth.agreeToTerms')} <a href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">{t('auth.termsOfService')}</a> {t('auth.and')} <a href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">{t('auth.privacyPolicy')}</a>
            </label>
          </div>

          <button
            onClick={saveAndNext}
            disabled={!agree || loading}
            className={`w-full py-3 mt-4 rounded-lg font-bold text-white transition-all cursor-pointer ${agree && !loading ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'
              } ${loading ? 'opacity-80' : ''}`}
          >
            {loading ? 'Creating account…' : t('common.proceed')}
          </button>

          <div className="flex items-center gap-4 my-2">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <div className="text-gray-400 text-sm">{t('auth.orContinueWith')}</div>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          <button
            type="button"
            onClick={process.env.NEXT_PUBLIC_USE_API === 'true' ? handleGoogleSignIn : undefined}
            disabled={googleLoading || loading || process.env.NEXT_PUBLIC_USE_API !== 'true'}
            className={`w-full flex items-center justify-center gap-3 py-2.5 rounded-lg border font-medium transition-colors
              ${process.env.NEXT_PUBLIC_USE_API === 'true'
                ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60'
              }`}
          >
            {googleLoading ? (
              <span className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
            )}
            {googleLoading ? 'Signing in…' : t('auth.continueWithGoogle')}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
