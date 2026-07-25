import { Tokens } from '@wanderlust/common';
import { type ConfigService, createConfig } from '@wanderlust/config';
import { createDatabase, type DatabaseService } from '@wanderlust/db';
import { createSearch, type SearchService } from '@wanderlust/search';
import { container } from './ioc';

export async function bootstrapServices() {
	container
		.bind<ConfigService>(Tokens.Config)
		.toDynamicValue(() => createConfig())
		.inSingletonScope();

	container
		.bind<SearchService>(Tokens.Search)
		.toDynamicValue((ctx) => createSearch({ cfg: ctx.get(Tokens.Config) }))
		.inSingletonScope();

	container
		.bind<DatabaseService>(Tokens.Database)
		.toDynamicValue((ctx) => createDatabase({ cfg: ctx.get(Tokens.Config) }))
		.inSingletonScope();
}
