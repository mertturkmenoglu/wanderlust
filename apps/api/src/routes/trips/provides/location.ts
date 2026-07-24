import { $includes } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import type { DbOrTx } from '@/lib/transactions';
import { FavoriteStatusProvider } from '@/routes/favorites/provides/status';

@injectable()
export class LocationProvider {
	constructor(
		@inject(FavoriteStatusProvider)
		private readonly favorites: FavoriteStatusProvider,
	) {}

	public async find({
		tx,
		locationId,
		userId,
	}: {
		tx: DbOrTx;
		locationId: string;
		userId: string;
	}) {
		const location = await tx.query.tripLocations.findFirst({
			where: {
				id: locationId,
			},
			with: {
				place: $includes.place,
			},
		});

		invariant(
			location,
			'NOT_FOUND',
			`Location with id ${locationId} not found`,
		);

		const favoriteIds = await this.favorites.getFavoriteStatuses(userId, [
			location.placeId,
		]);

		return {
			...location,
			meta: {
				isFavorite: favoriteIds.includes(location.placeId),
			},
		};
	}
}
