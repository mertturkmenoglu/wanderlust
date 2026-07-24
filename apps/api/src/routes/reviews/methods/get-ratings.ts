import type { CacheService } from '@wanderlust/cache';
import { Tokens } from '@wanderlust/common';
import type { Reviews } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import * as dz from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { os } from '../shared/router';

@injectable()
export class GetRatingsMethod {
	private readonly ns = 'reviews';

	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(Tokens.Cache) private readonly cache: CacheService,
	) {}

	route() {
		return os.getRatings.handler(async ({ input }) => {
			const result = await this.execute(input);

			return result;
		});
	}

	private async execute(
		data: Reviews.dto.GetRatingsInput,
	): Promise<Reviews.dto.GetRatingsOutput> {
		const result = await this.cache.namespace(this.ns).getOrSet({
			key: `places:${data.id}:ratings`,
			ttl: '30m',
			factory: async () => this.compute(data.id),
		});

		return result;
	}

	private async compute(placeId: string) {
		const res = await this.db
			.select({
				rating: schema.reviews.rating,
				count: dz.count(schema.reviews.rating),
			})
			.from(schema.reviews)
			.where(dz.eq(schema.reviews.placeId, placeId))
			.groupBy(schema.reviews.rating);

		const ratings: Record<number, number> = {};
		let totalVotes = 0;

		for (let i = 0; i < 5; i++) {
			ratings[i + 1] = 0;
		}

		for (const row of res) {
			ratings[row.rating] = row.count;
			totalVotes += row.count;
		}

		return {
			ratings,
			totalVotes,
		};
	}
}
