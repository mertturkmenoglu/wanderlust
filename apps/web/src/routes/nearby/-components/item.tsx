import type { GeoHit } from 'instantsearch.js';
import { PlaceCard } from '@/components/place-card';

type Props = {
	item: GeoHit<GeoHit>;
};

export function ItemComponent({ item }: Props) {
	return (
		<PlaceCard
			as="link"
			place={item.place}
			variant="item"
			className="block text-left"
		/>
	);
}
