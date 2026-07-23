import type { ConfigService } from '@wanderlust/config';
import IORedis from 'ioredis';

export function createRedis(deps: { cfg: ConfigService }) {
	const connection = new IORedis({
		host: deps.cfg.redis.host,
		port: deps.cfg.redis.port,
		db: deps.cfg.redis.db,
		maxRetriesPerRequest: null,
	});

	return connection;
}

export type RedisService = ReturnType<typeof createRedis>;
