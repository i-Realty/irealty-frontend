'use client';

import { useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { getRoleFromPath } from '@/config/nav';
import { useAgentDashboardStore } from '@/lib/store/useAgentDashboardStore';
import { useDeveloperDashboardStore } from '@/lib/store/useDeveloperDashboardStore';
import { UploadCloud, File, Trash2, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

interface DocumentSection {
  key: string;
  label: string;
  optional?: boolean;
}

const DOCUMENT_SECTIONS: DocumentSection[] = [
  { key: 'cac', label: 'CAC Registration Certificate' },
  { key: 'tin', label: 'Tax Identification Number (TIN)' },
  { key: 'developer-license', label: 'Developer License' },
  { key: 'c-of-o', label: 'Certificate of Occupancy (C of O)' },
  { key: 'signatory-id', label: 'Authorized Signatory ID', optional: true },
  { key: 'proof-of-address', label: 'Proof of Company Address' },
];

interface SectionData {
  idNumber: string;
  fileName: string;
  completed: boolean;
}

export default function StepIDVerificationDeveloper() {
  const pathname = usePathname();
  const role = getRoleFromPath(pathname ?? '');
  const agentStore = useAgentDashboardStore();
  const devStore = useDeveloperDashboardStore();
  const store = role === 'Developer' ? devStore : agentStore;

  const [openSection, setOpenSection] = useState<string | null>(null);
  const [sectionData, setSectionData] = useState<Record<string, SectionData>>(
    Object.fromEntries(
      DOCUMENT_SECTIONS.map((s) => [s.key, { idNumber: '', fileName: '', completed: false }])
    )
  );
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeUploadSection = useRef<string | null>(null);

  const toggleSection = (key: string) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  const updateSection = (key: string, field: keyof SectionData, value: string | boolean) => {
    setSectionData((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const handleFileClick = (sectionKey: string) => {
    activeUploadSection.current = sectionKey;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = activeUploadSection.current;
    if (key && e.target.files && e.target.files.length > 0) {
      updateSection(key, 'fileName', e.target.files[0].name);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (key: string) => {
    updateSection(key, 'fileName', '');
  };

  const markDone = (key: string) => {
    const data = sectionData[key];
    if (data.idNumber && data.fileName) {
      updateSection(key, 'completed', true);
      setOpenSection(null);
    }
  };

  const requiredSections = DOCUMENT_SECTIONS.filter((s) => !s.optional);
  const allRequiredComplete = requiredSections.every((s) => sectionData[s.key].completed);
  const canProceed = allRequiredComplete && agreedToTerms;

  const handleNext = () => {
    if (canProceed) {
      store.updateKycProgress(3);
      store.setCurrentKycStep(4);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">ID verification</h2>
        <p className="text-sm text-gray-500 mt-1 mb-4">Please provide a valid means of identification</p>
      </div>

      {/* Hidden file input */}
      <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*,.pdf" />

      {/* Accordion Sections */}
      {DOCUMENT_SECTIONS.map((section) => {
        const data = sectionData[section.key];
        const isOpen = openSection === section.key;

        return (
          <div key={section.key} className="border border-gray-200 rounded-xl overflow-hidden">
            {/* Accordion Header */}
            <button
              onClick={() => toggleSection(section.key)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {data.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
                )}
                <span className="text-sm font-medium text-gray-900">
                  {section.label}
                  {section.optional && <span className="text-gray-400">(Optional)</span>}
                </span>
              </div>
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {/* Accordion Content */}
            {isOpen && (
              <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Identification Number</label>
                  <input
                    type="text"
                    placeholder="Enter Identification Number"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    value={data.idNumber}
                    onChange={(e) => updateSection(section.key, 'idNumber', e.target.value)}
                  />
                </div>

                {/* Upload Zone */}
                {!data.fileName ? (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleFileClick(section.key)}
                  >
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm mb-2">
                      <UploadCloud className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Drop your documents here, or <span className="text-blue-600 font-medium">click to upload</span>
                    </p>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
                        <File className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{data.fileName}</p>
                        <p className="text-xs text-gray-500">200 KB &mdash; 20% uploaded</p>
                      </div>
                    </div>
                    <button onClick={() => removeFile(section.key)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => markDone(section.key)}
                    disabled={!data.idNumber || !data.fileName}
                    className={`font-medium py-2.5 px-6 rounded-lg text-sm transition-colors ${
                      data.idNumber && data.fileName
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-300 text-white cursor-not-allowed'
                    }`}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Terms Checkbox */}
      <label className="flex items-start gap-3 cursor-pointer pt-2">
        <input
          type="checkbox"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-600">
          I agree to i-Realty&apos;s{' '}
          <span className="text-blue-600 underline">Term&apos;s of Service</span> and{' '}
          <span className="text-blue-600 underline">Privacy Policy</span>
        </span>
      </label>

      {/* Proceed Button */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`font-medium py-3 px-8 rounded-lg transition-colors ${
            canProceed
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-blue-300 text-white cursor-not-allowed'
          }`}
        >
          Proceed
        </button>
      </div>
    </div>
  );
}
