import type { ConfigService } from '@wanderlust/config';
import { BentoCache, bentostore } from 'bentocache';
import { memoryDriver } from 'bentocache/drivers/memory';
import { redisBusDriver, redisDriver } from 'bentocache/drivers/redis';
import superjson from 'superjson';
import type { RedisService } from './redis';

export function createCache(deps: { cfg: ConfigService; redis: RedisService }) {
	return new BentoCache({
		default: 'cache',
		grace: deps.cfg.api.cache.grace,
		graceBackoff: deps.cfg.api.cache.graceBackoff,
		serializer: {
			serialize: superjson.stringify,
			deserialize: superjson.parse,
		},
		stores: {
			cache: bentostore()
				.useL1Layer(memoryDriver({ maxSize: deps.cfg.api.cache.l1MaxSize }))
				.useL2Layer(
					redisDriver({
						connection: deps.redis,
					}),
				)
				.useBus(
					redisBusDriver({
						connection: deps.redis,
					}),
				),
		},
	});
}

export type CacheService = ReturnType<typeof createCache>;
