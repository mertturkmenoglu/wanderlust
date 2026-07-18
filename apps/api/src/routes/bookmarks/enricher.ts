import type { Types } from '@wanderlust/common';
import { inject, injectable } from 'inversify';
import { TraceAll } from '@/lib/tracer';
import { unique } from '@/lib/unique';
import { FavoritesRepository } from '../favorites/repository';

@injectable()
@TraceAll()
export class BookmarksEnricher {
	constructor(
		@inject(FavoritesRepository)
		private readonly favoritesRepo: FavoritesRepository,
	) {}

	async enrichBookmarks(
		userId: string,
		bookmarks: Omit<Types.Bookmarks.Extended, 'meta'>[],
	): Promise<Types.Bookmarks.Extended[]> {
		const ids = unique(bookmarks.map((b) => b.placeId));
		const favoriteIds = await this.favoritesRepo.getFavoriteStatuses(
			userId,
			ids,
		);

		return bookmarks.map((bookmark) => ({
			...bookmark,
			meta: {
				isFavorite: favoriteIds.includes(bookmark.placeId),
			},
		}));
	}
}
