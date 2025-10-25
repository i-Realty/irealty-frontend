"use client";

import React from 'react';
import Image from 'next/image';

export default function Footer() {
  const navigation = {
    services: [
      { name: 'Escrow Payment', href: '/escrow' },
      { name: 'Agent Onboarding', href: '/agent-onboarding' },
      { name: 'Diaspora Investor Services', href: '/diaspora-services' },
      { name: 'Legal & Documentation Support', href: '/legal-support' },
      { name: 'Property Inspection', href: '/inspection' },
    ],
    support: [
      { name: 'FAQs', href: '/faqs' },
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms & Conditions', href: '/terms' },
    ],
    social: [
      { name: 'Instagram', href: '#' },
      { name: 'LinkedIn', href: '#' },
      { name: 'Twitter (X)', href: '#' },
      { name: 'WhatsApp Support', href: '#' },
    ],
  }

  return (
    <footer className="bg-[#2563EB] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Logo / intro */}
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => { if (typeof window !== 'undefined') { window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
              aria-label="Scroll to top"
              title="Back to top"
              className="flex items-center p-0 bg-transparent border-0 cursor-pointer"
            >
              <Image src="/logo-white.png" alt="i-Realty" width={120} height={40} className="h-10 w-auto" />
            </button>
            <p className="text-white/90 text-sm" style={{ fontFamily: 'Lato' }}>
              We connect buyers, sellers and investors with trusted local developers and agents. Fast searches, secure escrow, and verified listings.
            </p>
          </div>

          {/* Navigation columns */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white" style={{ fontSize: 14, fontFamily: 'Lato' }}>Services</h3>
                <ul role="list" className="mt-6 space-y-3">
                  {navigation.services.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} style={{ fontSize: 14, fontFamily: 'Lato' }} className="text-white/80 hover:text-white">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold leading-6 text-white" style={{ fontSize: 14, fontFamily: 'Lato' }}>Support</h3>
                <ul role="list" className="mt-6 space-y-3">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} style={{ fontSize: 14, fontFamily: 'Lato' }} className="text-white/80 hover:text-white">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold leading-6 text-white" style={{ fontSize: 14, fontFamily: 'Lato' }}>Connect With Us</h3>
                <ul role="list" className="mt-6 space-y-3">
                  {navigation.social.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} style={{ fontSize: 14, fontFamily: 'Lato' }} className="text-white/80 hover:text-white">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="mt-10 border-t border-white/100" />

        {/* Copyright */}
        <div className="mt-6 text-center">
          <p className="text-sm text-white/90" style={{ fontFamily: 'Lato', margin: 0, lineHeight: '1.6' }}>
            © {new Date().getFullYear()} i-Realty. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}