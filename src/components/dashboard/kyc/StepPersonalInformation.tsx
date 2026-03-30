'use client';

import { useAgentDashboardStore } from '@/lib/store/useAgentDashboardStore';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function StepPersonalInformation() {
  const { setCurrentKycStep, updateKycProgress } = useAgentDashboardStore();
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

  const handleNext = () => {
    updateKycProgress(1, formData);
    setCurrentKycStep(2);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">BVN</label>
        <input 
          type="text" 
          placeholder="Enter BVN" 
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          value={formData.bvn}
          onChange={(e) => setFormData({...formData, bvn: e.target.value})}
        />
        
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
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input 
            type="text" 
            placeholder="First Name" 
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input 
            type="text" 
            placeholder="Last Name" 
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Birth date</label>
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
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Residential Address</label>
        <input 
          type="text" 
          placeholder="Address" 
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
        />
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
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input 
            type="text" 
            placeholder="City" 
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            value={formData.city}
            onChange={(e) => setFormData({...formData, city: e.target.value})}
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button 
          onClick={handleNext}
          className="bg-blue-600 text-white font-medium py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Proceed
        </button>
      </div>
    </div>
  );
}
