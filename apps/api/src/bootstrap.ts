import { AuthService } from '@wanderlust/auth';
import { CacheService, RedisService } from '@wanderlust/cache';
import { ConfigService } from '@wanderlust/config';
import { DatabaseService } from '@wanderlust/db';
import { EmailService } from '@wanderlust/email';
import { JobsService } from '@wanderlust/jobs';
import { StorageService } from '@wanderlust/storage';
import { initLogger } from 'evlog';
import { container } from './ioc';
import { ActivitiesService } from './lib/activities';
import { SearchService } from './lib/search';
import { modules } from './routes';

export async function bootstrapServices() {
	container.bind(ConfigService).toSelf().inSingletonScope();
	container.bind(DatabaseService).toSelf().inSingletonScope();
	container.bind(StorageService).toSelf();
	container.bind(EmailService).toSelf();
	container.bind(CacheService).toSelf();
	container.bind(RedisService).toSelf().inSingletonScope();
	container.bind(JobsService).toSelf();
	container.bind(AuthService).toSelf();
	container.bind(SearchService).toSelf();
	container.bind(ActivitiesService).toSelf();

	container.load(...modules);

	const cfg = container.get(ConfigService).get();
	const auth = container.get(AuthService).get();

	initLogger({
		env: {
			service: cfg.api.logger.serviceName,
		},
	});

	return {
		cfg,
		auth,
	};
}
