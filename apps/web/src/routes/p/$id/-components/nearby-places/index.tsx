import { cn } from '@wanderlust/ui/lib/utils';
import { PlaceCard } from '@/components/place-card';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { useNearbyPlaces } from './hooks';
import type { Props } from './types';

export function NearbyPlaces(props: Props) {
	return (
		<SuspenseWrapper placeholderVariant="spinner">
			<Content {...props} />
		</SuspenseWrapper>
	);
}

function Content({ className }: Props) {
	const query = useNearbyPlaces();
	const places = query.data.hits.slice(0, 5).map(({ document: p }) => ({
		...p.place,
		name: p.name,
		totalVotes: 0,
		totalPoints: 0,
		assets: p.place.assets.map((a) => ({
			...a,
			createdAt: new Date(a.createdAt),
			updatedAt: new Date(a.updatedAt),
		})),
	}));

	return (
		<div className={cn(className)}>
			<h3 className="font-semibold text-xl tracking-tight">Nearby Locations</h3>
			<div className="my-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
				{places.map((p) => (
					<PlaceCard as="link" key={p.id} place={p} />
				))}
			</div>
		</div>
	);
}
