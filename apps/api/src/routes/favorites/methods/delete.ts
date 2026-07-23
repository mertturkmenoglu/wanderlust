import { Tokens } from '@wanderlust/common';
import type { Favorites } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { and, eq, sql } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { os } from '../shared/router';

@injectable()
export class DeleteFavoriteMethod {
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
		data: Favorites.dto.DeleteInput,
	): Promise<Favorites.dto.DeleteOutput> {
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

		return {};
	}
}
