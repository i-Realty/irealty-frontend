"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AuthLayout from '@/components/auth/AuthLayout';
import { useSignupStore } from '@/lib/store/useSignupStore';
import { useAuthStore } from '@/lib/store/useAuthStore';

const ROLE_DASHBOARD_MAP: Record<string, string> = {
  'Admin':           '/dashboard/admin',
  'Agent':           '/dashboard/agent',
  'Developer':       '/dashboard/developer',
  'Property Seeker': '/dashboard/seeker',
  'Landlord':        '/dashboard/landlord',
  'Diaspora':        '/dashboard/diaspora',
};

export default function SignupSuccess() {
  const router = useRouter();
  const signupStore = useSignupStore();
  const { isLoggedIn, user } = useAuthStore();

  const [redirecting, setRedirecting] = useState(false);

  // The verify step already called login() + setToken() when USE_API=true,
  // so the user should already be authenticated at this point. No need to
  // fabricate a user or call login() again here.

  function handleContinue() {
    setRedirecting(true);
    signupStore.reset();

    const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

    if (USE_API && isLoggedIn && user) {
      // Navigate straight to the user's role-specific dashboard
      const dest = ROLE_DASHBOARD_MAP[user.role] ?? '/dashboard/seeker';
      router.push(dest);
    } else {
      // Mock mode or not logged in — send to login
      router.push('/auth/login');
    }
  }

  return (
    <AuthLayout maxWidth={500}>
      <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-10 shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-700 flex flex-col items-center">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
          <Image src="/icons/successicon.svg" alt="Success" width={32} height={32} />
        </div>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Profile Created!</h3>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-8 px-4">
          {isLoggedIn && user
            ? `Your i-Realty account has been successfully created. Welcome aboard, ${user.name || signupStore.firstName || 'User'}!`
            : `Account registration noted. Please log in with your demo credentials to access the dashboard.`
          }
        </p>

        <button
          onClick={handleContinue}
          disabled={redirecting}
          className={`w-full py-3 rounded-lg font-bold text-white transition-all bg-blue-600 hover:bg-blue-700 cursor-pointer ${redirecting ? 'opacity-80' : ''}`}
        >
          {redirecting ? 'Redirecting...' : (isLoggedIn ? 'Go to Dashboard' : 'Go to Login')}
        </button>
      </div>
    </AuthLayout>
  );
}
