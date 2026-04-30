'use client';

import { useKYCStore } from './useKYCStore';
import { kycStep1Schema, extractErrors } from '@/lib/validations/kyc';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { apiPost } from '@/lib/api/client';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

export default function StepPersonalInformation() {
  const { setCurrentKycStep, updateKycProgress } = useKYCStore();
  const [bvnAccordionOpen, setBvnAccordionOpen] = useState(false);
  const [formData, setFormData] = useState({
    bvn: '',
    firstName: '',
    lastName: '',
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    address: '',
    postCode: '',
    city: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleNext = async () => {
    const result = kycStep1Schema.safeParse({
      bvn: formData.bvn,
      firstName: formData.firstName,
      lastName: formData.lastName,
      dobDay: formData.dobDay,
      dobMonth: formData.dobMonth,
      dobYear: formData.dobYear,
      address: formData.address,
      postalCode: formData.postCode,
      city: formData.city,
    });
    if (!result.success) {
      setErrors(extractErrors(result.error));
      return;
    }
    setErrors({});
    setApiError('');

    if (USE_API) {
      setSubmitting(true);
      try {
        const monthMap: Record<string, string> = {
          Jan:'01',Feb:'02',Mar:'03',Apr:'04',May:'05',Jun:'06',
          Jul:'07',Aug:'08',Sep:'09',Oct:'10',Nov:'11',Dec:'12',
        };
        const mm = monthMap[formData.dobMonth] ?? formData.dobMonth;
        const dd = formData.dobDay.padStart(2, '0');
        await apiPost('/api/kyc/personal-info', {
          bvn:         formData.bvn,
          firstName:   formData.firstName,
          lastName:    formData.lastName,
          dateOfBirth: `${formData.dobYear}-${mm}-${dd}`,
          address:     formData.address,
          postCode:    formData.postCode,
          city:        formData.city,
        });
      } catch (err) {
        setApiError(err instanceof Error ? err.message : 'Failed to submit. Please try again.');
        setSubmitting(false);
        return;
      }
      setSubmitting(false);
    }

    updateKycProgress(1);
    setCurrentKycStep(2);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">BVN <span className="text-red-500">*</span></label>
        <input 
          type="text" 
          placeholder="Enter BVN" 
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          value={formData.bvn}
          onChange={(e) => setFormData({...formData, bvn: e.target.value})}
        />
        {errors.bvn && <p className="text-red-500 text-xs mt-1">{errors.bvn}</p>}

        {/* Accordion */}
        <div className="mt-2 border border-gray-100 rounded-lg bg-gray-50 overflow-hidden">
          <button 
            onClick={() => setBvnAccordionOpen(!bvnAccordionOpen)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Why do we need your BVN?
            {bvnAccordionOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
          {bvnAccordionOpen && (
            <div className="px-4 pb-4 pt-1 text-sm text-gray-500 bg-gray-50">
              We only use your BVN to verify your identity and protect against fraud. We do not have access to your bank account metrics.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            placeholder="First Name" 
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            placeholder="Last Name"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Birth date <span className="text-red-500">*</span></label>
        <div className="grid grid-cols-3 gap-3">
          <div className="relative">
            <select 
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={formData.dobDay}
              onChange={(e) => setFormData({...formData, dobDay: e.target.value})}
            >
              <option value="" disabled>Date</option>
              {Array.from({length: 31}, (_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <div className="relative">
            <select 
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={formData.dobMonth}
              onChange={(e) => setFormData({...formData, dobMonth: e.target.value})}
            >
              <option value="" disabled>Month</option>
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <div className="relative">
            <select 
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={formData.dobYear}
              onChange={(e) => setFormData({...formData, dobYear: e.target.value})}
            >
              <option value="" disabled>Year</option>
              {Array.from({length: 100}, (_, i) => <option key={i} value={2025 - i}>{2025 - i}</option>)}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
        {errors.dobDay && <p className="text-red-500 text-xs mt-1">{errors.dobDay}</p>}
        {errors.dobMonth && <p className="text-red-500 text-xs mt-1">{errors.dobMonth}</p>}
        {errors.dobYear && <p className="text-red-500 text-xs mt-1">{errors.dobYear}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Residential Address <span className="text-red-500">*</span></label>
        <input 
          type="text" 
          placeholder="Address" 
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
        />
        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
          <input
            type="text"
            placeholder="Post code"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            value={formData.postCode}
            onChange={(e) => setFormData({...formData, postCode: e.target.value})}
          />
          {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
          <input
            type="text"
            placeholder="City"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            value={formData.city}
            onChange={(e) => setFormData({...formData, city: e.target.value})}
          />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
        </div>
      </div>

      {apiError && <p className="text-red-500 text-sm">{apiError}</p>}
      <div className="pt-4 flex justify-end">
        <button
          onClick={handleNext}
          disabled={submitting}
          className="bg-blue-600 text-white font-medium py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Proceed
        </button>
      </div>
    </div>
  );
}
