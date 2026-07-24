import { Tokens } from '@wanderlust/common';
import type { Reviews } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import * as dz from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { ActivitiesService } from '@/lib/activities';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { requireAuth } from '@/middlewares/authn';
import { os } from '../shared/router';

@injectable()
export class LikeReviewMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(ActivitiesService) private readonly activities: ActivitiesService,
	) {}

	route() {
		return os.like.use(requireAuth).handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Reviews.dto.LikeInput,
	): Promise<Reviews.dto.LikeOutput> {
		const result = await this.like(userId, data.id);

		if (result.liked) {
			await this.activities.addActivity(
				result.thisUser.username,
				'like_review',
				{
					review: {
						id: data.id,
						user: result.user,
						place: result.place,
					},
				},
			);
		}

		return {
			liked: result.liked,
		};
	}

	private async like(userId: string, reviewId: string) {
		const result = await this.db.transaction(async (tx) => {
			const thisUser = await tx.query.users.findFirst({
				where: {
					id: userId,
				},
			});

			invariant(thisUser, 'NOT_FOUND', `User with id ${userId} not found`);

			const existing = await tx.query.reviewLikes.findFirst({
				where: {
					reviewId,
					userId,
				},
			});

			const review = await tx.query.reviews.findFirst({
				where: {
					id: reviewId,
				},
			});

			invariant(review, 'NOT_FOUND', `Review with id ${reviewId} not found`);

			const reviewUser = await tx.query.users.findFirst({
				where: {
					id: review.userId,
				},
			});

			invariant(
				reviewUser,
				'NOT_FOUND',
				`User with id ${review.userId} not found`,
			);

			const place = await tx.query.places.findFirst({
				where: {
					id: review.placeId,
				},
			});

			invariant(
				place,
				'NOT_FOUND',
				`Place with id ${review.placeId} not found`,
			);

			if (existing) {
				// Unlike the review
				await tx
					.delete(schema.reviewLikes)
					.where(
						dz.and(
							dz.eq(schema.reviewLikes.reviewId, reviewId),
							dz.eq(schema.reviewLikes.userId, userId),
						),
					);

				await tx
					.update(schema.reviews)
					.set({
						totalLikes: dz.sql`${schema.reviews.totalLikes} - 1`,
					})
					.where(dz.eq(schema.reviews.id, reviewId));

				return {
					liked: false,
					thisUser: {
						username: thisUser.username,
					},
					user: {
						id: reviewUser.id,
						name: reviewUser.name,
						username: reviewUser.username,
						image: reviewUser.image,
					},
					place: {
						id: review.placeId,
						name: place.name,
					},
				};
			}

			await tx.insert(schema.reviewLikes).values({
				reviewId,
				userId,
			});

			await tx
				.update(schema.reviews)
				.set({
					totalLikes: dz.sql`${schema.reviews.totalLikes} + 1`,
				})
				.where(dz.eq(schema.reviews.id, reviewId));

			return {
				liked: true,
				thisUser: {
					username: thisUser.username,
				},
				user: {
					id: reviewUser.id,
					name: reviewUser.name,
					username: reviewUser.username,
					image: reviewUser.image,
				},
				place: {
					id: review.placeId,
					name: place.name,
				},
			};
		});
		return result;
	}
}
