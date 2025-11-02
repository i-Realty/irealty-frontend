"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = email.trim() !== '' && password.trim() !== '';

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    // placeholder: in production call your auth API then redirect on success
    if (canSubmit) {
      router.push('/');
    }
  }

  return (
    <div style={{ background: '#F8FAFB', height: '674px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 48 }}>
      <div style={{ width: 628 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <a href="/">
            <img src="/icons/logo-blue.svg" alt="i-Realty" style={{ height: 36 }} />
          </a>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Welcome Back!</h2>
          <p style={{ color: '#6B7280', marginBottom: 18 }}>Don&apos;t have an account? <Link href="/auth/signup" style={{ color: '#2563EB' }}>Sign up</Link></p>

          <form onSubmit={handleLogin} style={{ display: 'grid', gap: 12 }}>
            <label style={{ fontSize: 13, color: '#374151' }}>Email address</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter Email Address" style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #E5E7EB' }} />

            <label style={{ fontSize: 13, color: '#374151' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter Password" type={showPassword ? 'text' : 'password'} style={{ padding: '10px 40px 10px 12px', borderRadius: 8, border: '1px solid #E5E7EB', width: '100%' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 6 }}>
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3L21 21" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10.58 10.58A3 3 0 0013.42 13.42" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.88 5.53A10.94 10.94 0 003 12c1.73 3.02 4.7 5.5 8.88 6.47" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20.12 18.47A10.94 10.94 0 0021 12c-1.73-3.02-4.7-5.5-8.88-6.47" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>

            <div style={{ fontSize: 13, color: '#6B7280' }}>
              Forgot Password? <a href="/auth/reset" style={{ color: '#2563EB' }}>Reset it here</a>
            </div>

            <button type="submit" disabled={!canSubmit} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: 'none', background: canSubmit ? '#7DA0FF' : '#AFC0F4', color: '#fff', fontWeight: 700 }}>Login</button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
              <div style={{ flex: 1, height: 1, background: '#F3F4F6' }} />
              <div style={{ color: '#9CA3AF', fontSize: 13 }}>Or Continue With</div>
              <div style={{ flex: 1, height: 1, background: '#F3F4F6' }} />
            </div>

            <button type="button" style={{ marginTop: 12, padding: '10px 12px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
              <img src="/icons/google.svg" alt="Google" style={{ width: 18, height: 18 }} />
              Continue with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
