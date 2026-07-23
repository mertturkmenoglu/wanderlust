import { defineCacheOptions } from '@/lib/define-cache-options';

export const cacheOptions = defineCacheOptions({
	namespace: 'places',
	keys: {
		get: (id: string) => `get:${id}`,
	},
	ttl: {
		get: '1h',
	},
	grace: {
		get: '1h',
	},
});
