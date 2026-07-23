export const cacheOptions = {
	namespace: 'cities',
	keys: {
		get: (id: string) => `get:${id}`,
		list: 'list',
		listFeatured: 'list-featured',
	},
	ttl: {
		get: '6h',
		listFeatured: '6h',
	},
	grace: {
		get: '6h',
		list: '6h',
		listFeatured: '6h',
	},
};
