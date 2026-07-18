import type { Types } from '@wanderlust/common';
import { inject, injectable } from 'inversify';
import { MetadataEnricher } from '@/lib/metadata-enricher';
import { TraceAll } from '@/lib/tracer';
import { FavoritesRepository } from '../favorites/repository';

@injectable()
@TraceAll()
export class AccoladesEnricher {
	constructor(
		@inject(FavoritesRepository)
		private readonly favoritesRepo: FavoritesRepository,
	) {}

	async enrichPlaces(userId: string | null, places: Types.Places.Extended[]) {
		const favorites = await this.favoritesRepo.getFavoriteStatuses(
			userId,
			places.map((p) => p.id),
		);

		return MetadataEnricher.enrichPlaces(places, favorites);
	}
}
