"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import ProgressPill from '@/components/auth/ProgressPill';
import OtpInput from '@/components/auth/OtpInput';
import { useSignupStore } from '@/lib/store/useSignupStore';
import { validateOtp } from '@/lib/utils/authValidation';

export default function VerifyCode() {
  const router = useRouter();
  const { email } = useSignupStore();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

      <div className="bg-white rounded-xl p-8 sm:p-10 shadow-sm border border-gray-100 mt-4 text-center">
        <h3 className="text-2xl font-bold mb-2">Verify Your Account</h3>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          We sent a 6-digit code to <br/>
          <strong className="text-gray-900">{email}</strong><br/>
          Please enter it below.
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

        <div className="text-sm text-gray-500 mb-8">
          Didn&apos;t receive a code?{' '}
          <button type="button" onClick={() => alert("Verification code resent")} className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer bg-transparent border-none p-0 inline">
            Resend
          </button>
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
