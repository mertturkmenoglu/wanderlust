import { Link } from '@tanstack/react-router';
import type { GeoHit } from 'instantsearch.js';
import { PlaceCard } from '@/components/place-card';

type Props = {
	item: GeoHit<GeoHit>;
};

export function ItemComponent({ item }: Props) {
	return (
		<Link
			to="/p/$id"
			className="block text-left"
			params={{
				id: item.place.id,
			}}
		>
			<PlaceCard place={item.place} variant="item" />
		</Link>
	);
}
