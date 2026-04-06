'use client';

import { useEffect } from 'react';
import { useDocumentsStore } from '@/lib/store/useDocumentsStore';
import DocumentsList from '@/components/dashboard/agent/documents/DocumentsList';
import DocumentWizardContext from '@/components/dashboard/agent/documents/wizard/DocumentWizardContext';

export default function DeveloperDocumentsPage() {
  const { fetchDocumentsListMock, isWizardOpen } = useDocumentsStore();

  useEffect(() => {
    fetchDocumentsListMock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-8 bg-gray-50/20 md:bg-white overflow-y-auto no-scrollbar relative min-h-full">
      <DocumentsList />
      {isWizardOpen && <DocumentWizardContext />}
    </div>
  );
}
