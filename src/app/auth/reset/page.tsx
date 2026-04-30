"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import { validateEmail, validateRequired } from '@/lib/utils/authValidation';
import { useI18n } from '@/lib/i18n';
import { apiPost, ApiError } from '@/lib/api/client';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

export default function ResetPassword() {
  const router = useRouter();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = email.trim() !== '' && !loading;

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const emailErr = validateEmail(email) || validateRequired(email, 'Email address');
    if (emailErr) { setError(emailErr); return; }

    setLoading(true);
    try {
      if (USE_API) {
        await apiPost('/api/auth/forgot-password', { email: email.trim().toLowerCase() });
      } else {
        await new Promise(r => setTimeout(r, 600));
      }
      router.push(`/auth/reset/verify?email=${encodeURIComponent(email.trim().toLowerCase())}`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setError('No account found with this email address.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to send reset code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout maxWidth={500}>
      <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-8 sm:p-10 shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-700 mt-4">
        <h2 className="text-2xl font-bold mb-2 dark:text-gray-100">{t('auth.resetPasswordTitle')}</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
          {t('auth.resetPasswordDesc')}
        </p>

        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('auth.emailAddress')}</label>
            <input
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
              placeholder={t('auth.enterEmail')}
              className={`px-3 py-2.5 rounded-lg border ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'} outline-none transition-all dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500`} 
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
            {loading ? t('auth.sendingCode') : t('common.confirm')}
          </button>

          <div className="text-center mt-2">
            <Link href="/auth/login" className="text-sm text-blue-600 font-medium hover:text-blue-700">
              {t('auth.backToLogin')}
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
