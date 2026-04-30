/**
 * File Upload Service
 *
 * Uploads a file to POST /api/documents/upload (multipart/form-data).
 * Returns the permanent CDN URL for the uploaded file.
 *
 * Used by:
 *   - Listing image uploads  (POST /api/listings/{id}/images)
 *   - Document uploads       (POST /api/documents)
 *   - Profile avatar uploads (PATCH /api/auth/me)
 */

import { apiUpload } from '@/lib/api/client';

interface UploadResponse {
  url?: string;
  fileUrl?: string;
  path?: string;
}

/**
 * Upload a single file.
 * Returns the permanent URL or throws on failure.
 */
export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const data = await apiUpload<UploadResponse>('/api/documents/upload', formData);
  const url = data.url ?? data.fileUrl ?? data.path ?? '';

  if (!url) throw new Error('Upload succeeded but no URL was returned.');
  return url;
}

/**
 * Upload multiple files concurrently.
 * Returns an array of URLs in the same order as the input files.
 */
export async function uploadFiles(files: File[]): Promise<string[]> {
  return Promise.all(files.map(uploadFile));
}
