export function compact(n: number): string {
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
}

export function yearsAgo(year: number): string {
  const diff = new Date().getFullYear() - year;
  if (diff <= 0) return 'this year';
  return `${diff} year${diff === 1 ? '' : 's'} ago`;
}

export function timeAgo(iso: string): string {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  const steps: [number, string][] = [
    [31536000, 'year'], [2592000, 'month'], [604800, 'week'], [86400, 'day'], [3600, 'hour'], [60, 'minute'],
  ];
  for (const [secs, unit] of steps) {
    if (s >= secs) {
      const n = Math.floor(s / secs);
      return `${n} ${unit}${n === 1 ? '' : 's'} ago`;
    }
  }
  return 'just now';
}

/** Seconds → "m:ss" like a video timestamp. */
export function clock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
