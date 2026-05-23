import { Link } from '@tanstack/react-router';
import { PlaceCard } from '@/components/place-card';
import type { Outputs } from '@/lib/orpc';

type Props = {
	dataKey: 'new' | 'popular' | 'featured' | 'favorite';
	data: Outputs['places']['get']['place'][];
};

function getTitle(type: Props['dataKey']) {
	switch (type) {
		case 'new':
			return 'New Places';
		case 'popular':
			return 'Popular Places';
		case 'featured':
			return 'Featured Places';
		case 'favorite':
			return 'Favorite Places';
		default:
			return '';
	}
}

export function PlacesGrid({ dataKey: key, data }: Props) {
	const title = getTitle(key);
	const sliced = data.slice(0, 6);
	const isEmpty = sliced.length === 0;

	return (
		<div className="mx-auto mt-4 md:mt-8">
			<h2 className="text-accent-foreground text-lg tracking-tighter md:text-2xl">
				{title}
			</h2>

			<div className="mt-2 grid grid-cols-1 gap-4 md:mt-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
				{isEmpty && <div>No data available.</div>}
				{!isEmpty &&
					data.slice(0, 6).map((place) => (
						<Link key={place.id} to="/p/$id" params={{ id: place.id }}>
							<PlaceCard place={place} />
						</Link>
					))}
			</div>
		</div>
	);
}
