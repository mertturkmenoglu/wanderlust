import { defineCacheOptions } from '@/lib/define-cache-options';

export const cacheOptions = defineCacheOptions({
	namespace: 'categories',
	keys: {
		list: 'list',
	},
	grace: {},
	ttl: {},
});
