import { ConfigService, type TConfigService } from '@wanderlust/config';
import { inject, injectable } from 'inversify';
import IORedis from 'ioredis';

@injectable()
export class RedisService {
	private readonly instance: TRedisService;

	constructor(@inject(ConfigService) private readonly cfg: ConfigService) {
		this.instance = init(this.cfg.get());
	}

	get(): TRedisService {
		return this.instance;
	}
}

function init(cfg: TConfigService) {
	const connection = new IORedis({
		host: cfg.redis.host,
		port: cfg.redis.port,
		db: cfg.redis.db,
		maxRetriesPerRequest: null,
	});

	return connection;
}

export type TRedisService = ReturnType<typeof init>;
