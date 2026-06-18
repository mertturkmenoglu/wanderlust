import { ORPCError } from '@orpc/server';
import { Pagination } from '@wanderlust/common';
import * as schema from '@wanderlust/db';
import { DatabaseService, type TDatabaseService } from '@wanderlust/db';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import type * as dto from './dto';

@injectable()
export class FavoritesRepository {
	private readonly db: TDatabaseService;

	constructor(@inject(DatabaseService) db: DatabaseService) {
		this.db = db.get();
	}

	async create(userId: string, data: dto.CreateInput) {
		try {
			const results = await this.db.transaction(async (tx) => {
				const [result] = await tx
					.insert(schema.favorites)
					.values({
						userId: userId,
						placeId: data.placeId,
					})
					.returning();

				if (!result) {
					throw new Error('No favorite returned after insertion');
				}

				await tx
					.update(schema.places)
					.set({
						totalFavorites: sql`${schema.places.totalFavorites} + 1`,
					})
					.where(eq(schema.places.id, data.placeId));

				const place = await tx.query.places.findFirst({
					where: (t, { eq }) => eq(t.id, data.placeId),
				});

				if (!place) {
					throw new Error('Cannot find place after favorite insertion');
				}

				return [result, place] as const;
			});

			return results;
		} catch (err) {
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to create favorite',
				cause: err,
			});
		}
	}

	async list(userId: string, data: dto.ListInput) {
		const offset = Pagination.getOffset(data);

		try {
			const favorites = await this.db.query.favorites.findMany({
				where: (t, { eq }) => eq(t.userId, userId),
				orderBy: (t, { desc }) => desc(t.createdAt),
				offset,
				limit: data.pageSize,
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
							accolades: {
								with: {
									accolade: true,
								}
							}
						},
					},
				},
			});

			const totalItems = await this.db.$count(
				schema.favorites,
				eq(schema.favorites.userId, userId),
			);

			const pagination = Pagination.compute(data, totalItems);

			return {
				favorites,
				pagination,
			};
		} catch (err) {
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to fetch favorites',
				cause: err,
			});
		}
	}

	async _delete(userId: string, data: dto.DeleteInput) {
		try {
			await this.db.transaction(async (tx) => {
				const res = await tx
					.delete(schema.favorites)
					.where(
						and(
							eq(schema.favorites.userId, userId),
							eq(schema.favorites.placeId, data.placeId),
						),
					);

				if (res.rowCount === 0) {
					throw new ORPCError('NOT_FOUND', {
						message: 'Favorite not found',
					});
				}

				await tx
					.update(schema.places)
					.set({
						totalFavorites: sql`${schema.places.totalFavorites} - 1`,
					})
					.where(eq(schema.places.id, data.placeId));
			});
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to delete favorite',
				cause: err,
			});
		}
	}

	async listByUsername(data: dto.ListByUsernameInput) {
		const offset = Pagination.getOffset(data);

		try {
			const user = await this.db.query.users.findFirst({
				where: (t, { eq }) => eq(t.username, data.username),
			});

			if (!user) {
				throw new ORPCError('NOT_FOUND', {
					message: 'User not found',
				});
			}

			const favorites = await this.db.query.favorites.findMany({
				where: (t, { eq }) => eq(t.userId, user.id),
				orderBy: (t, { desc }) => desc(t.createdAt),
				offset,
				limit: data.pageSize,
				with: {
					place: {
						with: {
							address: {
								with: {
									city: true,
								},
							},
							accolades: {
								with: {
									accolade: true,
								}
							},
							category: true,
							assets: true,
						},
					},
				},
			});

			const totalItems = await this.db.$count(
				schema.favorites,
				eq(schema.favorites.userId, user.id),
			);

			const pagination = Pagination.compute(data, totalItems);

			return {
				favorites,
				pagination,
			};
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to fetch favorites',
				cause: err,
			});
		}
	}

	async getFavoriteStatuses(userId: string, ids: string[]) {
		try {
			const result = await this.db
				.select({ placeId: schema.favorites.placeId })
				.from(schema.favorites)
				.where(and(eq(schema.favorites.userId, userId), inArray(schema.favorites.placeId, ids)));

			return Array.from(new Set(result.map((r) => r.placeId)));
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to fetch favorite statuses',
				cause: err,
			});
		}
	}
}
