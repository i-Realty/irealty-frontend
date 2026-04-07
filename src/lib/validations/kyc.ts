import { z } from 'zod';

export const kycStep1Schema = z.object({
  bvn: z.string()
    .length(11, 'BVN must be exactly 11 digits')
    .regex(/^\d+$/, 'BVN must contain only digits'),
  firstName: z.string().min(1, 'First name is required').max(50, 'Too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Too long'),
  dobDay: z.string().min(1, 'Day is required'),
  dobMonth: z.string().min(1, 'Month is required'),
  dobYear: z.string().min(1, 'Year is required'),
  address: z.string().min(1, 'Address is required').max(200, 'Too long'),
  postalCode: z.string().min(1, 'Postal code is required').max(10, 'Too long'),
  city: z.string().min(1, 'City is required'),
}).refine((d) => {
  if (!d.dobDay || !d.dobMonth || !d.dobYear) return true;
  const year = parseInt(d.dobYear);
  const currentYear = new Date().getFullYear();
  return currentYear - year >= 18;
}, {
  message: 'You must be at least 18 years old',
  path: ['dobYear'],
});

export const kycPhoneOtpSchema = z.object({
  code: z.string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d+$/, 'OTP must contain only digits'),
});

export const kycIdSchema = z.object({
  idType: z.string().min(1, 'Select an ID type'),
  idNumber: z.string().min(5, 'ID number is too short').max(20, 'ID number is too long'),
});

export const kycDeveloperIdSchema = z.object({
  idType: z.string().min(1, 'Select an ID type'),
  idNumber: z.string().min(5, 'ID number is too short').max(20, 'ID number is too long'),
  cacNumber: z.string()
    .min(7, 'CAC number must be at least 7 characters')
    .max(10, 'CAC number is too long')
    .optional()
    .or(z.literal('')),
});

export const kycPaymentDetailsSchema = z.object({
  bankName: z.string().min(1, 'Bank name is required'),
  accountNumber: z.string()
    .length(10, 'Account number must be 10 digits')
    .regex(/^\d+$/, 'Account number must contain only digits'),
  accountName: z.string().min(1, 'Account name is required').max(100, 'Too long'),
});

export const documentWizardSchema = z.object({
  title: z.string().min(1, 'Document title is required').max(200, 'Title is too long'),
  landlordName: z.string().min(1, 'Landlord name is required').max(100, 'Too long'),
  tenantName: z.string().min(1, 'Tenant name is required').max(100, 'Too long'),
  landlordPhone: z.string()
    .min(10, 'Phone must be at least 10 digits')
    .max(11, 'Phone must be at most 11 digits')
    .regex(/^\d+$/, 'Phone must contain only digits')
    .optional()
    .or(z.literal('')),
  rentAmount: z.string().optional(),
  description: z.string().max(1000, 'Description is too long').optional(),
});

export const calendarAvailabilitySchema = z.object({
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
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
