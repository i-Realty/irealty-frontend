import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = { title: 'Agent Onboarding | i-Realty', description: 'Become a verified real estate agent on i-Realty and grow your business.' };

const STEPS = [
  { n: '1', title: 'Create your account', desc: 'Sign up as a Real Estate Agent and complete your profile.' },
  { n: '2', title: 'Complete KYC', desc: 'Submit your government-issued ID, a selfie for face verification, and your BVN or NIN.' },
  { n: '3', title: 'Get verified', desc: 'Our team reviews your documents within 24–48 hours.' },
  { n: '4', title: 'Start listing', desc: 'Once verified, you can create listings, manage tours, and receive payments.' },
];

export default function AgentOnboardingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white mt-20">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agent Onboarding</h1>
          <p className="text-gray-500 mb-10">Join thousands of agents on i-Realty. Get verified, list properties, and manage your pipeline from one dashboard.</p>

          <div className="space-y-6 mb-12">
            {STEPS.map((s) => (
              <div key={s.n} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{s.n}</div>
                <div>
                  <h2 className="font-semibold text-gray-900">{s.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Link href="/auth/signup?role=real-estate-agent" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
            Register as Agent
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
