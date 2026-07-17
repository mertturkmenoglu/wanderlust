import { Types } from '@wanderlust/common';
import type { Bookmarks } from '@wanderlust/contract';
import {
	$includes,
	DatabaseService,
	schema,
	type TDatabaseService,
} from '@wanderlust/db';
import { and, eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { attachFavoriteMetadata } from '@/lib/attach-favorites';
import { invariant } from '@/lib/invariant';
import { TraceAll } from '@/lib/tracer';
import { FavoritesRepository } from '../favorites/repository';

@injectable()
@TraceAll()
export class BookmarksRepository {
	private readonly db: TDatabaseService;

	constructor(
		@inject(DatabaseService) db: DatabaseService,
		@inject(FavoritesRepository)
		private readonly favoritesRepo: FavoritesRepository,
	) {
		this.db = db.get();
	}

	async create(userId: string, data: Bookmarks.dto.CreateInput) {
		const [result] = await this.db
			.insert(schema.bookmarks)
			.values({
				userId: userId,
				placeId: data.placeId,
			})
			.returning();

		invariant(result, 'INTERNAL_SERVER_ERROR', 'No bookmark returned');

		return result;
	}

	async list(userId: string, data: Bookmarks.dto.ListInput) {
		const offset = Types.Pagination.getOffset(data);

		const bookmarks = await this.db.query.bookmarks.findMany({
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
			schema.bookmarks,
			eq(schema.bookmarks.userId, userId),
		);

		const pagination = Types.Pagination.compute(data, totalItems);

		const placeIds = Array.from(new Set(bookmarks.map((b) => b.placeId)));
		const favoriteIds = await this.favoritesRepo.getFavoriteStatuses(
			userId,
			placeIds,
		);

		return {
			bookmarks: attachFavoriteMetadata(bookmarks, favoriteIds),
			pagination,
		};
	}

	async delete(userId: string, data: Bookmarks.dto.DeleteInput) {
		const res = await this.db
			.delete(schema.bookmarks)
			.where(
				and(
					eq(schema.bookmarks.userId, userId),
					eq(schema.bookmarks.placeId, data.placeId),
				),
			);

		invariant(res.rowCount !== 0, 'NOT_FOUND', 'Bookmark not found');
	}
}
