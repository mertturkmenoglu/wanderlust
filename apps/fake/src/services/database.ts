import * as schema from '@wanderlust/db';
import { drizzle } from 'drizzle-orm/node-postgres';
import { inject, injectable } from 'inversify';
import { ConfigService, type TConfigService } from './config';

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
	return drizzle({
		connection: {
			connectionString: cfg.database.url,
			ssl: cfg.database.ssl,
		},
		schema,
	});
}

export type TDatabaseService = ReturnType<typeof init>;
