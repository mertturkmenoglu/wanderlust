export const buckets = [
  // Add buckets here
  "default",
  "avatars",
] as const;

export const Buckets: Record<string, Bucket> = Object.fromEntries(
  buckets.map((b) => [b, b])
);

export type Bucket = (typeof buckets)[number];
