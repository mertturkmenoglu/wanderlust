import { Tokens, Types } from '@wanderlust/common';
import type { Favorites } from '@wanderlust/contract';
import { $includes, type DatabaseService, schema } from '@wanderlust/db';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { os } from '../shared/router';

@injectable()
export class ListFavoritesByUsernameMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.listByUsername.handler(async ({ input }) => {
			const result = await this.execute(input);

			return result;
		});
	}

	private async execute(
		data: Favorites.dto.ListByUsernameInput,
	): Promise<Favorites.dto.ListByUsernameOutput> {
		const offset = Types.Pagination.getOffset(data);

		const user = await this.db.query.users.findFirst({
			where: {
				username: data.username,
			},
		});

		invariant(
			user,
			'NOT_FOUND',
			`User with username ${data.username} not found`,
		);

		const favorites = await this.db.query.favorites.findMany({
			where: {
				userId: user.id,
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
			eq(schema.favorites.userId, user.id),
		);

		const pagination = Types.Pagination.compute(data, totalItems);

		return {
			favorites,
			pagination,
		};
	}
}
