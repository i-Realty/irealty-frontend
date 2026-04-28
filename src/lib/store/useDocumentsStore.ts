import { create } from 'zustand';
import { apiGet, apiPost, apiDelete } from '@/lib/api/client';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

export type DocumentItem = {
  id: string;
  title: string;
  dateUpdated: string;
  type: string;
  propertyReference: string;
  size: string;
};

// Central Payload Mapping the Backend API Structure Requirements perfectly
export type DocumentPayload = {
  // Basic Info
  title: string;
  propertyReference: string;
  description: string;

  // Parties
  landlordName: string;
  landlordContact: string;
  tenantName: string;
  tenantContact: string;

  // Financials
  monthlyRent: number;
  securityDeposit: number;
  agencyFee: number;
  legalFee: number;
  leaseDuration: string;
  startDate: string;

  // Custom Checkboxes
  includeUtilities: boolean;
  includePetPolicy: boolean;
  addMaintenance: boolean;
  includeEarlyTermination: boolean;
  addAutoRenewal: boolean;

  // Output Meta Variables
  propertyAddress: string;
  landlordAddress: string;
  tenantAddress: string;
  propertyType: string;
  numberOfOccupants: number;
  paymentDueDate: string;
};

interface DocumentsStore {
  // Directory State
  documents: DocumentItem[];
  isLoadingList: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Wizard Overlay State
  isWizardOpen: boolean;
  wizardStep: 1 | 2 | 3;
  templateType: 'Standard Rental Agreement' | 'Property Sale Agreement' | null;
  formData: Partial<DocumentPayload>;

  // Synchronous State Mutations
  setWizardOpen: (open: boolean) => void;
  setWizardStep: (step: 1 | 2 | 3) => void;
  setTemplateType: (type: 'Standard Rental Agreement' | 'Property Sale Agreement' | null) => void;
  updateFormData: (data: Partial<DocumentPayload>) => void;
  resetWizard: () => void;

  // API-ready async methods
  fetchDocumentsList: () => Promise<void>;
  createDocument: () => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;

  /** @deprecated Use fetchDocumentsList() */
  fetchDocumentsListMock: () => Promise<void>;
  /** @deprecated Use createDocument() */
  createDocumentMock: () => Promise<void>;
  /** @deprecated Use deleteDocument() */
  deleteDocumentMock: (id: string) => Promise<void>;
}

const defaultFormData: Partial<DocumentPayload> = {
  includeUtilities: true,
  includePetPolicy: true,
  addMaintenance: true,
  includeEarlyTermination: false,
  addAutoRenewal: false,
};

export const useDocumentsStore = create<DocumentsStore>((set, get) => ({
  documents: [],
  isLoadingList: false,
  isSubmitting: false,
  error: null,

  isWizardOpen: false,
  wizardStep: 1,
  templateType: null,
  formData: defaultFormData,

  setWizardOpen: (open) => {
    set({ isWizardOpen: open });
    if (!open) get().resetWizard();
  },
  setWizardStep: (step) => set({ wizardStep: step }),
  setTemplateType: (type) => set({ templateType: type }),

  updateFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data }
  })),

  resetWizard: () => set({
    wizardStep: 1,
    templateType: null,
    formData: defaultFormData,
    isSubmitting: false,
    error: null
  }),

  fetchDocumentsList: async () => {
    set({ isLoadingList: true, error: null });
    try {
      if (USE_API) {
        const data = await apiGet<{ documents: DocumentItem[] }>('/api/documents');
        set({ documents: data.documents, isLoadingList: false });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 600));
        const types = ['Standard Rental Agreement', 'Property Sale Agreement', 'Broker Commission Agreement', 'Property Management Agreement', 'Custom'];
        const mockList: DocumentItem[] = Array.from({ length: 7 }, (_, i) => ({
          id: `doc-${i}`,
          title: 'Victoria Island Apartment Rental Agreement',
          dateUpdated: '28 Aug 2025',
          type: types[i] ?? 'Custom',
          propertyReference: '3-Bed Duplex, Lekki',
          size: '4MB',
        }));
        set({ documents: mockList, isLoadingList: false });
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load documents', isLoadingList: false });
    }
  },

  createDocument: async () => {
    const payload = get().formData;
    if (!payload.title || !payload.landlordName) {
      set({ error: 'Please complete all required fields.' });
      return;
    }
    set({ isSubmitting: true, error: null });
    try {
      if (USE_API) {
        const data = await apiPost<{ document: DocumentItem }>('/api/documents', {
          ...payload,
          templateType: get().templateType,
        });
        set((state) => ({
          documents: [data.document, ...state.documents],
          isSubmitting: false,
          isWizardOpen: false,
        }));
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const newDoc: DocumentItem = {
          id: `doc-${Date.now()}`,
          title: payload.title,
          dateUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          type: get().templateType || 'Custom',
          propertyReference: payload.propertyReference || 'Unlinked',
          size: '1MB',
        };
        set((state) => ({
          documents: [newDoc, ...state.documents],
          isSubmitting: false,
          isWizardOpen: false,
        }));
      }
      get().resetWizard();
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to create document', isSubmitting: false });
    }
  },

  deleteDocument: async (id) => {
    set({ isLoadingList: true, error: null });
    try {
      if (USE_API) {
        await apiDelete(`/api/documents/${id}`);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
      set((state) => ({
        documents: state.documents.filter((d) => d.id !== id),
        isLoadingList: false,
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to delete document', isLoadingList: false });
    }
  },

  // Backward-compatible aliases
  fetchDocumentsListMock: async () => get().fetchDocumentsList(),
  createDocumentMock: async () => get().createDocument(),
  deleteDocumentMock: async (id) => get().deleteDocument(id),
}));
