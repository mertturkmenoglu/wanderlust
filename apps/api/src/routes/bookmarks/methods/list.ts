import { Tokens, Types } from '@wanderlust/common';
import type { Bookmarks } from '@wanderlust/contract';
import { $includes, type DatabaseService, schema } from '@wanderlust/db';
import { eq, sql } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { z } from 'zod';
import { definePreparedStatement } from '@/lib/define-prepared-statement';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { unique } from '@/lib/unique';
import { FavoriteStatusProvider } from '@/routes/favorites/provides/status';
import { os } from '../shared/router';

@injectable()
export class ListBookmarksMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(FavoriteStatusProvider)
		private readonly favorites: FavoriteStatusProvider,
	) {}

	route() {
		return os.list.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Bookmarks.dto.ListInput,
	): Promise<Bookmarks.dto.ListOutput> {
		const bookmarks = await findMany.execute(this.db, {
			userId,
			limit: data.pageSize,
			offset: Types.Pagination.getOffset(data),
		});

		const totalItems = await this.db.$count(
			schema.bookmarks,
			eq(schema.bookmarks.userId, userId),
		);

		const pagination = Types.Pagination.compute(data, totalItems);

		const enrichedBookmarks = await this.enrich(userId, bookmarks);

		return {
			bookmarks: enrichedBookmarks,
			pagination,
		};
	}

	private async enrich(
		userId: string,
		bookmarks: Omit<Types.Bookmarks.Extended, 'meta'>[],
	): Promise<Types.Bookmarks.Extended[]> {
		const ids = unique(bookmarks.map((b) => b.placeId));
		const favoriteIds = await this.favorites.getFavoriteStatuses(userId, ids);

		return bookmarks.map((bookmark) => ({
			...bookmark,
			meta: {
				isFavorite: favoriteIds.includes(bookmark.placeId),
			},
		}));
	}
}

const findMany = definePreparedStatement({
	schema: z.object({
		userId: z.string(),
		offset: z.int(),
		limit: z.int(),
	}),
	statement: (db) => {
		return db.query.bookmarks
			.findMany({
				where: {
					userId: sql.placeholder('userId'),
				},
				orderBy: {
					createdAt: 'desc',
				},
				offset: sql.placeholder('offset'),
				limit: sql.placeholder('limit'),
				with: {
					place: $includes.place,
				},
			})
			.prepare('bookmarks_find_many');
	},
});
