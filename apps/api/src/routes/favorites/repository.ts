import { Pagination } from '@wanderlust/common';
import type { favorites as dto } from '@wanderlust/contract';
import * as schema from '@wanderlust/db';
import {
	$includes,
	DatabaseService,
	type TDatabaseService,
} from '@wanderlust/db';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';

@injectable()
export class FavoritesRepository {
	private readonly db: TDatabaseService;

	constructor(@inject(DatabaseService) db: DatabaseService) {
		this.db = db.get();
	}

	async create(userId: string, data: dto.CreateInput) {
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
				where: (t, { eq }) => eq(t.id, data.placeId),
			});

			invariant(place, 'NOT_FOUND', `Place with ID ${data.placeId} not found`);

			return [result, place] as const;
		});

		return results;
	}

	async list(userId: string, data: dto.ListInput) {
		const offset = Pagination.getOffset(data);

		const favorites = await this.db.query.favorites.findMany({
			where: (t, { eq }) => eq(t.userId, userId),
			orderBy: (t, { desc }) => desc(t.createdAt),
			offset,
			limit: data.pageSize,
			with: {
				place: {
					with: $includes.place,
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
	}

	async _delete(userId: string, data: dto.DeleteInput) {
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

	async listByUsername(data: dto.ListByUsernameInput) {
		const offset = Pagination.getOffset(data);

		const user = await this.db.query.users.findFirst({
			where: (t, { eq }) => eq(t.username, data.username),
		});

		invariant(user, 'NOT_FOUND', `User with username ${data.username} not found`);

		const favorites = await this.db.query.favorites.findMany({
			where: (t, { eq }) => eq(t.userId, user.id),
			orderBy: (t, { desc }) => desc(t.createdAt),
			offset,
			limit: data.pageSize,
			with: {
				place: {
					with: $includes.place,
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
