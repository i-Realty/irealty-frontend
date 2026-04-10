'use client';

import { useAuthStore } from '@/lib/store/useAuthStore';
import { Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ROLE_DASHBOARD_MAP: Record<string, string> = {
  'Admin':            '/dashboard/admin',
  'Agent':            '/dashboard/agent',
  'Developer':        '/dashboard/developer',
  'Landlord':         '/dashboard/landlord',
  'Property Seeker':  '/dashboard/seeker',
  'Diaspora':         '/dashboard/diaspora',
};

export default function UnauthorizedPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  const dashboardHref = user ? (ROLE_DASHBOARD_MAP[user.role] ?? '/') : '/auth/login';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <Lock className="w-8 h-8 text-amber-600" />
        </div>

        <h1 className="text-xl font-bold text-gray-900">Access Denied</h1>
        <p className="text-sm text-gray-500 mt-3 leading-relaxed">
          You do not have permission to view this page.
          {user && ` Your account type (${user.role}) is not authorised to access this area.`}
        </p>

        <button
          onClick={() => router.push(dashboardHref)}
          className="mt-6 w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Go to my dashboard
        </button>
      </div>
    </div>
  );
}
