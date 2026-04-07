"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ProgressPill from '@/components/auth/ProgressPill';
import AuthLayout from '@/components/auth/AuthLayout';
import PasswordInput from '@/components/auth/PasswordInput';
import { useSignupStore } from '@/lib/store/useSignupStore';
import { validateEmail, validatePassword, validatePhone, validateRequired, validateUsername } from '@/lib/utils/authValidation';

export default function SignupAccount() {
  const router = useRouter();
  
  // Extract all state and the setter
  const { 
    role, 
    username: storeUser, 
    firstName: storeFirst, 
    lastName: storeLast, 
    email: storeEmail, 
    phone: storePhone,
    password: storePassword,
    setAccountInfo
  } = useSignupStore();

  // Guard: if no role selected, go back to step 1
  useEffect(() => {
    if (!role) {
      router.replace('/auth/signup');
    }
  }, [role, router]);

  // Local state initialized carefully from store (which persists across steps in memory)
  const [username, setUsername] = useState(storeUser || '');
  const [firstName, setFirstName] = useState(storeFirst || '');
  const [lastName, setLastName] = useState(storeLast || '');
  const [email, setEmail] = useState(storeEmail || '');
  const [phone, setPhone] = useState(storePhone || '');
  const [password, setPassword] = useState(storePassword || '');
  const [agree, setAgree] = useState(false);
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  function saveAndNext() {
    setErrors({});

    // Validate fields
    const newErrors: Record<string, string> = {};
    if (validateUsername(username)) newErrors.username = validateUsername(username);
    if (validateRequired(firstName, 'First Name')) newErrors.firstName = validateRequired(firstName, 'First Name');
    if (validateRequired(lastName, 'Last Name')) newErrors.lastName = validateRequired(lastName, 'Last Name');
    if (validateEmail(email) || validateRequired(email, 'Email')) newErrors.email = validateEmail(email) || validateRequired(email, 'Email');
    if (validatePhone(phone) || validateRequired(phone, 'Phone')) newErrors.phone = validatePhone(phone) || validateRequired(phone, 'Phone');
    if (validatePassword(password)) newErrors.password = validatePassword(password);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop if errors
    }

    // Persist to Memory Store (NO PLAINTEXT LOCAL STORAGE)
    setAccountInfo({ username, firstName, lastName, email, phone, password });
    
    // Proceed
    router.push('/auth/signup/verify');
  }

  // Hide the page if redirecting
  if (!role) return null;

  return (
    <AuthLayout maxWidth={640}>
      <ProgressPill step={2} />

      <div className="bg-white rounded-xl p-8 sm:p-10 shadow-sm border border-gray-100 mt-4">
        <h3 className="text-xl font-bold mb-2">Create Your Account</h3>
        <p className="text-gray-500 mb-6">
          Already have an account? <Link href="/auth/login" className="text-blue-600 font-medium hover:text-blue-700">Login</Link>
        </p>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">User Name/Company Name</label>
            <input 
              value={username} onChange={e => { setUsername(e.target.value); if(errors.username) setErrors({...errors, username:''}); }} 
              placeholder="Enter User Name" 
              className={`px-3 py-2.5 rounded-lg border ${errors.username ? 'border-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'} outline-none transition-all`} 
            />
            {errors.username && <span className="text-xs text-red-500">{errors.username}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <input 
                value={firstName} onChange={e => { setFirstName(e.target.value); if(errors.firstName) setErrors({...errors, firstName:''}); }} 
                placeholder="Enter First Name" 
                className={`px-3 py-2.5 rounded-lg border ${errors.firstName ? 'border-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'} outline-none transition-all`} 
              />
              {errors.firstName && <span className="text-xs text-red-500">{errors.firstName}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <input 
                value={lastName} onChange={e => { setLastName(e.target.value); if(errors.lastName) setErrors({...errors, lastName:''}); }} 
                placeholder="Enter Last Name" 
                className={`px-3 py-2.5 rounded-lg border ${errors.lastName ? 'border-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'} outline-none transition-all`} 
              />
              {errors.lastName && <span className="text-xs text-red-500">{errors.lastName}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Email address</label>
            <input 
              value={email} onChange={e => { setEmail(e.target.value); if(errors.email) setErrors({...errors, email:''}); }} 
              placeholder="Enter Email Address" 
              className={`px-3 py-2.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'} outline-none transition-all`} 
            />
            {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Phone Number</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium leading-none">+234</span>
              <input 
                value={phone} onChange={e => { setPhone(e.target.value); if(errors.phone) setErrors({...errors, phone:''}); }} 
                placeholder="Enter Phone Number" 
                className={`w-full pl-12 pr-3 py-2.5 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'} outline-none transition-all`} 
              />
            </div>
            {errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
          </div>

          <div className="flex flex-col gap-1 mt--1" style={{ marginTop: '-4px' }}>
            <PasswordInput
              label="Create Password"
              value={password}
              onChange={(v) => { setPassword(v); if(errors.password) setErrors({...errors, password:''}); }}
              placeholder="Password (Min. of 8 characters)"
              error={errors.password}
            />
          </div>

          <div className="flex items-start gap-3 mt-2">
            <input 
              id="agree" 
              type="checkbox" 
              checked={agree} 
              onChange={e => setAgree(e.target.checked)} 
              className="mt-1 flex-shrink-0"
            />
            <label htmlFor="agree" className="text-sm text-gray-500 leading-tight">
              I agree to i-Realty&apos;s <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Privacy Policy</a>
            </label>
          </div>

          <button 
            onClick={saveAndNext} 
            disabled={!agree} 
            className={`w-full py-3 mt-4 rounded-lg font-bold text-white transition-all cursor-pointer ${
              agree ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'
            }`}
          >
            Proceed
          </button>

          <div className="flex items-center gap-4 my-2">
            <div className="flex-1 h-px bg-gray-200" />
            <div className="text-gray-400 text-sm">Or Continue With</div>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button 
            type="button"
            onClick={() => alert("Google OAuth Coming Soon")}
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors font-medium text-gray-700 cursor-pointer"
          >
            <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
            Continue with Google
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
