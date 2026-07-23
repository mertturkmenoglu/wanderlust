import { Tokens, Types } from '@wanderlust/common';
import type { Favorites } from '@wanderlust/contract';
import { $includes, type DatabaseService, schema } from '@wanderlust/db';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { TraceAll } from '@/lib/tracer';

@injectable()
@TraceAll()
export class FavoritesRepository {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	async create(userId: string, data: Favorites.dto.CreateInput) {
		const results = await this.db.transaction(async (tx) => {
			const [result] = await tx
				.insert(schema.favorites)
				.values({
					userId: userId,
					placeId: data.placeId,
				})
				.returning();

			invariant(result, 'INTERNAL_SERVER_ERROR', 'No favorite returned');

			await tx
				.update(schema.places)
				.set({
					totalFavorites: sql`${schema.places.totalFavorites} + 1`,
				})
				.where(eq(schema.places.id, data.placeId));

			const place = await tx.query.places.findFirst({
				where: {
					id: data.placeId,
				},
			});

			invariant(place, 'NOT_FOUND', `Place with ID ${data.placeId} not found`);

			return [result, place] as const;
		});

		return results;
	}

	async list(userId: string, data: Favorites.dto.ListInput) {
		const offset = Types.Pagination.getOffset(data);

		const favorites = await this.db.query.favorites.findMany({
			where: {
				userId: userId,
			},
			orderBy: {
				createdAt: 'desc',
			},
			offset,
			limit: data.pageSize,
			with: {
				place: $includes.place,
			},
		});

		const totalItems = await this.db.$count(
			schema.favorites,
			eq(schema.favorites.userId, userId),
		);

		const pagination = Types.Pagination.compute(data, totalItems);

		return {
			favorites,
			pagination,
		};
	}

	async _delete(userId: string, data: Favorites.dto.DeleteInput) {
		await this.db.transaction(async (tx) => {
			const res = await tx
				.delete(schema.favorites)
				.where(
					and(
						eq(schema.favorites.userId, userId),
						eq(schema.favorites.placeId, data.placeId),
					),
				);

			invariant(res.rowCount !== 0, 'NOT_FOUND', 'Favorite not found');

			await tx
				.update(schema.places)
				.set({
					totalFavorites: sql`${schema.places.totalFavorites} - 1`,
				})
				.where(eq(schema.places.id, data.placeId));
		});
	}

	async listByUsername(data: Favorites.dto.ListByUsernameInput) {
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

		const favorites = await this.db.query.favorites.findMany({
			where: {
				userId: user.id,
			},
			orderBy: {
				createdAt: 'desc',
			},
			offset,
			limit: data.pageSize,
			with: {
				place: $includes.place,
			},
		});

		const totalItems = await this.db.$count(
			schema.favorites,
			eq(schema.favorites.userId, user.id),
		);

		const pagination = Types.Pagination.compute(data, totalItems);

		return {
			favorites,
			pagination,
		};
	}

	async getFavoriteStatuses(userId: string | null, ids: string[]) {
		if (!userId) {
			return [];
		}

		const result = await this.db
			.select({ placeId: schema.favorites.placeId })
			.from(schema.favorites)
			.where(
				and(
					eq(schema.favorites.userId, userId),
					inArray(schema.favorites.placeId, ids),
				),
			);

		return Array.from(new Set(result.map((r) => r.placeId)));
	}
}
