"use client";

import React, { useRef, useCallback } from "react";

interface OtpInputProps {
  /** Current code value as an array of single-digit strings */
  value: string[];
  /** Called with the updated code array on every change */
  onChange: (code: string[]) => void;
  /** Number of digits, defaults to 6 */
  length?: number;
  /** HTML id prefix for the inputs */
  idPrefix?: string;
}

/**
 * Reusable 6-digit OTP code input with auto-advance, backspace
 * navigation, and paste support. Uses refs instead of
 * document.getElementById for React-safe focus management.
 */
export default function OtpInput({ value, onChange, length = 6, idPrefix = "otp" }: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = useCallback(
    (raw: string, idx: number) => {
      const digit = raw.replace(/[^0-9]/g, "").slice(-1);
      const next = [...value];
      next[idx] = digit;
      onChange(next);
      if (digit && idx < length - 1) {
        refs.current[idx + 1]?.focus();
      }
    },
    [value, onChange, length],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
      if (e.key === "Backspace") {
        const next = [...value];
        if (next[idx]) {
          next[idx] = "";
          onChange(next);
        } else if (idx > 0) {
          refs.current[idx - 1]?.focus();
        }
      }
    },
    [value, onChange],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const paste = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, length);
      if (!paste) return;
      const next = [...value];
      for (let i = 0; i < paste.length; i++) next[i] = paste[i];
      onChange(next);
      // Focus the next empty slot or the last filled slot
      const focusIdx = Math.min(paste.length, length - 1);
      refs.current[focusIdx]?.focus();
    },
    [value, onChange, length],
  );

  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          id={`${idPrefix}-${i + 1}`}
          ref={(el) => { refs.current[i] = el; }}
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          className="w-14 h-14 text-center rounded-[10px] border border-gray-200 text-lg bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
}
