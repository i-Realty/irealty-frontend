/**
 * Generic CSV export utility.
 * Converts an array of objects to a CSV file and triggers download.
 */

export function exportToCsv<T extends Record<string, unknown>>(
  filename: string,
  data: T[],
  columns: { key: keyof T; label: string }[]
) {
  if (data.length === 0) return;

  const header = columns.map((c) => `"${c.label}"`).join(',');
  const rows = data.map((row) =>
    columns
      .map((c) => {
        const val = row[c.key];
        const str = val === null || val === undefined ? '' : String(val);
        // Escape quotes
        return `"${str.replace(/"/g, '""')}"`;
      })
      .join(',')
  );

  const csv = [header, ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
