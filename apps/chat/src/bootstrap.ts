import { AuthService } from '@wanderlust/auth';
import { CacheService, RedisService } from '@wanderlust/cache';
import { ConfigService } from '@wanderlust/config';
import { DatabaseService } from '@wanderlust/db';
import { JobsService } from '@wanderlust/jobs';
import { initLogger } from 'evlog';
import { container } from './ioc';
import { modules } from './routes';

export async function bootstrapServices() {
	container.bind(ConfigService).toSelf().inSingletonScope();
	container.bind(DatabaseService).toSelf().inSingletonScope();
	container.bind(CacheService).toSelf();
	container.bind(RedisService).toSelf().inSingletonScope();
	container.bind(JobsService).toSelf();
	container.bind(AuthService).toSelf();

	container.load(...modules);

	const cfg = container.get(ConfigService).get();
	const auth = container.get(AuthService).get();

	initLogger({
		env: {
			service: cfg.chat.logger.serviceName,
		},
	});

	return {
		cfg,
		auth,
	};
}
