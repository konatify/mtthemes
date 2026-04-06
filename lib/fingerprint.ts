// Generates a stable anonymous ID stored in localStorage.
// This isn't foolproof but prevents accidental spam-liking.
export function getFingerprint(): string {
  if (typeof window === 'undefined') return '';
  const key = 'mtthemes_fp';
  let fp = localStorage.getItem(key);
  if (!fp) {
    fp = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(key, fp);
  }
  return fp;
}
