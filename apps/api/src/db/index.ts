import { drizzle } from 'drizzle-orm/node-postgres';
import { ConfigProvider, type TConfig } from '@/lib/config';
import { Container, type IServiceProvider } from '@/lib/di';
import * as schema from './schema';

export class DbProvider implements IServiceProvider<TDatabaseService> {
	private readonly instance: TDatabaseService;

	constructor(ioc: Container) {
		const cfg = ioc.resolve(ConfigProvider.id);
		this.instance = init(cfg);
	}

	get(): TDatabaseService {
		return this.instance;
	}

	static get id() {
		return Container.createIdentifier<TDatabaseService>('db');
	}
}

function init(cfg: TConfig) {
	return drizzle({
		connection: {
			connectionString: cfg.database.url,
			ssl: cfg.database.ssl,
		},
		schema,
	});
}

export type TDatabaseService = ReturnType<typeof init>;
