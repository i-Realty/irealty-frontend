"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ProgressPill from './ProgressPill';

export default function SignupStepOne() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>(() => {
    try {
      const raw = localStorage.getItem('signupData');
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.role || 'property-seeker';
      }
    } catch {
    }
    return 'property-seeker';
  });

  const options = [
    { id: "property-seeker", title: "Property Seeker", subtitle: "Buy or rent", icon: "/icons/seekericon.svg" },
    { id: "property-owner", title: "Property Owner", subtitle: "Sell or rent out", icon: "/icons/ownericon.svg" },
    { id: "real-estate-agent", title: "Real Estate Agent", subtitle: "List & manage properties", icon: "/icons/agenticon.svg" },
    { id: "diaspora-investors", title: "Diaspora investors", subtitle: "Invest from abroad", icon: "/icons/diasporaicon.svg" },
  ];

  function saveRole(role: string) {
    try {
      const raw = localStorage.getItem('signupData');
      const parsed = raw ? JSON.parse(raw) : {};
      parsed.role = role;
      localStorage.setItem('signupData', JSON.stringify(parsed));
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div style={{ background: '#F8FAFB', display: 'flex', justifyContent: 'center', padding: 48 }}>
      <div style={{ width: 640 }}>
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <Link href="/">
            <Image src="/icons/logo-blue.svg" alt="i-Realty" width={120} height={36} />
          </Link>
        </div>

        <ProgressPill step={1} />

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: 'Lato', marginBottom: 8 }}>How will you use I-Realty?</h2>
          <p style={{ color: '#8E98A8', marginBottom: 20 }}>Select your primary role on the platform</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {options.map(opt => (
              <button
                key={opt.id}
                onClick={() => { setSelected(opt.id); saveRole(opt.id); }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  padding: 18,
                  borderRadius: 12,
                  border: selected === opt.id ? '2px solid #2563EB' : '1px solid #EDEFF1',
                  background: selected === opt.id ? '#EEF2FF' : '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: selected === opt.id ? '#FFFFFF' : '#F8FAFB' }}>
                    <Image src={opt.icon} alt={opt.title} width={22} height={22} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontFamily: 'Lato' }}>{opt.title}</div>
                    <div style={{ fontSize: 13, color: '#8E98A8' }}>{opt.subtitle}</div>
                  </div>
                </div>
              </button>
            ))}

            {/* Developers full width */}
            <button
              onClick={() => { setSelected('developers'); saveRole('developers'); }}
              style={{
                gridColumn: '1 / -1',
                padding: 20,
                alignItems: 'center',
                borderRadius: 12,
                border: selected === 'developers' ? '2px solid #2563EB' : '1px solid #EDEFF1',
                background: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, display: 'flex',flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F8FAFB' }}>
                <Image src="/icons/developericon.svg" alt="Developers" width={22} height={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontFamily: 'Lato' }}>Developers</div>
                <div style={{ fontSize: 13, color: '#8E98A8' }}>Showcase projects and connect with investors.</div>
              </div>
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
            <button style={{ padding: '10px 18px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff' }} onClick={() => {/* nothing to go back to */}}>Back</button>
            <button style={{ padding: '10px 18px', borderRadius: 8, border: 'none', background: '#2563EB', color: '#fff' }} onClick={() => router.push('/auth/signup/account')}>Proceed</button>
          </div>
        </div>
      </div>
    </div>
  );
}
