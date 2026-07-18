import type { Aggregator } from '@wanderlust/contract';
import { inject, injectable } from 'inversify';
import { MetadataEnricher } from '@/lib/metadata-enricher';
import { TraceAll } from '@/lib/tracer';
import { unique } from '@/lib/unique';
import { FavoritesRepository } from '../favorites/repository';

@injectable()
@TraceAll()
export class AggregatorEnricher {
	constructor(
		@inject(FavoritesRepository)
		private readonly favoritesRepo: FavoritesRepository,
	) {}

	async enrichPlaces(
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

		const favoriteIds = await this.favoritesRepo.getFavoriteStatuses(
			userId,
			ids,
		);

		return {
			new: MetadataEnricher.enrichPlaces(result.new, favoriteIds),
			popular: MetadataEnricher.enrichPlaces(result.popular, favoriteIds),
			featured: MetadataEnricher.enrichPlaces(result.featured, favoriteIds),
			favorites: MetadataEnricher.enrichPlaces(result.favorites, favoriteIds),
		};
	}
}
