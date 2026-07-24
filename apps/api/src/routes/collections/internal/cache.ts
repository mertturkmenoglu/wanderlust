import { defineCacheOptions } from '@/lib/define-cache-options';

export const cacheOptions = defineCacheOptions({
	namespace: 'collections',
	keys: {
		forPlace: (placeId: string) => `for-place:${placeId}`,
	},
	grace: {
		forPlace: '1h',
	},
	ttl: {
		forPlace: '24h',
	},
});
