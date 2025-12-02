export const buckets = [
	// Add buckets here
	'default',
	'profile-images',
	'banner-images',
	'reviews',
] as const;

export const Buckets: Record<string, Bucket> = Object.fromEntries(
	buckets.map((b) => [b, b]),
);

export type Bucket = (typeof buckets)[number];
