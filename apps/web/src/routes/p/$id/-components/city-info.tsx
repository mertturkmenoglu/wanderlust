import { getRouteApi } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { cn } from '@wanderlust/ui/lib/utils';
import { CollapsibleText } from '@/components/collapsible-text';
import { ipx } from '@/lib/ipx';

type Props = {
	className?: string;
};

export function CityInfo({ className }: Props) {
	const route = getRouteApi('/p/$id/');
	const { place } = route.useLoaderData();

	return (
		<div className={cn(className)}>
			<div className="grid grid-cols-3 gap-8 md:gap-16">
				<div className="col-span-3 md:col-span-1">
					<Image
						src={ipx(place.city.image, 'w_512')}
						alt=""
						className="aspect-video rounded-md object-cover"
						layout="constrained"
						width={512}
						aspectRatio={16 / 9}
					/>
				</div>

				<div className="col-span-3 md:col-span-2">
					<h2 className="font-bold text-4xl">{place.city.name}</h2>
					<div className="mt-2 text-muted-foreground text-sm">
						{place.city.stateName}/{place.city.countryName}
					</div>
					<CollapsibleText text={place.city.description} charLimit={600} />
				</div>
			</div>
		</div>
	);
}
