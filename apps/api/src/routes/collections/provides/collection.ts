import { $includes } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { attachFavoriteMetadata } from '@/lib/attach-favorites';
import { invariant } from '@/lib/invariant';
import type { DbOrTx } from '@/lib/transactions';
import { unique } from '@/lib/unique';
import { FavoriteStatusProvider } from '@/routes/favorites/provides/status';

@injectable()
export class CollectionProvider {
	constructor(
		@inject(FavoriteStatusProvider)
		private readonly favorites: FavoriteStatusProvider,
	) {}

	public async find({
		tx,
		id,
		userId,
	}: {
		tx: DbOrTx;
		id: string;
		userId: string | null;
	}) {
		const result = await tx.query.collections.findFirst({
			where: {
				id,
			},
			with: {
				items: {
					orderBy: {
						index: 'asc',
					},
					with: {
						place: $includes.place,
					},
				},
			},
		});

		invariant(result, 'NOT_FOUND', `Collection with ID ${id} not found`);

		const placeIds = unique(result.items.map((item) => item.placeId));
		const favoriteIds = await this.favorites.getFavoriteStatuses(
			userId,
			placeIds,
		);

		return {
			collection: {
				...result,
				items: attachFavoriteMetadata(result.items, favoriteIds),
			},
		};
	}
}
