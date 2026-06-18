import { cn } from '@wanderlust/ui/lib/utils';
import { PlaceCard } from '@/components/place-card';
import { useHomeAggregationsQuery, usePlaceCatalogTitle } from './hooks';
import type { PlaceCatalogProps } from './types';

export function PlaceCatalog({ className, accessor }: PlaceCatalogProps) {
	const query = useHomeAggregationsQuery();
	const data = query.data[accessor];
	const title = usePlaceCatalogTitle(accessor);
	const sliced = data.slice(0, 6);
	const isEmpty = sliced.length === 0;

	return (
		<div className={cn(className)}>
			<h2 className="text-accent-foreground text-lg tracking-tighter md:text-2xl">
				{title}
			</h2>

			<div className="mt-2 grid grid-cols-1 gap-4 md:mt-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
				{isEmpty && <div>No data available.</div>}
				{!isEmpty &&
					sliced.map((item) => (
						<PlaceCard
							key={item.place.id}
							place={item.place}
							meta={item.meta}
							as="link"
						/>
					))}
			</div>
		</div>
	);
}
