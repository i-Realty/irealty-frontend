import { create } from 'zustand';
import type { PropertyWithCoords } from '@/lib/types';

interface FavouritesState {
  likedIds: Set<number>;
  // Hydrate from API on mount (no localStorage)
  hydrate: (ids: number[]) => void;
  // Optimistic toggle — also calls PATCH /api/listings/:id/favourite
  toggleLike: (id: number) => void;
  isLiked: (id: number) => boolean;
}

export const useFavouritesStore = create<FavouritesState>((set, get) => ({
  likedIds: new Set<number>(),

  hydrate: (ids) => set({ likedIds: new Set(ids) }),

  toggleLike: (id) => {
    // Optimistic UI update
    set((s) => {
      const next = new Set(s.likedIds);
      if (next.has(id)) next.delete(id); else next.add(id);
      return { likedIds: next };
    });
    // Fire-and-forget API call
    const isNowLiked = get().likedIds.has(id);
    fetch(`/api/listings/${id}/favourite`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ favourited: isNowLiked }),
    }).catch(() => {
      // Rollback on failure
      set((s) => {
        const next = new Set(s.likedIds);
        if (isNowLiked) next.delete(id); else next.add(id);
        return { likedIds: next };
      });
    });
  },

  isLiked: (id) => get().likedIds.has(id),
}));
