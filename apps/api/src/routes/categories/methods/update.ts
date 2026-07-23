import type { CacheService } from '@wanderlust/cache';
import { Tokens } from '@wanderlust/common';
import type { Categories } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { cacheOptions } from '../shared/cache';
import { os } from '../shared/router';

@injectable()
export class UpdateCategoryMethod {
	private readonly ns = cacheOptions.namespace;

	constructor(
		@inject(Tokens.Cache) private readonly cache: CacheService,
		@inject(Tokens.Database) private readonly db: DatabaseService,
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
		data: Categories.dto.UpdateInput,
	): Promise<Categories.dto.UpdateOutput> {
		const [result] = await this.db
			.update(schema.categories)
			.set({
				name: data.name,
				image: data.image,
			})
			.where(eq(schema.categories.id, data.id))
			.returning();

		invariant(result, 'INTERNAL_SERVER_ERROR', 'No category returned');

		await this.invalidateCache();

		return {
			category: result,
		};
	}

	private async invalidateCache() {
		await this.cache.namespace(this.ns).delete({
			key: cacheOptions.keys.list,
		});
	}
}
