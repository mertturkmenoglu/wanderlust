import { Tokens } from '@wanderlust/common';
import { type ConfigService, createConfig } from '@wanderlust/config';
import { createDatabase, type DatabaseService } from '@wanderlust/db';
import { Mutex } from 'async-mutex';
import { Container } from 'inversify';

let db: DatabaseService | null = null;
const mutex = new Mutex();
const container = new Container({
	autobind: true,
});

export async function getDb(): Promise<DatabaseService> {
	const release = await mutex.acquire();

	if (db) {
		release();
		return db;
	}

	try {
		container
			.bind<ConfigService>(Tokens.Config)
			.toDynamicValue(() => createConfig())
			.inSingletonScope();

		container
			.bind<DatabaseService>(Tokens.Database)
			.toDynamicValue((ctx) => createDatabase({ cfg: ctx.get(Tokens.Config) }))
			.inSingletonScope();

		db = container.get<DatabaseService>(Tokens.Database);
	} finally {
		release();
	}

	return db;
}
