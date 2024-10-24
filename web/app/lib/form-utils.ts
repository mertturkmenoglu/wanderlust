export function lengthTracker(s: string | undefined, max: number): string {
  return `${s?.length ?? 0}/${max}`;
}
