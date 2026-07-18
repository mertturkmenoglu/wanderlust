import type { Bookmarks } from '@wanderlust/contract';
import { inject, injectable } from 'inversify';
import { TraceAll } from '@/lib/tracer';
import { BookmarksEnricher } from './enricher';
import { BookmarksRepository } from './repository';

@injectable()
@TraceAll()
export class BookmarksService {
	constructor(
		@inject(BookmarksRepository) private readonly repo: BookmarksRepository,
		@inject(BookmarksEnricher) private readonly enricher: BookmarksEnricher,
	) {}

	async create(
		userId: string,
		data: Bookmarks.dto.CreateInput,
	): Promise<Bookmarks.dto.CreateOutput> {
		const result = await this.repo.create(userId, data);

		return result;
	}

	async list(
		userId: string,
		data: Bookmarks.dto.ListInput,
	): Promise<Bookmarks.dto.ListOutput> {
		const { bookmarks, pagination } = await this.repo.list(userId, data);

		const enrichedBookmarks = await this.enricher.enrichBookmarks(
			userId,
			bookmarks,
		);

		return {
			bookmarks: enrichedBookmarks,
			pagination,
		};
	}

	async delete(
		userId: string,
		data: Bookmarks.dto.DeleteInput,
	): Promise<Bookmarks.dto.DeleteOutput> {
		const result = await this.repo.delete(userId, data);

		return result;
	}
}
