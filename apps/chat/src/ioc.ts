import { AuthService } from '@wanderlust/auth';
import { CacheService, RedisService } from '@wanderlust/cache';
import { ConfigService } from '@wanderlust/config';
import { DatabaseService } from '@wanderlust/db';
import { JobsService } from '@wanderlust/jobs';
import { initLogger } from 'evlog';
import { Container } from 'inversify';
import { modules } from './routes';

export const container = new Container({
	autobind: true,
});

export async function bootstrapServices() {
	container.bind(ConfigService).toSelf().inSingletonScope();
	container.bind(DatabaseService).toSelf().inSingletonScope();
	container.bind(CacheService).toSelf();
	container.bind(RedisService).toSelf().inSingletonScope();
	container.bind(JobsService).toSelf();
	container.bind(AuthService).toSelf();

	container.load(...modules);

	const cfg = container.get(ConfigService).get();

	initLogger({
		env: {
			service: cfg.chat.logger.serviceName,
		},
	});
}
