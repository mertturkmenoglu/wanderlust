import { ORPCError } from '@orpc/server';
import type { CacheService } from '@wanderlust/cache';
import { Tokens } from '@wanderlust/common';
import type { Aggregator } from '@wanderlust/contract';
import type { DatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { getUserId } from '@/lib/get-user-id';
import { MetadataEnricher } from '@/lib/metadata-enricher';
import { unique } from '@/lib/unique';
import { FavoriteStatusProvider } from '@/routes/favorites/provides/status';
import { cacheOptions } from '../shared/cache';
import { os } from '../shared/router';
import {
	findFavoritePlaces,
	findFeaturedPlaces,
	findNewPlaces,
	findPopularPlaces,
} from '../shared/statements';

@injectable()
export class AggregateHomeMethod {
	private readonly ns = 'aggregator';

	constructor(
		@inject(Tokens.Cache) private readonly cache: CacheService,
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(FavoriteStatusProvider)
		private readonly favorites: FavoriteStatusProvider,
	) {}

	route() {
		return os.home.handler(async ({ context }) => {
			const userId = getUserId(context);
			const result = await this.execute(userId);

			return result;
		});
	}

	private async execute(userId: string | null) {
		const result = await this.cache.namespace(this.ns).getOrSet({
			key: cacheOptions.keys.home,
			ttl: cacheOptions.ttl.home,
			factory: async () => this.findAll(),
			grace: cacheOptions.grace.home,
		});

		return this.enrich(userId, result);
	}

	private async findAll() {
		const promises = await Promise.allSettled([
			findFeaturedPlaces.execute(this.db, {}),
			findPopularPlaces.execute(this.db, {}),
			findNewPlaces.execute(this.db, {}),
			findFavoritePlaces.execute(this.db, {}),
		]);

		if (promises.some((p) => p.status === 'rejected')) {
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to fetch aggregated data',
			});
		}

		return {
			featured: promises[0].status === 'fulfilled' ? promises[0].value : [],
			popular: promises[1].status === 'fulfilled' ? promises[1].value : [],
			new: promises[2].status === 'fulfilled' ? promises[2].value : [],
			favorites: promises[3].status === 'fulfilled' ? promises[3].value : [],
		};
	}

	private async enrich(
		userId: string | null,
		result: {
			new: Aggregator.dto.Place[];
			popular: Aggregator.dto.Place[];
			featured: Aggregator.dto.Place[];
			favorites: Aggregator.dto.Place[];
		},
	): Promise<Aggregator.dto.HomeOutput> {
		const ids = unique(
			[
				...result.new,
				...result.popular,
				...result.featured,
				...result.favorites,
			].map((place) => place.id),
		);

		const favoriteIds = await this.favorites.getFavoriteStatuses(userId, ids);

		return {
			new: MetadataEnricher.enrichPlaces(result.new, favoriteIds),
			popular: MetadataEnricher.enrichPlaces(result.popular, favoriteIds),
			featured: MetadataEnricher.enrichPlaces(result.featured, favoriteIds),
			favorites: MetadataEnricher.enrichPlaces(result.favorites, favoriteIds),
		};
	}
}
