import { Tokens, Types } from '@wanderlust/common';
import type { Favorites } from '@wanderlust/contract';
import { $includes, type DatabaseService, schema } from '@wanderlust/db';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { os } from '../shared/router';

@injectable()
export class ListFavoritesMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.list.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Favorites.dto.ListInput,
	): Promise<Favorites.dto.ListOutput> {
		const offset = Types.Pagination.getOffset(data);

		const favorites = await this.db.query.favorites.findMany({
			where: {
				userId: userId,
			},
			orderBy: {
				createdAt: 'desc',
			},
			offset,
			limit: data.pageSize,
			with: {
				place: $includes.place,
			},
		});

		const totalItems = await this.db.$count(
			schema.favorites,
			eq(schema.favorites.userId, userId),
		);

		const pagination = Types.Pagination.compute(data, totalItems);

		return {
			favorites,
			pagination,
		};
	}
}
