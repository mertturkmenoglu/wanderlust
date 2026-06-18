export function attachFavoriteMetadata<T extends { placeId: string } | { id: string }>(
	items: T[],
	favoriteIds: string[],
): (T & { meta: { isFavorite: boolean } })[] {
	const favoriteSet = new Set(favoriteIds);

	return items.map((item) => ({
		...item,
		meta: {
			isFavorite: favoriteSet.has('placeId' in item ? item.placeId : item.id),
		}
	}));
}
