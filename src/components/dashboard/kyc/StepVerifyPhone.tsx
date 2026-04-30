'use client';

import { useKYCStore } from './useKYCStore';
import { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { apiPost } from '@/lib/api/client';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

export default function StepVerifyPhone() {
  const { setCurrentKycStep, updateKycProgress } = useKYCStore();
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const handlePhoneSubmit = async () => {
    if (phone.length < 5) return;
    setApiError('');
    if (USE_API) {
      setSubmitting(true);
      try {
        const phoneNumber = phone.startsWith('+') ? phone : `+234${phone.replace(/^0/, '')}`;
        await apiPost('/api/kyc/phone/send-otp', { phoneNumber });
      } catch (err) {
        setApiError(err instanceof Error ? err.message : 'Failed to send OTP.');
        setSubmitting(false);
        return;
      }
      setSubmitting(false);
    }
    setShowOtp(true);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1); // Only take last char
    if (!/^\d*$/.test(value)) return; // Only numbers
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async () => {
    if (otp.join('').length !== 6) return;
    setApiError('');
    if (USE_API) {
      setSubmitting(true);
      try {
        const phoneNumber = phone.startsWith('+') ? phone : `+234${phone.replace(/^0/, '')}`;
        await apiPost('/api/kyc/phone/verify-otp', { phoneNumber, idToken: otp.join('') });
      } catch (err) {
        setApiError(err instanceof Error ? err.message : 'Invalid OTP. Please try again.');
        setSubmitting(false);
        return;
      }
      setSubmitting(false);
    }
    updateKycProgress(2);
    setCurrentKycStep(3);
  };

  if (showOtp) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">You&apos;ve got an SMS!</h2>
          <p className="text-gray-500 mt-2">
            Type the code you received via SMS on <span className="font-bold text-gray-900">{phone || '+2348025341009'}</span>
          </p>
        </div>

        <div className="flex justify-between gap-2 max-w-[340px]">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-12 h-14 text-center text-xl font-bold rounded-lg border ${
                digit 
                  ? 'border-gray-200 text-gray-900' 
                  : 'border-blue-400 text-blue-600 bg-white focus:ring-2 focus:ring-blue-200'
              } outline-none transition-all`}
            />
          ))}
        </div>

        <div>
          <button className="text-gray-400 underline decoration-gray-400 text-sm hover:text-gray-600 transition-colors">
            Resend code(45)
          </button>
        </div>

        {apiError && <p className="text-red-500 text-sm">{apiError}</p>}
        <div className="pt-4 flex justify-end">
          <button
            onClick={handleOtpSubmit}
            disabled={otp.join('').length !== 6 || submitting}
            className={`font-medium py-3 px-8 rounded-lg transition-colors flex items-center gap-2 ${
              otp.join('').length === 6 && !submitting
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-300 text-white cursor-not-allowed'
            }`}
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Verify Phone Number
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <div className="flex mt-1">
          <select className="w-24 border border-gray-200 rounded-l-lg border-r-0 px-3 flex-shrink-0 bg-gray-50 text-sm focus:outline-none">
            <option>NG</option>
            <option>US</option>
            <option>UK</option>
          </select>
          <input 
            type="tel" 
            placeholder="+2348025341009" 
            className="w-full border border-gray-200 rounded-r-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {/* Accordion */}
        <div className="mt-4 border border-gray-100 rounded-lg bg-gray-50 overflow-hidden">
          <button 
            onClick={() => setAccordionOpen(!accordionOpen)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Why is this needed?
            {accordionOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
          {accordionOpen && (
            <div className="px-4 pb-4 pt-1 text-sm text-gray-500 bg-gray-50">
              Your phone number serves as a secondary verification method and a primary contact for property notifications.
            </div>
          )}
        </div>
      </div>

      {apiError && <p className="text-red-500 text-sm">{apiError}</p>}
      <div className="pt-4 flex justify-end">
        <button
          onClick={handlePhoneSubmit}
          disabled={!phone || submitting}
          className={`font-medium py-3 px-8 rounded-lg transition-colors flex items-center gap-2 ${
            phone && !submitting ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-400 text-white cursor-not-allowed'
          }`}
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Proceed
        </button>
      </div>
    </div>
  );
}
