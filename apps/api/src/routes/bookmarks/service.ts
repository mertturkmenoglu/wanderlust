import type { Bookmarks } from '@wanderlust/contract';
import { inject, injectable } from 'inversify';
import { TraceAll } from '@/lib/tracer';
import { BookmarksRepository } from './repository';

@injectable()
@TraceAll()
export class BookmarksService {
	constructor(
		@inject(BookmarksRepository) private readonly repo: BookmarksRepository,
	) {}

	async create(
		userId: string,
		data: Bookmarks.dto.CreateInput,
	): Promise<Bookmarks.dto.CreateOutput> {
		const result = await this.repo.create(userId, data);

		return {
			bookmark: result,
		};
	}

	async list(
		userId: string,
		data: Bookmarks.dto.ListInput,
	): Promise<Bookmarks.dto.ListOutput> {
		const result = await this.repo.list(userId, data);

		return {
			bookmarks: result.bookmarks,
			pagination: result.pagination,
		};
	}

	async _delete(
		userId: string,
		data: Bookmarks.dto.DeleteInput,
	): Promise<Bookmarks.dto.DeleteOutput> {
		await this.repo.delete(userId, data);

		return {};
	}
}
