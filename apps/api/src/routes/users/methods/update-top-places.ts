import { Tokens } from '@wanderlust/common';
import type { Users } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { FavoriteStatusProvider } from '@/routes/favorites/provides/status';
import { os } from '../shared/router';
import { findManyTopPlaces, findUserById } from '../shared/statements';

@injectable()
export class UpdateTopPlacesMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(FavoriteStatusProvider)
		private readonly favorites: FavoriteStatusProvider,
	) {}

	route() {
		return os.updateTopPlaces.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Users.dto.UpdateTopPlacesInput,
	): Promise<Users.dto.UpdateTopPlacesOutput> {
		const result = await this.db.transaction(async (tx) => {
			const user = await findUserById.execute(tx, { id: userId });

			invariant(user, 'NOT_FOUND', `User with id ${userId} not found`);

			// Delete existing top places
			await tx
				.delete(schema.userTopPlaces)
				.where(eq(schema.userTopPlaces.userId, userId));

			// Only try to insert if there are places to insert
			if (data.placeIds.length !== 0) {
				// Insert new top places
				const inserts = data.placeIds.map((placeId, index) => ({
					userId,
					placeId,
					index,
				}));

				await tx.insert(schema.userTopPlaces).values(inserts);
			}

			// Fetch and return the updated top places
			const topPlaces = await findManyTopPlaces.execute(tx, {
				userId,
			});

			const places = topPlaces.map((tp) => tp.place);
			const favorites = await this.favorites.getFavoriteStatuses(
				userId,
				places.map((p) => p.id),
			);

			const enrichedPlaces = topPlaces.map((tp) => ({
				place: tp.place,
				meta: {
					isFavorite: favorites.includes(tp.placeId),
				},
			}));

			return {
				places: enrichedPlaces,
			};
		});

		return result;
	}
}
