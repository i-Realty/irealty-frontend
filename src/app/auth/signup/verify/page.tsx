"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import ProgressPill from '@/components/auth/ProgressPill';
import OtpInput from '@/components/auth/OtpInput';
import { useSignupStore } from '@/lib/store/useSignupStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useSettingsStore } from '@/lib/store/useSettingsStore';
import { validateOtp } from '@/lib/utils/authValidation';
import { useI18n } from '@/lib/i18n';
import { apiPost, apiGet, setTokenImmediate } from '@/lib/api/client';
import { mapUser, extractToken, extractRefreshToken, type BackendAuthResponse, type BackendUser } from '@/lib/api/adapters';

function VerifyCodeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { email: storeEmail } = useSignupStore();
  // Support arriving here from the login 409 redirect (?email=...)
  const email = storeEmail || searchParams?.get('email') || '';
  const { login, setToken } = useAuthStore();
  const { t } = useI18n();


  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);

  function startResendCountdown() {
    setResendCountdown(30);
    const interval = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  }

  async function handleResend() {
    if (resendCountdown > 0 || resending) return;
    startResendCountdown();

    const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';
    if (!USE_API) return; // mock mode — countdown is the only feedback needed

    setResending(true);
    try {
      await apiPost('/api/auth/resend-verification', { email });
    } catch {
      // Silently fail — user can retry after countdown
    } finally {
      setResending(false);
    }
  }

  // Guard: if no email anywhere, they skipped steps
  useEffect(() => {
    if (!email) {
      router.replace('/auth/signup');
    }
  }, [email, router]);

  async function verifyBase() {
    const otpErr = validateOtp(code);
    if (otpErr) { setError(otpErr); return; }
    setError('');
    setLoading(true);

    const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

    if (USE_API) {
      // ── Live API mode ────────────────────────────────────────────
      try {
        const data         = await apiPost<BackendAuthResponse>('/api/auth/verify-email', { email, code });
        const token        = extractToken(data);
        const refreshToken = extractRefreshToken(data);

        // If backend issues a token on verification, log the user in immediately
        if (token) {
          setToken(token, refreshToken);
          setTokenImmediate(token);
          const meData   = await apiGet<BackendUser>('/api/auth/me', { 'X-Skip-Auth-Redirect': '1' });
          const authUser = mapUser(meData);
          login(authUser);
          useSettingsStore.getState().setActiveAccount(authUser.id);
          useSettingsStore.getState().fetchAccounts(); // non-blocking
        }
        router.push('/auth/signup/success');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Verification failed. Please try again.';
        setError(msg);
        setLoading(false);
      }
      return;
    }

    // ── Mock mode ────────────────────────────────────────────────
    setTimeout(() => {
      router.push('/auth/signup/success');
    }, 1000);
  }

  // Prevent render flicker while redirecting
  if (!email) return null;

  return (
    <AuthLayout maxWidth={640}>
      <ProgressPill step={3} />

      <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-8 sm:p-10 shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-700 mt-4 text-center">
        <h3 className="text-2xl font-bold mb-2 dark:text-gray-100">{t('auth.verifyEmail')}</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
          {t('auth.verifyEmailDesc')} <br/>
          <strong className="text-gray-900 dark:text-gray-100">{email}</strong><br/>
          {t('auth.enterCode')}
        </p>

        <div className="flex flex-col items-center mb-8">
          <OtpInput
            length={6}
            value={code}
            onChange={(val) => {
              setCode(val);
              if (error) setError('');
            }}
          />
          {error && <p className="text-red-500 text-xs mt-3">{error}</p>}
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          {t('auth.resendCode')}{' '}
          {resendCountdown > 0 ? (
            <span className="text-gray-400 font-medium">Resend in {resendCountdown}s</span>
          ) : (
            <button type="button" onClick={handleResend} className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer bg-transparent border-none p-0 inline">
              {t('auth.resendCode')}
            </button>
          )}
        </div>

        <button 
          onClick={verifyBase} 
          disabled={code.length < 6 || loading}
          className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
            code.length === 6 && !loading ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' : 'bg-blue-300 cursor-not-allowed'
          } ${loading ? 'opacity-80' : ''}`}
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>
      </div>
    </AuthLayout>
  );
}

export default function VerifyCode() {
  return (
    <Suspense>
      <VerifyCodeContent />
    </Suspense>
  );
}
