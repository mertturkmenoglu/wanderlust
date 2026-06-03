import { Link } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { Button } from '@wanderlust/ui/components/button';
import { cn } from '@wanderlust/ui/lib/utils';
import { ipx } from '@/lib/ipx';
import { useFeaturedCitiesQuery } from './hooks';

type Props = {
	className?: string;
};

export function FeaturedCitiesCatalog({ className }: Props) {
	const { data: cities } = useFeaturedCitiesQuery();

	return (
		<div className={cn(className)}>
			<div className="flex items-baseline">
				<h2 className="text-lg md:text-2xl">Featured Cities</h2>
				<Button asChild variant="link">
					<Link to="/cities/list">See all</Link>
				</Button>
			</div>

			<div className="mt-2 grid grid-cols-2 gap-4 md:mt-4 md:grid-cols-3 lg:grid-cols-6">
				{cities.cities.map((city) => (
					<Link
						to="/cities/$"
						params={{
							_splat: `${city.id}/${city.name}`,
						}}
						key={city.id}
						className="rounded-md decoration-2 decoration-primary underline-offset-4 hover:underline"
					>
						<Image
							src={ipx(city.image, 'w_512')}
							layout="constrained"
							width={512}
							priority={true}
							aspectRatio={16 / 9}
							className="aspect-video w-full rounded-md object-cover"
						/>
						<div className="mt-2 text-sm md:text-base">{city.name}</div>
					</Link>
				))}
			</div>
		</div>
	);
}
