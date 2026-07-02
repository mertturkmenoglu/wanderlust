import { PlaceCard } from '@/components/place-card';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePlaceQuery } from './hooks';

export function PlaceInfo() {
	const query = usePlaceQuery();
	const place = query.data.place;
	const meta = query.data.meta;

	const isMobile = useIsMobile();

	return (
		<div>
			<PlaceCard
				place={place}
				meta={meta}
				className="h-fit"
				variant={isMobile ? 'item' : 'default'}
			/>
		</div>
	);
}
