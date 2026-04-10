'use client';

import { useCreateProjectStore } from '@/lib/store/useCreateProjectStore';
import { Building2 } from 'lucide-react';

export default function ProjectEmptyState() {
  const openWizard = useCreateProjectStore((s) => s.openWizard);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-xl">
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
        <Building2 className="w-8 h-8 text-blue-300" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">No Listings Yet!</h3>
      <p className="text-gray-500 text-sm mb-6">Your listed projects will appear here. Create your first project to get started.</p>
      <button
        onClick={openWizard}
        className="bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        + New Listing
      </button>
    </div>
  );
}
