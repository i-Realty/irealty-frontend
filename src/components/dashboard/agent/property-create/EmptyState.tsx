import { Home, Plus } from 'lucide-react';
import { useCreatePropertyStore } from '@/lib/store/useCreatePropertyStore';

export default function EmptyState() {
  const { openWizard } = useCreatePropertyStore();

  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-100 min-h-[400px]">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
        <Home className="w-10 h-10 text-blue-600" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">No Listings Yet!</h3>
      <p className="text-sm text-gray-500 mb-6">All listings will be displayed here</p>
      <button 
        onClick={openWizard}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
      >
        <Plus className="w-5 h-5" />
        New Listing
      </button>
    </div>
  );
}
