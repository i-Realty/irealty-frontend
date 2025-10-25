// small favorites helper using localStorage
export function getFavorites(): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('favorites');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isFavorited(id: number): boolean {
  return getFavorites().includes(id);
}

export function setFavorite(id: number, value: boolean): void {
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  if (value && idx === -1) favs.push(id);
  if (!value && idx !== -1) favs.splice(idx, 1);
  try { localStorage.setItem('favorites', JSON.stringify(favs)); } catch {}
  // emit simple event so other components can listen
  try { window.dispatchEvent(new CustomEvent('favorites-changed', { detail: { id, favorited: value } })); } catch {}
}

export function toggleFavorite(id: number): boolean {
  const currently = isFavorited(id);
  setFavorite(id, !currently);
  return !currently;
}
