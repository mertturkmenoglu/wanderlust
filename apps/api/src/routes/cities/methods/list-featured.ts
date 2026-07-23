import type { CacheService } from '@wanderlust/cache';
import { Tokens } from '@wanderlust/common';
import type { Cities } from '@wanderlust/contract';
import type { DatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { cacheOptions } from '../shared/cache';
import { os } from '../shared/router';

@injectable()
export class ListFeaturedCitiesMethod {
	private readonly ns = cacheOptions.namespace;

	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(Tokens.Cache) private readonly cache: CacheService,
	) {}

	route() {
		return os.listFeatured.handler(async () => {
			const result = await this.execute();

			return result;
		});
	}

	private async execute(): Promise<Cities.dto.ListFeaturedOutput> {
		const result = await this.readFromCache();

		return {
			cities: result,
		};
	}

	private async readFromCache() {
		const result = await this.cache.namespace(this.ns).getOrSet({
			key: cacheOptions.keys.listFeatured,
			ttl: cacheOptions.ttl.listFeatured,
			factory: () => this.findAll(),
			grace: cacheOptions.grace.list,
		});

		return result;
	}

	private async findAll() {
		return this.db.query.cities.findMany({
			where: {
				id: {
					in: [
						'salzburg',
						'vienna',
						'istanbul',
						'athens',
						'rome',
						'turin',
						'florence',
						'venice',
						'prague',
						'amsterdam',
						'paris',
						'barcelona',
					],
				},
			},
			orderBy: {
				name: 'asc',
			},
		});
	}
}
