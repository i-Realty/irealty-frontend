'use client';

import { useToastStore, Toast, ToastType } from '@/lib/store/useToastStore';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

function toastConfig(type: ToastType) {
  switch (type) {
    case 'success':
      return {
        bg: 'bg-green-50 border-green-200',
        text: 'text-green-800',
        Icon: CheckCircle2,
        iconColor: 'text-green-500',
      };
    case 'error':
      return {
        bg: 'bg-red-50 border-red-200',
        text: 'text-red-800',
        Icon: AlertCircle,
        iconColor: 'text-red-500',
      };
    case 'warning':
      return {
        bg: 'bg-amber-50 border-amber-200',
        text: 'text-amber-800',
        Icon: AlertTriangle,
        iconColor: 'text-amber-500',
      };
    default:
      return {
        bg: 'bg-blue-50 border-blue-200',
        text: 'text-blue-800',
        Icon: Info,
        iconColor: 'text-blue-500',
      };
  }
}

function ToastItem({ toast }: { toast: Toast }) {
  const { dismiss } = useToastStore();
  const { bg, text, Icon, iconColor } = toastConfig(toast.type);

  return (
    <div
      className={`flex items-start gap-3 w-full max-w-sm px-4 py-3.5 rounded-xl border shadow-md ${bg} animate-in slide-in-from-right-4 fade-in duration-200`}
    >
      <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColor}`} />
      <p className={`flex-1 text-sm font-medium ${text}`}>{toast.message}</p>
      <button
        onClick={() => dismiss(toast.id)}
        className={`shrink-0 p-0.5 rounded hover:bg-black/10 transition-colors ${text}`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/**
 * Mount this once at the root layout to render toast notifications.
 * The `toast` helper from useToastStore can be called from anywhere —
 * stores, page components, form handlers — without prop drilling.
 */
export default function ToastContainer() {
  const { toasts } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-3 items-end">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}
