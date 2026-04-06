'use client';

import { use, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdminDashboardStore } from '@/lib/store/useAdminDashboardStore';
import { ArrowLeft, CheckCircle2, XCircle, ShieldCheck, ShieldOff, Clock } from 'lucide-react';

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const {
    selectedUser: user, isLoading, isActionLoading,
    fetchUserByIdMock, approveKycMock, rejectKycMock, suspendUserMock, reactivateUserMock,
  } = useAdminDashboardStore();

  useEffect(() => {
    fetchUserByIdMock(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoading || !user) {
    return <div className="flex h-64 items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
  }

  const kycColor = user.kycStatus === 'verified' ? 'text-green-600' : user.kycStatus === 'in-progress' ? 'text-amber-600' : 'text-gray-500';
  const isActive = user.accountStatus === 'active';

  const getDocIcon = (status: string) => {
    if (status === 'verified') return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (status === 'submitted') return <Clock className="w-4 h-4 text-amber-500" />;
    if (status === 'rejected') return <XCircle className="w-4 h-4 text-red-500" />;
    return <Clock className="w-4 h-4 text-gray-300" />;
  };

  const getStatusStyle = (status: string) => {
    switch (status) { case 'Pending': return 'text-amber-600'; case 'Completed': return 'text-green-600'; case 'Declined': return 'text-red-500'; case 'In-progress': return 'text-blue-600'; default: return 'text-gray-600'; }
  };

  return (
    <div className="space-y-6 pb-12">
      <button onClick={() => router.push('/dashboard/admin/users')} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
          <Image src={user.avatarUrl} alt={user.name} width={80} height={80} className="w-20 h-20 rounded-full object-cover border-2 border-gray-100 mb-3" />
          <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-full font-medium">{user.role}</span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium border capitalize ${isActive ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-500 border-red-100'}`}>{user.accountStatus}</span>
          </div>
          <div className="w-full mt-6 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-400">Phone</span><span className="text-gray-900 font-medium">{user.phone}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Joined</span><span className="text-gray-900 font-medium">{user.joinDate}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Last Login</span><span className="text-gray-900 font-medium">{user.lastLogin}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Total Listings</span><span className="text-gray-900 font-medium">{user.totalListings}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Total Transactions</span><span className="text-gray-900 font-medium">{user.totalTransactions}</span></div>
          </div>
          <div className="w-full mt-6 pt-4 border-t border-gray-100">
            {isActive ? (
              <button onClick={() => suspendUserMock(user.id)} disabled={isActionLoading} className="w-full border border-red-200 text-red-600 font-medium py-2.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                <ShieldOff className="w-4 h-4" /> Suspend Account
              </button>
            ) : (
              <button onClick={() => reactivateUserMock(user.id)} disabled={isActionLoading} className="w-full bg-green-600 text-white font-medium py-2.5 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                <ShieldCheck className="w-4 h-4" /> Reactivate Account
              </button>
            )}
          </div>
        </div>

        {/* KYC + Transactions */}
        <div className="lg:col-span-2 space-y-6">
          {/* KYC Review */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">KYC Verification</h3>
              <span className={`text-sm font-bold capitalize ${kycColor}`}>{user.kycStatus}</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${user.kycProgress}%` }} />
            </div>

            {/* Documents */}
            <div className="space-y-3">
              {user.kycDocuments.map((doc) => (
                <div key={doc.step} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    {getDocIcon(doc.status)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.step}</p>
                      {doc.data && <p className="text-xs text-gray-400 mt-0.5">{doc.data}</p>}
                    </div>
                  </div>
                  <span className={`text-xs font-medium capitalize ${doc.status === 'verified' ? 'text-green-600' : doc.status === 'submitted' ? 'text-amber-600' : doc.status === 'rejected' ? 'text-red-500' : 'text-gray-400'}`}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>

            {/* KYC Actions */}
            {user.kycStatus === 'in-progress' && (
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button onClick={() => approveKycMock(user.id)} disabled={isActionLoading} className="flex-1 bg-green-600 text-white font-medium py-2.5 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm">
                  Approve KYC
                </button>
                <button onClick={() => rejectKycMock(user.id)} disabled={isActionLoading} className="flex-1 border border-red-200 text-red-600 font-medium py-2.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 text-sm">
                  Reject KYC
                </button>
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Recent Transactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500">
                    <th className="py-3 px-5 font-medium">ID</th>
                    <th className="py-3 px-5 font-medium">Type</th>
                    <th className="py-3 px-5 font-medium">Amount</th>
                    <th className="py-3 px-5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {user.recentTransactions.length === 0 ? (
                    <tr><td colSpan={4} className="py-8 text-center text-gray-400">No transactions</td></tr>
                  ) : user.recentTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-3 px-5 text-gray-900 font-medium">{tx.id}</td>
                      <td className="py-3 px-5 text-gray-500">{tx.type}</td>
                      <td className="py-3 px-5 text-gray-900">₦{tx.amount.toLocaleString()}</td>
                      <td className="py-3 px-5"><span className={`font-medium ${getStatusStyle(tx.status)}`}>{tx.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
