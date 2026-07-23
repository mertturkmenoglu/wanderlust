import { Tokens } from '@wanderlust/common';
import { type DatabaseService, schema } from '@wanderlust/db';
import { and, eq, inArray } from 'drizzle-orm';
import { inject, injectable } from 'inversify';

@injectable()
export class FavoriteStatusProvider {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	public async getFavoriteStatuses(
		userId: string | null,
		placeIds: string[],
	): Promise<string[]> {
		if (!userId) {
			return [];
		}

		const result = await this.db
			.select({ placeId: schema.favorites.placeId })
			.from(schema.favorites)
			.where(
				and(
					eq(schema.favorites.userId, userId),
					inArray(schema.favorites.placeId, placeIds),
				),
			);

		return Array.from(new Set(result.map((r) => r.placeId)));
	}
}
