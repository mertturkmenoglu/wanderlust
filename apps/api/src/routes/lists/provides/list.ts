import { $includes } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { attachFavoriteMetadata } from '@/lib/attach-favorites';
import { invariant } from '@/lib/invariant';
import type { DbOrTx } from '@/lib/transactions';
import { unique } from '@/lib/unique';
import { FavoriteStatusProvider } from '@/routes/favorites/provides/status';
import { canRead } from '../shared/authz';

@injectable()
export class ListProvider {
	constructor(
		@inject(FavoriteStatusProvider)
		private readonly favorites: FavoriteStatusProvider,
	) {}

	async find(opts: { tx: DbOrTx; userId: string; listId: string }) {
		const result = await opts.tx.query.lists.findFirst({
			where: {
				id: opts.listId,
			},
			with: {
				user: {
					columns: {
						id: true,
						username: true,
						name: true,
						image: true,
					},
				},
				items: {
					orderBy: (t, { asc }) => asc(t.index),
					with: {
						place: $includes.place,
					},
				},
			},
		});

		invariant(result, 'NOT_FOUND', `List with ID '${opts.listId}' not found`);

		const hasReadPermission = canRead(result, opts.userId);

		invariant(
			hasReadPermission,
			'FORBIDDEN',
			`You do not have access to list with ID '${opts.listId}'`,
		);

		const placeIds = unique(result.items.map((item) => item.placeId));
		const favoriteIds = await this.favorites.getFavoriteStatuses(
			opts.userId,
			placeIds,
		);

		return {
			list: {
				...result,
				items: attachFavoriteMetadata(result.items, favoriteIds),
			},
		};
	}
}
