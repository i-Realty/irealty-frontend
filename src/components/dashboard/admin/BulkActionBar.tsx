'use client';

import { X, CheckCircle, XCircle, AlertTriangle, Ban, UserCheck } from 'lucide-react';

export type BulkActionType =
  | 'approve'
  | 'reject'
  | 'flag'
  | 'suspend'
  | 'reactivate';

interface Props {
  selectedCount: number;
  onClearSelection: () => void;
  actions: { type: BulkActionType; label: string; onAction: () => void }[];
  isLoading?: boolean;
}

const ACTION_CONFIG: Record<BulkActionType, { icon: typeof CheckCircle; className: string }> = {
  approve: { icon: CheckCircle, className: 'bg-green-600 hover:bg-green-700 text-white' },
  reject: { icon: XCircle, className: 'bg-red-600 hover:bg-red-700 text-white' },
  flag: { icon: AlertTriangle, className: 'bg-orange-500 hover:bg-orange-600 text-white' },
  suspend: { icon: Ban, className: 'bg-red-600 hover:bg-red-700 text-white' },
  reactivate: { icon: UserCheck, className: 'bg-green-600 hover:bg-green-700 text-white' },
};

export default function BulkActionBar({ selectedCount, onClearSelection, actions, isLoading }: Props) {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky top-0 z-40 bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center justify-between gap-4 mb-4 animate-in slide-in-from-top-2 duration-200 shadow-lg">
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold">{selectedCount} selected</span>
        <button
          onClick={onClearSelection}
          className="text-blue-200 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        {actions.map(({ type, label, onAction }) => {
          const { icon: Icon, className } = ACTION_CONFIG[type];
          return (
            <button
              key={type}
              onClick={onAction}
              disabled={isLoading}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${className}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
