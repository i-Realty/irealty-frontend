'use client';

import { usePathname } from 'next/navigation';
import { getRoleFromPath } from '@/config/nav';
import { useAgentDashboardStore } from '@/lib/store/useAgentDashboardStore';
import { useDeveloperDashboardStore } from '@/lib/store/useDeveloperDashboardStore';

/**
 * Role-aware hook that returns KYC-related actions from the correct dashboard store.
 * Used by all KYC step components so they work for both agent and developer dashboards.
 */
export function useKYCStore() {
  const pathname = usePathname();
  const role = getRoleFromPath(pathname ?? '');

  const agentStore = useAgentDashboardStore();
  const devStore = useDeveloperDashboardStore();

  if (role === 'Developer') {
    return {
      setCurrentKycStep: devStore.setCurrentKycStep,
      updateKycProgress: devStore.updateKycProgress,
      setKycModalOpen: devStore.setKycModalOpen,
      profile: devStore.profile,
      role,
    };
  }

  return {
    setCurrentKycStep: agentStore.setCurrentKycStep,
    updateKycProgress: agentStore.updateKycProgress,
    setKycModalOpen: agentStore.setKycModalOpen,
    profile: agentStore.profile,
    role,
  };
}
