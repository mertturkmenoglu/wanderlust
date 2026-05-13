import { AuthService } from '@wanderlust/auth';
import { CacheService } from '@wanderlust/cache';
import { ConfigService, type TConfigService } from '@wanderlust/config';
import { DatabaseService } from '@wanderlust/db';
import { EmailService } from '@wanderlust/email';
import { JobsService } from '@wanderlust/jobs';
import { StorageService } from '@wanderlust/storage';
import { Container } from 'inversify';
import { SearchService } from './lib/search';
import { modules } from './routes';

export const container = new Container({
	autobind: true,
});

export async function bootstrapServices() {
	const configData = await ConfigService.init();

	container.bind<TConfigService>('TConfigService').toConstantValue(configData);
	container.bind<ConfigService>(ConfigService).toSelf().inSingletonScope();
	container.get(ConfigService).set(configData);

	container.bind(DatabaseService).toSelf().inSingletonScope();
	container.bind(StorageService).toSelf();
	container.bind(EmailService).toSelf();
	container.bind(CacheService).toSelf();
	container.bind(JobsService).toSelf();
	container.bind(AuthService).toSelf();
	container.bind(SearchService).toSelf();

	container.load(...modules);
}
