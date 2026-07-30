import type { CacheService } from '@wanderlust/cache';
import { Tokens } from '@wanderlust/common';
import type { Reviews } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import * as dz from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { cacheOptions } from '../internal/cache';
import { os } from '../internal/router';

@injectable()
export class ListReviewAssetsByPlaceIdMethod {
	private readonly ns = cacheOptions.namespace;

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
			key: cacheOptions.keys.placeAssets(data.id),
			ttl: cacheOptions.ttl.placeAssets,
			factory: async () => this.find(data.id),
		});

		return result;
	}

	private async find(placeId: string) {
		const results = await this.db
			.select(dz.getColumns(schema.assets))
			.from(schema.assets)
			.innerJoin(
				schema.assetsToReviews,
				dz.eq(schema.assetsToReviews.assetId, schema.assets.id),
			)
			.innerJoin(
				schema.reviews,
				dz.eq(schema.reviews.id, schema.assetsToReviews.reviewId),
			)
			.where(dz.eq(schema.reviews.placeId, placeId))
			.orderBy(dz.desc(schema.assets.createdAt))
			.limit(25);

		return {
			assets: results,
		};
	}
}
