import {
	CategoriesBanner,
	EventBanner,
	NearbyLocationsBanner,
	TripPlannerBanner,
	TripPlannerCta,
} from '@/components/banner/common';
import { useInterleaveRenderer } from '@/components/interleave-renderer';
import { PlaceCatalog } from '@/routes/-components/place-catalog';
import { FeaturedCitiesCatalog } from './featured-cities-catalog';

const listA: React.ReactNode[] = [
	<FeaturedCitiesCatalog />,

	<CategoriesBanner />,

	<TripPlannerCta />,

	<NearbyLocationsBanner />,

	<TripPlannerBanner />,

	<EventBanner />,
];

const listB: React.ReactNode[] = [
	null,

	<PlaceCatalog accessor="featured" />,

	<PlaceCatalog accessor="popular" />,

	<PlaceCatalog accessor="favorites" />,

	<PlaceCatalog accessor="new" />,
];

export function Content() {
	const ilr = useInterleaveRenderer();

	return (
		<ilr.Renderer
			listA={listA}
			listB={listB}
			className="flex flex-col gap-4 md:gap-8"
		/>
	);
}
