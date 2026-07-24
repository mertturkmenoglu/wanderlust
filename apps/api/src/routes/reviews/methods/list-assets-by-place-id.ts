import type { CacheService } from '@wanderlust/cache';
import { Tokens } from '@wanderlust/common';
import type { Reviews } from '@wanderlust/contract';
import type { DatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { os } from '../shared/router';

@injectable()
export class ListReviewAssetsByPlaceIdMethod {
	private readonly ns = 'reviews';

	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(Tokens.Cache) private readonly cache: CacheService,
	) {}

	route() {
		return os.listAssetsByPlaceId.handler(async ({ input }) => {
			const result = await this.execute(input);

			return result;
		});
	}

	private async execute(
		data: Reviews.dto.ListAssetsByPlaceIdInput,
	): Promise<Reviews.dto.ListAssetsByPlaceIdOutput> {
		const result = await this.cache.namespace(this.ns).getOrSet({
			key: `places:${data.id}:assets`,
			ttl: '30m',
			factory: async () => this.find(data.id),
		});

		return result;
	}

	private async find(_placeId: string) {
		// const results = await this.db
		// 	.select({
		// 		asset: schema.assets,
		// 		placeId: schema.reviews.placeId,
		// 	})
		// 	.from(schema.assets)
		// 	.innerJoin(
		// 		schema.reviews,
		// 		dz.and(
		// 			dz.eq(schema.assets, schema.reviews.id),
		// 			dz.eq(schema.assets.entityType, 'review'),
		// 		),
		// 	)
		// 	.where(dz.eq(schema.reviews.placeId, data.id))
		// 	.orderBy(dz.desc(schema.assets.createdAt));

		return {
			// assets: results.map((r) => r.asset),
			assets: [],
		};
	}
}
