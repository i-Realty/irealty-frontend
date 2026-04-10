"use client";

import React from 'react';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n';

export default function Footer() {
  const { t } = useI18n();

  const navigation = {
    services: [
      { name: t('footer.escrowPayment'), href: '/escrow' },
      { name: t('footer.agentOnboarding'), href: '/agent-onboarding' },
      { name: t('footer.diasporaServices'), href: '/diaspora-services' },
      { name: t('footer.legalSupport'), href: '/legal-support' },
      { name: t('footer.propertyInspection'), href: '/inspection' },
    ],
    support: [
      { name: t('footer.faqs'), href: '/faqs' },
      { name: t('footer.helpCenter'), href: '/help' },
      { name: t('footer.contactUs'), href: '/contact' },
      { name: t('footer.privacy'), href: '/privacy' },
      { name: t('footer.terms'), href: '/terms' },
    ],
    social: [
      { name: t('footer.instagram'), href: '#' },
      { name: t('footer.linkedin'), href: '#' },
      { name: t('footer.twitter'), href: '#' },
      { name: t('footer.whatsapp'), href: '#' },
    ],
  }

  return (
    <footer className="bg-[#2563EB] dark:bg-gray-900">
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
              {t('footer.description')}
            </p>
          </div>

          {/* Navigation columns */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white" style={{ fontSize: 14, fontFamily: 'Lato' }}>{t('footer.services')}</h3>
                <ul role="list" className="mt-6 space-y-3">
                  {navigation.services.map((item) => (
                    <li key={item.href}>
                      <a href={item.href} style={{ fontSize: 14, fontFamily: 'Lato' }} className="text-white/80 hover:text-white">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold leading-6 text-white" style={{ fontSize: 14, fontFamily: 'Lato' }}>{t('footer.support')}</h3>
                <ul role="list" className="mt-6 space-y-3">
                  {navigation.support.map((item) => (
                    <li key={item.href}>
                      <a href={item.href} style={{ fontSize: 14, fontFamily: 'Lato' }} className="text-white/80 hover:text-white">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold leading-6 text-white" style={{ fontSize: 14, fontFamily: 'Lato' }}>{t('footer.connectWithUs')}</h3>
                <ul role="list" className="mt-6 space-y-3">
                  {navigation.social.map((item) => (
                    <li key={item.href + item.name}>
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
            &copy; {new Date().getFullYear()} {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
