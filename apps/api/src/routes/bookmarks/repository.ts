import { Types } from '@wanderlust/common';
import type { Bookmarks } from '@wanderlust/contract';
import { DatabaseService, schema, type TDatabaseService } from '@wanderlust/db';
import { and, eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { TraceAll } from '@/lib/tracer';
import { findMany } from './statements';

@injectable()
@TraceAll()
export class BookmarksRepository {
	private readonly db: TDatabaseService;

	constructor(@inject(DatabaseService) db: DatabaseService) {
		this.db = db.get();
	}

	async create(
		userId: string,
		data: Bookmarks.dto.CreateInput,
	): Promise<Bookmarks.dto.CreateOutput> {
		const [result] = await this.db
			.insert(schema.bookmarks)
			.values({
				userId: userId,
				placeId: data.placeId,
			})
			.returning();

		invariant(result, 'INTERNAL_SERVER_ERROR', 'No bookmark returned');

		return {
			bookmark: result,
		};
	}

	async list(userId: string, data: Bookmarks.dto.ListInput) {
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

		return {
			bookmarks,
			pagination,
		};
	}

	async delete(
		userId: string,
		data: Bookmarks.dto.DeleteInput,
	): Promise<Bookmarks.dto.DeleteOutput> {
		const res = await this.db
			.delete(schema.bookmarks)
			.where(
				and(
					eq(schema.bookmarks.userId, userId),
					eq(schema.bookmarks.placeId, data.placeId),
				),
			);

		invariant(res.rowCount !== 0, 'NOT_FOUND', 'Bookmark not found');

		return {};
	}
}
