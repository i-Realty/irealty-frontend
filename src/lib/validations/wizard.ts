import { z } from 'zod';

// ── Property Wizard ──────────────────────────────────────────────────

export const propertyStep1Schema = z.object({
  propertyType: z.string().min(1, 'Select a property category'),
  listingType: z.string().min(1, 'Select a listing type'),
  propertyStatus: z.string().min(1, 'Select a property status'),
});

export const propertyStep2Schema = z.object({
  title: z.string().min(1, 'Property title is required').max(200, 'Title is too long'),
  stateGeo: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  address: z.string().min(1, 'Address is required').max(300, 'Address is too long'),
});

export const propertyStep3MediaSchema = z.object({
  mediaCount: z.number().min(1, 'Upload at least one image'),
});

export const propertyStep4Schema = z.object({
  salePrice: z.string().optional(),
  rentPrice: z.string().optional(),
  listingType: z.string(),
}).refine((d) => {
  if (d.listingType === 'For Sale') return (d.salePrice ?? '').length > 0;
  return (d.rentPrice ?? '').length > 0;
}, {
  message: 'Price is required',
  path: ['price'],
}).refine((d) => {
  const price = d.listingType === 'For Sale' ? d.salePrice : d.rentPrice;
  if (!price) return true;
  const num = Number(price.replace(/,/g, ''));
  return !isNaN(num) && num > 0;
}, {
  message: 'Price must be a positive number',
  path: ['price'],
}).refine((d) => {
  const price = d.listingType === 'For Sale' ? d.salePrice : d.rentPrice;
  if (!price) return true;
  const num = Number(price.replace(/,/g, ''));
  return num <= 500_000_000;
}, {
  message: 'Price cannot exceed ₦500,000,000',
  path: ['price'],
});

// ── Project Wizard ───────────────────────────────────────────────────

export const projectStep1Schema = z.object({
  projectType: z.string().min(1, 'Select a project type'),
});

export const projectStep2Schema = z.object({
  projectName: z.string().min(1, 'Project name is required').max(200, 'Name is too long'),
  stateGeo: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  fullAddress: z.string().min(1, 'Address is required').max(300, 'Address is too long'),
});

export const projectStep3Schema = z.object({
  totalPercentage: z.number(),
}).refine((d) => d.totalPercentage === 100, {
  message: 'Milestone percentages must total 100%',
  path: ['totalPercentage'],
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
