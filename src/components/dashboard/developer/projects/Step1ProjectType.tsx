'use client';

import { useCreateProjectStore, DeveloperProjectType } from '@/lib/store/useCreateProjectStore';
import { Home, Building2, Layers } from 'lucide-react';

const PROJECT_TYPES: { type: DeveloperProjectType; icon: typeof Home; description: string }[] = [
  { type: 'Residential', icon: Home, description: 'Houses, Apartments, Condos' },
  { type: 'Commercial', icon: Building2, description: 'Offices, Retail, Warehouses' },
  { type: 'Off-Plan', icon: Layers, description: 'Apartments, Houses / Villas, Condos' },
];

export default function Step1ProjectType() {
  const { projectType, setField, nextStep } = useCreateProjectStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">What type of project are you listing?</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PROJECT_TYPES.map((item) => {
          const Icon = item.icon;
          const isSelected = projectType === item.type;
          return (
            <button
              key={item.type}
              onClick={() => setField('projectType', item.type)}
              className={`flex flex-col items-center justify-center p-6 border rounded-xl transition-all text-center ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <Icon className={`w-8 h-8 mb-2 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className={`text-sm font-bold ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                {item.type}
              </span>
              <span className="text-xs text-gray-500 mt-1">{item.description}</span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={nextStep}
          disabled={!projectType}
          className={`font-medium py-3 px-8 rounded-lg transition-colors ${
            projectType
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
