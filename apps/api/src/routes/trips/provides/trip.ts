import { $includes } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { attachFavoriteMetadata } from '@/lib/attach-favorites';
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

		const placeIds = Array.from(new Set(res.locations.map((l) => l.placeId)));

		const favoriteIds = await this.favorites.getFavoriteStatuses(
			userId,
			placeIds,
		);

		const trip = {
			...res,
			locations: attachFavoriteMetadata(res.locations, favoriteIds),
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
