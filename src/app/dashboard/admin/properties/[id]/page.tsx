'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAdminDashboardStore, type AdminProperty } from '@/lib/store/useAdminDashboardStore';
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle, Loader2, MapPin, User, Tag, Calendar, DollarSign } from 'lucide-react';

function StatusBadge({ status }: { status: AdminProperty['moderationStatus'] }) {
  const map: Record<string, string> = {
    'Verified':      'bg-green-50 text-green-600 border-green-100',
    'Pending Review':'bg-amber-50 text-amber-600 border-amber-100',
    'Rejected':      'bg-red-50 text-red-500 border-red-100',
    'Flagged':       'bg-orange-50 text-orange-600 border-orange-100',
  };
  return <span className={`text-xs font-semibold border px-2.5 py-1 rounded-full ${map[status] ?? 'bg-gray-100 text-gray-500 border-gray-200'}`}>{status}</span>;
}

export default function AdminPropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { fetchPropertyById, approveProperty, rejectProperty, flagProperty, isActionLoading } = useAdminDashboardStore();
  const [property, setProperty] = useState<AdminProperty | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    setIsLoading(true);
    fetchPropertyById(id).then(p => { setProperty(p); setIsLoading(false); });
  }, [id, fetchPropertyById]);

  const handleAction = async (action: 'approve' | 'flag') => {
    if (!property) return;
    if (action === 'approve') await approveProperty(property.id);
    else await flagProperty(property.id);
    const updated = await fetchPropertyById(id);
    setProperty(updated);
  };

  const handleReject = async () => {
    if (!property) return;
    await rejectProperty(property.id, rejectReason || 'Rejected by admin');
    setShowRejectModal(false);
    setRejectReason('');
    const updated = await fetchPropertyById(id);
    setProperty(updated);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="space-y-4">
        <Link href="/dashboard/admin/properties" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800">
          <ArrowLeft className="w-4 h-4" />Back to Properties
        </Link>
        <div className="bg-white border border-gray-100 rounded-xl p-10 text-center text-gray-400">
          <p className="text-sm">Property not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-12">
      {/* Reject modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowRejectModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-sm mx-4 p-5 shadow-xl animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-gray-900 mb-1">Reject Property</h3>
            <p className="text-sm text-gray-500 mb-3">Provide a reason for rejection (optional):</p>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
              placeholder="e.g. Incomplete listing information, duplicate listing…"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mb-4 focus:outline-none focus:border-blue-400 min-h-[80px] resize-none" />
            <div className="flex gap-3">
              <button onClick={() => setShowRejectModal(false)} className="flex-1 border border-gray-200 text-gray-700 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleReject} disabled={isActionLoading}
                className="flex-1 bg-red-600 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}Reject
              </button>
            </div>
          </div>
        </div>
      )}

      <Link href="/dashboard/admin/properties" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <ArrowLeft className="w-4 h-4" />Back to Properties
      </Link>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        {/* Cover image */}
        {property.image && (
          <div className="relative h-48 bg-gray-100">
            <Image src={property.image} alt={property.title} fill className="object-cover" unoptimized />
          </div>
        )}

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{property.title}</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={property.moderationStatus} />
                <span className="text-sm text-gray-500">{property.type} · {property.category}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {property.moderationStatus !== 'Verified' && (
                <button onClick={() => handleAction('approve')} disabled={isActionLoading}
                  className="flex items-center gap-1.5 text-sm font-medium bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg disabled:opacity-50 transition-colors">
                  {isActionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}Approve
                </button>
              )}
              {property.moderationStatus !== 'Rejected' && (
                <button onClick={() => setShowRejectModal(true)} disabled={isActionLoading}
                  className="flex items-center gap-1.5 text-sm font-medium bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-2 rounded-lg disabled:opacity-50 transition-colors">
                  <XCircle className="w-3.5 h-3.5" />Reject
                </button>
              )}
              {property.moderationStatus !== 'Flagged' && (
                <button onClick={() => handleAction('flag')} disabled={isActionLoading}
                  className="flex items-center gap-1.5 text-sm font-medium bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 px-3 py-2 rounded-lg disabled:opacity-50 transition-colors">
                  <AlertTriangle className="w-3.5 h-3.5" />Flag
                </button>
              )}
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: User,       label: 'Owner',     value: `${property.ownerName} (${property.ownerRole})` },
              { icon: DollarSign, label: 'Price',      value: `₦${property.price.toLocaleString('en-NG')}` },
              { icon: MapPin,     label: 'Location',   value: property.location },
              { icon: Tag,        label: 'Category',   value: property.category },
              { icon: Calendar,   label: 'Date Listed',value: property.dateListed },
              { icon: Tag,        label: 'Type',       value: property.type },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Icon className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{value || '—'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
