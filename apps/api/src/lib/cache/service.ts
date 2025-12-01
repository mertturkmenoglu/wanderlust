import { BentoCache, bentostore } from 'bentocache';
import { memoryDriver } from 'bentocache/drivers/memory';
import { redisBusDriver, redisDriver } from 'bentocache/drivers/redis';
import superjson from 'superjson';
import { ConfigProvider, type TConfig } from '../config';
import { Container, type IServiceProvider } from '../di';

export class CacheProvider implements IServiceProvider<TCacheService> {
	private readonly instance: TCacheService;

	constructor(ioc: Container) {
		const cfg = ioc.resolve(ConfigProvider.id);
		this.instance = init(cfg);
	}

	get(): TCacheService {
		return this.instance;
	}

	static get id() {
		return Container.createIdentifier<TCacheService>('cache');
	}
}

function init(cfg: TConfig) {
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
