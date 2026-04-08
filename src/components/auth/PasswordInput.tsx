"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  id?: string;
  label?: string;
  showConditions?: boolean;
  required?: boolean;
}

const PASSWORD_CONDITIONS = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "One lowercase letter", test: (v: string) => /[a-z]/.test(v) },
  { label: "One number", test: (v: string) => /[0-9]/.test(v) },
];

/**
 * Password field with a show/hide toggle button and optional live condition checklist.
 */
export default function PasswordInput({
  value,
  onChange,
  placeholder = "Enter Password",
  error,
  id = "password",
  label,
  showConditions = false,
  required = false,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          type={show ? "text" : "password"}
          autoComplete={id === "password" ? "current-password" : "new-password"}
          className={`w-full px-3 pr-10 py-2.5 rounded-lg border text-sm outline-none transition-colors ${
            error ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          } dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1.5"
        >
          {show ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 3L21 21" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10.58 10.58A3 3 0 0013.42 13.42" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9.88 5.53A10.94 10.94 0 003 12c1.73 3.02 4.7 5.5 8.88 6.47" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20.12 18.47A10.94 10.94 0 0021 12c-1.73-3.02-4.7-5.5-8.88-6.47" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="3" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      {showConditions && value.length > 0 && (
        <ul className="mt-2 space-y-1">
          {PASSWORD_CONDITIONS.map((cond) => {
            const met = cond.test(value);
            return (
              <li key={cond.label} className="flex items-center gap-1.5 text-xs">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${met ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                  <Check className="w-2.5 h-2.5" strokeWidth={3} />
                </span>
                <span className={met ? 'text-green-600' : 'text-gray-400'}>{cond.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
