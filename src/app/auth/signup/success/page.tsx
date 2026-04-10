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

    // Map signup store role slug to AuthUser role type
    const roleMap: Record<string, AuthUser['role']> = {
      'real-estate-agent': 'Agent',
      'property-seeker': 'Property Seeker',
      'developers': 'Developer',
      'property-owner': 'Landlord',
      'diaspora-investors': 'Diaspora',
    };
    const mappedRole: AuthUser['role'] = roleMap[signupStore.role] ?? 'Agent';

    // Persist to actual auth session
    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      name: `${signupStore.firstName} ${signupStore.lastName}`.trim() || signupStore.username || 'Demo User',
      email: signupStore.email,
      role: mappedRole,
      displayName: `${signupStore.firstName} ${signupStore.lastName}`.trim() || signupStore.username || 'Demo User',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
      kycStatus: 'unverified',
      accountStatus: 'active',
    };
    login(newUser);

  }, [signupStore.email, signupStore.firstName, signupStore.lastName, signupStore.username, login, router]);

  function handleContinue() {
    setRedirecting(true);
    // Cleanup the signup wizard explicitly
    signupStore.reset();
    
    setTimeout(() => {
      router.push('/');
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
          Your i-Realty account has been successfully created. Welcome aboard, {signupStore.firstName || 'User'}!
        </p>

        <button 
          onClick={handleContinue} 
          disabled={redirecting}
          className={`w-full py-3 rounded-lg font-bold text-white transition-all bg-blue-600 hover:bg-blue-700 cursor-pointer ${redirecting ? 'opacity-80' : ''}`}
        >
          {redirecting ? 'Taking you home...' : 'Go to Homepage'}
        </button>
      </div>
    </AuthLayout>
  );
}
