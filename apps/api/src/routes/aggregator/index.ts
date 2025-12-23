import { implement } from '@orpc/server';
import { DbProvider } from '@/db';
import { ioc } from '@/ioc';
import { CacheProvider } from '@/lib/cache';
import type { Context } from '@/lib/context';
import { contract } from './contract';
import { AggregatorRepository } from './repository';
import { AggregatorService } from './service';

export function getRouter() {
	const os = implement(contract).$context<Context>();
	const db = ioc.resolve(DbProvider.id);
	const cache = ioc.resolve(CacheProvider.id);
	const repo = new AggregatorRepository(db);
	const service = new AggregatorService(cache, repo);

	return os.router({
		home: os.home.handler(async () => {
			const result = await service.home();

			return result;
		}),
	});
}
