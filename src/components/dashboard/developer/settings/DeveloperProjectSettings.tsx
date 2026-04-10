'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

type MilestoneTemplate = 'Standard' | 'Fast-Track' | 'Custom';

export default function DeveloperProjectSettings() {
  const [defaultMilestone, setDefaultMilestone] = useState<MilestoneTemplate>('Standard');
  const [autoNotifyBuyers, setAutoNotifyBuyers] = useState(true);
  const [escrowReleaseAutomatic, setEscrowReleaseAutomatic] = useState(false);
  const [defaultPaymentSplit, setDefaultPaymentSplit] = useState('30-30-20-20');
  const [virtualTourEnabled, setVirtualTourEnabled] = useState(true);
  const [publicListingsDefault, setPublicListingsDefault] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    setSaved(true);
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-in slide-in-from-right-4 fade-in duration-300">
      <div className="flex flex-col">
        <h2 className="text-[18px] font-bold text-gray-900 tracking-tight mb-1">Project Preferences</h2>
        <p className="text-[13px] font-medium text-gray-400">
          Configure defaults for new project listings and milestone payments.
        </p>
      </div>

      {/* Milestone Templates */}
      <div className="bg-white border border-gray-200 rounded-2xl md:rounded-[24px] p-6 shadow-sm space-y-4">
        <h3 className="text-[15px] font-bold text-gray-900">Default Milestone Template</h3>
        <div className="space-y-2">
          {([
            { id: 'Standard', label: 'Standard', desc: '30% Deposit → 30% Foundation → 20% Roofing → 20% Handover' },
            { id: 'Fast-Track', label: 'Fast-Track', desc: '50% Deposit → 30% Mid-construction → 20% Handover' },
            { id: 'Custom', label: 'Custom', desc: 'Define your own milestone split per project.' },
          ] as { id: MilestoneTemplate; label: string; desc: string }[]).map((opt) => (
            <label key={opt.id} className={`flex items-start gap-3 cursor-pointer p-3 rounded-xl border transition-colors ${defaultMilestone === opt.id ? 'border-blue-200 bg-blue-50/40' : 'border-gray-100 hover:border-gray-200'}`}>
              <input type="radio" name="milestone" checked={defaultMilestone === opt.id} onChange={() => { setDefaultMilestone(opt.id); setSaved(false); }} className="accent-blue-600 w-4 h-4 mt-0.5" />
              <div>
                <p className="text-[14px] font-semibold text-gray-900">{opt.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
        {defaultMilestone === 'Custom' && (
          <div>
            <label className="text-[12px] font-bold text-gray-900 ml-1 block mb-2">Custom Split (e.g. 30-30-20-20)</label>
            <input type="text" value={defaultPaymentSplit}
              onChange={(e) => { setDefaultPaymentSplit(e.target.value); setSaved(false); }}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors" />
          </div>
        )}
      </div>

      {/* Listing & Escrow Preferences */}
      <div className="bg-white border border-gray-200 rounded-2xl md:rounded-[24px] p-6 shadow-sm space-y-4">
        <h3 className="text-[15px] font-bold text-gray-900">Listing & Escrow Preferences</h3>

        {[
          { label: 'Public listings by default', desc: 'New projects are immediately visible on the marketplace.', value: publicListingsDefault, set: setPublicListingsDefault },
          { label: 'Virtual tour enabled by default', desc: 'Prompt to add a virtual tour when creating new projects.', value: virtualTourEnabled, set: setVirtualTourEnabled },
          { label: 'Auto-notify buyers on milestone updates', desc: 'Send buyers a notification when a milestone status changes.', value: autoNotifyBuyers, set: setAutoNotifyBuyers },
          { label: 'Automatic escrow release after milestone approval', desc: 'Release escrow funds automatically when both parties confirm a milestone.', value: escrowReleaseAutomatic, set: setEscrowReleaseAutomatic },
        ].map(({ label, desc, value, set }, i, arr) => (
          <div key={label} className={`flex items-start justify-between gap-4 py-2 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <div>
              <p className="text-[14px] font-semibold text-gray-900">{label}</p>
              <p className="text-[12px] text-gray-400 mt-0.5">{desc}</p>
            </div>
            <button type="button" onClick={() => { set((v) => !v); setSaved(false); }}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${value ? 'bg-blue-600' : 'bg-gray-200'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        {saved && <p className="text-sm text-green-600 font-medium">Preferences saved.</p>}
        <button onClick={handleSave} disabled={isSaving}
          className="ml-auto min-w-[140px] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-[14px] py-2.5 px-6 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
