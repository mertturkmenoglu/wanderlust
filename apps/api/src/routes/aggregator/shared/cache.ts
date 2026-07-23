import { defineCacheOptions } from '@/lib/define-cache-options';

export const cacheOptions = defineCacheOptions({
	namespace: 'aggregator',
	ttl: {
		home: '1h',
	},
	keys: {
		home: 'home',
	},
	grace: {
		home: '1h',
	},
});
