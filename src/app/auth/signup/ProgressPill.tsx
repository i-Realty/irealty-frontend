"use client";

import React from 'react';

interface Props {
  step: number;
}

export default function ProgressPill({ step }: Props) {
  const labels = ['Service Type', 'Account Info', 'Verify'];
  const percent = step === 1 ? '24%' : step === 2 ? '66%' : '100%';

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 14, marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ fontSize: 12, color: '#8E98A8' }}>Step {step}/3</div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>{labels[step-1]}</div>
        <div style={{ flex: 1 }} />
        <div style={{ width: 160 }}>
          <div style={{ height: 6, background: '#EEF2FF', borderRadius: 999, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: percent, background: '#2563EB', borderRadius: 999 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
