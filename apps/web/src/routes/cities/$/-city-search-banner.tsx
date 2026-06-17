import { Link, useLoaderData } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { OverlayBanner } from '@/components/banner/overlay';
import { useIsMobile } from '@/hooks/use-mobile';

export function CitySearchBanner() {
	const { city } = useLoaderData({ from: '/cities/$/' });
	const isMobile = useIsMobile();

	return (
		<OverlayBanner
			image={city.image}
			alt={`${city.name} image`}
			message={
				<div className="flex items-center gap-4 text-white">
					<div className="text-sm md:text-base">
						Find all places in {city.name}
					</div>
					<Button asChild variant="warning" size={isMobile ? 'sm' : 'default'}>
						<Link
							to="/search"
							search={{
								city: city.name,
							}}
						>
							Browse
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
