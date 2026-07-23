import type { ConfigService } from '@wanderlust/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { relations } from './relations';

export function createDatabase(deps: { cfg: ConfigService }) {
	return drizzle({
		relations,
		connection: {
			connectionString: deps.cfg.database.url,
			max: 20,
			min: 4,
			idleTimeoutMillis: 30000,
			connectionTimeoutMillis: 5000,
			// statement_timeout: 5000,
		},
	});
}

export type DatabaseService = ReturnType<typeof createDatabase>;
