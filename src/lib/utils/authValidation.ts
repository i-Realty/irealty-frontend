/**
 * Shared form validation helpers for auth pages.
 * Each returns an error message string, or empty string if valid.
 * When a backend is added, server-side validation should duplicate these rules.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value: string): string {
  const v = value.trim();
  if (!v) return 'Email is required';
  if (!EMAIL_RE.test(v)) return 'Enter a valid email address';
  return '';
}

export function validatePassword(value: string): string {
  if (!value) return 'Password is required';
  if (value.length < 8) return 'Password must be at least 8 characters';
  return '';
}

export function validatePhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (!digits) return 'Phone number is required';
  if (digits.length < 10) return 'Enter a valid phone number';
  return '';
}

export function validateRequired(value: string, fieldName: string): string {
  if (!value.trim()) return `${fieldName} is required`;
  return '';
}

/** Run all validators and return a map of field → error. Only truthy errors included. */
export function validateAll(fields: Record<string, string>): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const [key, msg] of Object.entries(fields)) {
    if (msg) errors[key] = msg;
  }
  return errors;
}
