import { defineCacheOptions } from '@/lib/define-cache-options';
import { stableHash } from '@/lib/stable-hash';

export const cacheOptions = defineCacheOptions({
	namespace: 'accolades',
	keys: {
		listPlaces: (id: string, page: number, pageSize: number) =>
			stableHash({
				key: 'list-places',
				id,
				page,
				pageSize,
			}),
	},
	ttl: {
		listPlaces: '1h',
	},
	grace: {
		listPlaces: '1h',
	},
});
