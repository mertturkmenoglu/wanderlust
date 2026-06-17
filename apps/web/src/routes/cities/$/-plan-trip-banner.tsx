import { Link, useLoaderData } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { MapIcon } from 'lucide-react';
import { OverlayBanner } from '@/components/banner/overlay';
import { useIsMobile } from '@/hooks/use-mobile';

export function PlanTripBanner() {
	const { city } = useLoaderData({ from: '/cities/$/' });
	const isMobile = useIsMobile();

	return (
		<OverlayBanner
			image="https://images.unsplash.com/photo-1491895200222-0fc4a4c35e18"
			alt="Cities Banner Image"
			message={
				<div className="flex items-center gap-4 text-white">
					<div className="text-sm md:text-base">Plan a trip to {city.name}</div>
					<Button
						asChild
						variant="outline"
						size={isMobile ? 'sm' : 'default'}
						className="bg-white text-midnight"
					>
						<Link to="/trips/planner">
							<MapIcon />
							{isMobile ? 'Start' : 'Start Planning'}
						</Link>
					</Button>
				</div>
			}
			classNames={{
				root: 'my-8',
				image: 'aspect-[3]',
				messageContainer: 'bg-black/60',
			}}
		/>
	);
}
