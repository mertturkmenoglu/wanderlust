import { ORPCError } from '@orpc/client';
import { Pagination } from '@wanderlust/common';
import * as schema from '@wanderlust/db';
import { DatabaseService, type TDatabaseService } from '@wanderlust/db';
import { nanoid } from '@wanderlust/uid';
import { and, count, eq, gte, lte, sql } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import type * as dto from './dto';

@injectable()
export class ReviewsRepository {
	private readonly db: TDatabaseService;

	constructor(@inject(DatabaseService) db: DatabaseService) {
		this.db = db.get();
	}

	async get(data: dto.GetInput) {
		try {
			const result = await this.db.query.reviews.findFirst({
				where: (reviews, { eq }) => eq(reviews.id, data.id),
				with: {
					place: {
						with: {
							address: {
								with: {
									city: true,
								},
							},
							category: true,
							assets: true,
						},
					},
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

			if (!result) {
				throw new ORPCError('NOT_FOUND', {
					message: `Review with id ${data.id} not found`,
				});
			}

			return result;
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to get review',
				cause: err,
			});
		}
	}

	async create(userId: string, data: dto.CreateInput, urls: string[]) {
		try {
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

				if (!review) {
					throw new ORPCError('INTERNAL_SERVER_ERROR', {
						message: 'Failed to create review',
					});
				}

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
					where: (reviews, { eq }) => eq(reviews.id, review.id),
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

				if (!res) {
					throw new ORPCError('INTERNAL_SERVER_ERROR', {
						message: 'Failed to retrieve created review',
					});
				}

				const place = await tx.query.places.findFirst({
					where: (t, { eq }) => eq(t.id, review.placeId),
				});

				if (!place) {
					throw new ORPCError('INTERNAL_SERVER_ERROR', {
						message: 'Failed to retrieve the place after creating the review',
					});
				}

				return [res, place] as const;
			});

			return results;
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to get review',
				cause: err,
			});
		}
	}

	async _delete(userId: string, data: dto.DeleteInput) {
		try {
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

				if (!deleted) {
					throw new ORPCError('NOT_FOUND', {
						message: `Review with id ${data.id} not found or you are not authorized to delete it`,
					});
				}

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
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to delete review',
				cause: err,
			});
		}
	}

	async listByUsername(data: dto.ListByUsernameInput) {
		const offset = Pagination.getOffset(data);

		try {
			const user = await this.db.query.users.findFirst({
				where: (users, { eq }) => eq(users.username, data.username),
			});

			if (!user) {
				throw new ORPCError('NOT_FOUND', {
					message: `User with username ${data.username} not found`,
				});
			}

			const result = await this.db.query.reviews.findMany({
				where: (reviews, { eq }) => eq(reviews.userId, user.id),
				with: {
					place: {
						with: {
							address: {
								with: {
									city: true,
								},
							},
							category: true,
							assets: true,
						},
					},
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
				orderBy: (reviews, { desc }) => desc(reviews.createdAt),
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
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to list reviews',
				cause: err,
			});
		}
	}

	async listByPlaceId(data: dto.ListByPlaceIdInput) {
		const offset = Pagination.getOffset(data);
		const min = data.minRating || 0;
		const max = data.maxRating || 5;

		try {
			const result = await this.db.query.reviews.findMany({
				where: (reviews, { eq, and, gt, lte }) =>
					and(
						eq(reviews.placeId, data.id),
						gt(reviews.rating, min),
						lte(reviews.rating, max),
					),
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
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to list reviews',
				cause: err,
			});
		}
	}

	async getRatings(data: dto.GetRatingsInput) {
		try {
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
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to get ratings',
				cause: err,
			});
		}
	}

	async listAssetsByPlaceId(data: dto.ListAssetsByPlaceIdInput) {
		try {
			const result = await this.db.query.assets.findMany({
				where: (assets, { eq, and }) =>
					and(eq(assets.entityId, data.id), eq(assets.entityType, 'review')),
			});

			return {
				assets: result,
			};
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to get review',
				cause: err,
			});
		}
	}
}
