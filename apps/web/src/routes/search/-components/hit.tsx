import { PlaceCard } from '@/components/place-card';
import type { TSearchHit } from '@/lib/search';

export type Props = {
	hit: TSearchHit;
};

export function Hit({ hit }: Readonly<Props>) {
	return <PlaceCard variant="item" as="link" place={hit.place} />;
}
