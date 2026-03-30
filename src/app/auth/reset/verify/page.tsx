"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import OtpInput from '@/components/auth/OtpInput';

function ResetVerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get('email') || '';

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  function handleVerify() {
    if (code.length < 6) return;
    setLoading(true);

    // Simulate validation
    setTimeout(() => {
      // Pass the email & code to the success step for creating the new password
      router.push(`/auth/reset/success?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`);
    }, 600);
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
      <div className="bg-white rounded-xl p-8 sm:p-10 shadow-sm border border-gray-100 mt-4 text-center">
        <h3 className="text-2xl font-bold mb-2">Verify Email Code</h3>
        <p className="text-gray-500 mb-8 leading-relaxed max-w-sm mx-auto">
          We sent a 6-digit code to <br/>
          <strong className="text-gray-900">{email}</strong><br/>
          Please enter it below to rest your password.
        </p>

        <div className="flex justify-center mb-8">
          <OtpInput length={6} value={code} onChange={setCode} />
        </div>

        <div className="text-sm text-gray-500 mb-8">
          Didn&apos;t receive a code?{' '}
          <button type="button" onClick={() => alert("Code resent!")} className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer border-none bg-transparent">
            Resend
          </button>
        </div>

        <button 
          onClick={handleVerify} 
          disabled={code.length < 6 || loading}
          className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
            code.length === 6 && !loading ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' : 'bg-blue-300 cursor-not-allowed'
          } ${loading ? 'opacity-80' : ''}`}
        >
          {loading ? 'Verifying...' : 'Verify Code'}
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
