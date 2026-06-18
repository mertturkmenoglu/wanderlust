import { CacheService, type TCacheService } from '@wanderlust/cache';
import { inject, injectable } from 'inversify';
import { FavoritesRepository } from '../favorites/repository';
import type * as dto from './dto';
import { AggregatorRepository } from './repository';

@injectable()
export class AggregatorService {
	private readonly ns = 'aggregator';
	private readonly cache: TCacheService;
	private readonly repo: AggregatorRepository;

	constructor(
		@inject(CacheService) cache: CacheService,
		@inject(AggregatorRepository) repo: AggregatorRepository,
		@inject(FavoritesRepository)
		private readonly favoritesRepo: FavoritesRepository,
	) {
		this.cache = cache.get();
		this.repo = repo;
	}

	async home(userId: string | null): Promise<dto.HomeOutput> {
		const result = await this.cache.namespace(this.ns).getOrSet({
			key: 'home',
			ttl: '1h',
			factory: async () => this.repo.home(),
			grace: '1h',
		});

		const ids = Array.from(
			new Set(
				[
					...result.new,
					...result.popular,
					...result.featured,
					...result.favorites,
				].map((place) => place.id),
			),
		);

		const favoriteIds = userId
			? await this.favoritesRepo.getFavoriteStatuses(userId, ids)
			: [];

		const mapWithMeta = (places: dto.HomeOutput['new'][number]['place'][]) => {
			return places.map((place) => ({
				place,
				meta: {
					isFavorite: favoriteIds.includes(place.id),
				},
			}));
		};

		return {
			new: mapWithMeta(result.new),
			popular: mapWithMeta(result.popular),
			featured: mapWithMeta(result.featured),
			favorites: mapWithMeta(result.favorites),
		};
	}
}
