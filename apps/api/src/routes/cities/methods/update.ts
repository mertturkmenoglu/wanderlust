import type { CacheService } from '@wanderlust/cache';
import { Tokens } from '@wanderlust/common';
import type { Cities } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { cacheOptions } from '../shared/cache';
import { os } from '../shared/router';

@injectable()
export class UpdateCityMethod {
	private readonly ns = cacheOptions.namespace;

	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(Tokens.Cache) private readonly cache: CacheService,
	) {}

	route() {
		return os.update
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await this.execute(input);

				return result;
			});
	}

	private async execute(
		data: Cities.dto.UpdateInput,
	): Promise<Cities.dto.UpdateOutput> {
		const { id, ...updateData } = data;

		const [result] = await this.db
			.update(schema.cities)
			.set({
				...updateData,
			})
			.where(eq(schema.cities.id, id))
			.returning();

		invariant(result, 'NOT_FOUND', `City with ID ${id} not found`);

		await this.invalidateCache();

		return {
			city: result,
		};
	}

	private async invalidateCache() {
		await this.cache.namespace(this.ns).clear();
	}
}
