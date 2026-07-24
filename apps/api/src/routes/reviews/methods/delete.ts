import { trace } from '@opentelemetry/api';
import type { CacheService } from '@wanderlust/cache';
import { Tokens } from '@wanderlust/common';
import type { Reviews } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import * as dz from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { requireAuth } from '@/middlewares/authn';
import { os } from '../shared/router';

@injectable()
export class DeleteReviewMethod {
	private readonly ns = 'reviews';

	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(Tokens.Cache) private readonly cache: CacheService,
	) {}

	route() {
		return os.delete.use(requireAuth).handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Reviews.dto.DeleteInput,
	): Promise<Reviews.dto.DeleteOutput> {
		const existing = await this.db.query.reviews.findFirst({
			where: {
				id: data.id,
			},
		});

		invariant(existing, 'NOT_FOUND', `Review with id ${data.id} not found`);

		invariant(
			existing.userId === userId,
			'FORBIDDEN',
			'You are not authorized to delete this review',
		);

		const result = await this.db.transaction(async (tx) => {
			const [deleted] = await tx
				.delete(schema.reviews)
				.where(
					dz.and(
						dz.eq(schema.reviews.id, data.id),
						dz.eq(schema.reviews.userId, userId),
					),
				)
				.returning();

			invariant(
				deleted,
				'NOT_FOUND',
				`Review with id ${data.id} not found or you are not authorized to delete it`,
			);

			const assetsToBeDeleted = await tx.query.assetsToReviews.findMany({
				where: {
					reviewId: data.id,
				},
			});

			const assetIdsToBeDeleted = assetsToBeDeleted.map((a) => a.assetId);

			if (assetIdsToBeDeleted.length > 0) {
				await tx
					.delete(schema.assetsToReviews)
					.where(dz.eq(schema.assetsToReviews.reviewId, data.id));

				await tx
					.update(schema.assets)
					.set({
						deletedAt: new Date(),
					})
					.where(dz.inArray(schema.assets.id, assetIdsToBeDeleted));
			}

			await tx
				.update(schema.places)
				.set({
					totalVotes: dz.sql`${schema.places.totalVotes} - 1`,
					totalPoints: dz.sql`${schema.places.totalPoints} - ${deleted.rating}`,
				})
				.where(dz.eq(schema.places.id, deleted.placeId));

			return deleted;
		});
		// const urls = existing.assets.map((asset) => asset.url);
		// const allAssetsDeleted = await this.removeAssets(urls);

		// if (!allAssetsDeleted) {
		// 	span?.addEvent(
		// 		'review.delete.asset-delete-failure',
		// 		{
		// 			reviewId: data.id,
		// 			urls: urls.join(','),
		// 		},
		// 		new Date(),
		// 	);
		// }

		await this.invalidatePlaceRatings(result.placeId);

		// if (urls.length > 0) {
		// 	await this.invalidatePlaceAssets(deleted.placeId);
		// }

		return {};
	}

	private async invalidatePlaceRatings(placeId: string): Promise<void> {
		const span = trace.getActiveSpan();

		span?.addEvent(
			'review.ratings.invalidate',
			{
				'place.id': placeId,
			},
			new Date(),
		);

		await this.cache.namespace(this.ns).delete({
			key: `places:${placeId}:ratings`,
		});
	}

	private async invalidatePlaceAssets(placeId: string): Promise<void> {
		const span = trace.getActiveSpan();

		span?.addEvent(
			'review.assets.invalidate',
			{
				'place.id': placeId,
			},
			new Date(),
		);

		await this.cache.namespace(this.ns).delete({
			key: `places:${placeId}:assets`,
		});
	}
}
