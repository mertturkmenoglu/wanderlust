import { AuthService } from '@wanderlust/auth';
import { CacheService, RedisService } from '@wanderlust/cache';
import { ConfigService } from '@wanderlust/config';
import { DatabaseService } from '@wanderlust/db';
import { EmailService } from '@wanderlust/email';
import { JobsService } from '@wanderlust/jobs';
import { SearchService } from '@wanderlust/search';
import { StorageService } from '@wanderlust/storage';
import { container, TYPES } from './ioc';
import { ActivitiesService } from './lib/activities';
import { logger } from './lib/logger';
import { exports } from './routes';

export async function bootstrapServices() {
	container.bind(TYPES.Logger).toConstantValue(logger);
	container.bind(ConfigService).toSelf().inSingletonScope();
	container.bind(DatabaseService).toSelf().inSingletonScope();
	container.bind(StorageService).toSelf().inSingletonScope();
	container.bind(EmailService).toSelf().inSingletonScope();
	container.bind(CacheService).toSelf().inSingletonScope();
	container.bind(RedisService).toSelf().inSingletonScope();
	container.bind(JobsService).toSelf().inSingletonScope();
	container.bind(AuthService).toSelf().inSingletonScope();
	container.bind(SearchService).toSelf().inSingletonScope();
	container.bind(ActivitiesService).toSelf().inSingletonScope();

	for (const svc of exports) {
		container.bind(svc).toSelf().inSingletonScope();
	}

	const cfg = container.get(ConfigService).get();
	const auth = container.get(AuthService).get();

	return {
		cfg,
		auth,
	};
}
