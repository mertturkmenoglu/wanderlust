import { ConfigService } from '@wanderlust/config';
import { DatabaseService, type TDatabaseService } from '@wanderlust/db';
import { Mutex } from 'async-mutex';
import { Container } from 'inversify';

let db: TDatabaseService | null = null;
const mutex = new Mutex();
const container = new Container({
	autobind: true,
});

export async function getDb(): Promise<TDatabaseService> {
	const release = await mutex.acquire();

	if (db) {
		release();
		return db;
	}

	try {
		container.bind(ConfigService).toSelf().inSingletonScope();
		container.bind(DatabaseService).toSelf().inSingletonScope();

		db = container.get(DatabaseService).get();
	} finally {
		release();
	}

	return db;
}
