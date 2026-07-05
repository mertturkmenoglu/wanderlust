import { ConfigService, type TConfigService } from '@wanderlust/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { inject, injectable } from 'inversify';
import { Pool } from 'pg';
import { relations } from './relations';

@injectable()
export class DatabaseService {
	private readonly instance: TDatabaseService;

	constructor(@inject(ConfigService) private readonly cfg: ConfigService) {
		this.instance = init(this.cfg.get());
	}

	get(): TDatabaseService {
		return this.instance;
	}
}

function init(cfg: TConfigService) {
	const pool = new Pool({
		connectionString: cfg.database.url,
		max: 20,
		min: 4,
		idleTimeoutMillis: 30000,
		connectionTimeoutMillis: 5000,
	});

	return drizzle({
		relations,
		client: pool,
	});
}

export type TDatabaseService = ReturnType<typeof init>;
