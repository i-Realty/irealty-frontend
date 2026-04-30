"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import OtpInput from '@/components/auth/OtpInput';
import { validateOtp } from '@/lib/utils/authValidation';
import { useI18n } from '@/lib/i18n';
import { apiPost } from '@/lib/api/client';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

function ResetVerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get('email') || '';

  const { t } = useI18n();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);

  async function handleResend() {
    if (resendCountdown > 0) return;
    setResendCountdown(30);
    const interval = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    if (USE_API) {
      try {
        await apiPost('/api/auth/forgot-password', { email });
      } catch {
        // Silent — countdown still shown
      }
    }
  }

  async function handleVerify() {
    const otpErr = validateOtp(code);
    if (otpErr) { setError(otpErr); return; }
    setError('');
    setLoading(true);
    try {
      if (USE_API) {
        // Verify the OTP code before proceeding to new password page
        await apiPost('/api/auth/verify-reset-otp', { email, code });
      } else {
        await new Promise(r => setTimeout(r, 600));
      }
      router.push(`/auth/reset/success?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid or expired code. Please try again.');
      setLoading(false);
    }
  }

  // Guard: require email in URL param
  if (!email) {
    if (typeof window !== 'undefined') {
      router.replace('/auth/reset');
    }
    return null;
  }

  return (
    <AuthLayout maxWidth={500}>
      <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-8 sm:p-10 shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-700 mt-4 text-center">
        <h3 className="text-2xl font-bold mb-2 dark:text-gray-100">{t('auth.verifyEmail')}</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed max-w-sm mx-auto">
          {t('auth.verifyEmailDesc')} <br/>
          <strong className="text-gray-900 dark:text-gray-100">{email}</strong><br/>
          {t('auth.enterCode')}
        </p>

        <div className="flex flex-col items-center mb-8">
          <OtpInput length={6} value={code} onChange={(val) => { setCode(val); if (error) setError(''); }} />
          {error && <p className="text-red-500 text-xs mt-3">{error}</p>}
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          {t('auth.resendCode')}{' '}
          {resendCountdown > 0 ? (
            <span className="text-gray-400 font-medium">Resend in {resendCountdown}s</span>
          ) : (
            <button type="button" onClick={handleResend} className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer border-none bg-transparent">
              {t('auth.resendCode')}
            </button>
          )}
        </div>

        <button 
          onClick={handleVerify} 
          disabled={code.length < 6 || loading}
          className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
            code.length === 6 && !loading ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' : 'bg-blue-300 cursor-not-allowed'
          } ${loading ? 'opacity-80' : ''}`}
        >
          {loading ? t('auth.verifying') : t('auth.verify')}
        </button>
      </div>
    </AuthLayout>
  );
}

export default function ResetVerify() {
  return (
    <Suspense>
      <ResetVerifyContent />
    </Suspense>
  );
}
