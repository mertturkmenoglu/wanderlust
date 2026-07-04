import { Pagination } from '@wanderlust/common';
import type { reviews as dto } from '@wanderlust/contract';
import * as schema from '@wanderlust/db';
import {
	$includes,
	DatabaseService,
	type TDatabaseService,
} from '@wanderlust/db';
import { nanoid } from '@wanderlust/uid';
import { and, count, eq, gte, inArray, lte, sql } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { unique } from '@/lib/unique';

@injectable()
export class ReviewsRepository {
	private readonly db: TDatabaseService;

	constructor(@inject(DatabaseService) db: DatabaseService) {
		this.db = db.get();
	}

	async get(data: dto.GetInput) {
		const result = await this.db.query.reviews.findFirst({
			where: {
				id: data.id,
			},
			with: {
				place: $includes.place,
				user: {
					columns: {
						id: true,
						username: true,
						name: true,
						image: true,
					},
				},
				assets: true,
			},
		});

		invariant(result, 'NOT_FOUND', `Review with id ${data.id} not found`);

		return result;
	}

	async create(userId: string, data: dto.CreateInput, urls: string[]) {
		const results = await this.db.transaction(async (tx) => {
			const [review] = await tx
				.insert(schema.reviews)
				.values({
					id: nanoid(),
					placeId: data.placeId,
					userId: userId,
					content: data.content,
					rating: data.rating,
					visitedAt: data.visitedAt,
				})
				.returning();

			invariant(review, 'INTERNAL_SERVER_ERROR', 'Failed to create review');

			if (urls.length > 0) {
				await tx.insert(schema.assets).values(
					urls.map((url, i) => ({
						entityId: review.id,
						entityType: 'review' as const,
						url,
						order: i + 1,
					})),
				);
			}

			await this.db
				.update(schema.places)
				.set({
					totalVotes: sql`${schema.places.totalVotes} + 1`,
					totalPoints: sql`${schema.places.totalPoints} + ${data.rating}`,
				})
				.where(eq(schema.places.id, data.placeId));

			const res = await tx.query.reviews.findFirst({
				where: {
					id: review.id,
				},
				with: {
					assets: true,
					user: {
						columns: {
							id: true,
							username: true,
							name: true,
							image: true,
						},
					},
				},
			});

			invariant(
				res,
				'INTERNAL_SERVER_ERROR',
				'Failed to retrieve created review',
			);

			const place = await tx.query.places.findFirst({
				where: {
					id: review.placeId,
				},
			});

			invariant(place, 'INTERNAL_SERVER_ERROR', 'Failed to retrieve the place');

			return [res, place] as const;
		});

		return results;
	}

	async _delete(userId: string, data: dto.DeleteInput) {
		return await this.db.transaction(async (tx) => {
			const [deleted] = await tx
				.delete(schema.reviews)
				.where(
					and(
						eq(schema.reviews.id, data.id),
						eq(schema.reviews.userId, userId),
					),
				)
				.returning();

			invariant(
				deleted,
				'NOT_FOUND',
				`Review with id ${data.id} not found or you are not authorized to delete it`,
			);

			await tx
				.delete(schema.assets)
				.where(
					and(
						eq(schema.assets.entityId, data.id),
						eq(schema.assets.entityType, 'review'),
					),
				);

			await tx
				.update(schema.places)
				.set({
					totalVotes: sql`${schema.places.totalVotes} - 1`,
					totalPoints: sql`${schema.places.totalPoints} - ${deleted.rating}`,
				})
				.where(eq(schema.places.id, deleted.placeId));

			return deleted;
		});
	}

