import { defineCacheOptions } from '@/lib/define-cache-options';

export const cacheOptions = defineCacheOptions({
	namespace: 'preferences',
	keys: {
		get: (userId: string) => `get:${userId}`,
	},
	ttl: {
		get: '1h',
	},
	grace: {
		get: '1m',
	},
});
