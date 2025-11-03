"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function ResetSuccess() {
  const router = useRouter();

  return (
    <div style={{ background: '#F8FAFB', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 8 }}>
      <div style={{ width: 680 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <a href="/">
            <img src="/icons/logo-blue.svg" alt="i-Realty" style={{ height: 36 }} />
          </a>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 32, textAlign: 'center' }}>
          <div style={{ width: 84, height: 84, borderRadius: 84, background: '#E6F6EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <div style={{ width: 56, height: 56, borderRadius: 56, background: '#1EC16F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Your Password Has Been Reset!</h3>
          <p style={{ color: '#6B7280', marginBottom: 18 }}>This is the password you should enter when next you're logging in to your I-Realty dashboard</p>

          <button onClick={() => router.push('/auth/login')} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: 'none', background: '#2563EB', color: '#fff', fontWeight: 700 }}>Back to Login</button>
        </div>
      </div>
    </div>
  );
}
