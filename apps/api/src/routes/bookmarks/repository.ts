import { ORPCError } from '@orpc/server';
import { Pagination } from '@wanderlust/common';
import * as schema from '@wanderlust/db';
import { DatabaseService, type TDatabaseService } from '@wanderlust/db';
import { and, eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { FavoritesRepository } from '../favorites/repository';
import type * as dto from './dto';

@injectable()
export class BookmarksRepository {
	private readonly db: TDatabaseService;

	constructor(
		@inject(DatabaseService) db: DatabaseService,
		@inject(FavoritesRepository)
		private readonly favoritesRepo: FavoritesRepository,
	) {
		this.db = db.get();
	}

	async create(userId: string, data: dto.CreateInput) {
		try {
			const [result] = await this.db
				.insert(schema.bookmarks)
				.values({
					userId: userId,
					placeId: data.placeId,
				})
				.returning();

			if (!result) {
				throw new Error('No bookmark returned after insertion');
			}

			return result;
		} catch (err) {
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to create bookmark',
				cause: err,
			});
		}
	}

	async list(userId: string, data: dto.ListInput) {
		const offset = Pagination.getOffset(data);

		try {
			const bookmarks = await this.db.query.bookmarks.findMany({
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
				schema.bookmarks,
				eq(schema.bookmarks.userId, userId),
			);

			const pagination = Pagination.compute(data, totalItems);

			const placeIds = Array.from(new Set(bookmarks.map((b) => b.placeId)));
			const favoriteStatuses = await this.favoritesRepo.getFavoriteStatuses(
				userId,
				placeIds,
			);

			return {
				bookmarks: bookmarks.map((bookmark) => ({
					...bookmark,
					meta: {
						isFavorite: favoriteStatuses.includes(bookmark.placeId),
					},
				})),
				pagination,
			};
		} catch (err) {
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to fetch bookmarks',
				cause: err,
			});
		}
	}

	async _delete(userId: string, data: dto.DeleteInput) {
		try {
			const res = await this.db
				.delete(schema.bookmarks)
				.where(
					and(
						eq(schema.bookmarks.userId, userId),
						eq(schema.bookmarks.placeId, data.placeId),
					),
				);

			if (res.rowCount === 0) {
				throw new ORPCError('NOT_FOUND', {
					message: 'Bookmark not found',
				});
			}
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to delete bookmark',
				cause: err,
			});
		}
	}
}
