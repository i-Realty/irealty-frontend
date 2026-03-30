"use client";

import React from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ProgressPill from '@/components/auth/ProgressPill';
import AuthLayout from '@/components/auth/AuthLayout';
import { useSignupStore } from '@/lib/store/useSignupStore';

export default function SignupStepOne() {
  const router = useRouter();
  const { role, setRole } = useSignupStore();

  const options = [
    { id: "property-seeker", title: "Property Seeker", subtitle: "Buy or rent", icon: "/icons/seekericon.svg" },
    { id: "property-owner", title: "Property Owner", subtitle: "Sell or rent out", icon: "/icons/ownericon.svg" },
    { id: "real-estate-agent", title: "Real Estate Agent", subtitle: "List & manage properties", icon: "/icons/agenticon.svg" },
    { id: "diaspora-investors", title: "Diaspora investors", subtitle: "Invest from abroad", icon: "/icons/diasporaicon.svg" },
  ];

  return (
    <AuthLayout maxWidth={640}>
      <ProgressPill step={1} />

      <div className="bg-white rounded-xl p-8 sm:p-10 shadow-sm border border-gray-100 mt-4">
        <h2 className="text-2xl font-bold mb-2">How will you use i-Realty?</h2>
        <p className="text-gray-500 mb-6">Select your primary role on the platform</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {options.map(opt => (
            <button
              key={opt.id}
              onClick={() => setRole(opt.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                role === opt.id 
                  ? 'border-blue-600 bg-blue-50' 
                  : 'border-gray-100 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${role === opt.id ? 'bg-white' : 'bg-gray-50'}`}>
                  <Image src={opt.icon} alt={opt.title} width={22} height={22} />
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">{opt.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{opt.subtitle}</div>
                </div>
              </div>
            </button>
          ))}

          {/* Developers full width */}
          <button
            onClick={() => setRole('developers')}
            className={`sm:col-span-2 flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all cursor-pointer ${
              role === 'developers' 
                ? 'border-blue-600 bg-blue-50' 
                : 'border-gray-100 bg-white hover:border-gray-300'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${role === 'developers' ? 'bg-white' : 'bg-gray-50'}`}>
              <Image src="/icons/developericon.svg" alt="Developers" width={22} height={22} />
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900">Developers</div>
              <div className="text-xs text-gray-500 mt-0.5">Showcase projects and connect with investors.</div>
            </div>
          </button>
        </div>

        <div className="flex justify-between items-center mt-8">
          <button 
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Back
          </button>
          <button 
            onClick={() => router.push('/auth/signup/account')}
            disabled={!role}
            className={`px-6 py-2.5 rounded-lg border-none font-bold text-white transition-all ${
              role ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' : 'bg-blue-300 cursor-not-allowed'
            }`}
          >
            Proceed
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
