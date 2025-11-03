"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetRequest() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  function sendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    try { localStorage.setItem('resetEmail', email); } catch {}
    router.push('/auth/reset/verify');
  }

  return (
    <div style={{ background: '#F8FAFB', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 8 }}>
      <div style={{ width: 680 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <a href="/">
            <img src="/icons/logo-blue.svg" alt="i-Realty" style={{ height: 36 }} />
          </a>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 32 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Reset Password</h3>

          <form onSubmit={sendCode} style={{ display: 'grid', gap: 12 }}>
            <label style={{ fontSize: 13, color: '#374151' }}>Email address</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter Email Address" style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #E5E7EB' }} />

            <button type="submit" disabled={!email} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: 'none', background: email ? '#2563EB' : '#A3BFFA', color: '#fff', fontWeight: 700 }}>Send Verification Code</button>

            <div style={{ textAlign: 'center', marginTop: 6, color: '#9CA3AF' }}>
              Remembered your password? <a href="/auth/login" style={{ color: '#2563EB' }}>Login</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
