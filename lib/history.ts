const KEY = 'mtthemes_viewed';
const MAX = 40;

export function recordView(themeId: string): void {
  if (typeof window === 'undefined') return;
  const existing = getViewedIds();
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

export function extractColors(link: string): string[] {
  try {
    const match = link.match(/customTheme=([^&]+)/);
    if (!match) return [];
    const decoded = atob(decodeURIComponent(match[1]));
    const parsed = JSON.parse(decoded);
    return Array.isArray(parsed.c) ? parsed.c : [];
  } catch {
    return [];
  }
}

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h * 360, s, l];
}

function hslDistance(a: [number, number, number], b: [number, number, number]): number {
  const dh = Math.min(Math.abs(a[0] - b[0]), 360 - Math.abs(a[0] - b[0])) / 180;
  const ds = Math.abs(a[1] - b[1]);
  const dl = Math.abs(a[2] - b[2]);
  return dh * 0.5 + ds * 0.35 + dl * 0.15;
}

function averagePalette(colors: string[]): [number, number, number] {
  if (colors.length === 0) return [0, 0, 0];
  const hsls = colors.map(hexToHsl);
  const sinSum = hsls.reduce((s, h) => s + Math.sin((h[0] * Math.PI) / 180), 0);
  const cosSum = hsls.reduce((s, h) => s + Math.cos((h[0] * Math.PI) / 180), 0);
  const avgHue = ((Math.atan2(sinSum, cosSum) * 180) / Math.PI + 360) % 360;
  const avgSat = hsls.reduce((s, h) => s + h[1], 0) / hsls.length;
  const avgLit = hsls.reduce((s, h) => s + h[2], 0) / hsls.length;
  return [avgHue, avgSat, avgLit];
}

export function colorSimilarityScore(link: string, viewedLinks: string[]): number {
  const colors = extractColors(link);
  if (colors.length === 0 || viewedLinks.length === 0) return 0;

  const thisPalette = averagePalette(colors);
  const viewedPalettes = viewedLinks
    .map(l => extractColors(l))
    .filter(c => c.length > 0)
    .map(averagePalette);

  if (viewedPalettes.length === 0) return 0;

  const avgDist =
    viewedPalettes.reduce((sum, p) => sum + hslDistance(thisPalette, p), 0) /
    viewedPalettes.length;

  return 1 - avgDist;
}
