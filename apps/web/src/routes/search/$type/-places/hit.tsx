import type { Hit as THit } from 'instantsearch.js';
import { PlaceCard } from '@/components/place-card';
import type { TSearchHit } from '@/lib/search';

export type Props = {
	hit: THit;
};

export function Hit(props: Readonly<Props>) {
	const hit = props.hit as unknown as TSearchHit;

	return <PlaceCard variant="item" as="link" place={hit.place} />;
}
