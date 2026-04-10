'use client';

import { useAuthStore } from '@/lib/store/useAuthStore';
import { ShieldX } from 'lucide-react';

export default function SuspendedPage() {
  const { logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <ShieldX className="w-8 h-8 text-red-600" />
        </div>

        <h1 className="text-xl font-bold text-gray-900">Account Suspended</h1>
        <p className="text-sm text-gray-500 mt-3 leading-relaxed">
          Your account has been temporarily suspended by our team. This may be due to a policy violation,
          pending review, or compliance requirement.
        </p>

        <div className="mt-6 bg-gray-50 rounded-xl p-4 text-left text-sm text-gray-600">
          <p className="font-medium text-gray-700 mb-2">What to do next:</p>
          <ul className="space-y-1.5 list-disc pl-4">
            <li>Check your registered email for details about the suspension</li>
            <li>Contact our support team via email at <strong>support@i-realty.ng</strong></li>
            <li>Allow 1–3 business days for review and resolution</li>
          </ul>
        </div>

        <button
          onClick={logout}
          className="mt-6 w-full py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
