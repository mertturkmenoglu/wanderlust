import type { CacheService } from '@wanderlust/cache';
import { Tokens } from '@wanderlust/common';
import type { Collections } from '@wanderlust/contract';
import { $includes, type DatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { attachFavoriteMetadata } from '@/lib/attach-favorites';
import { getUserId } from '@/lib/get-user-id';
import { unique } from '@/lib/unique';
import { FavoriteStatusProvider } from '@/routes/favorites/provides/status';
import { cacheOptions } from '../internal/cache';
import { os } from '../internal/router';

@injectable()
export class ListCollectionsForPlaceMethod {
	private readonly ns = cacheOptions.namespace;

	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(FavoriteStatusProvider)
		private readonly favorites: FavoriteStatusProvider,
		@inject(Tokens.Cache) private readonly cache: CacheService,
	) {}

	route() {
		return os.places.list.handler(async ({ context, input }) => {
			const userId = getUserId(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string | null,
		data: Collections.dto.PlacesListInput,
	): Promise<Collections.dto.PlacesListOutput> {
		const results = await this.cache.namespace(this.ns).getOrSet({
			key: cacheOptions.keys.forPlace(data.placeId),
			factory: async () => {
				return await this.db.query.collectionsPlaces.findMany({
					where: {
						placeId: data.placeId,
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
			},
			grace: cacheOptions.grace.forPlace,
			ttl: cacheOptions.ttl.forPlace,
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
