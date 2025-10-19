"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProgressPill from '../ProgressPill';

export default function SignupVerify() {
  const router = useRouter();
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [email, setEmail] = useState('user@example.com');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('signupData');
      if (raw) {
        const parsed = JSON.parse(raw);
        setEmail(parsed.email ? parsed.email : 'user@example.com');
      }
    } catch {
    }
  }, []);

  function handleChange(val: string, idx: number) {
    const cleaned = val.replace(/[^0-9]/g, '').slice(-1);
    const next = [...code];
    next[idx] = cleaned;
    setCode(next);
    if (cleaned) {
      const nextEl = document.getElementById(`code-${idx+2}`) as HTMLInputElement | null;
      nextEl?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (paste) {
      const next = [...code];
      for (let i = 0; i < paste.length; i++) next[i] = paste[i];
      setCode(next);
    }
  }

  const isComplete = code.every(c => c !== '');

  return (
    <div style={{ background: '#F8FAFB', display: 'flex', justifyContent: 'center', padding: 48 }}>
      <div style={{ width: 640 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <a href="/">
            <img src="/icons/logo-blue.svg" alt="i-Realty" style={{ height: 36 }} />
          </a>
        </div>

  <ProgressPill step={3} />
  <div style={{ background: '#fff', borderRadius: 12, padding: 32 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Verify Email address</h3>
          <p style={{ color: '#6B7280', marginBottom: 18 }}>Enter the 6 digit code sent to {email.replace(/(.{3}).+(@.+)/, "$1***$2")}</p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 12 }}>
            {code.map((d, i) => (
              <input
                key={i}
                id={`code-${i+1}`}
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleChange(e.target.value, i)}
                onKeyDown={e => {
                  if (e.key === 'Backspace') {
                    const next = [...code];
                    if (next[i]) { next[i] = ''; setCode(next); } else {
                      const prevEl = document.getElementById(`code-${i}`) as HTMLInputElement | null; prevEl?.focus();
                    }
                  }
                }}
                onPaste={handlePaste}
                style={{ width: 56, height: 56, textAlign: 'center', borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 18, background: '#fff' }}
              />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <a href="#" onClick={(e) => { e.preventDefault(); /* resend */ }} style={{ color: '#2563EB' }}>Resend code</a>
          </div>

          <div style={{ marginTop: 8 }}>
            <button onClick={() => router.push('/auth/signup/success')} disabled={!isComplete} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: 'none', background: isComplete ? '#2563EB' : '#A3BFFA', color: '#fff', fontWeight: 700 }}>Verify Email Address</button>
          </div>
        </div>
      </div>
    </div>
  );
}
