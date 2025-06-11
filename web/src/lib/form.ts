function lengthTracker(s: string | undefined, max: number): string {
  return `${s?.length ?? 0}/${max}`;
}

function truncateWithEllipses(s: string, max: number): string {
  return s.length > max ? s.slice(0, max) + '...' : s;
}

export { lengthTracker, truncateWithEllipses };
