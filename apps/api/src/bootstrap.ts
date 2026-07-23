import { type AuthService, createAuth } from '@wanderlust/auth';
import {
	type CacheService,
	createCache,
	createRedis,
	type RedisService,
} from '@wanderlust/cache';
import { Tokens } from '@wanderlust/common';
import { type ConfigService, createConfig } from '@wanderlust/config';
import { createDatabase, type DatabaseService } from '@wanderlust/db';
import { createEmail, type EmailService } from '@wanderlust/email';
import { createJobs, type JobsService } from '@wanderlust/jobs';
import { createSearch, type SearchService } from '@wanderlust/search';
import { createStorage, type StorageService } from '@wanderlust/storage';
import { container } from './ioc';
import { ActivitiesService } from './lib/activities';
import { logger } from './lib/logger';
import { exports } from './routes';

export async function bootstrapServices() {
	container.bind(Tokens.Logger).toConstantValue(logger);

	container
		.bind<ConfigService>(Tokens.Config)
		.toDynamicValue(() => createConfig())
		.inSingletonScope();

	container
		.bind<DatabaseService>(Tokens.Database)
		.toDynamicValue((ctx) => createDatabase({ cfg: ctx.get(Tokens.Config) }))
		.inSingletonScope();

	container
		.bind<StorageService>(Tokens.Storage)
		.toDynamicValue((ctx) => createStorage({ cfg: ctx.get(Tokens.Config) }))
		.inSingletonScope();

	container
		.bind<EmailService>(Tokens.Email)
		.toDynamicValue((ctx) => createEmail({ cfg: ctx.get(Tokens.Config) }))
		.inSingletonScope();

	container
		.bind<RedisService>(Tokens.Redis)
		.toDynamicValue((ctx) => createRedis({ cfg: ctx.get(Tokens.Config) }))
		.inSingletonScope();

	container
		.bind<CacheService>(Tokens.Cache)
		.toDynamicValue((ctx) =>
			createCache({
				cfg: ctx.get(Tokens.Config),
				redis: ctx.get(Tokens.Redis),
			}),
		)
		.inSingletonScope();

	container
		.bind<JobsService>(Tokens.Jobs)
		.toDynamicValue((ctx) =>
			createJobs({
				email: ctx.get(Tokens.Email),
				redis: ctx.get(Tokens.Redis),
				config: ctx.get(Tokens.Config),
				db: ctx.get(Tokens.Database),
			}),
		)
		.inSingletonScope();

	container
		.bind<AuthService>(Tokens.Auth)
		.toDynamicValue((ctx) =>
			createAuth({
				cfg: ctx.get(Tokens.Config),
				db: ctx.get(Tokens.Database),
				jobs: ctx.get(Tokens.Jobs),
				cache: ctx.get(Tokens.Cache),
				redis: ctx.get(Tokens.Redis),
			}),
		)
		.inSingletonScope();

	container
		.bind<SearchService>(Tokens.Search)
		.toDynamicValue((ctx) => createSearch({ cfg: ctx.get(Tokens.Config) }))
		.inSingletonScope();

	container.bind(ActivitiesService).toSelf().inSingletonScope();

	for (const svc of exports) {
		container.bind(svc).toSelf().inSingletonScope();
	}

	const cfg = container.get<ConfigService>(Tokens.Config);
	const auth = container.get<AuthService>(Tokens.Auth);

	return {
		cfg,
		auth,
	};
}
