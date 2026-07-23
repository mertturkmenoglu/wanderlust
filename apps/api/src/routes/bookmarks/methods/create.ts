import { Tokens } from '@wanderlust/common';
import type { Bookmarks } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { os } from '../shared/router';

@injectable()
export class CreateBookmarkMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.create.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
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
}
