import { AuthService } from '@wanderlust/auth';
import { CacheService, RedisService } from '@wanderlust/cache';
import { ConfigService } from '@wanderlust/config';
import { DatabaseService } from '@wanderlust/db';
import { EmailService } from '@wanderlust/email';
import { JobsService } from '@wanderlust/jobs';
import { SearchService } from '@wanderlust/search';
import { StorageService } from '@wanderlust/storage';
import { container } from './ioc';
import { ActivitiesService } from './lib/activities';
import { exports } from './routes';

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
