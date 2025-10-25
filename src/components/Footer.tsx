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
    <footer className="bg-[#2563EB]" style={{ marginTop: 96 }}>
      <div className="mx-auto flex" style={{ width: 1440, padding: "80px 64px" }}>
        {/* Logo - One Third Width */}
        <div style={{ width: 'calc(40% - 32px)' }} className="pr-8">
          <button
            onClick={() => { if (typeof window !== 'undefined') { window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
            aria-label="Scroll to top"
            title="Back to top"
            style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <Image src="/logo-white.png" alt="i-Realty" width={120} height={40} className="h-10 w-30" />
          </button>
        </div>

        {/* Services - Two Thirds Width */}
        <div style={{ width: 'calc(60%)' }}>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold leading-6 text-white" style={{ fontSize: 14, fontFamily: "Lato" }}>Services</h3>
              <ul role="list" className="mt-6 space-y-4">
                {navigation.services.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} style={{ fontSize: 14, fontFamily: "Lato" }} className="text-white/80 hover:text-white">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-sm font-semibold leading-6 text-white" style={{ fontSize: 14, fontFamily: "Lato" }}>Support</h3>
              <ul role="list" className="mt-6 space-y-4">
                {navigation.support.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} style={{ fontSize: 14, fontFamily: "Lato" }} className="text-white/80 hover:text-white">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect With Us */}
            <div>
              <h3 className="text-sm font-semibold leading-6 text-white" style={{ fontSize: 14, fontFamily: "Lato" }}>Connect With Us</h3>
              <ul role="list" className="mt-6 space-y-4">
                {navigation.social.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} style={{ fontSize: 14, fontFamily: "Lato" }} className="text-white/80 hover:text-white">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Separator line (exact style) */}
      <div className="mx-auto" style={{ width: 1440, padding: "0 64px" }}>
        <div style={{ height: 2, marginTop: 40, marginBottom: 28, background: 'rgba(255,255,255,1)' }} />
      </div>

      {/* Copyright */}
      <div>
        <div className="mx-auto" style={{ width: 1440, padding: "16px 64px 56px 64px" }}>
          <p style={{ fontSize: 12, fontFamily: 'Lato', color: 'rgba(255,255,255,0.9)', margin: 0, letterSpacing: '0.01em', wordSpacing: '0.16em', lineHeight: '20px' }}>
            © {new Date().getFullYear()}&nbsp;i-Realty.&nbsp;All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}