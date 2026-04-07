import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validatePhone,
  validateRequired,
  validateAll,
} from '@/lib/utils/authValidation';

describe('validateEmail', () => {
  it('returns error when empty', () => {
    expect(validateEmail('')).toBe('Email is required');
  });

  it('returns error for whitespace-only input', () => {
    expect(validateEmail('   ')).toBe('Email is required');
  });

  it('returns error for invalid email without @', () => {
    expect(validateEmail('invalidemail')).toBe('Enter a valid email address');
  });

  it('returns error for email without domain', () => {
    expect(validateEmail('user@')).toBe('Enter a valid email address');
  });

  it('returns error for email without TLD', () => {
    expect(validateEmail('user@domain')).toBe('Enter a valid email address');
  });

  it('returns empty string for valid email', () => {
    expect(validateEmail('user@example.com')).toBe('');
  });

  it('trims whitespace before validating', () => {
    expect(validateEmail('  user@example.com  ')).toBe('');
  });
});

describe('validatePassword', () => {
  it('returns error when empty', () => {
    expect(validatePassword('')).toBe('Password is required');
  });

  it('returns error when shorter than 8 characters', () => {
    expect(validatePassword('abc1234')).toBe('Password must be at least 8 characters');
  });

  it('returns empty string for exactly 8 characters', () => {
    expect(validatePassword('abcd1234')).toBe('');
  });

  it('returns empty string for longer passwords', () => {
    expect(validatePassword('securepassword123')).toBe('');
  });
});

describe('validatePhone', () => {
  it('returns error when empty', () => {
    expect(validatePhone('')).toBe('Phone number is required');
  });

  it('returns error for non-digit input', () => {
    expect(validatePhone('abc')).toBe('Phone number is required');
  });

  it('returns error when fewer than 10 digits', () => {
    expect(validatePhone('123456789')).toBe('Enter a valid phone number');
  });

  it('returns empty string for exactly 10 digits', () => {
    expect(validatePhone('1234567890')).toBe('');
  });

  it('strips non-digit characters before counting', () => {
    expect(validatePhone('+1 (234) 567-8901')).toBe('');
  });
});

describe('validateRequired', () => {
  it('returns error with field name when empty', () => {
    expect(validateRequired('', 'First name')).toBe('First name is required');
  });

  it('returns error for whitespace-only input', () => {
    expect(validateRequired('   ', 'Last name')).toBe('Last name is required');
  });

  it('returns empty string when value is provided', () => {
    expect(validateRequired('John', 'First name')).toBe('');
  });
});

describe('validateAll', () => {
  it('returns empty object when all values are empty strings (no errors)', () => {
    const result = validateAll({ email: '', password: '' });
    expect(result).toEqual({});
  });

  it('returns only truthy error messages', () => {
    const result = validateAll({
      email: 'Email is required',
      password: '',
      phone: 'Enter a valid phone number',
    });
    expect(result).toEqual({
      email: 'Email is required',
      phone: 'Enter a valid phone number',
    });
  });

  it('returns all errors when all fields have messages', () => {
    const result = validateAll({
      email: 'Email is required',
      password: 'Password is required',
    });
    expect(result).toEqual({
      email: 'Email is required',
      password: 'Password is required',
    });
  });
});
