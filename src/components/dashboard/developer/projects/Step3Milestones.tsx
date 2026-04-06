'use client';

import { useCreateProjectStore } from '@/lib/store/useCreateProjectStore';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function Step3Milestones() {
  const { milestones, addMilestone, updateMilestone, removeMilestone, prevStep, nextStep } = useCreateProjectStore();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const total = milestones.reduce((sum, m) => sum + m.percentageOfTotal, 0);
  const isValid = milestones.length >= 1 && milestones.every((m) => m.name) && total === 100;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Payment Milestones</h2>
        <p className="text-sm text-gray-500 mt-1">Customize payment stages and percentages for this project</p>
      </div>

      {/* Milestone Cards */}
      <div className="space-y-3">
        {milestones.map((milestone, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {milestone.name || 'Untitled Milestone'}
                  </span>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Milestone Name</label>
                    <input
                      type="text"
                      placeholder="Enter Milestone Name"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={milestone.name}
                      onChange={(e) => updateMilestone(index, { name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Milestone Description</label>
                    <textarea
                      placeholder="What does this milestone cover?"
                      rows={2}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      value={milestone.description}
                      onChange={(e) => updateMilestone(index, { description: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Percentage of Total Price</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="0"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={milestone.percentageOfTotal || ''}
                      onChange={(e) => updateMilestone(index, { percentageOfTotal: Number(e.target.value) })}
                    />
                  </div>

                  {milestones.length > 1 && (
                    <button
                      onClick={() => { removeMilestone(index); setOpenIndex(null); }}
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors mx-auto"
                    >
                      <Trash2 className="w-4 h-4" /> Delete Milestone
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Milestone */}
      <button
        onClick={addMilestone}
        className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-700 transition-colors"
      >
        + Add Another
      </button>

      {/* Percentage Total Indicator */}
      <div className={`text-sm font-medium ${total === 100 ? 'text-green-600' : 'text-amber-600'}`}>
        Total: {total}% {total !== 100 && '(must equal 100%)'}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button onClick={prevStep} className="text-gray-600 font-medium py-3 px-6 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          Back
        </button>
        <button
          onClick={nextStep}
          disabled={!isValid}
          className={`font-medium py-3 px-8 rounded-lg transition-colors ${
            isValid ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-300 text-white cursor-not-allowed'
          }`}
        >
          Proceed
        </button>
      </div>
    </div>
  );
}
