"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProgressPill from '../ProgressPill';

export default function SignupAccount() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('signupData');
      if (raw) {
        const parsed = JSON.parse(raw);
        setUsername(parsed.username || '');
        setFirstName(parsed.firstName || '');
        setLastName(parsed.lastName || '');
        setEmail(parsed.email || '');
        setPhone(parsed.phone || '');
      }
  } catch {
  }
  }, []);

  function saveAndNext() {
    try {
      const raw = localStorage.getItem('signupData');
      const parsed = raw ? JSON.parse(raw) : {};
      parsed.username = username;
      parsed.firstName = firstName;
      parsed.lastName = lastName;
      parsed.email = email;
      parsed.phone = phone;
  parsed.password = password; // be careful storing passwords in localStorage in production
      localStorage.setItem('signupData', JSON.stringify(parsed));
  } catch (err) { console.error(err); }
    router.push('/auth/signup/verify');
  }

  return (
    <div style={{ background: '#F8FAFB', display: 'flex', justifyContent: 'center', padding:8}} className="pb-8">
      <div style={{ width: 640 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <a href="/">
            <img src="/icons/logo-blue.svg" alt="i-Realty" style={{ height: 36 }} />
          </a>
        </div>

  <ProgressPill step={2} />
  <div style={{ background: '#fff', borderRadius: 12, padding: 32 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Create Your Account</h3>
          <p style={{ color: '#8E98A8', marginBottom: 18 }}>Already have an account? <a href="/auth/login" style={{ color: '#2563EB' }}>Login</a></p>

          <div style={{ display: 'grid', gap: 12 }}>
            <label style={{ fontSize: 13, color: '#374151' }}>User Name/Company Name</label>
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter User Name" style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #E5E7EB' }} />

            <label style={{ fontSize: 13, color: '#374151' }}>First Name</label>
            <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Enter First Name" style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #E5E7EB' }} />

            <label style={{ fontSize: 13, color: '#374151' }}>Last Name</label>
            <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Enter Last Name" style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #E5E7EB' }} />

            <label style={{ fontSize: 13, color: '#374151' }}>Email address</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter Email Address" style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #E5E7EB' }} />

            <label style={{ fontSize: 13, color: '#374151' }}>Phone Number</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+234  Enter Phone Number" style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #E5E7EB' }} />

            <label style={{ fontSize: 13, color: '#374151' }}>Create Password</label>
            <div style={{ position: 'relative' }}>
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password (Min. of 8 characters)"
                type={showPassword ? 'text' : 'password'}
                style={{ padding: '10px 40px 10px 12px', borderRadius: 8, border: '1px solid #E5E7EB', width: '100%' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
                style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 6 }}
              >
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

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input id="agree" type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
              <label htmlFor="agree" style={{ fontSize: 13, color: '#6B7280' }}>I agree to i-Realty&apos;s <a href="#" style={{ color: '#2563EB' }}>Terms of Service</a> and <a href="#" style={{ color: '#2563EB' }}>Privacy Policy</a></label>
            </div>

            <div style={{ marginTop: 12 }}>
              <button onClick={saveAndNext} disabled={!agree} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: 'none', background: agree ? '#2563EB' : '#CBD5E1', color: '#fff', fontWeight: 700 }}>Proceed</button>
            </div>

            <div style={{ textAlign: 'center', marginTop: 12, color: '#9CA3AF' }}>Or Continue With</div>
            <button style={{ marginTop: 12, padding: '10px 12px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
              <img src="/icons/google.svg" alt="Google" style={{ width: 18, height: 18 }} />
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
