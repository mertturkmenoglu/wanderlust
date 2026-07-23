import type { CacheService } from '@wanderlust/cache';
import { Tokens } from '@wanderlust/common';
import type { Cities } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { cacheOptions } from '../shared/cache';
import { os } from '../shared/router';

@injectable()
export class CreateCityMethod {
	private readonly ns = cacheOptions.namespace;

	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(Tokens.Cache) private readonly cache: CacheService,
	) {}

	route() {
		return os.create
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await this.execute(input);

				return result;
			});
	}

	private async execute(
		data: Cities.dto.CreateInput,
	): Promise<Cities.dto.CreateOutput> {
		const [result] = await this.db
			.insert(schema.cities)
			.values(data)
			.returning();

		invariant(result, 'INTERNAL_SERVER_ERROR', 'No city returned');

		await this.invalidateCache();

		return {
			city: result,
		};
	}

	private async invalidateCache() {
		await this.cache.namespace(this.ns).clear();
	}
}
