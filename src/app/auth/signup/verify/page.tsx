"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import ProgressPill from '@/components/auth/ProgressPill';
import OtpInput from '@/components/auth/OtpInput';
import { useSignupStore } from '@/lib/store/useSignupStore';
import { validateOtp } from '@/lib/utils/authValidation';
import { useI18n } from '@/lib/i18n';

export default function VerifyCode() {
  const router = useRouter();
  const { email } = useSignupStore();
  const { t } = useI18n();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);

  function handleResend() {
    if (resendCountdown > 0) return;
    setResendCountdown(30);
    const interval = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    // TODO: replace with real API call to resend OTP
  }

  // Guard: if no email in store, they skipped steps
  useEffect(() => {
    if (!email) {
      router.replace('/auth/signup');
    }
  }, [email, router]);

  function verifyBase() {
    const otpErr = validateOtp(code);
    if (otpErr) { setError(otpErr); return; }
    setError('');
    setLoading(true);

    // Simulate API validation
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
