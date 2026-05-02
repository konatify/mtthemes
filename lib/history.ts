const KEY = 'mtthemes_viewed';
const MAX = 40;

export function recordView(themeId: string): void {
  if (typeof window === 'undefined') return;
  const existing = getViewedIds();
  // Move to front (most recent), deduplicate
  const updated = [themeId, ...existing.filter(id => id !== themeId)].slice(0, MAX);
  localStorage.setItem(KEY, JSON.stringify(updated));
}

export function getViewedIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
