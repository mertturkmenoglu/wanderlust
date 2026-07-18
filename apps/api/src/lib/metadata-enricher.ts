/** biome-ignore-all lint/complexity/noStaticOnlyClass: It's fine */
import type { Types } from '@wanderlust/common';

type Meta = Types.Places.Meta;

type WithMeta<T> = {
	place: T;
	meta: Meta;
};

export class MetadataEnricher {
	static enrichPlaces<T extends { id: string }>(
		places: T[],
		favoriteIds: string[],
	): WithMeta<T>[] {
		return places.map((place) => ({
			place,
			meta: {
				isFavorite: favoriteIds.includes(place.id),
			},
		}));
	}
}
