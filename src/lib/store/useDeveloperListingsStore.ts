import { createListingsStore } from './useListingsStore';

export const DEVELOPER_TYPES = ['Residential', 'Commercial', 'Off-Plan'];

/** Developer listings store (for /listings/developers) */
export const useDeveloperListingsStore = createListingsStore();
