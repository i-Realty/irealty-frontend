"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import { validateEmail, validateRequired } from '@/lib/utils/authValidation';

export default function ResetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = email.trim() !== '' && !loading;

  function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const emailErr = validateEmail(email) || validateRequired(email, 'Email address');
    if (emailErr) {
      setError(emailErr);
      return;
    }

    setLoading(true);

    // Simulate API request
    setTimeout(() => {
      // Pass the email to the next view so we don't need another store for this 3-step feature
      router.push(`/auth/reset/verify?email=${encodeURIComponent(email)}`);
    }, 600);
  }

  return (
    <AuthLayout maxWidth={500}>
      <div className="bg-white rounded-xl p-8 sm:p-10 shadow-sm border border-gray-100 mt-4">
        <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
        <p className="text-gray-500 mb-6 leading-relaxed">
          Please enter your email to receive a password reset code.
        </p>

        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Email address</label>
            <input 
              value={email} 
              onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }} 
              placeholder="Enter Email Address"
              className={`px-3 py-2.5 rounded-lg border ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'} outline-none transition-all`} 
            />
            {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
          </div>

          <button 
            type="submit" 
            disabled={!canSubmit}
            className={`w-full py-3 mt-4 rounded-lg font-bold text-white transition-all ${
              canSubmit ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' : 'bg-blue-300 cursor-not-allowed'
            } ${loading ? 'opacity-80' : ''}`}
          >
            {loading ? 'Sending code...' : 'Confirm'}
          </button>

          <div className="text-center mt-2">
            <Link href="/auth/login" className="text-sm text-blue-600 font-medium hover:text-blue-700">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
