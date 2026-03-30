"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import AuthLayout from '@/components/auth/AuthLayout';
import PasswordInput from '@/components/auth/PasswordInput';
import { validatePassword } from '@/lib/utils/authValidation';

export default function ResetSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get('email') || '';
  const code = searchParams?.get('code') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Guard: require email & code
  if (!email || !code) {
    if (typeof window !== 'undefined') {
      router.replace('/auth/reset');
    }
    return null;
  }

  function handleSavePassword(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const pwdErr = validatePassword(password);
    if (pwdErr) {
      setError(pwdErr);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    // Simulate saving new password to backend
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 800);
  }

  // IF SUCCESS: Show the final success confirmation
  if (success) {
    return (
      <AuthLayout maxWidth={500}>
        <div className="bg-white rounded-xl p-10 shadow-sm border border-gray-100 flex flex-col items-center mt-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <Image src="/icons/successicon.svg" alt="Success" width={32} height={32} />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-2">Password Reset!</h3>
          <p className="text-gray-500 text-center mb-8 px-4">
            Your password has been successfully reset. You can now login using your new password.
          </p>

          <button 
            onClick={() => router.push('/auth/login')} 
            className="w-full py-3 rounded-lg font-bold text-white transition-all bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            Go to Login
          </button>
        </div>
      </AuthLayout>
    );
  }

  // DEFAULT: Show the New Password form
  const canSubmit = password.length > 0 && confirmPassword.length > 0 && !loading;

  return (
    <AuthLayout maxWidth={500}>
      <div className="bg-white rounded-xl p-8 sm:p-10 shadow-sm border border-gray-100 mt-4">
        <h2 className="text-2xl font-bold mb-2">Create New Password</h2>
        <p className="text-gray-500 mb-6 leading-relaxed">
          Please enter a new password for <strong className="text-gray-900">{email}</strong>
        </p>

        <form onSubmit={handleSavePassword} className="flex flex-col gap-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm mb-2">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1 -mt-2">
            <PasswordInput
              label="New Password"
              value={password}
              onChange={(v) => { setPassword(v); if (error) setError(''); }}
              placeholder="Min. 8 characters"
            />
          </div>

          <div className="flex flex-col gap-1">
            <PasswordInput
              label="Confirm New Password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(v) => { setConfirmPassword(v); if (error) setError(''); }}
              placeholder="Confirm password"
            />
          </div>

          <button 
            type="submit" 
            disabled={!canSubmit}
            className={`w-full py-3 mt-4 rounded-lg font-bold text-white transition-all ${
              canSubmit ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' : 'bg-blue-300 cursor-not-allowed'
            } ${loading ? 'opacity-80' : ''}`}
          >
            {loading ? 'Saving...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
