import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = { title: 'Privacy Policy | i-Realty', description: 'i-Realty privacy policy — how we collect, use, and protect your data.' };

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white mt-20">
        <div className="max-w-2xl mx-auto px-6 py-16 prose prose-sm text-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-400 text-sm mb-8">Last updated: April 2026</p>

          <h2 className="text-lg font-semibold mt-8 mb-2">1. Information We Collect</h2>
          <p>We collect information you provide directly (name, email, phone number, property details) and information collected automatically (device data, usage analytics, location when permitted).</p>

          <h2 className="text-lg font-semibold mt-8 mb-2">2. How We Use Your Information</h2>
          <p>We use your data to operate the platform, verify identity (KYC), process payments via escrow, send notifications, and improve our services.</p>

          <h2 className="text-lg font-semibold mt-8 mb-2">3. Data Sharing</h2>
          <p>We do not sell your personal data. We may share necessary information with agents, buyers, or sellers as part of a transaction, and with service providers under confidentiality agreements.</p>

          <h2 className="text-lg font-semibold mt-8 mb-2">4. Data Security</h2>
          <p>We use industry-standard encryption and access controls. Payments are processed through secure escrow and payment gateway providers.</p>

          <h2 className="text-lg font-semibold mt-8 mb-2">5. Your Rights</h2>
          <p>You may request access to, correction of, or deletion of your personal data by contacting support@irealty.ng.</p>

          <h2 className="text-lg font-semibold mt-8 mb-2">6. Contact</h2>
          <p>For privacy concerns, email <a href="mailto:privacy@irealty.ng" className="text-blue-600">privacy@irealty.ng</a>.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
