'use client';

import { useState } from 'react';
import { Check, Phone, X, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';

interface PlanCard {
  name: string;
  tagline: string;
  audience: string;
  pricing: string;
  pricingSub: string;
  features: string[];
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

// ── Consultation Booking Modal ─────────────────────────────────────────

function ConsultationModal({ planName, onClose }: { planName: string; onClose: () => void }) {
  const user = useAuthStore((s) => s.user);
  const [name, setName] = useState(user?.displayName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !date) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Phone className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Book a Free Consultation</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {done ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Consultation Booked!</h3>
            <p className="text-sm text-gray-500">
              Your free consultation for the <span className="font-semibold">{planName}</span> is confirmed for{' '}
              <span className="font-semibold">{new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>.
              Our team will reach out to you at <span className="font-semibold">{email}</span>.
            </p>
            <button onClick={onClose} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="bg-blue-50/60 rounded-xl px-4 py-3 text-sm">
              <span className="text-gray-500">Selected plan: </span>
              <span className="font-semibold text-blue-700">{planName}</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your full name"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Preferred Date</label>
                <input
                  type="date"
                  value={date}
                  min={today}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Notes (optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you're looking for..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !name || !email || !date}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" />Booking…</> : 'Confirm Booking'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────

export default function DiasporaServiceCatalogPage() {
  const [bookingPlan, setBookingPlan] = useState<string | null>(null);

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
            <button
              onClick={() => setBookingPlan(plan.name)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Phone className="w-4 h-4" /> Book A Free Consultation
            </button>
          </div>
        ))}
      </div>

      {bookingPlan && (
        <ConsultationModal planName={bookingPlan} onClose={() => setBookingPlan(null)} />
      )}
    </div>
  );
}
