import { Tokens } from '@wanderlust/common';
import type { Bookmarks } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { and, eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { os } from '../shared/router';

@injectable()
export class DeleteBookmarkMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.delete.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
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
