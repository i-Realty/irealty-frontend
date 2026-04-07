import { z } from 'zod';

// ── Reusable patterns ────────────────────────────────────────────────

const nigerianPhone = z.string()
  .min(10, 'Phone must be at least 10 digits')
  .max(11, 'Phone must be at most 11 digits')
  .regex(/^\d+$/, 'Phone must contain only digits');

const strongPassword = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Must contain at least one number');

const numericPin = z.string()
  .min(4, 'PIN must be at least 4 digits')
  .max(6, 'PIN must be at most 6 digits')
  .regex(/^\d+$/, 'PIN must contain only digits');

// ── Profile ──────────────────────────────────────────────────────────

export const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
  displayName: z.string().min(1, 'Display name is required').max(60, 'Display name is too long'),
  phone: nigerianPhone,
  about: z.string().max(500, 'About must be under 500 characters').optional(),
});

export const socialLinksSchema = z.object({
  linkedin: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
  facebook: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
  instagram: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
  twitter: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
});

// ── Security ─────────────────────────────────────────────────────────

export const passwordSchema = z.object({
  current: z.string().min(1, 'Current password is required'),
  new: strongPassword,
  confirm: z.string().min(1, 'Please confirm your password'),
}).refine((d) => d.new === d.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
});

export const pinSchema = z.object({
  current: z.string().min(1, 'Current PIN is required'),
  new: numericPin,
  confirm: z.string().min(1, 'Please confirm your PIN'),
}).refine((d) => d.new === d.confirm, {
  message: 'PINs do not match',
  path: ['confirm'],
});

// ── Help Ticket ──────────────────────────────────────────────────────

export const helpTicketSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject is too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description is too long'),
});

// ── Payout ───────────────────────────────────────────────────────────

export const payoutBankSchema = z.object({
  bankName: z.string().min(1, 'Bank name is required'),
  accountName: z.string().min(1, 'Account name is required').max(100, 'Account name is too long'),
  accountNumber: z.string().length(10, 'Account number must be exactly 10 digits').regex(/^\d+$/, 'Account number must contain only digits'),
});

export const payoutCryptoSchema = z.object({
  currency: z.enum(['USDT', 'BTC', 'ETH']),
  address: z.string().min(26, 'Wallet address is too short').max(62, 'Wallet address is too long'),
});

// ── Commission ───────────────────────────────────────────────────────

export const commissionSchema = z.object({
  feeType: z.enum(['Percentage', 'Amount']),
  value: z.number({ error: 'Enter a valid number' }).positive('Value must be greater than 0'),
}).refine((d) => {
  if (d.feeType === 'Percentage') return d.value <= 50;
  return true;
}, {
  message: 'Percentage cannot exceed 50%',
  path: ['value'],
});

// ── Platform Fees (Admin) ────────────────────────────────────────────

export const platformFeeSchema = z.object({
  inspection: z.number().min(0, 'Cannot be negative').max(100, 'Cannot exceed 100%'),
  sale: z.number().min(0, 'Cannot be negative').max(100, 'Cannot exceed 100%'),
  rental: z.number().min(0, 'Cannot be negative').max(100, 'Cannot exceed 100%'),
  developer: z.number().min(0, 'Cannot be negative').max(100, 'Cannot exceed 100%'),
  diaspora: z.number().min(0, 'Cannot be negative').max(100, 'Cannot exceed 100%'),
});

// ── Wallet ───────────────────────────────────────────────────────────

export const depositAmountSchema = z.object({
  amount: z.number({ error: 'Enter a valid amount' })
    .positive('Amount must be greater than 0')
    .max(100_000_000, 'Maximum deposit is ₦100,000,000'),
});

export const withdrawAmountSchema = z.object({
  amount: z.number({ error: 'Enter a valid amount' })
    .positive('Amount must be greater than 0')
    .max(100_000_000, 'Maximum withdrawal is ₦100,000,000'),
  balance: z.number(),
}).refine((d) => d.amount <= d.balance, {
  message: 'Insufficient balance',
  path: ['amount'],
});

// ── Messages ─────────────────────────────────────────────────────────

export const messageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(5000, 'Message is too long'),
});

/** Extract field errors from a Zod error into a flat Record. */
export function extractErrors(error: z.ZodError): Record<string, string> {
  const map: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.');
    if (!map[key]) map[key] = issue.message;
  }
  return map;
}
