import { defineCacheOptions } from '@/lib/define-cache-options';

export const cacheOptions = defineCacheOptions({
	namespace: 'reviews',
	keys: {
		placeAssets: (placeId: string) => `places:${placeId}:assets`,
		placeRatings: (placeId: string) => `places:${placeId}:ratings`,
	},
	grace: {
		placeAssets: '30m',
		placeRatings: '30m',
	},
	ttl: {
		placeAssets: '30m',
		placeRatings: '30m',
	},
});
