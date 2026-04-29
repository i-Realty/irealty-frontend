"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AuthLayout from '@/components/auth/AuthLayout';
import { useSignupStore } from '@/lib/store/useSignupStore';
import { useAuthStore, AuthUser } from '@/lib/store/useAuthStore';

export default function SignupSuccess() {
  const router = useRouter();
  
  // Extract all final state to commit to Auth Store
  const signupStore = useSignupStore();
  const { login } = useAuthStore();
  
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // If we land here but have no email, something is wrong
    if (!signupStore.email) {
      router.replace('/auth/signup');
      return;
    }

    const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

    if (USE_API) {
      // When backend is integrated, the signup API will handle session creation.
      // Map signup store role slug to AuthUser role type
      const roleMap: Record<string, AuthUser['role']> = {
        'real-estate-agent': 'Agent',
        'property-seeker': 'Property Seeker',
        'developers': 'Developer',
        'property-owner': 'Landlord',
        'diaspora-investors': 'Diaspora',
      };
      const mappedRole: AuthUser['role'] = roleMap[signupStore.role] ?? 'Agent';

      const newUser: AuthUser = {
        id: `user-${Date.now()}`,
        name: `${signupStore.firstName} ${signupStore.lastName}`.trim() || signupStore.username || 'Demo User',
        email: signupStore.email,
        role: mappedRole,
        displayName: `${signupStore.firstName} ${signupStore.lastName}`.trim() || signupStore.username || 'Demo User',
        avatarUrl: '/images/demo-avatar.jpg',
        kycStatus: 'unverified',
        accountStatus: 'active',
      };
      login(newUser);
    }
    // In mock mode: do NOT create a session — user must log in with demo credentials

  }, [signupStore.email, signupStore.firstName, signupStore.lastName, signupStore.username, signupStore.role, login, router]);

  function handleContinue() {
    setRedirecting(true);
    signupStore.reset();

    const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';
    setTimeout(() => {
      // In mock mode, direct to login so user uses demo credentials
      router.push(USE_API ? '/' : '/auth/login');
    }, 500);
  }

  // Prevent flash
  if (!signupStore.email) return null;

  return (
    <AuthLayout maxWidth={500}>
      <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-10 shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-700 flex flex-col items-center">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
          <Image src="/icons/successicon.svg" alt="Success" width={32} height={32} />
        </div>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Profile Created!</h3>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-8 px-4">
          {process.env.NEXT_PUBLIC_USE_API === 'true'
            ? `Your i-Realty account has been successfully created. Welcome aboard, ${signupStore.firstName || 'User'}!`
            : `Account registration noted. Please log in with your demo credentials to access the dashboard.`
          }
        </p>

        <button
          onClick={handleContinue}
          disabled={redirecting}
          className={`w-full py-3 rounded-lg font-bold text-white transition-all bg-blue-600 hover:bg-blue-700 cursor-pointer ${redirecting ? 'opacity-80' : ''}`}
        >
          {redirecting ? 'Redirecting...' : (process.env.NEXT_PUBLIC_USE_API === 'true' ? 'Go to Homepage' : 'Go to Login')}
        </button>
      </div>
    </AuthLayout>
  );
}
