export const cacheOptions = {
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
};
