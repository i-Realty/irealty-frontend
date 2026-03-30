"use client";

import React, { useState } from "react";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  id?: string;
  label?: string;
}

/**
 * Password field with a show/hide toggle button.
 * Extracts the duplicated eye-icon SVGs into a single component.
 */
export default function PasswordInput({
  value,
  onChange,
  placeholder = "Enter Password",
  error,
  id = "password",
  label,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm text-gray-700 mb-1">
          {label}
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
            error ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          }`}
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
    </div>
  );
}
