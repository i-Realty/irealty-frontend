'use client';

import { Check, Phone } from 'lucide-react';

interface PlanCard {
  name: string;
  tagline: string;
  audience: string;
  pricing: string;
  pricingSub: string;
  features: string[];
  fullWidth?: boolean;
}

const PLANS: PlanCard[] = [
  {
    name: 'Basic Plan',
    tagline: '"Search & Secure"',
    audience: 'First-time buyers',
    pricing: '₦200K - ₦350K',
    pricingSub: 'OR 1.5-2% of property value',
    features: [
      'Curated property shortlist (up to 3 options)',
      'Virtual inspection (video tours)',
      'Basic document verification',
      'Escrow payment processing',
    ],
  },
  {
    name: 'Standard Plan',
    tagline: '"Verified Purchase"',
    audience: 'Full due diligence',
    pricing: '2.5% - 3%',
    pricingSub: 'of property value',
    features: [
      'Everything in Basic Plan',
      'Full legal due diligence & title perfection',
      'Physical inspection by i-Realty team',
      'Seller/agent verification',
      'Secure handover of documents & keys',
    ],
  },
  {
    name: 'Premium Plan',
    tagline: '"Investor Pack"',
    audience: 'ROI focused',
    pricing: '3% - 4%',
    pricingSub: 'of property value + management fees',
    features: [
      'Everything in Standard Plan',
      'ROI analysis & investment report',
      'Negotiation & price review',
      'End-to-end project supervision',
      'Tenant placement or short-let setup',
    ],
  },
  {
    name: 'Concierge Plan',
    tagline: '"End-to-End Management"',
    audience: 'Hands-off',
    pricing: 'Monthly/Yearly',
    pricingSub: 'Retainer subscription model',
    features: [
      'Everything in Premium Plan',
      'Personal relationship manager',
      'Ongoing property management & rent collection',
      'Family liaison services',
      'Annual property health reports',
    ],
  },
];

export default function DiasporaServiceCatalogPage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className="bg-white border border-gray-100 rounded-xl p-6 md:p-8 shadow-sm flex flex-col"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <p className="text-sm text-gray-400 mt-0.5">
                {plan.tagline} - {plan.audience}
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-3">{plan.pricing}</p>
              <p className="text-xs text-gray-400 mt-1">{plan.pricingSub}</p>
            </div>

            {/* Features */}
            <div className="space-y-3 flex-1 mb-6">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
              <Phone className="w-4 h-4" /> Book A Free Consultation
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
