import {
	CategoriesBanner,
	EventBanner,
	NearbyLocationsBanner,
	TripPlannerBanner,
	TripPlannerCta,
} from '@/components/banner/common';
import { PlaceCatalog } from '@/routes/-components/place-catalog';
import { FeaturedCitiesCatalog } from './featured-cities-catalog';

export function Content() {
	return (
		<div className="flex flex-col gap-4 md:gap-8">
			<FeaturedCitiesCatalog />

			<CategoriesBanner />

			<PlaceCatalog accessor="featured" />

			<TripPlannerCta />

			<PlaceCatalog accessor="popular" />

			<NearbyLocationsBanner />

			<PlaceCatalog accessor="favorites" />

			<TripPlannerBanner />

			<PlaceCatalog accessor="new" />

			<EventBanner />
		</div>
	);
}
