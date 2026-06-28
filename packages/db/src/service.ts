import { ConfigService, type TConfigService } from '@wanderlust/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { inject, injectable } from 'inversify';
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
	return drizzle(cfg.database.url, {
		relations,
	});
}

export type TDatabaseService = ReturnType<typeof init>;
