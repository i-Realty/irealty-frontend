'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTransactionsStore } from '@/lib/store/useTransactionsStore';
import TransactionTimeline from '@/components/dashboard/agent/transactions/TransactionTimeline';
import {
  ArrowLeft,
  MessageCircle,
  Flag,
  ArrowRight,
  CheckCircle2,
  BedDouble,
  Bath,
  Maximize2,
} from 'lucide-react';

// ── Status Badge ───────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string }> = {
    Pending: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-600' },
    'In-progress': { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-600' },
    Completed: { bg: 'bg-green-50 border-green-200', text: 'text-green-600' },
    Declined: { bg: 'bg-red-50 border-red-200', text: 'text-red-500' },
  };
  const c = config[status] || config.Pending;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text}`}
    >
      {status}
    </span>
  );
}

// ── Summary Card ───────────────────────────────────────────────────────

function SummaryCard({
  escrowAmount,
  propertyPrice,
  irealtyFee,
  isPendingStep1,
}: {
  escrowAmount: number;
  propertyPrice: number;
  irealtyFee?: number;
  isPendingStep1: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-5 space-y-3.5 transition-colors ${
        isPendingStep1
          ? 'bg-blue-50/60 border border-blue-200'
          : 'bg-gray-50 border border-gray-100'
      }`}
    >
      <h4 className="text-sm font-bold text-gray-900">Summary</h4>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Funded Escrow Protection</span>
        <span className="text-sm font-bold text-gray-900">
          ₦{escrowAmount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Property price</span>
        <span className="text-sm font-bold text-gray-900">
          ₦{propertyPrice.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
        </span>
      </div>
      {irealtyFee !== undefined && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">i-Realty fee</span>
          <span className="text-sm font-bold text-gray-900">
            ₦{irealtyFee.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </span>
        </div>
      )}
    </div>
  );
}

// ── Client Card ────────────────────────────────────────────────────────

function ClientCard({
  name,
  avatar,
  verified,
}: {
  name: string;
  avatar: string;
  verified: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 flex flex-col items-center text-center shadow-sm">
      <h4 className="text-sm font-bold text-gray-900 mb-3">Client</h4>
      <div className="relative mb-2">
        <Image
          src={avatar}
          alt={name}
          width={56}
          height={56}
          className="rounded-full object-cover w-14 h-14"
        />
        {verified && (
          <CheckCircle2 className="w-5 h-5 text-green-500 absolute -right-0.5 bottom-0 bg-white rounded-full" />
        )}
      </div>
      <p className="text-sm font-semibold text-gray-900 mb-3">
        {name}{' '}
        {verified && (
          <CheckCircle2 className="w-4 h-4 text-green-500 inline-block ml-0.5 -mt-0.5" />
        )}
      </p>
      <button className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
        <MessageCircle className="w-4 h-4" />
        Chat Client
      </button>
    </div>
  );
}

// ── Report Transaction Link ────────────────────────────────────────────

function ReportTransactionLink() {
  return (
    <button className="flex items-center justify-between w-full group py-2">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
          <Flag className="w-4 h-4 text-red-500" />
        </div>
        <span className="text-sm font-semibold text-red-500 group-hover:text-red-600 transition-colors">
          Report Transaction
        </span>
      </div>
      <ArrowRight className="w-4 h-4 text-red-400 group-hover:translate-x-0.5 transition-transform" />
    </button>
  );
}

// ── Property Card (Details Tab) ────────────────────────────────────────

function PropertyCard({
  image,
  tag,
  name,
  location,
  price,
  beds,
  baths,
  sqm,
}: {
  image: string;
  tag: string;
  name: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  sqm: number;
}) {
  return (
    <div className="max-w-sm">
      <div className="relative rounded-xl overflow-hidden mb-4 aspect-[4/3]">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 384px"
        />
        <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-md">
          {tag}
        </span>
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-0.5">
        Residential Plot – GRA Enugu
      </h3>
      <p className="text-sm text-gray-400 mb-2">{location}</p>
      <p className="text-lg font-bold text-gray-900 mb-3">
        ₦ {price.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
      </p>
      <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
        {beds > 0 && (
          <span className="flex items-center gap-1">
            <BedDouble className="w-3.5 h-3.5" />
            {beds} bed
          </span>
        )}
        {baths > 0 && (
          <span className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5" />
            {baths} bath
          </span>
        )}
        <span className="flex items-center gap-1">
          <Maximize2 className="w-3.5 h-3.5" />
          {sqm} sqm
        </span>
      </div>
    </div>
  );
}

// ── Page Component ─────────────────────────────────────────────────────

export default function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const {
    selectedTransaction: tx,
    isLoading,
    isActionLoading,
    fetchTransactionByIdMock,
    acceptTransactionMock,
    declineTransactionMock,
    confirmHandoverMock,
  } = useTransactionsStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');

  useEffect(() => {
    if (id) fetchTransactionByIdMock(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ── Loading State ──────────────────────────────────────────────────

  if (isLoading || !tx) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isPendingStep1 = tx.status === 'Pending' && tx.currentStep === 1;

  // ── Render ─────────────────────────────────────────────────────────

  return (
    <div className="space-y-5 pb-12 w-full animate-in fade-in duration-300">
      {/* Back Navigation */}
      <button
        onClick={() => router.push('/dashboard/agent/transactions')}
        className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      {/* Title + Status Badge */}
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{tx.id}</h1>
        <StatusBadge status={tx.status} />
      </div>

      {/* Overview / Details Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`py-3 px-5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'details'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          Details
        </button>
      </div>

      {/* ── Overview Tab ──────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-in fade-in duration-200">
          {/* Timeline (left ~60%) */}
          <div className="lg:col-span-3">
            <TransactionTimeline
              transaction={tx}
              onAccept={() => acceptTransactionMock(tx.id)}
              onDecline={() => declineTransactionMock(tx.id)}
              onConfirmHandover={() => confirmHandoverMock(tx.id)}
              isActionLoading={isActionLoading}
            />
          </div>

          {/* Sidebar (right ~40%) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Summary */}
            <SummaryCard
              escrowAmount={tx.escrowAmount}
              propertyPrice={tx.propertyPrice}
              irealtyFee={tx.status === 'Completed' ? tx.irealtyFee : undefined}
              isPendingStep1={isPendingStep1}
            />

            {/* Client */}
            <ClientCard
              name={tx.clientName}
              avatar={tx.clientAvatar}
              verified={tx.clientVerified}
            />

            {/* Report */}
            <div className="px-1">
              <ReportTransactionLink />
            </div>
          </div>
        </div>
      )}

      {/* ── Details Tab ───────────────────────────────────────────── */}
      {activeTab === 'details' && (
        <div className="animate-in fade-in duration-200">
          <PropertyCard
            image={tx.propertyImage || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=600&auto=format&fit=crop'}
            tag={tx.propertyTag}
            name={tx.propertyName}
            location={tx.propertyLocation}
            price={tx.propertyFullPrice}
            beds={tx.propertyBeds}
            baths={tx.propertyBaths}
            sqm={tx.propertySqm}
          />
        </div>
      )}
    </div>
  );
}
