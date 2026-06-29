import { Separator } from '@wanderlust/ui/components/separator';
import {
	AccoladesBanner,
	CategoriesBanner,
	EventBanner,
	NearbyLocationsBanner,
	TripPlannerCta,
} from '@/components/banner/common';
import { useInterleaveRenderer } from '@/components/interleave-renderer';
import { TagNavigation } from '@/components/tag-navigation';
import { PlaceCatalog } from '@/routes/-components/place-catalog';
import { FeaturedCitiesCatalog } from './featured-cities-catalog';
import { RecentlyViewed } from './recently-viewed';

const listA: React.ReactNode[] = [
	<Separator className="mt-8" />,

	<TagNavigation className="" />,

	<Separator />,

	<FeaturedCitiesCatalog />,

	<PlaceCatalog accessor="featured" />,

	<AccoladesBanner />,

	<CategoriesBanner />,

	<PlaceCatalog accessor="popular" />,

	<TripPlannerCta />,

	<PlaceCatalog accessor="favorites" />,

	<NearbyLocationsBanner />,

	<PlaceCatalog accessor="new" />,

	<EventBanner />,

	<RecentlyViewed />,
];

const listB: React.ReactNode[] = [];

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
