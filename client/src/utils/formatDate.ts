/**
 * Format an ISO date string (yyyy-mm-dd) to a rich display format.
 * Example: "Thu, Apr 16, 2026"
 */
export function formatDate(isoDate: string): string {
  if (!isoDate) return '';
  const date = new Date(isoDate + 'T00:00:00');
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Short format without weekday: "Apr 16, 2026"
 */
export function formatDateShort(isoDate: string): string {
  if (!isoDate) return '';
  const date = new Date(isoDate + 'T00:00:00');
  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
