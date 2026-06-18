import { Link } from '@tanstack/react-router';
import { ItemGroup } from '@wanderlust/ui/components/item';
import { PlaceCard } from '@/components/place-card';
import { useFlattenedQuery } from '@/hooks/use-flattened-query';
import { useFavoritesQuery } from './-hooks';

export function List() {
	const query = useFavoritesQuery();
	const flat = useFlattenedQuery(query.data, (page) => page.favorites);

	return (
		<ItemGroup className="gap-2">
			{flat.map((fav) => (
				<Link
					key={fav.id}
					to="/p/$id"
					params={{
						id: fav.placeId,
					}}
				>
					<PlaceCard
						variant="item"
						meta={{
							isFavorite: true,
						}}
						place={fav.place}
						className="hover:bg-muted"
					/>
				</Link>
			))}
		</ItemGroup>
	);
}
