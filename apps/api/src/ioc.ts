import { AuthService } from '@wanderlust/auth';
import { CacheService, RedisService } from '@wanderlust/cache';
import { ConfigService } from '@wanderlust/config';
import { DatabaseService } from '@wanderlust/db';
import { EmailService } from '@wanderlust/email/email';
import { JobsService } from '@wanderlust/jobs';
import { StorageService } from '@wanderlust/storage';
import { Container } from 'inversify';
import { SearchService } from './lib/search';
import { modules } from './routes';

export const container = new Container({
	autobind: true,
});

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

	container.load(...modules);
}
