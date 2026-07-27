import type { Types } from '@wanderlust/common';
import { $includes } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import type { DbOrTx } from '@/lib/transactions';
import { FavoriteStatusProvider } from '@/routes/favorites/provides/status';

@injectable()
export class ItineraryProvider {
	constructor(
		@inject(FavoriteStatusProvider)
		private readonly favorites: FavoriteStatusProvider,
	) {}

	public async find({
		tx,
		itineraryItemId,
		userId,
	}: {
		tx: DbOrTx;
		itineraryItemId: string;
		userId: string;
	}) {
		const item = await tx.query.itineraryItems.findFirst({
			where: {
				id: itineraryItemId,
			},
			with: {
				place: $includes.place,
			},
		});

		invariant(
			item,
			'NOT_FOUND',
			`Itinerary item with id ${itineraryItemId} not found`,
		);

		if (item.placeId && item.place) {
			const favoriteIds = await this.favorites.getFavoriteStatuses(userId, [
				item.placeId,
			]);

			return {
				...item,
				place: {
					place: item.place,
					meta: {
						isFavorite: favoriteIds.includes(item.placeId),
					},
				},
			} satisfies Types.Trips.ItineraryItemExtended;
		}

		return item;
	}
}
