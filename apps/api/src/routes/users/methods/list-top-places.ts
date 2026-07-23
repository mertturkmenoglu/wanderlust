import { Tokens } from '@wanderlust/common';
import type { Users } from '@wanderlust/contract';
import type { DatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { FavoriteStatusProvider } from '@/routes/favorites/provides/status';
import { os } from '../shared/router';
import { findManyTopPlaces, findUserByUsername } from '../shared/statements';

@injectable()
export class ListTopPlacesMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(FavoriteStatusProvider)
		private readonly favorites: FavoriteStatusProvider,
	) {}

	route() {
		return os.listTopPlaces.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Users.dto.ListTopPlacesInput,
	): Promise<Users.dto.ListTopPlacesOutput> {
		const user = await findUserByUsername.execute(this.db, {
			username: data.username,
		});

		invariant(
			user,
			'NOT_FOUND',
			`User with username ${data.username} not found`,
		);

		const topPlaces = await findManyTopPlaces.execute(this.db, {
			userId: user.id,
		});

		const placeIds = Array.from(new Set(topPlaces.map((tp) => tp.placeId)));

		const favoriteIds = await this.favorites.getFavoriteStatuses(
			userId,
			placeIds,
		);

		return {
			places: topPlaces.map((tp) => ({
				place: tp.place,
				meta: {
					isFavorite: favoriteIds.includes(tp.placeId),
				},
			})),
		};
	}
}
