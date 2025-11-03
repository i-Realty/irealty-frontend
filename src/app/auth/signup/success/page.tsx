"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupSuccess() {
  const router = useRouter();

  return (
    <div style={{ background: '#F8FAFB', display: 'flex', justifyContent: 'center', padding: 48 }}>
      <div style={{ width: 640 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <Link href="/">
            <img src="/icons/logo-blue.svg" alt="i-Realty" style={{ height: 36 }} />
          </Link>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 48, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <div style={{ width: 96, height: 96, borderRadius: 999, background: 'rgba(16,185,129,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 8px rgba(16,185,129,0.04), 0 0 0 16px rgba(16,185,129,0.02)' }}>
              <div style={{ width: 64, height: 64, borderRadius: 999, background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Welcome To i-Realty!</h2>
          <p style={{ color: '#6B7280', marginBottom: 20 }}>Your account has been created successfully</p>

          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <button onClick={() => router.push('/')} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: 'none', background: '#2563EB', color: '#fff' }}>Back to homepage</button>
          </div>
        </div>
      </div>
    </div>
  );
}
