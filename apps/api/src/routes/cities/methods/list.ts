import type { CacheService } from '@wanderlust/cache';
import { Tokens } from '@wanderlust/common';
import type { Cities } from '@wanderlust/contract';
import type { DatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { z } from 'zod';
import { definePreparedStatement } from '@/lib/define-prepared-statement';
import { cacheOptions } from '../shared/cache';
import { os } from '../shared/router';

@injectable()
export class ListCitiesMethod {
	private readonly ns = cacheOptions.namespace;

	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(Tokens.Cache) private readonly cache: CacheService,
	) {}

	route() {
		return os.list.handler(async () => {
			const result = await this.execute();

			return result;
		});
	}

	private async execute(): Promise<Cities.dto.ListOutput> {
		const result = await this.readFromCache();

		return {
			cities: result,
		};
	}

	private async readFromCache() {
		const result = await this.cache.namespace(this.ns).getOrSetForever({
			key: cacheOptions.keys.list,
			factory: () => this.findAll(),
			grace: cacheOptions.grace.list,
		});

		return result;
	}

	private async findAll() {
		return findMany.execute(this.db, {});
	}
}

const findMany = definePreparedStatement({
	schema: z.object({}),
	statement: (db) => {
		return db.query.cities
			.findMany({
				orderBy: {
					name: 'asc',
				},
			})
			.prepare('cities_find_many');
	},
});
