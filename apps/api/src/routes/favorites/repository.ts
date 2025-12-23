import { ORPCError } from '@orpc/server';
import { and, eq, sql } from 'drizzle-orm';
import type { TDatabaseService } from '@/db';
import * as schema from '@/db/schema';
import { Pagination } from '@/lib/pagination';
import type * as dto from './dto';

export class FavoritesRepository {
	constructor(private readonly db: TDatabaseService) {}

	async create(userId: string, data: dto.CreateInput) {
		try {
			const result = await this.db.transaction(async (tx) => {
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

				return result;
			});

			return result;
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
}
