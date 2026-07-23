import type { CacheService } from '@wanderlust/cache';
import { Tokens } from '@wanderlust/common';
import type { Categories } from '@wanderlust/contract';
import type { DatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { cacheOptions } from '../shared/cache';
import { os } from '../shared/router';

@injectable()
export class ListCategoriesMethod {
	private readonly ns = cacheOptions.namespace;

	constructor(
		@inject(Tokens.Cache) private readonly cache: CacheService,
		@inject(Tokens.Database) private readonly db: DatabaseService,
	) {}

	route() {
		return os.list.handler(async () => {
			const result = await this.execute();
			return result;
		});
	}

	private async execute(): Promise<Categories.dto.ListOutput> {
		const list = await this.readFromCache();

		return {
			categories: list,
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