	async listByUsername(data: dto.ListByUsernameInput) {
		const offset = Pagination.getOffset(data);

		const user = await this.db.query.users.findFirst({
			where: {
				username: data.username,
			},
		});

		invariant(
			user,
			'NOT_FOUND',
			`User with username ${data.username} not found`,
		);

		const result = await this.db.query.reviews.findMany({
			where: {
				userId: user.id,
			},
			with: {
				place: $includes.place,
				user: {
					columns: {
						id: true,
						username: true,
						name: true,
						image: true,
					},
				},
				assets: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
			offset,
			limit: data.pageSize,
		});

		const totalRecords = await this.db.$count(
			schema.reviews,
			eq(schema.reviews.userId, user.id),
		);

		return {
			reviews: result,
			pagination: Pagination.compute(data, totalRecords),
		};
	}

	async listByPlaceId(data: dto.ListByPlaceIdInput) {
		const offset = Pagination.getOffset(data);
		const min = data.minRating || 0;
		const max = data.maxRating || 5;

		const result = await this.db.query.reviews.findMany({
			where: {
				placeId: data.id,
				rating: {
					gt: min,
					lte: max,
				},
			},
			with: {
				user: {
					columns: {
						id: true,
						username: true,
						name: true,
						image: true,
					},
				},
				assets: true,
			},
			orderBy: (reviews, { desc, asc }) => {
				const sortBy = data.sortBy || 'created_at';
				const sortOrd = data.sortOrd || 'desc';

				if (sortBy === 'created_at') {
					return sortOrd === 'asc'
						? asc(reviews.createdAt)
						: desc(reviews.createdAt);
				}

				if (sortBy === 'rating') {
					return sortOrd === 'asc'
						? asc(reviews.rating)
						: desc(reviews.rating);
				}

				if (sortBy === 'likes') {
					return sortOrd === 'asc'
						? asc(reviews.totalLikes)
						: desc(reviews.totalLikes);
				}

				return sortOrd === 'asc' ? asc(reviews.rating) : desc(reviews.rating);
			},
			offset,
			limit: data.pageSize,
		});

		const totalRecords = await this.db.$count(
			schema.reviews,
			and(
				eq(schema.reviews.placeId, data.id),
				gte(schema.reviews.rating, min),
				lte(schema.reviews.rating, max),
			),
		);

		return {
			reviews: result,
			pagination: Pagination.compute(data, totalRecords),
		};
	}

	async getRatings(data: dto.GetRatingsInput) {
		const res = await this.db
			.select({
				rating: schema.reviews.rating,
				count: count(schema.reviews.rating),
			})
			.from(schema.reviews)
			.where(eq(schema.reviews.placeId, data.id))
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

	async listAssetsByPlaceId(
		data: dto.ListAssetsByPlaceIdInput,
	): Promise<dto.ListAssetsByPlaceIdOutput> {
		const results = await this.db
			.select({
				asset: schema.assets,
				placeId: schema.reviews.placeId,
			})
			.from(schema.assets)
			.innerJoin(
				schema.reviews,
				dz.and(
					dz.eq(schema.assets.entityId, schema.reviews.id),
					dz.eq(schema.assets.entityType, 'review'),
				),
			)
			.where(dz.eq(schema.reviews.placeId, data.id))
			.orderBy(dz.desc(schema.assets.createdAt));

		return {
			assets: results.map((r) => r.asset),
		};
	}

	async like(userId: string, data: dto.LikeInput) {
		const result = await this.db.transaction(async (tx) => {
			const thisUser = await tx.query.users.findFirst({
				where: {
					id: userId,
				},
			});

			invariant(thisUser, 'NOT_FOUND', `User with id ${userId} not found`);

			const existing = await tx.query.reviewLikes.findFirst({
				where: {
					reviewId: data.id,
					userId,
				},
			});

			const review = await tx.query.reviews.findFirst({
				where: {
					id: data.id,
				},
			});

			invariant(review, 'NOT_FOUND', `Review with id ${data.id} not found`);

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
						and(
							eq(schema.reviewLikes.reviewId, data.id),
							eq(schema.reviewLikes.userId, userId),
						),
					);

				await tx
					.update(schema.reviews)
					.set({
						totalLikes: sql`${schema.reviews.totalLikes} - 1`,
					})
					.where(eq(schema.reviews.id, data.id));

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
				reviewId: data.id,
				userId,
			});

			await tx
				.update(schema.reviews)
				.set({
					totalLikes: sql`${schema.reviews.totalLikes} + 1`,
				})
				.where(eq(schema.reviews.id, data.id));

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

	async listLikes(_userId: string, data: dto.ListLikesInput) {
		const offset = Pagination.getOffset(data);

		const result = await this.db.query.reviewLikes.findMany({
			where: {
				reviewId: data.id,
			},
			with: {
				user: {
					columns: {
						id: true,
						username: true,
						name: true,
						image: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
			offset,
			limit: data.pageSize,
		});

		const totalRecords = await this.db.$count(
			schema.reviewLikes,
			eq(schema.reviewLikes.reviewId, data.id),
		);

		return {
			users: result.map((like) => like.user),
			pagination: Pagination.compute(data, totalRecords),
		};
	}

	async getLikedStatuses(userId: string | null, ids: string[]) {
		if (!userId) {
			return [];
		}

		const result = await this.db
			.select({
				reviewId: schema.reviewLikes.reviewId,
			})
			.from(schema.reviewLikes)
			.where(
				and(
					eq(schema.reviewLikes.userId, userId),
					inArray(schema.reviewLikes.reviewId, ids),
				),
			);

		return unique(result.map((r) => r.reviewId));
	}
}
