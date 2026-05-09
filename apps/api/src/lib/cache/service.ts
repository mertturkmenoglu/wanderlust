import { BentoCache, bentostore } from 'bentocache';
import { memoryDriver } from 'bentocache/drivers/memory';
import { redisBusDriver, redisDriver } from 'bentocache/drivers/redis';
import { inject, injectable } from 'inversify';
import superjson from 'superjson';
import { ConfigService, type TConfigService } from '../config';

@injectable()
export class CacheService {
	private readonly instance: TCacheService;

	constructor(@inject(ConfigService) private readonly cfg: ConfigService) {
		this.instance = init(this.cfg.get());
	}

	get(): TCacheService {
		return this.instance;
	}
}

function init(cfg: TConfigService) {
	return new BentoCache({
		default: 'cache',
		grace: cfg.cache.grace,
		graceBackoff: cfg.cache.graceBackoff,
		serializer: {
			serialize: superjson.stringify,
			deserialize: superjson.parse,
		},
		stores: {
			cache: bentostore()
				.useL1Layer(memoryDriver({ maxSize: cfg.cache.l1MaxSize }))
				.useL2Layer(
					redisDriver({
						connection: {
							host: cfg.redis.host,
							port: cfg.redis.port,
						},
					}),
				)
				.useBus(
					redisBusDriver({
						connection: {
							host: cfg.redis.host,
							port: cfg.redis.port,
						},
					}),
				),
		},
	});
}

export type TCacheService = ReturnType<typeof init>;
