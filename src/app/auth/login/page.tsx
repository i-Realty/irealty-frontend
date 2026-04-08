"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import PasswordInput from '@/components/auth/PasswordInput';
import { useAuthStore, AuthUser } from '@/lib/store/useAuthStore';
import { validateEmail, validateRequired, validatePassword } from '@/lib/utils/authValidation';
import { useI18n } from '@/lib/i18n';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore(state => state.login);
  const { t } = useI18n();
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
    const pwdErr = validatePassword(password);

    if (emailErr || pwdErr) {
      setErrors({ email: emailErr, password: pwdErr });
      return;
    }

    setLoading(true);

    // Simulate network delay — replace setTimeout body with real API call
    setTimeout(() => {
      const mockUser: AuthUser = {
        id: 'agent-123',
        name: 'Waden Warren',
        email,
        role: 'Agent',
        displayName: 'Waden Warren',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
        kycStatus: 'unverified',
      };
      login(mockUser);
      // Honour redirect param if present, otherwise go to agent dashboard
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get('redirect') || '/dashboard/agent';
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

          <button
            type="button"
            disabled
            title="Google sign-in is coming soon"
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 font-medium text-gray-400 dark:text-gray-500 dark:bg-gray-800 cursor-not-allowed opacity-60"
          >
            <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
            {t('auth.continueWithGoogle')}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
