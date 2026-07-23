import type { CacheService } from '@wanderlust/cache';
import { Tokens } from '@wanderlust/common';
import type { Categories } from '@wanderlust/contract';
import type { DatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { cacheOptions } from '../shared/cache';
import { os } from '../shared/router';

@injectable()
export class GetCategoryMethod {
	private readonly ns = cacheOptions.namespace;

	constructor(
		@inject(Tokens.Cache) private readonly cache: CacheService,
		@inject(Tokens.Database) private readonly db: DatabaseService,
	) {}

	route() {
		return os.get.handler(async ({ input }) => {
			const result = await this.execute(input);
			return result;
		});
	}

	private async execute(
		input: Categories.dto.GetInput,
	): Promise<Categories.dto.GetOutput> {
		const list = await this.readFromCache();
		const cached = list.find((c) => c.id === input.id);

		invariant(cached, 'NOT_FOUND', `Category with ID ${input.id} not found`);

		return {
			category: cached,
		};
	}

	private async readFromCache() {
		return this.cache.namespace(this.ns).getOrSetForever({
			key: cacheOptions.keys.list,
			factory: async () =>
				await this.db.query.categories.findMany({
					orderBy: (t, { asc }) => asc(t.name),
				}),
			grace: '6h',
		});
	}
}
