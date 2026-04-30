'use client';

import { useKYCStore } from './useKYCStore';
import { kycPaymentDetailsSchema, extractErrors } from '@/lib/validations/kyc';
import { useState } from 'react';
import { Briefcase, Wallet, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { apiPost } from '@/lib/api/client';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

interface StepPaymentDetailsProps {
  onComplete: () => void;
}

export default function StepPaymentDetails({ onComplete }: StepPaymentDetailsProps) {
  const { updateKycProgress, profile } = useKYCStore();
  
  const [bankOpen, setBankOpen] = useState(true);
  const [cryptoOpen, setCryptoOpen] = useState(true);
  
  const [bankData, setBankData] = useState({
    accountName: profile?.name || 'Oyakhilome Einstein Godstime',
    bankName: '',
    accountNumber: ''
  });

  const [cryptoData, setCryptoData] = useState({
    type: 'USDT', // or BTC, ETH
    address: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleComplete = async () => {
    const result = kycPaymentDetailsSchema.safeParse(bankData);
    if (!result.success) {
      setErrors(extractErrors(result.error));
      return;
    }
    setErrors({});
    setApiError('');

    if (USE_API) {
      setSubmitting(true);
      try {
        // POST /api/kyc/payment expects bankCode (not bankName) — use accountNumber as bankCode placeholder
        // until a bank lookup is implemented
        await apiPost('/api/kyc/payment', {
          bankAccount: {
            bankCode:      bankData.bankName,   // TODO: replace with actual bank code from GET /api/paystack/banks
            accountNumber: bankData.accountNumber,
          },
          ...(cryptoData.address ? {
            cryptoWallet: { walletType: cryptoData.type, walletAddress: cryptoData.address },
          } : {}),
        });
      } catch (err) {
        setApiError(err instanceof Error ? err.message : 'Failed to save payment details. Please try again.');
        setSubmitting(false);
        return;
      }
      setSubmitting(false);
    }

    updateKycProgress(5);
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Setup Payment Option</h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">Setup your payment method to ensure transaction and escrow services</p>
      </div>

      {/* Bank Account Accordion */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
        <button 
          onClick={() => setBankOpen(!bankOpen)}
          className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
             <Briefcase className="w-5 h-5 text-blue-600" />
             <span className="font-semibold text-gray-900 text-sm">Bank Account/Card</span>
          </div>
          {bankOpen ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
        </button>

        {bankOpen && (
          <div className="p-4 border-t border-gray-100 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
              <input 
                type="text" 
                className="w-full border border-gray-200 bg-gray-100 rounded-lg px-4 py-3 text-sm focus:outline-none text-gray-500 font-medium"
                value={bankData.accountName}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
              <div className="relative">
                <select 
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={bankData.bankName}
                  onChange={(e) => setBankData({...bankData, bankName: e.target.value})}
                >
                  <option value="" disabled>Select Your Bank</option>
                  <option value="GTBank">GTBank</option>
                  <option value="Access Bank">Access Bank</option>
                  <option value="Zenith Bank">Zenith Bank</option>
                  <option value="FBN">First Bank of Nigeria</option>
                </select>
                <ChevronDown className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
              <input
                type="text"
                placeholder="Enter Account Number"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                value={bankData.accountNumber}
                onChange={(e) => setBankData({...bankData, accountNumber: e.target.value})}
              />
              {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>}
            </div>
            {errors.accountName && <p className="text-red-500 text-xs mt-1">{errors.accountName}</p>}
          </div>
        )}
      </div>

      {/* Crypto Accordion */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
        <button 
          onClick={() => setCryptoOpen(!cryptoOpen)}
          className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
             <Wallet className="w-5 h-5 text-blue-600" />
             <span className="font-semibold text-gray-900 text-sm">Cryptocurrency Wallet <span className="text-gray-400 font-normal">(Optional)</span></span>
          </div>
          {cryptoOpen ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
        </button>

        {cryptoOpen && (
          <div className="p-4 border-t border-gray-100 space-y-4">
             <p className="text-sm text-gray-500 mb-2">Connect your crypto wallet to enable international transaction and payment from diaspora</p>
             
             <div className="grid grid-cols-3 gap-3 mb-4">
               {['USDT', 'BTC', 'ETH'].map(coin => (
                 <button
                   key={coin}
                   onClick={() => setCryptoData({...cryptoData, type: coin})}
                   className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${
                     cryptoData.type === coin 
                       ? 'border-blue-500 bg-blue-50 shadow-sm' 
                       : 'border-gray-200 hover:border-gray-300'
                   }`}
                 >
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 text-white font-bold ${
                     coin === 'USDT' ? 'bg-teal-500' : 
                     coin === 'BTC' ? 'bg-orange-500' : 'bg-blue-600'
                   }`}>
                     {coin.charAt(0)}
                   </div>
                   <span className={`text-sm font-bold ${cryptoData.type === coin ? 'text-blue-700' : 'text-gray-700'}`}>{coin}</span>
                 </button>
               ))}
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Address</label>
               <input 
                 type="text" 
                 placeholder="Enter Your Wallet Address" 
                 className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                 value={cryptoData.address}
                 onChange={(e) => setCryptoData({...cryptoData, address: e.target.value})}
               />
             </div>
          </div>
        )}
      </div>

      {apiError && <p className="text-red-500 text-sm">{apiError}</p>}
      <div className="pt-4 flex justify-end">
        <button
          onClick={handleComplete}
          disabled={!bankData.bankName || !bankData.accountNumber || submitting}
          className={`font-medium py-3 px-8 rounded-lg transition-colors flex items-center gap-2 ${
            (bankData.bankName && bankData.accountNumber && !submitting)
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-blue-300 text-white cursor-not-allowed'
          }`}
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Complete
        </button>
      </div>
    </div>
  );
}
