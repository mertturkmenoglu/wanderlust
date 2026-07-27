import type { Types } from '@wanderlust/common';
import { $includes } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import type { DbOrTx } from '@/lib/transactions';
import { FavoriteStatusProvider } from '@/routes/favorites/provides/status';
import { canRead } from '../internal/authz';

@injectable()
export class TripProvider {
	constructor(
		@inject(FavoriteStatusProvider)
		private readonly favorites: FavoriteStatusProvider,
	) {}

	public async find({
		id,
		userId,
		tx,
	}: {
		id: string;
		userId: string;
		tx: DbOrTx;
	}) {
		const res = await tx.query.trips.findFirst({
			where: {
				id: id,
			},
			with: $includes.trip.with,
		});

		invariant(res, 'NOT_FOUND', `Trip with id ${id} not found`);

		const placeIds = Array.from(
			new Set(res.itineraryItems.map((l) => l.placeId)),
		).filter(Boolean) as string[];

		const favoriteIds = await this.favorites.getFavoriteStatuses(
			userId,
			placeIds,
		);

		const trip: Types.Trips.ExtendedWithParticipantsAndItinerary = {
			...res,
			itineraryItems: res.itineraryItems.map((item) => ({
				...item,
				place: item.place
					? {
							place: item.place,
							meta: {
								isFavorite: favoriteIds.includes(item.place.id),
							},
						}
					: null,
			})),
		};

		invariant(
			canRead(trip, userId),
			'FORBIDDEN',
			'User is not allowed to access this trip',
		);

		return {
			trip,
		};
	}
}
