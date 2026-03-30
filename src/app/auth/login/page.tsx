"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import PasswordInput from '@/components/auth/PasswordInput';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { validateEmail, validateRequired } from '@/lib/utils/authValidation';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore(state => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Errors state
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const canSubmit = email.trim() !== '' && password.trim() !== '' && !loading;

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    // Validate
    const emailErr = validateEmail(email) || validateRequired(email, 'Email');
    const pwdErr = validateRequired(password, 'Password');

    if (emailErr || pwdErr) {
      setErrors({ email: emailErr, password: pwdErr });
      return;
    }

    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      login({ name: 'Demo User', email });
      router.push('/');
    }, 500);
  }

  return (
    <AuthLayout maxWidth={500}>
      <div className="bg-white rounded-xl p-8 sm:p-10 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
        <p className="text-gray-500 mb-6">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
            Sign up
          </Link>
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {errors.general && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm mb-2">{errors.general}</div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Email address</label>
            <input
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({...errors, email: ''}); }}
              placeholder="Enter Email Address"
              className={`px-3 py-2.5 rounded-lg border ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200 focus:border-blue-500'} focus:outline-none focus:ring-2 transition-all`}
            />
            {errors.email && <span className="text-xs text-red-500 mt-1">{errors.email}</span>}
          </div>

          <div className="flex flex-col gap-1" style={{ marginTop: '-4px' }}>
            <PasswordInput
              label="Password"
              value={password}
              onChange={(v) => { setPassword(v); if (errors.password) setErrors({...errors, password: ''}); }}
              placeholder="Enter Password"
              error={errors.password}
            />
          </div>

          <div className="flex justify-start">
            <Link href="/auth/reset" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Forgot Password? Reset it here
            </Link>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full py-3 mt-4 rounded-lg font-bold text-white transition-all
              ${canSubmit ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'}
              ${loading ? 'opacity-80' : ''}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="flex items-center gap-4 my-2">
            <div className="flex-1 h-px bg-gray-200" />
            <div className="text-gray-400 text-sm">Or Continue With</div>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button
            type="button"
            onClick={() => alert("Google OAuth Coming Soon")}
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors font-medium text-gray-700"
          >
            <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
            Continue with Google
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
