'use client';

import { useState } from 'react';
import { Download, Check } from 'lucide-react';
import { exportToCsv } from '@/lib/utils/csvExport';

interface AuditEntry {
  timestamp: string;
  action: string;
  by: string;
}

interface Props {
  /** What type of data is being exported */
  type: 'transactions' | 'users' | 'properties' | 'audit';
  /** The data to export */
  data: Record<string, unknown>[];
  /** Column definitions for CSV */
  columns: { key: string; label: string }[];
  /** Button label */
  label?: string;
}

export default function AuditTrailExport({ type, data, columns, label }: Props) {
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    exportToCsv(`irealty_${type}`, data, columns as { key: keyof Record<string, unknown>; label: string }[]);
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  return (
    <button
      onClick={handleExport}
      disabled={data.length === 0}
      className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
        exported
          ? 'border-green-400 bg-green-50 text-green-700'
          : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
    >
      {exported ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
      {exported ? 'Exported!' : (label ?? 'Export CSV')}
    </button>
  );
}

/** Convenience component for exporting audit logs */
export function AuditLogExport({ auditLog }: { auditLog: AuditEntry[] }) {
  return (
    <AuditTrailExport
      type="audit"
      data={auditLog as unknown as Record<string, unknown>[]}
      columns={[
        { key: 'timestamp', label: 'Timestamp' },
        { key: 'action', label: 'Action' },
        { key: 'by', label: 'Performed By' },
      ]}
      label="Export Audit Log"
    />
  );
}
