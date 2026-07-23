import { trace } from '@opentelemetry/api';
import { ORPCError } from '@orpc/client';
import { Tokens, Types } from '@wanderlust/common';
import type { Reviews } from '@wanderlust/contract';
import { $includes, type DatabaseService, schema } from '@wanderlust/db';
import { nanoid } from '@wanderlust/uid';
import * as dz from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { areSetsEqual } from '@/lib/set-equality';
import { TraceAll } from '@/lib/tracer';
import { unique } from '@/lib/unique';
import { countByPlaceId } from './statements';
import type { CreateReviewParams } from './types';

@injectable()
@TraceAll()
export class ReviewsRepository {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	async get(data: Reviews.dto.GetInput) {
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

	async create(userId: string, data: CreateReviewParams) {
		const span = trace.getActiveSpan();

		span?.addEvent(
			'review.create.repository',
			{
				'user.id': userId,
				'place.id': data.placeId,
				'review.rating': data.rating,
				'review.visitedAt': data.visitedAt?.toISOString() || 'unknown',
				'review.detectedLanguage': data.detectedLanguage || 'unknown',
				'review.attachments': JSON.stringify(data.files ?? []),
				'review.facets': JSON.stringify(data.facets),
			},
			new Date(),
		);

		void this.checkAssetsStatusAndPermissions(userId, data.files ?? []);

		const results = await this.db.transaction(async (tx) => {
			const [review] = await tx
				.insert(schema.reviews)
				.values({
					id: nanoid(),
					placeId: data.placeId,
					userId: userId,
					content: data.content,
					facets: data.facets,
					rating: data.rating,
					visitedAt: data.visitedAt,
					detectedLanguage: data.detectedLanguage,
					totalLikes: 0,
				})
				.returning();

			invariant(review, 'INTERNAL_SERVER_ERROR', 'Failed to create review');

			if (data.files && data.files.length > 0) {
				await tx.insert(schema.assetsToReviews).values(
					data.files.map((f, i) => ({
						assetId: f,
						order: i,
						reviewId: review.id,
					})),
				);

				await tx
					.update(schema.assets)
					.set({
						status: 'available',
					})
					.where(dz.inArray(schema.assets.id, data.files));
			}

			await tx
				.update(schema.places)
				.set({
					totalVotes: dz.sql`${schema.places.totalVotes} + 1`,
					totalPoints: dz.sql`${schema.places.totalPoints} + ${data.rating}`,
				})
				.where(dz.eq(schema.places.id, data.placeId));

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

	async checkAssetsStatusAndPermissions(userId: string, assetIds: string[]) {
		if (assetIds.length === 0) {
			return;
		}

		const assets = await this.db.query.assets.findMany({
			where: {
				id: {
					in: assetIds,
				},
			},
			columns: {
				id: true,
				uploadedBy: true,
				status: true,
				bucket: true,
			},
		});

		const fetchedAssetIds = assets.map((a) => a.id);
		const ok = areSetsEqual(new Set(fetchedAssetIds), new Set(assetIds));

		if (!ok) {
			throw new ORPCError('CONFLICT', {
				message: 'One or more assets do not exist or are not accessible',
			});
		}

		for (const asset of assets) {
			if (
				asset.uploadedBy !== userId ||
				asset.status !== 'ready' ||
				asset.bucket !== 'reviews'
			) {
				// For security reasons, we don't reveal which asset is not accessible to the user. We just throw a generic error.
				throw new ORPCError('CONFLICT', {
					message: 'One or more assets do not exist or are not accessible',
				});
			}
		}
	}

	async _delete(userId: string, data: Reviews.dto.DeleteInput) {
		return await this.db.transaction(async (tx) => {
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
	}

	async listByUsername(data: Reviews.dto.ListByUsernameInput) {
		const offset = Types.Pagination.getOffset(data);

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
			dz.eq(schema.reviews.userId, user.id),
		);

		return {
			reviews: result,
			pagination: Types.Pagination.compute(data, totalRecords),
		};
	}

	async listByPlaceId(data: Reviews.dto.ListByPlaceIdInput) {
		const offset = Types.Pagination.getOffset(data);
		const min = data.minRating || 0;
		const max = data.maxRating || 5;
		let sortBy = data.sortBy || 'createdAt';

		if (data.sortBy === 'created_at') {
			sortBy = 'createdAt';
		} else if (data.sortBy === 'rating') {
			sortBy = 'rating';
		} else if (data.sortBy === 'likes') {
			sortBy = 'totalLikes';
		}

		const sortOrd = data.sortOrd || 'desc';

		const result = await this.db.query.reviews.findMany({
			where: {
				placeId: data.id,
				rating: {
					gte: min,
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
			orderBy: {
				[sortBy]: sortOrd,
			},
			offset,
			limit: data.pageSize,
		});

		const [total] = await countByPlaceId.execute(this.db, {
			placeId: data.id,
			minRating: min,
			maxRating: max,
		});

		invariant(total, 'INTERNAL_SERVER_ERROR', 'Failed to count reviews');

		const totalRecords = total.count;

		return {
			reviews: result,
			pagination: Types.Pagination.compute(data, totalRecords),
		};
	}

	async getRatings(data: Reviews.dto.GetRatingsInput) {
		const res = await this.db
			.select({
				rating: schema.reviews.rating,
				count: dz.count(schema.reviews.rating),
			})
			.from(schema.reviews)
			.where(dz.eq(schema.reviews.placeId, data.id))
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
		_data: Reviews.dto.ListAssetsByPlaceIdInput,
	): Promise<Reviews.dto.ListAssetsByPlaceIdOutput> {
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

	async like(userId: string, data: Reviews.dto.LikeInput) {
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
						dz.and(
							dz.eq(schema.reviewLikes.reviewId, data.id),
							dz.eq(schema.reviewLikes.userId, userId),
						),
					);

				await tx
					.update(schema.reviews)
					.set({
						totalLikes: dz.sql`${schema.reviews.totalLikes} - 1`,
					})
					.where(dz.eq(schema.reviews.id, data.id));

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
					totalLikes: dz.sql`${schema.reviews.totalLikes} + 1`,
				})
				.where(dz.eq(schema.reviews.id, data.id));

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

	async listLikes(_userId: string, data: Reviews.dto.ListLikesInput) {
		const offset = Types.Pagination.getOffset(data);

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
			dz.eq(schema.reviewLikes.reviewId, data.id),
		);

		return {
			users: result.map((like) => like.user),
			pagination: Types.Pagination.compute(data, totalRecords),
		};
	}

	async getLikedStatuses(userId: string | null, ids: string[]) {
		if (!userId) {
			return [];
		}

		const result = await this.db.query.reviewLikes.findMany({
			columns: {
				reviewId: true,
			},
			where: {
				userId: userId,
				reviewId: {
					in: ids,
				},
			},
		});

		return unique(result.map((r) => r.reviewId));
	}

	async getUsersByUsernames(usernames: string[]) {
		const result = await this.db.query.users.findMany({
			where: {
				username: {
					in: usernames,
				},
			},
			columns: {
				id: true,
				username: true,
				name: true,
				image: true,
			},
		});

		return result;
	}
}
