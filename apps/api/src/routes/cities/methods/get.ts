import type { CacheService } from '@wanderlust/cache';
import { Tokens } from '@wanderlust/common';
import type { Cities } from '@wanderlust/contract';
import type { DatabaseService } from '@wanderlust/db';
import { sql } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { z } from 'zod';
import { definePreparedStatement } from '@/lib/define-prepared-statement';
import { invariant } from '@/lib/invariant';
import { cacheOptions } from '../shared/cache';
import { os } from '../shared/router';

@injectable()
export class GetCityMethod {
	private readonly ns = cacheOptions.namespace;

	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(Tokens.Cache) private readonly cache: CacheService,
	) {}

	route() {
		return os.get.handler(async ({ input }) => {
			const result = await this.execute(input);

			return result;
		});
	}

	private async execute(
		data: Cities.dto.GetInput,
	): Promise<Cities.dto.GetOutput> {
		const result = await this.readFromCacheById(data.id);

		return {
			city: result,
		};
	}

	private async readFromCacheById(id: string) {
		const result = await this.cache.namespace(this.ns).getOrSet({
			key: cacheOptions.keys.get(id),
			ttl: cacheOptions.ttl.get,
			factory: () => this.find(id),
			grace: cacheOptions.grace.get,
		});

		return result;
	}

	private async find(id: string) {
		const city = await findById.execute(this.db, { id });

		invariant(city, 'NOT_FOUND', `City with ID ${id} not found`);

		return city;
	}
}

const findById = definePreparedStatement({
	schema: z.object({
		id: z.string(),
	}),
	statement: (db) => {
		return db.query.cities
			.findFirst({
				where: {
					id: { eq: sql.placeholder('id') },
				},
			})
			.prepare('cities_find_by_id');
	},
});
