export function lengthTracker(s: string | undefined, max: number) {
  return `${s?.length ?? 0}/${max}`;
}
