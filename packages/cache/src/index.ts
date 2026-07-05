/** biome-ignore-all lint/correctness/useHookAtTopLevel: Bentocache's useXYZ methods are not React hooks, it's a false positive output from Biome */

import { ConfigService, type TConfigService } from '@wanderlust/config';
import { BentoCache, bentostore } from 'bentocache';
import { memoryDriver } from 'bentocache/drivers/memory';
import { redisBusDriver, redisDriver } from 'bentocache/drivers/redis';
import { inject, injectable } from 'inversify';
import superjson from 'superjson';
import { RedisService, type TRedisService } from './redis';

@injectable()
export class CacheService {
	private readonly instance: TCacheService;

	constructor(
		@inject(ConfigService) private readonly cfg: ConfigService,
		@inject(RedisService) private readonly redis: RedisService,
	) {
		this.instance = init(this.cfg.get(), this.redis.get());
	}

	get(): TCacheService {
		return this.instance;
	}
}

function init(cfg: TConfigService, redis: TRedisService) {
	return new BentoCache({
		default: 'cache',
		grace: cfg.api.cache.grace,
		graceBackoff: cfg.api.cache.graceBackoff,
		serializer: {
			serialize: superjson.stringify,
			deserialize: superjson.parse,
		},
		stores: {
			cache: bentostore()
				.useL1Layer(memoryDriver({ maxSize: cfg.api.cache.l1MaxSize }))
				.useL2Layer(
					redisDriver({
						connection: redis,
					}),
				)
				.useBus(
					redisBusDriver({
						connection: redis,
					}),
				),
		},
	});
}

export type TCacheService = ReturnType<typeof init>;

export * from './redis';
