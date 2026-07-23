export const cacheOptions = {
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
};
