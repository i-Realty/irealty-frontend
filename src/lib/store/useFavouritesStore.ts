import { create } from 'zustand';
import { apiPost, apiGet } from '@/lib/api/client';

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

interface BackendListing {
  id: string;
}

interface FavouritesState {
  likedIds: Set<string>;
  /** Hydrate liked IDs — call after login. In API mode fetches GET /api/listings/liked. */
  hydrate: (ids?: string[]) => Promise<void>;
  /** Optimistic toggle — calls POST /api/listings/{id}/like */
  toggleLike: (id: string) => void;
  isLiked: (id: string) => boolean;
}

export const useFavouritesStore = create<FavouritesState>((set, get) => ({
  likedIds: new Set<string>(),

  hydrate: async (ids?: string[]) => {
    if (USE_API) {
      try {
        const data = await apiGet<BackendListing[]>('/api/listings/liked');
        const fetched = Array.isArray(data) ? data.map(l => String(l.id)) : [];
        set({ likedIds: new Set(fetched) });
      } catch {
        // Non-critical — keep existing set
      }
    } else if (ids) {
      set({ likedIds: new Set(ids.map(String)) });
    }
  },

  toggleLike: (id) => {
    const strId = String(id);

    // Optimistic UI update
    set((s) => {
      const next = new Set(s.likedIds);
      if (next.has(strId)) next.delete(strId); else next.add(strId);
      return { likedIds: next };
    });

    if (!USE_API) return;

    // Fire-and-forget — POST /api/listings/{id}/like toggles server-side
    apiPost(`/api/listings/${strId}/like`, {}).catch(() => {
      // Rollback on failure
      set((s) => {
        const next = new Set(s.likedIds);
        if (next.has(strId)) next.delete(strId); else next.add(strId);
        return { likedIds: next };
      });
    });
  },

  isLiked: (id) => get().likedIds.has(String(id)),
}));
