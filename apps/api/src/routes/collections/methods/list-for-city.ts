import { Tokens } from '@wanderlust/common';
import type { Collections } from '@wanderlust/contract';
import { $includes, type DatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { attachFavoriteMetadata } from '@/lib/attach-favorites';
import { getUserId } from '@/lib/get-user-id';
import { unique } from '@/lib/unique';
import { FavoriteStatusProvider } from '@/routes/favorites/provides/status';
import { os } from '../shared/router';

@injectable()
export class ListCollectionsForCityMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(FavoriteStatusProvider)
		private readonly favorites: FavoriteStatusProvider,
	) {}

	route() {
		return os.cities.list.handler(async ({ context, input }) => {
			const userId = getUserId(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string | null,
		data: Collections.dto.CitiesListInput,
	): Promise<Collections.dto.CitiesListOutput> {
		const results = await this.db.query.collectionsCities.findMany({
			where: {
				cityId: data.cityId,
			},
			with: {
				collection: {
					with: {
						items: {
							with: {
								place: $includes.place,
							},
						},
					},
				},
			},
		});

		const placeIds = results.flatMap((r) =>
			r.collection.items.map((i) => i.placeId),
		);
		const uniquePlaceIds = unique(placeIds);
		const favoriteIds = await this.favorites.getFavoriteStatuses(
			userId,
			uniquePlaceIds,
		);

		const collections = results.map((r) => ({
			...r.collection,
			items: attachFavoriteMetadata(r.collection.items, favoriteIds),
		}));

		return {
			collections,
		};
	}
}
