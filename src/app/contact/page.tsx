"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white mt-20">
        <div className="max-w-xl mx-auto px-6 py-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
          <p className="text-gray-500 mb-10">We typically respond within 24 hours on business days.</p>

          <div className="space-y-4 mb-10 text-sm text-gray-700">
            <div><span className="font-semibold">Email:</span> support@irealty.ng</div>
            <div><span className="font-semibold">Phone:</span> +234 800 000 0000</div>
            <div><span className="font-semibold">Address:</span> Victoria Island, Lagos, Nigeria</div>
            <div><span className="font-semibold">Hours:</span> Mon – Fri, 9 AM – 6 PM WAT</div>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Your full name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea rows={5} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none" placeholder="How can we help?" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Send Message
            </button>
            <p className="text-xs text-gray-400 text-center">Contact form submission is coming soon. Please email us directly in the meantime.</p>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
