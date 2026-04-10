"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import ProgressPill from '@/components/auth/ProgressPill';
import AuthLayout from '@/components/auth/AuthLayout';
import { useSignupStore } from '@/lib/store/useSignupStore';
import { useI18n } from '@/lib/i18n';

const VALID_ROLES = ['property-seeker', 'property-owner', 'real-estate-agent', 'diaspora-investors', 'developers'];

function SignupStepOneContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { role, setRole } = useSignupStore();
  const { t } = useI18n();

  // Pre-select role from URL query param (e.g. ?role=property-owner)
  useEffect(() => {
    const paramRole = searchParams?.get('role');
    if (paramRole && VALID_ROLES.includes(paramRole) && !role) {
      setRole(paramRole);
    }
  }, [searchParams, role, setRole]);

  const options = [
    { id: "property-seeker", title: t('auth.propertySeeker'), subtitle: t('auth.buyOrRent'), icon: "/icons/seekericon.svg" },
    { id: "property-owner", title: t('auth.propertyOwner'), subtitle: t('auth.sellOrRentOut'), icon: "/icons/ownericon.svg" },
    { id: "real-estate-agent", title: t('auth.realEstateAgent'), subtitle: t('auth.listAndManage'), icon: "/icons/agenticon.svg" },
    { id: "diaspora-investors", title: t('auth.diasporaInvestors'), subtitle: t('auth.investFromAbroad'), icon: "/icons/diasporaicon.svg" },
  ];

  return (
    <AuthLayout maxWidth={640}>
      <ProgressPill step={1} />

      <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-8 sm:p-10 shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-700 mt-4">
        <h2 className="text-2xl font-bold mb-2 dark:text-gray-100">{t('auth.howWillYouUse')}</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{t('auth.selectRole')}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {options.map(opt => (
            <button
              key={opt.id}
              onClick={() => setRole(opt.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all cursor-pointer ${
                role === opt.id
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${role === opt.id ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}`}>
                  <Image src={opt.icon} alt={opt.title} width={22} height={22} />
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900 dark:text-gray-100">{opt.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{opt.subtitle}</div>
                </div>
              </div>
            </button>
          ))}

          {/* Developers full width */}
          <button
            onClick={() => setRole('developers')}
            className={`sm:col-span-2 flex flex-col items-center gap-3 p-5 rounded-xl border transition-all cursor-pointer ${
              role === 'developers'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${role === 'developers' ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}`}>
              <Image src="/icons/developericon.svg" alt="Developers" width={22} height={22} />
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900 dark:text-gray-100">{t('auth.developersRole')}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('auth.showcaseProjects')}</div>
            </div>
          </button>
        </div>

        <div className="flex justify-between items-center mt-8">
          <button 
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            {t('common.back')}
          </button>
          <button
            onClick={() => router.push('/auth/signup/account')}
            disabled={!role}
            className={`px-6 py-2.5 rounded-lg border-none font-bold text-white transition-all ${
              role ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' : 'bg-blue-300 cursor-not-allowed'
            }`}
          >
            {t('common.proceed')}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}

export default function SignupStepOne() {
  return (
    <Suspense>
      <SignupStepOneContent />
    </Suspense>
  );
}
